import React, { useState } from "react";
import StatsCalanderIcon from "../../svgs/stats/StatsCalanderIcon";

export default function BookingCalanderSideSection() {
  const rates = [
    {
      title: "Enable",
      date: "Rates per night",
    },
    {
      title: "Enable",
      date: "Last-minute minimum rate",
    },
  ];
  const discounts = [
    {
      title: "Enable",
      date: "Weekly",
    },
    {
      title: "Enable",
      date: "Monthly",
    },
    {
      title: "10% off",
      date: "Non-refundable discount",
    },
  ];

  const [tabs, setTabs] = useState<"rates" | "availability">("rates");
  return (
    <div>
      <h3 className="text-[14px] md:text-[16px] font-bold">Settings</h3>

      <div className="flex items-center mt-3 gap-2 border-b-2 border-[#D6D6D6]">
        <button
          type="button"
          className={`md:text-[14px] text-[12px] transition-all duration-300 cursor-pointer translate-y-0.5 border-b-2 p-2 ${
            tabs === "rates" ? " border-black font-bold" : "border-[#D6D6D6]"
          }`}
          onClick={() => setTabs("rates")}
        >
          Rates
        </button>
        <button
          type="button"
          className={`md:text-[14px] text-[12px] transition-all duration-300 cursor-pointer translate-y-0.5 border-b-2 p-2 ${
            tabs === "availability"
              ? " border-black font-bold"
              : "border-[#D6D6D6]"
          }`}
          onClick={() => setTabs("availability")}
        >
          Availability
        </button>
      </div>

      <div className="flex items-center mt-3 gap-2 justify-between">
        <p className="text-[14px]">Rates per night</p>
        <label className="w-12 h-6 relative">
          <input
            type="checkbox"
            className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
            id="custom_switch_checkbox1"
          />
          <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-black before:transition-all before:duration-300"></span>
        </label>
      </div>

      <div>
        <div className="mt-4">
          {rates.map((item, index) => (
            <div
              key={index}
              className="flex items-center w-full justify-between gap-4 mt-2 border border-[#E8E8E8] bg-white rounded-[7px] p-2"
            >
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-[14px] font-bold">{item.title}</p>
                  <p className="text-[12px]">{item.date}</p>
                </div>
              </div>
              <div>
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="9"
                  height="16"
                  fill="none"
                  viewBox="0 0 9 16"
                >
                  <path
                    stroke="#000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 15 7-7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <p className="text-[14px] md:text-[16px] font-bold">Discounts</p>
          <p className="text-[10px] md:text-[12px] font-medium">
            Attract more guests and increase occupancy by offering weekly &
            Monthly stay discounts.
          </p>
        </div>
        <div className="mt-4">
          {discounts.map((item, index) => (
            <div
              key={index}
              className="flex items-center w-full justify-between gap-4 mt-2 border border-[#E8E8E8] bg-white rounded-[7px] p-2"
            >
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-[14px] font-bold">{item.title}</p>
                  <p className="text-[12px]">{item.date}</p>
                </div>
              </div>
              <div>
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="9"
                  height="16"
                  fill="none"
                  viewBox="0 0 9 16"
                >
                  <path
                    stroke="#000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 15 7-7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
