import React, { useEffect, useState } from "react";
import { fallbackImage } from "../api";
import SearchForm from "../components/SearchForm";
import { Spinner } from "../components/Spinner";
import { HiLocationMarker } from "react-icons/hi";
import { useVenues } from "../contexts/venueContext";
import { filterVenues } from "../utils/filterVenues"; 

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

  const itemsPerPage = 9;

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
    (searchPage - 1) * itemsPerPage,
    searchPage * itemsPerPage
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
        {venuesToDisplay.length === 0 && !loading ? (
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
      {!isFiltered ? (
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => loadPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50 hover:bg-blue-600 hover:text-white cursor-pointer"
          >
            Previous
          </button>
          <span className="text-lg font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => loadPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50 hover:bg-blue-600 hover:text-white cursor-pointer"
          >
            Next
          </button>
        </div>
      ) : (
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setSearchPage((p) => Math.max(p - 1, 1))}
            disabled={searchPage === 1}
            className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50 hover:bg-blue-600 hover:text-white cursor-pointer"
          >
            Previous
          </button>
          <span className="text-lg font-semibold">
            Page {searchPage} of{" "}
            {Math.ceil(filteredVenues.length / itemsPerPage)}
          </span>
          <button
            onClick={() =>
              setSearchPage((p) =>
                p < Math.ceil(filteredVenues.length / itemsPerPage) ? p + 1 : p
              )
            }
            disabled={
              searchPage >= Math.ceil(filteredVenues.length / itemsPerPage)
            }
            className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50 hover:bg-blue-600 hover:text-white cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
