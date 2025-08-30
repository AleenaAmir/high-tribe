import React, { useState, useRef } from "react";
import Image from "next/image";
import GlobalModalBorderLess from "@/components/global/GlobalModalBorderLess";
import JourneyMap from "@/components/dashboard/modals/components/newjourney/JourneyMap";
import { Post, formatDate } from "@/lib/adapters/postAdapter";

// SVG Icons
const StarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 1.333l1.8 3.6 4.2.6-3 3 .6 4.2L8 11.333l-3.6 1.8.6-4.2-3-3 4.2-.6L8 1.333z"
      fill="currentColor"
    />
  </svg>
);

const MapIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    fill="none"
    viewBox="0 0 15 15"
    className={className}
  >
    <path
      fill="#ED892D"
      d="m12.92 10.752-.001 1.22a.45.45 0 0 1-.639.41l-.444-.205q.133-.141.262-.29.465-.528.821-1.135M1.216 2.25a.45.45 0 0 1 .638-.409l3.33 1.536 3.596-1.54a.45.45 0 0 1 .307-.018l.06.022 3.51 1.62a.45.45 0 0 1 .261.41V7.51a2.5 2.5 0 0 0-.9-.657V4.16L8.95 2.743 5.354 4.285a.45.45 0 0 1-.366-.005L2.116 2.954v7.11l3.067 1.416L8.638 10q.164.449.448.908l-.136-.063-3.596 1.542a.45.45 0 0 1-.307.017l-.059-.022-3.51-1.62a.45.45 0 0 1-.262-.41z"
    ></path>
    <path
      fill="#F5C280"
      d="M8.508 9.544c.087.41.262.83.513 1.254a.45.45 0 0 1-.509-.389l-.003-.056zm.45-7.743a.45.45 0 0 1 .447.393l.004.057-.001 4.88a2.32 2.32 0 0 0-.9 1.31V2.25a.45.45 0 0 1 .45-.45m-3.78 1.62a.45.45 0 0 1 .446.394l.004.056v8.102a.45.45 0 0 1-.897.056l-.003-.056V3.87a.45.45 0 0 1 .45-.45"
    ></path>
    <path
      fill="#ED892D"
      d="M8.78 1.837a.45.45 0 0 1 .308-.017l.059.022 1.755.81a.45.45 0 0 1-.324.838l-.053-.02-1.574-.727-3.597 1.542a.45.45 0 0 1-.306.017l-.06-.022-1.755-.81a.45.45 0 0 1 .325-.838l.052.02 1.574.726zM8.64 10q.163.448.447.907l-.135-.062-3.597 1.542a.45.45 0 0 1-.306.017l-.06-.022-1.755-.81a.45.45 0 0 1 .325-.838l.052.02 1.574.726z"
    ></path>
    <path
      fill="#BE4BDB"
      d="M10.957 5.734c-1.88 0-3.413 1.439-3.413 3.228 0 1.184.6 2.368 1.59 3.512.339.391.7.75 1.061 1.07l.183.159.168.139.14.11a.45.45 0 0 0 .54 0l.14-.11.169-.14q.088-.075.183-.158.566-.5 1.06-1.07c.99-1.144 1.592-2.328 1.592-3.512 0-1.79-1.535-3.228-3.413-3.228m0 .9c1.394 0 2.513 1.05 2.513 2.328 0 .923-.51 1.927-1.372 2.923-.31.359-.644.69-.977.985l-.085.075-.08.067-.164-.142a10.5 10.5 0 0 1-.977-.985c-.861-.996-1.371-2-1.371-2.923 0-1.279 1.118-2.328 2.513-2.328"
    ></path>
    <path
      fill="#BE4BDB"
      d="M10.956 7.574a1.62 1.62 0 1 1 0 3.241 1.62 1.62 0 0 1 0-3.24m0 .9a.72.72 0 1 0 0 1.44.72.72 0 0 0 0-1.44"
    ></path>
  </svg>
);

const LocationIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 5.333c.736 0 1.333.597 1.333 1.334s-.597 1.333-1.333 1.333c-.737 0-1.334-.597-1.334-1.333S7.263 5.333 8 5.333zm0-4C5.067 1.333 2.667 3.733 2.667 6.666c0 2.4 1.733 4.8 2.666 5.867l2.667 2.134 2.667-2.134c.933-1.066 2.666-3.466 2.666-5.866C13.333 3.733 10.933 1.333 8 1.333z"
      fill="currentColor"
    />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface JourneyMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

const JourneyMapModal: React.FC<JourneyMapModalProps> = ({
  isOpen,
  onClose,
  post,
}) => {
  const mapRef = useRef<any>(null);
  const [selectedStopIndex, setSelectedStopIndex] = useState<number>(0);

  // Extract journey data from post with safety checks
  const journeyTitle = `Trip to ${post?.start_location_name || "Unknown"}`;
  const displayTitle =
    journeyTitle.length > 30
      ? journeyTitle.substring(0, 30) + "..."
      : journeyTitle;
  const startLocation = post?.start_location_name;
  const endLocation = post?.end_location_name;
  const stops = post?.stops || [];
  const mainMedia = post?.media || [];

  // Get media for the selected stop
  const getSelectedStopMedia = () => {
    if (selectedStopIndex < stops.length && stops[selectedStopIndex].media) {
      return stops[selectedStopIndex].media || [];
    }
    return [];
  };

  const selectedStopMedia = getSelectedStopMedia();

  // Get coordinates for map
  const getStartCoords = (): [number, number] | null => {
    if (post?.start_lat && post?.start_lng) {
      return [parseFloat(post.start_lng), parseFloat(post.start_lat)];
    }
    return null;
  };

  const getEndCoords = (): [number, number] | null => {
    if (post?.end_lat && post?.end_lng) {
      return [parseFloat(post.end_lng), parseFloat(post.end_lat)];
    }
    return null;
  };

  const getStopCoords = (): [number, number][] => {
    return stops
      .map((stop) => {
        if (stop && stop?.lat && stop.lng) {
          return [parseFloat(stop.lng), parseFloat(stop?.lat)] as [
            number,
            number
          ];
        }
        return null;
      })
      .filter(Boolean) as [number, number][];
  };

  // Get coordinates for the selected stop
  const getSelectedStopCoords = (): [number, number] | null => {
    if (selectedStopIndex < stops.length) {
      const selectedStop = stops[selectedStopIndex];
      if (selectedStop && selectedStop?.lat && selectedStop.lng) {
        return [parseFloat(selectedStop.lng), parseFloat(selectedStop?.lat)];
      }
    }
    return null;
  };

  const startCoords = getStartCoords();
  const endCoords = getEndCoords();
  const stopCoords = getStopCoords();
  const selectedStopCoords = getSelectedStopCoords();

  // Format date for display
  const formatStopDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Safety check - if post is undefined, don't render
  if (!post) {
    return null;
  }

  return (
    <GlobalModalBorderLess
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-5xl"
      customPadding="p-0"
    >
      <div className="max-h-[900px] h-[90vh] bg-white rounded-[20px] overflow-hidden px-4 py-10">
        {/* Header */}
        <div className="pb-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  post.user?.name || "Unknown User"
                )}&background=random&size=40`}
                alt={post.user?.name || "Unknown User"}
                width={40}
                height={40}
                className="rounded-full object-cover"
                unoptimized
              />
              <div>
                <p className="font-semibold text-black text-sm">
                  {post.user?.name || "Unknown User"}
                </p>
                <p className="text-xs text-gray-500">
                  Trip to {startLocation} | {formatDate(post.created_at)}
                </p>
              </div>
            </div>
          </div>
          {startLocation && endLocation && (
            <div className="mt-3">
              <div className="flex items-center gap-2 text-xs text-black mb-2">
                <span className="truncate font-semibold">
                  Trip to {startLocation}
                </span>
                <span>→</span>
                <span className="truncate">{endLocation}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex">
          {/* Left Panel - Journey Details */}
          <div className="bg-white overflow-y-auto border-r border-gray-100 min-w-[200px]">
            {/* Journey Stops */}
            {stops.length > 0 && (
              <div className="mb-6">
                <div className="relative">
                  {/* Vertical timeline line */}
                  <div className="absolute left-[27px] top-5 bottom-0 w-0.5 bg-black"></div>

                  <div className="space-y-0">
                    {stops.map((stop, index) => {
                      return (
                        <div
                          key={stop.id || index}
                          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${selectedStopIndex === index
                              ? "bg-gray-50"
                              : "bg-white"
                            }`}
                          onClick={() => setSelectedStopIndex(index)}
                        >
                          {/* Gradient marker */}
                          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 relative z-10">
                            <span className="text-xs font-semibold text-white">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-sm text-black truncate">
                              {stop.location_name ||
                                stop.title ||
                                `Stop ${index + 1}`}
                            </h5>
                            {stop.start_date && stop.end_date && (
                              <p className="text-sm text-black whitespace-nowrap">
                                {formatStopDate(stop.start_date)} →{" "}
                                {formatStopDate(stop.end_date)}
                              </p>
                            )}
                          </div>

                          <ArrowRightIcon className="w-4 h-4 text-black" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Map */}
          <div className="w-full h-full">
            <div className="h-full bg-gray-100 rounded-lg relative overflow-hidden">
              {/* Map Overlay Info - Top Left */}
              <div className="w-full bg-white rounded-lg shadow-lg p-4 border border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold truncate text-[16px]">
                    {stops[selectedStopIndex]?.location_name ||
                      stops[selectedStopIndex]?.title ||
                      displayTitle}
                  </h4>
                  <div className="flex items-center gap-2 ">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xs font-bold">4.9</span>
                      <StarIcon className="w-3 h-3 text-yellow-400" />
                      <StarIcon className="w-3 h-3 text-yellow-400" />
                      <StarIcon className="w-3 h-3 text-yellow-400" />
                      <StarIcon className="w-3 h-3 text-yellow-400" />
                      <StarIcon className="w-3 h-3 text-yellow-400" />
                    </div>
                    <span className="text-[10px] font-semibold">(28K)</span>
                    <span className="text-[10px] ">50</span>
                  </div>
                  {stops[selectedStopIndex]?.location_name && (
                    <div className="flex items-center gap-1 text-sm text-black">
                      <span className="truncate text-[10px]">
                        {stops[selectedStopIndex].location_name}
                      </span>
                    </div>
                  )}
                </div>
                {/* Image Thumbnails - Show selected stop media or main post media */}
                {(selectedStopMedia.length > 0 || mainMedia.length > 0) && (
                  <div className="">
                    <div className="flex gap-2">
                      {(selectedStopMedia.length > 0
                        ? selectedStopMedia
                        : mainMedia
                      ).map((mediaItem, index) => (
                        <div
                          key={index}
                          className="w-14 h-14 rounded-lg overflow-hidden border-2 border-white shadow-md"
                        >
                          <Image
                            src={
                              mediaItem.file_path ||
                              mediaItem.url ||
                              "https://via.placeholder.com/400x300?text=No+Image"
                            }
                            alt={`Journey photo ${index + 1}`}
                            width={56}
                            height={56}
                            className="object-cover w-full h-full"
                            unoptimized
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "https://via.placeholder.com/400x300?text=Image+Not+Available";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {startCoords || endCoords ? (
                <div className="w-full min-h-[200px]  h-full">
                  <JourneyMap
                    ref={mapRef}
                    startLocation={startCoords}
                    endLocation={endCoords}
                    steps={stopCoords}
                    onStartChange={() => { }} // Read-only
                    onEndChange={() => { }} // Read-only
                    onStepsChange={() => { }} // Read-only
                    activeMapSelect="start"
                    setActiveMapSelect={() => { }} // Read-only
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <LocationIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium">No map data available</p>
                    <p className="text-sm">
                      Location coordinates are not available for this journey.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </GlobalModalBorderLess>
  );
};

export default JourneyMapModal;
