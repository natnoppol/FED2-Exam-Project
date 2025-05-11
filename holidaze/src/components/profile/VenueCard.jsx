import React from 'react';
import VenueCard from '../common/VenueCard'; // Adjust path as needed

const MyVenuesTab = ({ venues }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">My Venues</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </div>
  );
};

export default MyVenuesTab;
