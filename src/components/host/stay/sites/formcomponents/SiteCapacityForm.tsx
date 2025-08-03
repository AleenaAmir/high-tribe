"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GlobalTextArea from "@/components/global/GlobalTextArea";
import GlobalTextInput from "@/components/global/GlobalTextInput";
import { apiFormDataWrapper } from "@/lib/api";

// Zod validation schema
const siteCapacitySchema = z.object({
  siteSize: z.number().min(1, "Site size must be at least 1"),
  typeOfBed: z.string().min(1, "Type of bed is required"),
  capacityDescription: z
    .string()
    .min(10, "Capacity description must be at least 10 characters"),
});

type SiteCapacityFormData = z.infer<typeof siteCapacitySchema>;

export default function SiteCapacityForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SiteCapacityFormData>({
    resolver: zodResolver(siteCapacitySchema),
    defaultValues: {
      siteSize: 0,
      typeOfBed: "",
      capacityDescription: "",
    },
  });

  const onSubmit = async (data: SiteCapacityFormData) => {
    try {
      const formData = new FormData();
      formData.append("siteSize", data.siteSize.toString());
      formData.append("typeOfBed", data.typeOfBed);
      formData.append("capacityDescription", data.capacityDescription);

      // You can replace this endpoint with your actual API endpoint
      const response = await apiFormDataWrapper<{
        success: boolean;
        message: string;
      }>("/api/sites/capacity", formData, "Site capacity saved successfully!");

      console.log("Form submitted successfully:", response);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Error handling is already done by apiFormDataWrapper
    }
  };

  return (
    <div>
      <h4 className="text-[14px] md:text-[16px] text-[#1C231F] font-semibold">
        Site Capacity
      </h4>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
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
