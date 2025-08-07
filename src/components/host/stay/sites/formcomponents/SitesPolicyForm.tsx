"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { apiFormDataWrapper } from "@/lib/api";
import GlobalInputStepper from "@/components/global/GlobalInputStepper";
import GlobalSelect from "@/components/global/GlobalSelect";
import GlobalRadioGroup from "@/components/global/GlobalRadioGroup";

// Zod validation schema
const policySchema = z
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

type PolicyFormData = z.infer<typeof policySchema>;

export default function SitesPolicyForm({
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
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PolicyFormData>({
    resolver: zodResolver(policySchema),
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

  const onSubmit = async (data: PolicyFormData) => {
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
        Policies
      </h4>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="border border-[#E1E1E1] bg-white p-2 md:p-4 rounded-[7px]">
          <p className="text-[12px] md:text-[14px] text-[#1C231F] mb-6 font-bold">
            How far ahead can guests reserve your property?
          </p>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label
                className={`flex items-center gap-2 cursor-pointer text-[#1C231F] text-[14px] font-medium`}
              >
                <input type="radio" className="accent-blue-600 w-4 h-4" />
                Minimum Nights
              </label>
              <GlobalInputStepper
                placeholder="Nights"
                value={0}
                onChange={() => {}}
                className="max-w-[250px] w-full"
                min={1}
                max={365}
              />
            </div>
            <div className="flex items-center gap-2">
              <label
                className={`flex items-center gap-2 cursor-pointer text-[#1C231F] text-[14px] font-medium`}
              >
                <input type="radio" className="accent-blue-600 w-4 h-4" />
                Minimum Nights
              </label>
              <GlobalInputStepper
                placeholder="Nights"
                value={0}
                onChange={() => {}}
                className="max-w-[250px] w-full"
                min={1}
                max={365}
              />
            </div>
          </div>

          <p className="text-[12px] md:text-[14px] text-[#1C231F] my-6 font-bold">
            How many days before check-in can guests cancel free of charge?
          </p>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label
                className={`flex items-center gap-2 cursor-pointer text-[#1C231F] text-[14px] font-medium`}
              >
                <input type="radio" className="accent-blue-600 w-4 h-4" />
                Day(s) in advance
              </label>
              <GlobalInputStepper
                placeholder="Days"
                value={0}
                onChange={() => {}}
                className="max-w-[250px] w-full"
                min={1}
                max={365}
              />
            </div>
            <label
              className={`flex items-center gap-2 cursor-pointer text-[#1C231F] text-[14px] font-bold mt-2`}
            >
              <input type="checkbox" className="accent-blue-600 w-4 h-4 " />
              No free cancellation
            </label>
          </div>

          <div className="grid lg:grid-cols-2 gap-2 mt-4">
            <GlobalSelect label="Check-in time">
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </GlobalSelect>
            <GlobalSelect label="Check-out time">
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </GlobalSelect>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <label className="text-[12px] md:text-[14px] text-[#1C231F] font-bold">
              Do you accept bookings that include children?
            </label>
            <GlobalRadioGroup
              options={[
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
              ]}
              value={""}
              onChange={() => {}}
              name="children_policy"
            />
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <label className="text-[12px] md:text-[14px] text-[#1C231F] font-bold">
              Can guests bring pets to your accommodation?
            </label>
            <GlobalRadioGroup
              options={[
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
              ]}
              value={""}
              onChange={() => {}}
              name="pets_policy"
            />
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <label className="text-[12px] md:text-[14px] text-[#1C231F] font-bold">
              Do you have any quiet hours or curfews in place?
            </label>
            <GlobalRadioGroup
              options={[
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
              ]}
              value={""}
              onChange={() => {}}
              name="quiet_hours_policy"
            />
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
