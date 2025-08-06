"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GlobalTextArea from "@/components/global/GlobalTextArea";
import GlobalTextInput from "@/components/global/GlobalTextInput";
import { apiFormDataWrapper } from "@/lib/api";
import { toast } from "react-hot-toast";

// Zod validation schema
const siteCapacitySchema = z.object({
  siteSize: z.number().min(1, "Site size is required"), // changed to string
  typeOfBed: z
    .string()
    .min(1, "Total beds is required")
    .regex(/^[1-9]\d*$/, "Total beds must be a positive integer"),
  capacityDescription: z.string().min(1, "Capacity description is required"),
});

type SiteCapacityFormData = z.infer<typeof siteCapacitySchema>;

export default function SiteCapacityForm({
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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SiteCapacityFormData>({
    resolver: zodResolver(siteCapacitySchema),
    defaultValues: {
      siteSize: 0,
      typeOfBed: "",
      capacityDescription: "",
    },
  });

  // Populate form data when siteData is available in edit mode
  useEffect(() => {
    if (isEditMode && siteData?.capacity) {
      reset({
        siteSize: siteData.capacity.site_size || 0,
        typeOfBed: siteData.capacity.total_beds?.toString() || "",
        capacityDescription: siteData.capacity.capacity_description || "",
      });
     
    }
  }, [siteData, isEditMode, reset]);

  const onSubmit = async (data: SiteCapacityFormData) => {
    try {
      const formData = new FormData();
      formData.append("site_size", "30x20 ft"); // e.g., "30x20 ft"
      formData.append("total_beds", data.typeOfBed.toString()); // e.g., "5"
      formData.append("site_id", siteId);

      // Add site_id for edit mode
      if (isEditMode && siteData?.id) {
        formData.append("site_id", siteData.id.toString());
      }

      const response = (await apiFormDataWrapper(
        `properties/${propertyId}/sites/capacity`,
        formData,
        isEditMode
          ? "Site capacity updated successfully!"
          : "Site capacity saved successfully!"
      )) as Response;

      //@ts-ignore
      if (response.message == "Capacity details saved successfully") {
        toast.success(
          isEditMode
            ? "Site capacity updated successfully!"
            : "Site capacity saved successfully!"
        );
      } else {
        toast.error("Failed to save site capacity");
      }

      if (onSuccess) onSuccess();
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
        Site Capacity
      </h4>
      <div className="mt-4">
        <div className="border border-[#E1E1E1] bg-white p-2 md:p-4 rounded-[7px]">
          <p className="text-[12px] md:text-[14px] text-[#1C231F] font-bold">
            What is the capacity and details of this site?
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <GlobalTextInput
              label={
                <span>
                  Site Size<span className="text-red-500">*</span>
                </span>
              }
              type="number"
              {...register("siteSize", { valueAsNumber: true })}
              error={errors.siteSize?.message}
            />

            <GlobalTextInput
              label={
                <span>
                  Type of Bed<span className="text-red-500">*</span>
                </span>
              }
              {...register("typeOfBed")}
              error={errors.typeOfBed?.message}
            />
          </div>

          <GlobalTextArea
            label={
              <span>
                Capacity Description<span className="text-red-500">*</span>
              </span>
            }
            {...register("capacityDescription")}
            error={errors.capacityDescription?.message}
          />

          {/* Submit Button */}
          <div className="mt-4 flex justify-end">
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
