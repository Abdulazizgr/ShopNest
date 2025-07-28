import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets/frontend_assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import axios from "axios";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl, token } =
    useContext(ShopContext);

  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [reviewsDescription, setReviewsDescription] = useState("Description");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const fetchProductData = () => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/review`,
        { comment, rating, productId },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Review submitted successfully!");
        fetchProductData();
      } else {
        toast.error(response.data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setTimeout(() => {
        setIsSubmittingReview(false);
        setShowAddReview(false);
        setComment("");
        setRating(0);
      }, 1000);
    }
  };

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex gap-12 flex-col sm:flex-row">
        {/* Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:w-[18.7%] w-full">
            {productData.image.map((img, index) => (
              <img
                key={index}
                onClick={() => setImage(img)}
                src={img}
                alt={`Product ${index + 1}`}
                className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer ${
                  image === img ? "border-2 border-[#FF725C]" : ""
                }`}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} alt="Selected" className="w-full h-auto" />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {productData.averageRating > 0 && (
              <>
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={
                      i < Math.round(productData.averageRating)
                        ? assets.star_icon
                        : assets.star_dull_icon
                    }
                    alt="Star"
                    className="w-3.5"
                  />
                ))}{" "}
                ({productData.reviews.length})
              </>
            )}
            {productData.averageRating === 0 && (
              <>
                <img src={assets.star_dull_icon} alt="Star" className="w-3.5" />
                <img src={assets.star_dull_icon} alt="Star" className="w-3.5" />
                <img src={assets.star_dull_icon} alt="Star" className="w-3.5" />
                <img src={assets.star_dull_icon} alt="Star" className="w-3.5" />
                <img
                  src={assets.star_dull_icon}
                  alt="Star"
                  className="w-3.5"
                />{" "}
                ({productData.reviews.length})
              </>
            )}
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.shortDescription}
          </p>

          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size ? "border-orange-500" : ""
                  }`}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              if (!size) {
                toast.error("Please select a size first!");
                return;
              }
              setIsAddingToCart(true);
              try {
                await addToCart(productData._id, size);
              } catch (err) {
                console.error(err);
                toast.error("Failed to add to cart.");
              } finally {
                setTimeout(() => {
                  setIsAddingToCart(false);
                }, 1000);
              }
            }}
            disabled={isAddingToCart}
            className={`text-white  text-sm ${
              isAddingToCart
                ? "bg-gray-500"
                : "bg-[#FF725C] hover:bg-[#FF5A3D] px-8 py-3"
            }`}
          >
            {isAddingToCart ? (
              <span className="flex items-center justify-center gap-2 px-8 py-3">
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
                Adding...
              </span>
            ) : (
              "ADD TO CART"
            )}
          </button>

          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery available.</p>
            <p>Easy return & exchange within 7 days</p>
          </div>
        </div>
      </div>

      {/* Description & Reviews */}
      <div className="mt-20">
        <div className="flex">
          <b
            onClick={() => setReviewsDescription("Description")}
            className={`cursor-pointer border px-5 py-3 text-sm ${
              reviewsDescription === "Description"
                ? "bg-gray-100 border-[#FF725C]"
                : ""
            }`}
          >
            Description
          </b>
          <p
            onClick={() => setReviewsDescription("Reviews")}
            className={`cursor-pointer border px-5 py-3 text-sm ${
              reviewsDescription === "Reviews"
                ? "bg-gray-100 border-[#FF725C]"
                : ""
            }`}
          >
            Reviews ({productData.reviews.length})
          </p>
        </div>

        {reviewsDescription === "Description" ? (
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
            <p>{productData.shortDescription}</p>
            <p>{productData.detailDescription}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Customer Reviews</h3>
              <button
                onClick={() => setShowAddReview(true)}
                className="text-sm text-white bg-[#FF725C] px-4 py-2 rounded"
              >
                Add Review
              </button>
            </div>

            {productData.reviews.length > 0 ? (
              (showAllReviews
                ? productData.reviews
                : productData.reviews.slice(0, 3)
              ).map((rev, idx) => (
                <div key={idx} className="border-b pb-4 mb-4">
                  <div className="flex gap-4 mb-2">
                    <img
                      src={assets.profile}
                      alt="profile"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex flex-col gap-1">
                      {rev.user}
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, s) => (
                          <img
                            key={s}
                            src={
                              s < rev.rating
                                ? assets.star_icon
                                : assets.star_dull_icon
                            }
                            alt="Star"
                            className="w-3.5"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{rev.comment}</p>
                  <span className="text-gray-600 text-sm">
                    {new Date(rev.date).toDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center mt-10">
                <img
                  src={assets.empty}
                  alt="No Products Found"
                  className="w-1/2 md:w-1/3"
                />
                <p className="text-gray-500 mt-4 text-center">
                  <b>No Reviews </b> <br /> Be the first to review this product.
                </p>
              </div>
            )}

            {productData.reviews.length > 3 && (
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="text-blue-600 text-sm mt-2 self-start"
              >
                {showAllReviews ? "Show less reviews" : "See more reviews"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Review Modal */}
      {showAddReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 max-w-xs sm:max-w-md relative">
            <button
              onClick={() => setShowAddReview(false)}
              className="absolute top-2 right-2 text-gray-500"
            >
              ✖
            </button>
            <h3 className="text-lg font-semibold mb-4">Add Your Review</h3>
            <form onSubmit={onSubmitHandle} className="flex flex-col gap-3">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                placeholder="Write your review..."
                className="border p-2 rounded resize-none"
              />
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                required
                className="border p-2 rounded"
              >
                <option value="">Select rating</option>
                <option value="5" className="text-[#FF532E]">
                  5 ★★★★★
                </option>
                <option value="4" className="text-[#FF532E]">
                  4 ★★★★☆
                </option>
                <option value="3" className="text-[#FF532E]">
                  3 ★★★☆☆
                </option>
                <option value="2" className="text-[#FF532E]">
                  2 ★★☆☆☆
                </option>
                <option value="1" className="text-[#FF532E]">
                  1 ★☆☆☆☆
                </option>
              </select>
              <button
                type="submit"
                disabled={isSubmittingReview}
                className={`bg-black text-white py-2 rounded ${
                  isSubmittingReview ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
        productId={productData._id}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
