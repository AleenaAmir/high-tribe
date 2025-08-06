"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiFormDataWrapper } from "@/lib/api";

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
  customValues?: string[];
  onCustomAdd?: (value: string) => void;
  onCustomRemove?: (value: string) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selected,
  onChange,
  error,
  required = false,
  customValues = [],
  onCustomAdd,
  onCustomRemove,
}) => {
  const [otherInput, setOtherInput] = useState("");

  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleOtherKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && otherInput.trim()) {
      e.preventDefault();
      const value = otherInput.trim();
      if (onCustomAdd && !customValues.includes(value)) {
        onCustomAdd(value);
        setOtherInput("");
        // Ensure "Other" remains selected after adding a custom value
        if (!selected.includes("Other")) {
          onChange([...selected, "Other"]);
        }
      }
    }
  };

  const isOtherSelected = selected.includes("Other");

  return (
    <div className="mb-6">
      <label className="text-[12px] md:text-[14px] text-[#1C231F] font-bold mb-3 block">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      {/* Pills and Options */}
      <div className="flex flex-wrap gap-3">
        {/* 🟢 Custom Values (pills) - shown first */}
        {customValues.map((item) => (
          <div
            key={item}
            className="bg-[#237AFC] text-white text-[13px] font-semibold px-3 py-1 rounded-full flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              onCustomRemove?.(item);
              // If this was the last custom value, unselect "Other"
              if (customValues.length === 1 && selected.includes("Other")) {
                onChange(selected.filter((item) => item !== "Other"));
              }
            }}
          >
            {item}
          </div>
        ))}

        {/* 🟡 Standard Options */}
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleToggle(option)}
            className={`px-5 py-2 rounded-full border cursor-pointer text-[13px] font-semibold transition-all ${
              selected.includes(option)
                ? "bg-[#237AFC] border-[#237AFC] text-white"
                : "bg-white text-[#131313] border-black"
            }`}
          >
            {option}
          </button>
        ))}

        {/* 🔵 "+ Other" Button */}
        <button
          type="button"
          onClick={() => handleToggle("Other")}
          className={`px-5 py-2 rounded-full border cursor-pointer text-[13px] font-semibold transition-all ${
            isOtherSelected
              ? "bg-[#237AFC] border-[#237AFC] text-white"
              : "bg-white text-[#131313] border-black"
          }`}
        >
          + {otherInput || "Other"}
        </button>
      </div>

      {/* 🔧 Input Box for Adding Custom Pills */}
      {isOtherSelected && (
        <div className="mt-3 w-full">
          <input
            type="text"
            placeholder="Enter other item and press Enter"
            value={otherInput}
            onChange={(e) => setOtherInput(e.target.value)}
            onKeyDown={handleOtherKeyDown}
            className="w-2xl px-2 py-2 border border-gray-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#237AFC] focus:border-transparent"
          />
        </div>
      )}

      {/* 🔴 Validation Error */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default function SiteAmenitiesAndFacilities({
  propertyId,
  siteId,
  onSuccess,
  siteData,
  isEditMode,
}: {
  propertyId: string;
  siteId: string;
  onSuccess?: () => void;
  siteData?: any;
  isEditMode?: boolean;
}) {
  const [customAmenities, setCustomAmenities] = useState<string[]>([]);
  const [customFacilities, setCustomFacilities] = useState<string[]>([]);
  const [customSafetyItems, setCustomSafetyItems] = useState<string[]>([]);
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
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

  // Populate form data when siteData is available in edit mode
  useEffect(() => {
    if (isEditMode && siteData?.amenities) {
      reset({
        amenities: siteData.amenities.amenities || [],
        facilities: siteData.amenities.facilities || [],
        safety_items: siteData.amenities.safety_items || [],
        pet_policy: siteData.amenities.pet_policy,
        amenitiesOther: "",
        facilitiesOther: "",
      });
    }
  }, [siteData, isEditMode, reset]);

  const watchedAmenities = watch("amenities");
  const watchedFacilities = watch("facilities");
  const watchedSafetyItems = watch("safety_items");
  const watchedPetPolicy = watch("pet_policy");

  const onSubmit = async (data: AmenitiesFormData) => {
    try {
      const formData = new FormData();

      if (siteId) {
        formData.append("site_id", siteId);
      }

      // Add site_id for edit mode
      if (isEditMode && siteData?.id) {
        formData.append("site_id", siteData.id.toString());
      }

      // ✅ Include custom amenities
      const amenitiesToSend = [
        ...data.amenities.filter((item) => item !== "Other"),
        ...customAmenities,
      ];
      amenitiesToSend.forEach((item) => {
        formData.append("amenities[]", item);
      });

      // ✅ Include custom facilities
      const facilitiesToSend = [
        ...data.facilities.filter((item) => item !== "Other"),
        ...customFacilities,
      ];
      facilitiesToSend.forEach((item) => {
        formData.append("facilities[]", item);
      });

      // ✅ Include custom safety items
      const safetyItemsToSend = [
        ...data.safety_items.filter((item) => item !== "Other"),
        ...customSafetyItems,
      ];
      safetyItemsToSend.forEach((item) => {
        formData.append("safety_items[]", item);
      });

      // Pet policy
      formData.append("pet_policy", data.pet_policy);

      const response = await apiFormDataWrapper<{
        success: boolean;
        message: string;
      }>(
        `properties/${propertyId}/sites/amenities`,
        formData,
        isEditMode
          ? "Site amenities updated successfully!"
          : "Site amenities saved successfully!"
      );

      console.log("Form submitted successfully:", response);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
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
            customValues={customAmenities}
            onCustomAdd={(val) => setCustomAmenities([...customAmenities, val])}
            onCustomRemove={(val) =>
              setCustomAmenities(customAmenities.filter((v) => v !== val))
            }
          />

          {/* Facilities Section */}
          <MultiSelect
            label="Do you have any standout amenities for your guests?"
            options={facilitiesOptions}
            selected={watchedFacilities || []}
            onChange={(selected) => setValue("facilities", selected)}
            error={errors.facilities?.message}
            required={true}
            customValues={customFacilities}
            onCustomAdd={(val) =>
              setCustomFacilities([...customFacilities, val])
            }
            onCustomRemove={(val) =>
              setCustomFacilities(customFacilities.filter((v) => v !== val))
            }
          />

          {/* Safety Items Section */}
          <MultiSelect
            label="Do you have any of these safety items?"
            options={safetyItemsOptions}
            selected={watchedSafetyItems || []}
            onChange={(selected) => setValue("safety_items", selected)}
            error={errors.safety_items?.message}
            required={true}
            customValues={customSafetyItems}
            onCustomAdd={(val) =>
              setCustomSafetyItems([...customSafetyItems, val])
            }
            onCustomRemove={(val) =>
              setCustomSafetyItems(customSafetyItems.filter((v) => v !== val))
            }
          />

          {/* Pet Policy Section */}
          <div className="mb-6">
            <label className="text-[12px] md:text-[14px] text-[#1C231F] font-bold mb-3 block">
              Do you allow pet?
            </label>
            <div className="flex flex-wrap gap-3">
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
                  className={`px-8 py-2 rounded-full border cursor-pointer text-[13px] font-semibold transition-all ${
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
              className="bg-[#237AFC] w-[158px] mt-2 h-[35px] font-[500] text-[14px] text-white px-4 md:px-10 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
