"use client";
import React from "react";
import { PostCard, Post } from "./PostCard";

const dummyPosts: Post[] = [
  {
    id: "1",
    user: {
      name: "Terrylucas",
      avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    timestamp: "8 hours ago",
    location: "Barcelona, Spain",
    content:
      "Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitiant moecenas at magna pulvinar velit.",
    media: [
      {
        type: "image",
        url: "https://picsum.photos/seed/post1-1/800/600",
      },
      {
        type: "image",
        url: "https://picsum.photos/seed/post1-2/800/800",
      },
      {
        type: "image",
        url: "https://picsum.photos/seed/post1-3/800/800",
      },
    ],
    likes: 254,
    comments: 4,
    shares: 2,
    participants: [
      { avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg" },
      { avatarUrl: "https://randomuser.me/api/portraits/women/46.jpg" },
      { avatarUrl: "https://randomuser.me/api/portraits/men/47.jpg" },
      { avatarUrl: "https://randomuser.me/api/portraits/women/48.jpg" },
      { avatarUrl: "https://randomuser.me/api/portraits/men/49.jpg" },
      { avatarUrl: "https://randomuser.me/api/portraits/women/50.jpg" },
    ],
  },
  {
    id: "2",
    user: {
      name: "Sarah Parker",
      avatarUrl: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    timestamp: "8 hours ago",
    location: "Barcelona, Spain",
    content:
      "Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitiant moecenas at magna pulvinar velit.",
    media: [
      {
        type: "image",
        url: "https://picsum.photos/seed/post2-1/800/800",
      },
      {
        type: "image",
        url: "https://picsum.photos/seed/post2-2/800/800",
      },
      {
        type: "image",
        url: "https://picsum.photos/seed/post2-3/800/800",
      },
      {
        type: "image",
        url: "https://picsum.photos/seed/post2-4/800/800",
      },
    ],
    likes: 254,
    comments: 4,
    shares: 2,
    participants: [
      { avatarUrl: "https://randomuser.me/api/portraits/men/51.jpg" },
      { avatarUrl: "https://randomuser.me/api/portraits/women/52.jpg" },
      { avatarUrl: "https://randomuser.me/api/portraits/men/53.jpg" },
    ],
  },
  {
    id: "3",
    user: {
      name: "Sarah Parker",
      avatarUrl: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    timestamp: "8 hours ago",
    location: "Barcelona, Spain",
    content:
      "Planning my road trip through the Swiss Alps this summer! 🏔️ Looking for people to join or share tips if you've done this route before.",
    media: [
      {
        type: "image",
        url: "https://picsum.photos/seed/post3-1/800/600",
      },
    ],
    likes: 254,
    comments: 4,
    shares: 2,
    participants: [
      { avatarUrl: "https://randomuser.me/api/portraits/men/51.jpg" },
      { avatarUrl: "https://randomuser.me/api/portraits/women/52.jpg" },
      { avatarUrl: "https://randomuser.me/api/portraits/men/53.jpg" },
      { avatarUrl: "https://randomuser.me/api/portraits/women/54.jpg" },
      { avatarUrl: "https://randomuser.me/api/portraits/men/55.jpg" },
    ],
    isTripBoard: true,
    tripDetails: {
      tags: ["Zurich", "Interlaken", "Zermatt"],
    },
  },
];

const UserFeed = () => {
  return (
    <div>
      {dummyPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default UserFeed;
