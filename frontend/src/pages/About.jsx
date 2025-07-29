import React from "react";
import { NewsletterBox, Title } from "../components";
import { assets } from "../assets/assets/frontend_assets/assets";
import Section from "../components/Section";

const About = () => {
  return (
    <Section>
      <div>
        <div className="text-2xl text-center pt-8 border-t">
          <Title text1="ABOUT" text2="US" />
        </div>

        <div className="my-10 flex flex-col md:flex-row gap-16">
          <img
            className="w-full md:max-w-[330px] lg:max-w-[450px]"
            src={assets.hero3}
            alt="About Us"
          />
          <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
            <p>
              ShopNest was created with a vision to redefine online shopping by
              blending convenience with quality. Our story began with a
              commitment to offer a platform where customers can effortlessly
              browse, discover, and purchase a diverse range of products from
              the comfort of their homes.
            </p>
            <p>
              From day one, we’ve focused on curating an exceptional collection
              of premium products to suit every style and need. Whether it’s
              fashion, beauty, electronics, or home essentials, our carefully
              selected range comes from trusted brands and reliable suppliers.
            </p>
            <b className="text-gray-800">Our Mission</b>
            <p>
              At ShopNest, our mission is to inspire confidence and delight in
              every customer. We strive to deliver a seamless, enjoyable
              shopping experience, from effortless browsing to swift delivery,
              ensuring satisfaction at every step.
            </p>
          </div>
        </div>
        <div className="text-xl py-4">
          <Title text1="WHY" text2="CHOOSE US?" />
        </div>
        <div className="flex flex-col lg:flex-row text-sm mb-20">
          <div className="border px-10 md:px-16 py-8 sm:py-10 lg:py-20 flex flex-col gap-5">
            <b>Quality Assurance:</b>
            <p className="text-gray-600">
              We meticulously select and vet each product to ensure it meets our
              stringent quality standards.
            </p>
          </div>
          <div className="border px-10 md:px-16 py-8 sm:py-10 lg:py-20 flex flex-col gap-5">
            <b>Convenience:</b>
            <p className="text-gray-600">
              With our user-friendly interface and hassle-free ordering process,
              shopping has never been easier.
            </p>
          </div>
          <div className="border px-10 md:px-16 py-8 sm:py-10 lg:py-20 flex flex-col gap-5">
            <b>Exceptional Customer Service:</b>
            <p className="text-gray-600">
              Our team of dedicated professionals is here to assist you every
              step of the way, ensuring your satisfaction is our top priority.
            </p>
          </div>
        </div>
        <NewsletterBox />
      </div>
    </Section>
  );
};

export default About;
