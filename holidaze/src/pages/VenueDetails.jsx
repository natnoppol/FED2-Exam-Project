import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVenueById } from "../api";
import BookingForm from "../components/BookingForm";
import { toast } from "react-toastify";
import { fallbackImage } from "../api";

const VenueDetails = ({ user }) => {
  const { venueId } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isManager, setIsManager] = useState(false);
  const navigate = useNavigate();

  const handleBookingSuccess = () => {
    toast.success("Booking successful!");
    navigate("/profile");
  };

  const handleEdit = (venueId) => {
    if (!isManager) {
      toast.error("You do not have permission to edit this venue.");
      return;
    }
    navigate(`/admin/manage-venues/${venueId}`);
  };

  const handleDelete = (venueId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this venue?"
    );
    if (!confirmDelete) return;
    
    toast.success(`Venue ${venueId} deleted (not yet implemented)`);
  };

  useEffect(() => {
    if (user?.venueManager) {
      setIsManager(true);
    }

    const fetchVenueDetails = async () => {
      try {
        const data = await getVenueById(venueId);
        setVenue(data);
      } catch (error) {
        setError("Failed to fetch venue details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenueDetails();
  }, [venueId, user]);

  if (loading) return <p>Loading venue details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{venue.name}</h1>
      <p className="text-gray-700 mb-4">{venue.description}</p>

      <img
        src={venue.media[0]?.url || fallbackImage}
        alt={venue.media[0]?.alt || venue.name}
        className="w-full h-64 object-cover rounded mb-4"
      />

      <p className="text-lg font-semibold mb-4">Price: ${venue.price}</p>

      {/* Location Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Location</h2>
        <p>
          {venue.location?.address}, {venue.location?.city},{" "}
          {venue.location?.zip}
        </p>
        <p>
          {venue.location?.country}, {venue.location?.continent}
        </p>
      </div>

      {/* Amenities Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Amenities</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-gray-700">
          <li>{venue.meta?.wifi ? "✔️ WiFi" : "❌ No WiFi"}</li>
          <li>{venue.meta?.parking ? "✔️ Parking" : "❌ No Parking"}</li>
          <li>{venue.meta?.breakfast ? "✔️ Breakfast" : "❌ No Breakfast"}</li>
          <li>{venue.meta?.pets ? "✔️ Pet Friendly" : "❌ No Pets"}</li>
        </ul>
      </div>

      {/* Manager Actions or Booking Form */}
      {/* Manager Actions or Booking Form */}
      {isManager && venue.owner?.email === user?.email ? (
        // Venue belongs to this manager
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => handleEdit(venue.id)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Venue
          </button>
          <button
            onClick={() => handleDelete(venue.id)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete Venue
          </button>
        </div>
      ) : (
        // Only show booking form to customers or other users
        <BookingForm
          venue={venue}
          bookings={venue.bookings}
          onBook={handleBookingSuccess}
        />
      )}

      {/* Show Bookings for Venue Manager */}
      {isManager && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Customer Bookings</h3>
          {venue.bookings?.length ? (
            <ul className="space-y-4">
              {venue.bookings.map((booking) => (
                <li key={booking.id} className="border p-4 rounded">
                  <p>
                    <strong>Customer:</strong> {booking.customer?.name}
                  </p>
                  <p>
                    <strong>Dates:</strong>{" "}
                    {new Date(booking.dateFrom).toLocaleDateString()} -{" "}
                    {new Date(booking.dateTo).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Guests:</strong> {booking.guests}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No bookings yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VenueDetails;
