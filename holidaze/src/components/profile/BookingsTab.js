// BookingsTab.js
import React from "react";
import { FaMapMarkerAlt, FaUserFriends, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { fallbackImage } from "../api";

const BookingsTab = ({
  bookings,
  loadingBookings,
  handleCancelBooking,
  cancellingId,
  currentPage,
  totalPages,
  handlePrevPage,
  handleNextPage,
}) => {
  if (loadingBookings) {
    return (
      <div className="flex justify-center items-center">
        <p>Loading bookings...</p>
      </div>
    );
  }

  if (bookings.length > 0) {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="border rounded-lg shadow-sm bg-white overflow-hidden"
            >
              <img
                src={booking.venue?.media?.[0]?.url || fallbackImage}
                alt={booking.venue?.media?.[0]?.alt || booking.venue?.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <Link
                  to={`/venue/${booking.venue.id}`}
                  className="text-lg font-semibold text-blue-600 hover:underline"
                >
                  {booking.venue?.name}
                </Link>
                <p className="text-gray-600 flex items-center gap-1">
                  <FaMapMarkerAlt className="text-blue-500" />
                  {booking.venue?.location?.city},{" "}
                  {booking.venue?.location?.country}
                </p>
                <p className="flex items-center gap-1">
                  <FaUserFriends className="text-blue-500" />
                  <strong>Guests:</strong> {booking.guests}
                </p>
                <p className="flex items-center gap-1">
                  <FaCalendarAlt className="text-blue-500" />
                  <strong>Dates:</strong>{" "}
                  {new Date(booking.dateFrom).toLocaleDateString("en-US")} →{" "}
                  {new Date(booking.dateTo).toLocaleDateString("en-US")}
                </p>
                <button
                  onClick={() => handleCancelBooking(booking.id)}
                  disabled={cancellingId === booking.id}
                  className={`w-full mt-2 px-4 py-2 rounded text-white transition-all ${
                    cancellingId === booking.id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 cursor-pointer"
                  }`}
                >
                  {cancellingId === booking.id
                    ? "Cancelling..."
                    : "Cancel Booking"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50 cursor-pointer hover:text-white hover:bg-blue-700"
          >
            Previous
          </button>
          <span className="px-4">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50 cursor-pointer hover:text-white hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </>
    );
  }

  return <p>You have no bookings yet.</p>;
};

export default BookingsTab;
