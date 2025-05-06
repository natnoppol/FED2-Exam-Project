import React, { useState } from "react";
import { useEffect } from "react";

const SearchForm = ({ onSearch }) => {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMobileFields, setShowMobileFields] = useState(false);

  useEffect(() => {
    setShowMobileFields(location.trim().length > 0);
  }, [location]);

  const resetForm = () => {
    setLocation("");
    setCheckIn("");
    setCheckOut("");
    setGuests(1);
    onSearch({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const trimmedCountry = location.trim();
      if (new Date(checkOut) <= new Date(checkIn)) {
        alert("Check-Out must be after Check-In.");
        setIsSubmitting(false);
        return;
      }
      await onSearch({ country: trimmedCountry, checkIn, checkOut, guests });
    } finally {
      setIsSubmitting(false);
    }
  };

// Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];



  return (
    <form
      onSubmit={handleSubmit}
      className={`p-4 sm:p-6 bg-white rounded-lg shadow-lg space-y-4 ${
        isSubmitting ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <h2 className="text-xl font-semibold mb-4">Find Venues</h2>

      {/* Country Field - Always visible */}
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
          aria-label="Country"
        />
      </div>

      {/* Remaining Fields - Always shown on desktop, conditionally shown on mobile */}
      <div
        className={`
          overflow-hidden transition-all duration-500
          ${showMobileFields ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}
          sm:max-h-none sm:opacity-100 sm:block
        `}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">

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

        <div className="mt-4 grid grid-cols-1 sm:flex sm:justify-center gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer"
          >
            {isSubmitting ? "Searching..." : "Search"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="w-full sm:w-auto text-black bg-gray-100 border border-blue-600 px-6 py-2 rounded hover:bg-white cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;