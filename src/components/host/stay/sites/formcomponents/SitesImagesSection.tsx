"use client";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";

// Zod validation schema for site images
const siteImagesSchema = z.object({
  images: z.array(z.any()).min(1, "At least one image is required"),
  cover_image: z.any().refine((val) => val !== null, "Cover image is required"),
  video: z.any().optional(),
  video_url: z.string().optional(),
});

type SiteImagesFormData = z.infer<typeof siteImagesSchema>;

interface SitesImagesSectionProps {
  siteId?: string | null;
  isEditMode?: boolean;
}

export default function SitesImagesSection({
  siteId,
  isEditMode = false,
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
  const [isLoadingSite, setIsLoadingSite] = useState(false);

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
      images: [],
      cover_image: null,
      video: null,
      video_url: "",
    },
  });

  // Fetch site data when in edit mode
  useEffect(() => {
    if (isEditMode && siteId) {
      fetchSiteData();
    }
  }, [isEditMode, siteId]);

  const fetchSiteData = async () => {
    if (!siteId) return;

    setIsLoadingSite(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token") || ""
          : "";
      const response = await fetch(
        `https://api.hightribe.com/api/sites/${siteId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch site data");
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);

      const siteData = responseData.data || responseData;

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
    } catch (error) {
      console.error("Error fetching site data:", error);
      toast.error("Failed to load site data");
    } finally {
      setIsLoadingSite(false);
    }
  };

  // Watch form values for real-time updates
  const formData = watch();

  // Update form values when images change
  useEffect(() => {
    const allImages = [...uploadedImages, ...existingImages];
    setValue("images", allImages);
    if (allImages.length > 0) {
      clearErrors("images");
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
      setError("images", { message: "At least one image is required" });
      setImageError("At least one image is required");
      return;
    }

    const hasCoverImage = coverImage !== null || existingCoverImage !== null;
    if (!hasCoverImage) {
      setError("cover_image", { message: "Cover image is required" });
      setCoverImageError("Cover image is required");
      return;
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

    // Construct FormData for file and text fields
    const form = new FormData();

    // Append uploaded images
    if (uploadedImages.length > 0) {
      uploadedImages.forEach((file) => {
        form.append("media[]", file);
      });
    }

    // Append uploaded video
    if (uploadedVideo) {
      form.append("video", uploadedVideo);
    }

    // Append cover image if selected
    if (coverImage) {
      form.append("cover_image", coverImage);
    }

    // For edit mode, if no new files are uploaded, we need to indicate that existing media should be kept
    if (isEditMode) {
      // If no new images uploaded but existing images exist, add a flag to keep them
      if (uploadedImages.length === 0 && existingImages.length > 0) {
        form.append("keep_existing_images", "true");
      }

      // If no new cover image uploaded but existing cover image exists, add a flag to keep it
      if (!coverImage && existingCoverImage) {
        form.append("keep_existing_cover_image", "true");
      }

      // If no new video uploaded but existing video exists, add a flag to keep it
      if (!uploadedVideo && existingVideo) {
        form.append("keep_existing_video", "true");
      }
    }

    // Append 360 video URL if provided
    if (videoUrl.trim()) {
      form.append("video_url", videoUrl);
    }

    if (isEditMode) {
      form.append("_method", "PUT");
    }

    try {
      const url = isEditMode
        ? `https://api.hightribe.com/api/sites/${siteId}`
        : "https://api.hightribe.com/api/sites";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Server response:", errorData);
        toast.error(`Server Error: ${response.status}`);
        return;
      }

      const result = await response.json();
      console.log("Site images saved successfully:", result);
      toast.success(
        isEditMode
          ? "Site images updated successfully!"
          : "Site images created successfully!"
      );
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Something went wrong while submitting.");
    }
  };

  // Show loading state while fetching site data
  if (isEditMode && isLoadingSite) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading site data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-[14px] md:text-[16px] text-[#1C231F] font-semibold mb-4">
        Site Images/Videos
      </h4>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="p-2 md:p-4 bg-white rounded-lg shadow-sm">
          {/* Upload Images Section */}
          <div className="mb-8">
            <label className="block text-[14px] md:text-[16px] text-left font-medium text-[#1C231F] mb-3">
              Upload Images
            </label>
            <div className="grid grid-cols-5 gap-4 mb-3">
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
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
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
              <div className="aspect-square p-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
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
                  <span className="text-[#464444] text-4xl font-bold mb-1">
                    +
                  </span>
                  <span className="text-[#464444] text-[14px] text-xs">
                    Upload Image
                  </span>
                </label>
              </div>
            </div>
            {/* Image validation error */}
            {(errors.images?.message || imageError) && (
              <div className="text-red-500 text-xs mt-1">
                {typeof errors.images?.message === "string"
                  ? errors.images.message
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
            <div className="max-w-xs">
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
                    <span className="text-[#464444] text-4xl font-bold mb-1">
                      +
                    </span>
                    <span className="text-[#464444] text-[14px] text-xs">
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
            <div className="max-w-xs">
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
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
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
                <div className="aspect-video border-2 p-4 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
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
                    <span className="text-[#464444] text-4xl font-bold mb-1">
                      +
                    </span>
                    <span className="text-[#464444] text-[14px] text-xs">
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
          {/* Submit Buttons */}
          <div className="flex justify-end pt-4 gap-4">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
