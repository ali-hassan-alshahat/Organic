import { useState } from "react";

export const useQuickView = () => {
  const [quickView, setQuickView] = useState(null);

  const openQuickView = (product) => {
    setQuickView(product);
    document.body.style.overflow = "hidden";
  };

  const closeQuickView = () => {
    setQuickView(null);
    document.body.style.overflow = "unset";
  };

  return {
    quickView,
    openQuickView,
    closeQuickView,
  };
};
