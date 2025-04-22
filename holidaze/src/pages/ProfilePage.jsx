import React, { useEffect, useState } from "react";
import { getUser, getToken } from "../utils/auth";
import { Link } from "react-router-dom";
import { API_BASE_URL, API_KEY } from "../config";
import { updateProfile } from "../api";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: "",
    avatar: "",
    banner: "",
    venueManager: false,
  });

  useEffect(() => {
    const profileData = getUser();
    setUser(profileData);

    if (profileData) {
      setFormData({
        bio: profileData?.bio || "",
        avatar: profileData?.avatar?.url || "",
        banner: profileData?.banner?.url || "",
        venueManager: profileData?.venueManager || false,
      });
    }

    if (profileData?.name) {
      const fetchProfile = async () => {
        try {
          const data = await fetch(
            `${API_BASE_URL}/holidaze/profiles/${encodeURIComponent(
              profileData.name
            )}/bookings?_venue=true`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
                "X-Noroff-API-Key": API_KEY,
              },
            }
          );
          const json = await data.json();
          if (!data.ok) throw new Error("Failed to fetch profile data");

          setBookings(json.data);
        } catch (error) {
          console.error("Error fetching bookings:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    } else {
        setLoading(false);
      }
    }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleUpdate = async () => {
    try {
      const updated = await updateProfile(user.name, formData);
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated)); // Persist changes
      setEditing(false);
      toast.success("Profile updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  if (!user) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>

      {editing ? (
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="venueManager"
              checked={formData.venueManager}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  venueManager: e.target.checked,
                }))
              }
            />
            Venue Manager
          </label>

          <input
            type="url"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="Avatar URL"
            className="input"
          />

          <input
            type="url"
            name="banner"
            value={formData.banner}
            onChange={handleChange}
            placeholder="Banner URL"
            className="input"
          />
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
            className="input"
          />

          <div className="flex gap-2">
            <button onClick={handleUpdate} className="btn btn-primary">
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-center">
          <img
            src={user.avatar?.url}
            alt={user.avatar?.alt || user.name}
            className="w-24 h-24 rounded-full object-cover mx-auto"
          />
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <strong>Bio:</strong> {user.bio}
          <p>
            <strong>Venue Manager:</strong> {user.venueManager ? "Yes" : "No"}
          </p>
          <button
            onClick={() => setEditing(true)}
            className="btn btn-outline mt-2"
          >
            Edit Profile
          </button>
        </div>
      )}

      {/* Bookings List */}
      <h2 className="text-xl font-semibold mt-6 mb-2">My Bookings</h2>
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length > 0 ? (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="border p-3 rounded-md shadow-sm bg-gray-50"
            >
              <Link
                to={`/venue/${booking.venue.id}`}
                className="text-blue-600 font-medium hover:underline"
              >
                {booking.venue?.name}
              </Link>
              <p>
                <strong>Guests:</strong> {booking.guests}
              </p>
              <p>
                <strong>Dates:</strong> {booking.dateFrom.slice(0, 10)} →{" "}
                {booking.dateTo.slice(0, 10)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no bookings yet.</p>
      )}
    </div>
  );
};

export default ProfilePage;
