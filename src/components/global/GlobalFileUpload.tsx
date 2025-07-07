import React, { useRef, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";

interface GlobalFileUploadProps {
  label?: string;
  value?: File[];
  onChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  error?: string;
  className?: string;
  headLine?: string;
  subLine?: string;
  maxFiles?: number;
  allowedTypes?: string[];
  maxFileSize?: number; // in bytes
  onValidationError?: (error: string) => void;
}

export const uploadIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.4"
        d="M10.667 10.667 8 8l-2.666 2.667M8 8v6"
      ></path>
      <path
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.4"
        d="M13.593 12.26A3.333 3.333 0 0 0 12 6h-.84A5.333 5.333 0 1 0 2 10.867"
      ></path>
      <path
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.4"
        d="M10.667 10.667 8 8l-2.666 2.667"
      ></path>
    </svg>
  );
};

const GlobalFileUpload: React.FC<GlobalFileUploadProps> = ({
  label,
  value = [],
  onChange,
  accept = "image/*,video/*",
  multiple = true,
  error,
  className = "",
  headLine = "Drag & drop or click to upload",
  subLine = "Max 5 files . JPG, PNG, MP4, Mov",
  maxFiles = 5,
  allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "video/mp4",
    "video/quicktime",
  ],
  maxFileSize = 5 * 1024 * 1024,
  onValidationError,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Memoize object URLs for each file
  const fileUrls = useMemo(() => {
    return (value || []).map((file, index) => ({
      file,
      url: URL.createObjectURL(file),
      key: `${file.name}-${file.size}-${file.lastModified}-${index}`,
    }));
  }, [value]);

  // Cleanup object URLs on unmount or when files change
  useEffect(() => {
    return () => {
      fileUrls.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [fileUrls]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFiles = (
    files: File[]
  ): { isValid: boolean; error?: string } => {
    // Check file count
    if (files.length > maxFiles) {
      const errorMsg = `Maximum ${maxFiles} files allowed. You selected ${files.length} files.`;
      toast.error(errorMsg);
      return {
        isValid: false,
        error: errorMsg,
      };
    }

    // Check file types
    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.type)
    );
    if (invalidFiles.length > 0) {
      const invalidFileNames = invalidFiles.map((f) => f.name).join(", ");
      const errorMsg = `Invalid file type. Please upload only images (JPEG, PNG) or videos (MP4, QuickTime).`;
      toast.error(errorMsg);
      return {
        isValid: false,
        error: errorMsg,
      };
    }

    // Check file sizes
    const oversizedFiles = files.filter((file) => file.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      const oversizedFileNames = oversizedFiles.map((f) => f.name).join(", ");
      const errorMsg = `Selected file size is larger than ${formatFileSize(
        maxFileSize
      )}`;
      toast.error(errorMsg);
      return {
        isValid: false,
        error: errorMsg,
      };
    }

    return { isValid: true };
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];

    if (newFiles.length === 0) return;

    // Create a Set of existing file names to avoid duplicates
    const existingFileNames = new Set(value.map((file) => file.name));

    // Filter out files that already exist
    const uniqueNewFiles = newFiles.filter(
      (file) => !existingFileNames.has(file.name)
    );

    if (uniqueNewFiles.length === 0) {
      toast.error("Selected file already exist!");
      return;
    }

    // Combine existing files with new unique files
    const allFiles = [...value, ...uniqueNewFiles];

    // Validate the combined files
    const validation = validateFiles(allFiles);

    if (!validation.isValid) {
      onValidationError?.(validation.error!);
      return;
    }

    // Clear any previous validation errors
    onValidationError?.("");

    // If validation passes, update the files by appending new ones
    onChange?.(allFiles);

    // Reset file input so the same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    // Show success toast for successful upload
    if (uniqueNewFiles.length > 0) {
      toast.success(`${uniqueNewFiles.length} file(s) added successfully!`);
    }
  };

  const handleRemoveFile = (idx: number) => {
    if (!onChange) return;

    // Create a new array without the file at the specified index
    const newFiles = value.filter((_, i) => i !== idx);

    // Update the files
    onChange(newFiles);

    // Reset file input so the same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-[9px] font-medium text-[#5E6368] mb-1">
          {label}
        </label>
      )}
      {/* File preview row */}
      {fileUrls.length > 0 && (
        <div className="flex gap-2 mb-2">
          {fileUrls.map(({ file, url, key }, idx) => {
            const isImage = file.type.startsWith("image/");
            const isVideo = file.type.startsWith("video/");
            return (
              <div
                key={key}
                className="relative w-20 h-20 rounded overflow-hidden border border-gray-200 flex-shrink-0 bg-white"
              >
                {isImage && (
                  <img
                    src={url}
                    alt={file.name}
                    className="object-cover w-full h-full"
                  />
                )}
                {isVideo && (
                  <video
                    src={url}
                    className="object-cover w-full h-full"
                    controls={false}
                  />
                )}
                <button
                  type="button"
                  className="absolute top-1 h-fit right-1 bg-white bg-opacity-80 rounded-full px-1 hover:bg-red-500 hover:text-white text-gray-600 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(idx);
                  }}
                  aria-label="Remove file"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
      <div
        className={`rounded-lg border border-dashed p-4 flex flex-col items-center justify-center cursor-pointer focus-within:ring-2 focus-within:ring-blue-400 transition-all ${
          error ? "border-red-400" : "border-[#A6A4A4]"
        }`}
        onClick={() => inputRef.current?.click()}
        tabIndex={0}
        role="button"
      >
        {uploadIcon()}
        {headLine && (
          <span className="text-black text-[8px] mt-2">{headLine}</span>
        )}
        {subLine && (
          <span className="text-[#00000066] text-[8px]">{subLine}</span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleFiles}
        />
        {/* <div className="flex flex-wrap gap-2 mt-2">
          {value &&
            value.length > 0 &&
            value.map((file, idx) => (
              <span
                key={idx}
                className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-1"
              >
                {file.name}
              </span>
            ))}
        </div> */}
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default GlobalFileUpload;
