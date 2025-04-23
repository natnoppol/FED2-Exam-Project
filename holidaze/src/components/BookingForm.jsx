import { useState } from "react";
import { toast } from "react-toastify";
import { API_BASE_URL, API_KEY } from "../config";
import { getToken } from "../utils/auth"; // Assuming you have a utility function to get the token
import DatePicker from "react-datepicker";
import { isWithinInterval, parseISO } from "date-fns";


const BookingForm = ({ venue, bookings = [], onBook }) => {
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [guests, setGuests] = useState(1);

  // Create array of all disabled dates from existing bookings
  const disabledDates = bookings.flatMap((booking) => {
    const start = new Date(booking.dateFrom);
    const end = new Date(booking.dateTo);
    const days = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    
    return days;
  });


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dateFrom || !dateTo) {
      toast.error("Please select both start and end dates.");
      return;
    }

    if (guests > venue.maxGuests) {
      toast.error(`Max allowed guests: ${venue.maxGuests}`);
      return;
    }

    const hasOverlap = bookings.some((booking) =>
      isWithinInterval(dateFrom, {
        start: parseISO(booking.dateFrom),
        end: parseISO(booking.dateTo),
      }) ||
      isWithinInterval(dateTo, {
        start: parseISO(booking.dateFrom),
        end: parseISO(booking.dateTo),
      })
    );
    
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
          // Specific handling for conflict errors (overlap or too many guests)
          toast.error(errorMsg);
        } else {
          toast.error(errorMsg);
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
          onChange={(e) => setGuests(parseInt(e.target.value))}
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