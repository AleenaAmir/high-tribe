"use client";
import React, { useRef } from "react";
import { useSitesForm } from "./hooks/useSitesForm";
import SitesFormSidebar from "./components/SitesFormSidebar";
import SiteLocationSection from "./components/SiteLocationSection";
import SiteOverviewSection from "./components/SiteOverviewSection";
import SiteImagesSection from "./components/SiteImagesSection";
import SiteAmenitiesSection from "./components/SiteAmenitiesSection";
import SitePricingSection from "./components/SitePricingSection";
import SiteExtrasSection from "./components/SiteExtrasSection";
import SiteAvailabilitySection from "./components/SiteAvailabilitySection";
import SiteArrivalSection from "./components/SiteArrivalSection";
import { Section } from "./types/sites";

interface SitesFormProps {
  onBack?: () => void;
}

const SitesFormContent: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const formMethods = useSitesForm();
  const { publishSite, saveAsDraft, isPublishing, isSaving } = formMethods;

  // Section refs for scrolling
  const locationRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const amenitiesRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const extrasRef = useRef<HTMLDivElement>(null);
  const availabilityRef = useRef<HTMLDivElement>(null);
  const arrivalRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  const sections: Section[] = [
    {
      id: "location",
      title: "Site Location",
      icon: "📍",
      ref: locationRef,
      requiredFields: ["entranceLocation"],
    },
    {
      id: "overview",
      title: "Site Overview",
      icon: "📋",
      ref: overviewRef,
      requiredFields: ["siteArea", "siteName", "siteType", "languagesSpoken"],
    },
    {
      id: "images",
      title: "Site Images/Videos",
      icon: "📷",
      ref: imagesRef,
      requiredFields: [],
    },
    {
      id: "amenities",
      title: "Site Amenities and Facilities",
      icon: "🏕️",
      ref: amenitiesRef,
      requiredFields: ["activities"],
    },
    {
      id: "pricing",
      title: "Site Pricing and Capacity",
      icon: "💰",
      ref: pricingRef,
      requiredFields: ["maxGroupSize", "pricing"],
    },
    {
      id: "extras",
      title: "Extras",
      icon: "⭐",
      ref: extrasRef,
      requiredFields: [],
    },
    {
      id: "availability",
      title: "Availability and Booking Details",
      icon: "📅",
      ref: availabilityRef,
      requiredFields: ["safetyMeasures"],
    },
    {
      id: "arrival",
      title: "Arrival Instructions",
      icon: "🚗",
      ref: arrivalRef,
      requiredFields: ["arrivalInstructions"],
    },
    {
      id: "review",
      title: "Review and Publish",
      icon: "✅",
      ref: reviewRef,
      requiredFields: ["termsAccepted"],
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPublishing) {
      await publishSite();
    }
  };

  const handleExit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSaving) {
      await saveAsDraft();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Left Sidebar */}
        <SitesFormSidebar sections={sections} formMethods={formMethods} />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <form
            onSubmit={handleSubmit}
            className="max-w-[940px] mx-auto space-y-8"
          >
            {/* Site Location Section */}
            <SiteLocationSection
              sectionRef={locationRef}
              formMethods={formMethods}
            />

            {/* Site Overview Section */}
            <SiteOverviewSection
              sectionRef={overviewRef}
              formMethods={formMethods}
            />

            {/* Site Images/Videos Section */}
            <SiteImagesSection
              sectionRef={imagesRef}
              formMethods={formMethods}
            />

            {/* Site Amenities and Facilities Section */}
            <SiteAmenitiesSection
              sectionRef={amenitiesRef}
              formMethods={formMethods}
            />

            {/* Site Pricing and Capacity Section */}
            <SitePricingSection
              sectionRef={pricingRef}
              formMethods={formMethods}
            />

            {/* Extras Section */}
            <SiteExtrasSection
              sectionRef={extrasRef}
              formMethods={formMethods}
            />

            {/* Availability and Booking Details Section */}
            <SiteAvailabilitySection
              sectionRef={availabilityRef}
              formMethods={formMethods}
            />

            {/* Arrival Instructions Section */}
            <SiteArrivalSection
              sectionRef={arrivalRef}
              formMethods={formMethods}
            />

            {/* Submit Button */}
            <div ref={reviewRef} className="flex justify-end pt-4 gap-4">
              <button
                type="button"
                className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleExit}
                disabled={isSaving || isPublishing}
              >
                {isSaving ? "Saving..." : "Save as draft"}
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSaving || isPublishing}
              >
                {isPublishing ? "Publishing..." : "Review & Publish"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const SitesForm: React.FC<SitesFormProps> = ({ onBack }) => {
  return <SitesFormContent onBack={onBack} />;
};

export default SitesForm;
