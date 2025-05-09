import React from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Lottie from "react-lottie";
import animationData from "../Assests/animations/Animation - 1716199141413.json";

const OrderSuccessPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <Success />
            </div>
            <Footer />
        </div>
    );
};

const Success = () => {
    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <div className="text-center">
            <h5 className="text-center text-[25px] text-[#000000a1] flex items-center justify-center">
                Ваш заказ оплачен
                <Lottie options={defaultOptions} width={50} height={50} />
            </h5>
        </div>
    );
};

export default OrderSuccessPage;