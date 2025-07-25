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
  let token = "";
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || "";
  }

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("site_id", "16");
    formData.append("check_in_time", state.formData.checkInTime);
    formData.append("check_out_time", state.formData.checkOutTime);
    formData.append("arrival_instructions", state.formData.arrivalInstructions);

    fetch("http://3.6.115.88/api/properties/16/sites/arrival-instructions", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  return (
    <div ref={sectionRef}>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Arrival Instructions
        </h2>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-sm mt-4">
        <p className="text-[#1C231F] font-bold max-w-[590px]">
          Arrival Instructions should include the following content (will not be
          displayed for RV accommodation type):
        </p>
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
