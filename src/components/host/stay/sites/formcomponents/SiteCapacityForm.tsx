"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GlobalTextArea from "@/components/global/GlobalTextArea";
import GlobalTextInput from "@/components/global/GlobalTextInput";
import { apiFormDataWrapper } from "@/lib/api";
import { toast } from "react-hot-toast";
import GlobalInputStepper from "@/components/global/GlobalInputStepper";
import GlobalSelect from "@/components/global/GlobalSelect";
import GlobalRadioGroup from "@/components/global/GlobalRadioGroup";

// Single comprehensive schema with all possible fields as optional
const siteCapacitySchema = z.object({
  site_id: z.string().min(1, "Site ID is required"),
  // Lodging room cabin fields
  maximum_occupancy: z.number().optional(),
  type_of_bed: z.string().optional(),
  capacity_description: z.string().optional(),
  // Co-living hostel fields
  room_size: z.string().optional(),
  bed_type: z.string().optional(),
  number_of_beds: z.number().optional(),
  number_of_bathrooms: z.number().optional(),
  // Camping glamping fields
  sleeping_capacity: z.number().optional(),
  // RV fields
  level_ground: z.string().optional(),
  access_method: z.string().optional(),
  rv_slidesouts: z.string().optional(),
  ground_surface: z.string().optional(),
  ground_surface_other: z.string().optional(),
  rv_types: z.array(z.string()).optional(),
  rv_types_other: z.string().optional(),
  max_rv_length: z.number().optional(),
  max_rv_width: z.number().optional(),
  turning_radius_warnings: z.string().optional(),
  // King size bed fields
  area_size_unit: z.enum(["Meters", "Feets"]).optional(),
  area_length: z.number().optional(),
  area_width: z.number().optional(),
  guest_favourites: z.string().optional(),
  // Default fields
  site_size: z.number().optional(),
});

type SiteCapacityFormData = z.infer<typeof siteCapacitySchema>;

export default function SiteCapacityForm({
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
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<SiteCapacityFormData>({
    resolver: zodResolver(siteCapacitySchema),
    defaultValues: {
      site_id: siteId,
      ...getDefaultValuesForAccommodationType(accommodationType || null),
    },
  });

  const [areaSizeType, setAreaSizeType] = useState<"Meters" | "Feets">("Feets");

  // Get default values based on accommodation type
  function getDefaultValuesForAccommodationType(
    accommodationType: string | null
  ) {
    switch (accommodationType) {
      case "lodging_room_cabin":
        return {
          maximum_occupancy: 0,
          type_of_bed: "",
          capacity_description: "",
        };
      case "co_living_hostel":
        return {
          room_size: "",
          bed_type: "",
          number_of_beds: 0,
          number_of_bathrooms: 1,
        };
      case "camping_glamping":
        return {
          sleeping_capacity: 0,
        };
      case "rv":
        return {
          level_ground: "",
          access_method: "",
          rv_slidesouts: "",
          ground_surface: "",
          ground_surface_other: "",
          rv_types: [],
          rv_types_other: "",
          max_rv_length: 0,
          max_rv_width: 0,
          turning_radius_warnings: "",
        };
      case "king_stay":
        return {
          area_size_unit: "Feets" as const,
          area_length: 0,
          area_width: 0,
          guest_favourites: "",
        };
      default:
        return {
          site_size: 0,
          type_of_bed: "",
          capacity_description: "",
        };
    }
  }

  // Populate form data when siteData is available in edit mode
  useEffect(() => {
    if (isEditMode && siteData?.capacity) {
      const defaultValues = getDefaultValuesForAccommodationType(
        accommodationType || null
      );

      // Map backend data to form fields based on accommodation type
      const mappedData = {
        site_id: siteId,
        ...defaultValues,
        ...mapBackendDataToFormFields(
          siteData.capacity,
          accommodationType || null
        ),
      };

      reset(mappedData);
    }
  }, [siteData, isEditMode, reset, accommodationType, siteId]);

  // Map backend data to form fields
  function mapBackendDataToFormFields(
    capacityData: any,
    accommodationType: string | null
  ) {
    switch (accommodationType) {
      case "lodging_room_cabin":
        return {
          maximum_occupancy: capacityData.maximum_occupancy || 0,
          type_of_bed: capacityData.type_of_bed || "",
          capacity_description: capacityData.capacity_description || "",
        };
      case "co_living_hostel":
        return {
          room_size: capacityData.room_size || "",
          bed_type: capacityData.bed_type || "",
          number_of_beds: capacityData.number_of_beds || 0,
          number_of_bathrooms: capacityData.number_of_bathrooms || 1,
        };
      case "camping_glamping":
        return {
          sleeping_capacity: capacityData.sleeping_capacity || 0,
        };
      case "rv":
        return {
          level_ground: capacityData.level_ground || "",
          access_method: capacityData.access_method || "",
          rv_slidesouts: capacityData.rv_slidesouts || "",
          ground_surface: capacityData.ground_surface || "",
          ground_surface_other: capacityData.ground_surface_other || "",
          rv_types: capacityData.rv_types || [],
          rv_types_other: capacityData.rv_types_other || "",
          max_rv_length: capacityData.max_rv_length || 0,
          max_rv_width: capacityData.max_rv_width || 0,
          turning_radius_warnings: capacityData.turning_radius_warnings || "",
        };
      case "king_stay":
        return {
          area_size_unit: capacityData.area_size_unit || "Feets",
          area_length: capacityData.area_length || 0,
          area_width: capacityData.area_width || 0,
          guest_favourites: capacityData.guest_favourites || "",
        };
      default:
        return {
          site_size: capacityData.site_size || 0,
          type_of_bed: capacityData.type_of_bed || "",
          capacity_description: capacityData.capacity_description || "",
        };
    }
  }

  const [dataSent, setDataSent] = useState(false);

  const onSubmit = async (data: SiteCapacityFormData) => {
    try {
      const formData = new FormData();

      // Always include site_id
      formData.append("site_id", data.site_id);

      // Add fields based on accommodation type
      switch (accommodationType) {
        case "lodging_room_cabin":
          if (data.maximum_occupancy !== undefined) {
            formData.append(
              "maximum_occupancy",
              data.maximum_occupancy.toString()
            );
          }
          if (data.type_of_bed) {
            formData.append("type_of_bed", data.type_of_bed);
          }
          if (data.capacity_description) {
            formData.append("capacity_description", data.capacity_description);
          }
          break;
        case "co_living_hostel":
          if (data.room_size) {
            formData.append("room_size", data.room_size);
          }
          if (data.bed_type) {
            formData.append("bed_type", data.bed_type);
          }
          if (data.number_of_beds !== undefined) {
            formData.append("number_of_beds", data.number_of_beds.toString());
          }
          if (data.number_of_bathrooms !== undefined) {
            formData.append(
              "number_of_bathrooms",
              data.number_of_bathrooms.toString()
            );
          }
          break;
        case "camping_glamping":
          if (data.sleeping_capacity !== undefined) {
            formData.append(
              "sleeping_capacity",
              data.sleeping_capacity.toString()
            );
          }
          break;
        case "rv":
          if (data.level_ground) {
            formData.append("level_ground", data.level_ground);
          }
          if (data.access_method) {
            formData.append("access_method", data.access_method);
          }
          if (data.rv_slidesouts) {
            formData.append("rv_slidesouts", data.rv_slidesouts);
          }
          if (data.ground_surface) {
            formData.append("ground_surface", data.ground_surface);
          }
          if (data.ground_surface_other) {
            formData.append("ground_surface_other", data.ground_surface_other);
          }
          if (data.rv_types && data.rv_types.length > 0) {
            formData.append("rv_types", JSON.stringify(data.rv_types));
          }
          if (data.rv_types_other) {
            formData.append("rv_types_other", data.rv_types_other);
          }
          if (data.max_rv_length !== undefined) {
            formData.append("max_rv_length", data.max_rv_length.toString());
          }
          if (data.max_rv_width !== undefined) {
            formData.append("max_rv_width", data.max_rv_width.toString());
          }
          if (data.turning_radius_warnings) {
            formData.append(
              "turning_radius_warnings",
              data.turning_radius_warnings
            );
          }
          break;
        case "king_stay":
          if (data.area_size_unit) {
            formData.append("area_size_unit", data.area_size_unit);
          }
          if (data.area_length !== undefined) {
            formData.append("area_length", data.area_length.toString());
          }
          if (data.area_width !== undefined) {
            formData.append("area_width", data.area_width.toString());
          }
          if (data.guest_favourites) {
            formData.append("guest_favourites", data.guest_favourites);
          }
          break;
        default:
          if (data.site_size !== undefined) {
            formData.append("site_size", data.site_size.toString());
          }
          if (data.type_of_bed) {
            formData.append("type_of_bed", data.type_of_bed);
          }
          if (data.capacity_description) {
            formData.append("capacity_description", data.capacity_description);
          }
          break;
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
      setDataSent(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleSaveClick = async () => {
    // Trigger form validation and submission
    const isValid = await handleSubmit(onSubmit)();
    return isValid;
  };

  const getCapacityForm = () => {
    switch (accommodationType) {
      case "lodging_room_cabin":
        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <GlobalTextInput
                label={
                  <span>
                    Maximum Occupancy<span className="text-red-500">*</span>
                  </span>
                }
                type="number"
                {...register("maximum_occupancy", { valueAsNumber: true })}
                error={errors.maximum_occupancy?.message || undefined}
              />

              <GlobalTextInput
                label={
                  <span>
                    Type of Bed<span className="text-red-500">*</span>
                  </span>
                }
                {...register("type_of_bed")}
                error={errors.type_of_bed?.message || undefined}
              />
            </div>

            <GlobalTextArea
              label={
                <span>
                  Capacity Description<span className="text-red-500">*</span>
                </span>
              }
              {...register("capacity_description")}
              error={errors.capacity_description?.message || undefined}
            />
          </>
        );

      case "co_living_hostel":
        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 justify-end items-end">
              <GlobalTextInput
                label={
                  <span>
                    Room Size<span className="text-red-500">*</span>
                  </span>
                }
                type="text"
                {...register("room_size")}
                error={errors.room_size?.message || undefined}
              />
              <Controller
                name="bed_type"
                control={control}
                render={({ field }) => (
                  <GlobalSelect
                    label={"Bed Types"}
                    className="w-full"
                    {...field}
                    error={errors.bed_type?.message || undefined}
                  >
                    <option value="">Select Bed Type</option>
                    <option value="single">Single Bed</option>
                    <option value="double">King Size</option>
                    <option value="queen">Queen Size</option>
                    <option value="king">Bunk Bed</option>
                  </GlobalSelect>
                )}
              />
              <GlobalTextInput
                label={
                  <span>
                    Number of beds<span className="text-red-500">*</span>
                  </span>
                }
                type="number"
                {...register("number_of_beds", { valueAsNumber: true })}
                error={errors.number_of_beds?.message || undefined}
              />
              <div className="flex items-baseline gap-2 w-full ">
                <label
                  htmlFor="number_of_bathrooms"
                  className="text-[14px] text-[#1C231F] font-medium"
                >
                  Number of Bathrooms
                </label>
                <Controller
                  name="number_of_bathrooms"
                  control={control}
                  render={({ field }) => (
                    <GlobalInputStepper
                      placeholder="Enter a value"
                      value={field.value || 1}
                      onChange={(value) => field.onChange(value)}
                      max={10}
                      min={1}
                    />
                  )}
                />
              </div>
            </div>
          </>
        );
      case "camping_glamping":
        return (
          <>
            <div className="w-full md:max-w-[70%] lg:max-w-[50%]">
              <div className="mt-4">
                <label
                  htmlFor="how_many_sites"
                  className="text-[#1C231F] text-[14px] font-medium"
                >
                  What's the total sleeping capacity in terms of persons per
                  site?
                </label>
                <div className="mt-2">
                  <Controller
                    name="sleeping_capacity"
                    control={control}
                    render={({ field }) => (
                      <GlobalInputStepper
                        placeholder="Capacity"
                        value={field.value || 0}
                        onChange={(value) => field.onChange(value)}
                        className="max-w-[260px]"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </>
        );
      case "rv":
        return (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 p-2 md:p-4 border-b border-black">
              <div>
                <div>
                  <label
                    htmlFor=""
                    className="text-[12px] md:text-[14px] text-[#1C231F] font-medium"
                  >
                    Does this site have level ground?
                  </label>
                  <Controller
                    name="level_ground"
                    control={control}
                    render={({ field }) => (
                      <GlobalRadioGroup
                        options={[
                          { label: "Yes", value: "yes" },
                          { label: "No", value: "no" },
                          {
                            label: "RV requires levelling",
                            value: "rv_requires_levelling",
                          },
                        ]}
                        value={field.value || ""}
                        onChange={field.onChange}
                        name="level_ground"
                      />
                    )}
                  />
                </div>
                <div className="mt-4">
                  <label
                    htmlFor=""
                    className="text-[12px] md:text-[14px] text-[#1C231F] font-medium"
                  >
                    How do guests access this site?
                  </label>
                  <Controller
                    name="access_method"
                    control={control}
                    render={({ field }) => (
                      <GlobalRadioGroup
                        options={[
                          { label: "Pull in", value: "pull_in" },
                          { label: "Pull through", value: "pull_through" },
                          {
                            label: "Back in",
                            value: "back_in",
                          },
                        ]}
                        value={field.value || ""}
                        onChange={field.onChange}
                        name="access_method"
                      />
                    )}
                  />
                </div>
                <div className="mt-4">
                  <label
                    htmlFor=""
                    className="text-[12px] md:text-[14px] text-[#1C231F] font-medium"
                  >
                    Can this site accommodate RV Slidesouts?
                  </label>
                  <Controller
                    name="rv_slidesouts"
                    control={control}
                    render={({ field }) => (
                      <GlobalRadioGroup
                        options={[
                          { label: "Yes", value: "yes" },
                          { label: "No", value: "no" },
                        ]}
                        value={field.value || ""}
                        onChange={field.onChange}
                        name="rv_slidesouts"
                      />
                    )}
                  />
                </div>
              </div>
              <div>
                <div>
                  <label
                    htmlFor=""
                    className="text-[12px] md:text-[14px] text-[#1C231F] font-medium"
                  >
                    What type of ground surface is at this site?
                  </label>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: "Concrete", value: "concrete" },
                      { label: "Loose gravel", value: "loose_gravel" },
                      { label: "Grass", value: "grass" },
                      { label: "Dirt", value: "dirt" },
                    ].map((item, i) => (
                      <label
                        key={i}
                        className={`flex items-center gap-2 cursor-pointer text-[12px] md:text-[14px]`}
                      >
                        <input
                          type="radio"
                          className="accent-[#275BD3] w-4 h-4"
                          {...register("ground_surface")}
                          value={item.value}
                        />
                        {item.label}
                      </label>
                    ))}
                    <div className="flex items-center gap-2">
                      <label
                        className={`flex items-center gap-2 cursor-pointer text-[12px] md:text-[14px]`}
                      >
                        <input
                          type="radio"
                          className="accent-[#275BD3] w-4 h-4"
                          {...register("ground_surface")}
                          value="other"
                        />
                        Other
                      </label>
                      <input
                        type="text"
                        className="border border-[#ADADAD6E] rounded outline-0 px-2"
                        {...register("ground_surface_other")}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    htmlFor=""
                    className="text-[12px] md:text-[14px] text-[#1C231F] font-medium"
                  >
                    What RV type does this site accommodate?
                  </label>
                  <div className="flex items-center gap-4 flex-wrap mt-2">
                    {[
                      { label: "Travel trailer", value: "travel_trailer" },
                      { label: "Fifth wheel", value: "fifth_wheel" },
                      { label: "Toy hauler", value: "toy_hauler" },
                      { label: "Pop-up camper", value: "pop_up_camper" },
                      { label: "Class A", value: "class_a" },
                      { label: "Class B", value: "class_b" },
                      { label: "Class C", value: "class_c" },
                      { label: "Campervan", value: "campervan" },
                      { label: "Car", value: "car" },
                    ].map((item, i) => (
                      <label
                        key={i}
                        className={`flex items-center gap-2 cursor-pointer text-[12px] md:text-[14px]`}
                      >
                        <input
                          type="checkbox"
                          className="accent-[#275BD3] w-4 h-4"
                          {...register("rv_types")}
                          value={item.value}
                        />
                        {item.label}
                      </label>
                    ))}
                    <div className="flex items-center gap-2">
                      <label
                        className={`flex items-center gap-2 cursor-pointer text-[12px] md:text-[14px]`}
                      >
                        <input
                          type="checkbox"
                          className="accent-[#275BD3] w-4 h-4"
                          {...register("rv_types")}
                          value="other"
                        />
                        Other
                      </label>
                      <input
                        type="text"
                        className="border border-[#ADADAD6E] rounded outline-0 px-2"
                        {...register("rv_types_other")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6 p-2 md:p-4 ">
              <div>
                <label
                  htmlFor=""
                  className="text-[12px] md:text-[14px] text-[#1C231F] font-medium"
                >
                  What is the maximum RV length this site can accommodate?
                </label>
                <GlobalTextInput
                  label="RV length"
                  type="number"
                  className="-mt-2"
                  {...register("max_rv_length", { valueAsNumber: true })}
                  error={errors.max_rv_length?.message || undefined}
                />
              </div>
              <div>
                <label
                  htmlFor=""
                  className="text-[12px] md:text-[14px] text-[#1C231F] font-medium"
                >
                  What is the maximum RV width this site can accommodate?
                </label>
                <GlobalTextInput
                  label="RV Width"
                  type="number"
                  className="-mt-2"
                  {...register("max_rv_width", { valueAsNumber: true })}
                  error={errors.max_rv_width?.message || undefined}
                />
              </div>
              <div>
                <label
                  htmlFor=""
                  className="text-[12px] md:text-[14px] text-[#1C231F] font-medium"
                >
                  What are the Turning Radius / Clearance Warnings of this site?
                </label>
                <GlobalTextInput
                  label="Turning Radius / Clearance Warnings"
                  type="text"
                  className="-mt-2"
                  {...register("turning_radius_warnings")}
                  error={errors.turning_radius_warnings?.message || undefined}
                />
              </div>
            </div>
          </div>
        );
      case "king_stay":
        return (
          <div>
            <label className="text-[12px] md:text-[14px] text-[#1C231F] font-bold mb-3 block">
              Area Size
            </label>
            <div className="">
              <div className="flex items-center gap-2">
                <div
                  onClick={() => {
                    setAreaSizeType("Meters");
                    setValue("area_size_unit", "Meters");
                  }}
                  className={`py-2 px-6 text-[12px] text-[#1C231F] font-[600] border rounded-[5px] cursor-pointer ${
                    areaSizeType === "Meters"
                      ? "bg-[#237AFC] text-white border-[237AFC]"
                      : "border-[#848484]"
                  }`}
                >
                  Meters
                </div>
                <div
                  onClick={() => {
                    setAreaSizeType("Feets");
                    setValue("area_size_unit", "Feets");
                  }}
                  className={`py-2 px-6 text-[12px] text-[#1C231F] font-[600] border rounded-[5px] cursor-pointer ${
                    areaSizeType === "Feets"
                      ? "bg-[#237AFC] text-white border-[#237AFC]"
                      : "border-[#848484]"
                  }`}
                >
                  Feets
                </div>
              </div>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                <GlobalTextInput
                  label={areaSizeType}
                  type="number"
                  {...register("area_length", { valueAsNumber: true })}
                  error={errors.area_length?.message || undefined}
                />
                <GlobalTextInput
                  label="Enter length"
                  type="number"
                  {...register("area_length", { valueAsNumber: true })}
                  error={errors.area_length?.message || undefined}
                />
                <GlobalTextInput
                  label="Enter width"
                  type="number"
                  {...register("area_width", { valueAsNumber: true })}
                  error={errors.area_width?.message || undefined}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-[12px] md:text-[14px] text-[#1C231F] font-bold  block">
                Tell us about guest favourites?
              </label>
              <GlobalTextArea
                label="Lodging Room/Cabin"
                className=""
                {...register("guest_favourites")}
                error={errors.guest_favourites?.message || undefined}
              />
            </div>
          </div>
        );
      default:
        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <GlobalTextInput
                label={
                  <span>
                    Site Size<span className="text-red-500">*</span>
                  </span>
                }
                type="number"
                {...register("site_size", { valueAsNumber: true })}
                error={errors.site_size?.message || undefined}
              />

              <GlobalTextInput
                label={
                  <span>
                    Type of Bed<span className="text-red-500">*</span>
                  </span>
                }
                {...register("type_of_bed")}
                error={errors.type_of_bed?.message || undefined}
              />
            </div>

            <GlobalTextArea
              label={
                <span>
                  Capacity Description<span className="text-red-500">*</span>
                </span>
              }
              {...register("capacity_description")}
              error={errors.capacity_description?.message || undefined}
            />
          </>
        );
    }
  };

  return (
    <div>
      <h4 className="text-[14px] md:text-[16px] text-[#1C231F] font-semibold">
        Site Capacity
      </h4>
      <div className="mt-4">
        <div className="border border-[#E1E1E1] bg-white p-2 md:p-4 rounded-[7px]">
          {getCapacityForm()}

          {/* Submit Button */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSaveClick}
              disabled={isSubmitting}
              className={` w-[158px] mt-2 h-[35px] font-[500] text-[14px] text-white px-4 md:px-10 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                dataSent ? "bg-[#237AFC]" : "bg-[#BABBBC]"
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
}
