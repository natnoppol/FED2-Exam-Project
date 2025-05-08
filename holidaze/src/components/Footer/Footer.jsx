import React from "react";
import FooterBrand from "./FooterBrand";
import FooterBottom from "./FooterBottom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-4 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-1 gap-8">
        <FooterBrand />
      </div>
      <FooterBottom />
    </footer>
  );
};

export default Footer;
