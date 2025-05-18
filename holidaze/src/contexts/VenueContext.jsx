import React, { createContext, useState, useContext, useEffect } from "react";
import { fetchPaginatedVenues, fetchAllPages } from "../api"; // Add fetchAllPages

const VenueContext = createContext();

export function VenueProvider({ children }) {
  const [venues, setVenues] = useState([]);             // paginated data
  const [allVenues, setAllVenues] = useState([]);        // full dataset
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load paginated venues
  const loadPage = async (page = 1) => {
    setLoading(true);
    try {
      const { venues: data, currentPage: cp, totalPages: tp } =
        await fetchPaginatedVenues(page, 9);
      setVenues(data);
      setCurrentPage(cp);
      setTotalPages(tp);
      setError(null);
    } catch (err) {
      setError(err.message);
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

  // Load all venues once (for filtering)
  const loadAllVenues = async () => {
    try {
      const all = await fetchAllPages(); // this should return all venues
      setAllVenues(all);
    } catch (err) {
      console.error("Failed to load all venues:", err);
    }
  };

  useEffect(() => {
    loadPage(1);
    loadAllVenues();
  }, []);

  return (
    <VenueContext.Provider
      value={{
        venues,
        allVenues, // add this to context value
        loading,
        error,
        currentPage,
        totalPages,
        loadPage,
      }}
    >
      {children}
    </VenueContext.Provider>
  );
}

export const useVenues = () => {
  const ctx = useContext(VenueContext);
  if (!ctx) throw new Error("useVenues must be inside VenueProvider");
  return ctx;
};
