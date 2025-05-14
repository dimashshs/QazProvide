const express = require("express");
const path = require("path");
const User = require("../model/user");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const sendMail = require("../utils/sendMail");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userEmail = await User.findOne({ email });
    if (userEmail) {
      // Если пользователь существует — ошибка
      return next(new ErrorHandler("Пользователь уже существует", 400));
    }

    let fileUrl = null;
    if (req.file) {
      fileUrl = req.file.filename;
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar: fileUrl,
    });

    // Отправляем сразу успешный ответ, без активации
    res.status(201).json({
      success: true,
      message: "Аккаунт успешно создан!",
      user,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});


// login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Пожалуйста, заполните все поля", 400));
      }
      const user = await User.findOne({ email }).select("+password");
      // +пароль используется для выбора поля пароля из базы данных

      if (!user) {
        return next(new ErrorHandler("Пользователь не существует", 400));
      }

      // сравниваем пароль с паролем базы данных
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Пожалуйста, предоставьте правильную информацию", 400)
        );
      }
      res.status(200).json({
        success: true,
         message: "Успешный вход",
         user,
    });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load user
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("Пользователь не существует", 400));
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out user
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.status(201).json({
        success: true,
        message: "Вы успешно вышли!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user info
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, name } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler(
            "Пожалуйста, предоставьте правильную информацию",
            400
          )
        );
      }

      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user avatar
router.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const existsUser = await User.findById(req.user.id);

      const existAvatarPath = `uploads/${existsUser.avatar}`;

      fs.unlinkSync(existAvatarPath); // Удоляет предыдущее изображение

      const fileUrl = path.join(req.file.filename); // Создает новое изображение

      const user = await User.findByIdAndUpdate(req.user.id, {
        avatar: fileUrl,
      });

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user addresses
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      const sameTypeAddress = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );
      if (sameTypeAddress) {
        return next(
          new ErrorHandler(
            `${req.body.addressType} такая учетная запись уже существует`
          )
        );
      }

      const existsAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );

      if (existsAddress) {
        Object.assign(existsAddress, req.body);
      } else {
        user.addresses.push(req.body);
      }

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete user address
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      await User.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } }
      );

      const user = await User.findById(userId);

      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user password
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");

      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Старый пароль неверен!", 400));
      }

        if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          new ErrorHandler("Пароли не совпадают друг с другом!", 400)
        );
      }
      user.password = req.body.newPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message: "Пароль успешно обновлен!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// находим информацию о пользователе по идентификатору пользователя
router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all users --- for admin
router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete users --- admin
router.delete(
  "/delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(
          new ErrorHandler("Пользователь недоступен с этим ID", 400)
        );
      }

      await User.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Пользователь успешно удален!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;


