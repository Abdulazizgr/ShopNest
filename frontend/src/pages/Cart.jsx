import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { CartTotal, Title } from "../components";
import { assets } from "../assets/assets/frontend_assets/assets";
import { toast } from "react-toastify";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleProceedToCheckout = () => {
    setIsLoading(true);
    if (cartData.length === 0) {
      toast.error("Your cart is empty!");
      setIsLoading(false);
      return;
    }
    setTimeout(() => {
      setIsLoading(false);
      navigate("/place-order");
    }, 1000);
  };
  useEffect(() => {
    const tempData = [];
    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        if (cartItems[productId][size] > 0) {
          tempData.push({
            _id: productId,
            size: size,
            quantity: cartItems[productId][size],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>
      <div>
        {cartData.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10">
            <img
              src={assets.empty}
              alt="No Products Found"
              className="w-1/2  md:w-1/5"
            />
            <p className="text-gray-500 mt-4 text-center">
              <b>No product</b> <br /> found in your cart.
            </p>
          </div>
        )}
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img
                  src={productData.image[0]}
                  className="w-16 sm:w-20"
                  alt={productData.name}
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium ">
                    {productData.name}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {productData.price}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>
              <input
                onChange={(e) =>
                  e.target.value === "" || e.target.value === "0"
                    ? null
                    : updateQuantity(
                        item._id,
                        item.size,
                        Number(e.target.value)
                      )
                }
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                type="number"
                min="1"
                defaultValue={item.quantity}
              />
              <img
                src={assets.bin_icon}
                alt="Remove item"
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                onClick={() => updateQuantity(item._id, item.size, 0)}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            {/* <button
              onClick={handleProceedToCheckout}
              className="bg-black text-white text-sm my-8 px-8 py-3"
            >
              PROCEED TO CHECKOUT
            </button> */}
            <button
              onClick={handleProceedToCheckout}
              type="submit"
              disabled={isLoading}
              className={`text-white text-sm  ${
                isLoading ? "bg-gray-500 my-8" : "bg-[#FF725C] my-8 px-8 py-3  "
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2  px-8 py-3">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Loading...
                </span>
              ) : (
                "  PROCEED TO CHECKOUT"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
