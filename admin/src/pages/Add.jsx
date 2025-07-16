import React, { useState } from "react";
import { assets } from "../assets/admin_assets/assets";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestSeller", bestSeller);

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);
      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setName("");
        setDescription("");
        setPrice("");
        setCategory("Men");
        setSubCategory("Topwear");
        setSizes([]);
        setBestSeller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3 "
    >
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          <label
            className="cursor-pointer border-2 border-dashed border-300 rounded-md  "
            htmlFor="image1"
          >
            <img
              className={`${image1 ? "w-20" : "w-[93px]"}`}
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
              alt="Upload Area"
            />
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>
          <label
            className="cursor-pointer border-2 border-dashed border-gray-300 rounded-md  "
            htmlFor="image2"
          >
            <img
              className={`${image2 ? "w-20" : "w-[93px]"}`}
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
              alt="Upload Area"
            />
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              hidden
            />
          </label>
          <label
            className="cursor-pointer border-2 border-dashed border-gray-300 rounded-md  "
            htmlFor="image3"
          >
            <img
              className={`${image3 ? "w-20" : "w-[93px]"}`}
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
              alt="Upload Area"
            />
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              hidden
            />
          </label>
          <label
            className="cursor-pointer border-2 border-dashed border-gray-300 rounded-md  "
            htmlFor="image4"
          >
            <img
              className={`${image4 ? "w-20" : "w-[93px]"}`}
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
              alt="Upload Area"
            />
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>
      </div>
      <div className="w-full ">
        <p className="mb-2">Product Name</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Enter product name"
          required
        />
      </div>
      <div className="w-full ">
        <p className="mb-2">Product Description</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Write product description"
          required
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div className="w-full sm:w-40">
          <p className="mb-2">Product Category</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full  px-3 py-2"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div className="w-full sm:w-40 ">
          <p className="mb-2">Sub Category</p>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full  px-3 py-2"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Product Price</p>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full sm:w-[120px] px-3 py-2"
            type="number"
            placeholder=" 25"
            required
          />
        </div>
      </div>

      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("S")
                  ? prev.filter((size) => size !== "S")
                  : [...prev, "S"]
              )
            }
          >
            <p
              className={` px-3 py-1 cursor-pointer ${
                sizes.includes("S") ? "bg-pink-100" : "bg-slate-200"
              }`}
            >
              S
            </p>
          </div>
          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("M")
                  ? prev.filter((size) => size !== "M")
                  : [...prev, "M"]
              )
            }
          >
            <p
              className={` px-3 py-1 cursor-pointer ${
                sizes.includes("M") ? "bg-pink-100" : "bg-slate-200"
              }`}
            >
              M
            </p>{" "}
          </div>
          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("L")
                  ? prev.filter((size) => size !== "L")
                  : [...prev, "L"]
              )
            }
          >
            <p
              className={`bg-slate-200 px-3 py-1 cursor-pointer ${
                sizes.includes("L") ? "bg-pink-100" : "bg-slate-200"
              }`}
            >
              L
            </p>
          </div>
          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("XL")
                  ? prev.filter((size) => size !== "XL")
                  : [...prev, "XL"]
              )
            }
          >
            <p
              className={`bg-slate-200 px-3 py-1 cursor-pointer ${
                sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200"
              }`}
            >
              XL
            </p>
          </div>
          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("XXL")
                  ? prev.filter((size) => size !== "XXL")
                  : [...prev, "XXL"]
              )
            }
          >
            <p
              className={`bg-slate-200 px-3 py-1 cursor-pointer ${
                sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-200"
              }`}
            >
              XXL
            </p>
          </div>
        </div>
      </div>

      <div className="flex mt-2 gap-2">
        <input
          onChange={() => setBestSeller((prev) => !prev)}
          checked={bestSeller}
          className="cursor-pointer"
          type="checkbox"
          id="bestSeller"
        />
        <label className="cursor-pointer" htmlFor="bestSeller">
          Add to BestSeller
        </label>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

export default Add;
