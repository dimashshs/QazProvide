import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";

const Footer = () => {
  return (
    <div className="bg-[#171f16] text-white">
      <div className="flex flex-col justify-center items-center px-5 py-16">
        <div className="text-center">
          <Link to="/">
            <div className={styles.logoContainer}>
              <img
                src="https://i.postimg.cc/dVMZyP4L/qazprovide-logo.png"
                alt="QazProvide Logo"
                className={styles.logoSize}
              />
              <span className={styles.logoText}>QazProvide</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="text-center text-gray-400 text-sm pb-8">
        <span>© 2024. Все права защищены.</span>
      </div>
    </div>
  );
};

export default Footer;
