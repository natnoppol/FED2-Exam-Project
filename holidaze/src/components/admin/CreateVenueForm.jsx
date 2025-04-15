const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import { useState } from "react";

const CreateVenueForm = ({ token, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "0", // Initialized as a string so it's easy to bind to input fields
    maxGuests: "1", // Default minimum 1 guest
    media: "",
    location: {
      address: "",
      city: "",
      country: "",
    },
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
  });
  

  const preparedData = {
    ...formData,
    price: Number(formData.price),
    maxGuests: Number(formData.maxGuests),
    media: formData.media ? [formData.media] : [], // Convert to array if needed
  };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "media" ? [value] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { 
      const res = await fetch(`${API_BASE_URL}/holidaze/venues`, {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(preparedData),
      });

      if (!res.ok) throw new Error("Failed to create venue");

      const newVenue = await res.json();


      onSuccess(newVenue);
      onCancel(); // Close form

    } catch (err) {
      console.error("Error creating venue:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded-md mb-6">
      <h2 className="text-xl font-bold mb-4">Create New Venue</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" value={formData.name} onChange={handleChange} required placeholder="Venue Name" className="border p-2 rounded" />
        <input name="price" type="number" value={formData.price} onChange={handleChange} required placeholder="Price per night" className="border p-2 rounded" />
        <input name="maxGuests" type="number" value={formData.maxGuests} onChange={handleChange} required placeholder="Max guests" className="border p-2 rounded" />
        <input name="media" value={formData.media} onChange={handleChange} required placeholder="Image URL" className="border p-2 rounded" />
      </div>

      <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Description" className="border p-2 rounded w-full mt-4" rows={4} />

      <div className="flex gap-2 mt-4">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Create</button>
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
      </div>
    </form>
  );
};

export default CreateVenueForm;