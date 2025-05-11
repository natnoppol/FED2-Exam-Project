import React from "react";
import { Link } from "react-router-dom";
import { fallbackImage } from "../../api";
import { FaTrash, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const MyBookings = ({
  bookings,
  loading,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  cancellingId,
  onCancelBooking,
}) => {
  if (loading) {
    return <p>Loading bookings...</p>;
  }

  if (bookings.length === 0) {
    return <p>You have no bookings yet.</p>;
  }

  return (
    <>
      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="border p-3 rounded-md shadow-sm bg-gray-50"
          >
            {/* Image */}
            <Link
              to={`/venue/${booking.venue.id}`}
              className="block mb-3"
            >
              <img
                src={
                  booking.venue?.media?.length > 0
                    ? booking.venue.media[0].url
                    : fallbackImage
                }
                alt={booking.venue?.media?.[0]?.alt || "Venue"}
                className="w-full h-48 object-cover rounded-md"
              />
            </Link>

            {/* Booking Details */}
            <Link
              to={`/venue/${booking.venue.id}`}
              className="text-blue-600 font-medium hover:underline block mb-2"
            >
              <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {booking.venue?.name}
              </span>
            </Link>
            <p><strong>Guests:</strong> {booking.guests}</p>
            <p>
              <strong>Dates:</strong>{" "}
              {new Date(booking.dateFrom).toLocaleDateString("en-US")} →{" "}
              {new Date(booking.dateTo).toLocaleDateString("en-US")}
            </p>

            {/* Cancel Booking Button with Trash Icon */}
            <button
              onClick={() => onCancelBooking(booking.id)}
              disabled={cancellingId === booking.id}
              className={`mt-2 px-4 py-2 rounded text-white transition-all ${
                cancellingId === booking.id
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 cursor-pointer"
              }`}
            >
              <FaTrash className="inline mr-2" />
              {cancellingId === booking.id ? "Cancelling..." : "Cancel Booking"}
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={onPrevPage}
          disabled={currentPage === 1}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50 cursor-pointer hover:text-white hover:bg-blue-600"
        >
          <FaArrowLeft className="inline mr-2" />
          Previous
        </button>
        <span className="px-4">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50 cursor-pointer hover:text-white hover:bg-blue-600"
        >
          Next
          <FaArrowRight className="inline ml-2" />
        </button>
      </div>
    </>
  );
};

export default MyBookings;
