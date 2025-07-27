"use client";
import React from "react";
import GlobalTextInput from "../../../../global/GlobalTextInput";
import GlobalTextArea from "../../../../global/GlobalTextArea";
import { useSitesForm } from "../hooks/useSitesForm";
import FormError from "./FormError";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

interface SiteArrivalSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

const SiteArrivalSection: React.FC<SiteArrivalSectionProps> = ({
  sectionRef,
}) => {
  const {
    setValue,
    watch,
    formState: { errors },
    saveSection,
  } = useSitesForm();

  const searchParams = useSearchParams();
  const propertyId = searchParams ? searchParams.get("propertyId") : null;
  const siteId = searchParams ? searchParams.get("siteId") : null;

  // Watch form values
  const checkInTime = watch("checkInTime") || "";
  const checkOutTime = watch("checkOutTime") || "";
  const arrivalInstructions = watch("arrivalInstructions") || "";

  const handleInputChange = (field: string, value: string) => {
    setValue(field, value);
  };

  const handleSave = async () => {
    try {
      const isValid = await saveSection("arrival");
      if (!isValid) {
        return;
      }

      const formData = new FormData();
      // @ts-ignore
      formData.append("site_id", siteId);
      formData.append("check_in_time", checkInTime);
      formData.append("check_out_time", checkOutTime);
      formData.append("arrival_instructions", arrivalInstructions);

      let token = "";
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token") || "";
      }

      const response = await fetch(
        `https://api.hightribe.com/api/properties/${propertyId}/sites/arrival-instructions`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("✅ Arrival instructions saved successfully:", data);
        toast.success("Arrival instructions saved successfully");
      } else {
        console.error("❌ Failed to save arrival instructions:", data);
        toast.error("Failed to save arrival instructions");
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      toast.error("An error occurred while saving arrival instructions");
    }
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
              value={checkInTime}
              onChange={(e) => handleInputChange("checkInTime", e.target.value)}
            />
            <GlobalTextInput
              label="Check-out Time"
              type="time"
              value={checkOutTime}
              onChange={(e) =>
                handleInputChange("checkOutTime", e.target.value)
              }
            />
          </div>
          <GlobalTextArea
            label="Arrival Instructions*"
            placeholder="Provide detailed instructions for visitors to find and access your site..."
            value={arrivalInstructions}
            onChange={(e) =>
              handleInputChange("arrivalInstructions", e.target.value)
            }
            rows={5}
          />
          <FormError error={errors.arrivalInstructions?.message} />
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
