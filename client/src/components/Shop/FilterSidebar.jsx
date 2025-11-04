import React, { useState, useEffect } from "react";
import { Range } from "react-range";
import { ChevronDown, ChevronUp, Filter, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const FilterSidebar = ({
  categories,
  filters,
  onCategoryChange,
  onPriceChange,
  onRatingChange,
  renderStars,
  onClearFilters,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
  });
  const [isDesktop, setIsDesktop] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setExpandedSections({
        categories: true,
        price: true,
        rating: true,
      });
    } else {
      setExpandedSections({
        categories: false,
        price: false,
        rating: false,
      });
    }
  }, [isDesktop]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const showChevron = (section) => {
    if (!isDesktop) return true;
    return true;
  };

  const hasActiveFilters = () => {
    return (
      filters.category !== "" ||
      filters.rating !== "" ||
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 100
    );
  };

  const renderThumb = ({ props, isDragged }) => {
    const { key, ...restProps } = props;
    return (
      <div
        key={key}
        {...restProps}
        className="w-4 h-4 bg-[var(--main-primary)] rounded-full outline-none"
      />
    );
  };

  const renderTrack = ({ props, children }) => {
    const { key, ...restProps } = props;
    return (
      <div
        key={key}
        {...restProps}
        className="h-2 bg-[var(--soft-primary)] rounded-full"
      >
        {children}
      </div>
    );
  };
  const FilterContent = ({ inSheet = false }) => (
    <>
      {hasActiveFilters() && (
        <div className="border-b">
          <div className="p-4">
            <Button
              onClick={onClearFilters}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 cursor-pointer flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Filters
            </Button>
          </div>
        </div>
      )}
      <div className="border-b">
        <button
          onClick={() => toggleSection("categories")}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-lg font-semibold">Categories</h3>
          {showChevron("categories") &&
            (expandedSections.categories ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ))}
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            expandedSections.categories
              ? "max-h-[500px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-4">
            <form>
              <div className="mb-4 flex items-center gap-2">
                <input
                  id={`${inSheet ? "sheet-" : ""}category-all`}
                  onChange={() => onCategoryChange("")}
                  type="radio"
                  name={`${inSheet ? "sheet-" : ""}category`}
                  checked={filters.category === ""}
                  een
                  className="w-5 h-5 min-w-5 min-h-5 cursor-pointer accent-[var(--hard-primary)]"
                />
                <label
                  htmlFor={`${inSheet ? "sheet-" : ""}category-all`}
                  className="flex justify-between w-full cursor-pointer"
                >
                  <span>All Categories</span>
                </label>
              </div>
              {categories.map((category) => (
                <div
                  key={category.id || category._id}
                  className="mb-4 flex items-center gap-2"
                >
                  <input
                    id={`${inSheet ? "sheet-" : ""}category-${category.name}`}
                    onChange={() => onCategoryChange(category.name)}
                    type="radio"
                    name={`${inSheet ? "sheet-" : ""}category`}
                    checked={filters.category === category.name}
                    className="w-5 h-5 min-w-5 min-h-5 cursor-pointer accent-[var(--hard-primary)]"
                  />
                  <label
                    htmlFor={`${inSheet ? "sheet-" : ""}category-${
                      category.name
                    }`}
                    className="flex justify-between w-full cursor-pointer"
                  >
                    <span>{category.name}</span>
                    <span className="text-sm text-gray-600">
                      ({category.productCount || 0})
                    </span>
                  </label>
                </div>
              ))}
            </form>
          </div>
        </div>
      </div>
      <div className="border-b">
        <button
          onClick={() => toggleSection("price")}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-lg font-semibold">Price</h3>
          {showChevron("price") &&
            (expandedSections.price ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ))}
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            expandedSections.price
              ? "max-h-[200px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-4">
            <Range
              step={1}
              min={0}
              max={100}
              values={filters.priceRange}
              onChange={onPriceChange}
              renderTrack={renderTrack}
              renderThumb={renderThumb}
            />
            <div className="flex justify-between mt-4 text-sm font-medium">
              <span className="bg-gray-100 px-3 py-1 rounded-md">
                ${filters.priceRange[0]}
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-md">
                ${filters.priceRange[1]}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b">
        <button
          onClick={() => toggleSection("rating")}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-lg font-semibold">Rating</h3>
          {showChevron("rating") &&
            (expandedSections.rating ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ))}
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            expandedSections.rating
              ? "max-h-[400px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-4">
            <form>
              <div className="flex items-center mb-4 gap-2">
                <input
                  id={`${inSheet ? "sheet-" : ""}rating-all`}
                  onChange={() => onRatingChange("")}
                  type="radio"
                  name={`${inSheet ? "sheet-" : ""}rating`}
                  checked={filters.rating === ""}
                  className="w-5 h-5 cursor-pointer accent-[var(--hard-primary)]"
                />
                <label
                  htmlFor={`${inSheet ? "sheet-" : ""}rating-all`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span>All Ratings</span>
                </label>
              </div>
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center mb-4 gap-2">
                  <input
                    id={`${inSheet ? "sheet-" : ""}rating-${rating}`}
                    onChange={() => onRatingChange(rating.toString())}
                    checked={filters.rating === rating.toString()}
                    type="radio"
                    name={`${inSheet ? "sheet-" : ""}rating`}
                    className="w-5 h-5 cursor-pointer accent-[var(--hard-primary)]"
                  />
                  <label
                    htmlFor={`${inSheet ? "sheet-" : ""}rating-${rating}`}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <span className="flex gap-1">{renderStars(rating)}</span>
                    <span className="text-sm text-gray-700">
                      {rating}.0{rating !== 5 && " & Up"}
                    </span>
                  </label>
                </div>
              ))}
            </form>
          </div>
        </div>
      </div>
    </>
  );
  if (!isDesktop) {
    return (
      <>
        <div className="fixed -left-10 top-1/2 transform -rotate-90 z-40 lg:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button className="bg-[var(--main-primary)] hover:bg-[var(--hard-primary)] text-white shadow-lg px-5 rounded-3xl rounded-t-[1px] h-[40px] flex items-center gap-2 writing-mode-vertical">
                <Filter className="w-5 h-5" />
                <span className="tracking-widest font-semibold">FILTERS</span>
                {hasActiveFilters() && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[85vw] max-w-md p-0 overflow-y-auto"
            >
              <SheetHeader className="p-6 border-b sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-xl">Filters</SheetTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSheetOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </SheetHeader>
              <div className="h-full overflow-y-auto">
                <FilterContent inSheet={true} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="lg:hidden h-0"></div>
        <div className="hidden lg:block lg:col-span-3">
          <FilterContent />
        </div>
      </>
    );
  }
  return (
    <div className="lg:col-span-3">
      <FilterContent />
    </div>
  );
};

export default FilterSidebar;
