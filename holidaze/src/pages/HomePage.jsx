import React, { useState, useEffect } from "react";
import { fallbackImage } from "../api"; // Keep fallbackImage
import SearchForm from "../components/SearchForm";
import { Spinner } from "../components/Spinner";
import { HiLocationMarker } from "react-icons/hi"; 
import { useVenues } from "../contexts/venueContext";

const VenueCard = ({ venue }) => {
  const { city = "Unknown City", country = "Unknown Country" } = venue.location || {};

  return (
    <div className="venue-card border rounded-lg shadow-lg overflow-hidden">
      <img
        src={venue.media[0]?.url || fallbackImage}
        alt={venue.media[0]?.alt || venue.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-1">{venue.name}</h2>

        {/* Location with icon */}
        <p className="text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
          <HiLocationMarker className="text-red-500 text-lg" />
          {city}, {country}
        </p>

        {/* Price per night */}
        <p className="text-lg font-bold text-green-600 mb-2">
          Price: ${venue.price} / night
        </p>

        <a
          href={`/venue/${venue.id}`}
          className="btn btn-primary mt-2 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View Details
        </a>
      </div>
    </div>
  );
};

// Helper function for filtering (can be moved outside if preferred)
const filterVenues = (venues, { country, guests }) => {
  if (!venues) return [];

  const lowerCountry = country ? country.toLowerCase().trim() : "";
  const minGuests = guests || 1; // Default to 1 guest if not specified

  return venues.filter(venue => {
    // Filter by location (country, city, or continent) if country search term is provided
    const locationMatch = lowerCountry === "" ||
      venue.location?.country?.toLowerCase().includes(lowerCountry) ||
      venue.location?.city?.toLowerCase().includes(lowerCountry) ||
      venue.location?.continent?.toLowerCase().includes(lowerCountry);

    // Filter by guests
    const guestsMatch = venue.maxGuests >= minGuests;

    // Note: Date filtering (checkIn, checkOut) is not possible client-side
    // with only the venue details. This would require fetching booking data.
    // We will ignore date parameters for client-side filtering here.

    return locationMatch && guestsMatch;
  });
};

const HomePage = () => {
  // Use the context to get all venues and their loading/error states
  const { allVenues, loading, error } = useVenues();

  // State to hold the venues currently being displayed (filtered)
  const [displayedVenues, setDisplayedVenues] = useState([]);

  // Effect to initialize displayedVenues when allVenues from context is loaded
  useEffect(() => {
    if (allVenues && !loading && !error) {
      setDisplayedVenues(allVenues); // Initially display all venues once loaded
    }
  }, [allVenues, loading, error]);

  const handleSearch = async (searchParams) => {
    // Filter the venues from the context based on search parameters
    const filtered = filterVenues(allVenues, searchParams);
    setDisplayedVenues(filtered);
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <SearchForm onSearch={handleSearch} />

      {error && <p className="text-red-600">{error}</p>}

      <h1 className="text-2xl font-bold mb-6">
        {displayedVenues.length > 0 ? "Available Venues" : "No Venues Found"}
      </h1>
      <div className="venue-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedVenues.length === 0 && !loading && !error ? (
          <p className="text-center text-gray-600 mt-6">
            No venues found for your search criteria.
          </p>
        ) : (
          displayedVenues.map((venue, idx) => (
            <VenueCard key={venue.id + idx} venue={venue} />
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
