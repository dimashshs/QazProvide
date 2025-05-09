import React, { useEffect, useState } from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { backend_url, server } from "../../../server";
import styles from "../../../styles/styles";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  const [shopName, setShopName] = useState("");

  useEffect(() => {
    if (seller && seller._id) {
      axios.get(`${server}/shop/get-shop-info/${seller._id}`)
        .then((res) => {
          setShopName(res.data.shop.name);
        })
        .catch((error) => {
          console.error("Error fetching shop info:", error);
        });
    }
  }, [seller]);

  return (
    <div className="w-full h-[80px] bg-[rgb(0,128,0)] shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div>
        <Link to="/">
          <div className={styles.logoContainer}>
            <img
              src="https://i.postimg.cc/dVMZyP4L/qazprovide-logo.png"
              alt=""
              className={styles.logoSizeShop}
            />
            <span className={styles.logoTextShop}>QazProvide</span>
          </div>
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Link to="/dashboard-products" className="800px:block hidden">
            <FiPackage
              color="#fff"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/dashboard-orders" className="800px:block hidden">
            <FiShoppingBag color="#fff" size={30} className="mx-5 cursor-pointer" />
          </Link>
          <Link to="/dashboard-messages" className="800px:block hidden">
            <BiMessageSquareDetail
              color="#fff"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to={`/shop/${seller._id}`}>
          <span className={"mr-6 text-1.2xl text-white 800px:block hidden"}>{shopName || "Shop name"}</span>
          </Link>
          <Link to={`/shop/${seller._id}`}>
            <img
              src={`${backend_url}${seller.avatar}`}
              alt=""
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
