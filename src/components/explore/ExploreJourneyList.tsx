import api from "@/lib/api";
import React, { useEffect, useState } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";

interface ExploreJourneyListProps {
  onJourneyClick: (journey: any) => void;
  setShowJourneyList: (show: boolean) => void;
  onNewJourneyClick: () => void;
}

export default function ExploreJourneyList({
  onJourneyClick,
  setShowJourneyList,
  onNewJourneyClick,
}: ExploreJourneyListProps) {
  const [trips, setTrips] = useState<any[]>([]);
  const [loadingJourneyId, setLoadingJourneyId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem("token"); // if you must use it
        const res = await api.get("journeys", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // depending on your api wrapper, res could be Response or already JSON:
        const data = res.json ? await res.json() : res;
        // @ts-ignore
        setTrips(data.data); // adapt to API shape
      } catch (e) {
        console.error(e);
      }
    };
    fetchTrips();
  }, []);

  // Fetch detailed journey data when a journey is clicked
  const handleJourneyClick = async (trip: any) => {
    setLoadingJourneyId(trip.id);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        onJourneyClick(trip); // Fallback to basic data
        return;
      }

      const response = await api.get(`journeys/${trip.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: any = response.json ? await response.json() : response;
      console.log("Detailed journey data:", data);

      // Check if the response contains the expected data
      if (data && (data.data || data.id)) {
        // Pass the detailed journey data to the parent component
        onJourneyClick(data.data || data);
      } else {
        console.warn("Unexpected API response structure:", data);
        onJourneyClick(trip); // Fallback to basic data
      }
    } catch (error) {
      console.error("Error fetching journey details:", error);
      // Fallback to basic trip data if detailed fetch fails
      onJourneyClick(trip);
    } finally {
      setLoadingJourneyId(null);
    }
  };

  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="13"
      fill="none"
      viewBox="0 0 18 13"
    >
      <path
        fill="url(#paint0_linear_5529_42456)"
        fillRule="evenodd"
        d="m15.951 3.056 1.12-1.074a.737.737 0 0 0 0-1.073.815.815 0 0 0-1.12 0l-1.12 1.073L13.714.91a.815.815 0 0 0-1.12 0 .737.737 0 0 0 0 1.073l1.12 1.074-1.12 1.073a.737.737 0 0 0 0 1.074.8.8 0 0 0 .56.222.8.8 0 0 0 .56-.222l1.119-1.074 1.12 1.074a.8.8 0 0 0 .559.222.8.8 0 0 0 .56-.222.737.737 0 0 0 0-1.074zm-1.12 3.416c-.437 0-.79.34-.79.76v.759c0 .42.353.759.79.759.439 0 .793-.34.793-.76v-.758c0-.42-.354-.76-.792-.76M9.8 10.243a2.75 2.75 0 0 1-.837-.78.81.81 0 0 0-1.097-.21.74.74 0 0 0-.22 1.053c.34.489.794.912 1.313 1.224.13.08.276.116.42.116a.8.8 0 0 0 .671-.356.74.74 0 0 0-.25-1.047m3.282-.241c-.3.25-.645.43-1.024.537a.757.757 0 0 0-.534.944.79.79 0 0 0 .76.543q.112 0 .224-.031a4.4 4.4 0 0 0 1.609-.844.737.737 0 0 0 .081-1.07.813.813 0 0 0-1.116-.08M1.375 4.783c-.437 0-.792.34-.792.76v1.449c0 .419.355.759.792.759s.791-.34.791-.76V5.543c0-.419-.354-.759-.791-.759m1.412-3.612a3.95 3.95 0 0 0-1.432 1.15.74.74 0 0 0 .166 1.063.816.816 0 0 0 1.108-.16c.225-.293.522-.532.86-.692a.746.746 0 0 0 .359-1.017.81.81 0 0 0-1.061-.344m4.816 2.317a.74.74 0 0 0 .206-1.055 3.9 3.9 0 0 0-1.388-1.2.813.813 0 0 0-1.073.307.745.745 0 0 0 .32 1.03c.332.17.62.42.835.72a.815.815 0 0 0 1.1.197M8.5 7.1v-1.45c0-.418-.354-.759-.791-.759s-.792.34-.792.76V7.1c0 .42.355.76.792.76s.791-.34.791-.76M1.375 9.13c-.437 0-.792.339-.792.759v.759c0 .42.355.76.792.76s.791-.34.791-.76v-.76c0-.419-.354-.758-.791-.758"
        clipRule="evenodd"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear_5529_42456"
          x1="0.583"
          x2="17.3"
          y1="5.428"
          y2="5.753"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9243AC"></stop>
          <stop offset="0.507" stopColor="#B6459F"></stop>
          <stop offset="1" stopColor="#E74294"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
  const closeIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      fill="none"
      viewBox="0 0 10 10"
    >
      <path
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m1.708 1.708 6.963 6.963M1.708 8.671l6.963-6.963"
      ></path>
    </svg>
  );
  return (
    <div className="w-72 bg-[#FAFBFB] p-2">
      <div className="flex justify-end">
        <div
          className=" p-2 rounded-full cursor-pointer bg-[#F4F4F4]"
          onClick={() => setShowJourneyList(false)}
        >
          {closeIcon}
        </div>
      </div>
      <div className="flex flex-col h-full gap-2 justify-between p-2">
        <div>
          <div className="flex items-center gap-3 my-2">
            <div className="p-2 bg-[#F4F4F4] rounded-sm">{icon}</div>
            <div className="text-[18px] font-semibold text-black">
              My Journey
            </div>
          </div>
          <div className="space-y-1 max-h-[400px] overflow-y-auto overflow-x-hidden">
            <div className="text-[18px] font-medium text-[#9F40C8]">Trips</div>
            {trips.map((trip, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 py-3 border-b border-gray-200 last:border-b-0 cursor-pointer transition-colors"
                onClick={() => handleJourneyClick(trip)}
              >
                <div className="relative w-9 h-9 rounded-full overflow-hidden">
                  <img
                    src={
                      trip.image_url
                        ? trip.image_url
                        : "https://placehold.co/400"
                    }
                    alt="trip image"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className=" text-sm text-gray-900 truncate max-w-[180px]">
                    {trip.title}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Date {trip.start_date}
                  </div>
                </div>
                <MdOutlineArrowForwardIos />
                {/* {loadingJourneyId === trip.id && (
                  <div className='ml-auto'>
                    <div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
                  </div>
                )} */}
              </div>
            ))}
          </div>
        </div>
        <div
          className="bg-gradient-to-r mt-4 from-[#9743AA] to-[#E54295] text-white flex items-center justify-center text-[13px] gap-1 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors cursor-pointer shadow-sm hover:shadow-md active:scale-95 "
          onClick={onNewJourneyClick}
        >
          Add New Journey
        </div>
      </div>
    </div>
  );
}
