import React from "react";
import { FaCamera } from "react-icons/fa";

const AvatarInput = ({ formData, setFormData }) => {
  return (
    <div className="mb-6">
      <label
        htmlFor="avatar"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Avatar URL
      </label>
      <div className="relative flex items-center">
        <input
          type="text"
          id="avatar"
          name="avatar"
          value={formData.avatar}
          onChange={(e) =>
            setFormData({ ...formData, avatar: e.target.value })
          }
          className="w-full rounded-md border border-gray-300 p-3 pr-10 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Enter avatar image URL"
        />
        <FaCamera className="absolute right-3 text-gray-400 text-lg pointer-events-none" />
      </div>

      {formData.avatar && (
        <div className="mt-3 flex justify-center">
          <img
            src={formData.avatar}
            alt="Avatar Preview"
            className="w-24 h-24 rounded-full object-cover border shadow-sm"
          />
        </div>
      )}
    </div>
  );
};

export default AvatarInput;
