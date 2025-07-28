import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const NewsletterBox = () => {
  const [email, setEmail] = useState("");
  const { backendUrl } = useContext(ShopContext);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const response = await axios.post(`${backendUrl}/api/user/subscribe`, {
        email,
      });
      if (response.data.success) {
        toast.success("Thank you for subscribing!");
      } else {
        toast.error(response.data.message || "Failed to subscribe");
      }
      setEmail("");
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("An error occurred");
    } finally {
      setTimeout(() => {
        setIsLoading(false); // stop loading
      }, 1000);
    }
  };

  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-800">
        Subscribe now & get 20% off
      </p>
      <p className="text-gray-400 mt-3">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
      </p>
      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
      >
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your email"
          className="w-full sm:flex-1 outline-none border-none  "
        />

        <button
          type="submit"
          disabled={isLoading}
          className={` rounded text-white text-xs ${
            isLoading
              ? "bg-gray-500"
              : "bg-black hover:bg-gray-800 text-white  px-10 py-4"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2 px-10 py-4">
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
            "SUBSCRIBE"
          )}
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
