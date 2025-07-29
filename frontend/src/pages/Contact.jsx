import React, { useState } from "react";
import { NewsletterBox, Title } from "../components";
import { assets } from "../assets/assets/frontend_assets/assets";
import Section from "../components/Section";

const Contact = () => {
  const [showMessage, setShowMessage] = useState(false);

  const handleExploreJobsClick = () => {
    setShowMessage(true);
  };
  return (
    <Section>
      <div>
        <div className="text-2xl text-center pt-8 border-t">
          <Title text1="CONTACT" text2="US" />
        </div>
        <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
          <img
            src={assets.contact}
            alt="Contact Us"
            className="w-full md:max-w-[480px] "
          />
          <div className="flex flex-col justify-center items-start gap-6">
            <p className="font-semibold text-xl text-gray-600">Our Store</p>
            <p className="text-gray-500">
              123 E-commerce St, Suite 100
              <br />
              Shopping City, SC 12345
            </p>
            <p className="text-gray-500">
              Email: support@shopnest.com
              <br />
              Phone: (123) 456-7890
            </p>
            <p className="font-semibold text-xl text-gray-600">
              Careers at ShopNest
            </p>
            <p className="text-gray-500">
              Join our passionate team and help shape the future of online
              shopping. <br /> Discover exciting career opportunities with us.
            </p>
            <button
              onClick={handleExploreJobsClick}
              className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500"
            >
              Explore Jobs
            </button>
            {showMessage && (
              <p className="mt-2 text-gray-600">No open positions for now.</p>
            )}
          </div>
        </div>
        <NewsletterBox />
      </div>
    </Section>
  );
};

export default Contact;
