import React from "react";
import StatsCalanderIcon from "../../svgs/stats/StatsCalanderIcon";

export default function StatsSideSection() {
  const data = [
    {
      title: "Owen Brown",
      date: "Jul 27- 01 2025 (5 night)",
    },
    {
      title: "Tyler jennison",
      date: "Jul 27- 01 2025 (5 night)",
    },
  ];
  return (
    <div>
      <p className="text-[14px] md:text-[16px] font-bold">Upcoming Bookings</p>
      <div className="mt-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 mt-2 border border-[#E8E8E8] bg-white rounded-[7px] p-2"
          >
            <div className="flex items-center gap-2">
              <StatsCalanderIcon className="text-black" />
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
  );
}
