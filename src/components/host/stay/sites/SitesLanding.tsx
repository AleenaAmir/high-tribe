import React from "react";

export const sitesData = [
  {
    head: "Fully Furnished smart Studio Apartment",
    city: "Islamabad",
    text: "Trip to Lahore and Islamabad",
    date: "Sunday Jul 6 - 2025",
    img: "https://res.cloudinary.com/dtfzklzek/image/upload/v1753034297/image_cmn5fn.png",
    status: "active",
    price: "$1256",
    statusLabel: "Draft",
    link: "#",
  },
  {
    head: "Fully Furnished smart Studio Apartment",
    city: "Islamabad",
    text: "Trip to Lahore and Islamabad",
    date: "Sunday Jul 6 - 2025",
    img: "https://res.cloudinary.com/dtfzklzek/image/upload/v1753034297/image_cmn5fn.png",
    status: "active",
    price: "$1256",
    statusLabel: "Draft",
    link: "#",
  },
  {
    head: "Fully Furnished smart Studio Apartment",
    city: "Islamabad",
    text: "Trip to Lahore and Islamabad",
    date: "Sunday Jul 6 - 2025",
    img: "https://res.cloudinary.com/dtfzklzek/image/upload/v1753034297/image_cmn5fn.png",
    status: "active",
    price: "$1256",
    statusLabel: "Draft",
    link: "#",
  },
  {
    head: "Fully Furnished smart Studio Apartment",
    city: "Islamabad",
    text: "Trip to Lahore and Islamabad",
    date: "Sunday Jul 6 - 2025",
    img: "https://res.cloudinary.com/dtfzklzek/image/upload/v1753034297/image_cmn5fn.png",
    status: "deactive",
    price: "$1256",
    statusLabel: "Draft",
    link: "#",
  },
  {
    head: "Fully Furnished smart Studio Apartment",
    city: "Islamabad",
    text: "Trip to Lahore and Islamabad",
    date: "Sunday Jul 6 - 2025",
    img: "https://res.cloudinary.com/dtfzklzek/image/upload/v1753034297/image_cmn5fn.png",
    status: "deactive",
    price: "$1256",
    statusLabel: "Draft",
    link: "#",
  },
  {
    head: "Fully Furnished smart Studio Apartment",
    city: "Islamabad",
    text: "Trip to Lahore and Islamabad",
    date: "Sunday Jul 6 - 2025",
    img: "https://res.cloudinary.com/dtfzklzek/image/upload/v1753034297/image_cmn5fn.png",
    status: "active",
    price: "$1256",
    statusLabel: "Draft",
    link: "#",
  },
];

export default function SitesLanding() {
  return (
    <div className="w-full mt-4 md:mt-10">
      {/* 2-column grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sitesData.map((site, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-[20px] hover:shadow-md transition-shadow relative"
          >
            <div className="flex">
              {/* Left section - Image and content */}
              <div className="flex items-start flex-1">
                {/* Image */}
                <div className="w-16 h-16 my-auto rounded-lg overflow-hidden flex-shrink-0 mx-3">
                  <img
                    src={site.img}
                    alt={site.head}
                    className={`w-full h-full object-cover ${
                      site.status === "deactive" ? "grayscale" : ""
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                    {site.head}
                  </h4>
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    {site.city}
                  </p>
                  <p className="text-xs text-gray-500 mb-1 line-clamp-1">
                    {site.text}
                  </p>
                  <p className="text-xs text-gray-400">{site.date}</p>
                </div>
              </div>

              {/* Vertical divider */}
              <div className="w-px bg-gray-200 mx-4"></div>

              {/* Middle section - Price */}
              <div className="flex flex-col justify-center items-center min-w-[80px]">
                <div className="text-lg font-bold text-gray-900">
                  {site.price}
                </div>
              </div>

              {/* Vertical divider */}
              <div className="w-px bg-gray-200 mx-4"></div>
              <div className="text-xs text-red-600 underline mt-1">
                {site.statusLabel}
              </div>
              <div className="flex flex-col justify-between items-end gap-2 p-2 w-28">
                <div
                  className={`flex items-center space-x-1 border rounded-full px-2 py-1 ${
                    site.status === "active"
                      ? "border-blue-600"
                      : "border-orange-600"
                  }`}
                >
                  <span
                    className={`text-xs font-medium ${
                      site.status === "active"
                        ? "text-blue-600"
                        : "text-orange-600"
                    }`}
                  >
                    {site.status}
                  </span>
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {/* Chat Icon */}
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>

                {/* Add site button */}
                <button className="text-[13px] font-bold underline hover:no-underline">
                  Add site
                </button>
              </div>

              {/* Right side - Status strip and actions */}
              <div
                className={`w-8 flex flex-col items-center justify-between rounded-r-[20px] py-4 ${
                  site.status === "active" ? "bg-blue-500" : "bg-orange-500"
                }`}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {sitesData.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No sites yet
          </h3>
          <p className="text-gray-500 mb-4">
            Get started by creating your first adventure site.
          </p>
        </div>
      )}
    </div>
  );
}
