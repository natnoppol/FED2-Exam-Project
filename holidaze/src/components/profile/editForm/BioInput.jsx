import React from "react";

const BioInput = ({ formData, setFormData }) => {
  return (
    <div className="mb-4">
      <label
        htmlFor="bio"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Bio
      </label>
      <textarea
        id="bio"
        name="bio"
        rows={4}
        placeholder="Tell us something about yourself..."
        value={formData.bio}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        className="w-full rounded-md border border-gray-300 p-3 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
};

export default BioInput;
