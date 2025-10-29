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
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-2 mt-8">
      <div className="sm:hidden flex items-center justify-between w-full max-w-xs">
        <button
          onClick={() => paginate(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`flex items-center px-4 py-2 rounded-lg border text-sm transition-all flex-1 justify-center mr-2 ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer hover:shadow-md"
          }`}
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous
        </button>
        <div className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg mx-2">
          {currentPage} / {totalPages}
        </div>
        <button
          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`flex items-center px-4 py-2 rounded-lg border text-sm transition-all flex-1 justify-center ml-2 ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer hover:shadow-md"
          }`}
        >
          Next
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
      <div className="hidden sm:flex items-center gap-2">
        <button
          onClick={() => paginate(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`flex items-center px-3 py-2 rounded-lg border transition-all ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer hover:shadow-md"
          }`}
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous
        </button>
        {startPage > 1 && (
          <>
            <button
              onClick={() => paginate(1)}
              className="px-3 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 cursor-pointer hover:shadow-md transition-all"
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
            className={`px-3 py-2 rounded-lg border transition-all ${
              currentPage === number
                ? "bg-[var(--main-primary)] text-white border-[var(--main-primary)] shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer hover:shadow-md"
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
              className="px-3 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 cursor-pointer hover:shadow-md transition-all"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`flex items-center px-3 py-2 rounded-lg border transition-all ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer hover:shadow-md"
          }`}
        >
          Next
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
