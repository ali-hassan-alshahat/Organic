import React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "./ui/breadcrumb";
import { Link } from "react-router-dom";
import breadcrumbImg from "../assets/breadcrumb.webp";

const DynamicBreadcrumb = ({ items }) => {
  return (
    <Breadcrumb
      className="w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${breadcrumbImg})` }}
    >
      <BreadcrumbList className="center flex items-center text-white text-lg">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {index === items.length - 1 ? (
                <BreadcrumbPage className="text-[var(--main-primary)]">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
