import React from "react";
import { Step } from "./types";
import PlaneIcon from "@/components/dashboard/svgs/PlaneIcon";
import TrainIcon from "@/components/dashboard/svgs/TrainIcon";
import CarIcon from "@/components/dashboard/svgs/CarIcon";
import BusIcon from "@/components/dashboard/svgs/BusIcon";
import WalkIcon from "@/components/dashboard/svgs/WalkIcon";
import BikeIcon from "@/components/dashboard/svgs/BikeIcon";

interface ReadOnlyStepsListProps {
  steps: Step[];
  title?: string;
}

export default function ReadOnlyStepsList({
  steps,
  title = "Previous Steps",
}: ReadOnlyStepsListProps) {
  const renderTravelIcon = (mode: string) => {
    const iconProps = { className: "w-[14px] h-[14px] text-white" };

    switch (mode) {
      case "plane":
        return <PlaneIcon {...iconProps} />;
      case "train":
        return <TrainIcon {...iconProps} />;
      case "car":
        return <CarIcon {...iconProps} />;
      case "bus":
        return <BusIcon {...iconProps} />;
      case "walk":
        return <WalkIcon {...iconProps} />;
      case "bike":
        return <BikeIcon {...iconProps} />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getDateRange = (step: Step) => {
    const start = formatDate(step.startDate);
    const end = formatDate(step.endDate);
    if (start && end) {
      return `${start} - ${end}`;
    }
    return start || end || "";
  };

  if (!steps || steps.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <span className="font-semibold text-[13px]">{title}</span>
        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
          <p className="text-[12px]">No previous steps</p>
          <p className="text-[10px]">
            This journey doesn't have any recorded steps yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[13px]">{title}</span>
        <span className="text-[11px] text-gray-500">{steps.length} steps</span>
      </div>

      {/* Steps List */}
      <div className="flex flex-col gap-3">
        {steps.map((step, index) => (
          <div
            key={`readonly-step-${index}`}
            className="border border-[#E9E5E5] rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 p-4 relative"
          >
            {/* Step Number Badge */}
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
              {index + 1}
            </div>

            {/* Step Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex flex-col">
                  <h6 className="text-[13px] font-semibold text-gray-900">
                    {step.name}
                  </h6>
                  <p className="text-[11px] text-gray-600 truncate max-w-[200px]">
                    {step.location.name}
                  </p>
                </div>
              </div>

              {/* Travel Mode Icon */}
              {step.mediumOfTravel && step.mediumOfTravel !== "info" && (
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  {renderTravelIcon(step.mediumOfTravel)}
                </div>
              )}
            </div>

            {/* Date Range */}
            {getDateRange(step) && (
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-3 h-3 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-[10px] text-gray-600">
                  {getDateRange(step)}
                </span>
              </div>
            )}

            {/* Notes */}
            {step.notes && (
              <div className="bg-white rounded-md p-2 border border-gray-200">
                <p className="text-[11px] text-gray-700">{step.notes}</p>
              </div>
            )}

            {/* Coordinates Display */}
            {step.location.coords && (
              <div className="flex items-center gap-2 mt-2">
                <svg
                  className="w-3 h-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-[9px] text-gray-400 font-mono">
                  {step.location.coords[1].toFixed(4)},{" "}
                  {step.location.coords[0].toFixed(4)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <svg
            className="w-4 h-4 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-[12px] font-semibold text-blue-800">
            Journey Summary
          </span>
        </div>
        <p className="text-[10px] text-blue-700">
          This journey contains {steps.length} recorded step
          {steps.length !== 1 ? "s" : ""}. You can add new steps below to
          continue your journey.
        </p>
      </div>
    </div>
  );
}
