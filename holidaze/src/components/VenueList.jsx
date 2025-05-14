import React from 'react';
import { Link } from 'react-router-dom';
import { fallbackImage } from '../api'; // Using the fallbackImage from your api.js

const VenueCard = ({ venue }) => {
  const imageUrl = venue.media && venue.media.length > 0 ? venue.media[0].url : fallbackImage;
  const imageAlt = venue.media && venue.media.length > 0 ? venue.media[0].alt : 'Default venue image';

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white flex flex-col">
      <Link to={`/venue/${venue.id}`} className="flex flex-col h-full">
        <img
          src={imageUrl}
          alt={imageAlt || venue.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.onerror = null; // prevent infinite loop if fallback also fails
            e.target.src = fallbackImage;
          }}
        />
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold mb-2 truncate" title={venue.name}>{venue.name}</h3>
          <p className="text-gray-600 text-sm mb-1">
            {venue.location?.city && venue.location?.country
              ? `${venue.location.city}, ${venue.location.country}`
              : venue.location?.city || venue.location?.country || 'Location not specified'}
          </p>
          <p className="text-gray-800 font-bold mb-2">
            ${venue.price ? venue.price.toFixed(2) : 'N/A'} <span className="text-sm font-normal text-gray-500">/ night</span>
          </p>
          <div className="flex items-center text-sm text-gray-500 mb-3">
            {venue.rating !== undefined && venue.rating !== null ? `Rating: ${Number(venue.rating).toFixed(1)}/5` : 'No rating'}
            <span className="mx-2">|</span>
            Max Guests: {venue.maxGuests}
          </div>
          <div className="mt-auto"> {/* Pushes button to the bottom */}
            <span // Changed Link to span styled as button for demonstration if navigation isn't the primary action here, but Link is better if it is.
              className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              View Details
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

const VenueList = ({ venues }) => {
  // The "no results" message will be handled by the calling component (e.g., HomePage)
  // to provide more context-specific messages.
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
};

export default VenueList;