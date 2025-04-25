// src/hooks/useCancelBookings.jsx
import { useState } from "react";
import { toast } from "react-toastify";
import { API_BASE_URL, API_KEY } from "../config";
import { getToken } from "../utils/auth";

export const useCancelBooking = () => {
  const [cancellingId, setCancellingId] = useState(null);

  // Function to cancel the booking
  const cancelBooking = async (bookingId, { onSuccess, onError, onLoading } = {}) => {
    // Confirm before canceling
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    // Notify that the cancellation is in progress
    onLoading?.(true);
    
    try {
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

      // Show success toast and call the success handler
      toast.success("Booking cancelled.");
      onSuccess?.();
    } catch (error) {
      // Call the error handler if available
      onError?.(error);
    } finally {
      // Reset loading state
      onLoading?.(false);
    }
  };

  return { cancellingId, cancelBooking };
};
