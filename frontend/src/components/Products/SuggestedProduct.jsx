import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";

const SuggestedProduct = ({ data }) => {
    const [products, setProducts] = useState([]);
    const { allProducts } = useSelector((state) => state.products);
    const [productData, setProductData] = useState();

    useEffect(() => {
        const d = allProducts && allProducts.filter((i) => i.category === data.category);
        setProductData(d);
    }, [allProducts, data.category]);

    return (
        <div>
            {data ? (
                <div className={`p-4 ${styles.section}`}>
                    <h2 className={`${styles.heading} text-[25px] font-[500] border-b mb-5`}>
                        Похожие продукты
                    </h2>
                    <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
                        {productData && productData.map((i, index) => (
                            <Link to={`/product/${i._id}`} key={index}>
                                <ProductCard data={i} />
                            </Link>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default SuggestedProduct;
