import { API_BASE_URL, LOGGING_ENABLED } from "./config";
import { saveAuth } from "./utils/auth";


export async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.errors?.[0]?.message || "Login failed");

    if (LOGGING_ENABLED) {
      console.log("Login response:", data);
    }

    saveAuth(data.data);

    return data.data;  // Return the user data
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

// Function to get venues (requires the user's name and token)
export async function getMyVenues(name, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/holidaze/profiles/${name}/venues?_bookings=true`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (LOGGING_ENABLED) {
      console.log("My venues:", data);
    }

    return data; // Return the venue data
  } catch (err) {
    console.error("Error fetching venues:", err);
    throw err;
  }
}
