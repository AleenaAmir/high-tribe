import React, { useRef } from "react";

interface GlobalFileUploadProps {
  label?: string;
  value?: File[];
  onChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  error?: string;
  className?: string;
}

const GlobalFileUpload: React.FC<GlobalFileUploadProps> = ({
  label,
  value = [],
  onChange,
  accept = "image/*,video/*",
  multiple = true,
  error,
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    onChange?.(files);
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div
        className={`rounded-lg border border-dashed px-3 py-6 flex flex-col items-center justify-center cursor-pointer focus-within:ring-2 focus-within:ring-blue-400 transition-all ${
          error ? "border-red-400" : "border-gray-300"
        }`}
        onClick={() => inputRef.current?.click()}
        tabIndex={0}
        role="button"
      >
        <span className="text-gray-400 text-sm mb-2">
          Click or drag files to upload
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleFiles}
        />
        <div className="flex flex-wrap gap-2 mt-2">
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
        </div>
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default GlobalFileUpload;
