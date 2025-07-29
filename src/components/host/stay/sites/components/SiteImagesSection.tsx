"use client";
import React, { useState, useCallback } from "react";
import { useSitesForm } from "../contexts/SitesFormContext";
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";

interface SiteImagesSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

interface ValidationErrors {
  images?: string;
  video?: string;
  coverImage?: string;
}

const SiteImagesSection = ({ sectionRef }: SiteImagesSectionProps) => {
  const {
    state,
    updateUploadedImages,
    updateUploadedVideos,
    updateCoverImage,
  } = useSitesForm();
  const searchParams = useSearchParams();
  const propertyId = searchParams ? searchParams.get("propertyId") : null;
  const siteId = searchParams ? searchParams.get("siteId") : null;

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // File validation constants
  const IMAGE_TYPES = [".jpg", ".jpeg", ".png", ".webp"];
  const VIDEO_TYPES = [".mp4", ".mov", ".webm"];
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_VIDEO_DURATION = 60; // 60 seconds
  const MAX_IMAGES = 10;
  const MIN_IMAGES = 3;

  // Validate file type
  const validateFileType = (file: File, allowedTypes: string[]): boolean => {
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    return allowedTypes.includes(extension);
  };

  // Validate file size
  const validateFileSize = (file: File, maxSize: number): boolean => {
    return file.size <= maxSize;
  };

  // Compress image if needed
  const compressImage = async (file: File): Promise<File> => {
    if (file.size <= MAX_IMAGE_SIZE) return file;

    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;
        const maxDimension = 1920;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          0.8
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Validate video duration
  const validateVideoDuration = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration <= MAX_VIDEO_DURATION);
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        resolve(false);
      };

      video.src = URL.createObjectURL(file);
    });
  };

  // Handle file upload with validation
  const handleFileUpload = async (
    files: File[],
    type: "image" | "video" | "cover" = "image"
  ) => {
    const errors: ValidationErrors = { ...validationErrors };

    try {
      if (type === "image") {
        // Check if adding more images would exceed limit
        if (state.uploadedImages.length + files.length > MAX_IMAGES) {
          errors.images = `Maximum ${MAX_IMAGES} images allowed`;
          setValidationErrors(errors);
          return;
        }

        const validFiles: File[] = [];

        for (const file of files) {
          if (!validateFileType(file, IMAGE_TYPES)) {
            errors.images = `Invalid file type. Supported types: ${IMAGE_TYPES.join(
              ", "
            )}`;
            setValidationErrors(errors);
            return;
          }

          if (!validateFileSize(file, MAX_IMAGE_SIZE)) {
            // Compress the image
            const compressedFile = await compressImage(file);
            validFiles.push(compressedFile);
          } else {
            validFiles.push(file);
          }
        }

        updateUploadedImages([...state.uploadedImages, ...validFiles]);
        delete errors.images;
      } else if (type === "video") {
        if (state.uploadedVideos.length >= 1) {
          errors.video = "Only 1 video is allowed";
          setValidationErrors(errors);
          return;
        }

        const file = files[0];
        if (!validateFileType(file, VIDEO_TYPES)) {
          errors.video = `Invalid file type. Supported types: ${VIDEO_TYPES.join(
            ", "
          )}`;
          setValidationErrors(errors);
          return;
        }

        if (!validateFileSize(file, MAX_VIDEO_SIZE)) {
          errors.video = "Video file size must be less than 50MB";
          setValidationErrors(errors);
          return;
        }

        const isValidDuration = await validateVideoDuration(file);
        if (!isValidDuration) {
          errors.video = "Video duration must be 60 seconds or less";
          setValidationErrors(errors);
          return;
        }

        updateUploadedVideos([file]);
        delete errors.video;
      } else if (type === "cover") {
        const file = files[0];
        if (!validateFileType(file, IMAGE_TYPES)) {
          errors.coverImage = `Invalid file type. Supported types: ${IMAGE_TYPES.join(
            ", "
          )}`;
          setValidationErrors(errors);
          return;
        }

        if (!validateFileSize(file, MAX_IMAGE_SIZE)) {
          // Compress the image
          const compressedFile = await compressImage(file);
          updateCoverImage(compressedFile);
        } else {
          updateCoverImage(file);
        }
        delete errors.coverImage;
      }

      setValidationErrors(errors);
    } catch (error) {
      console.error("File processing error:", error);
      toast.error("An error occurred while processing the file");
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = state.uploadedImages.filter((_, i) => i !== index);
    updateUploadedImages(newImages);
  };

  // Remove video
  const removeVideo = (index: number) => {
    const newVideos = state.uploadedVideos.filter((_, i) => i !== index);
    updateUploadedVideos(newVideos);
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, type: "image" | "video" | "cover") => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileUpload(files, type);
      }
    },
    []
  );

  // Reorder images
  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...state.uploadedImages];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    updateUploadedImages(newImages);
  };

  const handleSave = async () => {
    // Validate minimum images
    if (state.uploadedImages.length < MIN_IMAGES) {
      setValidationErrors({
        ...validationErrors,
        images: `At least ${MIN_IMAGES} images are required`,
      });
      return;
    }

    // Validate cover image
    if (!state.coverImage) {
      setValidationErrors({
        ...validationErrors,
        coverImage: "Cover image is required",
      });
      return;
    }

    const formData = new FormData();

    // Append media_images[] (multiple files)
    state.uploadedImages.forEach((image) => {
      //@ts-ignore
      formData.append("site_id", siteId);
      formData.append("media_images[]", image);
    });

    // Append cover_image (single file)
    if (state.coverImage) {
      formData.append("cover_image", state.coverImage);
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token missing");
      return;
    }

    try {
      setIsUploading(true);
      const response = await fetch(
        `https://api.hightribe.com/api/properties/${propertyId}/sites/media`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: formData,
        }
      );

      const data = await response.json();
      // if (data.message) {
      //   toast.success(data.message);
      // }

      if (response.ok) {
        toast.success("Media uploaded successfully");
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div ref={sectionRef}>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Site Images/Videos
        </h2>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-sm mt-4">
        {/* Upload Images Section */}
        <div className="mb-8">
          <label className="block text-[14px] font-medium text-[#1C231F] mb-4">
            Upload images
          </label>

          <div className="grid grid-cols-5 gap-4 mb-3">
            {/* Display uploaded images */}
            {state.uploadedImages.map((file, index) => (
              <div
                key={index}
                className="relative group cursor-move"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", index.toString());
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const fromIndex = parseInt(
                    e.dataTransfer.getData("text/plain")
                  );
                  reorderImages(fromIndex, index);
                }}
              >
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  <button
                    onClick={() => removeImage(index)}
                    className="absolute z-10 -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}

            {state.uploadedImages.length < MAX_IMAGES && (
              <div
                className={`aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, "image")}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    handleFileUpload(files, "image");
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <span className="text-gray-400 text-2xl mb-1">+</span>
                  <span className="text-gray-500 text-xs">Upload image</span>
                </label>
              </div>
            )}
          </div>
          {validationErrors.images && (
            <p className="text-red-500 text-sm mt-2">
              {validationErrors.images}
            </p>
          )}
        </div>

        {/* Upload Video Section */}
        <div className="mb-8">
          <label className="block text-[14px] font-medium text-[#1C231F] mb-4">
            Upload optimal short video
          </label>

          <div className="grid grid-cols-5 gap-4">
            {/* Display uploaded videos */}
            {state.uploadedVideos.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <video
                    src={URL.createObjectURL(file)}
                    className="w-full h-full object-cover"
                    controls
                  />
                  <button
                    onClick={() => removeVideo(index)}
                    className="absolute z-10 -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500 truncate">
                  {file.name}
                </div>
              </div>
            ))}

            {/* Video upload button */}
            {state.uploadedVideos.length === 0 && (
              <div
                className={`aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, "video")}
              >
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    handleFileUpload(files, "video");
                  }}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <span className="text-gray-400 text-2xl mb-1">+</span>
                  <span className="text-gray-500 text-xs">Upload video</span>
                </label>
              </div>
            )}
          </div>
          {validationErrors.video && (
            <p className="text-red-500 text-sm mt-2">
              {validationErrors.video}
            </p>
          )}
        </div>

        {/* Choose Cover Image Section */}
        <div>
          <label className="block text-[14px] font-medium text-[#1C231F] mb-4">
            Choose a cover images
          </label>
          <div className="max-w-xs">
            {state.coverImage ? (
              <div className="relative group">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={URL.createObjectURL(state.coverImage)}
                    alt="Cover image"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => updateCoverImage(null)}
                    className="absolute z-10 -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500 truncate">
                  {state.coverImage.name}
                </div>
              </div>
            ) : (
              <div
                className={`aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, "cover")}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    handleFileUpload(files, "cover");
                  }}
                  className="hidden"
                  id="cover-upload"
                />
                <label
                  htmlFor="cover-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <span className="text-gray-400 text-2xl mb-1">+</span>
                  <span className="text-gray-500 text-xs">Upload cover</span>
                </label>
              </div>
            )}
          </div>
          {validationErrors.coverImage && (
            <p className="text-red-500 text-sm mt-2">
              {validationErrors.coverImage}
            </p>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteImagesSection;
