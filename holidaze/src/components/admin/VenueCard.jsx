import React from "react";

const handleEdit = (venue) => {
    setFormData(venue);      // Populate formData to update the form fields
    setShowCreateForm(true); // Or toggle into edit mode
  };
  
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this venue?")) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Refresh the venue list
        setVenues((prev) => prev.filter((v) => v.id !== id));
      } catch (err) {
        console.error("Failed to delete venue:", err);
      }
    }
  };
  

export default function VenueCard({ venue, onEdit, onDelete }) {
    
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden p-4 flex flex-col justify-between">
    <img
      src={venue.media?.[0]?.url || "https://via.placeholder.com/400x200"}
      alt={venue.media?.[0]?.alt || venue.name}
      className="w-full h-40 object-cover rounded"
    />

    <div className="mt-4">
      <h2 className="text-lg font-semibold">{venue.name}</h2>
      <p className="text-sm text-gray-600 line-clamp-2">{venue.description}</p>
      <p className="mt-1 font-medium">Price: ${venue.price}</p>
      <p className="text-sm text-gray-500">Max Guests: {venue.maxGuests}</p>
    </div>

    <div className="flex justify-between mt-4">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => onEdit(venue)}
      >
        Edit
      </button>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={() => onDelete(venue.id)}
      >
        Delete
      </button>
    </div>
  </div>

  );
}
