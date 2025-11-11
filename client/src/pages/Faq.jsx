import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faq from "../assets/about-2.png";

const Faq = () => {
  const faqItems = [
    {
      value: "item-1",
      trigger: "What makes Ecobazar products eco-friendly?",
      content: [
        "All our products are made from sustainable, biodegradable, or recycled materials. We prioritize organic ingredients and environmentally conscious manufacturing processes.",
        "We hold certifications like USDA Organic, Fair Trade, and Carbon Neutral to ensure our commitment to sustainability is verified and trustworthy.",
      ],
    },
    {
      value: "item-2",
      trigger: "How long does shipping take?",
      content: [
        "Standard shipping: 3-5 business days within the US, 7-14 days internationally.",
        "Express shipping: 1-2 business days domestically, 3-5 days internationally.",
        "We offer carbon-neutral shipping options and use minimal, recyclable packaging materials.",
      ],
    },
    {
      value: "item-3",
      trigger: "What is your return policy?",
      content: [
        "We offer a 30-day satisfaction guarantee. If you're not happy with your purchase, return it for a full refund or exchange.",
        "Eco-friendly products can be returned within 60 days. We properly dispose of or recycle returned items to minimize environmental impact.",
      ],
    },
    {
      value: "item-4",
      trigger: "Are your products certified organic?",
      content: [
        "Yes! All our food and skincare products are certified USDA Organic. We work with certified organic farms and suppliers.",
        "We regularly audit our supply chain to ensure all products meet strict organic standards and sustainable farming practices.",
      ],
    },
    {
      value: "item-5",
      trigger: "What payment methods do you accept?",
      content: [
        "We accept all major credit cards, PayPal, Apple Pay, Google Pay, and select cryptocurrencies.",
        "For wholesale customers, we also offer net-30 payment terms upon credit approval.",
      ],
    },
  ];

  return (
    <>
      <DynamicBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "FAQ", href: "/faq" },
        ]}
      />
      <div className="center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl w-full">
          <div className="order-2 lg:order-1">
            <div className="text-center lg:text-left mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Find answers to common questions about our eco-friendly
                products, shipping, returns, and sustainability practices.
              </p>
            </div>
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-4"
              defaultValue="item-1"
            >
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.value}
                  value={item.value}
                  className="border border-gray-200 rounded-lg border-b-0 last:border-b px-4 hover:border-green-200 transition-colors"
                >
                  <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-green-700 py-4">
                    {item.trigger}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-4">
                    <div className="space-y-3">
                      {item.content.map((paragraph, index) => (
                        <p key={index} className="leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end items-start">
            <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
              <img
                src={faq}
                alt="Ecobazar FAQ - Sustainable living questions"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Faq;
