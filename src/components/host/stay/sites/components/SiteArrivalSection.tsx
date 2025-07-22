"use client";
import React from "react";
import GlobalTextInput from "../../../../global/GlobalTextInput";
import GlobalTextArea from "../../../../global/GlobalTextArea";
import { useSitesForm } from "../contexts/SitesFormContext";

interface SiteArrivalSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

const SiteArrivalSection: React.FC<SiteArrivalSectionProps> = ({
  sectionRef,
}) => {
  const { state, updateFormData, saveSection } = useSitesForm();

  const handleInputChange = (field: string, value: string) => {
    updateFormData(field, value);
  };

  const handleSave = async () => {
    const arrivalData = {
      checkInTime: state.formData.checkInTime,
      checkOutTime: state.formData.checkOutTime,
      arrivalInstructions: state.formData.arrivalInstructions,
    };

    await saveSection("arrival", arrivalData);
  };

  return (
    <div ref={sectionRef}>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Arrival Instructions
        </h2>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-sm mt-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <GlobalTextInput
              label="Check-in Time"
              type="time"
              value={state.formData.checkInTime}
              onChange={(e) => handleInputChange("checkInTime", e.target.value)}
            />
            <GlobalTextInput
              label="Check-out Time"
              type="time"
              value={state.formData.checkOutTime}
              onChange={(e) =>
                handleInputChange("checkOutTime", e.target.value)
              }
            />
          </div>
          <GlobalTextArea
            label="Arrival Instructions*"
            placeholder="Provide detailed instructions for visitors to find and access your site..."
            value={state.formData.arrivalInstructions}
            onChange={(e) =>
              handleInputChange("arrivalInstructions", e.target.value)
            }
            rows={5}
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteArrivalSection;
