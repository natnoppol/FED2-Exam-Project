import { API_BASE_URL, LOGGING_ENABLED, API_KEY} from "./config";
import { saveAuth } from "./utils/auth";



export async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY
      },
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
export async function getMyVenues(profileName, token) {
  const res = await fetch(`${API_BASE_URL}/holidaze/profiles/${profileName}/venues?_bookings=true`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
    },
  });
  

  if (!res.ok) {
    throw new Error("Failed to fetch venues");
  }

  const json = await res.json();
  return json.data; // So your component gets just the array
}
