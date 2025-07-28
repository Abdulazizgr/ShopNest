import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const RelatedProducts = ({ category, subCategory, productId }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productCopy = products.slice();
      productCopy = productCopy.filter(
        (product) =>
          product.category === category && product.subCategory === subCategory
      );
      productCopy = productCopy.filter((product) => product._id !== productId);
      setRelated(productCopy.slice(0, 5));
    }
  }, [products]);

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>
      {related.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {related.map((product, index) => (
            <ProductItem
              key={index}
              id={product._id}
              name={product.name}
              price={product.price}
              image={product.image}
              averageRating={product.averageRating}
              reviewLength={product.reviews.length}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-gray-500">
          No related products found.
        </p>
      )}
    </div>
  );
};

export default RelatedProducts;
