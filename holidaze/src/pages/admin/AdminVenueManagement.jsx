import { API_BASE_URL, API_KEY } from "../../config";
import { useEffect, useState } from "react";
import { getMyVenues } from "../../api";
import { getToken, getUser } from "../../utils/auth";
import VenueCard from "../../components/admin/VenueCard";
import CreateVenueForm from "../../components/admin/CreateVenueForm";
import ErrorBoundary from "../../components/ErrorBoundary";
import { toast } from "react-toastify";
import { DELETE_ERROR_MESSAGE, DELETE_SUCCESS_MESSAGE } from "../../constants";
import { PlusCircle, Hotel, Search } from "lucide-react";

const AdminVenueManagement = () => {
  const [deleteError, setDeleteError] = useState("");
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const token = getToken();
  const user = getUser();

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadMore = () => setVisibleCount((prev) => prev + 6);

  const handleEdit = (venue) => {
    setEditingVenue(venue);
    setShowEditForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchVenues = async () => {
    try {
      if (!user?.name) {
        console.error("User missing or invalid.");
        setLoading(false);
        return;
      }
      const data = await getMyVenues(user.name, token);
      setVenues(data);
    } catch (error) {
      console.error("Failed to fetch venues:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [user?.name, token]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this venue?");
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
        setDeleteError("");
        toast.success(DELETE_SUCCESS_MESSAGE);
        if (editingVenue?.id === id) {
          setEditingVenue(null);
          setShowEditForm(false);
        }
        setLoading(true);
        await fetchVenues();
      }
    } catch (error) {
      console.error("Delete error:", error);
      setDeleteError(DELETE_ERROR_MESSAGE);
      toast.error(DELETE_ERROR_MESSAGE);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Hotel className="text-blue-600" size={32} />
          Venue Manager
        </h1>
        <p className="text-gray-600">Create, edit, and manage your venues easily.</p>
      </header>

      {showEditForm && (
        <div className="mb-8 animate-fade-in">
          <ErrorBoundary>
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
          </ErrorBoundary>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search venues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border border-gray-300 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <button
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition-transform hover:scale-105 cursor-pointer"
          onClick={() => {
            setShowEditForm(true);
            setEditingVenue(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <PlusCircle size={20} />
          New Venue
        </button>
      </div>

      {deleteError && (
        <p className="text-red-600 font-medium mb-4">{deleteError}</p>
      )}

      {loading ? (
        <p className="text-gray-500 text-center">Loading venues...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.slice(0, visibleCount).map((venue) => (
              <div
                key={venue.id}
                className="transition-transform hover:scale-105 animate-fade-in"
              >
                <VenueCard
                  venue={venue}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>

          {filteredVenues.length === 0 && (
            <p className="text-gray-500 text-center mt-6">No venues found.</p>
          )}

          {visibleCount < filteredVenues.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                className="bg-gray-200 text-gray-800 font-medium px-6 py-2 rounded-lg transition hover:text-white hover:bg-blue-600 cursor-pointer"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminVenueManagement;
