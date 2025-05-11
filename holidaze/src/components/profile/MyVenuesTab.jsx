import React, { useState } from "react";
import { useVenuesByManager } from "../../hooks/useVenuesByManager";
import VenueCard from "./VenueCard"; // Adjust the import path as necessary


const MyVenuesTab = ({ username }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const { venues, loadingVenues, error, totalPages } = useVenuesByManager(username, currentPage, itemsPerPage);

  // Loading and error handling
  if (loadingVenues) return <div className="text-center">Loading venues...</div>;
  if (error) return <p className="text-red-500">{`Error: ${error}`}</p>;
  if (!venues || venues.length === 0) return <p>No venues found.</p>;

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Render pagination buttons
  const renderPaginationButtons = () => {
    const pageNumbers = [...Array(totalPages)].map((_, index) => index + 1);
    return pageNumbers.map((pageNumber) => (
      <button
        key={pageNumber}
        aria-label={`Go to page ${pageNumber}`}
        className={`px-3 py-1 rounded ${
          currentPage === pageNumber ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => handlePageChange(pageNumber)}
      >
        {pageNumber}
      </button>
    ));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">My Venues</h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {/* Previous Page Button */}
          {currentPage > 1 && (
            <button
              aria-label="Go to previous page"
              className="px-3 py-1 rounded bg-gray-200"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
          )}

          {/* Pagination Buttons */}
          {renderPaginationButtons()}

          {/* Next Page Button */}
          {currentPage < totalPages && (
            <button
              aria-label="Go to next page"
              className="px-3 py-1 rounded bg-gray-200"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MyVenuesTab;
