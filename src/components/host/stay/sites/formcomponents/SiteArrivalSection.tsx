"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GlobalTextInput from "../../../../global/GlobalTextInput";
import GlobalTextArea from "../../../../global/GlobalTextArea";
import { useSearchParams } from "next/navigation";
import { apiFormDataWrapper } from "@/lib/api";

// Zod validation schema
const arrivalSectionSchema = z
  .object({
    checkInTime: z.string().min(1, "Check-in time is required"),
    checkOutTime: z.string().min(1, "Check-out time is required"),
    arrivalInstructions: z.string().min(1, "Arrival instructions is required"),
  })
  .refine(
    (data) => {
      const toMinutes = (t: string) => {
        const [h, m] = t.split(":").map((v) => parseInt(v, 10));
        return h * 60 + m;
      };
      return toMinutes(data.checkOutTime) > toMinutes(data.checkInTime);
    },
    { path: ["checkOutTime"], message: "Check-out must be after check-in" }
  );

type ArrivalSectionFormData = z.infer<typeof arrivalSectionSchema>;

const SiteArrivalSection = ({
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
}) => {
  const [dataSent, setDataSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ArrivalSectionFormData>({
    resolver: zodResolver(arrivalSectionSchema),
    defaultValues: {
      checkInTime: "",
      checkOutTime: "",
      arrivalInstructions: "",
    },
  });

  // Populate form data when siteData is available in edit mode
  useEffect(() => {
    if (isEditMode && siteData?.arrival_detail) {
      reset({
        checkInTime: siteData.arrival_detail.check_in_time || "",
        checkOutTime: siteData.arrival_detail.check_out_time || "",
        arrivalInstructions: siteData.arrival_detail.arrival_instructions || "",
      });
    }
  }, [siteData, isEditMode, reset]);

  const onSubmit = async (data: ArrivalSectionFormData) => {
    try {
      const formData = new FormData();

      // Add site_id
      if (siteId) {
        formData.append("site_id", siteId);
      }

      // Add site_id for edit mode
      if (isEditMode && siteData?.id) {
        formData.append("site_id", siteData.id.toString());
      }

      // Add check_in_time (mapped from checkInTime)
      formData.append("check_in_time", data.checkInTime);

      // Add check_out_time (mapped from checkOutTime)
      formData.append("check_out_time", data.checkOutTime);

      // Add arrival_instructions (mapped from arrivalInstructions)
      formData.append("arrival_instructions", data.arrivalInstructions);

      const response = await apiFormDataWrapper<{
        success: boolean;
        message: string;
      }>(
        `properties/${propertyId}/sites/arrival-instructions`,
        formData,
        isEditMode
          ? "Arrival instructions updated successfully!"
          : "Arrival instructions saved successfully!"
      );

      console.log("Form submitted successfully:", response);

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

  // Helper function to check if form is valid
  const isFormValid = () => {
    const checkInTime = watch("checkInTime");
    const checkOutTime = watch("checkOutTime");
    const arrivalInstructions = watch("arrivalInstructions");

    // Check if all required fields are filled
    if (!checkInTime || !checkOutTime || !arrivalInstructions) {
      return false;
    }

    // Check if check-out time is after check-in time
    const toMinutes = (t: string) => {
      const [h, m] = t.split(":").map((v) => parseInt(v, 10));
      return h * 60 + m;
    };

    return toMinutes(checkOutTime) > toMinutes(checkInTime);
  };

  return (
    <div>
      <div>
        <h4 className="text-[14px] md:text-[16px] text-[#1C231F] font-semibold">
          Arrival Instructions
        </h4>
      </div>
      <div className="mt-4">
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
              type="button"
              onClick={handleSaveClick}
              disabled={isSubmitting || !isFormValid()}
              className={` w-[158px] mt-2 h-[35px] font-[500] text-[14px] text-white px-4 md:px-10 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                isSubmitting || !isFormValid()
                  ? "bg-[#BABBBC] cursor-not-allowed"
                  : "bg-[#237AFC]"
              }`}
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
};

export default SiteArrivalSection;
