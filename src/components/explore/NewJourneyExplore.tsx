import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GlobalModalBorderLess from "../global/GlobalModalBorderLess";
import GlobalTextInput from "../global/GlobalTextInput";
import GlobalSelect from "../global/GlobalSelect";
import GlobalDateInput from "../global/GlobalDateInput";
import Location from "../dashboard/svgs/Location";

// Zod validation schema
const journeyFormSchema = z
  .object({
    journeyName: z
      .string()
      .min(1, "Journey name is required")
      .min(3, "Journey name must be at least 3 characters")
      .max(50, "Journey name must be less than 50 characters"),
    startingPoint: z
      .string()
      .min(1, "Starting point is required")
      .min(2, "Starting point must be at least 2 characters"),
    endPoint: z
      .string()
      .min(1, "End point is required")
      .min(2, "End point must be at least 2 characters"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    who: z.string().min(1, "Please select who is traveling"),
    budget: z
      .string()
      .min(1, "Budget is required")
      .regex(/^\d+$/, "Budget must be a number"),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        return endDate > startDate;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

type JourneyFormData = z.infer<typeof journeyFormSchema>;

export default function NewJourneyExplore({
  newJourney,
  setNewJourney,
}: {
  newJourney: boolean;
  setNewJourney: (newJourney: boolean) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<JourneyFormData>({
    resolver: zodResolver(journeyFormSchema),
    defaultValues: {
      journeyName: "",
      startingPoint: "",
      endPoint: "",
      startDate: "",
      endDate: "",
      who: "",
      budget: "",
    },
  });

  const onSubmit = async (data: JourneyFormData) => {
    try {
      console.log("Creating journey:", data);
      // Here you would typically make an API call
      // await createJourney(data);

      // Reset form and close modal
      reset();
      setNewJourney(false);
    } catch (error) {
      console.error("Error creating journey:", error);
    }
  };

  const handleClose = () => {
    reset();
    setNewJourney(false);
  };

  return (
    <div>
      <GlobalModalBorderLess
        isOpen={newJourney}
        onClose={handleClose}
        maxWidth="max-w-[900px]"
        customPadding="p-0"
      >
        <div
          className="min-h-[80vh] overflow-y-scroll w-full
        [&::-webkit-scrollbar]:w-1
       [&::-webkit-scrollbar-track]:bg-[#1063E0]
       [&::-webkit-scrollbar-thumb]:bg-[#D9D9D9] 
       dark:[&::-webkit-scrollbar-track]:bg-[#D9D9D9]
       dark:[&::-webkit-scrollbar-thumb]:bg-[#1063E0]
        "
        >
          <div className="grid grid-cols-1 lg:grid-cols-2  h-full rounded-lg">
            {/* Left Section - Image */}
            <div
              className="relative bg-cover bg-center rounded-l-lg"
              style={{
                backgroundImage: `url(https://res.cloudinary.com/dtfzklzek/image/upload/v1755211203/794_1_x4c1uv.png)`,
              }}
            >
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-l-lg"></div>

              {/* Text overlay */}
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-2xl font-bold mb-1">Start New January</h2>
                <p className="text-sm opacity-90">5 Days - 4 Travelers</p>
              </div>
            </div>

            {/* Right Section - Form */}
            <div className="p-6 flex flex-col rounded-r-lg bg-white">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Start New January
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 flex-1"
              >
                <GlobalTextInput
                  label="January Name"
                  placeholder="Enter journey name"
                  error={errors.journeyName?.message}
                  {...register("journeyName")}
                />

                <div className="relative">
                  <GlobalTextInput
                    label="Starting Point"
                    placeholder="Enter starting location"
                    error={errors.startingPoint?.message}
                    {...register("startingPoint")}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Location className="text-gray-400" />
                  </div>
                </div>

                <div className="relative">
                  <GlobalTextInput
                    label="End Point"
                    placeholder="Enter destination"
                    error={errors.endPoint?.message}
                    {...register("endPoint")}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Location className="text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <GlobalDateInput
                      label="Start Date"
                      placeholder="Select date"
                      error={errors.startDate?.message}
                      {...register("startDate")}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-400"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                  </div>

                  <div className="relative">
                    <GlobalDateInput
                      label="End Date"
                      placeholder="Select date"
                      error={errors.endDate?.message}
                      {...register("endDate")}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-400"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                  </div>
                </div>

                <GlobalSelect
                  label="Who"
                  error={errors.who?.message}
                  {...register("who")}
                >
                  <option value="">Select travelers</option>
                  <option value="solo">Solo Traveler</option>
                  <option value="couple">Couple</option>
                  <option value="family">Family</option>
                  <option value="group">Group</option>
                </GlobalSelect>

                <div className="relative">
                  <GlobalTextInput
                    label="Budget"
                    placeholder="Enter budget"
                    error={errors.budget?.message}
                    {...register("budget")}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-gray-400"
                    >
                      <circle cx="12" cy="8" r="7"></circle>
                      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"></path>
                    </svg>
                  </div>
                </div>

                {/* Create Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 mt-6 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </GlobalModalBorderLess>
    </div>
  );
}
