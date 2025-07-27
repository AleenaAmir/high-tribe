"use client";
import React from "react";
import { useSitesForm } from "../contexts/SitesFormContext";
import { Section } from "../types/sites";

interface SitesFormSidebarProps {
  sections: Section[];
}

const SitesFormSidebar: React.FC<SitesFormSidebarProps> = ({ sections }) => {
  const { state } = useSitesForm();

  // Check if section is completed based on required fields
  const isSectionCompleted = (section: Section) => {
    if (section.requiredFields.length === 0) return true;

    return section.requiredFields.every((field) => {
      // Check different parts of the state based on field name
      let value: any;

      // Check if field is in formData
      if (field in state.formData) {
        value = state.formData[field as keyof typeof state.formData];
      }
      // Check if field is in root state
      else if (field in state) {
        value = state[field as keyof typeof state];
      }
      // Check specific fields that might be stored differently
      else if (field === "maxGroupSize") {
        value = state.guestMax;
      } else if (field === "pricing") {
        value = state.pricingType;
      } else if (field === "guestMax") {
        value = state.guestMax;
      } else if (field === "pricingType") {
        value = state.pricingType;
      } else if (field === "noticePeriod") {
        value = state.noticePeriod;
      } else if (field === "cancellationPolicy") {
        value = state.cancellationPolicy;
      } else if (field === "bookingType") {
        value = state.bookingType;
      } else {
        value = null;
      }

      // Debug logging
      console.log(`Section ${section.id}, Field ${field}:`, value);

      // Special handling for array fields that might be undefined
      if (Array.isArray(value) && value.length === 0) {
        console.log(`Section ${section.id}, Field ${field} is empty array`);
      }

      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === "boolean") {
        return value === true;
      }
      return value && value.toString().trim() !== "";
    });
  };

  // Get section completion status
  const getSectionStatus = (section: Section) => {
    const baseComplete = isSectionCompleted(section);

    if (section.id === "location") {
      return state.formData.entranceLocation; // Site is complete when exact entrance location is set
    }

    if (section.id === "images") {
      return state.uploadedImages.length > 0 || state.coverImage !== null;
    }

    // Debug logging for availability section
    if (section.id === "availability") {
      console.log("Availability section debug:", {
        baseComplete,
        bookingType: state.bookingType,
        noticePeriod: state.noticePeriod,
        cancellationPolicy: state.cancellationPolicy,
      });
    }

    return baseComplete;
  };

  // Scroll to section
  const scrollToSection = (
    sectionRef: React.RefObject<HTMLDivElement | null>
  ) => {
    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  };

  return (
    <div className="w-80 bg-white shadow-lg h-screen overflow-y-auto sticky top-16">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Sites Setup</h1>
        <div className="space-y-3">
          {sections.map((section, index) => {
            const isCompleted = getSectionStatus(section);
            return (
              <div
                key={section.id}
                className="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                onClick={() => scrollToSection(section.ref)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-medium ${
                    isCompleted
                      ? "bg-[#1179FA] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? "✓" : index + 1}
                </div>
                <span className={`font-medium text-sm`}>{section.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SitesFormSidebar;
