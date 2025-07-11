import React, { useState } from "react";
import { ExistingJourneyListItem } from "./types";
import { MOCK_JOURNEY_LIST } from "./constants";

interface ExistingJourneySelectorProps {
  selectedJourneyId: string | null;
  onJourneySelect: (journeyId: string) => void;
}

export default function ExistingJourneySelector({
  selectedJourneyId,
  onJourneySelect,
}: ExistingJourneySelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [journeys] = useState<ExistingJourneyListItem[]>(MOCK_JOURNEY_LIST);

  const filteredJourneys = journeys.filter(
    (journey) =>
      journey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journey.startLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journey.endLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "planned":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[#D9D9D9]">
        <h4 className="text-[18px] md:text-[22px] text-[#111111] font-bold text-center mb-2">
          Select your Journey
        </h4>
        <p className="text-[10px] text-[#706F6F] text-center mb-4">
          Choose a journey to continue or add new steps
        </p>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search journeys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Journey List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredJourneys.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-[12px]">No journeys found</p>
            <p className="text-[10px]">Try a different search term</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredJourneys.map((journey) => (
              <div
                key={journey.id}
                onClick={() => onJourneySelect(journey.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedJourneyId === journey.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {/* Journey Title */}
                <div className="flex items-start justify-between mb-2">
                  <h5 className="text-[13px] font-semibold text-gray-900 leading-tight">
                    {journey.title}
                  </h5>
                  <span
                    className={`px-2 py-1 text-[10px] font-medium rounded-full ${getStatusColor(
                      journey.status
                    )}`}
                  >
                    {journey.status}
                  </span>
                </div>

                {/* Route Information */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 flex-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-[11px] text-gray-600 truncate">
                      {journey.startLocation}
                    </span>
                  </div>
                  <div className="text-gray-400">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center gap-1 flex-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-[11px] text-gray-600 truncate">
                      {journey.endLocation}
                    </span>
                  </div>
                </div>

                {/* Date and Steps Info */}
                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  <span>
                    {formatDate(journey.startDate)} -{" "}
                    {formatDate(journey.endDate)}
                  </span>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
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
                    <span>{journey.totalSteps} stops</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
