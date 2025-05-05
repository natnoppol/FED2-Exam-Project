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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchAllPages = async (maxRetries = 3) => {
  try {
    const allData = [];
    let currentPage = 1;
    let pageCount;

    do {
      let success = false;
      let retries = 0;

      while (!success && retries < maxRetries) {
        try {
          const response = await fetch(`${API_BASE_URL}/holidaze/venues?page=${currentPage}`, {
            method: "GET",
            headers: {
              "X-Noroff-API-Key": API_KEY,
              "Content-Type": "application/json",
            },
          });

          if (response.status === 429) {
            console.warn(`Rate limited on page ${currentPage}, retrying...`);
            retries++;
            await delay(1000 * retries); // Exponential backoff
            continue;
          }

          if (!response.ok) {
            throw new Error(`Failed to fetch data for page ${currentPage}`);
          }

          const json = await response.json();
          allData.push(...json.data);

          currentPage = json.meta.currentPage + 1;
          pageCount = json.meta.pageCount;

          success = true;
          await delay(200); // Prevent hitting rate limit
        } catch (error) {
          retries++;
          console.warn(`Retry ${retries} for page ${currentPage}`);
          if (retries >= maxRetries) throw error;
          await delay(1000 * retries);
        }
      }
    } while (currentPage <= pageCount);

    return allData;
  } catch (error) {
    console.error("Error fetching all pages:", error);
    throw error;
  }
};


export const getVenues = async (filters = {}, fetchAll = false) => {
  try {
    let venues = [];

    if (fetchAll) {
      venues = await fetchAllPages(); 
    } else {
      const queryParams = new URLSearchParams(filters).toString(); 
      const url = `${API_BASE_URL}/holidaze/venues${queryParams ? `?${queryParams}` : ""}`;

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
      venues = json.data;
    }

    if (filters.country) {
      venues = venues.filter(
        (venue) =>
          venue.location?.country?.toLowerCase() ===
          filters.country.toLowerCase()
      );
    }

    if (filters.guests) {
      venues = venues.filter((venue) => venue.maxGuests >= filters.guests);
    }

    if (filters.checkIn && filters.checkOut) {
      const checkInDate = new Date(filters.checkIn);
      const checkOutDate = new Date(filters.checkOut);

      venues = venues.filter((venue) => {
        if (!venue.bookings?.length) return true;

        return venue.bookings.every((booking) => {
          const bookedFrom = new Date(booking.dateFrom);
          const bookedTo = new Date(booking.dateTo);
          return checkOutDate <= bookedFrom || checkInDate >= bookedTo;
        });
      });
    }

    return venues;
  } catch (error) {
    console.error("Error fetching venues:", error);
    throw error;
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

export const deleteVenueById = async (venueId) => {
  const url = `${API_BASE_URL}/holidaze/venues/${venueId}`;
  
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`, 
      "X-Noroff-API-Key": API_KEY,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete venue");
  }

  return await response.json();
};



export const fallbackImage =
  "https://plus.unsplash.com/premium_photo-1699544856963-49c417549268?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
