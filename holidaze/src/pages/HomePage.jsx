import { useState, useEffect } from "react";
import { getVenues } from "../api";
import { Link } from "react-router-dom";


const HomePage = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const data = await getVenues(); // Call the getVenues function to fetch data
        setVenues(data); // Set the venues data to state
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues(); // Fetch venues when component mounts
  }, []);

  if (loading) return <p>Loading venues...</p>;

  return (
    <div>
      <h1>Available Venues</h1>
      <div className="venue-list">
        {venues.map((venue) => (
          <div key={venue.id} className="venue-card">
            <h2>{venue.name}</h2>
            <p>{venue.description}</p>
            <img
              src={venue.media[0]?.url || "https://plus.unsplash.com/premium_photo-1699544856963-49c417549268?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
              alt={venue.media[0]?.alt || venue.name}
            />
            <p>Price: ${venue.price}</p>
            <Link to={`/venue/${venue.id}`} className="btn btn-primary">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
