"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GlobalTextArea from "@/components/global/GlobalTextArea";
import GlobalTextInput from "@/components/global/GlobalTextInput";
import { apiFormDataWrapper } from "@/lib/api";
import { toast } from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import GlobalRadioGroup from "@/components/global/GlobalRadioGroup";
import GlobalSelect from "@/components/global/GlobalSelect";

// Accommodation type icons
const AccommodationIcon = ({
  type,
  className = "w-4 h-4",
}: {
  type: string;
  className?: string;
}) => {
  const icons = {
    house: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
    apartment: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2z" />
      </svg>
    ),
    hotel: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 13c1.65 0 3-1.35 3-3S8.65 7 7 7s-3 1.35-3 3 1.35 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
      </svg>
    ),
    barn: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" />
      </svg>
    ),
    "bed & breakfast": (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 13c1.65 0 3-1.35 3-3S8.65 7 7 7s-3 1.35-3 3 1.35 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
      </svg>
    ),
    boat: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v2H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z" />
      </svg>
    ),
    cabin: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" />
      </svg>
    ),
    "camper/rv": (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" />
      </svg>
    ),
    castle: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" />
      </svg>
    ),
  };

  return icons[type as keyof typeof icons] || icons.house;
};

// Custom Select Component with Icons
interface CustomSelectProps {
  label: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; icon: string }>;
  error?: string;
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  placeholder = "Select accommodation type",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] z-10 font-medium text-[#1C231F] translate-y-3.5 translate-x-4 bg-white w-fit px-1">
        {label}
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-[40px] border rounded-lg px-5 py-2 text-[12px] text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${error ? "border-red-400" : "border-[#848484]"
            }`}
        >
          <div className="flex items-center gap-2">
            {selectedOption && (
              <AccommodationIcon
                type={selectedOption.icon}
                className="w-4 h-4 text-gray-600"
              />
            )}
            <span
              className={selectedOption ? "text-[#1C231F]" : "text-[#AFACAC]"}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <svg
            className="w-4 h-4 text-gray-400"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-[12px] flex items-center gap-2 hover:bg-gray-50 transition-colors ${option.value === value
                  ? "bg-blue-50 text-blue-600"
                  : "text-[#1C231F]"
                  }`}
              >
                <AccommodationIcon type={option.icon} className="w-4 h-4" />
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

// Zod validation schema
const siteOverviewSchema = z
  .object({
    site_name: z.string().min(1, "Site name is required"),
    accommodation_type: z.string().min(1, "Accommodation type is required"),
    site_description: z.string().min(1, "Site description is required"),
    high_lights: z.array(z.string()).optional(),
    // New API fields (conditionally required by accommodation type)
    camping_glamping_type: z.string().optional(),
    camping_option: z.string().optional(),
    campsite_type: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.accommodation_type === "camping_glamping") {
      if (!data.camping_glamping_type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select camp or glamp",
          path: ["camping_glamping_type"],
        });
      }
      if (
        data.camping_glamping_type === "camp" &&
        !data.camping_option
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select a camping option",
          path: ["camping_option"],
        });
      }
    }

    if (data.accommodation_type === "rv") {
      if (!data.campsite_type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select campsite type",
          path: ["campsite_type"],
        });
      }
    }

    if (data.accommodation_type === "co_living_hostel") {
      const highlights = Array.isArray(data.high_lights)
        ? data.high_lights
        : [];
      const hasSelection =
        highlights.includes("private_rooms") ||
        highlights.includes("dorm_beds");
      if (!hasSelection) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select Private Rooms or Dorm Beds",
          path: ["high_lights"],
        });
      }
    }
  });

type SiteOverviewFormData = z.infer<typeof siteOverviewSchema>;

// Accommodation type options with icons
// const accommodationOptions = [
//   {  icon: "house" },
//   { value: "apartment", label: "Apartment", icon: "apartment" },
//   { value: "hotel", label: "Hotel", icon: "hotel" },
//   { value: "barn", label: "Barn", icon: "barn" },
//   {
//     value: "bed & breakfast",
//     label: "Bed & breakfast",
//     icon: "bed & breakfast",
//   },
//   { value: "boat", label: "Boat", icon: "boat" },
//   { value: "cabin", label: "Cabin", icon: "cabin" },
//   { value: "camper/rv", label: "Camper/RV", icon: "camper/rv" },
//   { value: "castle", label: "Castle", icon: "castle" },
// ];
const defaultAccommodationOptions = [
  { value: "camping_glamping", label: "Camping/Glamping", icon: "house" },
  {
    value: "lodging_room_cabin",
    label: "Lodging/Room/Cabin",
    icon: "apartment",
  },
  { value: "rv", label: "RV", icon: "boat" },
  {
    value: "non_traditional_couch_air_mattress",
    label: "Non-traditional Couch/Air Mattress",
    icon: "cabin",
  },
  { value: "co_living_hostel", label: "Co-living/Hostel", icon: "castle" },
  { value: "kind_stay", label: "In-Kind Stay", icon: "castle" },
];

export default function SiteOverViewForm({
  propertyId,
  onSuccess,
  siteData,
  isEditMode,
  setAccommodationType,
  enums,
}: {
  propertyId: string;
  onSuccess?: () => void;
  siteData?: any;
  isEditMode?: boolean;
  setAccommodationType?: (type: string) => void;
  enums?: any;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dataSent, setDataSent] = useState(false);
  // Build select options from enums when provided
  const accommodationOptions = useMemo(() => {
    if (!enums?.accommodation_types) return defaultAccommodationOptions;

    const pickIcon = (value: string): string => {
      if (value.includes("rv")) return "boat";
      if (value.includes("hostel") || value.includes("co_living"))
        return "castle";
      if (
        value.includes("lodging") ||
        value.includes("room") ||
        value.includes("cabin")
      )
        return "apartment";
      if (
        value.includes("non_traditional") ||
        value.includes("couch") ||
        value.includes("air_mattress")
      )
        return "cabin";
      return "house";
    };

    const toLabel = (value: string): string =>
      value
        .split("_")
        .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
        .join(" ")
        .replace("Rv", "RV");

    return (enums.accommodation_types as string[]).map((value) => ({
      value,
      label: toLabel(value),
      icon: pickIcon(value),
    }));
  }, [enums]);

  const toLabel = (value: string): string =>
    value
      .split("_")
      .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
      .join(" ")
      .replace("Rv", "RV");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    setValue,
    reset,
  } = useForm<SiteOverviewFormData>({
    resolver: zodResolver(siteOverviewSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      site_name: "",
      accommodation_type: "",
      site_description: "",
      high_lights: [],
      camping_glamping_type: "",
      camping_option: "",
      campsite_type: "",
    },
  });

  // Populate form data when siteData is available in edit mode
  useEffect(() => {
    if (isEditMode && siteData) {
      reset({
        site_name: siteData.site_name || "",
        accommodation_type: siteData.accommodation_type || "",
        site_description: siteData.site_description || "",
        camping_glamping_type: siteData.camping_glamping_type || "",
        camping_option: siteData.camping_option || "",
        campsite_type: siteData.campsite_type || "",
      });
      // Inform parent about accommodation type for conditional sections
      if (siteData.accommodation_type) {
        setAccommodationType?.(siteData.accommodation_type);
      }
    }
  }, [siteData, isEditMode, reset]);

  const selectedAccommodationType = watch("accommodation_type");
  const selectedCampingGlampingType = watch("camping_glamping_type");
  const selectedCampingOption = watch("camping_option");
  const selectedCampsiteType = watch("campsite_type");

  // Clear irrelevant fields when type actually changes (avoid clearing initial edit values)
  const prevTypeRef = React.useRef<string | undefined>(undefined);
  useEffect(() => {
    if (
      prevTypeRef.current !== undefined &&
      prevTypeRef.current !== selectedAccommodationType
    ) {
      setValue("camping_glamping_type", "");
      setValue("camping_option", "");
      setValue("campsite_type", "");
      setValue("high_lights", []);
    }
    prevTypeRef.current = selectedAccommodationType;
  }, [selectedAccommodationType, setValue]);

  useEffect(() => {
    if (selectedCampingGlampingType !== "camp") {
      setValue("camping_option", "");
      setValue("campsite_type", "");
    }
  }, [selectedCampingGlampingType, setValue]);

  const onSubmit = async (data: SiteOverviewFormData) => {
    try {
      const formData = new FormData();
      formData.append("site_name", data.site_name);
      formData.append("accommodation_type", data.accommodation_type);
      formData.append("site_description", data.site_description);

      // Add highlights if provided (now as single value)
      if (data.high_lights && data.high_lights.length > 0) {
        data.high_lights.forEach((highlight, index) => {
          formData.append(`high_lights[${index}]`, highlight);
        });
      } else {
        // formData.append("high_lights[0]", "unique");
      }

      // Conditional fields by accommodation type
      if (data.accommodation_type === "camping_glamping") {
        if (data.camping_glamping_type) {
          formData.append("camping_glamping_type", data.camping_glamping_type);
        }
        if (data.camping_option && data.camping_glamping_type === "camp") {
          formData.append("camping_option", data.camping_option);
        }
        // if (data.camping_glamping_type === "camp" && data.camping_option) {
        // }
        if (data.campsite_type) {
          formData.append("campsite_type", data.campsite_type);
        }
      }

      if (data.accommodation_type === "rv" && data.campsite_type) {
        formData.append("campsite_type", data.campsite_type);
      }

      // Add site_id for edit mode
      if (isEditMode && siteData?.id) {
        formData.append("site_id", siteData.id.toString());
      }

      // You can replace this endpoint with your actual API endpoint
      const response = await apiFormDataWrapper<{
        success: boolean;
        message: string;
        data?: {
          id: number;
          property_id: number;
          site_name: string;
          site_description: string;
          accommodation_type: string;
          high_lights: string[];
        };
      }>(
        `properties/${propertyId}/sites/overview`,
        formData,
        isEditMode
          ? "Site overview updated successfully!"
          : "Site overview saved successfully!"
      );

      console.log("Form submitted successfully:", response);

      // If the response contains a site ID, update the URL with it
      if (response.data?.id) {
        setAccommodationType?.(response.data.accommodation_type);
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set("siteId", response.data.id.toString());

        // Update the URL without refreshing the page
        router.replace(`?${currentParams.toString()}`, {
          scroll: false,
        });
      }

      // Mark section as completed
      if (onSuccess) {
        onSuccess();
      }
      setDataSent(true);
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

  // Helper function to check if form is valid based on accommodation type
  const isFormValid = () => {
    const siteName = watch("site_name");
    const accommodationType = watch("accommodation_type");
    const siteDescription = watch("site_description");
    const campingGlampingType = watch("camping_glamping_type");
    const campingOption = watch("camping_option");
    const campsiteType = watch("campsite_type");
    const highlights = watch("high_lights");

    // Basic required fields
    if (!siteName || !accommodationType || !siteDescription) {
      return false;
    }

    // Additional validation based on accommodation type
    if (accommodationType === "camping_glamping") {
      if (!campingGlampingType) return false;
      if (campingGlampingType === "camp" && !campingOption) return false;
    }

    if (accommodationType === "rv" && !campsiteType) {
      return false;
    }

    if (accommodationType === "co_living_hostel") {
      if (
        !highlights ||
        !Array.isArray(highlights) ||
        highlights.length === 0
      ) {
        return false;
      }
    }

    return true;
  };

  return (
    <div>
      <h4 className="text-[16px] md:text-[16px] leading-[16px] text-[#1C231F] font-[600]">
        Site Overview
      </h4>
      <div className="mt-4">
        <div className="border border-[#E1E1E1] bg-white p-2 md:p-4 rounded-[7px]">
          <p className="text-[12px] md:text-[14px] text-[#1C231F] font-bold">
            What kind of accommodation does this site offer?
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <GlobalTextInput
              label={
                <span className="text-[12px] text-[#000000] leading-[16px] font-[500]">
                  Site Name<span className="text-red-500">*</span>
                </span>
              }
              {...register("site_name")}
              error={errors.site_name?.message}
            />

            <CustomSelect
              label={
                <span className="text-[12px]  text-[#000000] leading-[16px] font-[500]">
                  Select Accommodation type
                  <span className="text-red-500">*</span>
                </span>
              }
              value={selectedAccommodationType}
              onChange={(value) => setValue("accommodation_type", value)}
              options={accommodationOptions}
              error={errors.accommodation_type?.message}
            />
          </div>

          <GlobalTextArea
            label={
              watch("accommodation_type") === "rv" ? (
                <span className="text-[12px]  text-[#000000] leading-[16px] font-[500]">
                  Describe the RV site<span className="text-red-500">*</span>
                </span>
              ) : (
                <span className="text-[12px]  text-[#000000] leading-[16px] font-[500]">
                  Site Description<span className="text-red-500">*</span>
                </span>
              )
            }
            {...register("site_description")}
            error={errors.site_description?.message}
          />
          <div className="mt-4">
            {watch("accommodation_type") === "camping_glamping" && (
              <div>
                <label
                  htmlFor="camping_glamping_type"
                  className="text-[14px] text-[#1C231F] leading-[14px] font-bold"
                >
                  Accommodation Type
                </label>

                <div className="flex items-center gap-2 mt-2">
                  <div
                    onClick={() => {
                      setValue("camping_glamping_type", "camp");
                      setValue("camping_option", "");
                    }}
                    className={`py-2 px-6 text-[12px] text-[#1C231F] font-[600] border rounded-[5px] cursor-pointer ${selectedCampingGlampingType === "camp"
                      ? "bg-[#237AFC] text-white border-[237AFC]"
                      : "border-[#848484]"
                      }`}
                  >
                    Camp
                  </div>
                  <div
                    onClick={() => {
                      setValue("camping_glamping_type", "glamp");
                      setValue("camping_option", "");
                      setValue("campsite_type", "");
                    }}
                    className={`py-2 px-6 text-[12px] text-[#1C231F] font-[600] border rounded-[5px] cursor-pointer ${selectedCampingGlampingType === "glamp"
                      ? "bg-[#237AFC] text-white border-[#237AFC]"
                      : "border-[#848484]"
                      }`}
                  >
                    Glamp
                  </div>
                </div>
                {errors.camping_glamping_type?.message && (
                  <span className="text-xs text-red-500 mt-1 inline-block">
                    {errors.camping_glamping_type.message}
                  </span>
                )}
                {selectedCampingGlampingType === "camp" && (
                  <div className="w-full md:w-[70%] lg:w-[50%] mt-2">
                    <GlobalRadioGroup
                      options={(
                        enums?.camping_options || [
                          "pitch_own_tent",
                          "tent_available_on_site",
                        ]
                      ).map((value: string) => ({
                        value,
                        label: toLabel(value),
                      }))}
                      value={selectedCampingOption || ""}
                      onChange={(value) => setValue("camping_option", value)}
                      name="camping_option"
                      error={errors.camping_option?.message}
                    />
                  </div>
                )}
              </div>
            )}
            {watch("accommodation_type") === "co_living_hostel" && (
              <div>
                <div className="flex items-center gap-2">
                  <div
                    onClick={() => setValue("high_lights", ["private_rooms"])}
                    className={`py-2 px-6 text-[12px] text-[#1C231F] font-[600] border rounded-[5px] cursor-pointer ${watch("high_lights")?.includes("private_rooms")
                      ? "bg-[#237AFC] text-white border-[237AFC]"
                      : "border-[#848484]"
                      }`}
                  >
                    Private Rooms
                  </div>
                  <div
                    onClick={() => setValue("high_lights", ["dorm_beds"])}
                    className={`py-2 px-6 text-[12px] text-[#1C231F] font-[600] border rounded-[5px] cursor-pointer ${watch("high_lights")?.includes("dorm_beds")
                      ? "bg-[#237AFC] text-white border-[#237AFC]"
                      : "border-[#848484]"
                      }`}
                  >
                    Dorm Beds
                  </div>
                </div>
                {errors.high_lights?.message && (
                  <span className="text-xs text-red-500 mt-1 inline-block">
                    {String(errors.high_lights.message)}
                  </span>
                )}
                {watch("high_lights")?.includes("dorm_beds") && (
                  <div className="w-full md:w-[70%] lg:w-[50%]">
                    <GlobalSelect label={"Select"}>
                      <option value="male">Male Community Dorm</option>
                      <option value="female">Female Community Dorm</option>
                      <option value="mixed">Bed Mixed Community Dorm</option>
                    </GlobalSelect>
                  </div>
                )}
              </div>
            )}
            {watch("accommodation_type") === "rv" && (
              <div>
                <label
                  htmlFor="campsite_type"
                  className="text-[14px] text-[#1C231F] leading-[14px] font-bold"
                >
                  Do guests get a designated spot, or can they pick where to
                  stay?
                </label>
                <div className="flex items-center gap-2 mt-3">
                  {(enums?.campsite_types || ["undefined", "defined"]).map(
                    (value: string) => (
                      <div
                        key={value}
                        onClick={() => setValue("campsite_type", value)}
                        className={`py-2 px-6 text-[12px] text-[#1C231F] font-[600] border rounded-[5px] cursor-pointer ${selectedCampsiteType === value
                          ? "bg-[#237AFC] text-white border-[#237AFC]"
                          : "border-[#848484]"
                          }`}
                      >
                        {value === "undefined"
                          ? "Non-Designated Spot"
                          : value === "defined"
                            ? "Designated Spot"
                            : toLabel(value)}
                      </div>
                    )
                  )}
                </div>
                {errors.campsite_type?.message && (
                  <span className="text-xs text-red-500 mt-1 inline-block">
                    {errors.campsite_type.message}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSaveClick}
              disabled={isSubmitting || !isFormValid()}
              className={`w-[158px] mt-2 h-[35px] font-[500]  text-[14px] text-white px-4 md:px-10 py-2 rounded-lg transition-colors ${isSubmitting || !isFormValid()
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
