import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL, API_KEY } from "../config";
import { getToken } from "../utils/auth";

export const useVenuesByManager = (username, initialPage = 1, itemsPerPage = 6) => {
  const [venues, setVenues] = useState([]);
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const fetchVenues = useCallback(async (page = currentPage) => {
    if (!username) {
      setVenues([]);
      setTotalPages(1);
      setCurrentPage(1); // Reset current page as well
      setLoadingVenues(false);
      setError(null);
      return;
    }

    setLoadingVenues(true);
    setError(null); // Clear previous errors before a new fetch

    try {
      const response = await fetch(
        `${API_BASE_URL}/holidaze/profiles/${encodeURIComponent(username)}/venues?page=${page}&limit=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "X-Noroff-API-Key": API_KEY,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        const venuesList = Array.isArray(data?.data) ? data.data : [];
        const pageCount = data?.meta?.pageCount || 1;
        const newCurrentPage = data?.meta?.currentPage || page;

        setVenues(venuesList);
        setTotalPages(pageCount);
        setCurrentPage(newCurrentPage); // Update current page based on API response or requested page
      } else {
        // Use error details from API if available
        const apiError = data?.errors?.[0]?.message || data?.message || "Failed to fetch venues.";
        throw new Error(apiError);
      }
    } catch (err) {
      console.error("Error fetching venues:", err);
      setError(err.message || "An error occurred while fetching venues.");
      setVenues([]); // Clear venues on error
      setTotalPages(1); // Reset pagination on error
    } finally {
      setLoadingVenues(false);
    }
  }, [username, itemsPerPage, currentPage]); // Add currentPage to dependencies of useCallback if it's used directly

  useEffect(() => {
    fetchVenues(currentPage); // Initial fetch and fetch when currentPage changes via pagination
  }, [username, itemsPerPage, currentPage, fetchVenues]); // fetchVenues is now a dependency

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
    fetchVenuesByManager: fetchVenues, // Expose the fetchVenues function
  };
};
