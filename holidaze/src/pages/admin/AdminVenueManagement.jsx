import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreateVenueForm from "../../components/admin/CreateVenueForm";
import VenueCard from "../../components/admin/VenueCard";
import { useVenuesByManager } from "../../hooks/useVenuesByManager";
import { getUser } from "../../utils/auth";
import { getVenueById, deleteVenue as apiDeleteVenue } from "../../api";
import { toast } from "react-toastify";
import { Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { Spinner } from "../../components/Spinner";

const PaginationControls = ({ currentPage, totalPages, handlePrevPage, handleNextPage }) => (
  <div className="flex justify-center mt-8 space-x-2">
    <button
      onClick={handlePrevPage}
      disabled={currentPage === 1}
      className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-blue-600 hover:text-white cursor-pointer disabled:opacity-50"
    >
      <ArrowLeft size={16} /> Previous
    </button>
    <span className="px-4 py-2 self-center">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={handleNextPage}
      disabled={currentPage === totalPages}
      className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-blue-600 hover:text-white cursor-pointer disabled:opacity-50"
    >
      Next <ArrowRight size={16} />
    </button>
  </div>
);

const AdminVenueManagement = () => {
  const { venueIdParam } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(getUser());
  }, []);

  const {
    venues: managerVenues,
    loadingVenues,
    error: venuesError,
    currentPage,
    totalPages,
    handlePrevPage,
    handleNextPage,
    fetchVenuesByManager,
  } = useVenuesByManager(currentUser?.name);

  const [showForm, setShowForm] = useState(false);
  const [venueToEdit, setVenueToEdit] = useState(null);
  const [isLoadingVenueForEdit, setIsLoadingVenueForEdit] = useState(false);

  useEffect(() => {
    if (venueIdParam) {
      const loadVenueForEdit = async () => {
        setIsLoadingVenueForEdit(true);
        setShowForm(true);
        try {
          const data = await getVenueById(venueIdParam);
          setVenueToEdit(data);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
          toast.error("Failed to load venue data for editing.", error);
          navigate("/admin/manage-venues", { replace: true });
        } finally {
          setIsLoadingVenueForEdit(false);
        }
      };
      loadVenueForEdit();
    }
  }, [venueIdParam, navigate]);

  const handleEditClick = (venue) => {
    setVenueToEdit(venue);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddNewClick = () => {
    setVenueToEdit(null);
    setShowForm(true);
    if (venueIdParam) navigate("/admin/manage-venues", { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setVenueToEdit(null);
    toast.success(venueToEdit ? "Venue updated successfully!" : "Venue created successfully!");
    if (fetchVenuesByManager) fetchVenuesByManager(1);
    navigate("/admin/manage-venues", { replace: true });
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setVenueToEdit(null);
    if (venueIdParam) {
      navigate("/admin/manage-venues", { replace: true });
    }
  };

  const handleDeleteVenue = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this venue? This action cannot be undone.")
    ) {
      try {
        await apiDeleteVenue(id);
        toast.success("Venue deleted successfully!");
        if (fetchVenuesByManager) fetchVenuesByManager(currentPage);
      } catch (error) {
        toast.error(error?.message || "Failed to delete venue.");
      }
    }
    // Tip: consider replacing this with a custom modal confirmation for better UX
  };

  if (loadingVenues && !showForm && !venueIdParam) {
    return <Spinner message="Loading venue details..." />;
  }

  if (venuesError && !showForm) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading venues: {venuesError}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {showForm ? (venueToEdit ? "Edit Venue" : "Create New Venue") : "Manage Your Venues"}
        </h1>
        {!showForm && (
          <button
            onClick={handleAddNewClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus size={20} />
            Add New Venue
          </button>
        )}
      </div>

      {showForm ? (
        isLoadingVenueForEdit ? (
          <div className="text-center py-10">Loading venue data for editing...</div>
        ) : (
          <CreateVenueForm
            mode={venueToEdit ? "edit" : "create"}
            venueData={venueToEdit || {}}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )
      ) : (
        <>
          {managerVenues?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {managerVenues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  onEdit={() => handleEditClick(venue)}
                  onDelete={() => handleDeleteVenue(venue.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 mt-10">
              You haven't created any venues yet. Click "Add New Venue" to get started!
            </p>
          )}

          {managerVenues?.length > 0 && totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              handlePrevPage={handlePrevPage}
              handleNextPage={handleNextPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AdminVenueManagement;
