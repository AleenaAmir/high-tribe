// Data adapter for transforming API responses to component-ready formats

// Base API interfaces
export interface ApiUser {
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

export interface ApiMedia {
  id?: number;
  file_path?: string;
  media_type?: "image" | "video";
  type?: "photo" | "video";
  url?: string;
  duration?: number | null;
}

// Journey-specific interfaces
export interface ApiJourneyStop {
  id: number;
  post_id: number;
  stop_category_id: number;
  date: string;
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

// Unified API post interface that can handle all post types
export interface ApiPost {
  id: number;
  user: ApiUser | null;
  title?: string;
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
  media?: ApiMedia[];
  tagged_users?: ApiUser[];
  tagged_friends?: number[];
  mood_tags?: string[];
  created_at: string;
  updated_at?: string;
  reactions_count?: number;
  comments_count?: number;

  // Journey-specific fields
  start_location_name?: string;
  start_lat?: string;
  start_lng?: string;
  end_location_name?: string;
  end_lat?: string;
  end_lng?: string;
  planning_mode?: string;
  date_mode?: string;
  start_date?: string;
  end_date?: string;
  month?: string | null;
  days_count?: number | null;
  type?: string;
  status?: string;
  specify_other?: string | null;
  stops?: ApiJourneyStop[];
}

// Component-ready interfaces
export interface PostUser {
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

export interface PostMedia {
  id?: number;
  file_path?: string;
  media_type?: "image" | "video";
  duration?: number | null;
  type?: "photo" | "video";
  url?: string;
}

export interface PostStop {
  id: number;
  post_id: number;
  stop_category_id: number;
  title: string;
  location_name: string;
  lat: string;
  lng: string;
  transport_mode: string;
  transport_mode_other: string | null;
  start_date: string;
  end_date: string;
  notes: string;
  media: PostMedia[];
}

export interface Post {
  id: number;
  user: PostUser | null;
  title?: string;
  description?: string;
  story?: string;
  location?: string;
  location_name?: string;
  latitude?: string;
  longitude?: string;
  lat?: string;
  lng?: string;
  privacy: string;
  media: PostMedia[];
  tagged_users?: PostUser[];
  tagged_friends?: number[];
  mood_tags?: string[];
  expires_on?: string;
  is_resolved?: boolean;
  resolved_at?: string | null;
  created_at: string;
  updated_at?: string;
  reactions_count?: number;
  comments_count?: number;

  // Journey-specific fields
  start_location_name?: string;
  start_lat?: string;
  start_lng?: string;
  end_location_name?: string;
  end_lat?: string;
  end_lng?: string;
  planning_mode?: string;
  date_mode?: string;
  start_date?: string;
  end_date?: string;
  month?: string | null;
  days_count?: number | null;
  type?: string;
  status?: string;
  specify_other?: string | null;
  stops?: PostStop[];
}

export interface Comment {
  id: string;
  content: string;
  user: {
    name: string;
    avatarUrl: string;
  };
  timestamp: string;
  parent_id?: string;
  replies?: Comment[];
  likes?: number;
}

// API Comment interfaces
export interface ApiCommentUser {
  id: number;
  name: string;
  username: string;
  date_of_birth: string;
  email: string;
  phone: string | null;
  type: number;
}

export interface ApiComment {
  id: number;
  user_id: number;
  commentable_type: string;
  commentable_id: number;
  parent_id: number | null;
  content: string;
  depth: number;
  is_hidden: number;
  created_at: string;
  updated_at: string;
  user: ApiCommentUser;
  replies: ApiComment[];
}

export interface ApiCommentsResponse {
  data: ApiComment[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
    total_comments: number;
  };
}

// Utility functions
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 48) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
};

export const isExpired = (expiresOn?: string): boolean => {
  if (!expiresOn) return false;
  return new Date(expiresOn) < new Date();
};

// Main transformation function
export const transformApiPostToPost = (apiPost: ApiPost): Post => {
  // Validate that apiPost has required properties
  if (!apiPost || !apiPost.id) {
    console.error("Invalid API post data:", apiPost);
    throw new Error("Invalid API post data");
  }

  // Transform media
  const transformMedia = (media: ApiMedia[] | undefined): PostMedia[] => {
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

  // Transform user
  const transformUser = (user: ApiUser | null): PostUser | null => {
    if (!user) return null;
    return {
      id: user.id,
      name: user.name || "Unknown User",
      email: user.email,
      username: user.username,
      phone: user.phone,
      date_of_birth: user.date_of_birth,
      type: user.type,
      roles: user.roles,
      created_at: user.created_at,
    };
  };

  // Transform tagged users
  const transformTaggedUsers = (users: ApiUser[] | undefined): PostUser[] => {
    if (!users || !Array.isArray(users)) {
      return [];
    }
    return users.map(transformUser).filter((user): user is PostUser => user !== null);
  };

  // Transform stops
  const transformStops = (stops: ApiJourneyStop[] | undefined): PostStop[] => {
    if (!stops || !Array.isArray(stops)) {
      return [];
    }
    return stops.map((stop) => ({
      id: stop.id,
      post_id: stop.post_id,
      stop_category_id: stop.stop_category_id,
      title: stop.title,
      location_name: stop.location_name,
      lat: stop.lat,
      lng: stop.lng,
      transport_mode: stop.transport_mode,
      transport_mode_other: stop.transport_mode_other,
      start_date: stop.start_date,
      end_date: stop.end_date,
      notes: stop.notes,
      media: transformMedia(stop.media),
    }));
  };

  return {
    id: apiPost.id,
    user: transformUser(apiPost.user),
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
    media: transformMedia(apiPost.media || []),
    tagged_users: transformTaggedUsers(apiPost.tagged_users || []),
    tagged_friends: apiPost.tagged_friends,
    mood_tags: apiPost.mood_tags,
    expires_on: apiPost.expires_on,
    is_resolved: apiPost.is_resolved,
    resolved_at: apiPost.resolved_at,
    created_at: apiPost.created_at,
    updated_at: apiPost.updated_at,
    reactions_count: apiPost.reactions_count,
    comments_count: apiPost.comments_count,

    // Journey-specific fields
    start_location_name: apiPost.start_location_name,
    start_lat: apiPost.start_lat,
    start_lng: apiPost.start_lng,
    end_location_name: apiPost.end_location_name,
    end_lat: apiPost.end_lat,
    end_lng: apiPost.end_lng,
    planning_mode: apiPost.planning_mode,
    date_mode: apiPost.date_mode,
    start_date: apiPost.start_date,
    end_date: apiPost.end_date,
    month: apiPost.month,
    days_count: apiPost.days_count,
    type: apiPost.type,
    status: apiPost.status,
    specify_other: apiPost.specify_other,
    stops: transformStops(apiPost.stops),
  };
};

// Batch transformation for multiple posts
export const transformApiPostsToPosts = (apiPosts: ApiPost[]): Post[] => {
  return apiPosts
    .map((post, index) => {
      try {
        return transformApiPostToPost(post);
      } catch (error) {
        console.error(`Error transforming post ${index}:`, error);
        return null;
      }
    })
    .filter((post): post is Post => post !== null);
};

// Transform API comment to component-ready comment
export const transformApiCommentToComment = (apiComment: ApiComment): Comment => {
  return {
    id: apiComment.id.toString(),
    content: apiComment.content,
    user: {
      name: apiComment.user.name,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(apiComment.user.name)}&background=random&size=32`,
    },
    timestamp: formatDate(apiComment.created_at),
    parent_id: apiComment.parent_id?.toString(),
    replies: apiComment.replies ? apiComment.replies.map(transformApiCommentToComment) : [],
    likes: 0, // API doesn't provide likes count yet
  };
};

// Transform array of API comments to component-ready comments
export const transformApiCommentsToComments = (apiComments: ApiComment[]): Comment[] => {
  return apiComments.map(transformApiCommentToComment);
};

// Post type detection helpers
export const getPostType = (post: Post | ApiPost): 'journey' | 'footprint' | 'tip' | 'advisory' => {
  // Check for journey type
  if ('type' in post && post.type === 'mapping_journey') {
    return 'journey';
  }

  // Check for advisory (has expires_on and is_resolved)
  if ('expires_on' in post && post.expires_on && 'is_resolved' in post && post.is_resolved !== undefined) {
    return 'advisory';
  }

  // Check for footprint (has story and mood_tags)
  if ('story' in post && post.story && 'mood_tags' in post) {
    return 'footprint';
  }

  // Default to tip (has title and description but no other specific fields)
  return 'tip';
};

// Media utilities
export const getMediaUrl = (media: PostMedia | ApiMedia): string => {
  return media.file_path || media.url || "https://via.placeholder.com/400x300?text=Image";
};

export const isVideo = (media: PostMedia | ApiMedia): boolean => {
  return media.media_type === "video" || media.type === "video";
};

// API response structure
export interface ApiResponse {
  status: boolean;
  data: {
    current_page: number;
    data: ApiPost[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}
