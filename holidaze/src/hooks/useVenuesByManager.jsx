import { useState, useEffect } from "react";
import { API_BASE_URL, API_KEY } from "../config";
import { getToken } from "../utils/auth";

export const useVenuesByManager = (username) => {
  const [venues, setVenues] = useState([]);
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
        if (!username) {
            setLoadingVenues(false); // Stop loading
            return;
          }

      try {
        const response = await fetch(
          `${API_BASE_URL}/holidaze/profiles/${encodeURIComponent(username)}/venues`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
              "X-Noroff-API-Key": API_KEY,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setVenues(data.data);
          setError(null);
        } else {
          throw new Error(data.message || "Failed to fetch venues.");
        }
      } catch (error) {
        console.error(error);
        setError(error.message || "An error occurred while fetching venues.");
      } finally {
        setLoadingVenues(false);
      }
    };

    fetchVenues();
  }, [username]);

  return { venues, loadingVenues, error };
};
