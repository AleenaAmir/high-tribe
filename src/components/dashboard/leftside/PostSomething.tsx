import React from "react";
import Image from "next/image";

type PostSomethingProps = {
  avatarUrl: string;
  onPost?: (text: string) => void;
};

const PostSomething: React.FC<PostSomethingProps> = ({ avatarUrl, onPost }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-3">
      <Image
        src={avatarUrl}
        alt="User Avatar"
        width={40}
        height={40}
        className="rounded-full object-cover"
      />
      <input
        type="text"
        placeholder="Share your adventure or travel Plans"
        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && onPost)
            onPost((e.target as HTMLInputElement).value);
        }}
      />
    </div>
  );
};

export default PostSomething;
