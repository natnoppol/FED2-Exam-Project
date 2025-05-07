import React, { useState, useEffect } from "react";
import { fetchVenues, fallbackImage, fetchPaginatedVenues } from "../api";
import SearchForm from "../components/SearchForm";
import { Spinner } from "../components/Spinner";

const VenueCard = ({ venue }) => (
  <div className="venue-card border rounded-lg shadow-lg overflow-hidden">
    <img
      src={venue.media[0]?.url || fallbackImage}
      alt={venue.media[0]?.alt || venue.name}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h2 className="text-xl font-semibold">{venue.name}</h2>
      <p className="text-gray-600 mb-4">{venue.description}</p>
      <p className="text-lg font-bold text-green-600">Price: ${venue.price}</p>
      <a
        href={`/venue/${venue.id}`}
        className="btn btn-primary mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        View Details
      </a>
    </div>
  </div>
);

const HomePage = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
  
      try {
        let response;
        if (searchParams) {
          response = await fetchVenues(searchParams, currentPage, 9);
        } else {
          response = await fetchPaginatedVenues(currentPage, 9);
        }
  
        setVenues(response.venues);
        setTotalPages(response.totalPages);
      } catch (error) {
        setError("Failed to load venues. Please try again later.");
        console.error("Error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [currentPage, searchParams]);
  

  const handleSearch = async (searchParams) => {
    setLoading(true);
    setError(null);
    setCurrentPage(1); // Reset to the first page when searching
    setSearchParams(searchParams); // Store search parameters for filtering
  
    try {
      const { venues: filtered, totalPages } = await fetchVenues(searchParams, 1, 9);
      setVenues(filtered);
      setTotalPages(totalPages);
    } catch (error) {
      setError("Failed to filter venues. Please try again later.");
      console.error("Error filtering venues:", error);
    } finally {
      setLoading(false);
    }
  };
  

  if (loading) return <Spinner />;

  return (
    <div>
      <SearchForm onSearch={handleSearch} />

      {error && <p className="text-red-600">{error}</p>}

      <h1 className="text-2xl font-bold mb-6">Available Venues</h1>
      <div className="venue-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.length === 0 ? (
          <p className="text-center text-gray-600 mt-6">
            No venues found for your search criteria.
          </p>
        ) : (
          venues.map((venue, idx) => (
            <VenueCard key={venue.id + idx} venue={venue} />
          ))
        )}
      </div>

      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-blue-600 hover:text-white cursor-pointer"
        >
          Previous
        </button>
        <span className="self-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-blue-600 hover:text-white cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HomePage;
