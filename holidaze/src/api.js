import { API_BASE_URL, LOGGING_ENABLED, API_KEY } from "./config";
import { saveAuth } from "./utils/auth";
import { getToken } from "./utils/auth";

export async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok)
      throw new Error(data.errors?.[0]?.message || "Login failed");

    if (LOGGING_ENABLED) {
      console.log("Login response:", data);
    }

    saveAuth(data.data);

    return data.data; // Return the user data
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

// Function to get venues (requires the user's name and token)
export async function getMyVenues(profileName, token) {
  const res = await fetch(
    `${API_BASE_URL}/holidaze/profiles/${profileName}/venues?_bookings=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch venues");
  }

  const json = await res.json();
  return json.data; // So your component gets just the array
}

export const getVenues = async (filters = {}) => {
  try {
    // Build the query parameters based on the filters object
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${API_BASE_URL}/holidaze/venues${
      queryParams ? `?${queryParams}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch venues");
    }

    const json = await response.json();
    let venues = json.data;

    // Apply frontend filtering by country if requested
    if (filters.country) {
      venues = venues.filter(
        (venue) =>
          venue.location?.country?.toLowerCase() ===
          filters.country.toLowerCase()
      );
    }

    // Filter by guests
    if (filters.guests) {
      venues = venues.filter((venue) => venue.maxGuests >= filters.guests);
    }

    // Filter by check-in and check-out dates
    if (filters.checkIn && filters.checkOut) {
      const checkInDate = new Date(filters.checkIn);
      const checkOutDate = new Date(filters.checkOut);

      venues = venues.filter((venue) => {
        // If no bookings, it's available
        if (!venue.bookings?.length) return true;

        // Check if desired dates overlap with existing bookings
        return venue.bookings.every((booking) => {
          const bookedFrom = new Date(booking.dateFrom);
          const bookedTo = new Date(booking.dateTo);

          // Return true if no overlap
          return (
            checkOutDate <= bookedFrom || checkInDate >= bookedTo
          );
        });
      });
    }

    return venues;
  } catch (error) {
    console.error("Error fetching venues:", error);
    throw error; // You may choose to handle the error differently
  }
};

export const getVenueById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/holidaze/venues/${id}`, {
      method: "GET",
      headers: {
        "X-Noroff-API-Key": API_KEY, // If needed
        "Content-Type": "application/json", // Assuming the API returns JSON
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch venue with ID: ${id}`);
    }

    const json = await response.json();
    return json.data; // The data returned should be the details of the venue
  } catch (error) {
    console.error("Error fetching venue by ID:", error);
    throw error; // You may choose to handle the error in a different way
  }
};

export const updateProfile = async (profileName, formData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/holidaze/profiles/${profileName}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify({
          bio: formData.bio,
          avatar: formData.avatar ? { url: formData.avatar } : undefined,
          banner: formData.banner ? { url: formData.banner } : undefined,
          venueManager: formData.venueManager,
        }),
      }
    );
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.errors?.[0]?.message || "Failed to update profile");
    }

    return json.data;
  } catch (error) {
    console.error("updateProfile error:", error);
    throw error;
  }
};

export const fallbackImage =
  "https://plus.unsplash.com/premium_photo-1699544856963-49c417549268?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
