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
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const itemsPerPage = 9; // Number of items per page (you can adjust this)

  const user = getUser();
  const token = getToken();

  useEffect(() => {
    if (!user?.name || !token) {
      setError("Missing user info or token");
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      const loadingToast = toast.loading("Loading bookings...");
      try {
        const response = await fetch(
          `${API_BASE_URL}/holidaze/profiles/${encodeURIComponent(
            user.name
          )}/bookings?_venue=true`,
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
          throw new Error(
            `Failed to fetch bookings: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setBookings(data.data);
        setFilteredBookings(data.data);
        data.data.length === 0
          ? toast.info("No bookings found for this user.")
          : toast.success("Bookings fetched successfully!");
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings. Please try again later.");
        toast.error("Failed to fetch bookings. Please try again later.");
      } finally {
        toast.dismiss(loadingToast);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.name, token]);

  useEffect(() => {
    const query = search.toLowerCase();
    const filtered = bookings.filter((booking) =>
      (booking.venue?.name || "").toLowerCase().includes(query)
    );
    setFilteredBookings(filtered);
  }, [search, bookings]);

  // Pagination logic
  const indexOfLastBooking = currentPage * itemsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmCancel) return;

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

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage));

  if (loading) return <p>Loading bookings...</p>;

  if (error) {
    return (
      <div
        role="alert"
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
      >
        <strong className="font-bold">Error:</strong> <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Bookings</h2>

      <input
        type="text"
        aria-label="Search bookings by venue name"
        placeholder="Search by venue name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-6 border rounded"
      />

      {filteredBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {currentBookings.map((booking) => (
            <AdminBookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-l-md hover:bg-blue-600 cursor-pointer"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">{`${currentPage} / ${totalPages}`}</span>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-r-md hover:bg-blue-600 cursor-pointer"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminBookings;
