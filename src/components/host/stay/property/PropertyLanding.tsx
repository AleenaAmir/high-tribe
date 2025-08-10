import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PropertySites from "./PropertySites";
import { apiRequest } from "@/lib/api";
import Dropdown from "@/components/global/dropdown";
import toast from "react-hot-toast";
import GlobalModal from "@/components/global/GlobalModal";
import LoadingSkeleton from "@/components/global/LoadingSkeleton";

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

// Property Card Skeleton Component
const PropertyCardSkeleton = () => (
  <div className="bg-white rounded-[20px] shadow-md border border-gray-100 flex relative">
    {/* Left side - Image and Details */}
    <div className="flex flex-1 p-2">
      {/* Image skeleton */}
      <div className="w-16 h-16 rounded-lg my-auto mr-4 flex-shrink-0">
        <LoadingSkeleton type="image" width="w-16" height="h-16" rounded="lg" />
      </div>

      {/* Details skeleton */}
      <div className="flex-1 min-w-0 space-y-2">
        <LoadingSkeleton type="text" lines={1} width="w-3/4" height="h-3" />
        <LoadingSkeleton type="text" lines={1} width="w-1/2" height="h-3" />
        <LoadingSkeleton type="text" lines={1} width="w-2/3" height="h-3" />
        <LoadingSkeleton type="text" lines={1} width="w-1/3" height="h-2" />
      </div>
    </div>

    {/* Right side - Status strip */}
    <div className="w-8 flex flex-col items-center justify-between py-4 bg-gray-200 rounded-r-[20px]"></div>
  </div>
);

export default function PropertyLanding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPropertyId = searchParams.get("propertyId");
  const showSites = searchParams.get("showSites") === "true";

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pageSize] = useState(10);

  // Intersection Observer ref for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Load properties function
  const loadProperties = useCallback(
    async (pageNum: number, append: boolean = false) => {
      try {
        const response = await apiRequest<any>(
          `properties?page=${pageNum}&limit=${pageSize}`,
          {
            method: "GET",
          }
        );

        const newProperties = response?.data || [];

        if (append) {
          setProperties((prev) => [...prev, ...newProperties]);
        } else {
          setProperties(newProperties);
        }

        setHasMore(newProperties.length === pageSize);
      } catch (err: any) {
        setError(err.message || "Failed to fetch properties");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [pageSize]
  );

  // Initial load
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    loadProperties(1, false).then(() => {
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [loadProperties]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loadingMore && !loading) {
          setLoadingMore(true);
          setPage((prev) => prev + 1);
          loadProperties(page + 1, true);
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loading, page, loadProperties]);

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

  const handleDeleteProperty = async (propertyId: number) => {
    try {
      await apiRequest(`properties/${propertyId}`, { method: "DELETE" });
      // Remove the deleted property from the state
      setProperties(
        properties.filter((property) => property.id !== propertyId)
      );
      toast.error("Property deleted successfully");
    } catch (error) {
      console.error("Failed to delete property:", error);
      // You might want to show a toast notification here
    }
  };

  const [propertyId, setPropertyId] = useState<number | null>(null);

  const handleDeleteModal = (propertyId: number) => {
    setDeleteModal(true);
    setPropertyId(propertyId);
  };
  // Placeholder image for properties without media
  const defaultImage = "https://via.placeholder.com/150?text=No+Image";

  // If showing sites for a specific property
  if (showSites && selectedPropertyId) {
    const selectedProperty = properties.find(
      (item) => item.id === parseInt(selectedPropertyId)
    );

    const handleAddSites = () => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("showSiteForm", "true");
      router.push(`?${params.toString()}`);
    };

    return (
      <div>
        {/* Back button and property header */}
        <button
          type="button"
          onClick={handleBackToProperties}
          className="flex items-center gap-4 my-6 cursor-pointer"
        >
          <div className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
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
          </div>
        </button>

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
              <h2 className="text-lg font-bold">
                {selectedProperty?.property_name || "No Name"}
              </h2>
              <p className="text-sm text-black">
                {selectedProperty?.location_address || "No City"}
              </p>
              <p className="text-sm text-black">
                {selectedProperty?.short_description || "No Description"}
              </p>
            </div>
            <div className="ml-auto">
              <Dropdown
                button={
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}
                  >
                    Active
                  </span>
                }
              >
                <div className="min-w-[150px] w-full border border-[#848484] rounded-[5px]">
                  <button className="block w-full text-left p-2 bg-white rounded-[5px] hover:bg-[#f8f8f8] cursor-pointer">
                    inactive
                  </button>
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
        {/* <button
          onClick={handleAddSites}
          className="text-[13px] font-bold underline hover:no-underline cursor-pointer"
        >
          Add Sites
        </button> */}

        {/* Sites section */}
        <PropertySites
          propertyId={parseInt(selectedPropertyId)}
          onBack={handleBackToProperties}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 md:mt-10">
        {Array.from({ length: 6 }).map((_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!properties.length) {
    return <div className="text-center py-10">No properties found.</div>;
  }
  const getImageUrl = (media: any[]) =>
    (media?.[0]?.file_path || "").replace(/\\/g, "") ||
    "https://via.placeholder.com/150?text=No+Image";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 md:mt-10">
        {properties.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-[20px] shadow-md border border-gray-100 flex relative  cursor-pointer hover:shadow-lg transition-shadow"
          >
            {/* Left side - Image and Details */}
            <div className="flex flex-1 p-2">
              {/* Image */}
              <div className="w-16 h-16 rounded-lg my-auto overflow-hidden mr-4 flex-shrink-0">
                <img
                  src={getImageUrl(item.media)}
                  alt={item.property_name || "Property"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => handlePropertyClick(item.id)}
                  className="font-bold text-xs text-black truncate hover:underline cursor-pointer"
                >
                  {item.property_name || "No Name"}
                </button>
                <p className="font-bold text-xs text-black">
                  {item.location_address || "No City"}
                </p>
                <p className="text-xs text-black font-medium whitespace-nowrap overflow-hidden truncate md:max-w-[150px] lg:max-w-[200px] xl:max-w-[300px]">
                  {item.short_description || "No Description"}
                </p>
                <p className="text-[10px] mt-1">
                  {item.property_type || "No Date"}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between items-end gap-1 p-2">
              <Dropdown
                button={
                  <div
                    className={`flex items-center space-x-1 border rounded-full px-2 py-1 border-blue-600`}
                  >
                    <span className="text-xs font-medium text-blue-600">
                      Active
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
                }
              >
                <div className="min-w-[80px] w-full border border-[#848484] rounded-[5px]">
                  <button className="block w-full text-left text-xs p-2 bg-white rounded-[5px] hover:bg-[#f8f8f8] cursor-pointer">
                    inactive
                  </button>
                </div>
              </Dropdown>

              {/* Chat Icon */}
              <div className="w-6 h-6 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="17"
                  fill="none"
                  viewBox="0 0 18 17"
                >
                  <path
                    fill="#000"
                    d="M.692 16.615a.6.6 0 0 1-.263-.055.69.69 0 0 1-.429-.637V3.31A3.385 3.385 0 0 1 3.462 0h11.077A3.385 3.385 0 0 1 18 3.31v6.535a3.386 3.386 0 0 1-3.461 3.309H4.438l-3.254 3.26a.7.7 0 0 1-.492.201m2.77-15.23A2.01 2.01 0 0 0 1.385 3.31v10.945l2.277-2.285a.7.7 0 0 1 .492-.2h10.385a2.01 2.01 0 0 0 2.076-1.925V3.31a2.007 2.007 0 0 0-2.076-1.925z"
                  ></path>
                  <path
                    fill="#000"
                    d="M9 7.616A1.038 1.038 0 1 0 9 5.54a1.038 1.038 0 0 0 0 2.077M12.808 7.616a1.039 1.039 0 1 0 0-2.077 1.039 1.039 0 0 0 0 2.077M5.193 7.616a1.038 1.038 0 1 0 0-2.076 1.038 1.038 0 0 0 0 2.076"
                  ></path>
                </svg>
              </div>

              {/* Add site button */}
              <Dropdown
                button={
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                }
              >
                <div className="min-w-[150px] w-full border border-[#848484] rounded-[5px]">
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(
                        searchParams.toString()
                      );
                      params.set("property", "edit");
                      params.set("propertyId", item.id.toString());
                      router.push(`?${params.toString()}`);
                    }}
                    className="block w-full text-left p-2 bg-white rounded-[5px] hover:bg-[#f8f8f8] cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      // setDeleteModal(true);
                      handleDeleteModal(item.id);
                    }}
                    className="block w-full text-left p-2 bg-white rounded-[5px] hover:bg-red-200 hover:text-red-500 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </Dropdown>
            </div>

            {/* Right side - Status strip and actions */}
            <div className="w-8 flex flex-col items-center justify-between py-4 bg-blue-500 rounded-r-[20px]"></div>
          </div>
        ))}
      </div>

      {/* Loading more skeleton */}
      {loadingMore && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <PropertyCardSkeleton key={`loading-${index}`} />
          ))}
        </div>
      )}

      <GlobalModal isOpen={deleteModal} onClose={() => setDeleteModal(false)}>
        <div className="text-center">
          <h2 className="text-lg font-bold">Delete Property</h2>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this property?
          </p>
        </div>
        <div className="flex items-center justify-center mt-4 gap-2">
          <button
            onClick={() => {
              handleDeleteProperty(propertyId as number);
              setDeleteModal(false);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
          <button
            onClick={() => setDeleteModal(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </GlobalModal>

      {/* Intersection observer target */}
      <div ref={loadingRef} className="h-4" />
    </div>
  );
}
