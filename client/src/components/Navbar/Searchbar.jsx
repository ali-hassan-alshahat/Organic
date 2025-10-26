import React, { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchSuggestions from "./SearchSuggestions";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  searchSuggestions,
  setSearchSuggestions,
  recentSearches,
  setRecentSearches,
  isLoading,
  setIsLoading,
  isMobile,
}) => {
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSearchSuggestions = async () => {
      if (searchQuery.trim() === "") {
        setSearchSuggestions([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/products?search=${encodeURIComponent(
            searchQuery,
          )}&limit=6`,
        );
        const products = response.data.results?.products || [];
        setSearchSuggestions(products);
      } catch (error) {
        console.error("Failed to fetch search suggestions:", error);
        setSearchSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    const timeoutId = setTimeout(fetchSearchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, setSearchSuggestions, setIsLoading]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const newRecentSearches = [
        searchQuery,
        ...recentSearches.filter((term) => term !== searchQuery),
      ].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchFocused(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchSuggestions([]);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  return (
    <div className={isMobile ? "w-full" : "flex-1 max-w-2xl"} ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for products..."
            className={`w-full border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors pr-12 text-base ${
              isMobile ? "px-4 py-3 rounded-xl" : "px-6 py-3 rounded-2xl"
            }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleSearchFocus}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X size={18} />
            </button>
          )}
          <button
            type="submit"
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white transition-colors ${
              isMobile ? "p-2 rounded-lg" : "p-2 rounded-xl"
            }`}
          >
            <Search size={18} />
          </button>
        </div>
        {isSearchFocused && (
          <SearchSuggestions
            searchQuery={searchQuery}
            searchSuggestions={searchSuggestions}
            recentSearches={recentSearches}
            isLoading={isLoading}
            isMobile={isMobile}
            onSuggestionClick={(product) => {
              const newRecentSearches = [
                product.name,
                ...recentSearches.filter((term) => term !== product.name),
              ].slice(0, 5);
              setRecentSearches(newRecentSearches);
              localStorage.setItem(
                "recentSearches",
                JSON.stringify(newRecentSearches),
              );
              navigate(`/product/${product._id}`);
              setSearchQuery(product.name);
              setIsSearchFocused(false);
            }}
            onRecentSearchClick={(term) => {
              setSearchQuery(term);
              handleSearchFocus();
            }}
            onClearRecentSearches={() => {
              setRecentSearches([]);
              localStorage.removeItem("recentSearches");
            }}
          />
        )}
      </form>
    </div>
  );
};

export default SearchBar;
