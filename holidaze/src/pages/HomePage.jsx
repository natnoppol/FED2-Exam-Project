import { useState, useEffect } from "react";
import { getVenues } from "../api";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // state for error handling

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const data = await getVenues(); // Call the getVenues function to fetch data
        setVenues(data); // Set the venues data to state
      } catch (error) {
        console.error("Error fetching venues:", error);
        setError("Failed to load venues. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVenues(); // Fetch venues when component mounts
  }, []);

  if (loading) return <p>Loading venues...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Available Venues</h1>
      {error && <p className="text-red-600">{error}</p>}

      <div className="venue-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <div key={venue.id} className="venue-card border rounded-lg shadow-lg overflow-hidden">
            <img
              src={venue.media[0]?.url || "https://via.placeholder.com/400x250"}
              alt={venue.media[0]?.alt || venue.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{venue.name}</h2>
              <p className="text-gray-600 mb-4">{venue.description}</p>
              <p className="text-lg font-bold text-green-600">Price: ${venue.price}</p>
              <Link to={`/venue/${venue.id}`} className="btn btn-primary mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
