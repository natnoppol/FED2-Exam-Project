import { useState, useEffect } from "react";
import { API_BASE_URL, API_KEY } from "../config";
import { getToken } from "../utils/auth";

export const useVenuesByManager = (username, initialPage = 1, itemsPerPage = 4) => {
  const [venues, setVenues] = useState([]);
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    const fetchVenues = async () => {
      if (!username) {
        // Reset state if username is not provided
        setVenues([]);
        setTotalPages(1);
        setLoadingVenues(false);
        return;
      }

      setLoadingVenues(true);

      try {
        const response = await fetch(
          `${API_BASE_URL}/holidaze/profiles/${encodeURIComponent(username)}/venues?page=${currentPage}&limit=${itemsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
              "X-Noroff-API-Key": API_KEY,
            },
          }
        );

        const data = await response.json();

      

        if (response.ok) {
          // Ensure data contains valid venue list and total items
          const venuesList = Array.isArray(data?.data) ? data.data : [];
          const totalItems = data?.totalItems || venuesList.length; // Assuming totalItems is available
          console.log("Total Items:", totalItems);
          
          // Calculate total pages using totalItems and itemsPerPage
          const totalPagesCount = Math.ceil(totalItems / itemsPerPage);

          setVenues(venuesList);
          setTotalPages(totalPagesCount);
          setError(null);
        } else {
          throw new Error(data?.message || "Failed to fetch venues.");
        }
      } catch (error) {
        console.error("Error fetching venues:", error);
        setError(error.message || "An error occurred while fetching venues.");
      } finally {
        setLoadingVenues(false);
      }
    };

    fetchVenues();
  }, [username, currentPage, itemsPerPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return {
    venues,
    loadingVenues,
    error,
    totalPages,
    currentPage,
    handlePrevPage,
    handleNextPage,
  };
};
