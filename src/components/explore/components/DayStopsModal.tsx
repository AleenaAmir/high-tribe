"use client";
import React, { useEffect, useState } from "react";
import DayStopCard from "./DayStopCard";
import GlobalModalBorderLess from "@/components/global/GlobalModalBorderLess";
import LocationMap from "@/components/global/LocationMap";
import DeleteModal from "./DeleteModat";
import StopModal from "../StopModal";
import { apiRequest } from "@/lib/api";
import { toast } from "react-hot-toast";

interface DayStopsModalProps {
  open: boolean;
  onClose: () => void;
  dayStops: any[];
  dayNumber: number | null;
  journeyName: string;
  journeyId?: number;
  formattedDate?: string;
  onStopDeleted?: () => void;
  onStopAdded?: () => void;
  onStopUpdated?: () => void;
}

export default function DayStopsModal({
  open,
  onClose,
  dayStops,
  dayNumber,
  journeyName,
  journeyId,
  formattedDate,
  onStopDeleted,
  onStopAdded,
  onStopUpdated,
}: DayStopsModalProps) {
  // Local state to manage stops
  const [localDayStops, setLocalDayStops] = useState<any[]>([]);

  const [selectedLocation, setSelectedLocation] = useState<{
    coords: [number, number] | null;
    name: string;
  }>({
    coords: null,
    name: "",
  });

  // Sync local state with prop
  useEffect(() => {
    console.log("DayStopsModal: dayStops prop updated:", dayStops);
    console.log("DayStopsModal: dayStops length:", dayStops?.length);
    console.log("DayStopsModal: formattedDate:", formattedDate);
    console.log("DayStopsModal: dayStops is array:", Array.isArray(dayStops));
    setLocalDayStops(dayStops || []);
  }, [dayStops, formattedDate]);

  console.log(dayStops, "dayStops----0-00-00-0-0-0-0--00-0-0-");
  const handleLocationSelect = (coords: [number, number], name: string) => {
    setSelectedLocation({ coords, name });
  };

  const pad2 = (n: number) => String(n).padStart(2, "0");
  const formatRange = (date?: string, endDate?: string) => {
    const fmt = (d?: string) =>
      d
        ? new Date(d).toLocaleDateString(undefined, {
          day: "2-digit",
          month: "short",
        })
        : "";
    const start = fmt(date);
    const end = fmt(endDate || date);
    return start && end ? `${start} \u2192 ${end}` : start || end || "";
  };

  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedStop, setSelectedStop] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Stop modal states
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [stopModalMode, setStopModalMode] = useState<"add" | "edit">("add");
  const [stopModalData, setStopModalData] = useState<any>(null);

  const handleDeleteStop = async () => {
    if (!selectedStop || !journeyId) {
      toast.error("Missing stop or journey data");
      return;
    }

    setIsDeleting(true);
    try {
      await apiRequest(
        `journeys/${journeyId}/stops/${selectedStop.id}`,
        {
          method: "DELETE",
        },
        "Stop deleted successfully!"
      );

      // Call the callback to refresh the data
      if (onStopDeleted) {
        console.log("DayStopsModal: Calling onStopDeleted callback");
        onStopDeleted();
      }

      setOpenConfirm(false);
      setSelectedStop(null);
    } catch (error) {
      console.error("Failed to delete stop:", error);
      toast.error("Failed to delete stop. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddStop = () => {
    setStopModalMode("add");
    setStopModalData(null);
    setIsStopModalOpen(true);
  };

  const handleEditStop = (stop: any) => {
    setStopModalMode("edit");
    setStopModalData(stop);
    setIsStopModalOpen(true);
  };

  const handleStopModalClose = () => {
    setIsStopModalOpen(false);
    setStopModalData(null);
  };

  const handleStopAdded = () => {
    // Close the stop modal first
    handleStopModalClose();

    if (onStopAdded) {
      onStopAdded();
    }
  };

  const handleStopUpdated = () => {
    // Close the stop modal first
    handleStopModalClose();

    if (onStopUpdated) {
      onStopUpdated();
    }
  };

  return (
    <div>
      <GlobalModalBorderLess
        isOpen={open}
        onClose={onClose}
        maxWidth="max-w-[949px]"
        customPadding="p-0"
      >
        <div className="overflow-hidden w-full rounded-[20px] h-[80vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full rounded-lg">
            {/* Left: Stops List */}
            <div className="flex flex-col bg-white h-full">
              <div className="flex justify-center items-center p-6 border-b border-gray-200">
                <h2 className="text-[22px]  text-[#424242] leading-[100%] font-medium font-gilroy text-center">
                  {journeyName}
                </h2>
              </div>
              <div className="flex  justify-between  p-6 border-b border-gray-200">
                <h3 className="text-[14px] font-medium font-gilroy ">
                  Day {dayNumber}
                </h3>
                <div className="flex gap-2">
                  {/* Test button to add sample stops */}

                  <button
                    onClick={handleAddStop}
                    className="text-[16px] font-medium font-gilroy  flex items-center gap-2  text-[#0000000]  transition-colors"
                  >
                    <span className="text-[14px] font-medium font-gilroy bg-[#9743AA] text-white p-1 w-8 h-8 flex items-center justify-center rounded-full transition-colors">
                      +
                    </span>
                    Add Stop
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto space-y-3 h-full">
                {localDayStops.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    <span>No stops for this day yet. Add your first stop!</span>
                  </div>
                ) : (
                  localDayStops.map((stop, index) => (
                    <DayStopCard
                      key={stop.id}
                      dayNumber={pad2(index + 1)}
                      title={stop.location_name || stop.title || "Untitled"}
                      subtitle={formatRange(stop.date, stop.end_date)}
                      onEdit={() => handleEditStop(stop)}
                      onDelete={() => {
                        setSelectedStop(stop);
                        setOpenConfirm(true);
                      }}
                      pad2={pad2}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Right: Map */}
            <div className="bg-gray-100 h-full relative">
              <LocationMap
                location={selectedLocation}
                onLocationSelect={handleLocationSelect}
                markerColor="#9743AA"
                stops={localDayStops}
                showRoute={true}
              />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors z-10"
                type="button"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </GlobalModalBorderLess>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={openConfirm}
        title="Do you want to Delete this"
        message="Stop?"
        onCancel={() => {
          setOpenConfirm(false);
          setSelectedStop(null);
        }}
        onConfirm={handleDeleteStop}
        isLoading={isDeleting}
      />

      {/* Stop Modal for Add/Edit */}
      <StopModal
        open={isStopModalOpen}
        onClose={handleStopModalClose}
        mode={stopModalMode}
        dayIndex={0}
        journeyData={{ id: journeyId }}
        formattedDate={formattedDate || ""}
        dayNumber={dayNumber}
        stopData={stopModalData}
        onStopAdded={handleStopAdded}
        onStopUpdated={handleStopUpdated}
      />
    </div>
  );
}
