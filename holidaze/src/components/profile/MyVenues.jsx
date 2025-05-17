import React from "react";
import { Link } from "react-router-dom";
import { fallbackImage } from "../../api";
import { FaArrowLeft, FaArrowRight, FaMapMarkerAlt, FaUsers, FaStar, FaCoffee, FaWifi, FaDog, FaCar } from "react-icons/fa";
import { Spinner } from "../Spinner";

const MyVenues = ({ venues, loading, error, currentPage, totalPages, onPrevPage, onNextPage }) => {
  if (loading) return <Spinner />;
  if (error)   return <p className="text-red-500 text-center py-10">{error}</p>;
  if (venues.length === 0) return <p className="text-center py-10">You have not created any venues yet.</p>;

  return (
    <div>
      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <div key={venue.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
            {/* Image */}
            <div className="w-full h-48 overflow-hidden rounded-md mb-4">
              <img
                src={venue.media[0]?.url || fallbackImage}
                alt={venue.media[0]?.alt || venue.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Name */}
            <Link to={`/venue/${venue.id}`} className="text-xl font-semibold text-blue-600 hover:underline mb-2">
              {venue.name}
            </Link>
            {/* Location */}
            <p className="flex items-center text-gray-600 mb-1">
              <FaMapMarkerAlt className="mr-2 text-gray-500" />
              {venue.location?.city ? `${venue.location.city}, ${venue.location.country}` : "No location"}
            </p>
            {/* Guests & Price */}
            <div className="flex items-center justify-between text-gray-700 mb-2">
              <span className="flex items-center">
                <FaUsers className="mr-1 text-gray-500" /> {venue.maxGuests || "-"}
              </span>
              <span className="font-medium">${venue.price}/night</span>
            </div>
            {/* Rating */}
            <p className="flex items-center text-yellow-500 mb-2">
              <FaStar className="mr-1" /> {venue.rating ?? "N/A"}
            </p>
            {/* Amenities */}
            <div className="flex flex-wrap gap-3 text-gray-600 text-sm mb-4">
              {venue.meta?.wifi      && <span className="flex items-center"><FaWifi className="mr-1"/>WiFi</span>}
              {venue.meta?.breakfast && <span className="flex items-center"><FaCoffee className="mr-1"/>Breakfast</span>}
              {venue.meta?.pets      && <span className="flex items-center"><FaDog className="mr-1"/>Pets</span>}
              {venue.meta?.parking   && <span className="flex items-center"><FaCar className="mr-1"/>Parking</span>}
            </div>
            {/* Actions */}
            <div className="mt-auto">
              <Link
                to={`/admin/venue/${venue.id}/bookings`}
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
              >
                View Bookings
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={onPrevPage}
          disabled={currentPage === 1}
          className="flex items-center gap-2 bg-gray-200 hover:bg-blue-600 hover:text-white text-gray-700 py-2 px-4 rounded disabled:opacity-50 transition cursor-pointer"
        >
          <FaArrowLeft /> Previous
        </button>
        <span className="text-gray-600">
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
        <button
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 bg-gray-200 hover:bg-blue-600 hover:text-white text-gray-700 py-2 px-4 rounded disabled:opacity-50 transition cursor-pointer"
        >
          Next <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default MyVenues;
