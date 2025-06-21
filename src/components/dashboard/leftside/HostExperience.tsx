import React from "react";

const HostExperience: React.FC<{ onHost?: () => void }> = ({ onHost }) => (
  <div className="bg-gradient-to-r from-blue-500 to-blue-300 rounded-xl shadow-sm p-6 flex items-center justify-between mt-4">
    <div>
      <div className="text-white font-semibold text-lg mb-1">
        Host an Experience
      </div>
      <div className="text-white text-xs">
        Share your local knowledge with travelers
      </div>
    </div>
    <button
      className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold text-sm shadow"
      onClick={onHost}
    >
      <span role="img" aria-label="heart">
        ❤️
      </span>
    </button>
  </div>
);

export default HostExperience;
