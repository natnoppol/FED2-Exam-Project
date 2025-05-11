import React from "react";
import { Link } from "react-router-dom";
import { fallbackImage } from "../../api";

const MyVenues = ({ venues, loading, error }) => {
  if (loading) return <p>Loading venues...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (venues.length === 0) return <p>You have not created any venues yet.</p>;

  return (
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
          <p>{venue.location?.city}, {venue.location?.country}</p>
          <p>Max Guests: {venue.maxGuests}</p>
          <p>{venue.description}</p>
          <img
            src={venue.media[0]?.url || fallbackImage}
            alt={venue.media[0]?.alt || venue.name || "Venue image"}
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
  );
};

export default MyVenues;
