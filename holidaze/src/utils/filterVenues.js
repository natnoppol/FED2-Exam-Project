

export const filterVenues = (venues, { country, guests }) => {
  if (!venues || !Array.isArray(venues)) return [];

  const lowerCountry = country?.toLowerCase().trim() || "";
  const minGuests = guests || 1;

  return venues.filter((venue) => {
    const locationMatch =
      lowerCountry === "" ||
      venue.location?.country?.toLowerCase().includes(lowerCountry) ||
      venue.location?.city?.toLowerCase().includes(lowerCountry) ||
      venue.location?.continent?.toLowerCase().includes(lowerCountry);

    const guestsMatch = venue.maxGuests >= minGuests;

    return locationMatch && guestsMatch;
  });
};

