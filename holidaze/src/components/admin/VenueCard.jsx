import React from "react";
import { fallbackImage } from "../../api";
import { CheckCircle, XCircle, Pencil, Trash2, DollarSign, Users } from "lucide-react";

export default function VenueCard({ venue, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden p-4 flex flex-col justify-between h-full transition-transform hover:scale-105 duration-300">
      <img
        src={venue.media?.[0]?.url || fallbackImage}
        alt={venue.media?.[0]?.alt || venue.name}
        className="w-full h-48 object-cover rounded-lg"
      />

      <div className="mt-4 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{venue.name}</h2>
          <p className="text-sm text-gray-500 mb-1">Rating: {venue.rating}</p>
          <p className="text-sm text-gray-600 line-clamp-2">{venue.description}</p>

          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-blue-800" />
              <p className="font-medium text-blue-800">Price: ${venue.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-gray-500" />
              <p className="text-sm text-gray-500">Max Guests: {venue.maxGuests}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
              <div className="flex items-center gap-2">
                Wifi: {venue.meta?.wifi ? <CheckCircle className="text-green-600 w-4 h-4" /> : <XCircle className="text-red-500 w-4 h-4" />}
              </div>
              <div className="flex items-center gap-2">
                Parking: {venue.meta?.parking ? <CheckCircle className="text-green-600 w-4 h-4" /> : <XCircle className="text-red-500 w-4 h-4" />}
              </div>
              <div className="flex items-center gap-2">
                Breakfast: {venue.meta?.breakfast ? <CheckCircle className="text-green-600 w-4 h-4" /> : <XCircle className="text-red-500 w-4 h-4" />}
              </div>
              <div className="flex items-center gap-2">
                Pets: {venue.meta?.pets ? <CheckCircle className="text-green-600 w-4 h-4" /> : <XCircle className="text-red-500 w-4 h-4" />}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="font-semibold text-gray-700">{venue.location?.address}</p>
            <p className="text-sm text-gray-500">{venue.location?.city}, {venue.location?.country}</p>
          </div>
        </div>

        <div className="flex justify-between gap-2 mt-4">
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer flex items-center justify-center gap-2"
            onClick={() => onEdit(venue)}
          >
            <Pencil size={16} /> Edit
          </button>
          <button
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition cursor-pointer flex items-center justify-center gap-2"
            onClick={() => onDelete(venue.id)}
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
