"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ImageSkeleton } from "./LoadingSkeleton";

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: { type: "image" | "video"; url: string }[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  postTitle?: string;
  postDescription?: string;
}

const MediaModal: React.FC<MediaModalProps> = ({
  isOpen,
  onClose,
  media,
  currentIndex,
  onIndexChange,
  postTitle,
  postDescription,
}) => {
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
    aspectRatio: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (currentIndex > 0) {
            onIndexChange(currentIndex - 1);
          }
          break;
        case "ArrowRight":
          if (currentIndex < media.length - 1) {
            onIndexChange(currentIndex + 1);
          }
          break;
        case " ":
          // Space bar to play/pause video
          e.preventDefault();
          if (videoRef.current && media[currentIndex]?.type === "video") {
            if (videoRef.current.paused) {
              videoRef.current.play();
            } else {
              videoRef.current.pause();
            }
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, media.length, onClose, onIndexChange, media]);

  // Load image dimensions when current media changes
  useEffect(() => {
    if (!isOpen || !media[currentIndex]) return;

    const currentMedia = media[currentIndex];

    if (currentMedia.type === "image") {
      setIsLoading(true);

      // Only run on client
      if (typeof window !== "undefined") {
        const img = new window.Image();
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          setImageDimensions({
            width: img.width,
            height: img.height,
            aspectRatio,
          });
          setIsLoading(false);
        };
        img.onerror = () => {
          setImageDimensions({ width: 1, height: 1, aspectRatio: 1 });
          setIsLoading(false);
        };
        img.src = currentMedia.url;
      } else {
        // Fallback for SSR
        setIsLoading(false);
        setImageDimensions({ width: 1, height: 1, aspectRatio: 1 });
      }
    } else {
      // For videos, we don't need to load dimensions
      setIsLoading(false);
      setImageDimensions(null);
    }
  }, [currentIndex, media, isOpen]);

  // Handle video play/pause when switching between media
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [currentIndex]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentMedia = media[currentIndex];
  const hasMultipleMedia = media.length > 1;

  // Safety check: if no current media is available, don't render
  if (!currentMedia) {
    console.warn("MediaModal - No current media available:", {
      currentIndex,
      mediaLength: media.length,
    });
    return null;
  }

  // Debug logging
  console.log("MediaModal - Current media:", currentMedia);
  console.log("MediaModal - All media:", media);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 bg-white text-gray-800 hover:bg-gray-100 transition-colors rounded-full p-3 shadow-lg"
        aria-label="Close modal"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Main modal content */}
      <div className="relative w-full max-w-4xl h-full max-h-[90vh] bg-transparent rounded-lg overflow-hidden flex flex-col">
        {/* Main image/video section */}
        <div className="relative flex-1 bg-gray-900">
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-full">
              <ImageSkeleton width="w-full" height="h-full" />
            </div>
          ) : (
            <div className="relative w-full h-full">
              {currentMedia.type === "image" ? (
                <Image
                  src={currentMedia.url}
                  alt={`Image ${currentIndex + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                  onError={(e) => {
                    console.error("Image failed to load:", currentMedia.url);
                    // Fallback to a placeholder
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/400x300?text=Image+Not+Available";
                  }}
                />
              ) : (
                <video
                  ref={videoRef}
                  src={currentMedia.url}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}

              {/* Text overlay */}
              {(postTitle || postDescription) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                  {postTitle && (
                    <h2 className="text-white text-2xl font-bold mb-2">
                      {postTitle}
                    </h2>
                  )}
                  {postDescription && (
                    <p className="text-white/90 text-sm leading-relaxed">
                      {postDescription}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation arrows */}
          {hasMultipleMedia && (
            <>
              {currentIndex > 0 && (
                <button
                  onClick={() => onIndexChange(currentIndex - 1)}
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-800 p-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                  aria-label="Previous media"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15,18 9,12 15,6"></polyline>
                  </svg>
                </button>
              )}

              {currentIndex < media.length - 1 && (
                <button
                  onClick={() => onIndexChange(currentIndex + 1)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-800 p-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                  aria-label="Next media"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </button>
              )}
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        {hasMultipleMedia && (
          <div className="bg-transparent p-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {media.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onIndexChange(index)}
                  className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? "border-blue-500 "
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  {item.type === "image" ? (
                    <Image
                      src={item.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                      onError={(e) => {
                        console.error("Thumbnail failed to load:", item.url);
                        // Fallback to a placeholder
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://via.placeholder.com/80x80?text=Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <polygon points="5,3 19,12 5,21 5,3"></polygon>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
        aria-label="Close modal"
      />
    </div>
  );
};

export default MediaModal;
