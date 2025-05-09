import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { backend_url, server } from "../../server";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { useDispatch, useSelector } from "react-redux";

const OrderDetails = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

  const data = orders && orders.find((item) => item._id === id);

  const orderUpdateHandler = async (e) => {
    await axios
      .put(
        `${server}/order/update-order-status/${id}`,
        {
          status,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Заказ обновлен!");
        navigate("/dashboard-orders");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const refundOrderUpdateHandler = async (e) => {
    await axios
      .put(
        `${server}/order/order-refund-success/${id}`,
        {
          status,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Заказ обновлен!");
        dispatch(getAllOrdersOfShop(seller._id));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w=full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="orange" />
          <h1 className="pl-2 text-[25px]">Детали заказа</h1>
        </div>
        <Link to="/dashboard-orders">
          <div
            className={`${styles.button} !bg-[#f78f19] !rounded-[4px] text-[#ffffff] font-[600] !h-[45px] text-[18px]`}
          >
            Список заказов
          </div>
        </Link>
      </div>

      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000084]">
          ID заказа: <span>#{data?._id?.slice(0, 8)}</span>
        </h5>
        <h5 className="text-[#000000084]">
          Размещен: <span>{data?.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      {/* Товары заказа */}
      <br />
      <br />
      {data &&
        data?.cart.map((item, index) => (
          <div className="w-full flex items-start mb-5">
            <img
              src={`${backend_url}/${item.images[0]}`}
              alt="Product item order img"
              className="w-[80x] h-[80px]"
            />
            <div className="w-full">
              <h5 className="pl-3 text-[20px]">{item.name}</h5>
              <h5 className="pl-3 text-[20px] text-[#00000091]">
                ₸{item.originalPrice} x {item.qty}
              </h5>
            </div>
          </div>
        ))}
      <div className="border-t w-full text-right">
        <h5>
          Общая стоимость: <strong>{data?.totalPrice} ₸</strong>
        </h5>
      </div>
      <br />
      <br />

      {/* Адрес доставки */}

      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-3 text-[20px] font-[600]">Адрес доставки:</h4>

          <h4 className="pt-3 text-[20px]">
            {data?.shippingAddress.address}
          </h4>
          <h4 className=" text-[20px]">{data?.shippingAddress.city}</h4>

          <h4 className=" text-[20px]">{data?.user?.phoneNumber}</h4>
        </div>

        <div className="w-full 800px:w-[40%]">
          <h4 className="pt-3 text-[20px]">Информация об оплате:</h4>
          <h4>
            Статус:{" "}
            {/* Условное выражение, которое проверяет, существует ли свойство `status` в объекте `paymentInfo` внутри объекта `data`. */}
            {data?.paymentInfo?.status
              ? data?.paymentInfo?.status
              : "Не оплачено"}
          </h4>
        </div>
      </div>
      <br />
      <br />

      <h4 className="pt-3 text-[20px] font-[600]">Статус заказа:</h4>
      {data?.status !== "Processing refund" &&
        data?.status !== "Refund Success" && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
          >
            {[
              "Обработка",
              "Передано партнеру по доставке",
              "Отправка",
              "Получено",
              "В пути",
              "Доставлено",
            ]
              .slice(
                [
                  "Обработка",
                  "Передано партнеру по доставке",
                  "Отправка",
                  "Получено",
                  "В пути",
                  "Доставлено",
                ].indexOf(data?.status)
              )
              .map((option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              ))}
          </select>
        )}

      {data?.status === "Processing refund" ||
      data?.status === "Refund Success" ? (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
        >
          {["Processing refund", "Refund Success"]
            .slice(
              ["Processing refund", "Refund Success"].indexOf(data?.status)
            )
            .map((option, index) => (
              <option value={option} key={index}>
                {option}
              </option>
            ))}
        </select>
      ) : null}

      <div
        className={`${styles.button} mt-5 !bg-[#f78f19] !rounded-[4px] text-[#fff] font-[600] !h-[45px] text-[18px]`}
        onClick={
          data?.status !== "Processing refund"
            ? orderUpdateHandler
            : refundOrderUpdateHandler
        }
      >
        Обновить статус
      </div>
    </div>
  );
};

export default OrderDetails;
