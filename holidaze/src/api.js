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

    if (!response.ok) {
      throw new Error(`${data.errors?.[0]?.message || 'Login failed'} (Status: ${response.status})`);
    }
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

export const fetchVenues = async (filters = {}, page = 1, limit = 9) => {
  try {
    const allVenues = await fetchAllPages();
    const filteredVenues = filterVenues(allVenues, filters);

    const total = filteredVenues.length;
    const totalPages = Math.ceil(total / limit);

    
    const paginatedVenues = filteredVenues.slice((page - 1) * limit, page * limit); 

    return {
      venues: paginatedVenues,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching and filtering venues:", error);
    throw error;
  }
};


export const filterVenues = (venues, filters = {}) => {
  let filteredVenues = [...venues];

  const normalize = (str) => str.trim().toLowerCase();
  if (filters.country) {
    const target = normalize(filters.country);
    filteredVenues = filteredVenues.filter(venue => 
      normalize(venue.location?.country || '').includes(target)
    );
  }
  

  // Filter by guests
  if (filters.guests) {
    filteredVenues = filteredVenues.filter((venue) => venue.maxGuests >= filters.guests);
  }

  // Filter by check-in and check-out dates
  if (filters.checkIn && filters.checkOut) {
    const checkInDate = new Date(filters.checkIn);
    const checkOutDate = new Date(filters.checkOut);

    filteredVenues = filteredVenues.filter((venue) => {
      // If no bookings, it's available
      if (!venue.bookings?.length) return true;

      // Check if desired dates overlap with existing bookings
      return venue.bookings.every((booking) => {
        const bookedFrom = new Date(booking.dateFrom);
        const bookedTo = new Date(booking.dateTo);

        // Return true if no overlap
        return checkOutDate <= bookedFrom || checkInDate >= bookedTo;
      });
    });
  }

  return filteredVenues;
};

export const fetchAllPages = async (maxPages = Infinity) => {
  try {
    const allData = [];
    let currentPage = 1;
    let pageCount;

    do {
      const response = await fetch(`${API_BASE_URL}/holidaze/venues?page=${currentPage}`, {
        method: "GET",
        headers: {
          "X-Noroff-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`fetch pages ${currentPage} failed`);
      }

      const json = await response.json();
      allData.push(...json.data);

   
      if (!json.meta || typeof json.meta.currentPage !== "number" || typeof json.meta.pageCount !== "number") {
        throw new Error(`Failed to load pages on page ${currentPage}. Status: ${response.status}. Received payload: ${JSON.stringify(json)}`);
      }

      currentPage = json.meta.currentPage + 1;
      pageCount = Math.min(json.meta.pageCount, maxPages); 
    } while (currentPage <= pageCount);

    if (LOGGING_ENABLED) {
      console.log("fetch all pages:", allData);
    }

    return allData;
  } catch (error) {
    console.error("failed to fetch pages:", error);
    throw error;
  }
};

export const fetchPaginatedVenues = async (page = 1, limit = 9) => {
  const response = await fetch(`${API_BASE_URL}/holidaze/venues?page=${page}&limit=${limit}`, {
    headers: {
      "X-Noroff-API-Key": API_KEY,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch page ${page}`);
  }

  const json = await response.json();
  return {
    venues: json.data,
    currentPage: json.meta.currentPage,
    totalPages: json.meta.pageCount,
  };
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
