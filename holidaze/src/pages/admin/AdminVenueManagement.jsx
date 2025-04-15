const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const LOGGING_ENABLED = import.meta.env.VITE_LOGGING_ENABLED === "true";

import { useEffect, useState } from "react";
import { getMyVenues } from "../../api";
import { getToken, getUser } from "../../utils/auth"; // Adjust the import path as necessary

const AdminVenueManagement = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = getToken();
  const user = getUser();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const data = await getMyVenues(user.name, token);
        setVenues(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [token, user.name]);

  if (loading) return <p>Loading venues...</p>;

  return (
    <div>
    <h1>My Venues</h1>
    {/* Render your venue list */}
    {venues.map((venue) => (
      <div key={venue.id}>
        <h2>{venue.name}</h2>
        {/* ...other details */}
      </div>
    ))}
  </div>
);
};

export default AdminVenueManagement;