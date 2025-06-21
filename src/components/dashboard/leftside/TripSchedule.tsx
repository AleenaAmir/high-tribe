import React from "react";
import Image from "next/image";

type TripScheduleProps = {
  mapImageUrl: string;
  onShareTrip?: () => void;
  onCreateTrip?: () => void;
};

const TripSchedule: React.FC<TripScheduleProps> = ({
  mapImageUrl,
  onShareTrip,
  onCreateTrip,
}) => (
  <div className="bg-white rounded-xl shadow-sm p-4">
    <div className="flex justify-between items-center mb-3">
      <div className="font-semibold text-gray-800 text-lg">Trip Schedule</div>
      <div className="space-x-2">
        <button
          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium"
          onClick={onShareTrip}
        >
          Share Trip
        </button>
        <button
          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium"
          onClick={onCreateTrip}
        >
          Create Trip
        </button>
      </div>
    </div>
    <Image
      src={mapImageUrl}
      alt="Trip Map"
      width={600}
      height={250}
      className="w-full rounded-lg object-cover"
    />
  </div>
);

export default TripSchedule;
