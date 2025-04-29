import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getToken } from "../utils/auth"; // Adjust path as needed
import { API_BASE_URL, API_KEY } from "../config";

const VenueBookingsPage = () => {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [venueName, setVenueName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setVenueName(data.name);
        setBookings(Array.isArray(data.bookings) ? data.bookings : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenueBookings();
  }, [id]);

  if (loading) return <p className="text-center mt-8">Loading bookings...</p>;
  if (error) return <p className="text-red-600 text-center mt-8">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">
        Bookings for "{venueName}"
      </h2>
      {bookings.length === 0 ? (
        <p>No bookings yet for this venue.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="p-4 border rounded bg-gray-50 shadow-sm"
            >
              <p>
                <strong>Customer:</strong> {booking.customer.name}
              </p>
              <p>
                <strong>Guests:</strong> {booking.guests}
              </p>
              <p>
                <strong>From:</strong>{" "}
                {new Date(booking.dateFrom).toLocaleDateString()}
              </p>
              <p>
                <strong>To:</strong>{" "}
                {new Date(booking.dateTo).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VenueBookingsPage;
