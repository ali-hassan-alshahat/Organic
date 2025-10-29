import React, { useState, useEffect } from "react";
import TopBar from "./TopBar";
import SearchBar from "./SearchBar";
import Navigation from "./Navigation";
import MobileMenu from "./MobileMenu";
import IconsSection from "./IconsSection";
import logo from "../../assets/logo-1.svg";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <TopBar />
      <nav
        className={`z-50 bg-white transition-all duration-300 ${
          isScrolled ? "shadow-lg" : "shadow-md"
        }`}
      >
        <div className="lg:hidden">
          <div className="center flex items-center justify-between py-3 gap-4">
            <Link to="/" className="flex-shrink-0">
              <img
                src={logo}
                alt="Logo"
                className="h-8 w-auto"
                loading="lazy"
              />
            </Link>
            <IconsSection
              isMobile={true}
              onMenuToggle={toggleMobileMenu}
              isMenuOpen={isMobileMenuOpen}
            />
          </div>
          <div className="center !pb-3 !pt-1 px-4">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchSuggestions={searchSuggestions}
              setSearchSuggestions={setSearchSuggestions}
              recentSearches={recentSearches}
              setRecentSearches={setRecentSearches}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              isMobile={true}
            />
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="center flex items-center justify-between py-4 gap-8">
            <Link to="/" className="flex-shrink-0">
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-auto"
                loading="lazy"
              />
            </Link>
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchSuggestions={searchSuggestions}
              setSearchSuggestions={setSearchSuggestions}
              recentSearches={recentSearches}
              setRecentSearches={setRecentSearches}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              isMobile={false}
            />
            <IconsSection isMobile={false} />
          </div>
        </div>
        <Navigation isMobileMenuOpen={isMobileMenuOpen} isMobile={false} />
        <MobileMenu
          isMobileMenuOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </nav>
    </>
  );
};

export default Navbar;
