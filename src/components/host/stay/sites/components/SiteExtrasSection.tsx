"use client";
import React from "react";
import GlobalTextInput from "../../../../global/GlobalTextInput";
import GlobalSelect from "../../../../global/GlobalSelect";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useSitesForm } from "../contexts/SitesFormContext";
import { Extra } from "../types/sites";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

interface SiteExtrasSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

// Reusable select option arrays
const extraTypeOptions = [
  { value: "rental_services", label: "Rental Services" },
  { value: "goods_availability", label: "Goods Availability" },
  { value: "experience_services", label: "Experience Services" },
];

const currencyOptions = [
  { value: "", label: "Currency" },
  { value: "usd", label: "USD" },
  { value: "eur", label: "EUR" },
  { value: "pkr", label: "PKR" },
  { value: "gbp", label: "GBP" },
];

const rateTypeOptions = [
  { value: "", label: "Rate Type" },
  { value: "one_time", label: "One time" },
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
];

const rateCategoryOptions = [
  { value: "", label: "Rate Category" },
  { value: "weekdays", label: "Weekdays" },
  { value: "weekends", label: "Weekends" },
  { value: "holidays", label: "Holidays" },
  { value: "specific_dates", label: "Specific Dates" },
];

const SiteExtrasSection: React.FC<SiteExtrasSectionProps> = ({
  sectionRef,
}) => {
  const { saveSection } = useSitesForm();
  const searchParams = useSearchParams();
  const propertyId = searchParams ? searchParams.get("propertyId") : null;
  const siteId = searchParams ? searchParams.get("siteId") : null;
  const {
    control,
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ extras: Extra[] }>({
    defaultValues: { extras: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "extras",
  });

  const handleSave = async () => {
    const formData = new FormData();
    const values = watch();

    // @ts-ignore
    formData.append("site_id", siteId); // Replace with dynamic site ID if needed

    values.extras.forEach((extra, i) => {
      formData.append(`type`, extra.type);
      formData.append(`title`, extra.name);
      formData.append(`description`, "hello");
      formData.append(`currency`, extra.currency.toUpperCase());
      formData.append(`rate_type`, extra.rateType);
      // @ts-ignore
      formData.append(`base_rate`, 123);
      formData.append(`weekdays_rate`, "12");
      formData.append(`weekends_rate`, "12");
      formData.append(`holidays_rate`, "12");
      formData.append(
        `post_booking_approval`,
        extra.approval === "yes" ? "required" : "not_required"
      );

      if (extra.image) {
        formData.append(`image`, extra.image);
      }
    });

    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || "";
    }

    try {
      const response = await fetch(
        `https://api.hightribe.com/api/properties/${propertyId}/sites/extras`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`, // Replace this
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        console.log("✅ Extras saved successfully:", result);
        toast.success(result.message);
      } else {
        console.error("❌ Failed to save extras:", result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      toast.error("Network error");
    }
  };

  return (
    <div ref={sectionRef}>
      <h2 className="text-lg font-semibold text-gray-900">Extras</h2>
      <div className="p-6 bg-white rounded-lg shadow-sm mt-4">
        <div className="flex justify-end items-center mb-6 gap-2">
          <h3 className="text-base font-semibold">Extras</h3>
          <button
            type="button"
            onClick={() =>
              append({
                type: "",
                name: "",
                image: null,
                currency: "",
                rate: "",
                rateType: "",
                approval: "no",
              })
            }
            className="border border-gray-300 rounded-full w-14 h-14 text-2xl flex items-center justify-center hover:bg-gray-100"
          >
            +
          </button>
        </div>

        {fields.map((item, index) => (
          <div
            key={item.id}
            className="mb-10 p-6 border border-gray-100 rounded-xl shadow-sm relative"
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-red-500 border border-red-200 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => remove(index)}
            >
              x
            </button>

            {/* Type & Name */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Controller
                control={control}
                name={`extras.${index}.type`}
                rules={{ required: true }}
                render={({ field }) => (
                  <GlobalSelect
                    {...field}
                    label={
                      <>
                        Type <span className="text-red-500">*</span>
                      </>
                    }
                    required
                  >
                    <option value="">Select type</option>
                    {extraTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </GlobalSelect>
                )}
              />

              <GlobalTextInput
                label={
                  <>
                    Name/Title <span className="text-red-500">*</span>
                  </>
                }
                required
                {...register(`extras.${index}.name`, { required: true })}
              />
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <div className="border border-dashed border-gray-300 rounded-lg cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  id={`extras-image-upload-${index}`}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setValue(`extras.${index}.image`, file);
                  }}
                />
                <label
                  htmlFor={`extras-image-upload-${index}`}
                  className="flex flex-col items-center justify-center py-4 cursor-pointer"
                >
                  {watch(`extras.${index}.image`) ? (
                    <img
                      src={URL.createObjectURL(
                        watch(`extras.${index}.image`) as File
                      )}
                      alt="Preview"
                      className="object-contain h-24 rounded border mb-2"
                    />
                  ) : (
                    <>
                      <span className="text-5xl text-gray-500">+</span>
                      <span className="text-xs text-gray-500">
                        Upload image
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Currency & Rate Type */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <GlobalSelect
                label="Currency"
                {...register(`extras.${index}.currency`)}
              >
                {currencyOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </GlobalSelect>

              <GlobalSelect
                label="Rate Type"
                {...register(`extras.${index}.rateType`)}
              >
                {rateTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </GlobalSelect>
            </div>

            {/* Rate Category */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <GlobalSelect
                label="Rate Category"
                {...register(`extras.${index}.rate`)}
              >
                {rateCategoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </GlobalSelect>
              <div></div>
            </div>

            {/* Approval Setting */}
            <div className="mb-4">
              <label className="block font-medium mb-2">
                Post-booking request settings
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="yes"
                    {...register(`extras.${index}.approval`)}
                    className="accent-blue-600 w-4 h-4"
                  />
                  <span>Approval required after booking</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="no"
                    {...register(`extras.${index}.approval`)}
                    className="accent-blue-600 w-4 h-4"
                  />
                  <span>No approval required after booking</span>
                </label>
              </div>
            </div>
          </div>
        ))}

        {fields.length > 0 && (
          <div className="flex justify-end mt-8">
            <button
              type="button"
              onClick={handleSave}
              className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm shadow-sm"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteExtrasSection;
