"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { apiFormDataWrapper } from "@/lib/api";

// Zod validation schema
const refundPolicySchema = z.object({
  refundType: z.enum(["refundable", "non_refundable"], {
    required_error: "Please select a refund policy type",
  }),
  refundDays: z
    .number()
    .min(1, "Please enter a valid number of days")
    .optional(),
});

type RefundPolicyFormData = z.infer<typeof refundPolicySchema>;

export default function SitesRefundPolicyForm({
  propertyId,
  siteId,
  onSuccess,
}: {
  propertyId: string;
  siteId: string;
  onSuccess?: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RefundPolicyFormData>({
    resolver: zodResolver(refundPolicySchema),
    defaultValues: {
      refundType: "refundable",
      refundDays: 1,
    },
  });

  const refundType = watch("refundType");

  const onSubmit = async (data: RefundPolicyFormData) => {
    try {
      const formData = new FormData();
      formData.append("refundType", data.refundType);
      if (data.refundDays) {
        formData.append("refundDays", data.refundDays.toString());
      }

      // You can replace this endpoint with your actual API endpoint
      const response = await apiFormDataWrapper<{
        success: boolean;
        message: string;
      }>(
        "/api/sites/refund-policy",
        formData,
        "Refund policy saved successfully!"
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
        Refund Policy
      </h4>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="border border-[#E1E1E1] bg-white p-2 md:p-4 rounded-[7px]">
          <p className="text-[16px] md:text-[20px] text-[#1C231F] font-bold mb-2">
            Set your refund policy
          </p>
          <p className="text-[12px] md:text-[14px] text-gray-600 mb-6">
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
                <div className="ml-1">
                  <input
                    placeholder="Enter a day"
                    type="number"
                    {...register("refundDays", { valueAsNumber: true })}
                    className="w-[200px] rounded-full border border-[#848484] px-2 py-1 text-sm"
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
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#237AFC] text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
