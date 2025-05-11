import React from "react";
import { fallbackImage } from "../../api";

const ProfileHeader = ({ user, onEditClick }) => (
  <div className="space-y-2 text-center">
    <img
      src={user.avatar?.url || fallbackImage}
      alt={user.avatar?.alt || user.name}
      className="w-24 h-24 rounded-full object-cover mx-auto"
    />
    <h2 className="text-xl font-semibold">{user.name}</h2>
    <p>
      <strong>Bio:</strong> {user.bio}
    </p>
    <p>
      <strong>Venue Manager:</strong> {user.venueManager ? "Yes" : "No"}
    </p>
    <div className="flex justify-center gap-4 mt-2">
      <button
        onClick={onEditClick}
        className="bg-gray-100  text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm transition cursor-pointer hover:text-white hover:bg-blue-700"
      >
        Edit Profile
      </button>
    </div>
  </div>
);

export default ProfileHeader;
