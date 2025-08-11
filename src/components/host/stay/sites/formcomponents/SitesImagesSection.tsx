"use client";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { apiFormDataWrapper } from "@/lib/api";

// Zod validation schema for site images
const siteImagesSchema = z.object({
  media_images: z.array(z.any()).min(1, "At least one image is required"),
  cover_image: z.any().refine((val) => val !== null, "Cover image is required"),
  media_video: z.any().optional(),
  video_url: z.string().optional(),
});

type SiteImagesFormData = z.infer<typeof siteImagesSchema>;

interface SitesImagesSectionProps {
  propertyId: string;
  siteId?: string | null;
  isEditMode?: boolean;
  onSuccess?: () => void;
  siteData?: any;
}

export default function SitesImagesSection({
  propertyId,
  siteId,
  isEditMode = false,
  onSuccess,
  siteData,
}: SitesImagesSectionProps) {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [coverImageError, setCoverImageError] = useState("");
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [existingCoverImage, setExistingCoverImage] = useState<any>(null);
  const [existingVideo, setExistingVideo] = useState<any>(null);
  const [dataSent, setDataSent] = useState(false);
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    setError,
    clearErrors,
  } = useForm<SiteImagesFormData>({
    resolver: zodResolver(siteImagesSchema),
    mode: "onTouched",
    defaultValues: {
      media_images: [],
      cover_image: null,
      media_video: null,
      video_url: "",
    },
  });

  // Populate form data when siteData is available in edit mode
  useEffect(() => {
    if (isEditMode && siteData) {
      // Set existing images
      if (siteData.media && siteData.media.length > 0) {
        setExistingImages(siteData.media);
      }

      // Set existing cover image
      if (siteData.cover_image) {
        setExistingCoverImage(siteData.cover_image);
      }

      // Set existing video
      if (siteData.video_url) {
        setExistingVideo(siteData.video_url);
        setVideoUrl(siteData.video_url);
      }
    }
  }, [siteData, isEditMode]);

  // Watch form values for real-time updates
  const formData = watch();

  // Update form values when images change
  useEffect(() => {
    const allImages = [...uploadedImages, ...existingImages];
    setValue("media_images", allImages);
    if (allImages.length > 0) {
      clearErrors("media_images");
      setImageError("");
    }
  }, [uploadedImages, existingImages, setValue, clearErrors]);

  // Update form values when cover image changes
  useEffect(() => {
    const finalCoverImage = coverImage || existingCoverImage;
    setValue("cover_image", finalCoverImage);
    if (finalCoverImage) {
      clearErrors("cover_image");
      setCoverImageError("");
    }
  }, [coverImage, existingCoverImage, setValue, clearErrors]);

  const handleFileUpload = (
    files: File[],
    type: "image" | "video" = "image"
  ) => {
    if (type === "image") {
      setUploadedImages((prev) => [...prev, ...files]);
    } else {
      setUploadedVideo(files[0] || null);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setUploadedVideo(null);
  };

  // Form submission handler
  const onSubmit = async (data: SiteImagesFormData) => {
    console.log("Form data:", data);

    // Validate images and cover image before submission
    const hasImages = uploadedImages.length > 0 || existingImages.length > 0;
    if (!hasImages) {
      setError("media_images", { message: "At least one image is required" });
      setImageError("At least one image is required");
      return;
    }

    const hasCoverImage = coverImage !== null || existingCoverImage !== null;
    if (!hasCoverImage) {
      setError("cover_image", { message: "Cover image is required" });
      setCoverImageError("Cover image is required");
      return;
    }

    try {
      // Construct FormData for file and text fields
      const formData = new FormData();

      // Add site_id
      if (siteId) {
        formData.append("site_id", siteId);
      }

      // Add site_id for edit mode
      if (isEditMode && siteData?.id) {
        formData.append("site_id", siteData.id.toString());
      }

      // Append uploaded images as media_images[]
      if (uploadedImages.length > 0) {
        uploadedImages.forEach((file) => {
          formData.append("media_images[]", file);
        });
      }

      // Append uploaded video as media_video[]
      if (uploadedVideo) {
        formData.append("media_video[]", uploadedVideo);
      }

      // Append cover image
      if (coverImage) {
        formData.append("cover_image", coverImage);
      }

      // Append video URL if provided
      if (videoUrl.trim()) {
        formData.append("video_url", videoUrl);
      }

      const response = await apiFormDataWrapper<{
        success: boolean;
        message: string;
      }>(
        `properties/${propertyId}/sites/media`,
        formData,
        isEditMode
          ? "Site media updated successfully!"
          : "Site media saved successfully!"
      );

      console.log("Site images saved successfully:", response);

      // Mark section as completed
      if (onSuccess) {
        onSuccess();
      }
      setDataSent(true);
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Something went wrong while submitting.");
    }
  };

  const handleSaveClick = async () => {
    // Trigger form validation and submission
    const isValid = await handleSubmit(onSubmit)();
    return isValid;
  };

  // Helper function to check if form is valid
  const isFormValid = () => {
    // Check if there are images (either uploaded or existing)
    const hasImages = uploadedImages.length > 0 || existingImages.length > 0;

    // Check if there's a cover image (either uploaded or existing)
    const hasCoverImage = coverImage !== null || existingCoverImage !== null;

    return hasImages && hasCoverImage;
  };

  return (
    <div>
      <h4 className="text-[14px] md:text-[16px] text-[#1C231F] font-semibold mb-4">
        Site Images/Videos
      </h4>

      <div className="space-y-6">
        <div className="p-2 md:p-4 bg-white rounded-lg shadow-sm">
          {/* Upload Images Section */}
          <div className="mb-8">
            <label className="block text-[14px] md:text-[16px] text-left font-medium text-[#1C231F] mb-3">
              Upload Images
            </label>
            <div className="grid grid-cols-5 gap-4 mb-3 max-w-[541px]">
              {/* Display existing images in edit mode */}
              {isEditMode &&
                existingImages.map((media: any, index: number) => (
                  <div key={`existing-${index}`} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={
                          media.file_path ||
                          "https://via.placeholder.com/150?text=No+Image"
                        }
                        alt={`Existing ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs">Existing</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        // Remove existing image
                        setExistingImages((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                      className="absolute z-10 -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}

              {/* Display uploaded images */}
              {uploadedImages.map((file, index) => (
                <div key={`uploaded-${index}`} className="relative group">
                  <div className="aspect-square max-w-[106px] max-h-[106px] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute z-10 -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}

              {/* Upload image button */}
              <div className="aspect-square max-w-[106px] max-h-[106px] p-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
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
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <span className="text-[#464444] text-2xl font-bold mb-1">
                    +
                  </span>
                  <span className="text-[#464444] text-[10px] text-xs">
                    Upload Image
                  </span>
                </label>
              </div>
            </div>
            {/* Image validation error */}
            {(errors.media_images?.message || imageError) && (
              <div className="text-red-500 text-xs mt-1">
                {typeof errors.media_images?.message === "string"
                  ? errors.media_images.message
                  : imageError}
              </div>
            )}

            {/* Info message for existing images */}
            {isEditMode &&
              existingImages.length > 0 &&
              uploadedImages.length === 0 && (
                <div className="text-blue-600 text-xs mt-1">
                  ✓ Using {existingImages.length} existing image
                  {existingImages.length > 1 ? "s" : ""}
                </div>
              )}
          </div>

          {/* Upload Video Section */}
          <div className="mb-8">
            <label className="block text-[14px] md:text-[16px] text-left font-medium text-[#1C231F] mb-3">
              Upload Video
            </label>
            <div className="max-w-[106px]">
              {/* Display existing video in edit mode */}
              {isEditMode && existingVideo && !uploadedVideo && (
                <div className="relative group">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <video
                      src={existingVideo}
                      controls
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs">Existing Video</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 truncate">
                    Existing Video
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      // Remove existing video
                      setExistingVideo(null);
                    }}
                    className="absolute z-10 -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}

              {uploadedVideo ? (
                <div className="relative group">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <video
                      src={URL.createObjectURL(uploadedVideo)}
                      controls
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setUploadedVideo(null)}
                      className="absolute z-10 -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 truncate">
                    {uploadedVideo.name}
                  </div>
                </div>
              ) : (
                <div className="aspect-video border-2 p-4 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0 && !uploadedVideo) {
                        setUploadedVideo(files[0]);
                      }
                    }}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <span className="text-[#464444] text-2xl font-bold mb-1">
                      +
                    </span>
                    <span className="text-[#464444] text-[10px] text-xs">
                      Upload Video
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Info message for existing video */}
            {isEditMode && existingVideo && !uploadedVideo && (
              <div className="text-blue-600 text-xs mt-1">
                ✓ Using existing video
              </div>
            )}
          </div>

          {/* Choose Cover Image Section */}
          <div className="mb-8">
            <label className="block text-[14px] md:text-[16px] text-left font-medium text-[#1C231F] mb-3">
              Cover Image
            </label>
            <div className="max-w-[180px]">
              {/* Existing cover image in edit mode */}
              {isEditMode && existingCoverImage && !coverImage && (
                <div className="relative group">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={
                        typeof existingCoverImage === "string"
                          ? existingCoverImage
                          : existingCoverImage.file_path?.replace(/\\/g, "") ||
                            "https://via.placeholder.com/150?text=No+Image"
                      }
                      alt="Existing cover image"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs">Existing Cover</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 truncate">
                    Existing Cover Image
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      // Remove existing cover image
                      setExistingCoverImage(null);
                    }}
                    className="absolute z-10 -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}

              {coverImage ? (
                <div className="relative group">
                  <div className="aspect-video max-w-[180px]  bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={URL.createObjectURL(coverImage)}
                      alt="Cover image"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setCoverImage(null)}
                      className="absolute z-10 -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 truncate">
                    {coverImage.name}
                  </div>
                </div>
              ) : (
                <div className="aspect-video max-w-[180px] border-2 p-4 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0 && !coverImage) {
                        setCoverImage(files[0]);
                      }
                    }}
                    className="hidden"
                    id="cover-upload"
                  />
                  <label
                    htmlFor="cover-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <span className="text-[#464444] text-2xl font-bold mb-1">
                      +
                    </span>
                    <span className="text-[#464444] text-[10px] text-xs">
                      Upload cover
                    </span>
                  </label>
                </div>
              )}
            </div>
            {/* Cover image validation error */}
            {(errors.cover_image?.message || coverImageError) && (
              <div className="text-red-500 text-xs mt-1">
                {typeof errors.cover_image?.message === "string"
                  ? errors.cover_image.message
                  : coverImageError}
              </div>
            )}

            {/* Info message for existing cover image */}
            {isEditMode && existingCoverImage && !coverImage && (
              <div className="text-blue-600 text-xs mt-1">
                ✓ Using existing cover image
              </div>
            )}
          </div>

          {/* Add 360 Video Section */}
          <div>
            <label className="block text-[14px] md:text-[16px] text-left font-medium text-[#1C231F] mb-1">
              Add 360 video
            </label>
            <div className="max-w-md">
              <input
                type="url"
                placeholder="URL link"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 gap-4">
            <button
              type="button"
              onClick={handleSaveClick}
              disabled={isSubmitting || !isFormValid()}
              className={` w-[158px] mt-2 h-[35px] font-[500] text-[14px] text-white px-4 md:px-10 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                isSubmitting || !isFormValid()
                  ? "bg-[#BABBBC] cursor-not-allowed"
                  : "bg-[#237AFC]"
              }`}
            >
              {dataSent
                ? "Saved"
                : isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Update"
                : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
