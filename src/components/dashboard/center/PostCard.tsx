"use client";
import React, { useState } from "react";
import Image from "next/image";
import LocationSmall from "../svgs/LocationSmall";
import MediaModal from "../../global/MediaModal";

// --- TYPE DEFINITIONS ---
export type Post = {
  id: string;
  isTravelAdvisory?: boolean;
  travelAdvisoryHead?: string;

  tags?: string[];
  user: {
    name: string;
    avatarUrl: string;
  };
  journeyHead?: string;
  journeyContent?: {
    travelDetails: {
      locationDistance: string;
      distanceCovered: string;
      date: string;
      mapView: string;
    };
    media: { type: "image" | "video"; url: string }[];
  };
  timestamp: string;
  location?: string;
  content?: string;
  media?: { type: "image" | "video"; url: string }[];
  participants: { avatarUrl: string }[];
  love: number;
  likes: number;
  comments: number;
  shares: number;
  isTripBoard?: boolean;
  tripDetails?: {
    tags: string[];
  };
};

// --- SVG ICONS ---
const HeartIcon = ({ className }: { className?: string; filled?: boolean }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const LikeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    className={className}
  >
    <g fill="currentColor" clipPath="url(#a)">
      <path d="M18.978 6.435A4.16 4.16 0 0 0 15.833 5H12.51l.28-1.7a2.53 2.53 0 0 0-4.767-1.531L6.667 4.515V17.5h8.583a4.187 4.187 0 0 0 4.126-3.583l.587-4.167a4.161 4.161 0 0 0-.985-3.315ZM0 9.167v4.166A4.172 4.172 0 0 0 4.167 17.5H5V5h-.833A4.172 4.172 0 0 0 0 9.167Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);

const EmojiIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={38}
    fill="none"
    viewBox="0 0 24 38"
    className={className}
  >
    <g fill="currentColor" clipPath="url(#a)">
      <path d="M12 32C5.4 32 0 26.6 0 20S5.4 8 12 8s12 5.4 12 12-5.4 12-12 12Zm0-22.5C6.2 9.5 1.5 14.2 1.5 20S6.2 30.5 12 30.5 22.5 25.8 22.5 20 17.8 9.5 12 9.5Z" />
      <path d="M17.45 20c0-.7-.55-1.25-1.25-1.25s-1.25.55-1.25 1.25.55 1.25 1.25 1.25 1.25-.55 1.25-1.25Zm-10.9 0c0-.7.55-1.25 1.25-1.25s1.25.55 1.25 1.25-.55 1.25-1.25 1.25S6.55 20.7 6.55 20ZM12 26.65c-2.6 0-4-1.75-4.1-1.85-.25-.3-.2-.8.1-1.05.3-.25.8-.2 1.05.1.05.05 1.05 1.25 2.9 1.25 1.85 0 2.9-1.25 2.9-1.25.25-.3.75-.35 1.05-.1.3.25.35.75.1 1.05 0 .1-1.4 1.85-4 1.85Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 8h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);

const LocationTagIcon = ({ className }: { className?: string }) => (
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
      fill="#fff"
    />
  </svg>
);

export const MoreOptionsIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="1.5" fill="currentColor"></circle>
    <circle cx="6" cy="12" r="1.5" fill="currentColor"></circle>
    <circle cx="18" cy="12" r="1.5" fill="currentColor"></circle>
  </svg>
);

// Play icon for videos
const PlayIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.5)" />
    <path d="M20 16L32 24L20 32V16Z" fill="white" />
  </svg>
);

// --- MEDIA GRID COMPONENT ---
const MediaGrid = ({
  media,
  onMediaClick,
}: {
  media: { type: "image" | "video"; url: string }[];
  onMediaClick: (
    media: { type: "image" | "video"; url: string }[],
    index: number
  ) => void;
}) => {
  const count = media.length;
  if (count === 0) return null;

  // Separate images and videos
  const images = media.filter((item) => item.type === "image");
  const videos = media.filter((item) => item.type === "video");

  // State to store image dimensions
  const [imageDimensions, setImageDimensions] = React.useState<
    Array<{ width: number; height: number; aspectRatio: number }>
  >([]);
  const [loadedImages, setLoadedImages] = React.useState(0);

  // Load image dimensions
  React.useEffect(() => {
    if (images.length === 0) return;

    const loadImageDimensions = async () => {
      const dimensions = await Promise.all(
        images.map((image) => {
          return new Promise<{
            width: number;
            height: number;
            aspectRatio: number;
          }>((resolve) => {
            const img = new window.Image();
            img.onload = () => {
              const aspectRatio = img.width / img.height;
              resolve({ width: img.width, height: img.height, aspectRatio });
            };
            img.onerror = () => {
              // Fallback to square aspect ratio if image fails to load
              resolve({ width: 1, height: 1, aspectRatio: 1 });
            };
            img.src = image.url;
          });
        })
      );
      setImageDimensions(dimensions);
    };

    loadImageDimensions();
  }, [images]);

  // Type definitions for layout
  type LayoutType =
    | { type: "single"; aspectRatio: number }
    | { type: "two-column"; aspectRatio: string }
    | { type: "three-layout"; firstPortrait: boolean }
    | { type: "grid-2x2" }
    | { type: "smart-grid"; columns: number };

  // Determine optimal layout based on media count and aspect ratios
  const getLayout = (): LayoutType => {
    if (count === 1) {
      const aspectRatio = imageDimensions[0]?.aspectRatio || 4 / 3;
      return {
        type: "single",
        aspectRatio: Math.min(Math.max(aspectRatio, 0.5), 2.5), // Clamp between 0.5 and 2.5
      };
    }

    if (count === 2) {
      const avgAspectRatio =
        imageDimensions.reduce((sum, dim) => sum + dim.aspectRatio, 0) / count;
      return {
        type: "two-column",
        aspectRatio: avgAspectRatio > 1.5 ? "16/9" : "4/3",
      };
    }

    if (count === 3) {
      const firstAspectRatio = imageDimensions[0]?.aspectRatio || 1;
      const isFirstPortrait = firstAspectRatio < 1;

      return {
        type: "three-layout",
        firstPortrait: isFirstPortrait,
      };
    }

    if (count === 4) {
      return { type: "grid-2x2" };
    }

    // For 5+ media, use a smart grid layout
    return {
      type: "smart-grid",
      columns: count <= 6 ? 3 : 4,
    };
  };

  const renderMedia = (
    mediaItem: { type: "image" | "video"; url: string },
    className: string,
    altIndex: number,
    customAspectRatio?: string
  ) => (
    <div
      className={`relative ${className} cursor-pointer hover:opacity-90 transition-opacity`}
      style={customAspectRatio ? { aspectRatio: customAspectRatio } : undefined}
      onClick={() => onMediaClick(media, altIndex)}
    >
      {mediaItem.type === "image" ? (
        <Image
          src={mediaItem.url}
          alt={`Post image ${altIndex + 1}`}
          fill
          className="object-cover"
          onLoad={() => setLoadedImages((prev) => prev + 1)}
        />
      ) : (
        <div className="w-full h-full relative">
          <video
            src={mediaItem.url}
            className="w-full h-full object-cover"
            preload="metadata"
            muted
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayIcon className="w-12 h-12" />
          </div>
        </div>
      )}
    </div>
  );

  const layout = getLayout();

  // Single media layout
  if (layout.type === "single") {
    return (
      <div
        className="mt-4 relative rounded-lg overflow-hidden"
        style={{ aspectRatio: layout.aspectRatio }}
      >
        {renderMedia(media[0], "w-full h-full", 0)}
      </div>
    );
  }

  // Two media layout
  if (layout.type === "two-column") {
    return (
      <div
        className={`mt-4 grid grid-cols-2 gap-1 rounded-lg overflow-hidden`}
        style={{ aspectRatio: layout.aspectRatio }}
      >
        {renderMedia(media[0], "", 0)}
        {renderMedia(media[1], "", 1)}
      </div>
    );
  }

  // Three media layout
  if (layout.type === "three-layout") {
    if (layout.firstPortrait) {
      return (
        <div className="mt-4 grid grid-cols-3 gap-1 aspect-[16/9] rounded-lg overflow-hidden">
          {renderMedia(media[1], "", 1)}
          {renderMedia(media[2], "", 2)}
          {renderMedia(media[0], "row-span-2", 0)}
        </div>
      );
    } else {
      return (
        <div className="mt-4 grid grid-cols-2 grid-rows-2 gap-1 aspect-[4/3] rounded-lg overflow-hidden">
          {renderMedia(media[1], "", 1)}
          {renderMedia(media[2], "", 2)}
          {renderMedia(media[0], "col-span-2", 0)}
        </div>
      );
    }
  }

  // Four media grid
  if (layout.type === "grid-2x2") {
    return (
      <div className="mt-4 grid grid-cols-2 grid-rows-2 gap-1 aspect-square rounded-lg overflow-hidden">
        {media
          .slice(0, 4)
          .map((mediaItem, index) => renderMedia(mediaItem, "", index))}
      </div>
    );
  }

  // Smart grid for 5+ media
  if (layout.type === "smart-grid") {
    const gridCols = layout.columns;
    const gridRows = Math.ceil(count / gridCols);

    return (
      <div
        className={`mt-4 grid gap-1 rounded-lg overflow-hidden`}
        style={{
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gridTemplateRows: `repeat(${gridRows}, 1fr)`,
          aspectRatio: gridCols === 3 ? "4/3" : "16/9",
        }}
      >
        {media.map((mediaItem, index) => {
          const isLastMedia = index === gridCols * gridRows - 1;
          const remainingCount = count - gridCols * gridRows;

          return (
            <div key={index} className="relative">
              {renderMedia(mediaItem, "w-full h-full", index)}
              {isLastMedia && remainingCount > 0 && (
                <div className="absolute inset-0 bg-black/50 flex justify-center items-center text-white text-lg font-bold">
                  +{remainingCount}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};

// --- MAIN POST CARD COMPONENT ---
export const PostCard = ({ post }: { post: Post }) => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<
    { type: "image" | "video"; url: string }[]
  >([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Handle media click
  const handleMediaClick = (
    media: { type: "image" | "video"; url: string }[],
    index: number
  ) => {
    setCurrentMedia(media);
    setCurrentMediaIndex(index);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Handle media index change in modal
  const handleMediaIndexChange = (index: number) => {
    setCurrentMediaIndex(index);
  };

  return (
    <div className="bg-white rounded-lg shadow-md my-4 overflow-hidden">
      {/* Trip Board Header */}
      {post.isTripBoard && (
        <div className="bg-gradient-to-r from-[#257CFF] to-[#0F62DE] p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg">Trip Board</h3>
          <div className="flex gap-2">
            <button className="bg-white text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold">
              Share Trip
            </button>
            <button className="bg-blue-500/50 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
              View All TripBoard
            </button>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Post Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Image
              src={post.user.avatarUrl}
              alt={post.user.name}
              width={48}
              height={48}
              className="rounded-full object-cover"
              unoptimized
            />
            <div>
              <p className="font-bold text-gray-800">{post.user.name}</p>
              <div className="flex items-center gap-2 text-xs text-[#656565] whitespace-nowrap">
                <span>{post.timestamp}</span>
                {post.location && (
                  <>
                    <span>|</span>
                    <span className="flex items-center gap-1 ">
                      <LocationSmall className="scale-150 ml-0.5" />{" "}
                      <span className="truncate max-w-[350px] xl:max-w-[450px] w-full">
                        {post.location}
                      </span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {post.isTravelAdvisory && (
              <button
                type="button"
                className="text-[#0C8C38] bg-[#DCFCE7] rounded-md p-3 font-bold text-[11px] hover:bg-[#DCFCE7]/80 transition-all duration-200"
              >
                Mark as Resolved
              </button>
            )}
            <button>
              <MoreOptionsIcon />
            </button>
            <button className="text-2xl text-gray-500">&times;</button>
          </div>
        </div>

        {post.isTravelAdvisory && (
          <div className="mt-4 flex items-center gap-4 flex-wrap">
            <h3 className="text-[18px] md:text-[25px] font-medium">
              {post.travelAdvisoryHead}
            </h3>
            <div className="flex items-center gap-0.5">
              <Image
                src={"/dashboard/footprint2.svg"}
                alt={"footprint2"}
                width={16}
                height={16}
              />
              <p className="text-[8px] md:text-[11px] text-[#FF0000]">
                Travel Advisory
              </p>
            </div>
          </div>
        )}

        {post.journeyHead && (
          <div className="mt-4">
            <h3
              className="md:text-[18px] text-[16px] font-medium"
              dangerouslySetInnerHTML={{ __html: post.journeyHead || "" }}
            />
          </div>
        )}

        {/* Post Body */}
        <div className="">
          {post?.content && (
            <p
              className={`${
                post?.media
                  ? "text-[#959595] text-[12px] mt-4"
                  : post?.journeyHead
                  ? "text-[#959595] text-[16px] mt-1"
                  : "text-black text-[35px] font-medium mt-4"
              }`}
            >
              {post.content}
            </p>
          )}

          {post.journeyContent && (
            <div className="mt-4">
              <div>
                {/* <div className="flex items-center justify-between gap-2 bg-[#F9F7F7] rounded-t-lg p-2">
                  <div className="flex items-center gap-4 md:gap-8">
                    <div className="flex items-center gap-2">
                      <Image
                        src={
                          "https://res.cloudinary.com/dtfzklzek/image/upload/v1751658950/Frame_2147227427_mhsuyc.svg"
                        }
                        alt="svg"
                        height={30}
                        width={30}
                      />
                      <div>
                        <p className="text-[10px]">Elev. gain</p>
                        <p className="text-[14px] font-medium">
                          {
                            post?.journeyContent?.travelDetails
                              ?.locationDistance
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Image
                        src={
                          "https://res.cloudinary.com/dtfzklzek/image/upload/v1751658944/Outlines_kjz5ur.svg"
                        }
                        alt="svg"
                        height={24}
                        width={24}
                      />
                      <div>
                        <p className="text-[10px]">Distance Covered</p>
                        <p className="text-[14px] font-medium">
                          {post?.journeyContent?.travelDetails?.distanceCovered}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1">
                    <Image
                      src={
                        "https://res.cloudinary.com/dtfzklzek/image/upload/v1751658947/fi-sr-calendar_x1iti8.svg"
                      }
                      alt="svg"
                      height={16}
                      width={16}
                    />
                    <p className="text-[14px]">
                      {post?.journeyContent?.travelDetails?.date}
                    </p>
                  </div>
                </div> */}
                <Image
                  src={post?.journeyContent?.travelDetails?.mapView}
                  alt="mapView"
                  height={320}
                  width={700}
                  className="w-full object-cover rounded-b-lg"
                />
                {post?.journeyContent?.media && (
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {post?.journeyContent?.media.map((mediaItem, i) => (
                      <div
                        key={i}
                        className="relative cursor-pointer hover:opacity-90 transition-opacity aspect-square"
                        onClick={() =>
                          handleMediaClick(post.journeyContent!.media, i)
                        }
                      >
                        {mediaItem.type === "image" ? (
                          <Image
                            src={mediaItem.url}
                            alt="journeyMedia"
                            fill
                            className="object-cover rounded-lg"
                          />
                        ) : (
                          <div className="relative w-full h-full">
                            <video
                              src={mediaItem.url}
                              className="w-full h-full object-cover rounded-lg"
                              preload="metadata"
                              muted
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <PlayIcon className="w-8 h-8" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {post.isTripBoard && post.tripDetails?.tags && (
            <div className="flex flex-wrap gap-2 mt-3">
              {post.tripDetails.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"
                >
                  <LocationTagIcon />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.media && (
            <MediaGrid media={post.media} onMediaClick={handleMediaClick} />
          )}
        </div>

        {post?.tags && (
          <div className="flex flex-wrap gap-2 my-2">
            {post?.tags.map((tag, i) => (
              <span
                key={i}
                className="border rounded-full px-2 py-1 cursor-pointer border-[#E1E1E1] text-[#696969] text-[11px] bg-white hover:bg-[#E1E1E1] transition-all duration-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Post Footer */}
        <div className="mt-4">
          <div className="flex justify-between items-center text-sm text-[#656565]">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 hover:text-red-500">
                <HeartIcon filled={true} className="w-5 h-5" /> {post.love}
              </button>
              <button className="flex items-center gap-1.5 hover:text-[#3162E7]">
                <LikeIcon className="w-5 h-5 " /> {post.likes}
              </button>
              <div className="flex items-center gap-2">
                {post.participants.length > 0 && (
                  <div className="flex -space-x-2">
                    {post.participants.slice(0, 5).map((p, i) => (
                      <Image
                        key={i}
                        src={p.avatarUrl}
                        alt={`participant ${i}`}
                        width={24}
                        height={24}
                        className="rounded-full border-2 border-white object-cover"
                        unoptimized
                      />
                    ))}
                  </div>
                )}
                <span className="text-sm text-[#656565]">
                  {post.participants.length > 5
                    ? `${post.participants.length} Participants`
                    : ""}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#656565]">
                {post.comments} Comments
              </span>
              <span className="text-sm text-[#656565]">
                {post.shares} Share
              </span>
            </div>
          </div>

          {/* Comment Section - Hidden for Trip Board */}
          {!post.isTripBoard && (
            <>
              <div className="border-t border-gray-100 my-4"></div>
              <div className="flex items-center gap-3">
                <div className="flex items-center px-4 gap-2">
                  <EmojiIcon className="hover:text-yellow-400" />
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full bg-transparent outline-none py-2 text-sm"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Media Modal */}
      <MediaModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        media={currentMedia}
        currentIndex={currentMediaIndex}
        onIndexChange={handleMediaIndexChange}
      />
    </div>
  );
};

export default PostCard;
