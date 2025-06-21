import React from "react";

interface UserStatsProps {
  stats: {
    footprints: number;
    photos: number;
    likes: number;
  };
}

const UserStats = ({
  stats = {
    footprints: 268,
    photos: 1.4,
    likes: 2.5,
  },
}: UserStatsProps) => {
  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex justify-between text-center">
        <div>
          <p className="font-medium text-gray-900">{stats.footprints}</p>
          <p className="text-xs text-gray-500">Footprints</p>
        </div>
        <div>
          <p className="font-medium text-gray-900">{stats.photos}k</p>
          <p className="text-xs text-gray-500">Photos</p>
        </div>
        <div>
          <p className="font-medium text-gray-900">{stats.likes}k</p>
          <p className="text-xs text-gray-500">Likes</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button className="bg-gray-900 text-white text-xs font-medium py-2 px-4 rounded">
          Follow
        </button>
        <button className="bg-gray-900 text-white text-xs font-medium py-2 px-4 rounded">
          Calendar
        </button>
        <button className="bg-gray-900 text-white text-xs font-medium py-2 px-4 rounded">
          Share
        </button>
      </div>

      {/* Bucket List Button */}
      <button className="w-full py-2 bg-blue-600 text-white rounded text-sm font-medium">
        Bucket list
      </button>
    </div>
  );
};

export default UserStats;
