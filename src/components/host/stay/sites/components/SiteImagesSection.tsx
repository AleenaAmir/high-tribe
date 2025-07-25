"use client";
import React from "react";
import { useSitesForm } from "../contexts/SitesFormContext";
import { toast } from "react-hot-toast";

interface SiteImagesSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

const SiteImagesSection = ({ sectionRef }: SiteImagesSectionProps) => {
  const {
    state,
    updateUploadedImages,
    updateUploadedVideos,
    updateCoverImage,
  } = useSitesForm();

  // Handle file upload
  const handleFileUpload = (
    files: File[],
    type: "image" | "video" = "image"
  ) => {
    if (type === "image") {
      updateUploadedImages([...state.uploadedImages, ...files]);
    } else {
      updateUploadedVideos([...state.uploadedVideos, ...files]);
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

  const handleSave = async () => {
    const formData = new FormData();

    // Append media_images[] (multiple files)
    state.uploadedImages.forEach((image) => {
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
      const response = await fetch(
        "http://3.6.115.88/api/properties/16/sites/media",
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
      if (data.message) {
        toast.success(data.message);
      }

      if (response.ok) {
        toast.success("Media uploaded successfully");
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred during upload");
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
              <div key={index} className="relative group">
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

            <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
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
          </div>
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
            <div className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="video/*"
                multiple
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
                <span className="text-gray-500 text-xs">Upload Mp4</span>
              </label>
            </div>
          </div>
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
              <div className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                      updateCoverImage(file);
                    }
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
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteImagesSection;
