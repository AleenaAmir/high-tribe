import React from "react";
import Image from "next/image";
import LocationIcon from "../icons/LocationIcon";

interface JourneyHeaderProps {
  journeyData: any;
  travelerCount: number;
}

const JourneyHeader: React.FC<JourneyHeaderProps> = ({
  journeyData,
  travelerCount,
}) => {
  return (
    <div className="px-3 pb-2 border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 w-fit rounded-full py-2 px-4">
          <LocationIcon className="w-4 h-4" />
          <h2 className="text-[20px] font-medium text-[#000000] font-gilroy leading-[100%] tracking-[-3%]">
            {/* Trip to {journeyData.startingPoint} to {journeyData.endPoint} */}
            {journeyData.journeyName}
          </h2>
          <Image
            src="/dashboard/Pencil.png"
            alt="Edit"
            width={16}
            height={16}
            className="w-6 h-6 cursor-pointer"
          />
        </div>
        <div>
          <div>
            <button
              type="button"
              className="flex gap-2 items-center border border-[#B2AFAF] rounded-full p-2"
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
          </div>
        </div>
      </div>
      <div className="text-[13px] text-[#000000] font-gilroy leading-[100%] tracking-[-3%] ml-5 mb-2 flex items-center gap-3">
        <span className="">{journeyData.startingPoint} to {journeyData.endPoint}</span>
        <span className="">
          {journeyData.startDate} to {journeyData.endDate}
        </span>
        <span className="">{travelerCount} travelers</span>
        {/* <span className="">${journeyData.budget}</span> */}
      </div>
    </div>
  );
};

export default JourneyHeader;
