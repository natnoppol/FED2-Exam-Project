import { useState } from "react";


const BookingForm = ({ venue, onBook }) => {
    const [selectedDate, setSelectedDate] = useState(""); // For selected booking date
  const [guestCount, setGuestCount] = useState(1); // Default guest count to 1
  const [totalPrice, setTotalPrice] = useState(venue.price); // Initial total price based on venue price

  // Update total price based on number of guests
  const handleGuestCountChange = (e) => {
    const guestNumber = parseInt(e.target.value, 10);
    setGuestCount(guestNumber);
    setTotalPrice(venue.price * guestNumber); // Assuming price is per guest
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingData = {
      venueId: venue.id,
      bookingDate: selectedDate,
      guestCount,
      totalPrice,
    };
    onBook(bookingData); // Call onBook callback to handle booking logic (e.g., API request)
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl">Book This Venue</h2>

      {/* Date Picker */}
      <div>
        <label htmlFor="bookingDate" className="block text-gray-700">
          Select Booking Date:
        </label>
        <input
          type="date"
          id="bookingDate"
          name="bookingDate"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          required
          className="mt-1 p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Guest Count */}
      <div>
        <label htmlFor="guestCount" className="block text-gray-700">
          Number of Guests:
        </label>
        <input
          type="number"
          id="guestCount"
          name="guestCount"
          value={guestCount}
          onChange={handleGuestCountChange}
          min="1"
          required
          className="mt-1 p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Total Price */}
      <div>
        <p className="text-lg">
          Total Price: ${totalPrice}
        </p>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Book Now
        </button>
      </div>
    </form>
  );
};

export default BookingForm;