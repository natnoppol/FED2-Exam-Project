// src/pages/admin/AdminVenueManagement.jsx
import React from 'react';

const AdminVenueManagement = () => {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Manage Your Venues</h1>
      <div className="mb-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
          Add New Venue
        </button>
      </div>
      <div className="space-y-4">
        {/* Example venue list */}
        <div className="border p-4 rounded-md shadow-md">
          <h3 className="text-xl font-bold">Venue 1</h3>
          <p>Location: City A</p>
          <button className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-md">
            Edit Venue
          </button>
        </div>
        <div className="border p-4 rounded-md shadow-md">
          <h3 className="text-xl font-bold">Venue 2</h3>
          <p>Location: City B</p>
          <button className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-md">
            Edit Venue
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminVenueManagement;
