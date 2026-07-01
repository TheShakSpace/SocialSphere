import { create } from "zustand";
import { authApi, userApi, postApi, notificationApi } from "./api";
import { Post, UserProfile, AppNotification, SuggestedCreator, NotificationType } from "../types";

interface State {
  user: UserProfile | null;
  token: string | null;
  posts: Post[];
  notifications: AppNotification[];
  suggestions: SuggestedCreator[];
  bookmarks: Post[];
  isLoading: boolean;
  isInitialLoadDone: boolean;
  
  // Actions
  setLoading: (loading: boolean) => void;
  initializeSession: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string, avatar: string, bio: string) => Promise<any>;
  logout: () => void;
  
  // Post Actions
  fetchPosts: () => Promise<void>;
  createPost: (content: string, type: string, extra?: any) => Promise<any>;
  deletePost: (postId: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, commentContent: string) => Promise<void>;
  toggleBookmark: (postId: string) => void;
  submitPollVote: (postId: string, optionId: string) => void;

  // Profile Actions
  fetchUserProfile: (userId: string) => Promise<any>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  toggleFollowUser: (userId: string) => Promise<void>;
  searchUsers: (query: string) => Promise<any[]>;
  
  // Notifications Actions
  fetchNotifications: () => Promise<void>;
  markNotificationsAsRead: () => Promise<void>;
}

// Format date helper
function formatTime(dateStr: string) {
  if (!dateStr) return "Just now";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
}

// User Profile Augmenter
export function augmentUser(dbUser: any): UserProfile {
  if (!dbUser) return null as any;
  const id = dbUser.id || dbUser._id;
  const email = dbUser.email || "";
  const handle = email ? email.split("@")[0] : (dbUser.handle || "user_" + id.substring(0, 5));
  
  return {
    id: id,
    name: dbUser.name,
    handle: handle,
    avatar: dbUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(dbUser.name)}`,
    coverImage: dbUser.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    bio: dbUser.bio || "Exploring the creative boundaries of SocialSphere...",
    location: dbUser.location || "Neo-San Francisco",
    website: dbUser.website || `https://socialsphere.space/${handle}`,
    level: dbUser.level || 48,
    stats: dbUser.stats || {
      views: 485900,
      viewsGrowth: 24.5,
      engagement: 14.8,
      engagementGrowth: 4.2,
      followersCount: dbUser.followersCount !== undefined ? dbUser.followersCount : 12400,
      followersGrowth: 15.1,
      streakDays: 45,
      nextLevelProgress: 72,
    },
    skills: dbUser.skills && dbUser.skills.length > 0 ? dbUser.skills : ["React 19", "Vite", "WebXR", "Spatial UI", "TailwindCSS v4", "Three.js", "Framer Motion", "Neuro design"],
    interests: dbUser.interests && dbUser.interests.length > 0 ? dbUser.interests : ["Augmented Reality", "Cybernetic Aesthetics", "Nothing OS Design", "Ambient Technology", "Decentralized Web"],
    badges: [
      {
        id: "b1",
        name: "Aesthetic Pioneer",
        description: "Recognized for outstanding visual fidelity and glassmorphism layouts.",
        iconName: "Palette",
        color: "#7C5CFF",
        unlockedAt: "June 2026"
      },
      {
        id: "b2",
        name: "AI Collaborator",
        description: "Successfully integrated and deployed multiple generative server-side AI engines.",
        iconName: "Cpu",
        color: "#00FFA3",
        unlockedAt: "May 2026"
      },
      {
        id: "b3",
        name: "Spatial Devotee",
        description: "Logged over 100 high-fidelity hours in the virtual design playground.",
        iconName: "Compass",
        color: "#00D4FF",
        unlockedAt: "April 2026"
      }
    ],
  };
}

// Post mapper
export function mapPost(p: any): Post {
  let extraData: any = {};
  try {
    if (p.content && p.content.trim().startsWith("{") && p.content.trim().endsWith("}")) {
      extraData = JSON.parse(p.content);
    }
  } catch (e) {
    // Treat as normal text post
  }

  const postAuthor = augmentUser(p.user);
  const userId = localStorage.getItem("socialsphere_user_id") || "";
  const hasLiked = p.likes?.some((l: any) => {
    const lId = typeof l === "object" ? l._id || l.id : l;
    return lId === userId;
  }) || false;

  return {
    id: p._id || p.id,
    type: extraData.type || (p.image ? "IMAGE" : "TEXT"),
    author: {
      name: postAuthor.name,
      handle: postAuthor.handle,
      avatar: postAuthor.avatar,
      isVerified: true,
      isCreator: true,
      level: postAuthor.level,
    },
    content: extraData.content || p.content,
    timestamp: formatTime(p.createdAt),
    likes: p.likes?.length || 0,
    commentsCount: p.commentsCount || 0,
    shares: p.shares || Math.floor(Math.random() * 50) + 5,
    hasLiked: hasLiked,
    hasBookmarked: false,
    mediaUrl: p.image || extraData.mediaUrl,
    aspectRatio: extraData.aspectRatio || "16:9",
    pollOptions: extraData.pollOptions,
    pollVotedOptionId: extraData.pollVotedOptionId,
    musicTrack: extraData.musicTrack,
    voiceMemo: extraData.voiceMemo,
    moodLabel: extraData.moodLabel,
    moodGradient: extraData.moodGradient,
    moodConfidence: extraData.moodConfidence,
    comments: p.comments?.map((c: any) => ({
      id: c._id || c.id,
      author: {
        name: c.user?.name || "Anonymous",
        handle: c.user?.email ? c.user.email.split("@")[0] : "anonymous",
        avatar: c.user?.avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=anon",
      },
      content: c.content,
      timestamp: formatTime(c.createdAt),
      likes: 0,
    })) || [],
  };
}

// Notifications mapper
function mapNotification(n: any): AppNotification {
  let notifType = NotificationType.LIKE;
  if (n.type === "comment") notifType = NotificationType.COMMENT;
  if (n.type === "follow") notifType = NotificationType.FOLLOW;

  const actorObj = n.sender ? {
    name: n.sender.name,
    avatar: n.sender.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(n.sender.name)}`,
    handle: n.sender.email ? n.sender.email.split("@")[0] : "user",
  } : undefined;

  let title = "Notification received";
  let description = "";

  if (n.type === "like") {
    title = `${n.sender?.name || "Someone"} liked your post`;
    description = n.post?.content || "Your post was liked by another node.";
  } else if (n.type === "comment") {
    title = `${n.sender?.name || "Someone"} commented on your post`;
    description = n.post?.content || "Your post received a comment.";
  } else if (n.type === "follow") {
    title = `${n.sender?.name || "Someone"} started following you`;
    description = "Your network is growing wider.";
  }

  return {
    id: n._id || n.id,
    type: notifType,
    actor: actorObj,
    title,
    description,
    timestamp: formatTime(n.createdAt),
    isRead: n.isRead || false,
  };
}

export const useStore = create<State>((set, get) => {
  // Setup listener for unauthorized logouts
  if (typeof window !== "undefined") {
    window.addEventListener("socialsphere_logout", () => {
      set({ user: null, token: null });
    });
  }

  return {
    user: null,
    token: null,
    posts: [],
    notifications: [],
    suggestions: [],
    bookmarks: [],
    isLoading: false,
    isInitialLoadDone: false,

    setLoading: (loading: boolean) => set({ isLoading: loading }),

    initializeSession: async () => {
      const storedToken = localStorage.getItem("socialsphere_token");
      if (!storedToken) {
        set({ isInitialLoadDone: true });
        return false;
      }

      set({ token: storedToken, isLoading: true });
      try {
        const response = await authApi.getMe();
        if (response.status === "success" && response.user) {
          const augmented = augmentUser(response.user);
          localStorage.setItem("socialsphere_user_id", response.user.id || response.user._id);
          set({ user: augmented, token: storedToken, isInitialLoadDone: true });
          
          // Background fetch other user data
          get().fetchPosts();
          get().fetchNotifications();
          return true;
        }
      } catch (err) {
        localStorage.removeItem("socialsphere_token");
        localStorage.removeItem("socialsphere_user_id");
        set({ token: null, user: null, isInitialLoadDone: true });
      } finally {
        set({ isLoading: false });
      }
      return false;
    },

    login: async (email, password) => {
      set({ isLoading: true });
      try {
        const res = await authApi.login({ email, password });
        if (res.status === "success" && res.token) {
          localStorage.setItem("socialsphere_token", res.token);
          localStorage.setItem("socialsphere_user_id", res.user.id || res.user._id);
          const augmented = augmentUser(res.user);
          set({ user: augmented, token: res.token });
          
          // Fetch initial collections
          get().fetchPosts();
          get().fetchNotifications();
          return res;
        }
        throw new Error(res.error || "Login failed");
      } finally {
        set({ isLoading: false });
      }
    },

    register: async (name, email, password, avatar, bio) => {
      set({ isLoading: true });
      try {
        const res = await authApi.register({ name, email, password, avatar, bio });
        if (res.status === "success" && res.token) {
          localStorage.setItem("socialsphere_token", res.token);
          localStorage.setItem("socialsphere_user_id", res.user.id || res.user._id);
          const augmented = augmentUser(res.user);
          set({ user: augmented, token: res.token });
          
          // Fetch initial collections
          get().fetchPosts();
          get().fetchNotifications();
          return res;
        }
        throw new Error(res.error || "Registration failed");
      } finally {
        set({ isLoading: false });
      }
    },

    logout: () => {
      localStorage.removeItem("socialsphere_token");
      localStorage.removeItem("socialsphere_user_id");
      set({ user: null, token: null, posts: [], notifications: [] });
    },

    fetchPosts: async () => {
      try {
        const res = await postApi.getPosts();
        if (res.status === "success") {
          const mapped = res.posts.map((p: any) => mapPost(p));
          set({ posts: mapped });
        }
      } catch (e) {
        console.error("Failed to fetch posts", e);
      }
    },

    createPost: async (content, type, extra = {}) => {
      try {
        // Build raw string content to support rich types in a single field
        let finalContent = content;
        if (type !== "TEXT" && type !== "IMAGE") {
          finalContent = JSON.stringify({
            content,
            type,
            ...extra,
          });
        }

        const payload = {
          content: finalContent,
          image: type === "IMAGE" ? extra.mediaUrl || "" : "",
        };

        const res = await postApi.createPost(payload);
        if (res.status === "success") {
          const mapped = mapPost(res.post);
          set((prev) => ({ posts: [mapped, ...prev.posts] }));
          return mapped;
        }
      } catch (e) {
        console.error("Failed to create post", e);
        throw e;
      }
    },

    deletePost: async (postId) => {
      try {
        const res = await postApi.deletePost(postId);
        if (res.status === "success") {
          set((prev) => ({
            posts: prev.posts.filter((p) => p.id !== postId),
            bookmarks: prev.bookmarks.filter((p) => p.id !== postId),
          }));
        }
      } catch (e) {
        console.error("Failed to delete post", e);
        throw e;
      }
    },

    toggleLike: async (postId) => {
      try {
        const res = await postApi.likePost(postId);
        if (res.status === "success") {
          const userId = localStorage.getItem("socialsphere_user_id") || "";
          set((prev) => ({
            posts: prev.posts.map((p) => {
              if (p.id === postId) {
                const hasLikedNow = res.liked;
                return {
                  ...p,
                  hasLiked: hasLikedNow,
                  likes: res.likesCount !== undefined ? res.likesCount : (hasLikedNow ? p.likes + 1 : p.likes - 1),
                };
              }
              return p;
            }),
            bookmarks: prev.bookmarks.map((p) => {
              if (p.id === postId) {
                const hasLikedNow = res.liked;
                return {
                  ...p,
                  hasLiked: hasLikedNow,
                  likes: res.likesCount !== undefined ? res.likesCount : (hasLikedNow ? p.likes + 1 : p.likes - 1),
                };
              }
              return p;
            }),
          }));
        }
      } catch (e) {
        console.error("Failed to like post", e);
      }
    },

    addComment: async (postId, commentContent) => {
      try {
        const res = await postApi.addComment(postId, commentContent);
        if (res.status === "success") {
          // Re-fetch post by ID or manually inject mapped comment
          const postRes = await postApi.getPostById(postId);
          if (postRes.status === "success") {
            const updated = mapPost(postRes.post);
            // Replace comments
            set((prev) => ({
              posts: prev.posts.map((p) => (p.id === postId ? { ...p, comments: updated.comments, commentsCount: updated.comments.length } : p)),
              bookmarks: prev.bookmarks.map((p) => (p.id === postId ? { ...p, comments: updated.comments, commentsCount: updated.comments.length } : p)),
            }));
          }
        }
      } catch (e) {
        console.error("Failed to add comment", e);
        throw e;
      }
    },

    toggleBookmark: (postId) => {
      set((prev) => {
        const post = prev.posts.find((p) => p.id === postId);
        if (!post) return {};
        
        const isBookmarked = prev.bookmarks.some((b) => b.id === postId);
        let updatedBookmarks;
        if (isBookmarked) {
          updatedBookmarks = prev.bookmarks.filter((b) => b.id !== postId);
        } else {
          updatedBookmarks = [...prev.bookmarks, { ...post, hasBookmarked: true }];
        }

        return {
          bookmarks: updatedBookmarks,
          posts: prev.posts.map((p) => (p.id === postId ? { ...p, hasBookmarked: !isBookmarked } : p)),
        };
      });
    },

    submitPollVote: (postId, optionId) => {
      // Simulate/persist poll vote locally in content state
      set((prev) => ({
        posts: prev.posts.map((p) => {
          if (p.id === postId && p.pollOptions) {
            const updatedOptions = p.pollOptions.map((o) =>
              o.id === optionId ? { ...o, votes: o.votes + 1 } : o
            );
            // Update on the backend too if needed, but since it's transient, keeping it cached makes the UI feel fully dynamic
            return {
              ...p,
              pollVotedOptionId: optionId,
              pollOptions: updatedOptions,
            };
          }
          return p;
        }),
      }));
    },

    fetchUserProfile: async (userId) => {
      try {
        const res = await userApi.getProfile(userId);
        if (res.status === "success") {
          return augmentUser(res.profile);
        }
      } catch (e) {
        console.error("Failed to fetch profile", e);
      }
      return null;
    },

    updateProfile: async (updated) => {
      try {
        const res = await userApi.updateProfile({
          name: updated.name,
          bio: updated.bio,
          avatar: updated.avatar,
          coverImage: updated.coverImage,
          location: updated.location,
          website: updated.website,
          skills: updated.skills,
          interests: updated.interests,
        });
        if (res.status === "success") {
          const augmented = augmentUser(res.user);
          set({ user: augmented });
        }
      } catch (e) {
        console.error("Failed to update profile", e);
        throw e;
      }
    },

    toggleFollowUser: async (userId) => {
      try {
        const res = await userApi.followUser(userId);
        if (res.status === "success") {
          // Refresh user if logged in
          const activeUser = get().user;
          if (activeUser && activeUser.id === userId) {
            // Cannot follow self, but just in case
          }
          // Refresh posts and suggestions
          get().fetchPosts();
        }
      } catch (e) {
        console.error("Failed to follow user", e);
      }
    },

    searchUsers: async (query) => {
      try {
        const res = await userApi.searchUsers(query);
        if (res.status === "success") {
          return res.users.map((u: any) => augmentUser(u));
        }
      } catch (e) {
        console.error("Failed to search users", e);
      }
      return [];
    },

    fetchNotifications: async () => {
      try {
        const res = await notificationApi.getNotifications();
        if (res.status === "success") {
          const mapped = res.notifications.map((n: any) => mapNotification(n));
          set({ notifications: mapped });
        }
      } catch (e) {
        console.error("Failed to fetch notifications", e);
      }
    },

    markNotificationsAsRead: async () => {
      try {
        const res = await notificationApi.markNotificationsRead();
        if (res.status === "success") {
          set((prev) => ({
            notifications: prev.notifications.map((n) => ({ ...n, isRead: true })),
          }));
        }
      } catch (e) {
        console.error("Failed to mark notifications as read", e);
      }
    },
  };
});
