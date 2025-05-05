import React, { useState, useEffect } from "react";
import { getVenues, fallbackImage } from "../api"; // Assuming this fetches all venues
import { Link } from "react-router-dom";
import SearchForm from "../components/SearchForm"; // Import the search form

const HomePage = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch venues with or without filters
  const fetchVenues = async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getVenues(filters); // Get filtered venues based on the filters object
      setVenues(data); // Set venues based on the filtered response
    } catch (error) {
      setError("Failed to load venues. Please try again later.");
      console.error("Error fetching venues:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues(); // Initial fetch without filters
  }, []);

  // Handle the form submission and search
  const handleSearch = (searchParams) => {
    fetchVenues(searchParams); // Fetch venues with the provided search filters
  };

  if (loading) return <p>Loading venues...</p>;

  return (
    <div>
      <SearchForm onSearch={handleSearch} /> {/* SearchForm Component */}
      {error && <p className="text-red-600">{error}</p>}
      <h1 className="text-2xl font-bold mb-6">Available Venues</h1>
      <div className="venue-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && venues.length === 0 ? (
          <p className="text-center text-gray-600 mt-6">
            No venues found for your search criteria.
          </p>
        ) : (
          venues.map((venue) => (
            <div
              key={venue.id}
              className="venue-card border rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={venue.media[0]?.url || fallbackImage}
                alt={venue.media[0]?.alt || venue.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{venue.name}</h2>
                <p className="text-gray-600 mb-4">{venue.description}</p>
                <p className="text-lg font-bold text-green-600">
                  Price: ${venue.price}
                </p>
                <Link
                  to={`/venue/${venue.id}`}
                  className="btn btn-primary mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
