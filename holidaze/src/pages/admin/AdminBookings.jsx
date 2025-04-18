import React, { useEffect, useState } from "react";
import { getToken, getUser } from "../../utils/auth";
import { API_BASE_URL, API_KEY } from "../../config";
import { toast } from "react-toastify";
import AdminBookingCard from "../../components/admin/AdminBookingCard";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [search, setSearch] = useState("");

  const user = getUser();
  const token = getToken();

  useEffect(() => {
    if (!user?.name || !token) {
      setError("Missing user info or token");
      setLoading(false);
      return;
    }
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/holidaze/profiles/${encodeURIComponent(user.name)}/bookings?_venue=true`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": API_KEY,
            },
          }
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch bookings: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setBookings(data.data);
        setFilteredBookings(data.data); // Initialize filtered bookings
        if (data.data.length === 0) {
          toast.info("No bookings found for this user.");
        } else {
          toast.success("Bookings fetched successfully!");
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching bookings:", error);
        toast.error("Failed to fetch bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.name, token]);

  // Handle search
  useEffect(() => {
    const query = search.toLowerCase();
    const filtered = bookings.filter((booking) =>
        (booking.venue?.name || '').toLowerCase().includes(query)
    );
    setFilteredBookings(filtered);
  }, [search, bookings]);

  const handleCancel = async (bookingId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/holidaze/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": API_KEY,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to cancel booking");
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      toast.success("Booking cancelled successfully!");
    } catch (error) {
      console.error("Cancel failed:", error);
      setError("Failed to cancel booking. Please try again later.");
      toast.error("Failed to cancel booking. Please try again later.");
    }
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Bookings</h2>
      <input
        type="text"
        placeholder="Search by venue name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      {filteredBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredBookings.map((booking) => (
           
           <AdminBookingCard
             key={booking.id}
             booking={booking}
             onCancel={handleCancel}
           />

          ))}
        </ul>

      )}
    </div>
  );
}

export default AdminBookings;
