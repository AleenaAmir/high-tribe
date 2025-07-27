"use client";
import React from "react";
import { useSitesForm } from "../hooks/useSitesForm";
import { Section } from "../types/sites";

interface SitesFormSidebarProps {
  sections: Section[];
  formMethods: ReturnType<typeof useSitesForm>;
}

const SitesFormSidebar: React.FC<SitesFormSidebarProps> = ({
  sections,
  formMethods,
}) => {
  const { watch, uploadedImages, coverImage, completedSections } = formMethods;

  // Watch form values for completion checking
  const formData = watch();

  // Check if section is completed based on required fields
  const isSectionCompleted = (section: Section) => {
    // If section is marked as completed (data posted), show as completed
    if (completedSections.has(section.id)) {
      return true;
    }

    if (section.requiredFields.length === 0) return true;

    return section.requiredFields.every((field) => {
      const value = formData[field as keyof typeof formData];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value && value.toString().trim() !== "";
    });
  };

  // Get section completion status
  const getSectionStatus = (section: Section) => {
    // If section is marked as completed (data posted), show as completed
    if (completedSections.has(section.id)) {
      return true;
    }

    const baseComplete = isSectionCompleted(section);

    if (section.id === "location") {
      return formData.entranceLocation; // Site is complete when exact entrance location is set
    }

    if (section.id === "images") {
      return uploadedImages.length > 0 || coverImage !== null;
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
            const isPosted = completedSections.has(section.id);

            return (
              <div
                key={section.id}
                className="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                onClick={() => scrollToSection(section.ref)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-medium ${
                    isPosted
                      ? "bg-green-600 text-white" // Posted sections are green
                      : isCompleted
                      ? "bg-[#1179FA] text-white" // Filled sections are blue
                      : "bg-gray-200 text-gray-500" // Empty sections are gray
                  }`}
                >
                  {isPosted ? "✓" : isCompleted ? "✓" : index + 1}
                </div>
                <div className="flex flex-col">
                  <span className={`font-medium text-sm`}>{section.title}</span>
                  {isPosted && (
                    <span className="text-xs text-green-600">Posted</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SitesFormSidebar;
