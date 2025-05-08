import React from "react";
import { Link } from "react-router-dom";

const FooterBrand = () => (
    <div>
      <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight hover:text-indigo-200 transition-colors duration-200"
          >
            Holidaze
          </Link>
      <p className="text-gray-400">
        Discover unique stays and unforgettable experiences with Holidaze.
      </p>
    </div>
  );
  
  export default FooterBrand;
  