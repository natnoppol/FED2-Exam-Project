import React from "react";
import { Link } from "react-router-dom";
import { fallbackImage } from "../../api";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const MyVenues = ({ venues, loading, error, currentPage, totalPages, onPrevPage, onNextPage }) => {
  if (loading) return <p>Loading venues...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (venues.length === 0) return <p>You have not created any venues yet.</p>;

  return (
    <div>
      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {venues.map((venue) => (
          <div key={venue.id} className="border p-3 rounded-md shadow-sm bg-gray-50">
            <Link
              to={`/venue/${venue.id}`}
              className="text-blue-600 font-medium hover:underline"
            >
              {venue.name}
            </Link>

            {/* Location */}
            <p>
              {venue.location?.city && venue.location?.country
                ? `${venue.location.city}, ${venue.location.country}`
                : "Location information not available"}
            </p>

            {/* Max Guests */}
            <p>{venue.maxGuests ? `Max Guests: ${venue.maxGuests}` : "Max Guests not specified"}</p>

            {/* Description */}
            <p>{venue.description}</p>

            {/* Image */}
            <img
              src={venue.media[0]?.url || fallbackImage}
              alt={venue.media[0]?.alt || venue.name || "Venue image"}
              className="w-full h-48 object-cover rounded-md mt-2"
            />

            {/* Price */}
            <p>Price: ${venue.price}</p>

            {/* Rating */}
            <p>Rating: ⭐ {venue.rating ?? "N/A"}</p>

            {/* Amenities */}
            <div className="mt-2 text-sm text-gray-700">
              <p>Amenities:</p>
              <ul className="list-disc list-inside">
                {venue.meta?.wifi && <li>WiFi</li>}
                {venue.meta?.breakfast && <li>Breakfast</li>}
                {venue.meta?.pets && <li>Pets Allowed</li>}
                {venue.meta?.parking && <li>Parking</li>}
              </ul>
            </div>

            {/* View Bookings */}
            <Link
              to={`/admin/venue/${venue.id}/bookings`}
              className="btn btn-primary mt-3"
            >
              View Bookings
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onPrevPage}
          disabled={currentPage === 1}
          className="flex items-center bg-gray-300 px-4 py-2 rounded disabled:opacity-50 cursor-pointer hover:text-white hover:bg-blue-600"
        >
          <FaArrowLeft className="mr-2" />
          Previous
        </button>
        <span className="px-4 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="flex items-center bg-gray-300 px-4 py-2 rounded disabled:opacity-50 cursor-pointer hover:text-white hover:bg-blue-600"
        >
          Next
          <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default MyVenues;
