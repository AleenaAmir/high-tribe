"use client";
import React, { useEffect, useState } from "react";
import { PostCard, Post } from "./PostCard";
import { apiRequest } from "@/lib/api";

// API Response Types
interface ApiUser {
  id: number;
  name: string;
  username: string;
  email: string;
  date_of_birth: string;
  phone: string;
}

interface ApiMedia {
  id: number;
  post_stop_id: number;
  type: "photo" | "video";
  url: string;
  created_at: string;
  updated_at: string;
}

interface ApiStop {
  id: number;
  post_id: number;
  stop_category_id: number;
  category: {
    id: number;
    name: string;
  };
  title: string;
  location_name: string;
  lat: string;
  lng: string;
  transport_mode: string;
  transport_mode_other: string | null;
  start_date: string;
  end_date: string;
  notes: string;
  media: ApiMedia[];
}

interface ApiPost {
  id: number;
  user: ApiUser;
  title: string;
  description: string;
  start_location_name: string;
  start_lat: string;
  start_lng: string;
  end_location_name: string;
  end_lat: string;
  end_lng: string;
  privacy: string;
  planning_mode: string;
  date_mode: string;
  start_date: string;
  end_date: string;
  month: string | null;
  days_count: number | null;
  type: string;
  specify_other: string | null;
  stops: ApiStop[];
  tagged_users: ApiUser[];
  created_at: string;
  updated_at: string;
}

// Helper function to format timestamp
const formatTimestamp = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString();
};

// Helper function to calculate distance between coordinates
const calculateDistance = (
  lat1: string,
  lng1: string,
  lat2: string,
  lng2: string
): string => {
  const R = 6371; // Earth's radius in km
  const dLat = ((parseFloat(lat2) - parseFloat(lat1)) * Math.PI) / 180;
  const dLng = ((parseFloat(lng2) - parseFloat(lng1)) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((parseFloat(lat1) * Math.PI) / 180) *
      Math.cos((parseFloat(lat2) * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(2)} km`;
};

// Helper function to format date range
const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startMonth = start.toLocaleDateString("en-US", { month: "long" });
  const endMonth = end.toLocaleDateString("en-US", { month: "long" });
  const startDay = start.getDate();
  const endDay = end.getDate();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
};

// Transform API data to Post format
const transformApiPostToPost = (apiPost: ApiPost): Post => {
  // Create journey head with tagged users
  const taggedUsersHtml = apiPost.tagged_users
    .filter((user) => user.id !== apiPost.user.id) // Exclude the post author
    .map((user) => `<span class='text-[#247BFE]'>${user.name}</span>`)
    .join(" and ");

  const journeyHead = taggedUsersHtml
    ? `<p>Trip to ${apiPost.end_location_name} with ${taggedUsersHtml}</p>`
    : `<p>Trip to ${apiPost.end_location_name}</p>`;

  // Calculate total distance
  const directDistance = calculateDistance(
    apiPost.start_lat,
    apiPost.start_lng,
    apiPost.end_lat,
    apiPost.end_lng
  );

  // Collect all media from stops
  const allMedia = apiPost.stops.flatMap((stop) =>
    stop.media
      .filter((media) => media.type === "photo") // Only include photos for now
      .map((media) => ({
        url: `https://high-tribe-backend.hiconsolutions.com${media.url}`,
      }))
  );

  // Create participants from tagged users (with placeholder avatars)
  const participants = apiPost.tagged_users.map((user, index) => ({
    avatarUrl: `https://randomuser.me/api/portraits/${
      index % 2 === 0 ? "men" : "women"
    }/${50 + index}.jpg`,
  }));

  return {
    id: apiPost.id.toString(),
    journeyHead,
    user: {
      name: apiPost.user.name,
      avatarUrl: `https://randomuser.me/api/portraits/${
        apiPost.user.id % 2 === 0 ? "men" : "women"
      }/${30 + (apiPost.user.id % 20)}.jpg`,
    },
    timestamp: formatTimestamp(apiPost.created_at),
    location: `${apiPost.start_location_name} to ${apiPost.end_location_name}`,
    content: apiPost.description,
    journeyContent: {
      travelDetails: {
        locationDistance: directDistance,
        distanceCovered: directDistance, // Could be calculated from stops if needed
        date: formatDateRange(apiPost.start_date, apiPost.end_date),
        mapView:
          "https://res.cloudinary.com/dtfzklzek/image/upload/v1751659619/Post-Img_8_hjbtrh.png", // Placeholder map
      },
      images: allMedia,
    },
    love: Math.floor(Math.random() * 500) + 50, // Random for now
    likes: Math.floor(Math.random() * 300) + 50, // Random for now
    comments: Math.floor(Math.random() * 20) + 1, // Random for now
    shares: Math.floor(Math.random() * 10) + 1, // Random for now
    participants,
  };
};

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
];

const UserFeed = () => {
  const [posts, setPosts] = useState<Post[]>(dummyPosts);
  console.log(posts);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiRequest<{ posts: ApiPost[] }>("posts", {
          method: "get",
        });

        if (Array.isArray(response?.posts)) {
          // Transform API posts to match Post interface
          const transformedPosts = response.posts.map(transformApiPostToPost);

          // Combine with dummy posts (other post types)
          const allPosts = [...dummyPosts, ...transformedPosts];
          setPosts(allPosts);
        }
      } catch (error) {
        // If API fails, use dummy data
        console.log("Failed to fetch posts, using dummy data:", error);
        setPosts(dummyPosts);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      {posts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default UserFeed;
