import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets/frontend_assets/assets";
import { Star } from "lucide-react";

const ProductItem = ({
  id,
  image,
  name,
  price,
  averageRating,
  reviewLength,
}) => {
  const { currency } = useContext(ShopContext);
  return (
    <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer ">
      <div className="overflow-hidden ">
        <img
          className="hover:scale-110 transition rounded-lg ease-in-out"
          src={image[0]}
          alt={name}
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium text-[#FF725C]">
        {currency}
        {price}
      </p>
      <div className="flex gap-2">
        <Star
          fill={averageRating > 0 ? "#FF725C" : "none"}
          className="w-4 text-[#FF725C]"
        />
        <p>
          {Math.round(averageRating)} ({reviewLength} Review)
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
