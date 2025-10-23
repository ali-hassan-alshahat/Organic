import DynamicBreadcrumb from "../components/DynamicBreadcrumb";
import React from "react";

const Shop = () => {
  return (
    <div>
      <DynamicBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
        ]}
      />
    </div>
  );
};

export default Shop;
