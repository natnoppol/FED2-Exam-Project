// src/hooks/useBookings.js
import { useState, useEffect } from "react";
import { getToken } from "../utils/auth";
import { API_BASE_URL, API_KEY } from "../config";

// In useBookings.js
export const useBookings = (username) => {
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true); // Renamed loading to avoid conflict
    const [currentPage, setCurrentPage] = useState(1);
    const [cancellingId, setCancellingId] = useState(null);
  
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
  
    return {
      bookings: currentBookings,
      loadingBookings,
      setBookings, // Added setBookings to update the state
      handlePrevPage: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
      handleNextPage: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)),
      currentPage,
      totalPages,
      cancellingId,
      handleCancelBooking: async (bookingId) => {
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
          if (response.ok) {
            setBookings((prev) => prev.filter((b) => b.id !== bookingId));
          } else {
            throw new Error("Failed to cancel booking.");
          }
        } catch (error) {
          console.error(error);
        } finally {
          setCancellingId(null);
        }
      },
    };
  };
  