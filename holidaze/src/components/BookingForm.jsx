import { useState } from "react";
import { toast } from "react-toastify";
import { API_BASE_URL, API_KEY } from "../config";
import { getToken } from "../utils/auth"; // Assuming you have a utility function to get the token
import DatePicker from "react-datepicker";
import { parseISO } from "date-fns";
import { generateDisabledDates } from "../utils/bookingUtils";

const BookingForm = ({ venue, bookings = [], onBook }) => {
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [guests, setGuests] = useState(1);
  const disabledDates = generateDisabledDates(bookings);
  const [loading, setLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dateFrom || !dateTo) {
      toast.error("Please select both start and end dates.");
      return;
    }

    if (dateTo <= dateFrom) {
      toast.error("End date must be after the start date.");
      return;
    }

    if (guests > venue.maxGuests) {
      toast.error(`Max allowed guests: ${venue.maxGuests}`);
      return;
    }

    const hasOverlap = bookings.some((booking) => {
      const bookingStart = parseISO(booking.dateFrom);
      const bookingEnd = parseISO(booking.dateTo);
      return dateFrom < bookingEnd && dateTo > bookingStart;
    });

    // Check if the selected dates overlap with any existing bookings
    if (hasOverlap) {
      toast.error("Selected dates overlap with an existing booking.");
      return;
    }

    const payload = {
      dateFrom: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
      guests: parseInt(guests, 10),
      venueId: venue.id || "",
    };

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/holidaze/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (!response.ok) {
        const errorMsg = json.errors?.[0]?.message || json.message || "Booking failed";

        if (response.status === 409) {
          toast.error(
            `Selected dates overlap with an existing booking. ${errorMsg}`
          );
        }
        return;
      }

      toast.success("🎉 Booking confirmed! We'll see you soon.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      setBookingComplete(true);
      onBook?.(json); // optional callback to refresh or redirect
      setDateFrom(null);
      setDateTo(null);
      setGuests(1);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getNights = () => {
    if (!dateFrom || !dateTo) return 0;
    const diff = Math.ceil((dateTo - dateFrom) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const totalPrice = getNights() * venue.price;

  return (
    bookingComplete ? (
      <p className="text-green-600 text-center mt-6 text-lg font-semibold">
        🎉 Thanks for booking! We'll see you soon.
      </p>
    ) : (
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-md max-w-md mx-auto mt-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          Book This Venue
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From:
          </label>
          <DatePicker
            selected={dateFrom}
            onChange={(date) => setDateFrom(date)}
            excludeDates={disabledDates}
            minDate={new Date()}
            selectsStart
            startDate={dateFrom}
            endDate={dateTo}
            className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-2 text-gray-800"
            placeholderText="Select start date"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To:
          </label>
          <DatePicker
            selected={dateTo}
            onChange={(date) => setDateTo(date)}
            excludeDates={disabledDates}
            minDate={dateFrom || new Date()}
            selectsEnd
            startDate={dateFrom}
            endDate={dateTo}
            className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-2 text-gray-800"
            placeholderText="Select end date"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Guests <span className="text-gray-500">(max {venue.maxGuests})</span>:
          </label>
          <input
            type="number"
            name="guests"
            value={guests}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value) && value >= 1 && value <= venue.maxGuests) {
                setGuests(value);
              } else if (e.target.value === "") {
                setGuests(1);
              }
            }}
            min={1}
            max={venue.maxGuests}
            className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-2 text-gray-800"
          />
        </div>

        {getNights() > 0 && (
          <div className="fade-in bg-blue-50 p-3 rounded-md text-blue-800 font-medium transition-all duration-300">
            {getNights()} night{getNights() > 1 ? "s" : ""} × ${venue.price} ={" "}
            <strong>${totalPrice}</strong>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Booking..." : "Book Now"}
        </button>
      </form>
    )
  );
};

export default BookingForm;
