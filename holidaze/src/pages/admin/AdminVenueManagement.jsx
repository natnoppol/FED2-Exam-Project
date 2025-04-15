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
    <button
  onClick={() => setShowCreateForm(!showCreateForm)}
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
  {showCreateForm ? "Cancel" : "+ Create Venue"}
</button>

{showCreateForm && (
  <CreateVenueForm
    token={token}
    onSuccess={(newVenue) => setVenues((prev) => [...prev, newVenue])}
    onCancel={() => setShowCreateForm(false)}
  />
)}
  );
};

export default AdminVenueManagement;
