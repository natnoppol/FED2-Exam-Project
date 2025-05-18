import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center gap-4 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50 hover:bg-blue-600 hover:text-white cursor-pointer"
      >
        Previous
      </button>

      <span className="text-lg font-semibold">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50 hover:bg-blue-600 hover:text-white cursor-pointer"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
