import React from "react";
import GlobalSelect from "@/components/global/GlobalSelect";

export default function StatsGraph() {
  // Static data for the chart
  const completedPayments = [0, 0, 0, 0, 950, 1800, 0, 0, 0, 0, 0, 0]; // May, Jun
  const pendingPayments = [0, 0, 0, 0, 0, 0, 320, 120, 0, 0, 0, 0]; // Jul, Sep
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const maxY = 1800;
  return (
    <div className="mt-6">
      <p className="text-[14px] font-bold ">Payments</p>
      <div className="bg-white rounded-xl border border-[#E8E8E8]  w-full mt-6">
        <div className="flex flex-col md:flex-row rounded-t-xl md:items-center md:justify-between p-6 gap-4 mb-4 bg-[#F9F9F9]">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="flex flex-col">
              <span className="text-xs text-[#1179FA] font-medium">
                2025 Completed Payment
              </span>
              <span className="text-2xl md:text-3xl font-bold text-[#1179FA]">
                $2,722.86
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#F28321] font-medium">
                2025 Pending Payment
              </span>
              <span className="text-2xl md:text-3xl font-bold text-[#F28321]">
                $391.77
              </span>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <GlobalSelect className="w-full min-w-[120px]">
              <option>Viewing</option>
              <option>Payments</option>
            </GlobalSelect>
            <GlobalSelect className="w-full min-w-[120px]">
              <option>Year</option>
              <option>2025</option>
            </GlobalSelect>
          </div>
        </div>
        {/* Chart */}
        <div className="relative w-full h-72 flex flex-col justify-end p-6">
          {/* Y-axis grid lines and labels */}
          <div className="absolute left-0 top-0 w-full h-full flex flex-col justify-between z-0 pointer-events-none">
            {[1.8, 1.35, 0.9, 0.45, 0].map((v, i) => (
              <div key={i} className="flex items-center h-[20%]">
                <span className="text-xs text-[#868686] w-14 text-right pr-2 select-none">
                  {v === 0 ? "$0" : `$${(v * 1000).toLocaleString()}`}
                </span>
                <div className="border-t border-[#E8E8E8] flex-1" />
              </div>
            ))}
          </div>
          {/* Bars */}
          <div className="flex items-end h-full w-full z-10 relative pt-4">
            {months.map((month, idx) => {
              const completed = completedPayments[idx] || 0;
              const pending = pendingPayments[idx] || 0;
              return (
                <div
                  key={month}
                  className="flex flex-col-reverse items-center flex-1 mx-0.5"
                >
                  {/* Completed Payment Bar */}
                  {completed > 0 && (
                    <div
                      className="bg-[#1179FA] rounded-t-md w-6 md:w-8 mb-1"
                      style={{ height: `${(completed / maxY) * 180}px` }}
                    />
                  )}
                  {/* Pending Payment Bar */}
                  {pending > 0 && (
                    <div
                      className="bg-[#F28321] rounded-t-md w-6 md:w-8 mb-1"
                      style={{ height: `${(pending / maxY) * 180}px` }}
                    />
                  )}
                  {/* Month label */}
                  <span className="text-xs text-[#868686] mt-2 select-none">
                    {month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-6 mt-6 p-2 justify-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full bg-[#1179FA]" />
            <span className="text-xs text-[#1C231F]">Completed Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full bg-[#F28321]" />
            <span className="text-xs text-[#1C231F]">Pending Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
