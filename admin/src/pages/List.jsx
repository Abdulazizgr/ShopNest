import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message || "Failed to fetch products");
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.message || "An error occurred while fetching products");
    }
  };

  const removeProduct = async (productId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        {
          productId,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchProducts();
      } else {
        toast.error(response.data.message || "Failed to remove product");
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error(error.message || "An error occurred while removing product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <p className="mb-2">All Products List</p>

      <div className="flex flex-col gap-2">
        {/* ................ List table Title ................ */}

        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-200 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>
        {/* ................ Product List ................ */}
        {list.map((product, index) => (
          <Link key={index} to={`/edit/${product._id}`}>
            <div
              className={`grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm ${
                index % 2 !== 0 ? "bg-gray-200" : ""
              }`}
              key={index}
            >
              <img
                className="w-12"
                src={product.image[0]}
                alt="PRODUCT image"
              />
              <p>{product.name}</p>
              <p>{product.category}</p>
              <p>
                {currency}
                {product.price}
              </p>
              <p
                onClick={() => removeProduct(product._id)}
                className="text-right md:text-center cursor-pointer text-lg"
              >
                X
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default List;
