import React, { useState, useEffect } from "react";
import { assets } from "../assets/admin_assets/assets";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const Product = ({ token }) => {
  const { productId } = useParams();

  // State
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [detailDescription, setDetailDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("T-Shirts & Shirts");
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch product data on mount
  const fetchProduct = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/product/details`, {
        productId,
      });
      if (response.data.success) {
        const product = response.data.product;
        setImage1(product.image[0]);
        setImage2(product.image[1]);
        setImage3(product.image[2]);
        setImage4(product.image[3]);
        setName(product.name);
        setShortDescription(product.shortDescription);
        setDetailDescription(product.detailDescription);
        setPrice(product.price);
        setCategory(product.category);
        setSubCategory(product.subCategory);
        setSizes(product.sizes || []);
        setBestSeller(product.bestSeller);
      } else {
        toast.error(response.data.message || "Failed to fetch product");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Error fetching product");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  // Handle update
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("name", name);
      formData.append("shortDescription", shortDescription);
      formData.append("detailDescription", detailDescription);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestSeller", bestSeller);

      // Only upload new files (if user selected)
      if (image1 && typeof image1 !== "string")
        image1 && formData.append("image1", image1);
      if (image2 && typeof image2 !== "string")
        image2 && formData.append("image2", image2);
      if (image3 && typeof image3 !== "string")
        image3 && formData.append("image3", image3);
      if (image4 && typeof image4 !== "string")
        image4 && formData.append("image4", image4);
      console.log(formData);
      const response = await axios.post(
        `${backendUrl}/api/product/update`,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Product updated successfully!");
      } else {
        toast.error(response.data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("An error occurred while updating product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-4"
    >
      {/* Image upload */}
      <div>
        <p className="mb-2">Upload Images</p>
        <div className="flex gap-2">
          {[
            { img: image1, set: setImage1, id: "image1" },
            { img: image2, set: setImage2, id: "image2" },
            { img: image3, set: setImage3, id: "image3" },
            { img: image4, set: setImage4, id: "image4" },
          ].map(({ img, set, id }) => (
            <label
              key={id}
              htmlFor={id}
              className="cursor-pointer border-2 border-dashed border-gray-300 rounded-md"
            >
              <img
                className="w-20 h-20 object-cover"
                src={
                  img
                    ? typeof img === "string"
                      ? img
                      : URL.createObjectURL(img)
                    : assets.upload_area
                }
                alt="Upload"
              />
              <input
                type="file"
                id={id}
                hidden
                onChange={(e) => set(e.target.files[0])}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2 border rounded"
          type="text"
          placeholder="Enter product name"
          required
        />
      </div>

      {/* Short Description */}
      <div className="w-full">
        <p className="mb-2">Short Description</p>
        <textarea
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2 border rounded"
          maxLength={150}
          required
          placeholder="Write short description"
        />
      </div>

      {/* Detail Description */}
      <div className="w-full">
        <p className="mb-2">Detail Description</p>
        <textarea
          value={detailDescription}
          onChange={(e) => setDetailDescription(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2 border rounded"
          rows={5}
          required
          placeholder="Write detailed description"
        />
      </div>

      {/* Category, Subcategory, Price */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div className="w-full sm:w-40">
          <p className="mb-2">Category</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div className="w-full sm:w-40">
          <p className="mb-2">Subcategory</p>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="T-Shirts & Shirts">T-Shirts & Shirts</option>
            <option value="Hoodies & Sweatshirts">Hoodies & Sweatshirts</option>
            <option value="Jackets & Coats">Jackets & Coats</option>
            <option value="Pants & Jeans">Pants & Jeans</option>
            <option value="Shorts">Shorts</option>
            <option value="Dresses & Skirts">Dresses & Skirts</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Price</p>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full sm:w-[120px] px-3 py-2 border rounded"
            type="number"
            placeholder="25"
            required
          />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="mb-2">Sizes</p>
        <div className="flex gap-2">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <p
              key={size}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((s) => s !== size)
                    : [...prev, size]
                )
              }
              className={`px-3 py-1 border rounded cursor-pointer ${
                sizes.includes(size) ? "bg-pink-100" : "bg-gray-200"
              }`}
            >
              {size}
            </p>
          ))}
        </div>
      </div>

      {/* BestSeller */}
      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          checked={bestSeller}
          onChange={() => setBestSeller((prev) => !prev)}
        />
        <label>Add to BestSeller</label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-32 py-3 mt-4 rounded text-white ${
          isLoading ? "bg-gray-500" : "bg-black hover:bg-gray-800"
        }`}
      >
        {isLoading ? "Updating..." : "Update Product"}
      </button>
    </form>
  );
};

export default Product;
