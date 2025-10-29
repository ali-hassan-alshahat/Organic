import axios from "axios";
import DynamicBreadcrumb from "../components/DynamicBreadcrumb";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FilterSidebar from "../components/Shop/FilterSidebar";
import ProductGrid from "../components/Shop/ProductGrid";
import Pagination from "../components/Shop/Pagination";
import QuickViewModal from "../components/common/QuickViewModal";
import { useQuickView } from "../hooks/useQuickView";
import { renderStars } from "../utils/renderStars";

const Shop = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 100],
    rating: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);
  const { quickView, openQuickView, closeQuickView } = useQuickView();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = searchQuery
          ? `http://localhost:8000/api/products?search=${encodeURIComponent(
              searchQuery,
            )}`
          : "http://localhost:8000/api/products";
        const res = await axios.get(url);
        const products = res.data.results?.products || [];
        setData(products);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/categories");
        const categories = res.data;
        setCategories(categories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchProducts();
    fetchCategories();
  }, [searchQuery]);

  const filteredProducts = useMemo(() => {
    let filtered = data.filter((product) => {
      if (filters.category && product.category?.name !== filters.category) {
        return false;
      }
      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      ) {
        return false;
      }
      if (filters.rating && product.rating < parseInt(filters.rating)) {
        return false;
      }
      return true;
    });
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });
    return filtered;
  }, [data, filters, sortBy]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleCategoryChange = (categoryName) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === categoryName ? "" : categoryName,
    }));
  };

  const handlePriceChange = (values) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: values,
    }));
  };

  const handleRatingChange = (rating) => {
    setFilters((prev) => ({
      ...prev,
      rating: prev.rating === rating ? 0 : rating,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: "",
      priceRange: [0, 100],
      rating: 0,
    });
    setSortBy("newest");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[var(--main-primary)]"></div>
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <DynamicBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
        ]}
      />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-50px", once: true }}
        transition={{ duration: 0.6 }}
        className="center pt-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <FilterSidebar
            categories={categories}
            filters={filters}
            onCategoryChange={handleCategoryChange}
            onPriceChange={handlePriceChange}
            onRatingChange={handleRatingChange}
            renderStars={renderStars}
          />

          <div className="lg:col-span-9 md:col-span-8">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600 mt-1">
                {loading
                  ? "Loading..."
                  : `Showing ${indexOfFirstProduct + 1}-${Math.min(
                      indexOfLastProduct,
                      filteredProducts.length,
                    )} of ${filteredProducts.length} products`}
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <span className="capitalize">
                    {sortBy === "newest" ? "Newest" : "Oldest"}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                  <DropdownMenuItem
                    onClick={() => handleSortChange("newest")}
                    className="cursor-pointer"
                  >
                    Newest
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortChange("oldest")}
                    className="cursor-pointer"
                  >
                    Oldest
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <ProductGrid
              products={currentProducts}
              loading={loading}
              onQuickView={openQuickView}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
            />

            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No products found matching your filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 text-green-600 hover:text-green-700 font-medium cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        <QuickViewModal quickView={quickView} onClose={closeQuickView} />
      </motion.div>
    </>
  );
};

export default Shop;
