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

//fetch the list of venues in Homepage and so on!
export const getVenues = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/holidaze/venues`, {
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
    return json.data; // Noroff API typically wraps response in { data: [...] }
  } catch (error) {
    console.error("Error fetching venues:", error);
    throw error; // You may choose to handle the error in a different way
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
    const response = await fetch(`${API_BASE_URL}/holidaze/profiles/${profileName}`, {
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
    });
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
