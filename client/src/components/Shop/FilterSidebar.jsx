import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp, Filter, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const PriceSlider = React.memo(function PriceSlider({
  value, // [min, max] from parent filters
  min = 0,
  max = 100,
  step = 1,
  onCommit,
}) {
  const [inner, setInner] = useState(value);
  const isDraggingRef = useRef(false);
  const lastCommittedRef = useRef(value);

  // Keep inner in sync when parent changes from outside
  useEffect(() => {
    if (!isDraggingRef.current) {
      setInner(value);
      lastCommittedRef.current = value;
    }
  }, [value]);

  const commit = useCallback(
    (payload) => {
      const next = payload ?? inner;
      const prev = lastCommittedRef.current;
      if (prev[0] !== next[0] || prev[1] !== next[1]) {
        lastCommittedRef.current = next;
        onCommit?.(next);
      }
    },
    [inner, onCommit],
  );

  useEffect(() => {
    const handlePointerUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        commit();
      }
    };
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => window.removeEventListener("pointerup", handlePointerUp);
  }, [commit]);

  return (
    <div
      className="w-full select-none"
      style={{
        touchAction: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
      onPointerDownCapture={() => {
        isDraggingRef.current = true;
      }}
    >
      <Slider
        value={inner}
        onValueChange={(vals) => {
          setInner(vals);
        }}
        onValueCommit={(vals) => {
          isDraggingRef.current = false;
          commit(vals);
        }}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm font-medium text-gray-700">
          Min: ${inner[0]}
        </span>
        <span className="text-sm font-medium text-gray-700">
          Max: ${inner[1]}
        </span>
      </div>

      <div className="flex justify-between mt-2 text-sm font-medium">
        <span className="bg-gray-100 px-3 py-1 rounded-md">${inner[0]}</span>
        <span className="bg-gray-100 px-3 py-1 rounded-md">${inner[1]}</span>
      </div>
    </div>
  );
});

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
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useEffect(() => {
    setExpandedSections(
      isDesktop
        ? { categories: true, price: true, rating: true }
        : { categories: false, price: false, rating: false },
    );
  }, [isDesktop]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const hasActiveFilters = () =>
    filters.category !== "" ||
    filters.rating !== "" ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 100;

  const categoriesKey = useMemo(
    () => categories.map((category) => category.name).join("|"),
    [categories],
  );

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
          {expandedSections.categories ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            expandedSections.categories
              ? "max-h-[500px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-4">
            <form key={categoriesKey}>
              <div className="mb-4 flex items-center gap-2">
                <input
                  id={`${inSheet ? "sheet-" : ""}category-all`}
                  onChange={() => onCategoryChange("")}
                  type="radio"
                  name={`${inSheet ? "sheet-" : ""}category`}
                  checked={filters.category === ""}
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
                  key={category.id || category._id || category.name}
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
          {expandedSections.price ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            expandedSections.price
              ? "max-h-[240px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-4">
            <div className="space-y-4">
              <PriceSlider
                value={filters.priceRange}
                min={0}
                max={100}
                step={1}
                onCommit={(finalRange) => {
                  onPriceChange(finalRange);
                }}
              />
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
          {expandedSections.rating ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
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
                  id={`${isDesktop ? "" : "sheet-"}rating-all`}
                  onChange={() => onRatingChange("")}
                  type="radio"
                  name={`${isDesktop ? "" : "sheet-"}rating`}
                  checked={filters.rating === ""}
                  className="w-5 h-5 cursor-pointer accent-[var(--hard-primary)]"
                />
                <label
                  htmlFor={`${isDesktop ? "" : "sheet-"}rating-all`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span>All Ratings</span>
                </label>
              </div>

              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center mb-4 gap-2">
                  <input
                    id={`${isDesktop ? "" : "sheet-"}rating-${rating}`}
                    onChange={() => onRatingChange(rating.toString())}
                    checked={filters.rating === rating.toString()}
                    type="radio"
                    name={`${isDesktop ? "" : "sheet-"}rating`}
                    className="w-5 h-5 cursor-pointer accent-[var(--hard-primary)]"
                  />
                  <label
                    htmlFor={`${isDesktop ? "" : "sheet-"}rating-${rating}`}
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
        <div className="fixed -left-10 top-1/2 transform -translate-y-1/2 -rotate-90 z-40 lg:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button className="bg-[var(--main-primary)] hover:bg-[var(--hard-primary)] text-white shadow-lg px-5 rounded-3xl rounded-t-[1px] h-[40px] flex items-center gap-2">
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
                <FilterContent inSheet />
              </div>
            </SheetContent>
          </Sheet>
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

// Prevent sidebar re-rendering unless its meaningful props changed
export default React.memo(FilterSidebar, (prev, next) => {
  const a = prev.filters.priceRange,
    b = next.filters.priceRange;
  const sameFilters =
    prev.filters.category === next.filters.category &&
    prev.filters.rating === next.filters.rating &&
    a[0] === b[0] &&
    a[1] === b[1];

  const sameCats =
    prev.categories.length === next.categories.length &&
    prev.categories.every((c, i) => c.name === next.categories[i].name);

  return (
    sameFilters &&
    sameCats &&
    prev.onCategoryChange === next.onCategoryChange &&
    prev.onPriceChange === next.onPriceChange &&
    prev.onRatingChange === next.onRatingChange &&
    prev.onClearFilters === next.onClearFilters &&
    prev.renderStars === next.renderStars
  );
});
