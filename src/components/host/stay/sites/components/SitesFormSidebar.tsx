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
      const value = state.formData[field as keyof typeof state.formData];
      if (Array.isArray(value)) {
        return value.length > 0;
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
