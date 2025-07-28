"use client";
import React from "react";
import GlobalTextInput from "../../../../global/GlobalTextInput";
import GlobalSelect from "../../../../global/GlobalSelect";
import GlobalTextArea from "../../../../global/GlobalTextArea";
import { useSitesForm } from "../contexts/SitesFormContext";
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface SiteOverviewSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

const SiteOverviewSection: React.FC<SiteOverviewSectionProps> = ({
  sectionRef,
}) => {
  const { state, updateFormData, saveSection, setError, clearError } =
    useSitesForm();
  const searchParams = useSearchParams();
  const router = useRouter();
  const propertyId = searchParams ? searchParams.get("propertyId") : null;
  console.log(propertyId);

  const handleInputChange = (field: string, value: string | string[]) => {
    // Clear any existing error for this field
    clearError(field);
    updateFormData(field, value);
  };

  // Validation function
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!state.formData.accommodation_type) {
      errors.accommodation_type = "Accommodation type is required";
    }

    if (!state.formData.siteName?.trim()) {
      errors.siteName = "Site name is required";
    }

    if (!state.formData.shortDescription?.trim()) {
      errors.shortDescription = "Site description is required";
    }

    if (!state.formData.sitePrivacy) {
      errors.sitePrivacy = "Site privacy is required";
    }

    // Validate house sharing for room_in_house accommodation
    if (
      state.formData.accommodation_type === "room_in_house" &&
      (!state.formData.house_sharing ||
        state.formData.house_sharing.length === 0)
    ) {
      errors.house_sharing = "Please select who lives in the house";
    }

    // Validate campsite type for campsite accommodation
    if (
      state.formData.accommodation_type === "campsite" &&
      !state.formData.campsiteType
    ) {
      errors.campsiteType = "Campsite type is required";
    }

    // Validate RV type for RV accommodation
    if (state.formData.accommodation_type === "rv" && !state.formData.rvType) {
      errors.rvType = "RV type is required";
    }

    return errors;
  };

  const handleSave = async () => {
    try {
      // Validate form data
      const errors = validateForm();

      if (Object.keys(errors).length > 0) {
        // Set errors in context
        Object.entries(errors).forEach(([field, error]) => {
          setError(field, error);
        });
        toast.error("Please fix the errors before saving");
        return;
      }

      // Clear all errors
      Object.keys(errors).forEach((field) => clearError(field));

      // Prepare form data
      const formData = new FormData();

      // Basic location data (you might want to get these from state.selectedLocation)
      formData.append("location_name", state.selectedLocation.name || "lahore");
      formData.append(
        "latitude",
        state.selectedLocation.coords?.[0]?.toString() || "3.66"
      );
      formData.append(
        "longitude",
        state.selectedLocation.coords?.[1]?.toString() || "55.47"
      );

      // Accommodation details
      formData.append("accommodation_type", state.formData.accommodation_type);

      // House sharing (for room_in_house)
      if (
        state.formData.accommodation_type === "room_in_house" &&
        state.formData.house_sharing
      ) {
        state.formData.house_sharing.forEach((val) =>
          formData.append("house_sharing[]", val)
        );
      }

      // Campsite type
      if (state.formData.accommodation_type === "campsite") {
        formData.append("campsite_type", state.formData.campsiteType);
      }

      // RV type
      if (state.formData.accommodation_type === "rv") {
        formData.append("rv_type", state.formData.rvType);
      }

      // Site details
      formData.append("site_name", state.formData.siteName);
      formData.append("site_description", state.formData.shortDescription);
      formData.append("site_rules", state.formData.siteRules || "");
      formData.append("privacy_type", state.formData.sitePrivacy);

      // Show loading toast
      const loadingToast = toast.loading("Saving site overview...");

      const response = await fetch(
        `https://api.hightribe.com/api/properties/${propertyId}/sites/location-overview`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        }
      );

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.message) {
        toast.success(data.message);

        // Extract site ID and update URL
        const siteId = data.data?.id;
        if (siteId) {
          console.log(`Site ID: ${siteId}`);
          const updatedUrl = new URL(window.location.href);
          updatedUrl.searchParams.set("siteId", siteId);
          router.push(updatedUrl.toString(), { scroll: false });
        }

        // Save section data to context
        await saveSection("overview", {
          accommodation_type: state.formData.accommodation_type,
          house_sharing: state.formData.house_sharing,
          campsiteType: state.formData.campsiteType,
          rvType: state.formData.rvType,
          siteName: state.formData.siteName,
          shortDescription: state.formData.shortDescription,
          siteRules: state.formData.siteRules,
          sitePrivacy: state.formData.sitePrivacy,
        });
      } else {
        throw new Error("No response message received");
      }
    } catch (error) {
      console.error("Error saving site overview:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save site overview"
      );
    }
  };

  return (
    <div ref={sectionRef}>
      <div>
        <h2 className=" text-[#1C231F] text-[14px] font-bold mb-2">
          Site Overview
        </h2>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-md mt-4">
        <p className="font-bold text-[14px] text-[#1C231F]">
          What kind of accommodation does this site offer?*
        </p>
        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Accommodation Type */}
            <div>
              <GlobalSelect
                label={
                  <>
                    Accommodation <span className="text-red-500">*</span>
                  </>
                }
                value={state.formData.accommodation_type || ""}
                onChange={(e) =>
                  handleInputChange("accommodation_type", e.target.value)
                }
                error={state.errors?.accommodation_type}
              >
                <option value=""></option>
                {[
                  {
                    value: "stand_alone_cabin",
                    label: "Stand-alone Cabin/Studio",
                  },
                  { value: "apartment", label: "Apartment" },
                  { value: "entire_house", label: "Entire House" },
                  { value: "room_in_house", label: "A room in a house" },
                  { value: "glamp", label: "Glamp" },
                  { value: "campsite", label: "Campsite" },
                  { value: "co_living_hostel", label: "Co-living/Hostel" },
                  { value: "rv", label: "RV" },
                ].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </GlobalSelect>
            </div>

            {/* Campsite Type */}
            {state.formData.accommodation_type === "campsite" && (
              <div>
                <p className="font-bold text-[14px] text-[#1C231F] mb-4 mt-4">
                  What type of campsite is it?
                </p>
                <div className="space-y-2">
                  {[
                    {
                      value: "undefined",
                      label:
                        "Undefined Campsite (Guests can choose their own spot)",
                    },
                    {
                      value: "defined",
                      label:
                        "Defined Campsite (Guests will be given a specific spot)",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="campsiteType"
                        value={option.value}
                        checked={state.formData.campsiteType === option.value}
                        onChange={(e) =>
                          handleInputChange("campsiteType", e.target.value)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-[13px] text-[#1C231F] font-medium">
                        {option.label}
                      </span>
                    </label>
                  ))}
                  {state.errors?.campsiteType && (
                    <p className="text-red-500 text-xs mt-1">
                      {state.errors.campsiteType}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Who lives in the house */}
            {state.formData.accommodation_type === "room_in_house" && (
              <div>
                <p className="font-bold text-[14px] text-[#1C231F] mb-4 mt-4">
                  Does anyone else live in the house?
                  <span className="text-red-500">*</span>
                </p>
                <div className="flex flex-wrap gap-6">
                  {[
                    { label: "Me", value: "me" },
                    { label: "My family", value: "my_family" },
                    { label: "Other Guests", value: "other_guests" },
                    { label: "Roommates", value: "roommates" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={
                          state.formData.house_sharing?.includes(
                            option.value
                          ) || false
                        }
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [
                                ...(state.formData.house_sharing || []),
                                option.value,
                              ]
                            : (state.formData.house_sharing || []).filter(
                                (v) => v !== option.value
                              );
                          handleInputChange("house_sharing", updated);
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-[13px] text-[#1C231F] font-medium">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
                {state.errors?.house_sharing && (
                  <p className="text-red-500 text-xs mt-1">
                    {state.errors.house_sharing}
                  </p>
                )}
              </div>
            )}

            {/* Site Privacy */}
            <div>
              <p className="font-bold text-[14px] text-[#1C231F] mb-4 mt-4">
                Site Privacy<span className="text-red-500">*</span>
              </p>
              <div className="flex flex-wrap gap-6">
                {[
                  { label: "Shared", value: "shared" },
                  { label: "Private", value: "private" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="sitePrivacy"
                      value={option.value}
                      checked={state.formData.sitePrivacy === option.value}
                      onChange={() =>
                        handleInputChange("sitePrivacy", option.value)
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-[13px] text-[#1C231F] font-medium">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
              {state.errors?.sitePrivacy && (
                <p className="text-red-500 text-xs mt-1">
                  {state.errors.sitePrivacy}
                </p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="">
            {/* Site Name */}
            <div>
              <GlobalTextInput
                label={
                  <span>
                    Site Name <span className="text-red-500">*</span>
                  </span>
                }
                type="text"
                placeholder="Enter site name"
                value={state.formData.siteName}
                onChange={(e) => handleInputChange("siteName", e.target.value)}
                error={state.errors?.siteName}
              />
            </div>

            {/* Site Description */}
            <div>
              <GlobalTextArea
                label={
                  <span>
                    Site Description <span className="text-red-500">*</span>
                  </span>
                }
                placeholder="Describe your site..."
                value={state.formData.shortDescription}
                onChange={(e) =>
                  handleInputChange("shortDescription", e.target.value)
                }
                rows={4}
                error={state.errors?.shortDescription}
              />
            </div>

            {/* Select RV */}
            {state.formData.accommodation_type === "rv" && (
              <div>
                <GlobalSelect
                  label="Select RV"
                  value={state.formData.rvType || ""}
                  onChange={(e) => handleInputChange("rvType", e.target.value)}
                  error={state.errors?.rvType}
                >
                  <option value="">Select RV type</option>
                  {[
                    { value: "class-a", label: "Class A Motorhome" },
                    { value: "class-b", label: "Class B Motorhome" },
                    { value: "class-c", label: "Class C Motorhome" },
                    { value: "travel-trailer", label: "Travel Trailer" },
                    { value: "fifth-wheel", label: "Fifth Wheel" },
                    { value: "pop-up", label: "Pop-up Camper" },
                    { value: "truck-camper", label: "Truck Camper" },
                  ].map((rv) => (
                    <option key={rv.value} value={rv.value}>
                      {rv.label}
                    </option>
                  ))}
                </GlobalSelect>
              </div>
            )}

            {/* Site Rules */}
            {state.formData.accommodation_type !== "rv" && (
              <div>
                <GlobalTextArea
                  label="Site Rules"
                  value={state.formData.siteRules}
                  onChange={(e) =>
                    handleInputChange("siteRules", e.target.value)
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={Object.keys(state.errors || {}).length > 0}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteOverviewSection;
