import { API_BASE_URL, API_KEY } from "../../config";
import { useEffect, useState } from "react";
import { getMyVenues } from "../../api";
import { getToken, getUser } from "../../utils/auth";
import VenueCard from "../../components/admin/VenueCard";
import CreateVenueForm from "../../components/admin/CreateVenueForm";
import ErrorBoundary from "../../components/ErrorBoundary";
import { toast } from "react-toastify";
import { DELETE_ERROR_MESSAGE, DELETE_SUCCESS_MESSAGE } from "../../constants";

const AdminVenueManagement = () => {
  const [deleteError, setDeleteError] = useState(""); // state for delete error
  const [venues, setVenues] = useState([]); // state for venues
  const [loading, setLoading] = useState(true); // loading state for venues
  const [showEditForm, setShowEditForm] = useState(false); // for showing the edit form
  const [editingVenue, setEditingVenue] = useState(null); // for editing a venue
  const [searchTerm, setSearchTerm] = useState(""); // for search functionality
  const [visibleCount, setVisibleCount] = useState(6); // show 6 venues at a time
  const loadMore = () => setVisibleCount((prev) => prev + 6); // load 6 more venues

  const token = getToken();
  const user = getUser();

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (venue) => {
    setEditingVenue(venue);
    setShowEditForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Optional: scroll to form
  };

  const fetchVenues = async () => {
    try {
      if (!user?.name) {
        console.error(
          "User is null or does not have a name. Cannot fetch venues."
        );
        setLoading(false);
        return;
      }
      const data = await getMyVenues(user.name, token);
      setVenues(data); // Assuming your API helper returns the .data array
    } catch (error) {
      console.error("Failed to fetch venues:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [user?.name, token]); // Fetch venues when user name or token changes
  if (loading) return <p>Loading venues...</p>;

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this venue?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE_URL}/holidaze/venues/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error(DELETE_ERROR_MESSAGE, errorData);
        setDeleteError(DELETE_ERROR_MESSAGE);
        toast.error(DELETE_ERROR_MESSAGE);
      } else {
        setVenues((prev) => prev.filter((v) => v.id !== id));
        setDeleteError(""); // Clear error if delete was successful
        toast.success(DELETE_SUCCESS_MESSAGE);
      }
    } catch (error) {
      console.error("Delete error:", error);
      setDeleteError(DELETE_ERROR_MESSAGE);
      toast.error(DELETE_ERROR_MESSAGE);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search venues..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border px-3 py-2 rounded mb-4 w-full md:w-1/2"
      />
      <h1>My Venues</h1>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
        onClick={() => {
          setShowEditForm(true);
          setEditingVenue(null); // break loading old venue
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        Create New Venue
      </button>

      {deleteError && <p className="text-red-600 mb-4">{deleteError}</p>}

      {/* Render your venue list */}
      {filteredVenues.slice(0, visibleCount).map((venue) => (
        <VenueCard
          key={venue.id}
          venue={venue}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
      
      {visibleCount < filteredVenues.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMore}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Load More
          </button>
        </div>
      )}

      {showEditForm && (
        <ErrorBoundary>
          <CreateVenueForm
            mode={editingVenue ? "edit" : "create"}
            venueData={editingVenue}
            onSuccess={() => {
              fetchVenues(); // loading new venues after edit/create
              setShowEditForm(false);
              setEditingVenue(null);
            }}
            onCancel={() => {
              setShowEditForm(false);
              setEditingVenue(null);
            }}
          />
        </ErrorBoundary>
      )}
    </div>
  );
};

export default AdminVenueManagement;
