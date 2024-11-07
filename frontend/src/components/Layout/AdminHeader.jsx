import React from "react";
import { MdOutlineLocalOffer } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CiMoneyBill } from "react-icons/ci";
import { GrWorkshop } from "react-icons/gr";
import { backend_url } from "../../server";
import styles from "../../styles/styles";


const AdminHeader = () => {
  const { user } = useSelector((state) => state.user);

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
                {/* Apply styles.logoText here */}
                <span className={styles.logoTextShop}>QazProvide</span>
              </div>
            </Link>
          </div>
     </div>
  );
};

export default AdminHeader;
