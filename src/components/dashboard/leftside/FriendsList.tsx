import React from "react";
import Image from "next/image";

interface Friend {
  id: string;
  name: string;
  avatarUrl: string;
  mutualFriends: number;
}

interface FriendsListProps {
  friends: Friend[];
  onItemClick?: () => void;
}

const FriendsList = ({ friends, onItemClick }: FriendsListProps) => {
  return (
    <div className="p-2 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="px-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 ">
          Friends <span className="text-[#1064E1]">82</span>
        </h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 20 20"
          className="text-gray-400"
        >
          <circle cx="4" cy="10" r="1.5" fill="currentColor" />
          <circle cx="10" cy="10" r="1.5" fill="currentColor" />
          <circle cx="16" cy="10" r="1.5" fill="currentColor" />
        </svg>
      </div>
      <div className="space-y-1">
        {friends.map((friend) => (
          <button
            key={friend.id}
            onClick={onItemClick}
            className="w-full flex items-center space-x-3 justify-between px-4 py-2 hover:bg-gray-100 transition-colors rounded-lg"
          >
            <div className="flex items-center gap-2">
              <img
                src={friend.avatarUrl}
                alt={friend.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 text-left">
                <h4 className="text-sm font-medium text-gray-900">
                  {friend.name}
                </h4>
                <p className="text-xs text-gray-500">
                  {friend.mutualFriends} mutual friends
                </p>
              </div>
            </div>
            <Image
              src={"/dashboard/smileface.svg"}
              alt={"msg"}
              width={20}
              height={20}
            />
          </button>
        ))}
      </div>
      <button className="w-full mt-4 bg-gradient-to-r from-[#247BFE] to-[#1063E0] text-white rounded-md py-2 hover:bg-blue-500 transition-colors">
        See all Friends
      </button>
    </div>
  );
};

export default FriendsList;
