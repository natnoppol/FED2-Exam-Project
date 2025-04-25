import { useState } from "react";
import { toast } from "react-toastify";
import { cancelBookingById } from "../utils/cancelBooking"; // Corrected import

export const useCancelBooking = () => {
  const [cancellingId, setCancellingId] = useState(null);

  const cancelBooking = async (
    bookingId,
    { onSuccess, onError, onLoading } = {}
  ) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmCancel) return;

    onLoading?.(true);
    setCancellingId(bookingId);
    try {
      await cancelBookingById(bookingId); // Using the utility function to cancel the booking

      toast.success("Booking cancelled.");
      onSuccess?.();
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
      onError?.(error);
    } finally {
      onLoading?.(false);
      setCancellingId(null);
    }
  };

  return { cancellingId,setCancellingId, cancelBooking };
};
