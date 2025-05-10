import React from "react";
import { MdLocationOn } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { fallbackImage } from "../../api";

function AdminBookingCard({ booking, onCancel }) {
  const { dateFrom, dateTo, guests, venue } = booking;

  // ถ้าไม่มีรูป, ใช้ fallback จาก public/images
  const image = venue?.media?.[0]?.url || fallbackImage;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <img
        src={image}
        alt={venue?.name || "Venue image"}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 flex flex-col h-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {venue?.name}
        </h3>

        {venue?.location?.city && venue?.location?.country && (
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <MdLocationOn className="mr-1 text-red-500" />
            {venue.location.city}, {venue.location.country}
          </div>
        )}

        <div className="text-sm text-gray-600 flex items-center mb-1">
          <FaCalendarAlt className="mr-2 text-blue-500" />
          From: {new Date(dateFrom).toLocaleDateString()}
        </div>
        <div className="text-sm text-gray-600 flex items-center mb-2">
          <FaCalendarAlt className="mr-2 text-blue-500" />
          To: {new Date(dateTo).toLocaleDateString()}
        </div>

        <p className="text-sm text-gray-700 mb-4">
          <strong>Guests:</strong> {guests}
        </p>

        <button
          onClick={() => onCancel(booking.id)}
          className="mt-auto bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition cursor-pointer"
        >
          Cancel Booking
        </button>
      </div>
    </div>
  );
}

export default AdminBookingCard;
