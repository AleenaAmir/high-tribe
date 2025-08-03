"use client";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GlobalTextArea from "@/components/global/GlobalTextArea";
import GlobalTextInput from "@/components/global/GlobalTextInput";
import { apiFormDataWrapper } from "@/lib/api";
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";

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
          className={`w-full h-[40px] border rounded-lg px-5 py-2 text-[12px] text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${
            error ? "border-red-400" : "border-[#848484]"
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
                className={`w-full px-4 py-2 text-left text-[12px] flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                  option.value === value
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
const siteOverviewSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  accommodationType: z.string().min(1, "Accommodation type is required"),
  siteDescription: z
    .string()
    .min(10, "Site description must be at least 10 characters"),
});

type SiteOverviewFormData = z.infer<typeof siteOverviewSchema>;

// Accommodation type options with icons
const accommodationOptions = [
  { value: "house", label: "House", icon: "house" },
  { value: "apartment", label: "Apartment", icon: "apartment" },
  { value: "hotel", label: "Hotel", icon: "hotel" },
  { value: "barn", label: "Barn", icon: "barn" },
  {
    value: "bed & breakfast",
    label: "Bed & breakfast",
    icon: "bed & breakfast",
  },
  { value: "boat", label: "Boat", icon: "boat" },
  { value: "cabin", label: "Cabin", icon: "cabin" },
  { value: "camper/rv", label: "Camper/RV", icon: "camper/rv" },
  { value: "castle", label: "Castle", icon: "castle" },
];

export default function SiteOverViewForm() {
  const searchParams = useSearchParams();
  const propertyId = searchParams ? searchParams.get("propertyId") : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<SiteOverviewFormData>({
    resolver: zodResolver(siteOverviewSchema),
    defaultValues: {
      siteName: "",
      accommodationType: "",
      siteDescription: "",
    },
  });

  const selectedAccommodationType = watch("accommodationType");

  const onSubmit = async (data: SiteOverviewFormData) => {
    try {
      const formData = new FormData();
      formData.append("siteName", data.siteName);
      formData.append("accommodationType", data.accommodationType);
      formData.append("siteDescription", data.siteDescription);

      // You can replace this endpoint with your actual API endpoint
      const response = await apiFormDataWrapper<{
        success: boolean;
        message: string;
      }>(
        `/properties/${propertyId}/sites/overview`,
        formData,
        "Site overview saved successfully!"
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
        Site Overview
      </h4>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="border border-[#E1E1E1] bg-white p-2 md:p-4 rounded-[7px]">
          <p className="text-[12px] md:text-[14px] text-[#1C231F] font-bold">
            What kind of accommodation does this site offer?
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <GlobalTextInput
              label={
                <span>
                  Site Name<span className="text-red-500">*</span>
                </span>
              }
              {...register("siteName")}
              error={errors.siteName?.message}
            />

            <CustomSelect
              label={
                <span>
                  Select Accommodation type
                  <span className="text-red-500">*</span>
                </span>
              }
              value={selectedAccommodationType}
              onChange={(value) => setValue("accommodationType", value)}
              options={accommodationOptions}
              error={errors.accommodationType?.message}
            />
          </div>

          <GlobalTextArea
            label={
              <span>
                Site Description<span className="text-red-500">*</span>
              </span>
            }
            {...register("siteDescription")}
            error={errors.siteDescription?.message}
          />

          {/* Submit Button */}
          <div className="mt-4 flex justify-end">
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
