"use client";
import React, { useEffect, useState } from "react";
import DayStopCard from "./DayStopCard";
import GlobalModalBorderLess from "@/components/global/GlobalModalBorderLess";
import LocationMap from "@/components/global/LocationMap";
import DeleteModal from "./DeleteModat";


interface DayStopsModalProps {
    open: boolean;
    onClose: () => void;
    dayStops: any[];
    dayNumber: number | null;
    journeyName: string;
}

export default function DayStopsModal({
    open,
    onClose,
    dayStops,
    dayNumber,
    journeyName,
}: DayStopsModalProps) {
    const [selectedLocation, setSelectedLocation] = useState<{
        coords: [number, number] | null;
        name: string;
    }>({
        coords: null,
        name: "",
    });

    console.log(dayStops, "dayStops----0-00-00-0-0-0-0--00-0-0-");
    const handleLocationSelect = (coords: [number, number], name: string) => {
        setSelectedLocation({ coords, name });
    };

    const pad2 = (n: number) => String(n).padStart(2, "0");
    const formatRange = (date?: string, endDate?: string) => {
        const fmt = (d?: string) =>
            d ? new Date(d).toLocaleDateString(undefined, { day: "2-digit", month: "short" }) : "";
        const start = fmt(date);
        const end = fmt(endDate || date);
        return start && end ? `${start} \u2192 ${end}` : start || end || "";
    };

    const [openConfirm, setOpenConfirm] = useState(false);

    return (
        <div>
            <GlobalModalBorderLess
                isOpen={open}
                onClose={onClose}
                maxWidth="max-w-[949px]"
                customPadding="p-0"
                customHeight="h-[80vh]"
            >
                <div className="overflow-hidden w-full rounded-[20px]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 h-full rounded-lg">
                        {/* Left: Stops List */}
                        <div className="flex flex-col bg-white h-full">
                            <div className="flex justify-center items-center p-6 border-b border-gray-200">
                                <h2 className="text-[22px] font-bold font-gilroy text-center">
                                    {journeyName}
                                </h2>
                            </div>
                            <div className="flex  justify-between  p-6 border-b border-gray-200">
                                <h3 className="text-[14px] font-bold font-gilroy ">
                                    Day {dayNumber}
                                </h3>
                                <button className="text-[12px] font-bold font-gilroy  flex items-center gap-2  text-[#0000000]  transition-colors">
                                    <span className="text-[14px] font-semibold font-gilroy bg-[#9743AA] text-white p-1 w-8 h-8 flex items-center justify-center rounded-full transition-colors">+</span>
                                    Add Stop
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto space-y-3">
                                {dayStops.map((stop, index) => (
                                    <DayStopCard
                                        key={stop.id}
                                        dayNumber={(typeof dayNumber === "number" && dayNumber) || index + 1}
                                        title={stop.location_name || stop.title || "Untitled"}
                                        subtitle={formatRange(stop.date, stop.end_date)}
                                        onEdit={() => {/* open edit for stop */ }}
                                        onDelete={() => setOpenConfirm(true)}
                                        pad2={pad2}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Right: Map */}
                        <div className="bg-gray-100 h-full relative">
                            <LocationMap
                                location={selectedLocation}
                                onLocationSelect={handleLocationSelect}
                                markerColor="#9743AA"
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
            <DeleteModal
                open={openConfirm}
                title="Do you want to Delete this"
                message="Stop?"
                onCancel={() => setOpenConfirm(false)}
                onConfirm={() => {
                    setOpenConfirm(false);
                    // call API to delete, then refresh list
                    // await apiRequest.delete(`/stops/${stop.id}`)
                }}
            />
        </div>
    );
}
