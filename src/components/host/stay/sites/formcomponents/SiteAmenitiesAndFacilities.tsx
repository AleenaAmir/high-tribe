"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiFormDataWrapper } from "@/lib/api";
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";

// Zod validation schema
const amenitiesSchema = z.object({
  amenities: z.array(z.string()).min(1, "Please select at least one amenity"),
  facilities: z.array(z.string()).min(1, "Please select at least one facility"),
  safety_items: z
    .array(z.string())
    .min(1, "Please select at least one safety item"),
  pet_policy: z.enum(["yes_on_leash", "no"], {
    required_error: "Please select a pet policy",
  }),
  amenitiesOther: z.string().optional(),
  facilitiesOther: z.string().optional(),
});

type AmenitiesFormData = z.infer<typeof amenitiesSchema>;

// Amenity options
const amenitiesOptions = [
  "Wi-Fi",
  "TV",
  "Kitchen",
  "Washer",
  "Free parking on premises",
  "Paid parking on premises",
  "Air Conditioning",
  "Dedicated Workplace",
];

const facilitiesOptions = [
  "Shared Pool",
  "Fire Pit or Barbecue",
  "Hot tub",
  "Patio",
  "BBQ grill",
  "Outdoor dining area",
  "Fire pit",
  "Pool table",
  "Indoor fireplace",
  "Piano",
  "Exercise equipment",
  "Lake access",
  "Beach access",
  "Ski-in/Ski-out",
  "Outdoor shower",
];

const safetyItemsOptions = [
  "Smoke Alarm",
  "First Aid Kit",
  "Fire extinguisher",
  "Carbon monoxide alarm",
];

// Multi-select component for amenities
interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  error?: string;
  required?: boolean;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selected,
  onChange,
  error,
  required = false,
  otherValue,
  onOtherChange,
}) => {
  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const isOtherSelected = selected.includes("Other");

  return (
    <div className="mb-6">
      <label className="text-[12px] md:text-[14px] text-[#1C231F] font-bold mb-3 block">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleToggle(option)}
            className={`px-3 py-2 rounded-full border cursor-pointer text-[12px] font-semibold transition-all ${
              selected.includes(option)
                ? "bg-[#237AFC] border-[#237AFC] text-white"
                : "bg-white text-[#131313]  border-black"
            }`}
          >
            {option}
          </button>
        ))}
        <button
          type="button"
          onClick={() => handleToggle("Other")}
          className={`px-3 py-2 rounded-full border cursor-pointer text-[12px] font-semibold transition-all ${
            isOtherSelected
              ? "bg-[#237AFC] border-[#237AFC] text-white"
              : "bg-white text-[#131313] border-black"
          }`}
        >
          + {otherValue || "Other"}
        </button>
      </div>
      {isOtherSelected && onOtherChange && (
        <div className="mt-3">
          <input
            type="text"
            placeholder="Enter other amenity..."
            value={otherValue || ""}
            onChange={(e) => onOtherChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-[#237AFC] focus:border-transparent"
          />
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default function SiteAmenitiesAndFacilities({
  propertyId,
  siteId,
  onSuccess,
}: {
  propertyId: string;
  siteId: string;
  onSuccess?: () => void;
}) {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<AmenitiesFormData>({
    resolver: zodResolver(amenitiesSchema),
    defaultValues: {
      amenities: [],
      facilities: [],
      safety_items: [],
      pet_policy: undefined,
      amenitiesOther: "",
      facilitiesOther: "",
    },
  });

  const watchedAmenities = watch("amenities");
  const watchedFacilities = watch("facilities");
  const watchedSafetyItems = watch("safety_items");
  const watchedPetPolicy = watch("pet_policy");
  const watchedAmenitiesOther = watch("amenitiesOther");
  const watchedFacilitiesOther = watch("facilitiesOther");

  const onSubmit = async (data: AmenitiesFormData) => {
    try {
      const formData = new FormData();

      // Add site_id
      if (siteId) {
        formData.append("site_id", siteId);
      }

      // Append amenities array - filter out "Other" and add the actual value
      const amenitiesToSend = data.amenities.filter((item) => item !== "Other");
      if (data.amenitiesOther) {
        amenitiesToSend.push(data.amenitiesOther);
      }
      amenitiesToSend.forEach((item) => {
        formData.append("amenities[]", item);
      });

      // Append facilities array - filter out "Other" and add the actual value
      const facilitiesToSend = data.facilities.filter(
        (item) => item !== "Other"
      );
      if (data.facilitiesOther) {
        facilitiesToSend.push(data.facilitiesOther);
      }
      facilitiesToSend.forEach((item) => {
        formData.append("facilities[]", item);
      });

      // Append safety items array
      data.safety_items.forEach((item) => {
        formData.append("safety_items[]", item);
      });

      // Append pet policy
      formData.append("pet_policy", data.pet_policy);

      const response = await apiFormDataWrapper<{
        success: boolean;
        message: string;
      }>(
        `properties/${propertyId}/sites/amenities`,
        formData,
        "Site amenities saved successfully!"
      );

      console.log("Form submitted successfully:", response);

      // Mark section as completed
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Error handling is already done by apiFormDataWrapper
    }
  };

  const handleSaveClick = async () => {
    // Trigger form validation and submission
    const isValid = await handleSubmit(onSubmit)();
    return isValid;
  };

  return (
    <div>
      <h4 className="text-[14px] md:text-[16px] text-[#1C231F] font-semibold">
        Site Amenities and Facilities
      </h4>
      <div className="mt-4">
        <div className="border border-[#E1E1E1] bg-white p-2 md:p-4 rounded-[7px]">
          {/* Amenities Section */}
          <MultiSelect
            label="Tell us about guest favourites?"
            options={amenitiesOptions}
            selected={watchedAmenities}
            onChange={(selected) => setValue("amenities", selected)}
            error={errors.amenities?.message}
            required={true}
            otherValue={watchedAmenitiesOther}
            onOtherChange={(value) => setValue("amenitiesOther", value)}
          />

          {/* Facilities Section */}
          <MultiSelect
            label="Do you have any standout amenities for your guests?"
            options={facilitiesOptions}
            selected={watchedFacilities || []}
            onChange={(selected) => setValue("facilities", selected)}
            error={errors.facilities?.message}
            required={true}
            otherValue={watchedFacilitiesOther}
            onOtherChange={(value) => setValue("facilitiesOther", value)}
          />

          {/* Safety Items Section */}
          <MultiSelect
            label="Do you have any of these safety items?"
            options={safetyItemsOptions}
            selected={watchedSafetyItems || []}
            onChange={(selected) => setValue("safety_items", selected)}
            error={errors.safety_items?.message}
            required={true}
          />

          {/* Pet Policy Section */}
          <div className="mb-6">
            <label className="text-[12px] md:text-[14px] text-[#1C231F] font-bold mb-3 block">
              Do you allow pet?
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "yes_on_leash", label: "Yes, on leash" },
                { value: "no", label: "No" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setValue(
                      "pet_policy",
                      option.value as "yes_on_leash" | "no"
                    )
                  }
                  className={`px-3 py-2 rounded-full border cursor-pointer text-[12px] font-semibold transition-all ${
                    watchedPetPolicy === option.value
                      ? "bg-[#237AFC] border-[#237AFC] text-white"
                      : "bg-white text-[#131313] border-black"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {errors.pet_policy?.message && (
              <p className="text-red-500 text-xs mt-1">
                {errors.pet_policy.message}
              </p>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={handleSaveClick}
              disabled={isSubmitting}
              className="bg-[#237AFC] text-white px-4 md:px-10 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
