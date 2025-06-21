import React from "react";
import Image from "next/image";

type Story = {
  id: string;
  avatarUrl: string;
  name: string;
  isActive?: boolean;
};

type StoriesBarProps = {
  stories: Story[];
};

const StoriesBar: React.FC<StoriesBarProps> = ({ stories }) => (
  <div className="bg-white rounded-xl shadow-sm p-4 flex space-x-4 overflow-x-auto">
    {stories.map((story) => (
      <div key={story.id} className="flex flex-col items-center w-16">
        <div
          className={`rounded-full border-2 ${
            story.isActive ? "border-pink-500" : "border-gray-200"
          } p-1 mb-1`}
        >
          <Image
            src={story.avatarUrl}
            alt={story.name}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        </div>
        <span className="text-xs text-gray-700 truncate w-full text-center">
          {story.name}
        </span>
      </div>
    ))}
  </div>
);

export default StoriesBar;
