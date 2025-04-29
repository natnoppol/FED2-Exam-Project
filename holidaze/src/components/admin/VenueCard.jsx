import React from "react";
import {fallbackImage} from "../../api"; // Assuming this is the path to your fallback image
import { CheckCircle, XCircle } from "lucide-react";



export default function VenueCard({ venue, onEdit, onDelete }) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden p-4 flex flex-col justify-between">
      <img
        src={venue.media?.[0]?.url || fallbackImage}
        alt={venue.media?.[0]?.alt || venue.name}
        className="w-full h-40 object-cover rounded"
      />

      <div className="mt-4">
        <h2 className="text-lg font-semibold">{venue.name}</h2>
        <p className="text-sm text-gray-500">Rating: {venue.rating}</p>
        <p className="text-sm text-gray-600 line-clamp-2">
          {venue.description}
        </p>
        <p className="mt-1 font-medium">Price: ${venue.price}</p>
        <p className="text-sm text-gray-500">Max Guests: {venue.maxGuests}</p>
        <p className="text-sm text-gray-500">Amenities</p>
        <p className="text-sm text-gray-500">Wifi: {venue.meta?.wifi  ? <CheckCircle className="text-green-600 w-4 h-4" /> : <XCircle className="text-red-500 w-4 h-4" />}</p>
        <p className="text-sm text-gray-500">Parking: {venue.meta?.parking ? <CheckCircle className="text-green-600 w-4 h-4" /> : <XCircle className="text-red-500 w-4 h-4" />}</p>
        <p className="text-sm text-gray-500">Breakfast: {venue.meta?.breakfast ? <CheckCircle className="text-green-600 w-4 h-4" /> : <XCircle className="text-red-500 w-4 h-4" />}</p>
        <p className="text-sm text-gray-500">Pets: {venue.meta?.pets ? <CheckCircle className="text-green-600 w-4 h-4" /> : <XCircle className="text-red-500 w-4 h-4" />}</p>

        <h2 className="text-xl font-bold">{venue.location.address}</h2>
        <p className="text-sm text-gray-500">{venue.location.city}</p>
        <p className="text-sm text-gray-500">{venue.location.country}</p>
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
