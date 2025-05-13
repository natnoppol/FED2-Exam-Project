import React from "react";

const ProfileTabs = ({ isVenueManager, activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-4 justify-center mb-4">
      <button
        onClick={() => setActiveTab("bookings")}
        className={`px-6 py-2 rounded-lg text-lg font-medium transition ${
          activeTab === "bookings"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 cursor-pointer"
        }`}
      >
        My Bookings
      </button>

      {isVenueManager && (
        <button
          onClick={() => setActiveTab("venues")}
          className={`px-6 py-2 rounded-lg text-lg font-medium transition ${
            activeTab === "venues"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 cursor-pointer"
          }`}
        >
          My Venues
        </button>
      )}
    </div>
  );
};

export default ProfileTabs;
