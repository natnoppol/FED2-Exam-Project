import { useEffect, useState } from "react";
import { getToken, getUser } from "../../utils/auth";
import CreateVenueForm from "../../components/admin/CreateVenueForm";

const AdminVenueManagement = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = getToken();
  const user = getUser();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    maxGuests: "",
    media: [""],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "media" ? [value] : value,
    }));
  };

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${user.name}/venues?_bookings=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch venues");

        const data = await res.json();
        console.log("data of venues", data);

        setVenues(data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [token, user.name]);

  if (loading) return <p className="text-center">Loading venues...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Venues</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Create Venue
        </button>
      </div>

      {showCreateForm && (
        <CreateVenueForm
          token={token}
          onSuccess={(newVenue) => setVenues((prev) => [...prev, newVenue])}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {venues.length === 0 ? (
        <p>You haven't created any venues yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <div key={venue.id} className="border rounded-xl p-4 shadow-md">
              <img
                src={venue.media?.[0] || "https://placehold.co/400x250"}
                alt={venue.name}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <h2 className="text-lg font-semibold">{venue.name}</h2>
              <p className="text-sm text-gray-600 mb-2">
                💲{venue.price} / night
              </p>

              <div className="flex justify-between mt-4">
                <button className="text-sm text-blue-600 hover:underline">
                  Edit
                </button>
                <button className="text-sm text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 shadow-md rounded-md mb-6"
        >
          <h2 className="text-xl font-bold mb-4">Create New Venue</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Venue Name"
              required
              className="border p-2 rounded"
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price per night"
              required
              className="border p-2 rounded"
            />
            <input
              type="number"
              name="maxGuests"
              value={formData.maxGuests}
              onChange={handleChange}
              placeholder="Max guests"
              required
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="media"
              value={formData.media[0]}
              onChange={handleChange}
              placeholder="Image URL"
              required
              className="border p-2 rounded"
            />
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="border p-2 rounded w-full mt-4"
            rows={4}
          />

          <button
            type="submit"
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create Venue
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminVenueManagement;
