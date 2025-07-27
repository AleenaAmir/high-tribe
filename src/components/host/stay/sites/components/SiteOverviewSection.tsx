"use client";
import React from "react";
import GlobalTextInput from "../../../../global/GlobalTextInput";
import GlobalSelect from "../../../../global/GlobalSelect";
import GlobalTextArea from "../../../../global/GlobalTextArea";
import { useSitesForm } from "../hooks/useSitesForm";
import FormError from "./FormError";
import { toast } from "react-hot-toast";

interface SiteOverviewSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  formMethods: ReturnType<typeof useSitesForm>;
}

const SiteOverviewSection: React.FC<SiteOverviewSectionProps> = ({
  sectionRef,
  formMethods,
}) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
    saveSection,
    isSaving,
  } = formMethods;

  // Watch form values
  const accommodationType = watch("accommodation_type");
  const campsiteType = watch("campsiteType");
  const houseSharing = watch("house_sharing") || [];
  const sitePrivacy = watch("sitePrivacy");
  const siteName = watch("siteName");
  const shortDescription = watch("shortDescription");
  const rvType = watch("rvType");
  const siteRules = watch("siteRules");
  const siteLocation = watch("siteLocation");
  const entranceLocation = watch("entranceLocation");
  const selectedLocation = watch("selectedLocation");
  const siteType = watch("siteType");

  const handleInputChange = (field: string, value: string | string[]) => {
    setValue(field as any, value);
  };

  const handleSaveSection = async () => {
    await saveSection("overview");
  };

  return (
    <section ref={sectionRef} className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Site Overview</h2>
        <button
          type="button"
          onClick={handleSaveSection}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save Section"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Site Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name *
            </label>
            <input
              {...register("siteName")}
              placeholder="Enter your site name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FormError error={errors.siteName?.message} />
          </div>

          {/* Site Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Area *
            </label>
            <input
              {...register("siteArea")}
              placeholder="Enter site area (e.g., 500 sq ft)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FormError error={errors.siteArea?.message} />
          </div>

          {/* Site Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Type *
            </label>
            <select
              {...register("siteType")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select site type</option>
              <option value="campsite">Campsite</option>
              <option value="rv-park">RV Park</option>
              <option value="glamping">Glamping</option>
              <option value="cabin">Cabin</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="other">Other</option>
            </select>
            <FormError error={errors.siteType?.message} />
          </div>

          {/* Languages Spoken */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Languages Spoken *
            </label>
            <input
              {...register("languagesSpoken")}
              placeholder="e.g., English, Spanish, French"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FormError error={errors.languagesSpoken?.message} />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website (Optional)
            </label>
            <input
              {...register("website")}
              type="url"
              placeholder="https://yourwebsite.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FormError error={errors.website?.message} />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <textarea
              {...register("shortDescription")}
              rows={4}
              placeholder="Describe your site in a few sentences..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <FormError error={errors.shortDescription?.message} />
            <p className="text-xs text-gray-500 mt-1">Maximum 500 characters</p>
          </div>

          {/* Site Rules */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Rules
            </label>
            <textarea
              {...register("siteRules")}
              rows={3}
              placeholder="List any important rules for your site..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <FormError error={errors.siteRules?.message} />
          </div>

          {/* Accommodation Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accommodation Type
            </label>
            <select
              {...register("accommodation_type")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select accommodation type</option>
              <option value="entire-place">Entire Place</option>
              <option value="private-room">Private Room</option>
              <option value="shared-space">Shared Space</option>
            </select>
            <FormError error={errors.accommodation_type?.message} />
          </div>

          {/* Site Privacy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Privacy
            </label>
            <select
              {...register("sitePrivacy")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select privacy level</option>
              <option value="private">Private</option>
              <option value="semi-private">Semi-Private</option>
              <option value="shared">Shared</option>
            </select>
            <FormError error={errors.sitePrivacy?.message} />
          </div>
        </div>
      </div>

      {/* Conditional Fields */}
      {accommodationType === "shared-space" && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            House Sharing Details
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Kitchen",
              "Bathroom",
              "Living Room",
              "Dining Room",
              "Garden",
              "Parking",
            ].map((item) => (
              <label key={item} className="flex items-center">
                <input
                  type="checkbox"
                  value={item}
                  checked={houseSharing.includes(item)}
                  onChange={(e) => {
                    const newSharing = e.target.checked
                      ? [...houseSharing, item]
                      : houseSharing.filter((s) => s !== item);
                    setValue("house_sharing", newSharing);
                  }}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                {item}
              </label>
            ))}
          </div>
          <FormError error={errors.house_sharing?.message} />
        </div>
      )}

      {siteType === "rv-park" && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            RV Type Accommodation
          </label>
          <select
            {...register("rvType")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select RV type</option>
            <option value="class-a">Class A</option>
            <option value="class-b">Class B</option>
            <option value="class-c">Class C</option>
            <option value="travel-trailer">Travel Trailer</option>
            <option value="fifth-wheel">Fifth Wheel</option>
            <option value="toy-hauler">Toy Hauler</option>
            <option value="any">Any RV Type</option>
          </select>
          <FormError error={errors.rvType?.message} />
        </div>
      )}

      {siteType === "campsite" && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campsite Type
          </label>
          <select
            {...register("campsiteType")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select campsite type</option>
            <option value="tent-only">Tent Only</option>
            <option value="rv-tent">RV & Tent</option>
            <option value="primitive">Primitive</option>
            <option value="developed">Developed</option>
            <option value="backcountry">Backcountry</option>
          </select>
          <FormError error={errors.campsiteType?.message} />
        </div>
      )}
    </section>
  );
};

export default SiteOverviewSection;
