import { API_BASE_URL, API_KEY } from "../../config";
import { useState } from "react";
import { getToken } from "../../utils/auth";

const CreateVenueForm = ({ mode = "create", venueData = {}, onSuccess,  onCancel,}) => {
  const [formData, setFormData] = useState({
    name: venueData.name || "",
    description: venueData.description || "",
    price: venueData.price || "",
    maxGuests: venueData.maxGuests || "",
    media: venueData.media || [""],
    location: venueData.location || {
      address: "",
      city: "",
      country: "",
    },
  });

  const venueId = venueData?.id;

  const preparedData = {
    ...formData,
    price: Number(formData.price),
    maxGuests: Number(formData.maxGuests),
    media: Array.isArray(formData.media) ? formData.media : formData.media ? [formData.media] : [], // Ensure media is a flat array
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url =
        mode === "edit" && venueId
          ? `${API_BASE_URL}/holidaze/venues/${venueId}`
          : `${API_BASE_URL}/holidaze/venues`;

      const method = mode === "edit" ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(preparedData),
      });
      if (!res.ok)
        throw new Error(
          `Failed to ${mode === "edit" ? "update" : "create"} venue`
        );
      const venue = await res.json();
      onSuccess(venue);
      onCancel(); // Close form
    } catch (err) {
      console.error(
        `Error ${mode === "edit" ? "updating" : "creating"} venue:`,
        err
      );
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 shadow-md rounded-md mb-6"
    >
      <h2 className="text-xl font-bold mb-4">
        {mode === "edit" ? "Edit Venue" : "Create New Venue"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Venue Name"
          className="border p-2 rounded"
        />
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
          placeholder="Price per night"
          className="border p-2 rounded"
        />
        <input
          name="maxGuests"
          type="number"
          value={formData.maxGuests}
          onChange={handleChange}
          required
          placeholder="Max guests"
          className="border p-2 rounded"
        />
        <input
          name="media"
          value={formData.media.join(",")}
          onChange={(e) =>
            setFormData({
              ...formData,
              media: e.target.value.split(",").map(item => item.trim()),
            })
          }
        />
      </div>

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        placeholder="Description"
        className="border p-2 rounded w-full mt-4"
        rows={4}
      />

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateVenueForm;
