import React, { useState } from "react";

const SearchForm = ({ onSearch }) => {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1); // default to 1 guest

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ country: location, checkIn, checkOut, guests });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Search Venues</h2>

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
            placeholder="e.g. Norway, USA"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="check-in" className="block text-sm font-medium mb-1">
            Check-in
          </label>
          <input
            type="date"
            id="check-in"
            name="check-in"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="check-out" className="block text-sm font-medium mb-1">
            Check-out
          </label>
          <input
            type="date"
            id="check-out"
            name="check-out"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="guests" className="block text-sm font-medium mb-1">
            Guests
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
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
