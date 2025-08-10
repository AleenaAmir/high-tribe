import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import Dropdown from "@/components/global/dropdown";
import GlobalModal from "@/components/global/GlobalModal";
import toast from "react-hot-toast";

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

  const [deleteModal, setDeleteModal] = useState(false);
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

  const handleDeleteSite = async (siteId: number) => {
    try {
      await apiRequest(`properties/${propertyId}/sites/${siteId}`, {
        method: "DELETE",
      });
      // Remove the deleted property from the state
      setSites(sites.filter((site) => site.id !== siteId));
      toast.error("Site deleted successfully");
    } catch (error) {
      console.error("Failed to delete property:", error);
      // You might want to show a toast notification here
    }
  };

  const [siteId, setSiteId] = useState<number | null>(null);

  const handleModalOpen = (siteId: number) => {
    setDeleteModal(true);
    setSiteId(siteId);
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
        {sites.map((site, index) => {
          console.log(site.id);
          return (
            <div
              key={site.id || index}
              className="bg-white border max-h-[100px] border-gray-200 rounded-[20px] hover:shadow-md transition-shadow relative flex justify-between gap-4"
            >
              <div className="flex items-start p-2">
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
                <div className="">
                  <h4 className="text-[16px] font-[600] mb-1 line-clamp-1">
                    {site.site_name || "No Name"}
                  </h4>

                  <p className="text-[14px] font-medium text-black mb-1 line-clamp-1">
                    {site.site_description || "No Description"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <div className="p-5 border-x h-full border-[#EBEBEB] flex items-center justify-center text-[16px] font-bold text-[#000]">
                  $125
                </div>
                <div className="p-3 flex items-end gap-2 justify-between min-w-[150px] max-w-[150px] w-full h-full">
                  <p
                    className={`text-[9px] md:text-[12px] font-bold hover:underline ${
                      site?.publish_status === "published"
                        ? "text-[#1179FA]"
                        : "text-[#FF0000]"
                    }`}
                  >
                    {site?.publish_status}
                  </p>
                  <div className="flex flex-col justify-between items-end gap-1 p-2">
                                         <Dropdown
                       btnClassName="dropdown"
                       button={
                         <div className="flex items-center space-x-1 border rounded-full px-2 py-0.5 border-blue-600">
                           <span className="text-[9px] font-medium text-blue-600">
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
                       <div className="text-[9px] font-medium min-w-[90px] w-full border border-[#848484] rounded-[5px]">
                         <button
                           onClick={() => {
                             console.log("Set site to inactive for site:", site.id);
                             // Here you would call API to update site status to inactive
                           }}
                           className="block w-full text-left p-2 bg-white rounded-[5px] hover:bg-orange-100 hover:text-orange-600 cursor-pointer"
                         >
                           Inactive
                         </button>
                       </div>
                     </Dropdown>

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
                            params.set("siteEdit", "true");
                            params.set("siteId", site.id.toString());
                            router.push(`?${params.toString()}`);
                          }}
                          className="block w-full text-left p-2 bg-white rounded-[5px] hover:bg-[#f8f8f8] cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleModalOpen(site.id);
                          }}
                          className="block w-full text-left p-2 bg-white rounded-[5px] hover:bg-red-200 hover:text-red-500 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <GlobalModal isOpen={deleteModal} onClose={() => setDeleteModal(false)}>
        <div className="text-center">
          <h2 className="text-lg font-bold">Delete Site</h2>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this site?
          </p>
        </div>
        <div className="flex items-center justify-center mt-4 gap-2">
          <button
            onClick={() => {
              handleDeleteSite(siteId || 0);
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
    </div>
  );
}
