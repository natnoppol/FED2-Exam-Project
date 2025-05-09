import { API_BASE_URL, API_KEY } from "../../config";
import { useState } from "react";
import { getToken } from "../../utils/auth";
import { toast } from "react-toastify";
import {
  CREATE_SUCCESS_MESSAGE,
  CREATE_ERROR_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
  UPDATE_ERROR_MESSAGE,
} from "../../constants";
import MediaInput from "../form/MediaInput";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";

const CreateVenueForm = ({
  mode = "create",
  venueData = {},
  onSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: venueData?.name || "",
    description: venueData?.description || "",
    price: venueData?.price || "",
    maxGuests: venueData?.maxGuests || "",
    rating: venueData?.rating || 0,
    media: Array.isArray(venueData?.media) ? venueData.media : [],
    location: venueData?.location || {
      address: "",
      city: "",
      country: "",
      zip: "",
    },
    meta: venueData?.meta || {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
  });

  const navigate = useNavigate();
  const venueId = venueData?.id;

  const preparedData = {
    ...formData,
    price: Number(formData.price),
    maxGuests: Number(formData.maxGuests),
    rating: Number(formData.rating),
    meta: formData.meta,
    media: Array.isArray(formData.media)
      ? formData.media
          .map((item) => {
            if (typeof item === "string" && item.trim() !== "") {
              return { url: item.trim(), alt: `${formData.name} image` };
            } else if (typeof item === "object" && item.url) {
              return {
                url: item.url.trim(),
                alt: `${formData.name || "Venue"} image`,
              };
            }
            return null;
          })
          .filter((item) => item !== null)
      : [],
  };

  const isFormValid =
    formData.name &&
    formData.description &&
    formData.price &&
    formData.maxGuests &&
    formData.location.address &&
    formData.location.city &&
    formData.location.country;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
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

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData?.message ||
            (mode === "edit" ? UPDATE_ERROR_MESSAGE : CREATE_ERROR_MESSAGE)
        );
      }

      const venue = await res.json();
      toast.success(
        mode === "edit" ? UPDATE_SUCCESS_MESSAGE : CREATE_SUCCESS_MESSAGE
      );

      setFormData({
        name: "",
        description: "",
        price: "",
        maxGuests: "",
        rating: 0,
        media: [],
        location: {
          address: "",
          city: "",
          country: "",
          zip: "",
        },
        meta: {
          wifi: false,
          parking: false,
          breakfast: false,
          pets: false,
        },
      });

      onSuccess(venue);
      navigate("/admin/manage-venues");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setErrorMessage(err.message);
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const MetaCheckbox = ({ label, name }) => (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={formData.meta[name]}
        onChange={() =>
          setFormData((prev) => ({
            ...prev,
            meta: { ...prev.meta, [name]: !prev.meta[name] },
          }))
        }
        className="cursor-pointer"
      />
      {label}
    </label>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-lg rounded-lg mb-6 max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">
        {mode === "edit" ? "Edit Venue" : "Create New Venue"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Venue Name"
          className="border p-3 rounded-lg shadow-sm w-full"
        />
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
          placeholder="Price per night"
          className="border p-3 rounded-lg shadow-sm w-full"
          min="0"
        />
        <input
          name="maxGuests"
          type="number"
          value={formData.maxGuests}
          onChange={handleChange}
          required
          placeholder="Max guests"
          className="border p-3 rounded-lg shadow-sm w-full"
          min="0"
        />
        <MediaInput
          value={formData.media}
          onChange={(updatedMedia) =>
            setFormData((prev) => ({ ...prev, media: updatedMedia }))
          }
        />
      </div>

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        placeholder="Description"
        className="border p-3 rounded-lg shadow-sm w-full mt-4"
        rows={4}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div>
          <h3 className="font-semibold text-lg">Rating</h3>
          <div className="mt-2">
            <StarRating
              rating={formData.rating}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, rating: value }))
              }
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg">Amenities</h3>
          <div className="space-y-2 mt-2">
            <MetaCheckbox label="WiFi" name="wifi" />
            <MetaCheckbox label="Breakfast" name="breakfast" />
            <MetaCheckbox label="Pets Allowed" name="pets" />
            <MetaCheckbox label="Parking" name="parking" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-lg">Location</h3>
          <input
            name="location.address"
            value={formData.location.address}
            onChange={handleChange}
            placeholder="Address"
            className="border p-3 rounded-lg shadow-sm w-full mt-2"
          />
          <input
            name="location.city"
            value={formData.location.city}
            onChange={handleChange}
            placeholder="City"
            className="border p-3 rounded-lg shadow-sm w-full mt-2"
          />
          <input
            name="location.country"
            value={formData.location.country}
            onChange={handleChange}
            placeholder="Country"
            className="border p-3 rounded-lg shadow-sm w-full mt-2"
          />
          <input
            name="location.zip"
            value={formData.location.zip}
            onChange={handleChange}
            placeholder="Zip"
            className="border p-3 rounded-lg shadow-sm w-full mt-2"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6 justify-end">
        <button
          type="submit"
          disabled={loading || !isFormValid}
          className={`px-6 py-3 rounded-lg text-white font-semibold ${
            loading || !isFormValid
              ? "bg-blue-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }`}
        >
          {mode === "edit" ? "Update Venue" : "Create Venue"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-6 py-3 rounded-lg hover:bg-gray-400 font-semibold cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {errorMessage && (
        <div className="text-red-600 text-sm mt-4">{errorMessage}</div>
      )}
    </form>
  );
};

export default CreateVenueForm;
