import React from "react";
import { Range } from "react-range";

const FilterSidebar = ({
  categories,
  filters,
  onCategoryChange,
  onPriceChange,
  onRatingChange,
  renderStars,
}) => {
  return (
    <div className="lg:col-span-3 md:col-span-4">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">All Categories</h3>
        <form>
          {categories.map((category) => (
            <div key={category.id} className="mb-4 flex items-center gap-2">
              <input
                id={category.name}
                onClick={() => onCategoryChange(category.name)}
                type="radio"
                name="category"
                checked={filters.category === category.name}
                className="w-5 h-5 min-w-5 min-h-5 cursor-pointer accent-[var(--hard-primary)]"
              />
              <label
                htmlFor={category.name}
                className="flex justify-between w-full cursor-pointer"
              >
                <span>{category.name}</span>
                <span className="text-sm text-gray-600">
                  ({category.productCount})
                </span>
              </label>
            </div>
          ))}
        </form>
      </div>
      <hr />
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Price</h3>
        <div>
          <Range
            step={1}
            min={0}
            max={100}
            values={filters.priceRange}
            onChange={onPriceChange}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                className="h-2 bg-[var(--soft-primary)] rounded-full"
              >
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div
                {...props}
                className="w-4 h-4 bg-[var(--main-primary)] rounded-full"
              />
            )}
          />
          <div className="flex justify-between mt-2 text-sm">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>
      <hr />
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Rating</h3>
        <form>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center mb-4 gap-2">
              <input
                id={`rating-${rating}`}
                onClick={() => onRatingChange(rating.toString())}
                checked={filters.rating === rating.toString()}
                type="radio"
                name="rating"
                className="w-5 h-5 cursor-pointer accent-[var(--hard-primary)]"
              />
              <label
                htmlFor={`rating-${rating}`}
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
  );
};

export default FilterSidebar;
