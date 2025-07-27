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
  const { state, updateFormData, saveSection } = useSitesForm();
  const searchParams = useSearchParams();
  const router = useRouter();
  const propertyId = searchParams ? searchParams.get("propertyId") : null;
  console.log(propertyId);

  const handleInputChange = (field: string, value: string | string[]) => {
    updateFormData(field, value);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("location_name", "lahore");
    formData.append("latitude", "3.66");
    formData.append("longitude", "55.47");
    formData.append("accommodation_type", "room_in_house");
    (state.formData.house_sharing || []).forEach((val) =>
      formData.append("house_sharing[]", val)
    );
    formData.append("campsite_type", state.formData.campsiteType);
    formData.append("site_name", state.formData.siteName);
    formData.append("site_description", state.formData.shortDescription);
    formData.append("site_rules", state.formData.siteRules);
    formData.append("privacy_type", state.formData.sitePrivacy);

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
    debugger;
    const data = await response.json();

    if (data.message) {
      toast.success(data.message);
      const siteId = data.data.id; // Extract the site ID from the response
      // Use the siteId as needed, for example, sending it as a parameter
      console.log(`Site ID: ${siteId}`);
      const updatedUrl = new URL(window.location.href);
      updatedUrl.searchParams.set("siteId", siteId);
      router.push(updatedUrl.toString());


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
              >
                <option value=""></option>
                {[
                  {
                    value: "standalone-cabin",
                    label: "Stand-alone Cabin/Studio",
                  },
                  { value: "apartment", label: "Apartment" },
                  { value: "entire-house", label: "Entire House" },
                  { value: "glamp", label: "Glamp" },
                  { value: "coliving-hostel", label: "Co-living/Hostel" },
                ].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </GlobalSelect>
            </div>

            {/* Campsite Type */}
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
              </div>
            </div>

            {/* Who lives in the house */}
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
                        state.formData.house_sharing?.includes(option.value) ||
                        false
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
            </div>

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
              />
            </div>

            {/* Select RV */}
            <div>
              <GlobalSelect
                label="Select RV"
                value={state.formData.rvType || ""}
                onChange={(e) => handleInputChange("rvType", e.target.value)}
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

            {/* Site Rules */}
            <div>
              <GlobalTextInput
                label="Site Rules"
                value={state.formData.siteRules}
                onChange={(e) => handleInputChange("siteRules", e.target.value)}
              />
            </div>
          </div>
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

export default SiteOverviewSection;
