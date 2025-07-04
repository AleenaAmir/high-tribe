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
    love: 350,
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
    content: "Its very hot today?",
    tags: ["🏛️ Cultural Exploration", "🛍️ Shopping Spree", "🌺 Relaxing Parks"],

    love: 750,
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
    isTravelAdvisory: true,
    user: {
      name: "Sarah Parker",
      avatarUrl: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    timestamp: "8 hours ago",
    location: "Barcelona, Spain",
    travelAdvisoryHead: "Bail volcano activity update",
    content:
      "Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitant maecenas at magna pulvinar velit. Fringilla amet commodo tincidunt quis. Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitant maecenas at magna pulvinar velit. Fringilla.",
    media: [
      {
        type: "image",
        url: "https://res.cloudinary.com/dtfzklzek/image/upload/v1751646394/Post-Img_fqfik8.png",
      },
    ],
    love: 150,
    likes: 254,
    comments: 4,
    shares: 2,
    tags: ["🏛️ Concerned", "🛍️ Helpful"],
    participants: [
      { avatarUrl: "https://randomuser.me/api/portraits/men/51.jpg" },
      { avatarUrl: "https://randomuser.me/api/portraits/women/52.jpg" },
      { avatarUrl: "https://randomuser.me/api/portraits/men/53.jpg" },
      { avatarUrl: "https://randomuser.me/api/portraits/women/54.jpg" },
      { avatarUrl: "https://randomuser.me/api/portraits/men/55.jpg" },
    ],
    isTripBoard: true,
  },
  {
    id: "4",
    journeyHead:
      "<p>Trip to Khunjrab with <span className='text-[#247BFE]'>Noor Ali</span> and <span className='text-[#247BFE]'>Kamal Khan</span></p>",
    user: {
      name: "Sarah Parker",
      avatarUrl: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    timestamp: "8 hours ago",
    location: "Barcelona, Spain",
    content:
      "Breathe in the silence of the mountains. Ride into the roof of the world.",
    journeyContent: {
      travelDetails: {
        locationDistance: "43,975 m",
        distanceCovered: "1,475.21 km",
        date: "July 15 - 30",
        mapView:
          "https://res.cloudinary.com/dtfzklzek/image/upload/v1751659619/Post-Img_8_hjbtrh.png",
      },
      images: [
        {
          url: "https://res.cloudinary.com/dtfzklzek/image/upload/v1751650271/Post-Img_1_udv8oj.png",
        },
        {
          url: "https://res.cloudinary.com/dtfzklzek/image/upload/v1751650270/Post-Img_2_wisytz.png",
        },
        {
          url: "https://res.cloudinary.com/dtfzklzek/image/upload/v1751650270/Post-Img_3_qca6te.png",
        },
        {
          url: "https://res.cloudinary.com/dtfzklzek/image/upload/v1751650269/Post-Img_4_ke33lo.png",
        },
        {
          url: "https://res.cloudinary.com/dtfzklzek/image/upload/v1751650272/Post-Img_5_oqcawh.png",
        },
      ],
    },
    love: 150,
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
