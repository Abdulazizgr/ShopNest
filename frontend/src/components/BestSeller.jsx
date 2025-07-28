import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import Title from "./Title";
import { Link } from "react-router-dom";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    const bestProducts = products.filter((product) => product.bestSeller);
    setBestSellers(bestProducts.slice(0, 5));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1="BEST" text2="SELLERS" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Shop our top selling products, loved by customers for their quality
          and style. Find out why these items are fan favorites!
        </p>
      </div>
      {/* Rendering Products  */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestSellers.map((product, index) => (
          <ProductItem
            key={index}
            id={product._id}
            image={product.image}
            name={product.name}
            price={product.price}
            averageRating={product.averageRating}
            reviewLength={product.reviews.length}
          />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Link to="/collection">
          <button className="border border-[#FF725C] px-8 py-4 text-sm hover:bg-[#FF725C] hover:text-white transition-all duration-500">
            View All Best Sellers
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BestSeller;
