import React, { useState, KeyboardEvent } from "react";

interface GlobalTagInputProps {
  label?: string;
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

const GlobalTagInput: React.FC<GlobalTagInputProps> = ({
  label,
  value = [],
  onChange,
  placeholder = "Add tag...",
  error,
  className = "",
}) => {
  const [input, setInput] = useState("");
  const [tags, setTags] = useState<string[]>(value);

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      onChange?.(newTags);
    }
  };

  const removeTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    onChange?.(newTags);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      addTag(input.trim());
      setInput("");
    }
    if (e.key === "Backspace" && !input && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-[10px] font-medium text-[#5E6368] translate-y-3 translate-x-4 bg-white w-fit px-1">
          {label}
        </label>
      )}
      <div
        className={`flex flex-wrap items-center gap-2 rounded-lg border px-2 py-2 min-h-[44px] focus-within:ring-2 focus-within:ring-blue-400 transition-all ${
          error ? "border-red-400" : "border-[#848484]"
        }`}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-blue-100 text-blue-700 rounded px-2 py-1 text-xs flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              className="ml-1 text-blue-500 hover:text-red-500"
              onClick={() => removeTag(tag)}
            >
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          className="flex-1 min-w-[100px] border-none outline-none bg-transparent text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default GlobalTagInput;
