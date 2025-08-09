"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { apiFormDataWrapper } from "@/lib/api";
import GlobalInputStepper from "@/components/global/GlobalInputStepper";
import GlobalRadioGroup from "@/components/global/GlobalRadioGroup";
import GlobalTextInput from "@/components/global/GlobalTextInput";

// Zod validation schema for Site Policies (NOT refund policy)
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // 24h HH:mm
const policySchema = z
  .object({
    minNights: z
      .number({ invalid_type_error: "Enter minimum nights" })
      .int()
      .min(1)
      .max(365),
    maxNights: z
      .number({ invalid_type_error: "Enter maximum nights" })
      .int()
      .min(1)
      .max(365),
    freeCancellationDays: z
      .number({ invalid_type_error: "Enter days" })
      .int()
      .min(0)
      .max(365)
      .optional(),
    noFreeCancellation: z.boolean().optional(),
    checkInTime: z.string().regex(timeRegex, { message: "Use 24h time HH:mm" }),
    checkOutTime: z
      .string()
      .regex(timeRegex, { message: "Use 24h time HH:mm" }),
    acceptBookingWithChildren: z.enum(["yes", "no"]),
    curfewInPlace: z.enum(["yes", "no"]),
    curfewHours: z.enum(["yes", "no"]),
  })
  .refine((data) => data.maxNights >= data.minNights, {
    path: ["maxNights"],
    message: "Maximum nights must be greater than or equal to minimum nights",
  })
  .refine(
    (data) =>
      data.noFreeCancellation
        ? true
        : typeof data.freeCancellationDays === "number",
    {
      path: ["freeCancellationDays"],
      message: "Enter days or select no free cancellation",
    }
  )
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
// .refine(
//   (data) => {
//     // compare HH:mm as minutes since midnight
//     const toMinutes = (t: string) => {
//       const [h, m] = t.split(":").map((v) => parseInt(v, 10));
//       return h * 60 + m;
//     };
//     return toMinutes(data.checkOutTime) > toMinutes(data.checkInTime);
//   },
//   { path: ["checkOutTime"], message: "Check-out must be after check-in" }
// );

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
      minNights: 1,
      maxNights: 1,
      freeCancellationDays: 1,
      noFreeCancellation: false,
      checkInTime: "14:00",
      checkOutTime: "11:00",
      acceptBookingWithChildren: "yes",
      curfewInPlace: "no",
      curfewHours: "no",
    },
  });

  // Populate form data when siteData is available in edit mode
  useEffect(() => {
    if (isEditMode && siteData?.policies) {
      const p = siteData.policies;
      reset({
        minNights: p.min_nights ?? 1,
        maxNights: p.max_nights ?? 1,
        freeCancellationDays: p.free_cancellation_days_before_check_in ?? 0,
        noFreeCancellation:
          typeof p.free_cancellation_days_before_check_in !== "number" ||
          p.free_cancellation_days_before_check_in === 0,
        checkInTime: p.check_in_time || "14:00",
        checkOutTime: p.check_out_time || "11:00",
        acceptBookingWithChildren:
          p.accept_booking_with_children === 0 ? "no" : "yes",
        curfewInPlace: p.curfew_in_place === 1 ? "yes" : "no",
        curfewHours: p.curfew_hours ?? 0,
      });
    }
  }, [siteData, isEditMode, reset]);

  const noFreeCancellation = watch("noFreeCancellation");
  const acceptChildren = watch("acceptBookingWithChildren");
  const curfewInPlace = watch("curfewInPlace");
  const curfewHours = watch("curfewHours");

  const onSubmit = async (data: PolicyFormData) => {
    try {
      const formData = new FormData();

      // Required identifiers
      formData.append("site_id", siteId);
      if (isEditMode && siteData?.id) {
        formData.append("site_id", siteData.id.toString());
      }

      // Nights
      formData.append("min_nights", data.minNights.toString());
      formData.append("max_nights", data.maxNights.toString());

      // Free cancellation
      if (
        !data.noFreeCancellation &&
        typeof data.freeCancellationDays === "number"
      ) {
        formData.append(
          "free_cancellation_days_before_check_in",
          data.freeCancellationDays.toString()
        );
      }

      // Times
      formData.append("check_in_time", data.checkInTime);
      formData.append("check_out_time", data.checkOutTime);

      // Children policy
      formData.append(
        "accept_booking_with_children",
        data.acceptBookingWithChildren === "yes" ? "1" : "0"
      );

      // Curfew

      formData.append(
        "curfew_in_place",
        data.curfewInPlace === "yes" ? "true" : "false"
      );
      formData.append("curfew_hours", data.curfewHours === "yes" ? "1" : "0");

      const response = await apiFormDataWrapper<{
        success: boolean;
        message: string;
        data: any;
      }>(
        `properties/${propertyId}/sites/policies`,
        formData,
        isEditMode
          ? "Policies updated successfully!"
          : "Policies saved successfully!"
      );

      console.log("Policies saved:", response.data);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting policies:", error);
      // Error handling via apiFormDataWrapper
    }
  };

  return (
    <div>
      <h4 className="text-[14px] md:text-[16px] text-[#1C231F] font-semibold">
        Policies
      </h4>
      <div className="mt-4">
        <div className="border border-[#E1E1E1] bg-white p-2 md:p-4 rounded-[7px]">
          <p className="text-[12px] md:text-[14px] text-[#1C231F] mb-6 font-bold">
            How far ahead can guests reserve your property?
          </p>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label
                className={`flex items-center gap-2 cursor-pointer text-[#1C231F] text-[14px] font-medium`}
              >
                <input
                  type="radio"
                  className="accent-blue-600 w-4 h-4"
                  checked
                  readOnly
                />
                Minimum Nights
              </label>
              <GlobalInputStepper
                placeholder="Nights"
                value={watch("minNights") || 0}
                onChange={(value) =>
                  setValue("minNights", value, { shouldValidate: true })
                }
                className="max-w-[250px] w-full"
                min={1}
                max={365}
              />
            </div>
            <div className="flex items-center gap-2">
              <label
                className={`flex items-center gap-2 cursor-pointer text-[#1C231F] text-[14px] font-medium`}
              >
                <input
                  type="radio"
                  className="accent-blue-600 w-4 h-4"
                  checked
                  readOnly
                />
                Maximum Nights
              </label>
              <GlobalInputStepper
                placeholder="Nights"
                value={watch("maxNights") || 0}
                onChange={(value) =>
                  setValue("maxNights", value, { shouldValidate: true })
                }
                className="max-w-[250px] w-full"
                min={1}
                max={365}
              />
            </div>
            {errors.maxNights && (
              <span className="text-xs text-red-500">
                {errors.maxNights.message}
              </span>
            )}
          </div>

          <p className="text-[12px] md:text-[14px] text-[#1C231F] my-6 font-bold">
            How many days before check-in can guests cancel free of charge?
          </p>

          <div className="flex flex-col gap-2">
            <div
              className={`flex items-center gap-2 ${
                noFreeCancellation ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <label
                className={`flex items-center gap-2 cursor-pointer text-[#1C231F] text-[14px] font-medium`}
              >
                <input
                  type="radio"
                  className="accent-blue-600 w-4 h-4"
                  checked
                  readOnly
                />
                Day(s) in advance
              </label>
              <GlobalInputStepper
                placeholder="Days"
                value={
                  noFreeCancellation ? 0 : watch("freeCancellationDays") || 0
                }
                onChange={(value) =>
                  setValue("freeCancellationDays", value, {
                    shouldValidate: true,
                  })
                }
                className="max-w-[250px] w-full"
                min={1}
                max={365}
              />
            </div>
            <label
              className={`flex items-center gap-2 cursor-pointer text-[#1C231F] text-[14px] font-bold mt-2`}
            >
              <input
                type="checkbox"
                className="accent-blue-600 w-4 h-4 "
                checked={!!noFreeCancellation}
                onChange={(e) =>
                  setValue("noFreeCancellation", e.target.checked, {
                    shouldValidate: true,
                  })
                }
              />
              No free cancellation
            </label>
            {errors.freeCancellationDays && !noFreeCancellation && (
              <span className="text-xs text-red-500">
                {errors.freeCancellationDays.message}
              </span>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-2 mt-4">
            <GlobalTextInput
              label="Check-in time"
              type="time"
              step={60}
              {...register("checkInTime")}
              error={errors.checkInTime?.message}
            />
            <GlobalTextInput
              label="Check-out time"
              type="time"
              step={60}
              {...register("checkOutTime")}
              error={errors.checkOutTime?.message}
            />
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
              value={acceptChildren}
              onChange={(value) =>
                setValue(
                  "acceptBookingWithChildren",
                  value as PolicyFormData["acceptBookingWithChildren"],
                  { shouldValidate: true }
                )
              }
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
              value={curfewHours}
              onChange={(value) =>
                setValue(
                  "curfewHours",
                  value as PolicyFormData["curfewHours"],
                  { shouldValidate: true }
                )
              }
              name="curfew_hours_policy"
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
              value={curfewInPlace}
              onChange={(value) =>
                setValue(
                  "curfewInPlace",
                  value as PolicyFormData["curfewInPlace"],
                  { shouldValidate: true }
                )
              }
              name="quiet_hours_policy"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
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
      </div>
    </div>
  );
}
