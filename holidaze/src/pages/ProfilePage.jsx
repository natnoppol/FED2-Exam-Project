import React, { useEffect, useState } from "react";
import { getUser } from "../utils/auth";
import { useUpdateProfile } from "../hooks/useUpdateProfile"; // Assuming this is the correct path to your update function
import { Link } from "react-router-dom";
import { useBookings } from "../hooks/useBookings";
import { useVenuesByManager } from "../hooks/useVenuesByManager";
import { fallbackImage } from "../api";

import { FaEdit } from "react-icons/fa";
import BannerInput from "../components/profile/editForm/BannerInput";
import AvatarInput from "../components/profile/editForm/AvatarInput";
import BioInput from "../components/profile/editForm/BioInput";

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
        setUpdateMessage("Error updating profile. Please try again.", error);
        setTimeout(() => setUpdateMessage(""), 3000);
      }
    );
  };

  const [activeTab, setActiveTab] = useState("bookings");

  // Get bookings only after the user is fetched
  const {
    currentBookings,
    loadingBookings,
    handlePrevPage,
    handleNextPage,
    currentPage,
    totalPages,
    cancellingId,
    handleCancelBooking,
  } = useBookings(user?.name);
  const {
    venues,
    loadingVenues,
    error: venuesError,
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

  let renderBookingsContent;

  if (loadingBookings) {
    renderBookingsContent = (
      <div className="flex justify-center items-center">
        <p>Loading bookings...</p>
      </div>
    );
  } else if (currentBookings.length > 0) {
    renderBookingsContent = (
      <>
        <ul className="space-y-4">
          {currentBookings.map((booking) => (
            <li
              key={booking.id}
              className="border p-3 rounded-md shadow-sm bg-gray-50"
            >
              <Link
                to={`/venue/${booking.venue.id}`}
                className="text-blue-600 font-medium hover:underline"
              >
                {booking.venue?.name}
              </Link>
              <p>
                <strong>Guests:</strong> {booking.guests}
              </p>
              <p>
                <strong>Dates:</strong>{" "}
                {new Date(booking.dateFrom).toLocaleDateString("en-US")} →{" "}
                {new Date(booking.dateTo).toLocaleDateString("en-US")}
              </p>
              <button
                onClick={() => handleCancelBooking(booking.id)}
                disabled={cancellingId === booking.id}
                className={`mt-2 px-4 py-2 rounded text-white transition-all ${
                  cancellingId === booking.id
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {cancellingId === booking.id
                  ? "Cancelling..."
                  : "Cancel Booking"}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </>
    );
  } else {
    renderBookingsContent = <p>You have no bookings yet.</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white shadow-md rounded-lg">
      {/* Profile section */}
      <div className="space-y-2 text-center">
        <img
          src={user.avatar?.url || fallbackImage}
          alt={user.avatar?.alt || user.name}
          className="w-24 h-24 rounded-full object-cover mx-auto"
        />
        <h2 className="text-xl font-semibold">{user.name}</h2>

        {/* Display bio and venue manager status */}
        {editing ? (
          <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg shadow-inner">
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
            <div className="flex justify-center gap-4 mt-2">
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
      <div className="flex flex-col sm:flex-row justify-center gap-2 mt-4">
        {user.venueManager && (
          <div className="">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-4 py-2 rounded-lg ${
                activeTab === "bookings"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab("venues")}
              className={`px-4 py-2 rounded-lg ${
                activeTab === "venues"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              My Venues
            </button>
            {activeTab === "bookings" ? (
              <>
                <h2 className="text-xl font-semibold mt-6 mb-2">My Bookings</h2>
                {renderBookingsContent}
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mt-6 mb-2">My Venues</h2>
                {loadingVenues ? (
                  <div className="flex justify-center items-center">
                    <p>Loading venues...</p>
                  </div>
                ) : venuesError ? (
                  <p className="text-red-500">{venuesError}</p> // Display error if any
                ) : venues.length > 0 ? (
                  <ul className="space-y-4">
                    {venues.map((venue) => (
                      <li
                        key={venue.id}
                        className="border p-3 rounded-md shadow-sm bg-gray-50"
                      >
                        <Link
                          to={`/venue/${venue.id}`}
                          className="text-blue-600 font-medium hover:underline"
                        >
                          {venue.name}
                        </Link>
                        <p>
                          {venue.location?.city}, {venue.location?.country}
                        </p>
                        <p>Max Guests: {venue.maxGuests}</p>
                        <p>{venue.description}</p>
                        <img
                          src={venue.media[0]?.url || fallbackImage}
                          alt={
                            venue.media[0]?.alt || venue.name || "Venue image"
                          }
                          className="w-full h-48 object-cover rounded-md mt-2"
                        />
                        <p>Price: ${venue.price}</p>
                        <p>Rating: ⭐ {venue.rating ?? "N/A"}</p>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>Amenities:</p>
                          <ul className="list-disc list-inside">
                            {venue.meta?.wifi && <li>WiFi</li>}
                            {venue.meta?.breakfast && <li>Breakfast</li>}
                            {venue.meta?.pets && <li>Pets Allowed</li>}
                            {venue.meta?.parking && <li>Parking</li>}
                          </ul>
                        </div>
                        <Link
                          to={`/admin/venue/${venue.id}/bookings`}
                          className="btn btn-primary mt-3"
                        >
                          View Bookings
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>You have not created any venues yet.</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
