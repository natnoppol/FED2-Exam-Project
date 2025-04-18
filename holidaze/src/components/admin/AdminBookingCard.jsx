import React from "react";

function AdminBookingCard({ booking, onCancel }) {
  const { dateFrom, dateTo, guests, venue } = booking;

  return (
    <div className="border p-4 rounded shadow-sm mb-4 bg-white">
      <h3 className="text-lg font-semibold">{venue?.name}</h3>
      <p>
        <strong>Guests:</strong> {guests}
      </p>
      <p>
        <strong>From:</strong> {new Date(dateFrom).toLocaleDateString()}
      </p>
      <p>
        <strong>To:</strong> {new Date(dateTo).toLocaleDateString()}
      </p>
      <button
        onClick={() => onCancel(booking.id)}
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Cancel Booking
      </button>
    </div>
  );
}

export default AdminBookingCard;
