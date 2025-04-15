import { useEffect, useState } from "react";
import { getMyVenues } from "../../api";
import { getToken, getUser } from "../../utils/auth"; 
import VenueCard from "../../components/admin/VenueCard";

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
       <VenueCard
       key={venue.id}
       venue={venue}
       onEdit={handleEdit}
       onDelete={handleDelete}
     />
    ))}
  </div>

  
);
};

export default AdminVenueManagement;