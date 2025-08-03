"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GlobalTextInput from "../../../../global/GlobalTextInput";
import GlobalTextArea from "../../../../global/GlobalTextArea";
import { useSearchParams } from "next/navigation";
import { apiFormDataWrapper } from "@/lib/api";

// Zod validation schema
const arrivalSectionSchema = z.object({
  checkInTime: z.string().min(1, "Check-in time is required"),
  checkOutTime: z.string().min(1, "Check-out time is required"),
  arrivalInstructions: z
    .string()
    .min(10, "Arrival instructions must be at least 10 characters"),
});

type ArrivalSectionFormData = z.infer<typeof arrivalSectionSchema>;

const SiteArrivalSection = ({}) => {
  const searchParams = useSearchParams();
  const propertyId = searchParams ? searchParams.get("propertyId") : null;
  const siteId = searchParams ? searchParams.get("siteId") : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ArrivalSectionFormData>({
    resolver: zodResolver(arrivalSectionSchema),
    defaultValues: {
      checkInTime: "",
      checkOutTime: "",
      arrivalInstructions: "",
    },
  });

  const onSubmit = async (data: ArrivalSectionFormData) => {
    try {
      const formData = new FormData();
      formData.append("site_id", siteId || "");
      formData.append("check_in_time", data.checkInTime);
      formData.append("check_out_time", data.checkOutTime);
      formData.append("arrival_instructions", data.arrivalInstructions);

      const response = await apiFormDataWrapper<{
        success: boolean;
        message: string;
      }>(
        `/properties/${propertyId}/sites/arrival-instructions`,
        formData,
        "Arrival instructions saved successfully!"
      );

      console.log("Form submitted successfully:", response);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Error handling is already done by apiFormDataWrapper
    }
  };

  return (
    <div>
      <div>
        <h4 className="text-[14px] md:text-[16px] text-[#1C231F] font-semibold">
          Arrival Instructions
        </h4>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <p className="text-[#1C231F] font-bold text-[12px] md:text-[14px] mb-4">
            Arrival Instructions should include the following content
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <GlobalTextInput
                label={
                  <span>
                    Check-in Time<span className="text-red-500">*</span>
                  </span>
                }
                type="time"
                {...register("checkInTime")}
                error={errors.checkInTime?.message}
              />
              <GlobalTextInput
                label={
                  <span>
                    Check-out Time<span className="text-red-500">*</span>
                  </span>
                }
                type="time"
                {...register("checkOutTime")}
                error={errors.checkOutTime?.message}
              />
            </div>
            <GlobalTextArea
              label={
                <span>
                  Arrival Instructions<span className="text-red-500">*</span>
                </span>
              }
              placeholder="Provide detailed instructions for visitors to find and access your site..."
              {...register("arrivalInstructions")}
              error={errors.arrivalInstructions?.message}
              rows={5}
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SiteArrivalSection;
