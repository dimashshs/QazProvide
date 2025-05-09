import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { useSelector } from "react-redux";

const Hero = () => {
  const { isSeller } = useSelector((state) => state.seller);
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat bg-cover
             bg-center ${styles.normalFlex}`}
      style={{
        backgroundImage:
          "url(https://i.postimg.cc/rmC3dqwG/image-43-remini-enhanced.jpg)",
      }}
    >
      <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
        <h1
          className={`text-[35px] leading-[1.2] 800px:text-[60px] text-[#000000] font-[600]`}
        >
          Свежесть и качество  <br /> из первых рук!
        </h1>
        <p className="pt-5 text-[17px]  font-[400] text-[#000000ba]">
        Мы помогаем быстро находить качественные 
        продукты, а также поддерживаем <br/> местных
        производителей, предоставляя им эффективный маркетинговый канал. {" "}
          <br /> Присоединяйтесь к нам и откройте двери в мир свежих отечественных продуктов!
        </p>
        {/* Become a Seller */}
        <Link to="/products" className="inline-block">
            <div className={`${styles.button} mt-5`}>
                 <span className="text-[#fff]  text-[18px] font-bold">
                 Начать покупки
                 </span>
            </div>
        </Link>
        {/* Become a Seller end */}
      </div>
    </div>
  );
};

export default Hero;
