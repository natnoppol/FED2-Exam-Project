// src/utils/cancelBooking.js
import { API_BASE_URL, API_KEY } from "../config";
import { getToken } from "./auth";

export const cancelBookingById = async (bookingId) => {
  const response = await fetch(`${API_BASE_URL}/holidaze/bookings/${bookingId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "X-Noroff-API-Key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to cancel booking.");
  }

  return true;
};
