import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Holidaze</h1>
      <div className="venue-list">
        {/* Example static list, replace with dynamic data later */}
        <div>
          <h2>Venue 1</h2>
          <Link to="/venue/1">View Details</Link>
        </div>
        <div>
          <h2>Venue 2</h2>
          <Link to="/venue/2">View Details</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;