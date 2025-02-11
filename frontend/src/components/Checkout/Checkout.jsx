import React, { useState } from "react";
import styles from "../../styles/styles";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [originalPrice, setoriginalPrice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const paymentSubmit = () => {
    if (address === "" || zipCode === null || country === "" || city === "") {
      toast.error("Пожалуйста, выберите адрес доставки!");
    } else {
      const shippingAddress = {
        address,
        zipCode,
        country,
        city,
      };

      const orderData = {
        cart,
        totalPrice,
        subTotalPrice,
        shipping,
        originalPrice,
        shippingAddress,
        user,
      };

      // обновляем локальное хранилище с обновленным массивом заказов
      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.originalPrice,
    0
  );

  // это переменная стоимости доставки
  const shipping = subTotalPrice * 0.1; // 10%

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;

    await axios.get(`${server}/coupon/get-coupon-value/${name}`).then((res) => {
      const shopId = res.data.couponCode?.shopId;

      const couponCodeValue = res.data.couponCode?.value;

      if (res.data.couponCode !== null) {
        const isCouponValid =
          cart && cart.filter((item) => item.shopId === shopId);

        if (isCouponValid.length === 0) {
          toast.error("Купон не действителен для этого магазина");
          setCouponCode("");
        } else {
          const eligiblePrice = isCouponValid.reduce(
            (acc, item) => acc + item.qty * item.originalPrice,
            0
          );
          const originalPrice = (eligiblePrice * couponCodeValue) / 100;
          setoriginalPrice(originalPrice);
          setCouponCodeData(res.data.couponCode);
          setCouponCode("");
        }
      }
      if (res.data.couponCode === null) {
        toast.error("Купона не существует!");
        setCouponCode("");
      }
    });
  };

  const discountPercentenge = couponCodeData ? originalPrice : "";

  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountPercentenge).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2);

  console.log(discountPercentenge);

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            user={user}
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address={address}
            setAddress={setAddress}
            zipCode={zipCode}
            setZipCode={setZipCode}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentenge={discountPercentenge}
          />
        </div>
      </div>
      <div
        className={`${styles.button} w-[150px] 800px:w-[280px] mt-10 flex items-center justify-center`}
        onClick={paymentSubmit}
      >
        <h5 className="text-white">Перейти к оплате</h5>
      </div>
    </div>
  );
};

const translations = {
  AKM: "Акмолинская область",
  ALM: "Алматинская область",
  AKT: "Актюбинская область",
  AST: "Астана",
  ALA: "Алматы",
  ATY: "Атырауская область",
  BAY: "Байконур",
  YUZ: "Туркестанская область",
  ZAP: "Западно-Казахстанская область",
  KAR: "Карагандинская область",
  KUS: "Костанайская область",
  KZY: "Кызылординская область",
  MAN: "Мангистауская область",
  PAV: "Павлодарская область",
  NUR: "Нур-Султан",
  ZHA: "Жамбылская область",
  VOS: "Восточно-Казахстанская область",
  SEV: "Северо-Казахстанская область",
  SHY: "Шымкент",
};

const ShippingInfo = ({
  user,
  country,
  setCountry,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address,
  setAddress,
  zipCode,
  setZipCode,
}) => {
  useEffect(() => {
    setCountry("KZ"); // ISO код Казахстана
  }, [setCountry]);
  return (
    <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
      <h5 className="text-[18px] font-[500]">Адрес доставки</h5>
      <br />
      <form>
        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Полное имя</label>
            <input
              type="text"
              value={user && user.name}
              required
              className={`${styles.input} !w-[95%] border-[2px]`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Электронная почта</label>
            <input
              type="email"
              value={user && user.email}
              required
              className={`${styles.input}`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Телефонный номер</label>
            <input
              type="number"
              required
              value={user && user.phoneNumber}
              className={`${styles.input} !w-[95%]`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Почтовый индекс</label>
            <input
              type="number"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              className={`${styles.input}`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Город</label>
            <select
              className="w-[95%] border h-[40px] rounded-[5px]"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option className="block pb-2" value="">
                Выберите город
              </option>
              {State &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {translations[item.isoCode] || item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Адрес</label>
            <input
              type="address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`${styles.input} !w-[95%]`}
            />
          </div>
        </div>
      </form>
      <h5
        className="text-[18px] cursor-pointer inline-block"
        onClick={() => setUserInfo(!userInfo)}
      >
        Выберите из сохраненных адресов
      </h5>
      {userInfo && user && user.addresses && user.addresses.length > 0 && (
        <div>
          {user.addresses.map((item, index) => (
            <div key={index} className="w-full flex mt-1">
              <input
                type="checkbox"
                className="mr-3"
                checked={address === item.address}
                onChange={() => {
                  setAddress(item.address);
                  setZipCode(item.zipCode);
                  setCountry(item.country);
                  setCity(item.city);
                }}
              />
              <label>{item.addressType}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentenge,
}) => {
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Итого:</h3>
        <h5 className="text-[18px] font-[600]">{subTotalPrice}₸</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Доставка:</h3>
        <h5 className="text-[18px] font-[600]">{shipping.toFixed(2)}₸</h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Скидка:</h3>
        <h5 className="text-[18px] font-[600]">
          - {discountPercentenge ? discountPercentenge.toString() + "₸" : null}
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">{totalPrice}₸</h5>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className={`${styles.input} h-[40px] pl-2`}
          placeholder="Купон"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          required
        />
        <input
          className={`w-[150px] 800px:w-[180px]  flex items-center justify-center bg-[#f06e9f] h-[50px] my-3 rounded-xl cursor-pointer text-white font-bold`}
          required
          value="Применить"
          type="submit"
        />
      </form>
    </div>
  );
};

export default Checkout;
