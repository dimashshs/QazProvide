import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { backend_url, server } from "../../server";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "./Ratings";
import axios from "axios";

const ProductDetails = ({ data }) => {
  const { products } = useSelector((state) => state.products);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllProductsShop(data && data?.shop._id));
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [data, wishlist]);

  const handleCountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(value) && parseInt(value) >= 1)) {
      setCount(value);
    }
  };
  
  const incrementCount = () => {
    setCount(prevCount => (prevCount === '' ? 1 : parseInt(prevCount) + 1));
  };
  
  const decrementCount = () => {
    setCount(prevCount => {
      if (prevCount === '' || parseInt(prevCount) <= 1) {
        return 1;
      } else {
        return parseInt(prevCount) - 1;
      }
    });
  };

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);

    if (isItemExists) {
      toast.error("Товар уже в корзине!");
    } else {
      if (data.stock < 1) {
        toast.error("Ограниченный запас товара!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Товар успешно добавлен в корзину!");
      }
    }
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const avg = totalRatings / totalReviewsLength || 0;
  const averageRating = avg.toFixed(2);

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shopId;

      const userConversationsResponse = await axios.get(
        `${server}/conversation/get-all-conversation-user/${userId}`,
        { withCredentials: true }
      );

      const userConversations = userConversationsResponse.data.conversations;

      let existingConversation = userConversations.find((conversation) =>
        conversation.members.includes(sellerId)
      );

      if (existingConversation) {
        navigate(`/inbox?${existingConversation._id}`);
      } else {
        await axios
          .post(`${server}/conversation/create-new-conversation`, {
            groupTitle,
            userId,
            sellerId,
          })
          .then((res) => {
            navigate(`/inbox?${res.data.conversation._id}`);
          })
          .catch((error) => {
            toast.error(error.response.data.message);
          });
      }
    } else {
      toast.error("Пожалуйста, войдите в систему для создания разговора");
    }
  };

  return (
    <div className="bg-white">
      {data ? (
        <div className={`${styles.section} w-[90%] 800px:w-[80%] `}>
          <div className="w-full py-5">
            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img
                  src={`${backend_url}${data && data.images[select]}`}
                  alt=""
                  className="w-[80%] h-[450px] object-cover"
                />
                <div className="w-full flex">
                  {data &&
                    data.images.map((i, index) => (
                      <div
                        className={`${
                          select === index ? "border" : "null"
                        } cursor-pointer`}
                        key={index}
                      >
                        <img
                          src={`${backend_url}${i}`}
                          alt=""
                          className="h-[100px] w-[100px] object-cover"
                          onClick={() => setSelect(index)}
                        />
                      </div>
                    ))}
                </div>
              </div>
              <div className="w-full 800px:w-[50%] pt-5 ">
                <h1 className={`${styles.productTitle}`}>{data.name}</h1>
                <p>{data.description}</p>
                <div className="flex pt-3">
                  <h4 className={`${styles.productoriginalPrice}`}>
                    {data.originalPrice}₸
                  </h4>
                  <h3 className={`${styles.price}`}>{data.unit}</h3>
                </div>

                <div className="flex items-center mt-12 justify-between pr-3">
                  <div className="flex items-center">
                    <button
                      className="bg-green-500 text-white font-bold px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out rounded-l"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="w-[50px] bg-gray-200 text-gray-800 font-medium px-4 py-2 text-center"
                      value={count}
                      onChange={handleCountChange}
                      min="1"
                    />
                    <button
                      className="bg-green-500 text-white font-bold px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out rounded-r"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>

                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => removeFromWishlistHandler(data)}
                        color={click ? "red" : "#333"}
                        title="Удалить из списка желаемого"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => addToWishlistHandler(data)}
                        title="Добавить в список желаемого"
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`${styles.button} !mt-6 !rounded !h-11 flex items-center`}
                  onClick={() => addToCartHandler(data._id)}
                >
                  <span className="text-white flex items-center">
                  В корзину{" "}
                  <AiOutlineShoppingCart className="ml-2" />
                  </span>
                </div>
                <div className="flex items-center pt-8">
                  <Link to={`/shop/preview/${data?.shop._id}`}>
                    <img
                      src={`${backend_url}${data?.shop?.avatar}`}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2"
                    />
                  </Link>

                  <div className="pr-8">
                    <Link to={`/shop/preview/${data?.shop._id}`}>
                      <h3
                        className={`${styles.shop_name} pb-1 pt-1 cursor-pointer`}
                      >
                        {data.shop.name}
                      </h3>
                    </Link>
                    <h5 className="pb-3 text-[15px]">
                      ({averageRating}/5) Рейтинг
                    </h5>
                  </div>

                  <div
                    className={`${styles.button} !mt-6 !rounded !h-11 flex items-center`}
                    onClick={handleMessageSubmit}
                  >
                    <span className="text-white flex items-center">
                      Сообщение{" "} 
                      <AiOutlineMessage className="ml-2" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ProductDetailsInfo
            data={data}
            products={products}
            totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
          />
          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
};

const ProductDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);

  const { seller } = useSelector((state) => state.seller);

  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(1)}
          >
            Детали продукта
          </h5>
          {active === 1 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>

        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(2)}
          >
            Отзывы о продукте
          </h5>
          {active === 2 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>

        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(3)}
          >
            Информация о продавце
          </h5>
          {active === 3 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
      </div>

      {active === 1 ? (
        <>
          <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line  ">
            {data.description}
          </p>
        </>
      ) : null}

      {active === 2 ? (
        <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll">
          {data &&
            data.reviews.map((item, index) => (
              <div className="w-full flex my-2" key={index}>
                <img
                  src={`${backend_url}/${item.user.avatar}`}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full"
                />
                <div className="pl-2 ">
                  <div className="w-full flex items-center">
                    <h1 className="font-[500] mr-3">{item.user.name}</h1>
                    <Ratings rating={item.rating} />
                  </div>
                  <p>{item.comment}</p>
                </div>
              </div>
            ))}

          <div className="w-full flex justify-center">
            {data && data.reviews.length === 0 && (
              <h5>Отзывов на этот продукт нет!</h5>
            )}
          </div>
        </div>
      ) : null}

      {active === 3 ? (
        <>
          <div className="w-full block 800px:flex p-5 ">
            <div className="w-full 800px:w-[50%]">
              <div className="flex items-center">
                <Link to={`/shop/preview/${data.shop._id}`}>
                  <div className="flex items-center">
                    <img
                      src={`${backend_url}${data?.shop?.avatar}`}
                      className="w-[50px] h-[50px] rounded-full"
                      alt=""
                    />
                    <div className="pl-3">
                      <h3 className={`${styles.shop_name}`}>
                        {data.shop.name}
                      </h3>
                      <h5 className="pb-3 text-[15px]">
                        ({averageRating}/5) Рейтинг
                      </h5>
                    </div>
                  </div>
                </Link>
              </div>

              <p className="pt-2">{data.shop.description}</p>
            </div>

            <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
              <div className="text-left">
                <h5 className="font-[600]">
                  Присоединился:{" "}
                  <span className="font-[500]">
                    {data.shop?.createdAt?.slice(0, 10)}
                  </span>
                </h5>
                <h5 className="font-[600] pt-3">
                  Всего продуктов:{" "}
                  <span className="font-[500]">
                    {products && products.length}
                  </span>
                </h5>
                <h5 className="font-[600] pt-3">
                  Всего отзывов:{" "}
                  <span className="font-[500]">{totalReviewsLength}</span>
                </h5>
                <Link to={`/shop/preview/${data.shop._id}`}>
                  <div
                    className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}
                  >
                    <h4 className="text-white">Посетить магазин</h4>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ProductDetails;
