"use client";
import React from "react";
import Image from "next/image";

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
  likes: number;
  comments: number;
  shares: number;
  isTripBoard?: boolean;
  tripDetails?: {
    tags: string[];
  };
};

// --- SVG ICONS ---
const HeartIcon = ({
  className,
  filled = false,
}: {
  className?: string;
  filled?: boolean;
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const CommentIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const LocationPinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 8.66667C9.47276 8.66667 10.6667 7.47276 10.6667 6C10.6667 4.52724 9.47276 3.33333 8 3.33333C6.52724 3.33333 5.33333 4.52724 5.33333 6C5.33333 7.47276 6.52724 8.66667 8 8.66667Z"
      stroke="#F35735"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 14.6667C10.24 12.4267 12.6667 10.0267 12.6667 8.13333C12.6667 5.2 10.4667 2 8 2C5.53333 2 3.33333 5.2 3.33333 8.13333C3.33333 10.0267 5.76 12.4267 8 14.6667Z"
      stroke="#F35735"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
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
            />
            <div>
              <p className="font-bold text-gray-800">{post.user.name}</p>
              <div className="flex items-center gap-2 text-xs text-custom-gray">
                <span>{post.timestamp}</span>
                {post.location && (
                  <span className="flex items-center gap-1">
                    <LocationPinIcon /> {post.location}
                  </span>
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
            <p className="text-custom-gray text-sm">{post.content}</p>
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
          <div className="flex justify-between items-center text-sm text-custom-gray">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-red-500">
                <HeartIcon filled={true} className="w-5 h-5" /> {post.likes}
              </button>
              <button className="flex items-center gap-1.5">
                <CommentIcon className="w-5 h-5" /> {post.comments}
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
                      />
                    ))}
                  </div>
                )}
                <span className="text-sm text-custom-gray">
                  {post.participants.length > 5
                    ? `${post.participants.length} Participants`
                    : ""}
                </span>
              </div>
            </div>
            <span className="text-sm text-custom-gray">
              {post.shares} Share
            </span>
          </div>

          {/* Comment Section - Hidden for Trip Board */}
          {!post.isTripBoard && (
            <>
              <div className="border-t border-gray-100 my-4"></div>
              <div className="flex items-center gap-3">
                <Image
                  src={post.user.avatarUrl}
                  alt={post.user.name}
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
                <div className="flex-grow bg-gray-50 rounded-full flex items-center px-4">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full bg-transparent outline-none py-2 text-sm"
                  />
                  <Image
                    src="/dashboard/smileface.svg"
                    alt="emoji"
                    width={20}
                    height={20}
                    className="cursor-pointer"
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
