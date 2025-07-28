import React from "react";
import { assets } from "../assets/assets/frontend_assets/assets";

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border  border-gray-400">
      {/* Hero left side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0 ">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base text-[#FF725C] ">
              WELCOME TO SHOPNEST
            </p>
          </div>
          <h1 className="text-[#]  prata-regular text-3xl sm:py-3 lg:text-5xl md:leading-relaxed">
            Discover modern & <br />{" "}
            <span className="md:mt-4">timeless fashion</span>
          </h1>
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm md:text-base text-[#FF725C]">
              START SHOPPING
            </p>
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
          </div>
        </div>
      </div>

      {/* Hero right  side */}
      <img
        className="w-full sm:w-1/2  border-gray-400"
        src={assets.hero6}
        alt="Hero"
      />
    </div>
  );
};

export default Hero;
