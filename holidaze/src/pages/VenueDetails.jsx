import React from 'react';
import { useParams } from 'react-router-dom';

const VenueDetails = () => {
  const { id } = useParams(); // Get venue id from the URL
  return (
    <div>
      <h1>Venue {id} Details</h1>
      {/* You can fetch and display data for the venue here */}
    </div>
  );
};

export default VenueDetails;