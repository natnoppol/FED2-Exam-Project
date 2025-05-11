import React, { useEffect, useState } from "react";
import { getUser } from "../utils/auth";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { Link } from "react-router-dom";
import { useBookings } from "../hooks/useBookings";
import { fallbackImage } from "../api";

import { FaEdit } from "react-icons/fa";
import BannerInput from "../components/profile/editForm/BannerInput";
import AvatarInput from "../components/profile/editForm/AvatarInput";
import BioInput from "../components/profile/editForm/BioInput";

import MyBookings from "../components/profile/MyBooking";
import MyVenues from "../components/profile/MyVenues";
import { useVenuesByManager } from "../hooks/useVenuesByManager";

const ProfilePage = () => {
  const [updateMessage, setUpdateMessage] = useState("");
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: "",
    avatar: "",
    banner: "",
    venueManager: false,
  });
  const { updateUserProfile } = useUpdateProfile();

  const handleUpdate = () => {
    updateUserProfile(
      user.name,
      formData,
      (updated) => {
        setUser(updated);
        setEditing(false);
        setUpdateMessage("Profile updated successfully!");
        setTimeout(() => setUpdateMessage(""), 3000);
      },
      (error) => {
        setUpdateMessage(
          `Error updating profile. Please try again. ${
            error?.message || String(error)
          }`
        );
        setTimeout(() => setUpdateMessage(""), 3000);
      }
    );
  };

  const [activeTab, setActiveTab] = useState("bookings");

  const {
    currentBookings,
    loadingBookings,
    handlePrevPage: handleBookingPrevPage,
    handleNextPage: handleBookingNextPage,
    currentPage: bookingCurrentPage,
    totalPages: bookingTotalPages,
    cancellingId,
    handleCancelBooking,
  } = useBookings(user?.name);

  const {
    venues,
    loadingVenues,
    error: venuesError,
    currentPage,
    totalPages,
    handlePrevPage,
    handleNextPage,
  } = useVenuesByManager(user?.name);

  useEffect(() => {
    const profileData = getUser();
    if (profileData) {
      setUser(profileData);
      setFormData({
        bio: profileData.bio || "",
        avatar: profileData.avatar?.url || "",
        banner: profileData.banner?.url || "",
        venueManager: profileData.venueManager || false,
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (!user) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      {/* Profile section */}
      <div className="space-y-2 text-center">
        <img
          src={user.avatar?.url || fallbackImage}
          alt={user.avatar?.alt || user.name}
          className="w-24 h-24 rounded-full object-cover mx-auto"
        />
        <h2 className="text-2xl font-semibold">{user.name}</h2>

        {/* Display bio and venue manager status */}
        {editing ? (
          <div className="mt-6 space-y-4 bg-gray-50 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Edit Your Profile
            </h3>

            <BioInput formData={formData} setFormData={setFormData} />
            <AvatarInput formData={formData} setFormData={setFormData} />
            <BannerInput formData={formData} setFormData={setFormData} />

            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                name="venueManager"
                id="venueManager"
                checked={formData.venueManager}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="venueManager"
                className="ml-2 block text-sm text-gray-700"
              >
                I am a venue manager
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleUpdate}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 cursor-pointer"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-150 cursor-pointer"
              >
                Cancel
              </button>
            </div>
            {updateMessage && (
              <p className="text-green-600 text-sm text-center mt-2">
                {updateMessage}
              </p>
            )}
          </div>
        ) : (
          <>
            <p>
              <strong>Bio:</strong> {user.bio}
            </p>
            <p>
              <strong>Venue Manager:</strong> {user.venueManager ? "Yes" : "No"}
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setEditing(true)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm transition cursor-pointer"
              >
                <FaEdit className="inline mr-2" />
                Edit Profile
              </button>
              {user.venueManager && (
                <Link
                  to="/admin/manage-venues"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm transition"
                >
                  Add New Venue
                </Link>
              )}
            </div>
            {updateMessage && (
              <p className="text-green-600 font-medium text-sm mt-2">
                {updateMessage}
              </p>
            )}
          </>
        )}
      </div>

      {/* Venue Manager Tabs - My Bookings / My Venues */}
      {user.venueManager && (
        <div className="mt-6">
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
          </div>

          {activeTab === "bookings" ? (
            <MyBookings
              bookings={currentBookings}
              loading={loadingBookings}
              currentPage={bookingCurrentPage}
              totalPages={bookingTotalPages}
              onPrevPage={handleBookingPrevPage}
              onNextPage={handleBookingNextPage}
              cancellingId={cancellingId}
              onCancelBooking={handleCancelBooking}
            />
          ) : (
            <>
              <h2 className="text-2xl font-semibold mt-6 mb-4">My Venues</h2>
              {loadingVenues ? (
                <div>Loading venues...</div>
              ) : venuesError ? (
                <div className="text-red-500">{venuesError}</div>
              ) : (
                <MyVenues
                  venues={venues}
                  loading={loadingVenues}
                  error={venuesError}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPrevPage={handlePrevPage}
                  onNextPage={handleNextPage}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
