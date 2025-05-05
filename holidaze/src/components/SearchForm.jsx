import React, { useState } from "react";

const SearchForm = ({ onSearch }) => {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const trimmedCountry = location.trim();
      await onSearch({
        country: trimmedCountry,
        checkIn,
        checkOut,
        guests,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (new Date(checkIn) >= new Date(checkOut)) {
    alert("Check-out must be after Check-in");
    setIsSubmitting(false);
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-4 bg-white rounded-lg shadow-lg ${
        isSubmitting ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <h2 className="text-xl font-semibold mb-4">Find Venues</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Country
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Country"
            className="w-full p-2 border rounded"
            required
            aria-labelledby="location-label"
          />
        </div>
        <div>
          <label htmlFor="check-in" className="block text-sm font-medium mb-1">
            Check-In
          </label>
          <input
            type="date"
            id="check-in"
            name="check-in"
            value={checkIn}
            min={today}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="check-out" className="block text-sm font-medium mb-1">
            Check-Out
          </label>
          <input
            type="date"
            id="check-out"
            name="check-out"
            value={checkOut}
            min={checkIn || today}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="guests" className="block text-sm font-medium mb-1">
            Guests 1-10
          </label>
          <select
            id="guests"
            name="guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            {[...Array(10).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i + 1 === 1 ? "Guest" : "Guests"}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? "Searching..." : "Search"}
        </button>
        <button
          type="button"
          onClick={() => {
            setLocation("");
            setCheckIn("");
            setCheckOut("");
            setGuests(1);
          }}
          className="ml-4 text-black bg-gray-100 border border-blue-600 px-6 py-2 rounded hover:bg-white"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
