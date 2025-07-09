import React, { useState, useEffect, useRef, KeyboardEvent } from "react";

interface User {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
}

interface GlobalMultiSelectProps {
  label?: string;
  value?: User[];
  onChange?: (users: User[]) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  suggestions?: User[];
  onSearch?: (query: string) => void;
  loading?: boolean;
  maxSelections?: number;
}

const GlobalMultiSelect: React.FC<GlobalMultiSelectProps> = ({
  label,
  value = [],
  onChange,
  placeholder = "",
  error,
  className = "",
  suggestions = [],
  onSearch,
  loading = false,
  maxSelections,
}) => {
  const [input, setInput] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>(value);
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedUsers(value);
  }, [value]);

  const addUser = (user: User) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      const newUsers = [...selectedUsers, user];
      setSelectedUsers(newUsers);
      onChange?.(newUsers);
    }
    setInput("");
    setShowDropdown(false);
    setFocusedIndex(-1);
  };

  const removeUser = (userId: number) => {
    const newUsers = selectedUsers.filter((u) => u.id !== userId);
    setSelectedUsers(newUsers);
    onChange?.(newUsers);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInput(query);
    setShowDropdown(true);
    setFocusedIndex(-1);

    if (onSearch) {
      onSearch(query);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0 && suggestions[focusedIndex]) {
        addUser(suggestions[focusedIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setFocusedIndex(-1);
    } else if (e.key === "Backspace" && !input && selectedUsers.length) {
      removeUser(selectedUsers[selectedUsers.length - 1].id);
    }
  };

  const handleFocus = () => {
    setShowDropdown(true);
    if (onSearch && input) {
      onSearch(input);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
      setFocusedIndex(-1);
    }, 150);
  };

  const isMaxReached = maxSelections
    ? selectedUsers.length >= maxSelections
    : false;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-[12px] font-medium text-black z-10 translate-y-3 translate-x-4 bg-white w-fit px-1">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className={`flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2 min-h-[44px] focus-within:ring-2 focus-within:ring-blue-400 transition-all ${
            error ? "border-red-400" : "border-[#848484]"
          }`}
        >
          {selectedUsers.map((user) => (
            <span
              key={user.id}
              className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs flex items-center gap-1"
            >
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-4 h-4 rounded-full"
                />
              )}
              <span className="font-medium">{user.name}</span>
              <button
                type="button"
                className="ml-1 text-blue-500 hover:text-red-500 font-bold text-sm"
                onClick={() => removeUser(user.id)}
                title="Remove user"
              >
                ×
              </button>
            </span>
          ))}
          {!isMaxReached && (
            <input
              ref={inputRef}
              type="text"
              className="flex-1 min-w-[100px] border-none outline-none bg-transparent text-sm"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={selectedUsers.length === 0 ? placeholder : ""}
            />
          )}
        </div>

        {showDropdown && (suggestions.length > 0 || loading) && (
          <div
            ref={dropdownRef}
            className="absolute z-50 left-0 right-0 bg-white border rounded-lg shadow mt-1 max-h-48 overflow-y-auto"
          >
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-500">Loading...</div>
            ) : suggestions.length > 0 ? (
              suggestions
                .filter((user) => !selectedUsers.find((u) => u.id === user.id))
                .map((user, index) => (
                  <div
                    key={user.id}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-100 flex items-center gap-2 ${
                      index === focusedIndex ? "bg-blue-100" : ""
                    }`}
                    onMouseDown={() => addUser(user)}
                  >
                    {user.avatar && (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      {user.email && (
                        <span className="text-xs text-gray-500">
                          {user.email}
                        </span>
                      )}
                    </div>
                  </div>
                ))
            ) : input && !loading ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                No users found
              </div>
            ) : null}
          </div>
        )}
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default GlobalMultiSelect;
