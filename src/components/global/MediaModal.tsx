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
}

const MediaModal: React.FC<MediaModalProps> = ({
  isOpen,
  onClose,
  media,
  currentIndex,
  onIndexChange,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
        aria-label="Close modal"
      >
        <svg
          width="32"
          height="32"
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

      {/* Navigation buttons */}
      {hasMultipleMedia && (
        <>
          {/* Previous button */}
          {currentIndex > 0 && (
            <button
              onClick={() => onIndexChange(currentIndex - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Previous media"
            >
              <svg
                width="24"
                height="24"
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

          {/* Next button */}
          {currentIndex < media.length - 1 && (
            <button
              onClick={() => onIndexChange(currentIndex + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Next media"
            >
              <svg
                width="24"
                height="24"
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

      {/* Media counter */}
      {hasMultipleMedia && (
        <div className="absolute top-4 left-4 z-10 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {media.length}
        </div>
      )}

      {/* Main media container */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-full">
            <ImageSkeleton width="w-96" height="h-64" />
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {currentMedia.type === "image" ? (
              <Image
                src={currentMedia.url}
                alt={`Image ${currentIndex + 1}`}
                width={imageDimensions?.width || 800}
                height={imageDimensions?.height || 600}
                className="max-w-full max-h-full object-contain"
                unoptimized
                priority
              />
            ) : (
              <video
                ref={videoRef}
                src={currentMedia.url}
                className="max-w-full max-h-full object-contain"
                controls
                autoPlay
                muted
                loop
                playsInline
              />
            )}
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
