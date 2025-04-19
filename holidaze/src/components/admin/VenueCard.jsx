import React from "react";


export default function VenueCard({ venue, onEdit, onDelete }) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden p-4 flex flex-col justify-between">
      <img
        src={venue.media?.[0]?.url || "https://plus.unsplash.com/premium_photo-1699544856963-49c417549268?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
        alt={venue.media?.[0]?.alt || venue.name}
        className="w-full h-40 object-cover rounded"
      />

      <div className="mt-4">
        <h2 className="text-lg font-semibold">{venue.name}</h2>
        <p className="text-sm text-gray-600 line-clamp-2">
          {venue.description}
        </p>
        <p className="mt-1 font-medium">Price: ${venue.price}</p>
        <p className="text-sm text-gray-500">Max Guests: {venue.maxGuests}</p>
      </div>

      <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => onEdit(venue)}
        >
          Edit
        </button>

        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => onDelete(venue.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
