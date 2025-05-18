import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

import { fetchPaginatedVenues, fetchAllPages } from "../api";
import { ITEMS_PER_PAGE } from "../constants";

const VenueContext = createContext();

export function VenueProvider({ children }) {
  const [venues, setVenues] = useState([]); // paginated data
  const [allVenues, setAllVenues] = useState([]); // full dataset
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load paginated venues
  const loadPage = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const {
        venues: data,
        currentPage: cp,
        totalPages: tp,
      } = await fetchPaginatedVenues(page, ITEMS_PER_PAGE);
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
  }, []);

  // Load all venues once (for filtering)
  const loadAllVenues = async () => {
    try {
      const all = await fetchAllPages(); // this should return all venues
      setAllVenues(all);
      setError(null); // Clear any previous error
    } catch (err) {
      console.error("Error loading page:", err); 
      setError(`Failed to load all venues: ${err.message}`); // Set error state
      setAllVenues([]); // Clear allVenues on failure
    }
    finally {
      setLoading(false);
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
