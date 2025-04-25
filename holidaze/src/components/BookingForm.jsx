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
      venueId: venue.id,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/holidaze/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
          "X-Noroff-API-Key": API_KEY,
        }, body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (!response.ok) {
        const errorMsg = json.errors?.[0]?.message || "Booking failed";
      
        if (response.status === 409) {
          toast.error(`Selected dates overlap with an existing booking. ${errorMsg}`);
        }
        return;
      }
      

      toast.success("Booking successful!");
      onBook?.(json); // optional callback to refresh or redirect
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getNights = () => {
    if (!dateFrom || !dateTo) return 0;
    const diff = Math.ceil((dateTo - dateFrom) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };
  
  const totalPrice = getNights() * venue.price;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Book This Venue</h2>

      <div>
        <label className="block">From:</label>
        <DatePicker
          selected={dateFrom}
          onChange={(date) => setDateFrom(date)}
          excludeDates={disabledDates}
          minDate={new Date()}
          selectsStart
          startDate={dateFrom}
          endDate={dateTo}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
          placeholderText="Select start date"
        />
      </div>

      <div>
        <label className="block">To:</label>
        <DatePicker
          selected={dateTo}
          onChange={(date) => setDateTo(date)}
          excludeDates={disabledDates}
          minDate={dateFrom || new Date()}
          selectsEnd
          startDate={dateFrom}
          endDate={dateTo}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
          placeholderText="Select end date"
        />
      </div>

      <div>
        <label className="block">Guests (max {venue.maxGuests}):</label>
        <input
          type="number"
          name="guests"
          value={guests}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value) && value >= 1 && value <= venue.maxGuests) {
              setGuests(value);
            } else if (e.target.value === "") {
              setGuests(1); // Optional fallback to default
            }
          }}
          min={1}
          max={venue.maxGuests}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
        />
      </div>

      {getNights() > 0 && (
  <div>
    <p>{getNights()} nights × ${venue.price} = <strong>${totalPrice}</strong></p>
  </div>
)}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Book Now
      </button>
    </form>
  );
};

export default BookingForm;