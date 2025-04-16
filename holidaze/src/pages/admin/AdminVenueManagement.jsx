import { API_BASE_URL, apiKey } from "../../config";
import { useEffect, useState } from "react";
import { getMyVenues } from "../../api";
import { getToken, getUser } from "../../utils/auth";
import VenueCard from "../../components/admin/VenueCard";
import CreateVenueForm from "../../components/admin/CreateVenueForm";

const AdminVenueManagement = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = getToken();
  const user = getUser();

  const [showEditForm, setShowEditForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const handleEdit = (venue) => {
    setEditingVenue(venue);
    setShowEditForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Optional: scroll to form
  };

  const fetchVenues = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/holidaze/profiles/${user.name}/venues?_bookings=true`, {
        headers: {
             Authorization: `Bearer ${token}`,
             "X-Noroff-API-Key": apiKey,
        },
      });
      const data = await res.json();
      setVenues(data.data);
    } catch (error) {
      console.error("Failed to fetch venues:", error);
    } finally {
      setLoading(false);
  };
 
  useEffect(() => {
    fetchVenues();
  }, []);

  if (loading) return <p>Loading venues...</p>;

  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this venue?"
    );
    if (!confirmDelete) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/holidaze/venues/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,

          },
        }
      );

      if (response.ok) {
        setVenues((prev) => prev.filter((v) => v.id !== id));
      } else {
        console.error("Failed to delete venue");
      }
    } catch (error) {
      console.error("Error deleting venue:", error);
    }
  };

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

{showEditForm && (
  <CreateVenueForm
    mode={editingVenue ? "edit" : "create"}
    venueData={editingVenue}
    onSuccess={() => {
      fetchVenues();
      setShowEditForm(false);
      setEditingVenue(null);
    }}
    onCancel={() => {
      setShowEditForm(false);
      setEditingVenue(null);
    }}
  />
)}


    </div>
  );
};

export default AdminVenueManagement;
