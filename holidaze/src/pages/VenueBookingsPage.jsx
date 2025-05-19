import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getToken } from "../utils/auth"; 
import { API_BASE_URL, API_KEY } from "../config";
import { Spinner } from "../components/Spinner"; 
import { toast } from "react-toastify"; 
import { FaCalendarCheck } from "react-icons/fa";
import { BOOKINGS_PER_PAGE } from "../constants";

const VenueBookingsPage = () => {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [venueName, setVenueName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
   const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchVenueBookings = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/holidaze/venues/${id}?_bookings=true`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
              "X-Noroff-API-Key": API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch venue bookings");
        }

        const data = await response.json();
        setVenueName(data.data.name);
        setBookings(data.data.bookings || []);
      } catch (err) {
        setError(err.message);
        toast.error(`Error fetching bookings: ${err.message}`);
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenueBookings();
  }, [id, API_KEY]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-600 text-center mt-8">{error}</p>;

   const sortedBookings = bookings
    .slice()
    .sort((a, b) => new Date(b.dateFrom) - new Date(a.dateFrom));

   //  Pagination logic
  const totalPages = Math.ceil(sortedBookings.length / BOOKINGS_PER_PAGE);
  const startIndex = (currentPage - 1) * BOOKINGS_PER_PAGE;
  const currentBookings = sortedBookings.slice(startIndex, startIndex + BOOKINGS_PER_PAGE);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <FaCalendarCheck className="text-blue-600" />
        Bookings for "{venueName}" ({bookings.length})
      </h2>

      {bookings.length === 0 ? (
        <p>No bookings yet for this venue.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {currentBookings.map((booking) => (
              <li key={booking.id} className="p-4 border rounded bg-gray-50 shadow-sm">
                <p><strong>Customer:</strong> {booking.customer.name}</p>
                <p><strong>Guests:</strong> {booking.guests}</p>
                <p><strong>From:</strong> {new Date(booking.dateFrom).toLocaleDateString()}</p>
                <p><strong>To:</strong> {new Date(booking.dateTo).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>

          {/* ✅ Pagination controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-700 cursor-pointer"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-700 cursor-pointer rounded disabled:opacity-50 "
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VenueBookingsPage;