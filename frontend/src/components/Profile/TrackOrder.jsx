import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";

// Отслеживание заказа
const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch]);

  const data = orders && orders.find((item) => item._id === id);

  return (
    <div className="w-full h-[80vh] flex justify-center items-center">
      <>
        {data && data?.status === "Обработка" ? (
          <h1 className="text-[20px]">Ваш заказ обрабатывается в магазине.</h1>
        ) : data?.status === "Передано партнеру по доставке" ? (
          <h1 className="text-[20px]">
            Ваш заказ передан партнеру по доставке.
          </h1>
        ) : data?.status === "Отправка" ? (
          <h1 className="text-[20px]">
            Ваш заказ в пути с нашим партнером по доставке.
          </h1>
        ) : data?.status === "Получено" ? (
          <h1 className="text-[20px]">
            Ваш заказ в вашем городе. Наш курьер доставит его.
          </h1>
        ) : data?.status === "В пути" ? (
          <h1 className="text-[20px]">Наш курьер доставляет ваш заказ.</h1>
        ) : data?.status === "Доставлено" ? (
          <h1 className="text-[20px]">Ваш заказ доставлен!</h1>
        ) : data?.status === "Processing refund" ? (
          <h1 className="text-[20px]">Ваш возврат обрабатывается!</h1>
        ) : data?.status === "Refund Success" ? (
          <h1 className="text-[20px]">Ваш возврат успешен!</h1>
        ) : null}
      </>
    </div>
  );
};

export default TrackOrder;
