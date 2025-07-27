"use client";
import React, { useState, useCallback } from "react";
import { useSitesForm } from "../hooks/useSitesForm";
import FormError from "./FormError";

interface SiteImagesSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  formMethods: ReturnType<typeof useSitesForm>;
}

const SiteImagesSection: React.FC<SiteImagesSectionProps> = ({
  sectionRef,
  formMethods,
}) => {
  const {
    uploadedImages,
    uploadedVideos,
    coverImage,
    updateUploadedImages,
    updateUploadedVideos,
    updateCoverImage,
    saveSection,
    isSaving,
    formState: { errors },
  } = formMethods;

  const [dragActive, setDragActive] = useState(false);

  const handleSaveSection = async () => {
    await saveSection("images");
  };

  const handleFileUpload = useCallback(
    (files: File[], type: "images" | "videos") => {
      const validFiles = Array.from(files).filter((file) => {
        if (type === "images") {
          return (
            file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024
          ); // 10MB limit
        } else {
          return (
            file.type.startsWith("video/") && file.size <= 100 * 1024 * 1024
          ); // 100MB limit
        }
      });

      if (type === "images") {
        const newImages = [...uploadedImages, ...validFiles].slice(0, 20); // Max 20 images
        updateUploadedImages(newImages);
      } else {
        const newVideos = [...uploadedVideos, ...validFiles].slice(0, 5); // Max 5 videos
        updateUploadedVideos(newVideos);
      }
    },
    [uploadedImages, uploadedVideos, updateUploadedImages, updateUploadedVideos]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, type: "images" | "videos") => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      handleFileUpload(files, type);
    },
    [handleFileUpload]
  );

  const removeFile = useCallback(
    (index: number, type: "images" | "videos") => {
      if (type === "images") {
        const newImages = uploadedImages.filter((_, i) => i !== index);
        updateUploadedImages(newImages);
        // If removed file was cover image, clear cover image
        if (coverImage === uploadedImages[index]) {
          updateCoverImage(null);
        }
      } else {
        const newVideos = uploadedVideos.filter((_, i) => i !== index);
        updateUploadedVideos(newVideos);
      }
    },
    [
      uploadedImages,
      uploadedVideos,
      coverImage,
      updateUploadedImages,
      updateUploadedVideos,
      updateCoverImage,
    ]
  );

  const setCoverImageHandler = useCallback(
    (file: File) => {
      updateCoverImage(file);
    },
    [updateCoverImage]
  );

  return (
    <section ref={sectionRef} className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Site Images/Videos
        </h2>
        <button
          type="button"
          onClick={handleSaveSection}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save Section"}
        </button>
      </div>

      <div className="space-y-8">
        {/* Images Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Images
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Upload up to 20 images. First image will be used as cover unless you
            select a different cover image.
          </p>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={(e) => handleDrop(e, "images")}
          >
            <input
              type="file"
              id="images-upload"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  handleFileUpload(Array.from(e.target.files), "images");
                }
              }}
              className="hidden"
            />
            <label
              htmlFor="images-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <svg
                className="w-12 h-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-lg font-medium text-gray-700">
                Drop images here or click to upload
              </span>
              <span className="text-sm text-gray-500 mt-1">
                PNG, JPG, JPEG up to 10MB each
              </span>
            </label>
          </div>

          {/* Uploaded Images */}
          {uploadedImages.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Uploaded Images ({uploadedImages.length}/20)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {uploadedImages.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Cover Image Badge */}
                    {(coverImage === file || (index === 0 && !coverImage)) && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Cover
                      </div>
                    )}

                    {/* Actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                      {coverImage !== file && index !== 0 && (
                        <button
                          type="button"
                          onClick={() => setCoverImageHandler(file)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                        >
                          Set Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(index, "images")}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <FormError error={errors.uploadedImages?.message} />
        </div>

        {/* Videos Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Videos (Optional)
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Upload up to 5 videos to showcase your site.
          </p>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={(e) => handleDrop(e, "videos")}
          >
            <input
              type="file"
              id="videos-upload"
              multiple
              accept="video/*"
              onChange={(e) => {
                if (e.target.files) {
                  handleFileUpload(Array.from(e.target.files), "videos");
                }
              }}
              className="hidden"
            />
            <label
              htmlFor="videos-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <svg
                className="w-12 h-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span className="text-lg font-medium text-gray-700">
                Drop videos here or click to upload
              </span>
              <span className="text-sm text-gray-500 mt-1">
                MP4, MOV, AVI up to 100MB each
              </span>
            </label>
          </div>

          {/* Uploaded Videos */}
          {uploadedVideos.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Uploaded Videos ({uploadedVideos.length}/5)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uploadedVideos.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <video
                        src={URL.createObjectURL(file)}
                        className="w-full h-full object-cover"
                        controls={false}
                        muted
                      />
                    </div>

                    {/* Video Info */}
                    <div className="mt-2 text-sm text-gray-600 truncate">
                      {file.name}
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeFile(index, "videos")}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <FormError error={errors.uploadedVideos?.message} />
        </div>
      </div>
    </section>
  );
};

export default SiteImagesSection;
