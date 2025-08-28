import React, { useState } from "react";
import Image from "next/image";
import LocationIcon from "../icons/LocationIcon";
import { MdMoreHoriz } from "react-icons/md";

interface JourneyHeaderProps {
  journeyData: any;
  travelerCount: number;
  onEditJourney?: () => Promise<void>;
  onAddPeople?: () => void;
}

const JourneyHeader: React.FC<JourneyHeaderProps> = ({
  journeyData,
  travelerCount,
  onEditJourney,
  onAddPeople,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = async () => {
    if (onEditJourney && !isEditing) {
      setIsEditing(true);
      try {
        await onEditJourney();
      } catch (error) {
        console.error("Error editing journey:", error);
      } finally {
        setIsEditing(false);
      }
    }
  };
  const startDate = journeyData.startDate; // e.g. "2025-08-06"
  const endDate = journeyData.endDate; // e.g. "2025-08-26"

  // Parse safely (avoid TZ shifts by adding midnight time)
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  const startMonth = start.toLocaleString("default", { month: "short" });
  const endMonth = end.toLocaleString("default", { month: "short" });

  // If same month, show once; otherwise show both (e.g., "Jun, Jul")
  const monthLabel =
    startMonth === endMonth ? startMonth : `${startMonth}, ${endMonth}`;

  return (
    <div className="px-3 border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 w-fit rounded-full py-2 px-4">
          <LocationIcon className="w-6 h-6" />
          <h2 className="text-[22px] font-medium text-[#000000] px-2 font-gilroy leading-[100%] tracking-[-3%]">
            {/* Trip to {journeyData.startingPoint} to {journeyData.endPoint} */}
            {journeyData.journeyName}
          </h2>
          {isEditing ? (
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            </div>
          ) : (
            <Image
              src="/dashboard/editpencil.png"
              alt="Edit"
              width={16}
              height={16}
              className="w-5 h-5 cursor-pointer"
              onClick={handleEditClick}
            />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onAddPeople}
              className="flex gap-2 items-center border border-[#B2AFAF] rounded-full p-2 hover:bg-gray-50 transition-colors"
            >
              <Image
                src={"/dashboard/People.svg"}
                alt={"footprint3"}
                width={16}
                height={16}
                className="md:w-[16px] md:h-[16px] w-[12px] h-[12px] "
              />
              <span className="text-[12px] text-[#000000]">Add People</span>
            </button>
            <button className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-[#F4F4F4]">
              <MdMoreHoriz />
            </button>
          </div>
        </div>
      </div>
      <div className="text-[14px] py-2 pt-2 text-[#000000] font-gilroy leading-[100%] tracking-[-3%] ml-5 mb-2 flex items-center gap-3">
        <span className="">{journeyData.startingPoint} </span>
        <span className="">{monthLabel}</span>
        <span className="">{travelerCount} travelers</span>
        {/* <span className="">${journeyData.budget}</span> */}
      </div>
    </div>
  );
};

export default JourneyHeader;
