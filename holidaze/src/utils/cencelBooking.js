import { API_BASE_URL, API_KEY } from "../config";
import { getToken } from "../utils/auth";  // Assuming this function is available to get the user's token

export const cancelBookingById = async (bookingId) => {
  try {
    // Sending DELETE request to cancel the booking
    const response = await fetch(`${API_BASE_URL}/holidaze/bookings/${bookingId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,  // Include the token for authentication
        "X-Noroff-API-Key": API_KEY,  // API key for authorization
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Failed to cancel booking.");
    }

    return true; // Return true if the booking was successfully canceled
  } catch (error) {
    console.error(error);  // Log the error for debugging purposes
    throw new Error("An error occurred while canceling the booking.");
  }
};
