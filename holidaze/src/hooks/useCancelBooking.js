import { useState } from "react";
import { toast } from "react-toastify";
import { API_BASE_URL, API_KEY } from "../config";
import { getToken } from "../utils/auth";

export const useCancelBooking = () => {
  const [cancellingId, setCancellingId] = useState(null);

  const cancelBooking = async (bookingId, onSuccess) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    setCancellingId(bookingId);

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

      toast.success("Booking cancelled.");
      onSuccess(bookingId); // e.g. filter out the cancelled one
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setCancellingId(null);
    }
  };

  return { cancellingId, cancelBooking };
};