import React from 'react'
import styles from '../../styles/styles'

const CheckoutSteps = ({ active }) => {
    console.log(active);
    return (
        <div className='w-full flex justify-center'>
            <div className="w-[90%] 800px:w-[50%] flex items-center flex-wrap">
                <div className={`${styles.normalFlex}`}>
                    <div className={`${styles.cart_button}`}>
                        <span className={`${styles.cart_button_text}`}>1. Доставка</span>
                    </div>
                    <div className={`${active > 1 ? "w-[30px] 800px:w-[70px] h-[4px] !bg-[#f5e1bd]"
                            : "w-[30px] 800px:w-[70px] h-[4px] !bg-[#f5e1bd]"
                        }`} />
                </div>

                <div className={`${styles.normalFlex}`}>
                    <div className={`${active > 1 ? `${styles.cart_button}` : `${styles.cart_button} !bg-[#f5e1bd]`}`}>
                        <span className={`${active > 1 ? `${styles.cart_button_text}` : `${styles.cart_button_text} !text-[#ffa136]`}`}>
                            2. Оплата
                        </span>
                    </div>
                </div>

                <div className={`${styles.normalFlex}`}>
                    <div className={`${active > 3 ? "w-[30px] 800px:w-[70px] h-[4px] !bg-[#f63b60]"
                            : "w-[30px] 800px:w-[70px] h-[4px] !bg-[#f5e1bd]"
                        }`} />
                    <div className={`${active > 2 ? `${styles.cart_button}` : `${styles.cart_button} !bg-[#f5e1bd]`}`}>
                        <span className={`${active > 2 ? `${styles.cart_button_text}` : `${styles.cart_button_text} !text-[#ffa136]`}`}>
                            3. Готово
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutSteps
