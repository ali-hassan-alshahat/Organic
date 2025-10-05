import React from "react";
import { Truck, Headset, CircleCheckBig, Package } from "lucide-react";

const Featured = () => {
  const features = [
    {
      icon: <Truck size={36} />,
      title: "Free Shipping",
      text: "Free shipping on all your order",
    },
    {
      icon: <Headset size={36} />,
      title: "Customer Support 24/7",
      text: "Instant access to Support",
    },
    {
      icon: <CircleCheckBig size={36} />,
      title: "100% Secure Payment",
      text: "We ensure your money is safe",
    },
    {
      icon: <Package size={36} />,
      title: "Money-Back Guarantee",
      text: "30 Days Money-Back Guarantee",
    },
  ];

  return (
    <div className="center">
      <div className="w-full bg-white py-8 mb-8 rounded-xl shadow-[0_2px_25px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 sm:px-10 text-center">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center justify-center text-center gap-3"
            >
              <div className="text-[var(--soft-primary)] bg-[rgba(132,204,22,0.08)] p-4 rounded-full w-14 h-14 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Featured;
