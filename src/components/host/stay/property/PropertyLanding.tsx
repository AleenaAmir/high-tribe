import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PropertySites from "./PropertySites";
import { apiRequest } from "@/lib/api";

export const listData = [
  {
    head: "Fully Furnished smart Studio Apartment",
    city: "Islamabad",
    text: "Trip to Lahore and Islamabad",
    date: "Sunday Jul 6",
    img: "https://res.cloudinary.com/dtfzklzek/image/upload/v1753034297/image_cmn5fn.png",
    status: "active",
    link: "#",
    id: 1,
  },
  {
    head: "Fully Furnished smart Studio Apartment",
    city: "Islamabad",
    text: "Trip to Lahore and Islamabad",
    date: "Sunday Jul 6",
    img: "https://res.cloudinary.com/dtfzklzek/image/upload/v1753034297/image_cmn5fn.png",
    status: "active",
    link: "#",
    id: 2,
  },
  {
    head: "Fully Furnished smart Studio Apartment",
    city: "Islamabad",
    text: "Trip to Lahore and Islamabad",
    date: "Sunday Jul 6",
    img: "https://res.cloudinary.com/dtfzklzek/image/upload/v1753034297/image_cmn5fn.png",
    status: "active",
    link: "#",
    id: 3,
  },
  {
    head: "Fully Furnished smart Studio Apartment",
    city: "Islamabad",
    text: "Trip to Lahore and Islamabad",
    date: "Sunday Jul 6",
    img: "https://res.cloudinary.com/dtfzklzek/image/upload/v1753034297/image_cmn5fn.png",
    status: "deactive",
    link: "#",
    id: 4,
  },
  {
    head: "Fully Furnished smart Studio Apartment",
    city: "Islamabad",
    text: "Trip to Lahore and Islamabad",
    date: "Sunday Jul 6",
    img: "https://res.cloudinary.com/dtfzklzek/image/upload/v1753034297/image_cmn5fn.png",
    status: "deactive",
    link: "#",
    id: 5,
  },
  {
    head: "Fully Furnished smart Studio Apartment",
    city: "Islamabad",
    text: "Trip to Lahore and Islamabad",
    date: "Sunday Jul 6",
    img: "https://res.cloudinary.com/dtfzklzek/image/upload/v1753034297/image_cmn5fn.png",
    status: "active",
    link: "#",
    id: 6,
  },
];

export default function PropertyLanding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPropertyId = searchParams.get("propertyId");
  const showSites = searchParams.get("showSites") === "true";

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    apiRequest<any>("properties", { method: "GET" })
      .then((data) => {
        if (isMounted) {
          setProperties(data?.data);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Failed to fetch properties");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePropertyClick = (id: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("propertyId", id.toString());
    params.set("showSites", "true");
    router.push(`?${params.toString()}`);
  };

  const handleBackToProperties = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("propertyId");
    params.delete("showSites");
    params.delete("showSiteForm");
    router.push(`?${params.toString()}`);
  };

  // Placeholder image for properties without media
  const defaultImage = "https://via.placeholder.com/150?text=No+Image";

  // If showing sites for a specific property
  if (showSites && selectedPropertyId) {
    const selectedProperty = properties.find(
      (item) => item.id === parseInt(selectedPropertyId)
    );

    return (
      <div>
        {/* Back button and property header */}
        <div className="flex items-center gap-4 my-6">
          <button
            onClick={handleBackToProperties}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm font-medium">Back to Properties</span>
          </button>
        </div>

        {/* Property header */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={selectedProperty?.media?.[0]?.file_path || defaultImage}
                alt={selectedProperty?.property_name || "Property"}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {selectedProperty?.property_name || "No Name"}
              </h2>
              <p className="text-sm text-gray-600">
                {selectedProperty?.location_address || "No City"}
              </p>
              <p className="text-sm text-gray-500">
                {selectedProperty?.short_description || "No Description"}
              </p>
            </div>
            <div className="ml-auto">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}
              >
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Sites section */}
        <PropertySites
          propertyId={parseInt(selectedPropertyId)}
          onBack={handleBackToProperties}
        />
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-10">Loading properties...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!properties.length) {
    return <div className="text-center py-10">No properties found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 md:mt-10">
      {properties.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-[20px] shadow-md border border-gray-100 flex relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        >
          {/* Left side - Image and Details */}
          <div className="flex flex-1 p-2">
            {/* Image */}
            <div className="w-16 h-16 rounded-lg my-auto overflow-hidden mr-4 flex-shrink-0">
              <img
                src={item.media?.[0]?.file_path || defaultImage}
                alt={item.property_name || "Property"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-gray-900  truncate">
                {item.property_name || "No Name"}
              </h3>
              <p className="text-sm text-gray-600 ">
                {item.location_address || "No City"}
              </p>
              <p className="text-sm text-gray-600 ">
                {item.short_description || "No Description"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {item.property_type || "No Type"}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between items-end gap-2 p-2">
            <div
              className={`flex items-center space-x-1 border rounded-full px-2 py-1 border-blue-600`}
            >
              <span className="text-xs font-medium text-blue-600">Active</span>
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
            <button
              type="button"
              onClick={() => handlePropertyClick(item.id)}
              className="text-[13px] font-bold underline hover:no-underline cursor-pointer"
            >
              Sites
            </button>
          </div>

          {/* Right side - Status strip and actions */}
          <div className="w-8 flex flex-col items-center justify-between py-4 bg-blue-500"></div>
        </div>
      ))}
    </div>
  );
}
