import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SitesForm from "../sites/SitesForm";
import { apiRequest } from "@/lib/api";

interface PropertySitesProps {
  propertyId: number;
  onBack: () => void;
}

export default function PropertySites({
  propertyId,
  onBack,
}: PropertySitesProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showSiteForm = searchParams.get("showSiteForm") === "true";

  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    apiRequest<any>(`properties/${propertyId}/sites`, { method: "GET" })
      .then((data) => {
        if (isMounted) {
          setSites(
            Array.isArray(data?.data)
              ? data.data
              : data?.data
                ? [data.data]
                : []
          );
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Failed to fetch sites");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [propertyId]);

  const handleAddSite = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("showSiteForm", "true");
    router.push(`?${params.toString()}`);
  };

  const handleBackToSites = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("showSiteForm");
    router.push(`?${params.toString()}`);
  };

  if (showSiteForm) {
    return (
      <div>
        {/* Back button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBackToSites}
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
            <span className="text-sm font-medium">Back to Sites</span>
          </button>
        </div>
        {/* Site creation form */}

      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-10">Loading sites...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!sites.length) {
    return (
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">No sites yet</h3>
        <p className="text-gray-500 mb-4">
          Get started by creating your first adventure site.
        </p>
        <button
          onClick={handleAddSite}
          className="text-white bg-black py-2 px-5 rounded-full text-xs cursor-pointer hover:shadow-md"
        >
          + Add a new site
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Sites</h3>
        <button
          type="button"
          onClick={handleAddSite}
          className="text-white bg-black py-2 px-5 rounded-full text-xs cursor-pointer hover:shadow-md"
        >
          + Add a new site
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sites.map((site, index) => (
          <div
            key={site.id || index}
            className="bg-white border border-gray-200 rounded-[20px] hover:shadow-md transition-shadow relative"
          >
            <div className="flex items-start flex-1 p-3">
              <div className="w-16 h-16 my-auto rounded-lg overflow-hidden flex-shrink-0 mr-3">
                <img
                  src={
                    site.media?.[0]?.file_path ||
                    "https://via.placeholder.com/150?text=No+Image"
                  }
                  alt={site.name || "Site"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                  {site.site_name || "No Name"}
                </h4>

                <p className="text-xs text-gray-500 mb-1 line-clamp-1">
                  {site.site_description || "No Description"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
