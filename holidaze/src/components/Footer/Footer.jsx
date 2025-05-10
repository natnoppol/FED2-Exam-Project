import React from "react";
import FooterBrand from "./FooterBrand";
import FooterBottom from "./FooterBottom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-5 px-5 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 place-items-center">
        <FooterBrand />
      </div>
      <FooterBottom />
    </footer>
  );
};

export default Footer;
