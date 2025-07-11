import GlobalModal from "@/components/global/GlobalModal";
import Image from "next/image";
import React, { useState } from "react";
import NewJourney from "../components/newjourney/NewJourney";
import ExistingJourneyComponent from "../components/newjourney/ExistingJourney";

const MainJourney = ({
  journyMap,
  setJournyMap,
}: {
  journyMap: boolean;
  setJournyMap: (value: boolean) => void;
}) => {
  const [newJournyMap, setNewJournyMap] = useState<boolean>(false);
  const [existingJournyMap, setExistingJournyMap] = useState<boolean>(false);
  return (
    <>
      <GlobalModal
        isOpen={journyMap}
        onClose={() => setJournyMap(false)}
        maxWidth="max-w-[490px]"
      >
        <div className="text-center text-[18px] md:text-[22px] font-bold">
          Journey Mapping
        </div>
        <div className="grid grid-cols-2 gap-6 justify-center mt-4">
          <button
            className="flex flex-col items-center justify-between border-2 cursor-pointer border-gray-300 rounded-xl p-6 hover:border-blue-500 transition"
            onClick={() => {
              setNewJournyMap(true);
              setJournyMap(false);
            }}
          >
            <Image
              src={
                "https://res.cloudinary.com/dtfzklzek/image/upload/v1751667887/3687831-adventure-journey-location-map_108802_2_1_k3banw.svg"
              }
              alt="new journey"
              width={84}
              height={84}
              className="w-[48px] object-contain md:w-[84px]"
            />
            <span className="text-[12px] md:text-[16px]">New Journey</span>
          </button>

          <button
            className="flex flex-col items-center border-2 cursor-pointer border-gray-300 rounded-xl p-6 hover:border-blue-500 transition"
            onClick={() => {
              setExistingJournyMap(true);
              setJournyMap(false);
            }}
          >
            <Image
              src={
                "https://res.cloudinary.com/dtfzklzek/image/upload/v1751667876/journey_transportation_adventure_travel_traveling_bus_icon_260842_1_z3sdj3.svg"
              }
              alt="Existing journey"
              width={96}
              height={96}
              className="w-[56px] object-contain md:w-[96px]"
            />
            <span className="text-[12px] md:text-[16px]">Existing Journey</span>
          </button>
        </div>
      </GlobalModal>
      <GlobalModal
        isOpen={newJournyMap}
        onClose={() => setNewJournyMap(false)}
        maxWidth="max-w-[1200px]"
        customPadding="p-0"
      >
        <NewJourney />
      </GlobalModal>
      <GlobalModal
        isOpen={existingJournyMap}
        onClose={() => setExistingJournyMap(false)}
        maxWidth="max-w-[1200px]"
        customPadding="p-0"
      >
        <ExistingJourneyComponent />
      </GlobalModal>
    </>
  );
};

export default MainJourney;
