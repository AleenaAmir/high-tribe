"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { PostCard } from "./PostCard";
import { apiRequest } from "@/lib/api";
import {
  PostCardSkeleton,
  JourneyPostSkeleton,
} from "../../../global/LoadingSkeleton";
import {
  Post,
  ApiPost,
  ApiUser,
  ApiMedia,
  ApiResponse,
  transformApiPostToPost,
  transformApiPostsToPosts,
} from "@/lib/adapters/postAdapter";

// API Response Types are now imported from postAdapter

// Pagination response type - using the new ApiResponse interface
type PaginatedResponse = ApiResponse;

// Transformation logic is now imported from postAdapter

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

        // Handle the new API response structure
        let postsData: ApiPost[] = [];
        let paginationInfo = null;

        if (
          response?.status &&
          response?.data?.data &&
          Array.isArray(response.data.data)
        ) {
          postsData = response.data.data;
          paginationInfo = {
            total: response.data.total,
            page: response.data.current_page,
            limit: response.data.per_page,
            totalPages: response.data.last_page,
          };
        } else if (response?.data && Array.isArray(response.data)) {
          postsData = response.data;
        } else if (Array.isArray(response)) {
          postsData = response;
        }

        console.log(`Found ${postsData.length} posts on page ${pageNum}`);

        if (postsData.length > 0) {
          console.log("Raw posts data:", postsData);

          // Transform API posts to match Post interface
          const transformedPosts: Post[] = transformApiPostsToPosts(postsData);

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
