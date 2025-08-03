"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiFormDataWrapper } from "@/lib/api";
import { toast } from "react-hot-toast";

// Zod validation schema
const amenitiesSchema = z.object({
  guestFavorites: z
    .array(z.string())
    .min(1, "Please select at least one guest favorite"),
  standoutAmenities: z
    .array(z.string())
    .min(1, "Please select at least one standout amenity"),
  safetyItems: z.array(z.string()).optional(),
  petPolicy: z.enum(["yes", "no"]).optional(),
  guestFavoritesOther: z.string().optional(),
  standoutAmenitiesOther: z.string().optional(),
});

type AmenitiesFormData = z.infer<typeof amenitiesSchema>;

// Amenity options
const guestFavoritesOptions = [
  "Wi-Fi",
  "TV",
  "Kitchen",
  "Washer",
  "Free parking on premises",
  "Paid parking on premises",
  "Air Conditioning",
  "Dedicated Workplace",
];

const standoutAmenitiesOptions = [
  "Pool",
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
  "Smoke alarm",
  "First aid kit",
  "Fire extinguisher",
  "Carbon monoxide alarm",
];

const petPolicyOptions = ["Yes", "No"];

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
          + Other
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

// Radio group component for pet policy
interface RadioGroupProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  selected,
  onChange,
  error,
  required = false,
}) => {
  return (
    <div className="mb-6">
      <label className="text-[12px] md:text-[14px] text-[#1C231F] font-bold mb-3 block">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-4">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={selected === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-[12px] text-[#1C231F] font-medium">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default function SiteAmenitiesAndFacilities() {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<AmenitiesFormData>({
    resolver: zodResolver(amenitiesSchema),
    defaultValues: {
      guestFavorites: [],
      standoutAmenities: [],
      safetyItems: [],
      petPolicy: undefined,
      guestFavoritesOther: "",
      standoutAmenitiesOther: "",
    },
  });

  const watchedGuestFavorites = watch("guestFavorites");
  const watchedStandoutAmenities = watch("standoutAmenities");
  const watchedSafetyItems = watch("safetyItems");
  const watchedPetPolicy = watch("petPolicy");
  const watchedGuestFavoritesOther = watch("guestFavoritesOther");
  const watchedStandoutAmenitiesOther = watch("standoutAmenitiesOther");

  const onSubmit = async (data: AmenitiesFormData) => {
    try {
      const formData = new FormData();

      // Append arrays as multiple entries
      data.guestFavorites.forEach((item) => {
        formData.append("guestFavorites[]", item);
      });

      if (data.standoutAmenities) {
        data.standoutAmenities.forEach((item) => {
          formData.append("standoutAmenities[]", item);
        });
      }

      if (data.safetyItems) {
        data.safetyItems.forEach((item) => {
          formData.append("safetyItems[]", item);
        });
      }

      if (data.petPolicy) {
        formData.append("petPolicy", data.petPolicy);
      }

      if (data.guestFavoritesOther) {
        formData.append("guestFavoritesOther", data.guestFavoritesOther);
      }

      if (data.standoutAmenitiesOther) {
        formData.append("standoutAmenitiesOther", data.standoutAmenitiesOther);
      }

      // You can replace this endpoint with your actual API endpoint
      const response = await apiFormDataWrapper<{
        success: boolean;
        message: string;
      }>(
        "/api/sites/amenities",
        formData,
        "Site amenities saved successfully!"
      );

      console.log("Form submitted successfully:", response);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Error handling is already done by apiFormDataWrapper
    }
  };

  return (
    <div>
      <h4 className="text-[14px] md:text-[16px] text-[#1C231F] font-semibold">
        Site Amenities and Facilities
      </h4>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="border border-[#E1E1E1] bg-white p-2 md:p-4 rounded-[7px]">
          {/* Guest Favorites Section */}
          <MultiSelect
            label="Tell us about guest favourites?"
            options={guestFavoritesOptions}
            selected={watchedGuestFavorites}
            onChange={(selected) => setValue("guestFavorites", selected)}
            error={errors.guestFavorites?.message}
            required={true}
            otherValue={watchedGuestFavoritesOther}
            onOtherChange={(value) => setValue("guestFavoritesOther", value)}
          />

          {/* Standout Amenities Section */}
          <MultiSelect
            label="Do you have any standout amenities for your guests?"
            options={standoutAmenitiesOptions}
            selected={watchedStandoutAmenities || []}
            onChange={(selected) => setValue("standoutAmenities", selected)}
            error={errors.standoutAmenities?.message}
            required={true}
            otherValue={watchedStandoutAmenitiesOther}
            onOtherChange={(value) => setValue("standoutAmenitiesOther", value)}
          />

          {/* Safety Items Section */}
          <MultiSelect
            label="Do you have any of these safety items?"
            options={safetyItemsOptions}
            selected={watchedSafetyItems || []}
            onChange={(selected) => setValue("safetyItems", selected)}
            error={errors.safetyItems?.message}
          />

          {/* Pet Policy Section */}
          <div className="mb-6">
            <label className="text-[12px] md:text-[14px] text-[#1C231F] font-bold mb-3 block">
              Do you allow pet?
            </label>
            <div className="flex flex-wrap gap-2">
              {["Yes", "No"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    setValue("petPolicy", option.toLowerCase() as "yes" | "no")
                  }
                  className={`px-3 py-2 rounded-full border cursor-pointer text-[12px] font-semibold transition-all ${
                    watchedPetPolicy === option.toLowerCase()
                      ? "bg-[#237AFC] border-[#237AFC] text-white"
                      : "bg-white text-[#131313] border-black"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {errors.petPolicy?.message && (
              <p className="text-red-500 text-xs mt-1">
                {errors.petPolicy.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#237AFC] text-white px-4 md:px-10 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
