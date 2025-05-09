import React, { useEffect, useState } from "react";
import styles from "../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { useNavigate, useParams} from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { backend_url, server } from "../server";
import { RxCross1 } from "react-icons/rx";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { useDispatch, useSelector } from "react-redux";
import { AiFillStar, AiOutlineMessage, AiOutlineStar } from "react-icons/ai";

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const data = orders && orders.find((item) => item._id === id);

  const reviewHandler = async (type) => {
    try {
      const endpoint =
        type === "product"
          ? "/product/create-new-review"
          : "/event/create-new-review-event";

      const res = await axios.put(
        `${server}${endpoint}`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true }
      );

      toast.success(res.data.message);
      dispatch(getAllOrdersOfUser(user._id));
      setComment("");
      setRating(null);
      setOpen(false);
    } catch (error) {
      console.error(error); // Логирование ошибки в консоль для отладки
      toast.error("Произошла ошибка. Пожалуйста, попробуйте еще раз."); // Отображение общего сообщения об ошибке
    }
  };

  const combinedHandler = async () => {
    if (rating > 1) {
      await reviewHandler("product");
    }
  };

  // Возврат
  const refundHandler = async () => {
    await axios
      .put(`${server}/order/order-refund/${id}`, {
        status: "Processing refund",
      })
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.cart[0].shopId; // Assuming all items in the cart are from the same shop
      
      // Fetch all conversations for the user
      const userConversationsResponse = await axios.get(
        `${server}/conversation/get-all-conversation-user/${userId}`,
        { withCredentials: true }
      );
  
      const userConversations = userConversationsResponse.data.conversations;
      
      // Check if a conversation with this seller already exists
      let existingConversation = userConversations.find(conversation => 
        conversation.members.includes(sellerId)
      );
  
      if (existingConversation) {
        // Navigate to the existing conversation
        navigate(`/inbox?${existingConversation._id}`);
      } else {
        // Create a new conversation if it doesn't exist
        await axios
          .post(`${server}/conversation/create-new-conversation`, {
            groupTitle,
            userId,
            sellerId,
          })
          .then((res) => {
            navigate(`/inbox?${res.data.conversation._id}`);
          })
          .catch((error) => {
            toast.error(error.response.data.message);
          });
      }
    } else {
      toast.error("Пожалуйста, войдите в систему для создания разговора");
    }
  };
  

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w=full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Детали заказа</h1>
        </div>
      </div>

      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000084]">
          ID заказа: <span>#{data?._id?.slice(0, 8)}</span>
        </h5>
        <h5 className="text-[#000000084]">
          Размещено: <span>{data?.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      {/* Товары заказа */}
      <br />
      <br />
      {data &&
        data?.cart.map((item, index) => {
          return (
            <div className="w-full flex items-start mb-5">
              <img
                src={`${backend_url}/${item.images[0]}`}
                alt="Product item order img"
                className="w-[80x] h-[80px]"
              />
              <div className="w-full">
                <h5 className="pl-3 text-[20px]">{item.name}</h5>
                <h5 className="pl-3 text-[20px] text-[#00000091]">
                  {item.originalPrice}₸ x {item.qty}
                </h5>
              </div>
              {!item.isReviewed && data?.status === "Доставлено" ? (
                <div
                  className={`${styles.button} text-[#fff]`}
                  onClick={() => setOpen(true) || setSelectedItem(item)}
                >
                  Написать отзыв
                </div>
              ) : null}
            </div>
          );
        })}

      {/* Всплывающее окно для отзыва */}
      {open && (
        <div className="w-full  top-0 left-0 h-screen bg-[#0005] z-50 flex items-center justify-center">
          <div className="w-[50%] h-min bg-[#fff] shadow rounded-md p-3 ">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            </div>
            <h2 className="text-[30px] font-[500] font-Poppins text-center">
              Оставить отзыв
            </h2>
            <br />
            <div className="w-full flex">
              <img
                src={`${backend_url}/${selectedItem?.images[0]}`}
                alt=""
                className="w-[80px] h-[80px]"
              />
              <div>
                <div className="pl-3 text-[20px]">{selectedItem?.name}</div>
                <h4 className="pl-3 text-[20px]">
                  {selectedItem?.originalPrice}₸ x {selectedItem?.qty}
                </h4>
              </div>
            </div>

            <br />
            <br />

            {/* Рейтинг */}
            <h5 className="pl-3 text-[20px] font-[500]">
              Поставьте оценку <span className="text-red-500">*</span>
            </h5>
            <div className="flex w-fit ml-2 pt-1">
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                  <AiFillStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                ) : (
                  <AiOutlineStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                )
              )}
            </div>
            <br />
            {/* Комментарий */}
            <div className="w-full ml-3">
              <label className="block text-[20px] font-[500]">
                Напишите комментарий
                <span className="ml-1 font-[400] text-[16px] text-[#00000052]">
                  (Опционально)
                </span>
              </label>
              <textarea
                name="comment"
                id=""
                cols="20"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Как вам товар? Напишите свои впечатления о нем!"
                className="mt-2 w-[95%] border p-2 outline-none"
              ></textarea>
            </div>
            <div
              className={`${styles.button} text-white text-[20px] ml-3`}
              onClick={rating > 1 ? combinedHandler : null}
            >
              Отправить
            </div>
          </div>
        </div>
      )}

      <div className="border-t w-full text-right">
        <h5>
          Общая цена: <strong>₸{data?.totalPrice}</strong>
        </h5>
      </div>
      <br />
      <br />

      {/* Адрес доставки */}

      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-3 text-[20px] font-[600]">Адрес доставки:</h4>

          <h4 className="pt-3 text-[20px]">{data?.shippingAddress.address}</h4>
          <h4 className=" text-[20px]">{data?.shippingAddress.city}</h4>

          <h4 className=" text-[20px]">{data?.user?.phoneNumber}</h4>
        </div>

        <div className="w-full 800px:w-[40%]">
          <h4 className="pt-3 text-[20px]">Информация об оплате:</h4>
          <h4>
            Статус:{" "}
            {/* Проверка, существует ли свойство `status` в объекте `paymentInfo` */}
            {data?.paymentInfo?.status
              ? data?.paymentInfo?.status
              : "Не оплачено"}
          </h4>
          <br />

        </div>
      </div>
      <br />

      <div
        className={`${styles.button} bg-[#6443d1] mt-4 !rounded !h-11`}
        onClick={handleMessageSubmit}
      >
        <span className="text-white flex items-center">
          Отправить сообщение <AiOutlineMessage className="ml-1" />
        </span>
      </div>
      <br />
      <br />
    </div>
  );
};

export default UserOrderDetails;
