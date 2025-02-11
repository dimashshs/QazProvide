import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../../styles/styles'

// Function to generate navItems based on isSeller
const getNavItems = (isSeller) => [
  {
    title: "Главное",
    url: "/",
  },
  {
    title: "Самые продаваемые продукты",
    url: "/best-selling",
  },
  {
    title: "Все продукты",
    url: "/products",
  },
  /*{
    title: "FAQ",
    url: "/faq",
  },*/
  {
    title: isSeller ? "Панель управления" : "Стать продавцом",
    url: isSeller ? "/dashboard" : "/shop-create",
  },
];

const Navbar = ({ active, isSeller }) => {
  const navItems = getNavItems(isSeller);

  return (
    <div className={`block 800px:${styles.normalFlex}`}>
      {navItems.map((i, index) => (
        <div className='flex' key={index}>
          <Link 
            to={i.url}
            className={`${active === index + 1 ? "text-[#c8ff00]" : "text-black 800px:text-[#fff]"} pb-[30px] 800px:pb-0 font-[500] px-6 cursor-pointer`}
          >
            {i.title}
          </Link>
        </div>
      ))}
    </div>
  )
}

export default Navbar
