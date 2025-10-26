import React from "react";
import { Clock, Search } from "lucide-react";

const SearchSuggestions = ({
  searchQuery,
  searchSuggestions,
  recentSearches,
  isLoading,
  isMobile,
  onSuggestionClick,
  onRecentSearchClick,
  onClearRecentSearches,
}) => {
  return (
    <div
      className={`absolute top-full left-0 right-0 bg-white shadow-xl border border-gray-200 z-50 overflow-y-auto ${
        isMobile ? "mt-1 rounded-xl max-h-80" : "mt-2 rounded-2xl max-h-96"
      }`}
    >
      {searchQuery === "" && recentSearches.length > 0 && (
        <div className={`border-b border-gray-100 ${isMobile ? "p-3" : "p-4"}`}>
          <div
            className={`flex items-center justify-between ${
              isMobile ? "mb-2" : "mb-3"
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <Clock size={16} />
              <span>Recent Searches</span>
            </div>
            <button
              onClick={onClearRecentSearches}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          </div>
          <div className={isMobile ? "space-y-1" : "space-y-2"}>
            {recentSearches.map((term, index) => (
              <button
                key={index}
                onClick={() => onRecentSearchClick(term)}
                className="flex items-center gap-3 w-full p-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm"
              >
                <Clock size={16} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{term}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {isLoading && (
        <div
          className={`text-center text-gray-500 ${isMobile ? "p-4" : "p-6"}`}
        >
          <div
            className={`animate-spin rounded-full border-2 border-green-500 border-t-transparent mx-auto ${
              isMobile ? "h-6 w-6" : "h-8 w-8"
            }`}
          ></div>
          <div className="text-sm mt-2">Searching...</div>
        </div>
      )}
      {!isLoading && searchSuggestions.length > 0 && (
        <div className={isMobile ? "p-3" : "p-4"}>
          <div
            className={`font-medium text-gray-500 ${
              isMobile ? "text-sm mb-2" : "text-sm mb-3"
            }`}
          >
            Products
          </div>
          <div className={isMobile ? "space-y-2" : "space-y-3"}>
            {searchSuggestions.map((product) => (
              <button
                key={product._id}
                onClick={() => onSuggestionClick(product)}
                className={`flex items-center w-full text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors ${
                  isMobile ? "gap-3 p-2" : "gap-4 p-3"
                }`}
              >
                <div
                  className={`flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden ${
                    isMobile ? "w-12 h-12" : "w-16 h-16"
                  }`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-medium text-gray-900 truncate ${
                          isMobile ? "text-sm" : "text-base"
                        }`}
                      >
                        {product.name}
                      </div>
                      <div
                        className={`text-gray-500 capitalize ${
                          isMobile ? "text-xs mt-0.5" : "text-sm mt-1"
                        }`}
                      >
                        {product.category?.name}
                      </div>
                    </div>
                    <div
                      className={`font-semibold text-green-600 flex-shrink-0 ${
                        isMobile ? "text-sm" : "text-base"
                      }`}
                    >
                      ${product.price?.toFixed(2)}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      {!isLoading && searchQuery && searchSuggestions.length === 0 && (
        <div
          className={`text-center text-gray-500 ${isMobile ? "p-4" : "p-6"}`}
        >
          <Search
            size={isMobile ? 24 : 32}
            className="mx-auto mb-2 text-gray-300"
          />
          <div className={isMobile ? "text-sm" : "text-base"}>
            No results found for "{searchQuery}"
          </div>
          <div className={isMobile ? "text-xs mt-1" : "text-sm mt-1"}>
            Try different keywords
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;
