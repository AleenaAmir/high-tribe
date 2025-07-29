"use client";
import React, { useState } from "react";
import { useSitesForm } from "../contexts/SitesFormContext";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

interface SiteAmenitiesSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

interface ValidationErrors {
  siteAmenities?: string;
  siteFacilities?: string;
  safetyItems?: string;
  petPolicy?: string;
  otherAmenities?: string;
  otherFacilities?: string;
  otherSafety?: string;
  parkingVehicles?: string;
  paidParkingVehicles?: string;
}

const SiteAmenitiesSection: React.FC<SiteAmenitiesSectionProps> = ({
  sectionRef,
}) => {
  const { state, updateFormData, saveSection } = useSitesForm();
  const searchParams = useSearchParams();
  const propertyId = searchParams ? searchParams.get("propertyId") : null;
  const siteId = searchParams ? searchParams.get("siteId") : null;

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: string | string[]) => {
    updateFormData(field, value);
    // Clear validation error when user starts typing/selecting
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Validate site amenities (at least 1 required)
    if (
      !state.formData.siteAmenities ||
      state.formData.siteAmenities.length === 0
    ) {
      errors.siteAmenities = "Please select at least one amenity";
    }

    // Validate other amenities if "Other" is selected
    if (
      state.formData.siteAmenities?.includes("other-amenities") &&
      (!state.formData.otherAmenities ||
        state.formData.otherAmenities.trim() === "")
    ) {
      errors.otherAmenities = "Please specify the other amenity";
    }

    // Validate site facilities (at least 1 required)
    if (
      !state.formData.siteFacilities ||
      state.formData.siteFacilities.length === 0
    ) {
      errors.siteFacilities = "Please select at least one facility";
    }

    // Validate other facilities if "Other" is selected
    if (
      state.formData.siteFacilities?.includes("other-facilities") &&
      (!state.formData.otherFacilities ||
        state.formData.otherFacilities.trim() === "")
    ) {
      errors.otherFacilities = "Please specify the other facility";
    }

    // Validate safety items (at least 1 required)
    if (
      !state.formData.safetyItems ||
      state.formData.safetyItems.length === 0
    ) {
      errors.safetyItems = "Please select at least one safety item";
    }

    // Validate other safety if "Other" is selected
    if (
      state.formData.safetyItems?.includes("other-safety") &&
      (!state.formData.otherSafety || state.formData.otherSafety.trim() === "")
    ) {
      errors.otherSafety = "Please specify the other safety item";
    }

    // Validate pet policy (required)
    if (!state.formData.petPolicy) {
      errors.petPolicy = "Please select a pet policy";
    }

    // Validate parking vehicles if free parking is selected
    if (
      state.formData.siteFacilities?.includes("free-parking") &&
      (!state.formData.parkingVehicles ||
        state.formData.parkingVehicles.trim() === "")
    ) {
      errors.parkingVehicles = "Please specify the number of allowed vehicles";
    }

    // Validate paid parking vehicles if paid parking is selected
    if (
      state.formData.siteFacilities?.includes("paid-parking") &&
      (!state.formData.paidParkingVehicles ||
        state.formData.paidParkingVehicles.trim() === "")
    ) {
      errors.paidParkingVehicles =
        "Please specify the number of allowed vehicles";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors before saving");
      return;
    }

    setIsSaving(true);
    const formData = new FormData();

    //@ts-ignore
    formData.append("site_id", siteId);

    // Append array fields
    (state.formData.siteAmenities || []).forEach((item: string) =>
      formData.append("amenities[]", item)
    );

    (state.formData.siteFacilities || []).forEach((item: string) =>
      formData.append("facilities[]", item)
    );

    (state.formData.safetyItems || []).forEach((item: string) =>
      formData.append("safety_items[]", item)
    );

    // Append other fields
    if (state.formData.otherAmenities)
      formData.append("other_amenity", state.formData.otherAmenities);

    if (state.formData.otherFacilities)
      formData.append("other_facility", state.formData.otherFacilities);

    if (state.formData.otherSafety)
      formData.append("other_safety_item", state.formData.otherSafety);

    if (state.formData.petPolicy)
      formData.append("pet_policy", state.formData.petPolicy);

    if (state.formData.parkingVehicles)
      formData.append("free_parking_slots", state.formData.parkingVehicles);

    if (state.formData.paidParkingVehicles)
      formData.append("paid_parking_slots", state.formData.paidParkingVehicles);

    // Call API
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://api.hightribe.com/api/properties/${propertyId}/sites/amenities`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success("Amenities saved successfully!");
        console.log("API response:", result);
      } else {
        toast.error("Failed to save amenities");
      }
    } catch (error) {
      console.error("Error saving amenities:", error);
      toast.error("An error occurred while saving amenities");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div ref={sectionRef}>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Site Amenities and Facilities
        </h2>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-sm mt-4">
        <div className="space-y-8">
          {/* Site Amenities */}
          <div>
            <label className="text-sm font-medium text-gray-900 block mb-3">
              Let guests know which amenities are in this site.{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center flex-wrap gap-2">
              {[
                { id: "wifi", label: "Wi-Fi" },
                { id: "tv", label: "TV" },
                { id: "kitchen", label: "Kitchen" },
                { id: "bathroom", label: "Bathroom" },
                {
                  id: "shared-non-ensuite",
                  label: "Shared Non-ensuite Bathroom",
                },
                {
                  id: "private-non-ensuite",
                  label: "Private Non-ensuite Bathroom",
                },
                { id: "private-ensuite", label: "Private Ensuite Bathroom" },
                { id: "shared-ensuite", label: "Shared Ensuite Bathroom" },
                { id: "washer", label: "Washer" },
                { id: "air-conditioner", label: "Air Conditioner" },
                { id: "heating-system", label: "Heating System" },
                { id: "bed-linens", label: "Bed Linens" },
                { id: "clothing-storage", label: "Clothing Storage" },
                { id: "extra-pillows", label: "Extra Pillows" },
                { id: "extra-blankets", label: "Extra Blankets" },
                { id: "hangers", label: "Hangers" },
                { id: "iron", label: "Iron" },
                { id: "other-amenities", label: "Other" },
              ].map((amenity) => (
                <label
                  key={amenity.id}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-black rounded-[5px] cursor-pointer hover:bg-gray-50 transition-colors text-gray-800 text-[13px] font-normal whitespace-nowrap"
                >
                  <input
                    type="checkbox"
                    checked={
                      state.formData.siteAmenities?.includes(amenity.id) ||
                      false
                    }
                    onChange={(e) => {
                      const currentAmenities =
                        state.formData.siteAmenities || [];
                      if (e.target.checked) {
                        handleInputChange("siteAmenities", [
                          ...currentAmenities,
                          amenity.id,
                        ]);
                      } else {
                        handleInputChange(
                          "siteAmenities",
                          currentAmenities.filter((a) => a !== amenity.id)
                        );
                      }
                    }}
                    className="w-4 h-4 border border-gray-400 rounded-sm focus:ring-0 focus:ring-offset-0 mr-1 accent-blue-600"
                    style={{ minWidth: 16, minHeight: 16 }}
                  />
                  <span className="text-[14px]">{amenity.label}</span>
                  {amenity.id === "other-amenities" && (
                    <input
                      type="text"
                      // placeholder="Please specify..."
                      className={`text-[13px] border rounded-[5px] font-normal text-gray-800 bg-transparent outline-none p-1 ml-2 min-w-[300px] ${
                        validationErrors.otherAmenities
                          ? "border-red-500"
                          : "border-[#848484]"
                      }`}
                      value={state.formData.otherAmenities || ""}
                      onChange={(e) =>
                        handleInputChange("otherAmenities", e.target.value)
                      }
                    />
                  )}
                </label>
              ))}
            </div>
            {validationErrors.siteAmenities && (
              <p className="text-red-500 text-sm mt-2">
                {validationErrors.siteAmenities}
              </p>
            )}
            {validationErrors.otherAmenities && (
              <p className="text-red-500 text-sm mt-2">
                {validationErrors.otherAmenities}
              </p>
            )}
          </div>

          {/* Facilities */}
          <div>
            <label className="text-sm font-medium text-gray-900 block mb-3">
              Do you have any other facilities to which the guests will have
              access? Select all that apply{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center flex-wrap gap-2">
              {[
                { id: "shared-pool", label: "Shared Pool" },
                { id: "private-pool", label: "Private Pool" },
                { id: "hot-tub", label: "Hot Tub" },
                { id: "outdoor-seating", label: "Outdoor Seating or Patio" },
                { id: "fire-pit", label: "Fire Pit or Barbecue" },
                { id: "outdoor-dining", label: "Outdoor Dining Area" },
                { id: "play-area", label: "Play Area" },
                { id: "indoor-games", label: "Indoor Games" },
                { id: "outdoor-games", label: "Outdoor Games" },
                { id: "indoor-fireplace", label: "Indoor Fireplace" },
                { id: "musical-instruments", label: "Musical Instruments" },
                { id: "facility-kitchen", label: "Kitchen" },
                { id: "shared-bathroom", label: "Shared Bathroom" },
                { id: "gym", label: "Gym" },
                { id: "lake-access", label: "Lake Access" },
                { id: "beach-access", label: "Beach Access" },
                { id: "outdoor-shower", label: "Outdoor Shower" },
                { id: "art-studio", label: "Art Studio / Creative Zone" },
                { id: "wheelchair", label: "Wheelchair" },
                { id: "dedicated-workspace", label: "Dedicated Workspace" },
                { id: "free-parking", label: "Free Parking" },
                { id: "paid-parking", label: "Paid Parking" },
                { id: "other-facilities", label: "Other" },
              ].map((facility) => (
                <label
                  key={facility.id}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-black rounded-[5px] cursor-pointer hover:bg-gray-50 transition-colors text-gray-800 text-[13px] font-normal whitespace-nowrap"
                >
                  <input
                    type="checkbox"
                    checked={
                      state.formData.siteFacilities?.includes(facility.id) ||
                      false
                    }
                    onChange={(e) => {
                      const currentFacilities =
                        state.formData.siteFacilities || [];
                      if (e.target.checked) {
                        handleInputChange("siteFacilities", [
                          ...currentFacilities,
                          facility.id,
                        ]);
                      } else {
                        handleInputChange(
                          "siteFacilities",
                          currentFacilities.filter((f) => f !== facility.id)
                        );
                      }
                    }}
                    className="w-4 h-4 border border-gray-400 rounded-sm focus:ring-0 focus:ring-offset-0 mr-1 accent-blue-600"
                    style={{ minWidth: 16, minHeight: 16 }}
                  />
                  <span className="text-[14px]">{facility.label}</span>
                  {facility.id === "free-parking" && (
                    <input
                      type="number"
                      placeholder="Number of allowed vehicles"
                      className={`text-[13px] border rounded-[5px] font-normal text-gray-800 bg-transparent outline-none p-1 ml-2 min-w-[200px] ${
                        validationErrors.parkingVehicles
                          ? "border-red-500"
                          : "border-[#848484]"
                      }`}
                      value={state.formData.parkingVehicles || ""}
                      onChange={(e) =>
                        handleInputChange("parkingVehicles", e.target.value)
                      }
                    />
                  )}
                </label>
              ))}
            </div>
            {validationErrors.siteFacilities && (
              <p className="text-red-500 text-sm mt-2">
                {validationErrors.siteFacilities}
              </p>
            )}
            {validationErrors.otherFacilities && (
              <p className="text-red-500 text-sm mt-2">
                {validationErrors.otherFacilities}
              </p>
            )}
            {validationErrors.parkingVehicles && (
              <p className="text-red-500 text-sm mt-2">
                {validationErrors.parkingVehicles}
              </p>
            )}
            {validationErrors.paidParkingVehicles && (
              <p className="text-red-500 text-sm mt-2">
                {validationErrors.paidParkingVehicles}
              </p>
            )}
          </div>

          {/* Safety Items */}
          <div>
            <label className="text-sm font-medium text-gray-900 block mb-3">
              Do you have any of these safety items?{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center flex-wrap gap-2">
              {[
                { id: "smoke-alarm", label: "Smoke Alarm" },
                { id: "first-aid-kit", label: "First Aid Kit" },
                { id: "fire-extinguisher", label: "Fire Extinguisher" },
                { id: "carbon-monoxide-alarm", label: "Carbon Monoxide Alarm" },
                // { id: "other-safety", label: "Other" },
              ].map((safety) => (
                <label
                  key={safety.id}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-black rounded-[5px] cursor-pointer hover:bg-gray-50 transition-colors text-gray-800 text-[13px] font-normal whitespace-nowrap"
                >
                  <input
                    type="checkbox"
                    checked={
                      state.formData.safetyItems?.includes(safety.id) || false
                    }
                    onChange={(e) => {
                      const currentSafetyItems =
                        state.formData.safetyItems || [];
                      if (e.target.checked) {
                        handleInputChange("safetyItems", [
                          ...currentSafetyItems,
                          safety.id,
                        ]);
                      } else {
                        handleInputChange(
                          "safetyItems",
                          currentSafetyItems.filter((s) => s !== safety.id)
                        );
                      }
                    }}
                    className="w-4 h-4 border border-gray-400 rounded-sm focus:ring-0 focus:ring-offset-0 mr-1 accent-blue-600"
                    style={{ minWidth: 16, minHeight: 16 }}
                  />
                  <span className="text-[14px]">{safety.label}</span>
                </label>
              ))}
            </div>
            {validationErrors.safetyItems && (
              <p className="text-red-500 text-sm mt-2">
                {validationErrors.safetyItems}
              </p>
            )}
            {validationErrors.otherSafety && (
              <p className="text-red-500 text-sm mt-2">
                {validationErrors.otherSafety}
              </p>
            )}
          </div>

          {/* Pet Policy */}
          <div>
            <label className="text-sm font-medium text-gray-900 block mb-3">
              Do you allow pet? <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center flex-wrap gap-2">
              {[
                { id: "yes", label: "Yes" },
                { id: "no", label: "No" },
              ].map((pet) => (
                <label
                  key={pet.id}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-black rounded-[5px] cursor-pointer hover:bg-gray-50 transition-colors text-gray-800 text-[13px] font-normal whitespace-nowrap"
                >
                  <input
                    type="radio"
                    name="petPolicy"
                    checked={state.formData.petPolicy === pet.id}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange("petPolicy", pet.id);
                      }
                    }}
                    className="w-4 h-4 border border-gray-400 rounded-sm focus:ring-0 focus:ring-offset-0 mr-1 accent-blue-600"
                    style={{ minWidth: 16, minHeight: 16 }}
                  />
                  <span className="text-[14px]">{pet.label}</span>
                </label>
              ))}
            </div>

            {/* Show additional options only when "Yes" is selected */}
            {(state.formData.petPolicy === "yes" ||
              state.formData.petPolicy === "yes_on_leash" ||
              state.formData.petPolicy === "yes_without_leash") && (
              <div className="mt-3">
                <label className="text-sm font-medium text-gray-900 block mb-2">
                  Pet restrictions:
                </label>
                <div className="flex items-center flex-wrap gap-2">
                  {[
                    { id: "yes_on_leash", label: "On leash" },
                    { id: "yes_without_leash", label: "Without leash" },
                  ].map((restriction) => (
                    <label
                      key={restriction.id}
                      className="flex items-center justify-center gap-2 px-3 py-2 border border-black rounded-[5px] cursor-pointer hover:bg-gray-50 transition-colors text-gray-800 text-[13px] font-normal whitespace-nowrap"
                    >
                      <input
                        type="radio"
                        name="petRestriction"
                        checked={state.formData.petPolicy === restriction.id}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleInputChange("petPolicy", restriction.id);
                          }
                        }}
                        className="w-4 h-4 border border-gray-400 rounded-sm focus:ring-0 focus:ring-offset-0 mr-1 accent-blue-600"
                        style={{ minWidth: 16, minHeight: 16 }}
                      />
                      <span className="text-[14px]">{restriction.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {validationErrors.petPolicy && (
              <p className="text-red-500 text-sm mt-2">
                {validationErrors.petPolicy}
              </p>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteAmenitiesSection;
