"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { apiFormDataWrapper, apiRequest } from "@/lib/api";
import MediaModal from "@/components/global/MediaModal";
import JourneyMapModal from "./JourneyMapModal";
import {
  Post,
  PostUser as User,
  PostMedia as Media,
  Comment,
  formatDate,
  isExpired,
  getPostType,
  getMediaUrl,
  isVideo,
} from "@/lib/adapters/postAdapter";

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

const ExpandIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 14L12 9L17 14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
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
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="currentColor" clipPath="url(#clip0_3874_22889)">
      <path d="M12 24C5.4 24 0 18.6 0 12S5.4 0 12 0s12 5.4 12 12-5.4 12-12 12m0-22.5C6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5 22.5 17.8 22.5 12 17.8 1.5 12 1.5"></path>
      <path d="M17.45 12c0-.7-.55-1.25-1.25-1.25s-1.25.55-1.25 1.25.55 1.25 1.25 1.25 1.25-.55 1.25-1.25m-10.9 0c0-.7.55-1.25 1.25-1.25s1.25.55 1.25 1.25-.55 1.25-1.25 1.25S6.55 12.7 6.55 12M12 18.65c-2.6 0-4-1.75-4.1-1.85-.25-.3-.2-.8.1-1.05s.8-.2 1.05.1c.05.05 1.05 1.25 2.9 1.25s2.9-1.25 2.9-1.25c.25-.3.75-.35 1.05-.1s.35.75.1 1.05c0 .1-1.4 1.85-4 1.85"></path>
    </g>
    <defs>
      <clipPath id="clip0_3874_22889">
        <path fill="#fff" d="M0 0h24v24H0z"></path>
      </clipPath>
    </defs>
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

const MoreOptionsIcon = ({ className }: { className?: string }) => (
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

const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 1.333A6.667 6.667 0 1 0 8 14.667 6.667 6.667 0 0 0 8 1.333ZM8 13.333A5.333 5.333 0 1 1 8 2.667a5.333 5.333 0 0 1 0 10.666Z"
      fill="currentColor"
    />
    <path
      d="M8.667 4.667H7.333v3.333l2.667 2.667.943-.943L8.667 7.333V4.667Z"
      fill="currentColor"
    />
  </svg>
);

// --- UTILITY FUNCTIONS ---
// All utility functions are now imported from postAdapter

// --- MEDIA GRID COMPONENT ---
const MediaGrid = ({
  media,
  onMediaClick,
  post,
}: {
  media: Media[];
  onMediaClick: (media: Media[], index: number) => void;
  post: Post;
}) => {
  const count = media.length;
  if (count === 0) return null;

  const [isExpanded, setIsExpanded] = useState(false);

  // Get media source info for journey mapping posts
  const getMediaSourceInfo = (
    mediaIndex: number
  ): { source: string; stopTitle?: string } => {
    if (post.type !== "mapping_journey") {
      return { source: "post" };
    }

    let currentIndex = 0;

    // Check if it's from main post media
    if (post.media && post.media.length > 0) {
      if (mediaIndex < post.media.length) {
        return { source: "post" };
      }
      currentIndex += post.media.length;
    }

    // Check if it's from stops
    if (post.stops && post.stops.length > 0) {
      for (const stop of post.stops) {
        if (stop.media && stop.media.length > 0) {
          if (mediaIndex < currentIndex + stop.media.length) {
            return { source: "stop", stopTitle: stop.title };
          }
          currentIndex += stop.media.length;
        }
      }
    }

    return { source: "post" };
  };

  const renderMedia = (
    mediaItem: Media,
    className: string,
    altIndex: number,
    customAspectRatio?: string
  ) => {
    const mediaUrl = getMediaUrl(mediaItem);
    const isVideoMedia = isVideo(mediaItem);
    const sourceInfo = getMediaSourceInfo(altIndex);

    return (
      <div
        className={`relative ${className} cursor-pointer hover:opacity-90 transition-opacity`}
        style={
          customAspectRatio ? { aspectRatio: customAspectRatio } : undefined
        }
        onClick={() => onMediaClick(media, altIndex)}
      >
        {isVideoMedia ? (
          <div className="w-full h-full relative">
            <video
              src={mediaUrl}
              className="w-full h-full object-cover"
              preload="metadata"
              muted
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayIcon className="w-8 h-8" />
            </div>
          </div>
        ) : (
          <Image
            src={mediaUrl}
            alt={`Post media ${altIndex + 1}`}
            fill
            className="object-cover"
            unoptimized
            onError={(e) => {
              console.error("Post media failed to load:", mediaUrl);
              // Fallback to a placeholder
              const target = e.target as HTMLImageElement;
              target.src =
                "https://via.placeholder.com/400x300?text=Image+Not+Available";
            }}
          />
        )}

        {/* Source indicator for journey mapping posts */}
        {/* {post.type === "mapping_journey" && sourceInfo.source === "stop" && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full opacity-90">
            {sourceInfo.stopTitle}
          </div>
        )} */}
      </div>
    );
  };

  // Single media layout
  if (count === 1) {
    return (
      <div className="mt-4 relative rounded-lg overflow-hidden min-h-[370px] max-h-[370px] 2xl:min-h-[500px] 2xl:max-h-[500px]">
        {renderMedia(
          media[0],
          "w-full h-full min-h-[370px] max-h-[370px] 2xl:min-h-[500px] 2xl:max-h-[500px] object-cover",
          0
        )}
      </div>
    );
  }

  // Multiple media layout - Main image with side thumbnails
  return (
    <div className="mt-4 relative rounded-lg overflow-hidden min-h-[370px] max-h-[370px] 2xl:min-h-[500px] 2xl:max-h-[500px]">
      {/* Main large image/video */}
      <div className="w-full h-full max-h-[370px] min-h-[370px] 2xl:min-h-[500px] 2xl:max-h-[500px] overflow-hidden">
        {renderMedia(
          media[0],
          "w-full h-full object-cover max-h-[370px] min-h-[370px] 2xl:min-h-[500px] 2xl:max-h-[500px]",
          0
        )}
      </div>{" "}
      <div className="absolute bottom-4 right-4 flex w-fit">
        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-white rounded-full p-2 flex items-center justify-center w-fit h-fit absolute z-10 top-1/2 -translate-y-1/2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          {isExpanded ? (
            <ExpandIcon className="w-4 h-4 text-gray-700 rotate-90" />
          ) : (
            <ExpandIcon className="w-4 h-4 text-gray-700 -rotate-90" />
          )}
        </button>

        {/* Thumbnails - Show only when not expanded */}

        <>
          {isExpanded ? (
            <div className="flex items-center mx-auto overflow-x-scroll gap-3 max-w-[750px] scrollbar-hide">
              {media.map((mediaItem, index) => (
                <div
                  key={index}
                  className="relative min-w-[117px] min-h-[117px] max-w-[117px] max-h-[117px] rounded-lg overflow-hidden border border-white shadow-lg transform transition-all hover:scale-105 cursor-pointer"
                >
                  {renderMedia(
                    mediaItem,
                    "min-w-[117px] min-h-[117px] max-w-[117px] max-h-[117px] object-cover",
                    index + 1
                  )}
                </div>
              ))}
            </div>
          ) : (
            media.slice(1, 4).map((mediaItem, index) => (
              <div
                key={index + 1}
                className={`relative w-[117px] h-[117px] rounded-lg overflow-hidden border border-white shadow-lg transform transition-all hover:scale-105 cursor-pointer`}
                style={{
                  marginLeft: isExpanded ? "4px" : index > 0 ? "-80px" : "0",
                  zIndex: index + 1,
                }}
                onClick={() => onMediaClick(media, index + 1)}
              >
                {renderMedia(mediaItem, "w-full h-full", index + 1)}
              </div>
            ))
          )}

          {/* Show count overlay if more than 4 media items */}
          {!isExpanded && count > 4 && (
            <div
              className="relative w-[117px] h-[117px] rounded-lg overflow-hidden border border-white shadow-lg bg-black/60 flex items-center justify-center transform transition-all hover:scale-105 cursor-pointer"
              style={{
                marginLeft: isExpanded ? "4px" : "-80px",
                zIndex: 50,
              }}
              onClick={() => onMediaClick(media, 4)}
            >
              <div className="text-white text-sm font-semibold absolute z-50 h-full w-full flex items-center justify-center bg-black/10">
                +{count - 4}
              </div>
              {renderMedia(media[4], "w-full h-full", 3, "16/9")}
            </div>
          )}
        </>
      </div>
    </div>
  );
};

// --- MAIN POST CARD COMPONENT ---
export const PostCard = ({
  post,
  onCommentAdded,
}: {
  post: Post;
  onCommentAdded?: () => void;
}) => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<Media[]>([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Journey map modal state
  const [isJourneyMapModalOpen, setIsJourneyMapModalOpen] = useState(false);

  // Comment state
  const [commentContent, setCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Collect all media for journey mapping posts (main post media + all stop media)
  const getAllMedia = (): Media[] => {
    const allMedia: Media[] = [];

    // Add main post media
    if (post.media && post.media.length > 0) {
      allMedia.push(...post.media);
    }

    // Add media from all stops for journey mapping posts
    if (
      post.type === "mapping_journey" &&
      post.stops &&
      post.stops.length > 0
    ) {
      console.log(
        "Processing journey mapping post with stops:",
        post.stops.length
      );
      post.stops.forEach((stop, index) => {
        if (stop.media && stop.media.length > 0) {
          console.log(
            `Stop ${index + 1} (${stop.title}) has ${
              stop.media.length
            } media items`
          );
          allMedia.push(...stop.media);
        }
      });
    }

    console.log(
      `Total media collected for post ${post.id}: ${allMedia.length} items`
    );
    return allMedia;
  };

  const allMedia = getAllMedia();

  // Handle media click
  const handleMediaClick = (media: Media[], index: number) => {
    console.log("PostCard - Media clicked:", media);
    console.log("PostCard - Index clicked:", index);
    setCurrentMedia(media);
    setCurrentMediaIndex(index);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Handle journey map modal
  const handleJourneyMapModalOpen = () => {
    setIsJourneyMapModalOpen(true);
  };

  const handleJourneyMapModalClose = () => {
    setIsJourneyMapModalOpen(false);
  };

  // Handle media index change in modal
  const handleMediaIndexChange = (index: number) => {
    setCurrentMediaIndex(index);
  };

  // Fetch comments for the post
  const fetchComments = async () => {
    if (loadingComments) return;

    setLoadingComments(true);
    try {
      // Determine post type based on post properties
      let postType = "posts"; // default
      if (post.type === "mapping_journey") {
        postType = "journeys";
      } else if (post.expires_on && post.is_resolved !== undefined) {
        postType = "advisories";
      } else if (post.story) {
        postType = "footprints";
      } else if (post.title && !post.expires_on && !post.story) {
        postType = "tips";
      }

      console.log("Fetching comments for post:", post.id, "type:", postType);

      const response = await apiRequest<{ data: Comment[] }>(
        `${postType}/${post.id}/comments?per_page=10&page=1&with_replies=true`
      );

      console.log("Comments response:", response);

      const commentsData = response.data || [];
      console.log("Setting comments:", commentsData);
      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  // Load comments when component mounts or when showComments changes
  useEffect(() => {
    if (showComments && comments.length === 0) {
      fetchComments();
    }
  }, [showComments]);

  // Toggle comments visibility
  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) {
      fetchComments();
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentContent.trim() || isSubmittingComment) {
      return;
    }

    setIsSubmittingComment(true);

    try {
      // Determine post type based on post properties
      let postType = "posts"; // default
      if (post.type === "mapping_journey") {
        postType = "journeys";
      } else if (post.expires_on && post.is_resolved !== undefined) {
        postType = "advisories";
      } else if (post.story) {
        postType = "footprints";
      } else if (post.title && !post.expires_on && !post.story) {
        postType = "tips";
      }

      // Create FormData for the comment
      const formData = new FormData();
      formData.append("content", commentContent.trim());

      // Submit comment using the existing API helper (which handles auth automatically)
      const result = await apiFormDataWrapper(
        `${postType}/${post.id}/comments`,
        formData,
        "Comment added successfully!"
      );

      console.log("Comment submitted successfully:", result);

      // Clear the input
      setCommentContent("");

      // Refresh comments to show the new comment
      if (showComments) {
        fetchComments();
      }

      // Call the callback to refresh the parent component
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      // Show error message to user
      toast.error(
        error instanceof Error ? error.message : "Failed to submit comment"
      );
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit(e);
    }
  };

  // Determine post type for styling
  const postType = getPostType(post);
  const isJourney = postType === "journey";
  const isAdvisory = postType === "advisory";
  const isFootprint = postType === "footprint";
  const isTip = postType === "tip";

  // Get display content
  const displayTitle = post.title || post.story;
  const displayContent = post.description || post.story;
  const displayLocation = post.location || post.location_name;

  return (
    <div className="bg-white rounded-lg shadow-md my-4 overflow-hidden">
      <div className="p-6">
        {/* Post Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Image
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  post.user?.name || "Unknown User"
                )}&background=random&size=48`}
                alt={post.user?.name || "Unknown User"}
                width={48}
                height={48}
                className="rounded-full object-cover"
                unoptimized
              />
              {post.user?.type === 1 && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-black text-[14px] font-gilroy">
                {post.user?.name || "Unknown User"}
              </p>

              <div className="flex items-center gap-2 text-xs text-black mt-1 whitespace-nowrap font-gilroy">
                {isJourney &&
                  post.start_location_name &&
                  post.end_location_name && (
                    <div className="flex items-center gap-1 text-sm text-black text-[10px]">
                      <LocationIcon className="w-3 h-3 text-orange-500" />
                      <span className="truncate">
                        {post.start_location_name}
                      </span>
                      <span className="text-orange-500">→</span>
                      <span className="truncate">{post.end_location_name}</span>
                      <span>|</span>
                    </div>
                  )}
                {displayLocation && (
                  <>
                    <span className="flex items-center gap-1 text-black text-[10px]">
                      <LocationIcon className="w-3 h-3 text-orange-500" />
                      <span className="truncate max-w-[200px]">
                        {displayLocation}
                      </span>
                      <span>|</span>
                    </span>
                  </>
                )}
                <span className="text-black text-[10px]">
                  {formatDate(post.created_at)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Post Type Badge */}
            {isJourney && (
              <Image
                src={"/dashboard/jurney.svg"}
                alt={"journey"}
                width={24}
                height={24}
                className="md:w-[20px] md:h-[20px] w-[14px] h-[14px]"
              />
            )}

            {isAdvisory && (
              <Image
                src={"/dashboard/advisory.svg"}
                alt={"advisory"}
                width={24}
                height={24}
                className="md:w-[20px] md:h-[20px] w-[14px] h-[14px]"
              />
            )}

            {isFootprint && (
              <Image
                src={"/dashboard/foot.svg"}
                alt={"footprint"}
                width={24}
                height={24}
                className="md:w-[20px] md:h-[20px] w-[14px] h-[14px]"
              />
            )}

            {isTip && (
              <Image
                src={"/dashboard/trip.svg"}
                alt={"tip"}
                width={24}
                height={24}
                className="md:w-[20px] md:h-[20px] w-[14px] h-[14px]"
              />
            )}

            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <MoreOptionsIcon className="w-5 h-5 text-gray-500" />
            </button>
            <button className="text-2xl text-gray-500">&times;</button>
          </div>
        </div>

        {/* Post Title */}
        {/* {displayTitle && (
          <div className="mt-4">
            <h3
              className={`font-semibold text-gray-800 ${
                isTip
                  ? "text-[35px] font-medium"
                  : isAdvisory
                  ? "text-[18px] md:text-[25px] font-medium"
                  : isFootprint
                  ? "text-[16px] md:text-[18px] font-medium"
                  : "text-lg font-medium"
              }`}
            >
              {displayTitle}
            </h3>
          </div>
        )} */}

        {/* Post Content */}
        {isJourney && post.start_location_name && post.end_location_name && (
          <div className="flex items-center gap-2 text-sm text-black font-gilroy mt-2 text-[12px]">
            <span className="truncate font-semibold">
              Trip to {post.start_location_name}
            </span>
            <span className="">→</span>
            <span className="truncate">{post.end_location_name}</span>
            <button
              type="button"
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
              onClick={handleJourneyMapModalOpen}
            >
              <MapIcon />
              <span className="text-[10px] font-gilroy font-bold">
                View Map
              </span>
            </button>
          </div>
        )}
        {displayContent && allMedia.length === 0 ? (
          <div className="mt-2">
            <p className="text-[30px] font-medium leading-relaxed">
              {displayContent}
            </p>
          </div>
        ) : (
          <div className="mt-1 font-gilroy">
            <p
              className={`leading-relaxed ${
                isTip
                  ? "text-[12px]"
                  : isAdvisory
                  ? "text-[16px]"
                  : isFootprint
                  ? "text-[16px]"
                  : "text-sm"
              }`}
            >
              {displayContent}
            </p>
          </div>
        )}

        {/* Journey Stops Preview */}
        {/* {isJourney && post.stops && post.stops.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm text-gray-700">
                Journey Stops
              </h4>
              {allMedia.length > 0 && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {allMedia.length} total photo
                  {allMedia.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="space-y-3">
              {post.stops.map((stop, index) => (
                <div
                  key={stop.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-orange-600">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm text-gray-800 truncate">
                      {stop.title}
                    </h5>
                    <p className="text-xs text-gray-600 truncate">
                      {stop.location_name}
                    </p>
                    {stop.media && stop.media.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {stop.media.length} photo
                        {stop.media.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                  {stop.transport_mode && (
                    <div className="flex-shrink-0">
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        {stop.transport_mode}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Tagged Users */}
        {/* {post.tagged_users && post.tagged_users.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Tagged:</p>
            <div className="flex flex-wrap gap-2">
              {post.tagged_users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <Image
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name
                    )}&background=random&size=16`}
                    alt={user.name}
                    width={16}
                    height={16}
                    className="rounded-full"
                    unoptimized
                  />
                  <span className="text-xs text-gray-700 font-medium">
                    {user.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Media Grid */}
        {allMedia && allMedia.length > 0 && (
          <MediaGrid
            media={allMedia}
            onMediaClick={handleMediaClick}
            post={post}
          />
        )}

        <div className="mt-2 flex justify-between items-center">
          {/* Mood Tags */}
          {post.mood_tags && post.mood_tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {post.mood_tags.map((tag, index) => (
                <span
                  key={index}
                  className="border rounded-full px-2 py-1 flex items-center gap-1 justify-end cursor-pointer border-[#E1E1E1] text-[#696969] text-[11px] bg-white hover:bg-[#E1E1E1] transition-all duration-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div>
            {post.expires_on && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <ClockIcon className="w-3 h-3" />
                {isExpired(post.expires_on)
                  ? "Expired"
                  : `Expires ${formatDate(post.expires_on)}`}
              </div>
            )}
            {post.is_resolved && (
              <div className="flex items-center gap-1 bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Resolved
              </div>
            )}
            {isAdvisory && !post.is_resolved && (
              <button
                type="button"
                className="text-[#0C8C38] bg-[#DCFCE7] rounded-md p-3 font-bold text-[11px] hover:bg-[#DCFCE7]/80 transition-all duration-200"
              >
                Mark as Resolved
              </button>
            )}
          </div>
        </div>

        {/* Post Footer */}
        <div className="mt-4">
          <div className="flex justify-between items-center text-sm text-[#656565]">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                <HeartIcon className="w-5 h-5" filled={true} /> 0
              </button>
              <button className="flex items-center gap-1.5 hover:text-[#3162E7] transition-colors">
                <LikeIcon className="w-5 h-5" /> 0
              </button>
              <div className="flex items-center gap-2">
                {post.tagged_users && post.tagged_users.length > 0 && (
                  <div className="flex -space-x-2">
                    {post.tagged_users.slice(0, 5).map((user, i) => (
                      <Image
                        key={i}
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name
                        )}&background=random&size=24`}
                        alt={user.name}
                        width={24}
                        height={24}
                        className="rounded-full border-2 border-white object-cover"
                        unoptimized
                      />
                    ))}
                  </div>
                )}
                <span className="text-sm text-[#656565]">
                  {post.tagged_users && post.tagged_users.length > 5
                    ? `${post.tagged_users.length} Participants`
                    : ""}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleComments}
                className="text-sm text-[#656565] hover:text-blue-600 transition-colors"
              >
                {comments.length} Comments {showComments ? "(Hide)" : "(Show)"}
              </button>
              <span className="text-sm text-[#656565]">0 Share</span>
            </div>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="border-t border-gray-100 my-4">
              {loadingComments ? (
                <div className="py-4 text-center text-gray-500">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  Loading comments...
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-4 py-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 items-start">
                      <Image
                        src={
                          typeof comment.user.avatarUrl === "string"
                            ? comment.user.avatarUrl
                            : "https://placehold.co/400"
                        }
                        alt={comment.user.name}
                        width={32}
                        height={32}
                        className="rounded-full object-contain flex-shrink-0"
                        unoptimized
                      />
                      <div className="flex-1 min-w-0">
                        <div className="inline-block bg-gray-50 rounded-2xl px-3 py-2 max-w-full">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-gray-800">
                              {comment.user.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {comment.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-1 break-words leading-relaxed">
                            {comment.content}
                          </p>
                          <div className="flex items-center gap-3 text-xs">
                            <button className="text-gray-500 hover:text-gray-700 transition-colors">
                              Like
                            </button>
                            <button className="text-gray-500 hover:text-gray-700 transition-colors">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-gray-500">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>
          )}

          {/* Comment Input */}
          <div className="border-t border-gray-100 my-4"></div>
          <form
            onSubmit={handleCommentSubmit}
            className="flex items-center gap-3 group"
          >
            <div className="flex items-center px-4 gap-2 w-full">
              <EmojiIcon className="hover:text-yellow-400" />
              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full bg-transparent outline-none py-2 text-sm flex-1"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSubmittingComment}
              />
              <button
                type="submit"
                className={`group-hover:flex bg-gradient-to-r from-[#247CFF] to-[#0F62DE] text-white px-4 py-1.5 rounded-full text-sm font-semibold hidden cursor-pointer items-center gap-2 h-fit w-fit ${
                  isSubmittingComment ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmittingComment || !commentContent.trim()}
              >
                {isSubmittingComment ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlSpace="preserve"
                    width="20"
                    height="20"
                    viewBox="0 0 256 256"
                  >
                    <path
                      fill="white"
                      strokeMiterlimit="10"
                      strokeWidth="0"
                      d="M254.304 10.047a8.758 8.758 0 0 0-.107-1.576c-.02-.115-.025-.228-.05-.343a8 8 0 0 0-.405-1.36c-.05-.13-.115-.25-.172-.376a8 8 0 0 0-.511-.973 10 10 0 0 0-.245-.388 8.4 8.4 0 0 0-.958-1.171 8.6 8.6 0 0 0-1.545-1.197 8 8 0 0 0-1.023-.537c-.11-.048-.214-.104-.326-.149a8.3 8.3 0 0 0-1.397-.413c-.087-.017-.177-.023-.264-.04a8.3 8.3 0 0 0-1.604-.115 8 8 0 0 0-1.189.116c-.098.016-.194.022-.292.042-.433.087-.86.205-1.281.362L6.875 90.51a8.43 8.43 0 0 0-5.46 7.511 8.44 8.44 0 0 0 4.757 7.975l96.819 46.724 46.722 96.819a8.44 8.44 0 0 0 7.98 4.76 8.44 8.44 0 0 0 7.511-5.46l88.583-236.057c.157-.418.272-.843.36-1.272.022-.116.03-.228.047-.343q.093-.557.11-1.119m-41.906 21.348L107.582 136.21 31.246 99.374zm-56.06 193.072-36.836-76.333 104.82-104.82z"
                    ></path>
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Media Modal */}
      <MediaModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        media={currentMedia.map((m) => {
          // Determine media type more accurately
          const mediaType = m.media_type || m.type;
          let type: "image" | "video" = "image"; // default to image

          if (mediaType === "video") {
            type = "video";
          } else if (
            mediaType === "image" ||
            mediaType === "photo" ||
            !mediaType
          ) {
            type = "image";
          }

          const mappedMedia = {
            type,
            url: m.file_path || m.url || "",
          };

          console.log("PostCard - Mapping media:", m, "to:", mappedMedia);
          return mappedMedia;
        })}
        currentIndex={currentMediaIndex}
        onIndexChange={handleMediaIndexChange}
        postTitle={displayTitle}
        postDescription={displayContent}
      />

      {/* Journey Map Modal */}
      {isJourney && (
        <JourneyMapModal
          isOpen={isJourneyMapModalOpen}
          onClose={handleJourneyMapModalClose}
          post={post}
        />
      )}
    </div>
  );
};

export default PostCard;
