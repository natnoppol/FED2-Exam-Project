import React from "react";
import { FaCamera } from "react-icons/fa";

const BannerInput = ({ formData, setFormData }) => {
  return (
    <div className="mb-6">
      <label
        htmlFor="banner"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Banner URL
      </label>
      <div className="relative flex items-center">
        <input
          type="text"
          id="banner"
          name="banner"
          value={formData.banner}
          onChange={(e) =>
            setFormData({ ...formData, banner: e.target.value })
          }
          className="w-full rounded-md border border-gray-300 p-3 pr-10 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Enter banner image URL"
        />
        <FaCamera className="absolute right-3 text-gray-400 text-lg pointer-events-none" />
      </div>

      {formData.banner && (
        <div className="mt-3 rounded-md overflow-hidden border border-gray-200 shadow-sm">
          <img
            src={formData.banner}
            alt="Banner Preview"
            className="w-full h-36 object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default BannerInput;
