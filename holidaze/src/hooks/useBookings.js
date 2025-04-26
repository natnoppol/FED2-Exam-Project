import { useState, useEffect } from "react";
import { getToken } from "../utils/auth";
import { API_BASE_URL, API_KEY } from "../config";
import { useCancelBooking } from "./useCancelBooking";
import { toast } from "react-toastify";

// In useBookings.js
export const useBookings = (username) => {
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { cancellingId, setCancellingId, cancelBooking } = useCancelBooking();

  const itemsPerPage = 4;
  const indexOfLastBooking = currentPage * itemsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(bookings.length / itemsPerPage);

    // Adjust currentPage if necessary when bookings change
    useEffect(() => {
        if (bookings.length > 0) {
          const maxPages = Math.ceil(bookings.length / itemsPerPage);
          if (currentPage > maxPages) {
            setCurrentPage(maxPages); 
          }
        }
      }, [bookings, currentPage]);


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

  // Next page handler
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Previous page handler
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleCancelBooking = (bookingId) => {
    cancelBooking(bookingId, {
      onSuccess: () => {
        setBookings((prev) => {
          const updatedBookings = prev.filter((b) => b.id !== bookingId);
          const maxPages = Math.ceil(updatedBookings.length / itemsPerPage);
          if (currentPage > maxPages) {
            setCurrentPage(maxPages); 
          }
          return updatedBookings;
        });
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
