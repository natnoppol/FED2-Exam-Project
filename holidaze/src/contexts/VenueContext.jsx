import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchAllPages as apiFetchAllPages } from '../api'; // Import and alias to avoid naming conflicts

const VenueContext = createContext();

export const VenueProvider = ({ children }) => {
  const [allVenues, setAllVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVenues = async () => {
      try {
        setLoading(true);
        const venuesData = await apiFetchAllPages(); // Use the imported fetchAllPages
        setAllVenues(venuesData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch all venues for context:", err);
        setError(err.message || "Could not load venues.");
        setAllVenues([]); // Optionally clear venues on error
      } finally {
        setLoading(false);
      }
    };

    loadVenues();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <VenueContext.Provider value={{ allVenues, loading, error, setAllVenues }}>
      {children}
    </VenueContext.Provider>
  );
};

export const useVenues = () => {
  const context = useContext(VenueContext);
  if (context === undefined) {
    throw new Error('useVenues must be used within a VenueProvider');
  }
  return context;
};