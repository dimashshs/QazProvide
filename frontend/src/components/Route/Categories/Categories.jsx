import React from 'react' 
import { useNavigate } from "react-router-dom"; 
import {categoriesData } from "../../../static/data"; 
import styles from '../../../styles/styles' 
 
const Categories = () => { 
    const navigate = useNavigate(); 
    return ( 
        <> 
            <div className={`${styles.section} bg-white p-6 rounded-lg mb-12 m-4`} id="categories"> 
                <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px]"> 
                    {categoriesData && categoriesData.map((i) => { 
                        const handleSubmit = (i) => { 
                            navigate(`/products?category=${i.title}`); 
                        } 
                        return ( 
                            <div 
                                className="w-full h-[100px] flex flex-col items-center justify-center cursor-pointer overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg" 
                                key={i.id} 
                                onClick={() => handleSubmit(i)} 
                            > 
                                <img 
                                    src={i.image_Url} 
                                    className="w-[90px] h-[900px mb-2" 
                                    alt="category" 
                                /> 
                                <h5 className="text-[18px] leading-[1.3] text-center">{i.title}</h5> 
                            </div> 
                        ) 
                    })} 
                </div> 
            </div> 
        </> 
    ) 
} 
 
export default Categories;