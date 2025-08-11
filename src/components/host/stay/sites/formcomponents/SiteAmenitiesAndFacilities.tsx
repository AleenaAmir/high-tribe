"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiFormDataWrapper } from "@/lib/api";
import GlobalSelect from "@/components/global/GlobalSelect";

// Zod validation schema
const amenitiesSchema = z.object({
  amenities: z.array(z.string()).min(1, "Please select at least one amenity"),
  facilities: z.array(z.string()).min(1, "Please select at least one facility"),
  safety_items: z
    .array(z.string())
    .min(1, "Please select at least one safety item"),
  // Allow all pet policy enums per backend: yes_on_leash, yes_without_leash, yes, no
  pet_policy: z.enum(["yes_on_leash", "yes_without_leash", "yes", "no"], {
    required_error: "Please select a pet policy",
  }),
  amenitiesOther: z.string().optional(),
  facilitiesOther: z.string().optional(),
  bathroom_options: z.array(z.string()).optional(),
  accept_booking_with_children: z
    .enum(["yes", "no"], {
      required_error: "Please select a children policy",
    })
    .optional(),
  // RV hookup fields (optional)
  sewage_hookup: z.enum(["yes", "no"]).optional(),
  television_hookup: z.enum(["yes", "no"]).optional(),
  generators_allowed: z.enum(["yes", "no"]).optional(),
  electricity_hookup: z.enum(["yes", "no"]).optional(),
  water_hookup: z.enum(["yes", "no"]).optional(),
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

const bathroom_options = [
  "Shared Non-ensuite Bathroom",
  "Private Non-ensuite Bathroom",
  "Private Ensuite Bathroom",
  "Shared Ensuite Bathroom",
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
  isOther?: boolean;
  // Optional formatter to render pretty labels while keeping enum values intact
  formatLabel?: (value: string) => string;
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
  isOther = false,
  formatLabel,
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
            {formatLabel ? formatLabel(item) : item}
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
            {formatLabel ? formatLabel(option) : option}
          </button>
        ))}

        {/* 🔵 "+ Other" Button */}
        {isOther && (
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
        )}
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
  accommodationType,
  enums,
}: {
  propertyId: string;
  siteId: string;
  onSuccess?: () => void;
  siteData?: any;
  isEditMode?: boolean;
  accommodationType?: string | null;
  enums?: any;
}) {
  const [customAmenities, setCustomAmenities] = useState<string[]>([]);
  const [customFacilities, setCustomFacilities] = useState<string[]>([]);
  const [customSafetyItems, setCustomSafetyItems] = useState<string[]>([]);
  const [custombathroom_options, setCustombathroom_options] = useState<
    string[]
  >([]);
  const [dataSent, setDataSent] = useState(false);
  // Sleeping options selected per category when accommodation_type is king_stay
  const [selectedSleepingByCategory, setSelectedSleepingByCategory] = useState<
    Record<string, string[]>
  >({});
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
    register,
  } = useForm<AmenitiesFormData>({
    resolver: zodResolver(amenitiesSchema),
    defaultValues: {
      amenities: [],
      facilities: [],
      safety_items: [],
      pet_policy: undefined,
      amenitiesOther: "",
      facilitiesOther: "",
      bathroom_options: [],
      accept_booking_with_children: undefined,
      sewage_hookup: undefined,
      television_hookup: undefined,
      generators_allowed: undefined,
      electricity_hookup: undefined,
      water_hookup: undefined,
    },
  });

  // Populate form data when siteData is available in edit mode
  useEffect(() => {
    if (isEditMode && siteData?.amenities) {
      console.log("Edit mode - siteData received:", siteData);
      console.log("Amenities data:", siteData.amenities);
      // Separate standard options from custom values
      const standardAmenities =
        siteData.amenities.amenities?.filter((item: string) =>
          amenitiesOptions.includes(item)
        ) || [];
      const customAmenitiesData =
        siteData.amenities.amenities?.filter(
          (item: string) => !amenitiesOptions.includes(item)
        ) || [];

      const standardFacilities =
        siteData.amenities.facilities?.filter((item: string) =>
          facilitiesOptions.includes(item)
        ) || [];
      const customFacilitiesData =
        siteData.amenities.facilities?.filter(
          (item: string) => !facilitiesOptions.includes(item)
        ) || [];

      const standardSafetyItems =
        siteData.amenities.safety_items?.filter((item: string) =>
          safetyItemsOptions.includes(item)
        ) || [];
      const customSafetyItemsData =
        siteData.amenities.safety_items?.filter(
          (item: string) => !safetyItemsOptions.includes(item)
        ) || [];

      const standardBathroomOptions =
        siteData.amenities.bathroom_options?.filter((item: string) =>
          bathroom_options.includes(item)
        ) || [];
      const customBathroomOptionsData =
        siteData.amenities.bathroom_options?.filter(
          (item: string) => !bathroom_options.includes(item)
        ) || [];

      // Set custom values
      setCustomAmenities(customAmenitiesData);
      setCustomFacilities(customFacilitiesData);
      setCustomSafetyItems(customSafetyItemsData);
      setCustombathroom_options(customBathroomOptionsData);

      // Add "Other" option if there are custom values
      const amenitiesWithOther =
        customAmenitiesData.length > 0
          ? [...standardAmenities, "Other"]
          : standardAmenities;
      const facilitiesWithOther =
        customFacilitiesData.length > 0
          ? [...standardFacilities, "Other"]
          : standardFacilities;
      const safetyItemsWithOther =
        customSafetyItemsData.length > 0
          ? [...standardSafetyItems, "Other"]
          : standardSafetyItems;

      reset({
        amenities: amenitiesWithOther,
        facilities: facilitiesWithOther,
        safety_items: safetyItemsWithOther,
        pet_policy: siteData.amenities.pet_policy,
        amenitiesOther: "",
        facilitiesOther: "",
        bathroom_options: siteData.amenities.bathroom_options || [],
        accept_booking_with_children:
          siteData.amenities.accept_booking_with_children === "1"
            ? "yes"
            : siteData.amenities.accept_booking_with_children === "0"
            ? "no"
            : siteData.amenities.accept_booking_with_children,
        sewage_hookup:
          siteData.amenities.sewage_hookup === "1"
            ? "yes"
            : siteData.amenities.sewage_hookup === "0"
            ? "no"
            : siteData.amenities.sewage_hookup,
        television_hookup:
          siteData.amenities.television_hookup === "1"
            ? "yes"
            : siteData.amenities.television_hookup === "0"
            ? "no"
            : siteData.amenities.television_hookup,
        generators_allowed:
          siteData.amenities.generators_allowed === "1"
            ? "yes"
            : siteData.amenities.generators_allowed === "0"
            ? "no"
            : siteData.amenities.generators_allowed,
        electricity_hookup:
          siteData.amenities.electricity_hookup === "1"
            ? "yes"
            : siteData.amenities.electricity_hookup === "0"
            ? "no"
            : siteData.amenities.electricity_hookup,
        water_hookup:
          siteData.amenities.water_hookup === "1"
            ? "yes"
            : siteData.amenities.water_hookup === "0"
            ? "no"
            : siteData.amenities.water_hookup,
      });

      // Populate sleeping options for king_stay
      if (
        accommodationType === "king_stay" &&
        siteData.amenities.sleeping_options
      ) {
        const sleepingByCategory: Record<string, string[]> = {};
        siteData.amenities.sleeping_options.forEach((option: any) => {
          if (option.category && option.option_key) {
            if (!sleepingByCategory[option.category]) {
              sleepingByCategory[option.category] = [];
            }
            sleepingByCategory[option.category].push(option.option_key);
          }
        });
        setSelectedSleepingByCategory(sleepingByCategory);
      }
    }
  }, [siteData, isEditMode, reset, accommodationType]);

  const watchedAmenities = watch("amenities");
  const watchedFacilities = watch("facilities");
  const watchedSafetyItems = watch("safety_items");
  const watchedPetPolicy = watch("pet_policy");
  const watchedbathroom_options = watch("bathroom_options");
  const watchedChildrenPolicy = watch("accept_booking_with_children");
  const watchedSewage = watch("sewage_hookup");
  const watchedTelevision = watch("television_hookup");
  const watchedGeneratorsAllowed = watch("generators_allowed");
  const watchedElectricity = watch("electricity_hookup");
  const watchedWater = watch("water_hookup");
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

      // ✅ Include custom bathroom options
      if (data.bathroom_options) {
        data.bathroom_options.forEach((item) => {
          formData.append("bathroom_options[]", item);
        });
      }

      // Pet policy
      formData.append("pet_policy", data.pet_policy);

      // Children policy
      if (data.accept_booking_with_children) {
        formData.append(
          "accept_booking_with_children",
          data.accept_booking_with_children === "yes" ? "1" : "0"
        );
      }

      // RV hookup fields -> convert yes/no to 1/0 as per API
      const yesNoTo01 = (v?: string) =>
        v === "yes" ? "1" : v === "no" ? "0" : undefined;
      const hookupFields: Array<keyof AmenitiesFormData> = [
        "sewage_hookup",
        "television_hookup",
        "generators_allowed",
        "electricity_hookup",
        "water_hookup",
      ];
      hookupFields.forEach((field) => {
        const value = yesNoTo01(data[field] as any);
        if (typeof value !== "undefined") {
          formData.append(field, value);
        }
      });

      // Sleeping options for In-Kind Stay (king_stay)
      if (accommodationType === "king_stay") {
        let idx = 0;
        Object.entries(selectedSleepingByCategory).forEach(
          ([category, options]) => {
            options.forEach((optionKey) => {
              formData.append(`sleeping_options[${idx}][category]`, category);
              formData.append(
                `sleeping_options[${idx}][option_key]`,
                optionKey
              );
              idx += 1;
            });
          }
        );
      }

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
      setDataSent(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleSaveClick = async () => {
    // Trigger form validation and submission
    const isValid = await handleSubmit(onSubmit)();
    return isValid;
  };

  // Helper function to check if form is valid based on accommodation type
  const isFormValid = () => {
    const amenities = watch("amenities");
    const facilities = watch("facilities");
    const safetyItems = watch("safety_items");
    const petPolicy = watch("pet_policy");
    const childrenPolicy = watch("accept_booking_with_children");
    const bathroomOptions = watch("bathroom_options");

    // Basic required fields for all accommodation types
    if (!amenities || amenities.length === 0) return false;
    if (!facilities || facilities.length === 0) return false;
    if (!safetyItems || safetyItems.length === 0) return false;
    if (!petPolicy) return false;

    // Additional validation based on accommodation type
    if (
      accommodationType === "camping_glamping" ||
      accommodationType === "co_living_hostel" ||
      accommodationType === "rv" ||
      accommodationType === "king_stay"
    ) {
      if (!childrenPolicy) return false;
    }

    // RV specific validation - all hookup fields are optional but if any is selected, validate
    if (accommodationType === "rv") {
      const sewageHookup = watch("sewage_hookup");
      const televisionHookup = watch("television_hookup");
      const generatorsAllowed = watch("generators_allowed");
      const electricityHookup = watch("electricity_hookup");
      const waterHookup = watch("water_hookup");

      // If any hookup field is selected, all should be selected (optional but consistent)
      const hookupFields = [
        sewageHookup,
        televisionHookup,
        generatorsAllowed,
        electricityHookup,
        waterHookup,
      ];
      const hasSomeHookup = hookupFields.some(
        (field) => field === "yes" || field === "no"
      );
      const hasAllHookup = hookupFields.every(
        (field) => field === "yes" || field === "no"
      );

      if (hasSomeHookup && !hasAllHookup) return false;
    }

    // King stay validation - requires at least one sleeping option
    if (accommodationType === "king_stay") {
      const hasSleepingOptions = Object.values(selectedSleepingByCategory).some(
        (options) => options && options.length > 0
      );
      if (!hasSleepingOptions) return false;
    }

    return true;
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
            isOther={true}
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
            isOther={true}
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

          {(accommodationType === "camping_glamping" ||
            accommodationType === "co_living_hostel" ||
            accommodationType === "rv" ||
            accommodationType === "king_stay") && (
            <MultiSelect
              label="Bathroom options"
              options={bathroom_options}
              selected={watchedbathroom_options || []}
              onChange={(selected) => setValue("bathroom_options", selected)}
              error={errors.bathroom_options?.message}
              customValues={custombathroom_options}
              onCustomAdd={(val) =>
                setCustombathroom_options([...custombathroom_options, val])
              }
              onCustomRemove={(val) =>
                setCustombathroom_options(
                  custombathroom_options.filter((v) => v !== val)
                )
              }
            />
          )}

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
              {(
                enums?.pet_policies || [
                  "yes_on_leash",
                  "yes_without_leash",
                  "yes",
                  "no",
                ]
              ).map((value: string) => {
                const labelMap: Record<string, string> = {
                  yes_on_leash: "Yes, on leash",
                  yes_without_leash: "Yes, without leash",
                  yes: "Yes",
                  no: "No",
                };
                const label = labelMap[value] || value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setValue(
                        "pet_policy",
                        value as
                          | "yes_on_leash"
                          | "yes_without_leash"
                          | "yes"
                          | "no"
                      )
                    }
                    className={`px-8 py-2 rounded-full border cursor-pointer text-[13px] font-semibold transition-all ${
                      watchedPetPolicy === value
                        ? "bg-[#237AFC] border-[#237AFC] text-white"
                        : "bg-white text-[#131313] border-black"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {errors.pet_policy?.message && (
              <p className="text-red-500 text-xs mt-1">
                {errors.pet_policy.message}
              </p>
            )}
          </div>

          {(accommodationType === "camping_glamping" ||
            accommodationType === "co_living_hostel" ||
            accommodationType === "rv" ||
            accommodationType === "king_stay") && (
            <div className="mb-6">
              <label className="text-[12px] md:text-[14px] text-[#1C231F] font-bold mb-3 block">
                Do you accept bookings that include children?
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setValue(
                        "accept_booking_with_children",
                        option.value as "yes" | "no"
                      )
                    }
                    className={`px-8 py-2 rounded-full border cursor-pointer text-[13px] font-semibold transition-all ${
                      watchedChildrenPolicy === option.value
                        ? "bg-[#237AFC] border-[#237AFC] text-white"
                        : "bg-white text-[#131313] border-black"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {errors.accept_booking_with_children?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.accept_booking_with_children.message}
                </p>
              )}
            </div>
          )}

          {accommodationType === "rv" && (
            <div>
              <label className="text-[12px] md:text-[14px] text-[#1C231F] font-bold mb-3 block">
                What hookups are provided at this site?
              </label>
              <div className="flex flex-wrap gap-3">
                <div className="max-w-[220px] w-full">
                  <GlobalSelect
                    label="Sewage hookup"
                    {...(register("sewage_hookup") as any)}
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </GlobalSelect>
                </div>
                <div className="max-w-[220px] w-full">
                  <GlobalSelect
                    label="Television hookup"
                    {...(register("television_hookup") as any)}
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </GlobalSelect>
                </div>
                <div className="max-w-[220px] w-full">
                  <GlobalSelect
                    label="Generators allowed"
                    {...(register("generators_allowed") as any)}
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </GlobalSelect>
                </div>
                <div className="max-w-[220px] w-full">
                  <GlobalSelect
                    label="Electricity hookup"
                    {...(register("electricity_hookup") as any)}
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </GlobalSelect>
                </div>
                <div className="max-w-[220px] w-full">
                  <GlobalSelect
                    label="Water hookup"
                    {...(register("water_hookup") as any)}
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </GlobalSelect>
                </div>
              </div>
            </div>
          )}

          {accommodationType === "king_stay" && (
            <div className="mt-4 bg-[#FFFFFF] border-[#BBBBBB] border border-dashed p-4 md:p-8 rounded-[7px] flex flex-col">
              <p className="text-[12px] md:text-[14px] font-bold mb-4 text-[#1C231F]">
                Sleeping Options
              </p>
              <div className="flex flex-col gap-4">
                {(enums?.sleeping_options_categories || []).map(
                  (category: string) => {
                    const options: string[] = (enums?.sleeping_options?.[
                      category
                    ] || []) as string[];
                    const toLabel = (str: string) =>
                      str
                        .split("_")
                        .map((w) =>
                          w.length ? w[0].toUpperCase() + w.slice(1) : w
                        )
                        .join(" ");
                    return (
                      <MultiSelect
                        key={category}
                        label={toLabel(category)}
                        options={options}
                        selected={selectedSleepingByCategory[category] || []}
                        onChange={(selected) =>
                          setSelectedSleepingByCategory((prev) => ({
                            ...prev,
                            [category]: selected,
                          }))
                        }
                        customValues={[]}
                        onCustomAdd={() => {}}
                        onCustomRemove={() => {}}
                        formatLabel={toLabel}
                      />
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={handleSaveClick}
              disabled={isSubmitting || !isFormValid()}
              className={` w-[158px] mt-2 h-[35px] font-[500] text-[14px] text-white px-4 md:px-10 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                isSubmitting || !isFormValid()
                  ? "bg-[#BABBBC] cursor-not-allowed"
                  : "bg-[#237AFC]"
              } `}
            >
              {dataSent
                ? "Saved"
                : isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Update"
                : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
