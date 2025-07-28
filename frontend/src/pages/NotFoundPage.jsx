import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets/frontend_assets/assets";

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center md:justify-center ">
      <img src={assets.notfound} alt="Not Found" className="w-1/2 md:w-1/3 " />
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mt-5">
        Page Not Found
      </h1>
      <p className="text-gray-600 mt-2">
        The page you are looking for does not exist.
      </p>
      <a href="/" className="mt-5 border p-3  hover:underline">
        Go back to Home
      </a>
    </div>
  );
}

export default NotFoundPage;
