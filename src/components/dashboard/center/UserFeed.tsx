"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { PostCard, Post } from "./PostCard";
import { apiRequest } from "@/lib/api";
import {
  PostCardSkeleton,
  JourneyPostSkeleton,
} from "../../global/LoadingSkeleton";

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

// Pagination response type
interface PaginatedResponse {
  data?: ApiPost[];
  posts?: ApiPost[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Fallback dummy data for when API fails
const fallbackPosts: Post[] = [
  {
    id: "fallback-1",
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
    id: "fallback-2",
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
    id: "fallback-3",
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

  // Collect all media from stops (both photos and videos)
  const allMedia = apiPost.stops.flatMap((stop) =>
    stop.media.map((media) => ({
      type: media.type === "photo" ? "image" : ("video" as "image" | "video"),
      url: `https://high-tribe-backend.hiconsolutions.com${media.url}`,
    }))
  );

  // Limit media to 5 items and track additional items
  const displayMedia = allMedia.slice(0, 5);
  const additionalMediaCount = Math.max(0, allMedia.length - 5);

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
      media: displayMedia,
      allMedia: allMedia, // Store all media for modal
      additionalMediaCount: additionalMediaCount,
    },
    // media: allMedia.length > 0 ? allMedia : undefined,
    love: Math.floor((apiPost.id * 7) % 500) + 50, // Deterministic based on post ID
    likes: Math.floor((apiPost.id * 13) % 300) + 50, // Deterministic based on post ID
    comments: Math.floor((apiPost.id * 3) % 20) + 1, // Deterministic based on post ID
    shares: Math.floor((apiPost.id * 5) % 10) + 1, // Deterministic based on post ID
    participants,
  };
};

const UserFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Function to fetch posts with pagination
  const fetchPosts = useCallback(
    async (pageNum: number, isInitial: boolean = false) => {
      try {
        if (isInitial) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);

        // Build query parameters for pagination
        const queryParams = new URLSearchParams({
          per_page: "10", // Number of posts per page
          page: pageNum.toString(),
        });

        console.log(
          `Fetching posts page ${pageNum} with params:`,
          queryParams.toString()
        );

        let response;
        try {
          // Try with pagination parameters first
          response = await apiRequest<PaginatedResponse>(
            `posts?${queryParams}`,
            {
              method: "get",
            }
          );
        } catch (error) {
          // If pagination fails, try without parameters (fallback)
          console.log("Pagination failed, trying without parameters");
          response = await apiRequest<PaginatedResponse>("posts", {
            method: "get",
          });
        }

        console.log("API Response:", response);

        // Handle different response structures
        let postsData: ApiPost[] = [];
        let paginationInfo = null;

        if (response?.data && Array.isArray(response.data)) {
          postsData = response.data;
          paginationInfo = response.pagination;
        } else if (Array.isArray(response)) {
          // If response is directly an array
          postsData = response;
        } else if (response?.posts && Array.isArray(response.posts)) {
          // If response has posts property
          postsData = response.posts;
        }

        console.log(`Found ${postsData.length} posts on page ${pageNum}`);

        if (postsData.length > 0) {
          // Transform API posts to match Post interface
          const transformedPosts = postsData.map(transformApiPostToPost);

          if (isInitial) {
            // Remove duplicates from initial posts as well
            const uniquePosts = transformedPosts.filter(
              (post, index, self) =>
                index === self.findIndex((p) => p.id === post.id)
            );
            setPosts(uniquePosts);
            console.log(
              `Set initial posts: ${uniquePosts.length} (filtered from ${transformedPosts.length})`
            );
          } else {
            setPosts((prev) => {
              // Filter out duplicates based on post ID
              const existingIds = new Set(prev.map((post) => post.id));
              const uniqueNewPosts = transformedPosts.filter(
                (post) => !existingIds.has(post.id)
              );

              const newPosts = [...prev, ...uniqueNewPosts];
              console.log(
                `Added ${uniqueNewPosts.length} unique posts, total: ${newPosts.length}`
              );
              return newPosts;
            });
          }

          // Update pagination info
          if (paginationInfo) {
            console.log("Pagination info:", paginationInfo);
            setTotalPages(paginationInfo.totalPages);
            setHasMore(pageNum < paginationInfo.totalPages);
          } else {
            // If no pagination info, assume there's more if we got a full page
            const hasMorePosts = postsData.length === 10; // Assuming 10 is the page size
            console.log(
              `No pagination info, assuming hasMore: ${hasMorePosts}`
            );
            setHasMore(hasMorePosts);
          }
        } else {
          if (isInitial) {
            // If API returns empty data, use fallback
            console.log("API returned empty data, using fallback posts");
            setPosts(fallbackPosts);
            setHasMore(false);
          } else {
            // No more posts to load
            console.log("No more posts to load");
            setHasMore(false);
          }
        }
      } catch (error) {
        // If API fails, use fallback data only on initial load
        console.log("Failed to fetch posts:", error);
        if (isInitial) {
          setError("Failed to load posts");
          setPosts(fallbackPosts);
          setHasMore(false);
        } else {
          setError("Failed to load more posts");
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // Load more posts when user scrolls near bottom
  const loadMorePosts = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage, false);
    }
  }, [loadingMore, hasMore, page, fetchPosts]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        console.log("Intersection observer entry:", {
          isIntersecting: entry.isIntersecting,
          hasMore,
          loadingMore,
          currentPage: page,
        });

        if (entry.isIntersecting && hasMore && !loadingMore) {
          console.log("Intersection observer triggered - loading more posts");
          loadMorePosts();
        }
      },
      {
        root: null,
        rootMargin: "300px", // Increased margin for earlier triggering
        threshold: 0.1,
      }
    );

    // Wait a bit for the DOM to be ready
    setTimeout(() => {
      if (loadingRef.current) {
        console.log("Setting up intersection observer");
        observer.observe(loadingRef.current);
      }
    }, 100);

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loadMorePosts, page]);

  // Scroll event listener as backup for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return;

      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Trigger when user is 500px from bottom
      if (documentHeight - scrollTop - windowHeight < 500) {
        console.log("Scroll event triggered - loading more posts");
        loadMorePosts();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, loadingMore, loadMorePosts]);

  // Manual load more function
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      console.log("Manual load more triggered");
      loadMorePosts();
    }
  };

  // Initial load
  useEffect(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-4">
        <JourneyPostSkeleton />
        <PostCardSkeleton />
        <JourneyPostSkeleton />
        <PostCardSkeleton />
        <JourneyPostSkeleton />
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={() => {
            setPage(1);
            fetchPosts(1, true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="">
      {posts?.map((post, index) => (
        <PostCard key={`${post.id}-${index}`} post={post} />
      ))}

      {/* Loading indicator for infinite scroll */}
      {loadingMore && (
        <div className="space-y-4">
          <JourneyPostSkeleton />
          <PostCardSkeleton />
          <JourneyPostSkeleton />
        </div>
      )}

      {/* Manual load more button */}
      {hasMore && !loadingMore && (
        <div className="flex justify-center py-4">
          <button
            onClick={handleLoadMore}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load More Posts
          </button>
        </div>
      )}

      {/* Intersection observer target - made more visible */}
      <div
        ref={loadingRef}
        className="h-8 bg-gray-50 border-t border-gray-200 flex items-center justify-center"
      >
        <span className="text-xs text-gray-400">Scroll to load more</span>
      </div>

      {/* End of feed message */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">You've reached the end of the feed</p>
          <p className="text-sm text-gray-400 mt-2">
            Total posts loaded: {posts.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserFeed;
