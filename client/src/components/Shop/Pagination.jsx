import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, paginate }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => paginate(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`flex items-center px-3 py-2 rounded-lg border ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
        }`}
      >
        <ChevronLeft size={16} />
        <span className="ml-1">Previous</span>
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => paginate(1)}
            className="px-3 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
        </>
      )}

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`px-3 py-2 rounded-lg border ${
            currentPage === number
              ? "bg-[var(--main-primary)] text-white border-[var(--main-primary)]"
              : "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
          }`}
        >
          {number}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="px-2 text-gray-500">...</span>
          )}
          <button
            onClick={() => paginate(totalPages)}
            className="px-3 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`flex items-center px-3 py-2 rounded-lg border ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
        }`}
      >
        <span className="mr-1">Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
