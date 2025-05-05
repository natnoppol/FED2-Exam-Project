import React, { useState, useEffect } from 'react';
import { fetchVenues, fallbackImage } from '../api';
import SearchForm from '../components/SearchForm';

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
      <p className="text-lg font-bold text-green-600">
        Price: ${venue.price}
      </p>
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

  // Fetch venues on component mount
  useEffect(() => {
    const fetchInitialVenues = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchVenues(); // Fetch all venues without filters
        setVenues(data);
      } catch (error) {
        setError('Failed to load venues. Please try again later.');
        console.error('Error fetching venues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialVenues();
  }, []);

  // Handle search form submission
  const handleSearch = async (searchParams) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchVenues(searchParams); // Fetch and filter venues
      setVenues(data);
    } catch (error) {
      setError('Failed to filter venues. Please try again later.');
      console.error('Error filtering venues:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center mt-6">
      <div className="spinner-border animate-spin border-4 border-t-blue-600 rounded-full w-8 h-8" />
    </div>
  );


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
          venues.map((venue) => <VenueCard key={venue.id} venue={venue} />)
        )}
      </div>
    </div>
  );
};

export default HomePage;