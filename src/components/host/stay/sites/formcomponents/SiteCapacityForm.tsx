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
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GlobalTextArea from "@/components/global/GlobalTextArea";
import GlobalTextInput from "@/components/global/GlobalTextInput";
import { apiFormDataWrapper } from "@/lib/api";
import { toast } from "react-hot-toast";
import GlobalInputStepper from "@/components/global/GlobalInputStepper";
import GlobalSelect from "@/components/global/GlobalSelect";

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
          <p className="text-[12px] md:text-[14px] text-[#1C231F] font-bold">
            What is the capacity and details of this site?
          </p>

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
