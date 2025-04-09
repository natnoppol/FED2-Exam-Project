// src/pages/admin/AdminDashboard.jsx
import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome to the admin panel. Here, you can manage your venues, bookings, and more.</p>
      <div className="mt-6">
        <button className="px-4 py-2 bg-green-500 text-white rounded-md">
          Create New Venue
        </button>
        <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md">
          View Bookings
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
