// "use client";
// import React, { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import GlobalTextArea from "@/components/global/GlobalTextArea";
// import GlobalTextInput from "@/components/global/GlobalTextInput";
// import { apiFormDataWrapper } from "@/lib/api";
// import { toast } from "react-hot-toast";
// import GlobalSelect from "@/components/global/GlobalSelect";
// import GlobalInputStepper from "@/components/global/GlobalInputStepper";

// // Zod validation schema
// const siteCapacitySchema = z.object({
//   siteSize: z.string().min(1, "Site size is required"), // changed to string
//   bed_types: z
//     .string()
//     .min(1, "Total beds is required")
//     .regex(/^[1-9]\d*$/, "Total beds must be a positive integer"),
//   capacityDescription: z.string().min(1, "Capacity description is required"),
//   guest_capacity_max: z.number().min(1, "Capacity is required"),
//   number_of_bathrooms: z.number().min(1, "Number of bathrooms is required"),
// });

// type SiteCapacityFormData = z.infer<typeof siteCapacitySchema>;

// export default function SiteCapacityForm({
//   propertyId,
//   siteId,
//   onSuccess,
//   siteData,
//   isEditMode,
//   accommodationType,
// }: {
//   propertyId: string;
//   siteId: string;
//   onSuccess?: () => void;
//   siteData?: any;
//   isEditMode?: boolean;
//   accommodationType?: string | null;
// }) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//     watch,
//     setValue,
//   } = useForm<SiteCapacityFormData>({
//     resolver: zodResolver(siteCapacitySchema),
//     defaultValues: {
//       siteSize: "",
//       bed_types: "",
//       capacityDescription: "",
//     },
//   });

//   // Populate form data when siteData is available in edit mode
//   useEffect(() => {
//     if (isEditMode && siteData?.capacity) {
//       reset({
//         siteSize: siteData.capacity.site_size || 0,
//         bed_types: siteData.capacity.total_beds?.toString() || "",
//         capacityDescription: siteData.capacity.capacity_description || "",
//       });
//     }
//   }, [siteData, isEditMode, reset]);

//   const onSubmit = async (data: SiteCapacityFormData) => {
//     try {
//       const formData = new FormData();
//       formData.append("site_size", "30x20 ft"); // e.g., "30x20 ft"
//       formData.append("total_beds", data.bed_types.toString()); // e.g., "5"
//       formData.append("site_id", siteId);

//       // Add site_id for edit mode
//       if (isEditMode && siteData?.id) {
//         formData.append("site_id", siteData.id.toString());
//       }

//       const response = (await apiFormDataWrapper(
//         `properties/${propertyId}/sites/capacity`,
//         formData,
//         isEditMode
//           ? "Site capacity updated successfully!"
//           : "Site capacity saved successfully!"
//       )) as Response;

//       //@ts-ignore
//       if (response.message == "Capacity details saved successfully") {
//         toast.success(
//           isEditMode
//             ? "Site capacity updated successfully!"
//             : "Site capacity saved successfully!"
//         );
//       } else {
//         toast.error("Failed to save site capacity");
//       }

//       if (onSuccess) onSuccess();
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     }
//   };

//   const handleSaveClick = async () => {
//     // Trigger form validation and submission
//     const isValid = await handleSubmit(onSubmit)();
//     return isValid;
//   };

//   return (
//     <div>
//       <h4 className="text-[14px] md:text-[16px] text-[#1C231F] font-semibold">
//         Site Capacity
//       </h4>
//       <div className="mt-4">
//         <div className="border border-[#E1E1E1] bg-white p-2 md:p-4 rounded-[7px]">
//           {accommodationType === "lodging_room_cabin" && (
//             <>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
//                 <GlobalTextInput
//                   label={
//                     <span>
//                       Maximum Occupancy<span className="text-red-500">*</span>
//                     </span>
//                   }
//                   type="number"
//                   {...register("guest_capacity_max", { valueAsNumber: true })}
//                   error={errors.guest_capacity_max?.message}
//                 />

//                 <GlobalTextInput
//                   label={
//                     <span>
//                       Type of Bed<span className="text-red-500">*</span>
//                     </span>
//                   }
//                   {...register("bed_types")}
//                   error={errors.bed_types?.message}
//                 />
//               </div>

//               <GlobalTextArea
//                 label={
//                   <span>
//                     Capacity Description<span className="text-red-500">*</span>
//                   </span>
//                 }
//                 {...register("capacityDescription")}
//                 error={errors.capacityDescription?.message}
//               />
//             </>
//           )}

//           {accommodationType === "co_living_hostel" && (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 justify-end items-end">
//               <GlobalTextInput
//                 label={
//                   <span>
//                     Room Size<span className="text-red-500">*</span>
//                   </span>
//                 }
//                 type="text"
//                 {...register("siteSize")}
//                 error={errors.siteSize?.message}
//               />
//               <GlobalSelect label={"Bed Types"} className="w-full">
//                 <option value="">Select Bed Type</option>
//                 <option value="single">Single Bed</option>
//                 <option value="double">King Size</option>
//                 <option value="queen">Queen Size</option>
//                 <option value="king">Bunk Bed</option>
//               </GlobalSelect>
//               <GlobalTextInput
//                 label={
//                   <span>
//                     Number of beds<span className="text-red-500">*</span>
//                   </span>
//                 }
//                 type="number"
//                 {...register("bed_types")}
//                 error={errors.bed_types?.message}
//               />
//               <div className="flex items-baseline gap-2 w-full ">
//                 <label
//                   htmlFor="number_of_bathrooms"
//                   className="text-[14px] text-[#1C231F] font-medium"
//                 >
//                   Number of Bathrooms
//                 </label>
//                 <GlobalInputStepper
//                   placeholder="Enter a value"
//                   value={watch("number_of_bathrooms") || 0}
//                   onChange={(value) => setValue("number_of_bathrooms", value)}
//                   max={10}
//                   min={1}
//                 />
//               </div>
//             </div>
//           )}

//           {/* Submit Button */}
//           <div className="mt-4 flex justify-end">
//             <button
//               type="button"
//               onClick={handleSaveClick}
//               disabled={isSubmitting}
//               className="bg-[#237AFC] w-[158px] mt-2 h-[35px] font-[500] text-[14px] text-white px-4 md:px-10 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Save"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GlobalTextArea from "@/components/global/GlobalTextArea";
import GlobalTextInput from "@/components/global/GlobalTextInput";
import { apiFormDataWrapper } from "@/lib/api";
import { toast } from "react-hot-toast";
import GlobalInputStepper from "@/components/global/GlobalInputStepper";
import GlobalSelect from "@/components/global/GlobalSelect";
import GlobalRadioGroup from "@/components/global/GlobalRadioGroup";

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
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
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

  const [areaSizeType, setAreaSizeType] = useState<"Meters" | "Feets">("Feets");

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
                {...register("siteSize")}
                error={errors.siteSize?.message}
              />
              <GlobalSelect label={"Bed Types"} className="w-full">
                <option value="">Select Bed Type</option>
                <option value="single">Single Bed</option>
                <option value="double">King Size</option>
                <option value="queen">Queen Size</option>
                <option value="king">Bunk Bed</option>
              </GlobalSelect>
              <GlobalTextInput
                label={
                  <span>
                    Number of beds<span className="text-red-500">*</span>
                  </span>
                }
                type="number"
                //  {...register("bed_types")}
                //  error={errors.bed_types?.message}
              />
              <div className="flex items-baseline gap-2 w-full ">
                <label
                  htmlFor="number_of_bathrooms"
                  className="text-[14px] text-[#1C231F] font-medium"
                >
                  Number of Bathrooms
                </label>
                <GlobalInputStepper
                  placeholder="Enter a value"
                  value={0}
                  onChange={() => {}}
                  max={10}
                  min={1}
                />
              </div>
            </div>
          </>
        );
      case "camping_glamping":
        return (
          <>
            <div className="w-full md:max-w-[70%] lg:max-w-[50%]">
              {/* <GlobalSelect
                label={
                  <span>
                    Area Size<span className="text-red-500">*</span>
                  </span>
                }
              >
                <option value="">Select Area Size</option>
                <option value="inches">Inches</option>
                <option value="centimeters">Centimeters</option>
                <option value="meters">Meters</option>
                <option value="feets">Feets</option>
              </GlobalSelect> */}
              <div className="mt-4">
                <label
                  htmlFor="how_many_sites"
                  className="text-[#1C231F] text-[14px] font-medium"
                >
                  What’s the total sleeping capacity in terms of persons per
                  site?
                </label>
                <div className="mt-2">
                  <GlobalInputStepper
                    placeholder="Capacity"
                    value={0}
                    onChange={() => {}}
                    className="max-w-[260px]"
                  />
                </div>
              </div>
              {/* <div className="mt-4">
                <label
                  htmlFor="how_many_sites"
                  className="text-[#1C231F] text-[14px] font-medium"
                >
                  What’s the total sleeping capacity in terms of persons per
                  site?
                </label>
                <div className="mt-2">
                  <GlobalInputStepper
                    placeholder="Capacity"
                    value={0}
                    onChange={() => {}}
                    className="max-w-[260px]"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="how_many_sites"
                  className="text-[#1C231F] text-[14px] font-medium"
                >
                  Could you tell us how many bathrooms are available?
                </label>
                <div className="mt-2">
                  <GlobalInputStepper
                    placeholder="Capacity"
                    value={0}
                    onChange={() => {}}
                    className="max-w-[260px]"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="how_many_sites"
                  className="text-[#1C231F] text-[14px] font-medium"
                >
                  Do guests get a designated spot, or can they pick where to
                  stay?
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <div
                    // onClick={() => setValue("", [""])}
                    className={`py-2 px-6 text-[12px] text-black font-[600] border rounded-[5px] cursor-pointer border-[#848484]`}
                  >
                    Non-Designated camping
                  </div>
                  <div
                    // onClick={() => setValue("", [""])}
                    className={`py-2 px-6 text-[12px] text-black font-[600] border rounded-[5px] cursor-pointer border-[#848484]`}
                  >
                    Designated spot
                  </div>
                </div>
              </div> */}
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
                  <GlobalRadioGroup
                    options={[
                      { label: "Yes", value: "yes" },
                      { label: "No", value: "no" },
                      {
                        label: "RV requires levelling",
                        value: "rv_requires_levelling",
                      },
                    ]}
                    value={"yes"}
                    onChange={() => {}}
                    name="level_ground"
                  />
                </div>
                <div className="mt-4">
                  <label
                    htmlFor=""
                    className="text-[12px] md:text-[14px] text-[#1C231F] font-medium"
                  >
                    How do guests access this site?
                  </label>
                  <GlobalRadioGroup
                    options={[
                      { label: "Pull in", value: "pull_in" },
                      { label: "Pull through", value: "pull_through" },
                      {
                        label: "Back in",
                        value: "back_in",
                      },
                    ]}
                    value={"back_in"}
                    onChange={() => {}}
                    name="level_ground"
                  />
                </div>
                <div className="mt-4">
                  <label
                    htmlFor=""
                    className="text-[12px] md:text-[14px] text-[#1C231F] font-medium"
                  >
                    Can this site accommodate RV Slidesouts?
                  </label>
                  <GlobalRadioGroup
                    options={[
                      { label: "Yes", value: "yes" },
                      { label: "No", value: "no" },
                    ]}
                    value={""}
                    onChange={() => {}}
                    name="level_ground"
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
                        className={`flex items-center gap-2 cursor-pointer text-[12px] md:text-[14px]`}
                      >
                        <input
                          type="radio"
                          className="accent-blue-600 w-4 h-4"
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
                          className="accent-blue-600 w-4 h-4"
                        />
                        Other
                      </label>
                      <input
                        type="text"
                        className="border border-[#ADADAD6E] rounded outline-0 px-2"
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
                        className={`flex items-center gap-2 cursor-pointer text-[12px] md:text-[14px]`}
                      >
                        <input
                          type="checkbox"
                          className="accent-blue-600 w-4 h-4"
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
                          className="accent-blue-600 w-4 h-4"
                        />
                        Other
                      </label>
                      <input
                        type="text"
                        className="border border-[#ADADAD6E] rounded outline-0 px-2"
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
                  type="number"
                  className="-mt-2"
                />
              </div>
            </div>
          </div>
        );
      case "king_size_bed":
        return (
          <div>
            <label className="text-[12px] md:text-[14px] text-[#1C231F] font-bold mb-3 block">
              Area Size
            </label>
            <div className="">
              <div className="flex items-center gap-2">
                <div
                  onClick={() => setAreaSizeType("Meters")}
                  className={`py-2 px-6 text-[12px] text-[#1C231F] font-[600] border rounded-[5px] cursor-pointer ${
                    areaSizeType === "Meters"
                      ? "bg-[#237AFC] text-white border-[237AFC]"
                      : "border-[#848484]"
                  }`}
                >
                  Meters
                </div>
                <div
                  onClick={() => setAreaSizeType("Feets")}
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
                <GlobalTextInput label={areaSizeType} type="number" />
                <GlobalTextInput label="Enter length" type="number" />
                <GlobalTextInput label="Enter width" type="number" />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-[12px] md:text-[14px] text-[#1C231F] font-bold  block">
                Tell us about guest favourites?
              </label>
              <GlobalTextArea label="Lodging Room/Cabin" className="" />
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
          {/* <p className="text-[12px] md:text-[14px] text-[#1C231F] font-bold">
            What is the capacity and details of this site?
          </p> */}

          {getCapacityForm()}

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
