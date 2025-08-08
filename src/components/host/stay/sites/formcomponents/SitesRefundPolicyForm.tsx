"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { apiFormDataWrapper } from "@/lib/api";
import GlobalInputStepper from "@/components/global/GlobalInputStepper";
import GlobalSelect from "@/components/global/GlobalSelect";

// Zod validation schema
const refundPolicySchema = z
  .object({
    refundType: z.enum(["refundable", "non_refundable"], {
      required_error: "Please select a refund policy type",
    }),
    refundDays: z
      .number({ invalid_type_error: "Please enter number of days" })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.refundType === "refundable") {
        return typeof data.refundDays === "number" && data.refundDays >= 1;
      }
      return true; // valid if non_refundable
    },
    {
      path: ["refundDays"],
      message: "Please enter a valid number of days",
    }
  );

type RefundPolicyFormData = z.infer<typeof refundPolicySchema>;

export default function SitesRefundPolicyForm({
  propertyId,
  siteId,
  onSuccess,
  siteData,
  isEditMode,
  accommodationType,
}: {
  propertyId: string;
  siteId: string;
  onSuccess?: () => void;
  siteData?: any;
  isEditMode?: boolean;
  accommodationType?: string | null;
}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RefundPolicyFormData>({
    resolver: zodResolver(refundPolicySchema),
    defaultValues: {
      refundType: "refundable",
      refundDays: 0,
    },
  });

  // Populate form data when siteData is available in edit mode
  useEffect(() => {
    if (isEditMode && siteData?.refund_policy) {
      reset({
        refundType: siteData.refund_policy.type || "refundable",
        refundDays: siteData.refund_policy.refundable_until_days || 1,
      });
    }
  }, [siteData, isEditMode, reset]);

  const refundType = watch("refundType");

  const onSubmit = async (data: RefundPolicyFormData) => {
    try {
      const formData = new FormData();

      formData.append("site_id", siteId);

      // Add site_id for edit mode
      if (isEditMode && siteData?.id) {
        formData.append("site_id", siteData.id.toString());
      }

      formData.append("type", data.refundType);
      if (data.refundDays) {
        formData.append("refundable_until_days", data.refundDays.toString());
      }

      // You can replace this endpoint with your actual API endpoint
      const response = await apiFormDataWrapper<{
        success: boolean;
        message: string;
      }>(
        `properties/${propertyId}/sites/refund-policy`,
        formData,
        isEditMode
          ? "Refund policy updated successfully!"
          : "Refund policy saved successfully!"
      );

      console.log("Form submitted successfully:", response);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      // Error handling is already done by apiFormDataWrapper
    }
  };

  return (
    <div>
      <h4 className="text-[14px] md:text-[16px] text-[#1C231F] font-semibold">
        Refund Policy
      </h4>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="border border-[#E1E1E1] bg-white p-2 md:p-4 rounded-[7px]">
          <p className="text-[16px] md:text-[20px] text-[#1C231F] font-bold mb-2">
            Set your refund policy
          </p>
          <p className="text-[12px] md:text-[14px] text-black font-medium mb-6">
            After your property is published, you can only update your policy to
            make it more flexible for your guests.
          </p>

          {/* Refund Policy Options */}
          <div className="space-y-4 mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                value="refundable"
                {...register("refundType")}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Refundable</span>
              {refundType === "refundable" && (
                <div className="ml-1 ">
                  {/* <input
                    placeholder="Enter a day"
                    type="number"
                    {...register("refundDays", { valueAsNumber: true })}
                    className="w-[200px] rounded-full border border-[#848484] px-2 py-1 text-sm"
                  /> */}
                  <GlobalInputStepper
                    placeholder="Enter a day"
                    value={watch("refundDays") || 0}
                    onChange={(value) => setValue("refundDays", value)}
                    max={31}
                    min={1}
                  />
                </div>
              )}
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                value="non_refundable"
                {...register("refundType")}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Non Refundable</span>
            </label>

            {errors.refundType && (
              <p className="text-red-500 text-xs mt-1">
                {errors.refundType.message}
              </p>
            )}

            {accommodationType !== "lodging_room_cabin" && (
              <div>
                <label
                  htmlFor=""
                  className="text-[12px] md:text-[14px] text-black font-bold mb-2"
                >
                  How far ahead can guests reserve your property?
                </label>
                <div className="w-full md:max-w-[70%] lg:max-w-[50%]">
                  <GlobalSelect
                    label={
                      <span>
                        Select*<span className="text-red-500">*</span>
                      </span>
                    }
                  >
                    <option value="anytime">Anytime</option>
                    <option value="1_day_in_advance">1 day in advance</option>
                    <option value="2_days_in_advance">2 days in advance</option>
                  </GlobalSelect>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={() => {
                handleSubmit(onSubmit)();
              }}
              className="bg-[#237AFC] w-[158px] mt-2 h-[35px] font-[500] text-[14px] text-white px-4 md:px-10 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
