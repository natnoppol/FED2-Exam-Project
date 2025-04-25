import { useState, useEffect } from "react";
import { getToken } from "../utils/auth";
import { API_BASE_URL, API_KEY } from "../config";
import { useCancelBooking } from "./useCancelBooking"; // Import the hook here
import { toast } from "react-toastify";


export const useBookings = (username) => {
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true); // Renamed loading to avoid conflict
    const [currentPage, setCurrentPage] = useState(1);
    const { cancellingId, cancelBooking } = useCancelBooking(); // Using cancelBooking here

    const itemsPerPage = 4;
    const indexOfLastBooking = currentPage * itemsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
    const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
    const totalPages = Math.ceil(bookings.length / itemsPerPage);

    useEffect(() => {
      const fetchBookings = async () => {
        if (username) {
          try {
            const response = await fetch(
              `${API_BASE_URL}/holidaze/profiles/${encodeURIComponent(username)}/bookings?_venue=true`,
              {
                headers: {
                  Authorization: `Bearer ${getToken()}`,
                  "X-Noroff-API-Key": API_KEY,
                },
              }
            );
            const data = await response.json();
            if (response.ok) {
              setBookings(data.data);
            } else {
              throw new Error("Failed to fetch bookings.");
            }
          } catch (error) {
            console.error(error);
          } finally {
            setLoadingBookings(false);
          }
        }
      };

      fetchBookings();
    }, [username]);

    const handleCancelBooking = (bookingId) => {
      cancelBooking(bookingId, {
        onSuccess: () => {
          setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        },
        onError: (error) => {
          toast.error(error.message || "Something went wrong.");
        },
        onLoading: (isLoading) => {
          setCancellingId(isLoading ? bookingId : null);
        },
      });
    };

    return {
      currentBookings,
      loadingBookings,
      currentPage,
      totalPages,
      handleNextPage,
      handlePrevPage,
      handleCancelBooking,
      cancellingId,
    };
};
