"use client";
import React from "react";
import GlobalTextInput from "../../../../global/GlobalTextInput";
import GlobalSelect from "../../../../global/GlobalSelect";
import GlobalTextArea from "../../../../global/GlobalTextArea";
import { useSitesForm } from "../contexts/SitesFormContext";

interface SiteOverviewSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

const SiteOverviewSection: React.FC<SiteOverviewSectionProps> = ({
  sectionRef,
}) => {
  const { state, updateFormData, saveSection } = useSitesForm();

  const handleInputChange = (field: string, value: string | string[]) => {
    updateFormData(field, value);
  };

  const handleSave = async () => {
    const overviewData = {
      siteType: state.formData.siteType,
      campsiteType: state.formData.campsiteType,
      houseOccupants: state.formData.houseOccupants,
      sitePrivacy: state.formData.sitePrivacy,
      siteName: state.formData.siteName,
      shortDescription: state.formData.shortDescription,
      rvType: state.formData.rvType,
      siteRules: state.formData.siteRules,
    };

    await saveSection("overview", overviewData);
  };

  return (
    <div ref={sectionRef}>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Site Overview</h2>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-sm mt-4">
        <p className="font-bold">
          What kind of accommodation does this site offer?*
        </p>
        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Accommodation Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accommodation*
              </label>
              <GlobalSelect
                value={state.formData.siteType}
                onChange={(e) => handleInputChange("siteType", e.target.value)}
              >
                <option value="">Select accommodation type</option>
                <option value="standalone-cabin">
                  Stand-alone Cabin/Studio
                </option>
                <option value="apartment">Apartment</option>
                <option value="entire-house">Entire House</option>
                <option value="glamp">Glamp</option>
                <option value="coliving-hostel">Co-living/Hostel</option>
              </GlobalSelect>
            </div>

            {/* Campsite Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What type of campsite is it?
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="campsiteType"
                    value="undefined"
                    checked={state.formData.campsiteType === "undefined"}
                    onChange={(e) =>
                      handleInputChange("campsiteType", e.target.value)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Undefined Campsite (Guests can choose their own spot)
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="campsiteType"
                    value="defined"
                    checked={state.formData.campsiteType === "defined"}
                    onChange={(e) =>
                      handleInputChange("campsiteType", e.target.value)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Defined Campsite (Guests will be given a specific spot)
                  </span>
                </label>
              </div>
            </div>

            {/* Who lives in the house */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Who will be staying at the house?*
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.formData.houseOccupants.includes("me")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const updatedOccupants = [
                          ...state.formData.houseOccupants,
                          "me",
                        ];
                        handleInputChange("houseOccupants", updatedOccupants);
                      } else {
                        const updatedOccupants =
                          state.formData.houseOccupants.filter(
                            (o) => o !== "me"
                          );
                        handleInputChange("houseOccupants", updatedOccupants);
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Me</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.formData.houseOccupants.includes("family")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const updatedOccupants = [
                          ...state.formData.houseOccupants,
                          "family",
                        ];
                        handleInputChange("houseOccupants", updatedOccupants);
                      } else {
                        const updatedOccupants =
                          state.formData.houseOccupants.filter(
                            (o) => o !== "family"
                          );
                        handleInputChange("houseOccupants", updatedOccupants);
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">My family</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.formData.houseOccupants.includes("guests")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const updatedOccupants = [
                          ...state.formData.houseOccupants,
                          "guests",
                        ];
                        handleInputChange("houseOccupants", updatedOccupants);
                      } else {
                        const updatedOccupants =
                          state.formData.houseOccupants.filter(
                            (o) => o !== "guests"
                          );
                        handleInputChange("houseOccupants", updatedOccupants);
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Other Guests</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.formData.houseOccupants.includes(
                      "roommates"
                    )}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const updatedOccupants = [
                          ...state.formData.houseOccupants,
                          "roommates",
                        ];
                        handleInputChange("houseOccupants", updatedOccupants);
                      } else {
                        const updatedOccupants =
                          state.formData.houseOccupants.filter(
                            (o) => o !== "roommates"
                          );
                        handleInputChange("houseOccupants", updatedOccupants);
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Roommates</span>
                </label>
              </div>
            </div>

            {/* Site Privacy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Site Privacy
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="sitePrivacy"
                    value="private"
                    checked={state.formData.sitePrivacy === "private"}
                    onChange={(e) =>
                      handleInputChange("sitePrivacy", e.target.value)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Private</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="sitePrivacy"
                    value="shared"
                    checked={state.formData.sitePrivacy === "shared"}
                    onChange={(e) =>
                      handleInputChange("sitePrivacy", e.target.value)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Shared</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Site Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name*
              </label>
              <GlobalTextInput
                type="text"
                placeholder="Enter site name"
                value={state.formData.siteName}
                onChange={(e) => handleInputChange("siteName", e.target.value)}
              />
            </div>

            {/* Site Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Description*
              </label>
              <GlobalTextArea
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select RV
              </label>
              <GlobalSelect
                value={state.formData.rvType || ""}
                onChange={(e) => handleInputChange("rvType", e.target.value)}
              >
                <option value="">Select RV type</option>
                <option value="class-a">Class A Motorhome</option>
                <option value="class-b">Class B Motorhome</option>
                <option value="class-c">Class C Motorhome</option>
                <option value="travel-trailer">Travel Trailer</option>
                <option value="fifth-wheel">Fifth Wheel</option>
                <option value="pop-up">Pop-up Camper</option>
                <option value="truck-camper">Truck Camper</option>
              </GlobalSelect>
            </div>

            {/* Site Rules */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Rules
              </label>
              <GlobalTextArea
                placeholder="Enter site rules and guidelines..."
                value={state.formData.siteRules}
                onChange={(e) => handleInputChange("siteRules", e.target.value)}
                rows={4}
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
