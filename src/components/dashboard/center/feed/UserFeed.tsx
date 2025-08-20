"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { PostCard, Post, User, Media } from "./PostCard";
import { apiRequest } from "@/lib/api";
import {
  PostCardSkeleton,
  JourneyPostSkeleton,
} from "../../../global/LoadingSkeleton";

// API Response Types based on actual API response
interface ApiUser {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string | null;
  date_of_birth: string;
  type: number;
  roles: string[];
  created_at: string;
}

interface ApiMedia {
  id: number;
  file_path?: string;
  media_type?: "image" | "video";
  type?: "photo" | "video";
  url?: string;
  duration?: number | null;
}

interface ApiPost {
  id: number;
  user: ApiUser;
  title: string;
  description?: string;
  story?: string;
  location?: string;
  location_name?: string;
  latitude?: string;
  longitude?: string;
  lat?: string;
  lng?: string;
  privacy: string;
  expires_on?: string;
  is_resolved?: boolean;
  resolved_at?: string | null;
  media: ApiMedia[];
  tagged_users: ApiUser[];
  tagged_friends?: number[];
  mood_tags?: string[];
  created_at: string;
  updated_at?: string;
}

// Pagination response type
interface PaginatedResponse {
  data?: {
    data?: ApiPost[];
    posts?: ApiPost[];
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  posts?: ApiPost[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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

// Transform API data to Post format
const transformApiPostToPost = (apiPost: ApiPost): Post => {
  // Validate that apiPost has required properties
  if (!apiPost || !apiPost.id || !apiPost.user) {
    console.error("Invalid API post data:", apiPost);
    throw new Error("Invalid API post data");
  }

  console.log(`Transforming post ${apiPost.id}`);

  // Transform media
  const transformMedia = (media: ApiMedia[] | undefined) => {
    if (!media || !Array.isArray(media)) {
      return [];
    }
    return media.map((item) => ({
      id: item.id,
      file_path: item.file_path,
      media_type: item.media_type,
      type: item.type,
      url: item.url,
      duration: item.duration,
    }));
  };

  // Create participants from tagged users
  const participants = (apiPost.tagged_users || []).map((user, index) => ({
    avatarUrl: `https://randomuser.me/api/portraits/${
      index % 2 === 0 ? "men" : "women"
    }/${50 + index}.jpg`,
  }));

  // Transform media
  const allMedia = transformMedia(apiPost.media);
  const displayMedia = allMedia.slice(0, 5);
  const additionalMediaCount = Math.max(0, allMedia.length - 5);

  // Base post object
  const basePost: Post = {
    id: apiPost.id,
    user: {
      id: apiPost.user.id,
      name: apiPost.user.name || "Unknown User",
      email: apiPost.user.email,
      username: apiPost.user.username,
      phone: apiPost.user.phone,
      date_of_birth: apiPost.user.date_of_birth,
      type: apiPost.user.type,
      roles: apiPost.user.roles,
      created_at: apiPost.user.created_at,
    },
    title: apiPost.title,
    description: apiPost.description,
    story: apiPost.story,
    location: apiPost.location,
    location_name: apiPost.location_name,
    latitude: apiPost.latitude,
    longitude: apiPost.longitude,
    lat: apiPost.lat,
    lng: apiPost.lng,
    privacy: apiPost.privacy,
    media: allMedia.length > 0 ? allMedia : [],
    tagged_users: apiPost.tagged_users,
    tagged_friends: apiPost.tagged_friends,
    mood_tags: apiPost.mood_tags,
    expires_on: apiPost.expires_on,
    is_resolved: apiPost.is_resolved,
    resolved_at: apiPost.resolved_at,
    created_at: apiPost.created_at,
    updated_at: apiPost.updated_at,
  };

  // Handle different post types based on available fields
  if (apiPost.expires_on && apiPost.is_resolved !== undefined) {
    // Travel Advisory
    console.log(`Creating travel advisory post for ${apiPost.id}`);
    return basePost;
  } else if (apiPost.mood_tags && apiPost.mood_tags.length > 0) {
    // Footprint
    console.log(`Creating footprint post for ${apiPost.id}`);
    return basePost;
  } else {
    // Travel Tip or default
    console.log(`Creating travel tip/default post for ${apiPost.id}`);
    return basePost;
  }
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
          per_page: "10",
          page: pageNum.toString(),
        });

        console.log(
          `Fetching posts page ${pageNum} with params:`,
          queryParams.toString()
        );

        let response;
        try {
          // Try different API endpoints
          console.log("Trying API call with pagination...");
          response = await apiRequest<PaginatedResponse>(
            `posts/all?${queryParams}`,
            {
              method: "get",
            }
          );
          console.log("API call successful with pagination");
        } catch (error) {
          console.log("First endpoint failed, trying without pagination...");
          try {
            response = await apiRequest<PaginatedResponse>("posts", {
              method: "get",
            });
            console.log("API call successful without pagination");
          } catch (fallbackError) {
            console.log(
              "Second endpoint failed, trying alternative endpoints..."
            );
            try {
              response = await apiRequest<PaginatedResponse>("posts/all", {
                method: "get",
              });
              console.log("API call successful with posts/all");
            } catch (thirdError) {
              try {
                response = await apiRequest<PaginatedResponse>("feed", {
                  method: "get",
                });
                console.log("API call successful with feed");
              } catch (fourthError) {
                console.error("All API calls failed:", {
                  first: error,
                  second: fallbackError,
                  third: thirdError,
                  fourth: fourthError,
                });
                throw fourthError;
              }
            }
          }
        }

        console.log("API Response:", response);

        // Handle different response structures
        let postsData: ApiPost[] = [];
        let paginationInfo = null;

        if (response?.data?.data && Array.isArray(response.data.data)) {
          postsData = response.data.data;
          paginationInfo = response.data.pagination;
        } else if (
          response?.data?.posts &&
          Array.isArray(response.data.posts)
        ) {
          postsData = response.data.posts;
          paginationInfo = response.data.pagination;
        } else if (response?.data && Array.isArray(response.data)) {
          postsData = response.data;
          paginationInfo = response.pagination;
        } else if (Array.isArray(response)) {
          postsData = response;
        } else if (response?.posts && Array.isArray(response.posts)) {
          postsData = response.posts;
        }

        console.log(`Found ${postsData.length} posts on page ${pageNum}`);

        if (postsData.length > 0) {
          console.log("Raw posts data:", postsData);

          // Transform API posts to match Post interface
          const transformedPosts: Post[] = postsData
            .map((post, index) => {
              try {
                console.log(`Transforming post ${index}:`, post);
                const transformed = transformApiPostToPost(post);
                console.log(`Transformed post ${index}:`, transformed);
                return transformed;
              } catch (error) {
                console.error(`Error transforming post ${index}:`, error);
                return null;
              }
            })
            .filter((post): post is Post => post !== null);

          console.log("Transformed posts:", transformedPosts);

          if (transformedPosts.length > 0) {
            if (isInitial) {
              const uniquePosts = transformedPosts.filter(
                (post, index, self) =>
                  post && index === self.findIndex((p) => p && p.id === post.id)
              );
              setPosts(uniquePosts);
              console.log(
                `Set initial posts: ${uniquePosts.length} (filtered from ${transformedPosts.length})`
              );
            } else {
              setPosts((prev) => {
                const existingIds = new Set(prev.map((post) => post.id));
                const uniqueNewPosts = transformedPosts.filter(
                  (post) => post && !existingIds.has(post.id)
                );

                const newPosts = [...prev, ...uniqueNewPosts];
                console.log(
                  `Added ${uniqueNewPosts.length} unique posts, total: ${newPosts.length}`
                );
                return newPosts;
              });
            }
          }

          // Update pagination info
          if (paginationInfo) {
            console.log("Pagination info:", paginationInfo);
            setTotalPages(paginationInfo.totalPages);
            setHasMore(pageNum < paginationInfo.totalPages);
          } else {
            const hasMorePosts = postsData.length === 10;
            console.log(
              `No pagination info, assuming hasMore: ${hasMorePosts}`
            );
            setHasMore(hasMorePosts);
          }
        } else {
          if (isInitial) {
            console.log("API returned empty data");
            setPosts([]);
            setHasMore(false);
          } else {
            console.log("No more posts to load");
            setHasMore(false);
          }
        }
      } catch (error) {
        console.log("Failed to fetch posts:", error);
        if (isInitial) {
          setError("Failed to load posts");
          setPosts([]);
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

  // Function to refresh posts after comment is added
  const handleCommentAdded = useCallback(() => {
    fetchPosts(page, false);
  }, [page, fetchPosts]);

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
        rootMargin: "300px",
        threshold: 0.1,
      }
    );

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

  console.log(posts);

  return (
    <div className="">
      {posts?.map((post, index) => (
        <PostCard
          key={`${post.id}-${index}`}
          post={post}
          onCommentAdded={handleCommentAdded}
        />
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

      {/* Intersection observer target */}
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
