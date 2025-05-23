import React, { useEffect, useState } from "react";
import { fallbackImage } from "../api";
import SearchForm from "../components/SearchForm";
import { Spinner } from "../components/Spinner";
import { HiLocationMarker } from "react-icons/hi";
//check
import { useVenues } from "../contexts/VenueContext";
import { filterVenues } from "../utils/filterVenues"; 
import { ITEMS_PER_PAGE } from "../constants";
import Pagination from "../components/Pagination";

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
        <p className="text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
          <HiLocationMarker className="text-red-500 text-lg" />
          {city}, {country}
        </p>
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

const HomePage = () => {
  const {
    venues,
    allVenues,
    loading,
    error,
    currentPage,
    totalPages,
    loadPage,
  } = useVenues();

  const [filteredVenues, setFilteredVenues] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [searchPage, setSearchPage] = useState(1);

  // Calculate total pages for filtered venues
  const filteredTotalPages = Math.ceil(filteredVenues.length / ITEMS_PER_PAGE);


useEffect(() => {
  if (!isFiltered) {
    loadPage(1);
  }
}, [isFiltered, loadPage]);


  const handleSearch = (searchParams) => {
    if (!searchParams.country && !searchParams.guests) {
      setIsFiltered(false);
      setFilteredVenues([]);
      setSearchPage(1);
      return;
    }

    const filtered = filterVenues(allVenues, searchParams);
    setFilteredVenues(filtered);
    setIsFiltered(true);
    setSearchPage(1);
  };

 const paginatedFiltered = filteredVenues.slice(
  (searchPage - 1) * ITEMS_PER_PAGE,
  searchPage * ITEMS_PER_PAGE
);

  const venuesToDisplay = isFiltered ? paginatedFiltered : venues;

  if (loading && !isFiltered) return <Spinner />;

  return (
    <div>
      <SearchForm onSearch={handleSearch} />

      {error && <p className="text-red-600">{error}</p>}

      <h1 className="text-2xl font-bold mb-6">
        {venuesToDisplay.length > 0 ? "Available Venues" : "No Venues Found"}
      </h1>

      <div className="venue-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
         {venuesToDisplay.length === 0 && !loading && !error ? (
          <p className="text-center text-gray-600 mt-6">
            No venues found for your search criteria.
          </p>
        ) : (
          venuesToDisplay.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={isFiltered ? searchPage : currentPage}
        totalPages={isFiltered ? filteredTotalPages : totalPages}
        onPageChange={(page) => {
          if (page >= 1 && page <= (isFiltered ? filteredTotalPages : totalPages)) {
            isFiltered ? setSearchPage(page) : loadPage(page);
          }
        }}
      />
    </div>
  );
};

export default HomePage;