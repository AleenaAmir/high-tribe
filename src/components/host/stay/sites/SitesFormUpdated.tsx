"use client";
import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiFormDataWrapper, apiRequest } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

// Import form components
import SiteOverViewForm from "./formcomponents/SiteOverViewForm";
import SiteAmenitiesAndFacilities from "./formcomponents/SiteAmenitiesAndFacilities";
import SitesImagesSection from "./formcomponents/SitesImagesSection";
import SiteCapacityForm from "./formcomponents/SiteCapacityForm";
import SitesPricingForm from "./formcomponents/SitesPricingForm";
import SitesBookingSettingsForm from "./formcomponents/SitesBookingSettingsForm";
import SitesRefundPolicyForm from "./formcomponents/SitesRefundPolicyForm";
import SiteArrivalSection from "./formcomponents/SiteArrivalSection";
import SitesPreview from "./SitesPreview";
import SitesPolicyForm from "./formcomponents/SitesPolicyForm";

// Safe URL utility function
const createSafeUrl = (
  baseUrl: string,
  searchParams: URLSearchParams
): string | null => {
  try {
    // Validate base URL
    if (!baseUrl || baseUrl === "about:blank") {
      return null;
    }

    // Ensure we have a valid URL format
    if (!baseUrl.startsWith("http") && !baseUrl.startsWith("/")) {
      return null;
    }

    const url = new URL(baseUrl);
    // Copy search params
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    return url.toString();
  } catch (error) {
    console.warn("Failed to create safe URL:", error);
    return null;
  }
};

// Helper function to safely update URL parameters
const safelyUpdateUrl = (paramName: string, paramValue: string) => {
  if (typeof window === "undefined") return;

  try {
    // Check if we have a valid href
    if (!window.location.href || window.location.href === "about:blank") {
      throw new Error("Invalid window.location.href");
    }

    // Additional validation for URL construction
    if (
      !window.location.href.startsWith("http") &&
      !window.location.href.startsWith("/")
    ) {
      throw new Error("Invalid URL format");
    }

    const url = new URL(window.location.href);
    url.searchParams.set(paramName, paramValue);
    window.history.replaceState({}, "", url.toString());
  } catch (error) {
    console.warn("Failed to update URL:", error);
    // Fallback: manually construct URL
    try {
      const currentUrl = window.location.pathname + window.location.search;
      const separator = currentUrl.includes("?") ? "&" : "?";
      const newUrl = currentUrl + separator + `${paramName}=${paramValue}`;
      window.history.replaceState({}, "", newUrl);
    } catch (fallbackError) {
      console.error(
        "Failed to update URL with fallback method:",
        fallbackError
      );
    }
  }
};

// Zod validation schema for the main form
const sitesFormSchema = z.object({
  // Add any main form validation if needed
});

type SitesFormData = z.infer<typeof sitesFormSchema>;

interface Section {
  id: string;
  title: string;
  ref: React.RefObject<HTMLDivElement | null>;
  isCompleted: boolean;
}

const SitesFormUpdated: React.FC<{ siteEdit?: string }> = ({ siteEdit }) => {
  const searchParams = useSearchParams();
  const propertyId = searchParams ? searchParams.get("propertyId") : null;
  const siteId = searchParams ? searchParams.get("siteId") : null;
  const sitePreview = searchParams ? searchParams.get("sitepriview") : "false";

  const [enums, setEnums] = useState<any>(null);

  // Add state for site data and loading
  const [siteData, setSiteData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch site data when siteEdit is true
  useEffect(() => {
    const fetchEnums = async () => {
      const data = await apiRequest<any>(`properties/sites/enums`, {
        method: "GET",
      });
      setEnums(data);
    };
    fetchEnums();
    const fetchSiteData = async () => {
      if (siteEdit === "true" && propertyId && siteId) {
        try {
          setLoading(true);
          const data = await apiRequest<any>(
            `properties/${propertyId}/sites/${siteId}`,
            {
              method: "GET",
            }
          );

          const siteData = data.data || data;
          setSiteData(siteData);

          // Mark all sections as completed for edit mode
          setCompletedSections(
            new Set([
              "overview",
              "amenities",
              "images",
              "capacity",
              "pricing",
              "booking",
              "refund",
              "arrival",
            ])
          );
        } catch (error) {
          console.error("Error fetching site data:", error);
          toast.error("Failed to fetch site data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSiteData();
  }, [siteEdit, propertyId, siteId]);

  // Section refs
  const overviewRef = useRef<HTMLDivElement>(null);
  const amenitiesRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const capacityRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);
  const refundRef = useRef<HTMLDivElement>(null);
  const policiesRef = useRef<HTMLDivElement>(null);
  const arrivalRef = useRef<HTMLDivElement>(null);
  const publishRef = useRef<HTMLDivElement>(null);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SitesFormData>({
    resolver: zodResolver(sitesFormSchema),
  });

  // Track completed sections
  const [completedSections, setCompletedSections] = React.useState<Set<string>>(
    new Set()
  );

  const [accommodationType, setAccommodationType] = useState<string | null>(
    null
  );

  const sections: Section[] = [
    {
      id: "overview",
      title: "Site Overview",
      ref: overviewRef,
      isCompleted: completedSections.has("overview"),
    },
    {
      id: "amenities",
      title: "Site Amenities",
      ref: amenitiesRef,
      isCompleted: completedSections.has("amenities"),
    },
    {
      id: "images",
      title: "Site Images",
      ref: imagesRef,
      isCompleted: completedSections.has("images"),
    },
    {
      id: "capacity",
      title: "Site Capacity",
      ref: capacityRef,
      isCompleted: completedSections.has("capacity"),
    },
    {
      id: "pricing",
      title: "Site Pricing",
      ref: pricingRef,
      isCompleted: completedSections.has("pricing"),
    },
    {
      id: "booking",
      title: "Booking Settings",
      ref: bookingRef,
      isCompleted: completedSections.has("booking"),
    },
    {
      id: "refund",
      title: "Refund Policy",
      ref: refundRef,
      isCompleted: completedSections.has("refund"),
    },

    {
      id: "arrival",
      title: "Arrival Instructions",
      ref: arrivalRef,
      isCompleted: completedSections.has("arrival"),
    },
    {
      id: "publish",
      title: "Review and Publish",
      ref: publishRef,
      isCompleted: completedSections.has("publish"),
    },
  ];

  const markSectionComplete = (sectionId: string) => {
    setCompletedSections((prev) => new Set([...prev, sectionId]));
  };

  const scrollToSection = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section?.ref.current) {
      section.ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const onSubmit = async (data: SitesFormData) => {
    try {
      const formData = new FormData();

      // Add site_id
      if (siteId) {
        formData.append("site_id", siteId);
      }

      // Add publish_status
      formData.append("publish_status", "published");

      // Note: scheduled_publish_at is optional and not included in this request
      // as shown in the API image where it's unchecked

      const response = await apiFormDataWrapper<{
        success: boolean;
        message: string;
        data: any;
      }>(
        `properties/${propertyId}/sites/review-publish`,
        formData,
        "Site published successfully!"
      );

      console.log("Form submitted successfully:", response);
      markSectionComplete("publish");

      // Set the search param 'sitepriview' to true
      if (typeof window !== "undefined") {
        safelyUpdateUrl("sitepriview", "true");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const formData = new FormData();

      // Add site_id
      if (siteId) {
        formData.append("site_id", siteId);
      }

      // Add publish_status
      formData.append("publish_status", "draft");

      const response = await apiFormDataWrapper<{
        success: boolean;
        message: string;
      }>(
        `properties/${propertyId}/sites/review-publish`,
        formData,
        "Site saved as draft!"
      );

      console.log("Draft saved successfully:", response);
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  // Check if all sections are completed (excluding publish section)
  const allSectionsCompleted = completedSections.size === sections.length - 1;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Left Sidebar */}
          <div className="w-80 bg-white shadow-sm border-r border-gray-200 p-6 sticky top-32 h-screen">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Site Setup
            </h2>
            <div className="space-y-2">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left bg-gray-100 animate-pulse"
                >
                  <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="max-w-[1200px] mx-auto space-y-8">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="border border-gray-200 bg-white p-4 rounded-lg">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white shadow-sm border-r border-gray-200 p-6 sticky top-32 h-screen">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Site Setup
          </h2>
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  section.isCompleted
                    ? "bg-white text-gray-900"
                    : "bg-white text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    section.isCompleted
                      ? "bg-[#1179FA] text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {section.isCompleted && <span className="text-xs">✓</span>}
                </div>
                <span className="font-medium">{section.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}

        {sitePreview === "true" ? (
          <div className="max-w-[1200px] mx-auto">
            <SitesPreview />
          </div>
        ) : (
          <div className="flex-1 p-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="max-w-[1200px] mx-auto space-y-8"
            >
              {/* Site Overview Section */}
              <div ref={overviewRef}>
                <SiteOverViewForm
                  propertyId={propertyId || ""}
                  onSuccess={() => markSectionComplete("overview")}
                  siteData={siteData}
                  isEditMode={siteEdit === "true"}
                  setAccommodationType={setAccommodationType}
                  enums={enums}
                />
              </div>

              {/* Site Amenities Section */}
              <div ref={amenitiesRef}>
                <SiteAmenitiesAndFacilities
                  propertyId={propertyId || ""}
                  siteId={siteId || ""}
                  onSuccess={() => markSectionComplete("amenities")}
                  siteData={siteData}
                  isEditMode={siteEdit === "true"}
                  accommodationType={accommodationType || null}
                  enums={enums}
                />
              </div>

              {/* Site Images Section */}
              <div ref={imagesRef}>
                <SitesImagesSection
                  propertyId={propertyId || ""}
                  siteId={siteId || ""}
                  onSuccess={() => markSectionComplete("images")}
                  siteData={siteData}
                  isEditMode={siteEdit === "true"}
                />
              </div>

              {/* Site Capacity Section */}
              <div ref={capacityRef}>
                <SiteCapacityForm
                  propertyId={propertyId || ""}
                  siteId={siteId || ""}
                  onSuccess={() => markSectionComplete("capacity")}
                  siteData={siteData}
                  isEditMode={siteEdit === "true"}
                  accommodationType={accommodationType || null}
                  // enums={enums}
                />
              </div>

              {/* Site Pricing Section */}
              <div ref={pricingRef}>
                <SitesPricingForm
                  propertyId={propertyId || ""}
                  siteId={siteId || ""}
                  onSuccess={() => markSectionComplete("pricing")}
                  siteData={siteData}
                  isEditMode={siteEdit === "true"}
                />
              </div>

              {/* Booking Settings Section */}
              <div ref={bookingRef}>
                <SitesBookingSettingsForm
                  propertyId={propertyId || ""}
                  siteId={siteId || ""}
                  onSuccess={() => markSectionComplete("booking")}
                  siteData={siteData}
                  isEditMode={siteEdit === "true"}
                />
              </div>

              {/* Refund Policy Section */}
              <div ref={refundRef}>
                <SitesRefundPolicyForm
                  propertyId={propertyId || ""}
                  siteId={siteId || ""}
                  onSuccess={() => markSectionComplete("refund")}
                  siteData={siteData}
                  isEditMode={siteEdit === "true"}
                  accommodationType={accommodationType || null}
                />
              </div>

              {/* Policies Section */}
              {accommodationType !== "lodging_room_cabin" && (
                <div ref={policiesRef}>
                  <SitesPolicyForm
                    propertyId={propertyId || ""}
                    siteId={siteId || ""}
                    // onSuccess={() => markSectionComplete("policies")}
                    siteData={siteData}
                    isEditMode={siteEdit === "true"}
                  />
                </div>
              )}

              {/* Arrival Instructions Section */}
              <div ref={arrivalRef}>
                <SiteArrivalSection
                  propertyId={propertyId || ""}
                  siteId={siteId || ""}
                  onSuccess={() => markSectionComplete("arrival")}
                  siteData={siteData}
                  isEditMode={siteEdit === "true"}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end pt-4 gap-4">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gray-200 w-fit mt-2 h-fit font-[500] text-[14px] hover:bg-gray-300 text-gray-700 rounded-lg  transition-colors text-sm shadow-sm disabled:opacity-50"
                >
                  Save as draft
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !allSectionsCompleted}
                  className={`px-8 py-3 w-fit mt-2 h-fit font-[500] text-[14px] rounded-lg  transition-colors text-sm shadow-sm bg-[#3C83F6] hover:bg-blue-700 text-white disabled:opacity-50`}
                >
                  {isSubmitting ? "Publishing..." : "Review & Publish"}
                </button>
              </div>
              {!allSectionsCompleted && (
                <div className="text-center text-sm text-gray-500 mt-2">
                  Complete all sections to enable publishing
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SitesFormUpdated;
