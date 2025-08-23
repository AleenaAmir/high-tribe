"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { PostCard, Post } from "./PostCard";
import { apiRequest } from "@/lib/api";
import {
  PostCardSkeleton,
  JourneyPostSkeleton,
} from "../../global/LoadingSkeleton";

/* ---------- types (unchanged) ---------- */
interface ApiUser { id: number; name: string; username: string; email: string; date_of_birth: string; phone: string; type?: number; }
interface ApiMedia { id: number; post_stop_id?: number; travel_tip_id?: number; travel_advisory_id?: number; foot_print_id?: number; type?: "photo" | "video"; media_type?: "image" | "video"; url?: string; file_path?: string; duration?: number | null; created_at: string; updated_at: string; }
interface ApiStop { id: number; post_id: number; stop_category_id: number; category: { id: number; name: string }; title: string; location_name: string; lat: string; lng: string; transport_mode: string; transport_mode_other: string | null; start_date: string; end_date: string; notes: string; media: ApiMedia[]; }
interface ApiPost {
  id: number; user_id?: number; user: ApiUser; title: string; description?: string; story?: string; content?: string;
  location?: string; location_name?: string; latitude?: string; longitude?: string; lat?: string; lng?: string;
  start_location_name?: string; start_lat?: string; start_lng?: string; end_location_name?: string; end_lat?: string; end_lng?: string;
  privacy: string; planning_mode?: string; date_mode?: string; start_date?: string; end_date?: string; expires_on?: string;
  is_resolved?: boolean; resolved_at?: string | null; month?: string | null; days_count?: number | null; type: string; specify_other?: string | null;
  stops?: ApiStop[]; tagged_users: ApiUser[]; media: ApiMedia[];
  tags?: Array<{ id: number; foot_print_id: number; tag: string; created_at: string; updated_at: string }>;
  friends?: Array<{ id: number; foot_print_id: number; friend_user_id: number; created_at: string; updated_at: string }>;
  created_at: string; updated_at: string;
}
interface PaginatedResponse {
  data?: { data?: ApiPost[]; posts?: ApiPost[]; pagination?: { total: number; page: number; limit: number; totalPages: number } };
  posts?: ApiPost[]; pagination?: { total: number; page: number; limit: number; totalPages: number };
}

/* ---------- helpers (unchanged) ---------- */
const fallbackPosts: Post[] = [/* ... your existing fallbackPosts ... */];
const formatTimestamp = (dateString: string): string => { const date = new Date(dateString); const now = new Date(); const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60)); if (diffInHours < 1) return "Just now"; if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`; const diffInDays = Math.floor(diffInHours / 24); if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`; return date.toLocaleDateString(); };
const calculateDistance = (lat1: string, lng1: string, lat2: string, lng2: string): string => { const R = 6371; const dLat = ((parseFloat(lat2) - parseFloat(lat1)) * Math.PI) / 180; const dLng = ((parseFloat(lng2) - parseFloat(lng1)) * Math.PI) / 180; const a = Math.sin(dLat / 2) ** 2 + Math.cos((parseFloat(lat1) * Math.PI) / 180) * Math.cos((parseFloat(lat2) * Math.PI) / 180) * Math.sin(dLng / 2) ** 2; const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); const distance = R * c; return distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(2)} km`; };
const formatDateRange = (startDate: string, endDate: string): string => { const start = new Date(startDate); const end = new Date(endDate); const sM = start.toLocaleDateString("en-US", { month: "long" }); const eM = end.toLocaleDateString("en-US", { month: "long" }); const sD = start.getDate(); const eD = end.getDate(); return sM === eM ? `${sM} ${sD} - ${eD}` : `${sM} ${sD} - ${eM} ${eD}`; };

const transformApiPostToPost = (apiPost: ApiPost): Post => {
  if (!apiPost || !apiPost.id || !apiPost.user) throw new Error("Invalid API post data");
  const transformMedia = (media: ApiMedia[] | undefined) =>
    (media || []).map((item) => ({
      type: item.type === "photo" || item.media_type === "image" ? "image" : ("video" as const),
      url: item.url || item.file_path || "https://via.placeholder.com/400x300?text=No+Image",
    }));
  const participants = (apiPost.tagged_users || []).map((u, i) => ({
    avatarUrl: `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${50 + i}.jpg`,
  }));
  const allMedia = transformMedia(apiPost.media);
  const displayMedia = allMedia.slice(0, 5);
  const additionalMediaCount = Math.max(0, allMedia.length - 5);

  const basePost: Post = {
    id: apiPost.id.toString(),
    user: {
      name: apiPost.user.name || "Unknown User",
      avatarUrl: `https://randomuser.me/api/portraits/${apiPost.user.id % 2 === 0 ? "men" : "women"}/${30 + (apiPost.user.id % 20)}.jpg`,
    },
    timestamp: formatTimestamp(apiPost.created_at),
    location: apiPost.location || apiPost.location_name || "Unknown location",
    content: apiPost.description || apiPost.story || apiPost.content || "",
    media: allMedia.length ? allMedia as any : undefined,
    participants,
    love: Math.floor((apiPost.id * 7) % 500) + 50,
    likes: Math.floor((apiPost.id * 13) % 300) + 50,
    comments: Math.floor((apiPost.id * 3) % 20) + 1,
    shares: Math.floor((apiPost.id * 5) % 10) + 1,
  };

  if (apiPost.type === "travel_tip") return { ...basePost, tags: apiPost.tags?.map((t) => `🏷️ ${t.tag}`) || [] };
  if (apiPost.type === "travel_advisory") return { ...basePost, isTravelAdvisory: true, travelAdvisoryHead: apiPost.title, tags: apiPost.is_resolved ? ["✅ Resolved"] : ["⚠️ Active"] };
  if (apiPost.type === "footprint") return { ...basePost, tags: apiPost.tags?.map((t) => `📍 ${t.tag}`) || [] };

  // journey-like default
  if (apiPost.stops && apiPost.start_location_name && apiPost.end_location_name) {
    const taggedUsersHtml = (apiPost.tagged_users || [])
      .filter((u) => u.id !== apiPost.user.id)
      .map((u) => `<span class='text-[#247BFE]'>${u.name}</span>`)
      .join(" and ");
    const journeyHead = taggedUsersHtml
      ? `<p>Trip to ${apiPost.end_location_name} with ${taggedUsersHtml}</p>`
      : `<p>Trip to ${apiPost.end_location_name}</p>`;
    const directDistance = calculateDistance(apiPost.start_lat || "0", apiPost.start_lng || "0", apiPost.end_lat || "0", apiPost.end_lng || "0");
    return {
      ...basePost,
      journeyHead,
      journeyContent: {
        travelDetails: {
          locationDistance: directDistance,
          distanceCovered: directDistance,
          date: apiPost.start_date && apiPost.end_date ? formatDateRange(apiPost.start_date, apiPost.end_date) : "Unknown dates",
          mapView: "https://res.cloudinary.com/dtfzklzek/image/upload/v1751659619/Post-Img_8_hjbtrh.png",
        },
        media: displayMedia as any,
        allMedia: allMedia as any,
        additionalMediaCount,
      },
    };
  }
  return basePost;
};

/* ---------- component ---------- */
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
  const isFetchingRef = useRef(false); // guard against double fires

  const fetchPosts = useCallback(
    async (pageNum: number, isInitial = false) => {
      try {
        isFetchingRef.current = true;
        if (isInitial) setLoading(true);
        else setLoadingMore(true);
        setError(null);

        const queryParams = new URLSearchParams({ per_page: "10", page: pageNum.toString() });
        let response: PaginatedResponse | any;

        try {
          response = await apiRequest<PaginatedResponse>(`posts/all?${queryParams}`, { method: "get" });
        } catch (e1) {
          try {
            response = await apiRequest<PaginatedResponse>("posts", { method: "get" });
          } catch (e2) {
            try {
              response = await apiRequest<PaginatedResponse>("posts/all", { method: "get" });
            } catch (e3) {
              response = await apiRequest<PaginatedResponse>("feed", { method: "get" });
            }
          }
        }

        let postsData: ApiPost[] = [];
        let paginationInfo: PaginatedResponse["pagination"] | PaginatedResponse["data"] extends { pagination: infer P } ? P : any = null;

        if (response?.data?.data && Array.isArray(response.data.data)) {
          postsData = response.data.data;
          paginationInfo = response.data.pagination;
        } else if (response?.data?.posts && Array.isArray(response.data.posts)) {
          postsData = response.data.posts;
          paginationInfo = response.data.pagination;
        } else if (response?.data && Array.isArray(response.data)) {
          postsData = response.data;
          paginationInfo = response.pagination;
        } else if (Array.isArray(response)) {
          postsData = response;
        } else if (response?.posts && Array.isArray(response.posts)) {
          postsData = response.posts;
          paginationInfo = response.pagination;
        }

        if (!Array.isArray(postsData)) postsData = [];

        if (postsData.length > 0) {
          const transformed = postsData
            .map((p) => {
              try { return transformApiPostToPost(p); } catch { return null; }
            })
            .filter((p): p is Post => p !== null);

          if (transformed.length > 0) {
            if (isInitial) {
              const unique = transformed.filter((p, i, s) => i === s.findIndex((q) => q.id === p.id));
              setPosts(unique);
            } else {
              setPosts((prev) => {
                const ids = new Set(prev.map((p) => p.id));
                const uniqueNew = transformed.filter((p) => !ids.has(p.id));
                return [...prev, ...uniqueNew];
              });
            }
          } else if (isInitial) {
            setPosts(fallbackPosts);
            setHasMore(false);
          }

          if (paginationInfo?.totalPages) {
            setTotalPages(paginationInfo.totalPages);
            setHasMore(pageNum < paginationInfo.totalPages);
          } else {
            setHasMore(postsData.length === 10);
          }
        } else {
          if (isInitial) {
            setPosts(fallbackPosts);
          }
          setHasMore(false);
        }
      } catch (err) {
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
        isFetchingRef.current = false;
      }
    },
    []
  );

  const handleCommentAdded = useCallback(() => {
    fetchPosts(page, false);
  }, [page, fetchPosts]);

  // Intersection Observer for infinite scroll (auto-load only)
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        if (!hasMore || loadingMore || isFetchingRef.current) return;

        const next = page + 1;
        setPage(next);
        fetchPosts(next, false);
      },
      {
        root: null,
        rootMargin: "600px", // prefetch sooner
        threshold: 0.01,
      }
    );

    const obs = observerRef.current;
    if (loadingRef.current) obs.observe(loadingRef.current);

    return () => {
      if (obs) obs.disconnect();
    };
  }, [hasMore, loadingMore, page, fetchPosts]);

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
          onClick={() => { /* retry initial */ fetchPosts(1, true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {posts?.map((post, index) => (
        <PostCard
          key={`${post.id}-${index}`}
          post={post}
          onCommentAdded={handleCommentAdded}
        />
      ))}

      {/* Loading skeleton while fetching next page */}
      {loadingMore && (
        <div className="space-y-4">
          <JourneyPostSkeleton />
          <PostCardSkeleton />
          <JourneyPostSkeleton />
        </div>
      )}

      {/* Sentinel for IntersectionObserver */}
      <div
        ref={loadingRef}
        className="h-10 bg-transparent flex items-center justify-center"
      >
        {hasMore ? (
          <span className="text-xs text-gray-400">Loading more…</span>
        ) : (
          posts.length > 0 && (
            <span className="text-xs text-gray-400">End of feed</span>
          )
        )}
      </div>
    </div>
  );
};

export default UserFeed;
