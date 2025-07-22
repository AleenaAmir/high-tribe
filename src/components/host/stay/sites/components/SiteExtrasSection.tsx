"use client";
import React from "react";
import GlobalTextInput from "../../../../global/GlobalTextInput";
import GlobalSelect from "../../../../global/GlobalSelect";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useSitesForm } from "../contexts/SitesFormContext";
import { Extra } from "../types/sites";

interface SiteExtrasSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

const SiteExtrasSection: React.FC<SiteExtrasSectionProps> = ({
  sectionRef,
}) => {
  const { saveSection } = useSitesForm();

  // React Hook Form setup for Extras
  const {
    control,
    handleSubmit: rhfHandleSubmit,
    register,
    setValue,
    watch,
    formState: { errors: rhfErrors },
  } = useForm<{ extras: Extra[] }>({
    defaultValues: {
      extras: [],
    },
  });
  const {
    fields: extrasFields,
    append: appendExtra,
    remove: removeExtra,
  } = useFieldArray({
    control,
    name: "extras",
  });

  const handleSave = async () => {
    const formData = watch();
    await saveSection("extras", formData);
  };

  return (
    <div ref={sectionRef}>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Extras</h2>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-sm mt-4">
        <div className="flex justify-end items-center mb-6 gap-2">
          <h3 className="text-base font-semibold">Extras</h3>
          <button
            type="button"
            className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-2xl hover:bg-gray-100 transition"
            onClick={() =>
              appendExtra({
                type: "",
                name: "",
                image: null,
                currency: "",
                rate: "",
                rateType: "",
                approval: "no",
              })
            }
            aria-label="Add Extras"
          >
            +
          </button>
        </div>

        {extrasFields.map((item, index) => (
          <div
            key={item.id}
            className="mb-10 p-6 bg-[#FAFAFA] rounded-xl shadow-sm border border-gray-100 relative"
          >
            {/* Remove button */}
            <button
              type="button"
              className="absolute top-4 right-4 text-red-500 border border-red-200 rounded-full px-3 py-1 text-xs hover:bg-red-50"
              onClick={() => removeExtra(index)}
              aria-label="Remove Extra"
            >
              Remove
            </button>
            {/* Top row: type and name/title */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Controller
                control={control}
                name={`extras.${index}.type`}
                render={({ field }) => (
                  <GlobalSelect
                    {...field}
                    label="Select the type extra*"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="guide">Professional Guide</option>
                    <option value="transport">Transportation</option>
                    <option value="meals">Meals Included</option>
                    <option value="equipment">Equipment Rental</option>
                    <option value="photography">Photography Service</option>
                    <option value="insurance">Activity Insurance</option>
                  </GlobalSelect>
                )}
              />
              <GlobalTextInput
                label="Name/Title*"
                required
                {...register(`extras.${index}.name`, {
                  required: true,
                })}
              />
            </div>
            {/* Upload image field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload image
              </label>
              <div className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg py-8 bg-white cursor-pointer hover:border-blue-400 transition">
                <input
                  type="file"
                  accept="image/*"
                  id={`extras-image-upload-${index}`}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file =
                      e.target.files && e.target.files[0]
                        ? e.target.files[0]
                        : null;
                    setValue(`extras.${index}.image`, file);
                  }}
                />
                <label
                  htmlFor={`extras-image-upload-${index}`}
                  className="flex flex-col items-center cursor-pointer"
                >
                  {watch(`extras.${index}.image`) &&
                  watch(`extras.${index}.image`) instanceof File ? (
                    <img
                      src={
                        watch(`extras.${index}.image`)
                          ? URL.createObjectURL(
                              watch(`extras.${index}.image`) as File
                            )
                          : ""
                      }
                      alt="Preview"
                      className="w-32 h-20 object-cover rounded border mb-2"
                    />
                  ) : (
                    <>
                      <span className="text-3xl text-gray-300 mb-2">+</span>
                      <span className="text-gray-400 text-sm">
                        Upload image
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>
            {/* Currency, Rate type, Rate */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <GlobalSelect
                label="Currency"
                {...register(`extras.${index}.currency`)}
              >
                <option value="">Currency</option>
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="pkr">PKR</option>
                <option value="gbp">GBP</option>
              </GlobalSelect>
              <GlobalSelect
                label="Rate type"
                {...register(`extras.${index}.rateType`)}
              >
                <option value="">Rate type</option>
                <option value="one_time">One time</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
              </GlobalSelect>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <GlobalSelect label="Rate" {...register(`extras.${index}.rate`)}>
                <option value="">Rate</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="holidays">Holidays</option>
                <option value="specific_dates">Specific Dates</option>
              </GlobalSelect>
              {/* Empty for layout symmetry, or add price input if needed */}
              <div></div>
            </div>
            {/* Post-booking approval radio group */}
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
                  <span>Approval required after site is booked</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="no"
                    {...register(`extras.${index}.approval`)}
                    className="accent-blue-600 w-4 h-4"
                  />
                  <span>No approval required after site is booked</span>
                </label>
              </div>
            </div>
          </div>
        ))}
        {extrasFields.length > 0 && (
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="border rounded-full px-4 py-2 flex items-center gap-2"
              onClick={() =>
                appendExtra({
                  type: "",
                  name: "",
                  image: null,
                  currency: "",
                  rate: "",
                  rateType: "",
                  approval: "no",
                })
              }
            >
              Add Extras +
            </button>
          </div>
        )}
        {extrasFields.length > 0 && (
          <div className="flex justify-end mt-8">
            <button
              type="button"
              className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm"
              onClick={handleSave}
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
