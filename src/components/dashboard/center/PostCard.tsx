"use client";
import React from "react";
import Image from "next/image";
import LocationSmall from "../svgs/LocationSmall";

// --- TYPE DEFINITIONS ---
export type Post = {
  id: string;
  user: {
    name: string;
    avatarUrl: string;
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

const MoreOptionsIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="1.5" fill="#696969"></circle>
    <circle cx="6" cy="12" r="1.5" fill="#696969"></circle>
    <circle cx="18" cy="12" r="1.5" fill="#696969"></circle>
  </svg>
);

// --- IMAGE GRID COMPONENT ---
const ImageGrid = ({ images }: { images: { url: string }[] }) => {
  const count = images.length;
  if (count === 0) return null;

  const renderImage = (src: string, className: string, altIndex: number) => (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={`Post image ${altIndex + 1}`}
        layout="fill"
        className="object-cover"
      />
    </div>
  );

  if (count === 1)
    return (
      <div className="mt-4 aspect-[4/3] relative rounded-lg overflow-hidden">
        {renderImage(images[0].url, "w-full h-full", 0)}
      </div>
    );
  if (count === 2)
    return (
      <div className="mt-4 grid grid-cols-2 gap-1 aspect-[4/3] rounded-lg overflow-hidden">
        {renderImage(images[0].url, "", 0)}
        {renderImage(images[1].url, "", 1)}
      </div>
    );
  if (count === 3)
    return (
      <div className="mt-4 grid grid-cols-2 grid-rows-2 gap-1 aspect-[4/3] rounded-lg overflow-hidden">
        {renderImage(images[0].url, "row-span-2", 0)}
        {renderImage(images[1].url, "", 1)}
        {renderImage(images[2].url, "", 2)}
      </div>
    );
  if (count >= 4)
    return (
      <div className="mt-4 grid grid-cols-2 grid-rows-2 gap-1 aspect-[4/3] rounded-lg overflow-hidden">
        {renderImage(images[0].url, "", 0)}
        {renderImage(images[1].url, "", 1)}
        {renderImage(images[2].url, "", 2)}
        <div className="relative">
          {renderImage(images[3].url, "w-full h-full", 3)}
          {count > 4 && (
            <div className="absolute inset-0 bg-black/50 flex justify-center items-center text-white text-2xl font-bold">
              +{count - 4}
            </div>
          )}
        </div>
      </div>
    );
  return null;
};

// --- MAIN POST CARD COMPONENT ---
export const PostCard = ({ post }: { post: Post }) => {
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
              <div className="flex items-center gap-2 text-xs text-[#656565]">
                <span>{post.timestamp}</span>
                {post.location && (
                  <>
                    <span>|</span>
                    <span className="flex items-center gap-1">
                      <LocationSmall className="scale-150" /> {post.location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button>
              <MoreOptionsIcon />
            </button>
            <button className="text-2xl text-gray-500">&times;</button>
          </div>
        </div>

        {/* Post Body */}
        <div className="mt-4">
          {post.content && (
            <p className="text-[#959595] text-[12px]">{post.content}</p>
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

          {post.media && <ImageGrid images={post.media} />}
        </div>

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
    </div>
  );
};

export default PostCard;
