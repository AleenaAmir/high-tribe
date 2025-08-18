"use client"
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GlobalModalBorderLess from "../global/GlobalModalBorderLess";
import GlobalTextInput from "../global/GlobalTextInput";
import GlobalSelect from "../global/GlobalSelect";
import GlobalDateInput from "../global/GlobalDateInput";
import Location from "../dashboard/svgs/Location";
import { toast } from "react-hot-toast";

// ── Validation ────────────────────────────────────────────────────────────────
const journeyFormSchema = z
  .object({
    title: z
      .string()
      .min(3, "Journey name must be at least 3 characters")
      .max(50, "Journey name must be less than 50 characters"),
    startLocationName: z
      .string()
      .min(2, "Starting point must be at least 2 characters"),
    endLocationName: z
      .string()
      .min(2, "End point must be at least 2 characters"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    who: z
      .enum(["solo", "couple", "family", "group"], {
        required_error: "Please select who is traveling",
      })
      .or(z.string().min(1, "Please select who is traveling")),
    budget: z
      .string()
      .min(1, "Budget is required")
      .regex(/^\d+$/, "Budget must be a number"),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return !isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start;
    },
    { message: "End date must be after start date", path: ["endDate"] }
  );

type JourneyFormData = z.infer<typeof journeyFormSchema>;

// ── Component ────────────────────────────────────────────────────────────────
export default function NewJourneyExplore({
  newJourney,
  setNewJourney,
  onJourneyCreated,
}: {
  newJourney: boolean;
  setNewJourney: (v: boolean) => void;
  onJourneyCreated?: (journeyData: JourneyFormData) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<JourneyFormData>({
    resolver: zodResolver(journeyFormSchema),
    defaultValues: {
      title: "",
      startLocationName: "",
      endLocationName: "",
      startDate: "",
      endDate: "",
      who: "",
      budget: "",
    },
  });

  // Debug (remove in production)

  const onSubmit = async (data: JourneyFormData) => {
    debugger
    try {
      // ⚠️ Move these to env/secure storage, not hardcoded
      const API_BASE = "https://api.hightribe.com";
      const TOKEN = typeof window !== "undefined" ? localStorage.getItem("token") || "<PASTE_VALID_TOKEN_HERE>" : "<PASTE_VALID_TOKEN_HERE>";
      console.log(TOKEN, "TOKEN")


      const user_id = localStorage.getItem("user_id");
      // Prepare payload for your API (map to their expected snake_case keys)
      const payload = {
        title: data.title,
        start_location_name: data.startLocationName,
        start_lat: "31.5497", // TODO: replace with geocoded value
        start_lng: "74.3436",
        end_location_name: data.endLocationName,
        end_lat: "36.3167",   // TODO: replace with geocoded value
        end_lng: "74.6500",
        start_date: data.startDate,
        end_date: data.endDate,
        user_id: user_id,         // TODO: replace with actual auth/user context
        budget: data.budget,
        who: data.who,
      };

      const response = await fetch(`${API_BASE}/api/journeys`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.status === 201) {
        toast.success("Journey created successfully!");
      }
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`API request failed: ${response.status} ${response.statusText} ${text}`);
      }

      const result = await response.json();
      // console.log("API response:", result);

      onJourneyCreated?.(data);
      reset();
      setNewJourney(false);
    } catch (err) {
      console.error("Error creating journey:", err);
      // TODO: surface a toast/snackbar
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; // prevent closing while submitting
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
          className="overflow-y-scroll w-full
        [&::-webkit-scrollbar]:w-1
       [&::-webkit-scrollbar-track]:bg-[#1063E0]
       [&::-webkit-scrollbar-thumb]:bg-[#D9D9D9] 
       dark:[&::-webkit-scrollbar-track]:bg-[#D9D9D9]
       dark:[&::-webkit-scrollbar-thumb]:bg-[#1063E0]
        "
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full rounded-lg">
            {/* Left: Visual */}
            <div
              className="relative bg-cover bg-center rounded-l-lg hidden lg:grid"
              style={{
                backgroundImage:
                  "url(https://res.cloudinary.com/dtfzklzek/image/upload/v1755211203/794_1_x4c1uv.png)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-l-lg" />
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-2xl font-bold mb-1">Start New Journey</h2>
                <p className="text-sm opacity-90">5 Days • 4 Travelers</p>
              </div>
            </div>

            {/* Right: Form */}
            <div className="p-6 flex flex-col rounded-r-lg bg-white justify-center h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="text-center">
                  <h2 className="text-[16px] font-semibold">Start New Journey</h2>
                  <p className="text-[10px] leading-relaxed">
                    Plan your next adventure by sharing the details of your trip.
                    Fill in where you’re going, when you’re leaving, and who’s traveling with you.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="w-full relative z-10">
                {/* Title */}
                <GlobalTextInput
                  label="Journey Name"
                  placeholder="Enter journey name"
                  error={errors.title?.message}
                  {...register("title")}
                />

                {/* Start */}
                <div className="relative">
                  <GlobalTextInput
                    label="Starting Point"
                    placeholder="Enter starting location"
                    error={errors.startLocationName?.message}
                    {...register("startLocationName")}
                  />
                  <div className="absolute right-3 top-9">
                    <Location className="text-gray-400" />
                  </div>
                </div>

                {/* End */}
                <div className="relative">
                  <GlobalTextInput
                    label="End Point"
                    placeholder="Enter destination"
                    error={errors.endLocationName?.message}
                    {...register("endLocationName")}
                  />
                  <div className="absolute right-3 top-9">
                    <Location className="text-gray-400" />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <GlobalDateInput
                      label="Start Date"
                      placeholder="Select date"
                      error={errors.startDate?.message}
                      value={watch("startDate")}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setValue("startDate", e.target.value, { shouldValidate: true })
                      }
                    />
                  </div>

                  <div className="relative">
                    <GlobalDateInput
                      label="End Date"
                      placeholder="Select date"
                      error={errors.endDate?.message}
                      value={watch("endDate")}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setValue("endDate", e.target.value, { shouldValidate: true })
                      }
                    />
                  </div>
                </div>

                {/* Who */}
                <GlobalSelect label="Who" error={errors.who?.message} {...register("who")}>
                  <option value="">Select travelers</option>
                  <option value="solo">Solo Traveler</option>
                  <option value="couple">Couple</option>
                  <option value="family">Family</option>
                  <option value="group">Group</option>
                </GlobalSelect>

                {/* Budget */}
                <div className="relative">
                  <GlobalTextInput
                    label="Budget"
                    placeholder="Enter budget"
                    error={errors.budget?.message}
                    {...register("budget")}
                  />
                  <div className="absolute right-3 top-9">
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

                {/* Create */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
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
