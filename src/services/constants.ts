import { Story, TrendingTopic, SuggestedCreator, UserProfile, AppNotification, NotificationType } from "../types";

export const initialStories: Story[] = [
  {
    id: "s1",
    author: { name: "Aria Thorne", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", hasUnread: true },
    mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80",
    type: "IMAGE"
  },
  {
    id: "s2",
    author: { name: "Zephyr Vance", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", hasUnread: true },
    mediaUrl: "",
    type: "GRADIENT",
    gradient: "from-[#7C5CFF] via-[#00D4FF] to-[#00FFA3]"
  },
  {
    id: "s3",
    author: { name: "Lumina Chen", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80", hasUnread: false },
    mediaUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&auto=format&fit=crop&q=80",
    type: "IMAGE"
  },
  {
    id: "s4",
    author: { name: "Kaelen Voss", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", hasUnread: true },
    mediaUrl: "",
    type: "GRADIENT",
    gradient: "from-[#FF5A5F] via-[#7C5CFF] to-[#00D4FF]"
  },
  {
    id: "s5",
    author: { name: "Nova Star", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", hasUnread: false },
    mediaUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=80",
    type: "IMAGE"
  }
];

export const trendingTopics: TrendingTopic[] = [
  { id: "t1", hashtag: "SpatialUI", postsCount: "12.4k nodes", category: "Spatial UI", momentum: "hot" },
  { id: "t2", hashtag: "WebXR19", postsCount: "8.9k nodes", category: "WebXR", momentum: "up" },
  { id: "t3", hashtag: "FramerMotion", postsCount: "24.5k nodes", category: "Animation", momentum: "stable" },
  { id: "t4", hashtag: "GenerativeAtmosphere", postsCount: "4.2k nodes", category: "Aesthetics", momentum: "hot" },
  { id: "t5", hashtag: "NeumorphicReality", postsCount: "16.1k nodes", category: "Design", momentum: "up" },
];

export const suggestedCreators: SuggestedCreator[] = [
  {
    id: "c1",
    name: "Zephyr Vance",
    handle: "zephyrv",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    isFollowing: false,
    bio: "Fluid motion designer & Cybernetic artist",
    level: 52,
    followers: "12.4k",
  },
  {
    id: "c2",
    name: "Nova Star",
    handle: "novastar",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    isFollowing: false,
    bio: "Generative shader architect & WebVR developer",
    level: 56,
    followers: "42.1k",
  },
  {
    id: "c3",
    name: "Lumina Chen",
    handle: "luminachen",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    isFollowing: true,
    bio: "NeuroUX researcher @ Spatial Lab",
    level: 49,
    followers: "8.9k",
  }
];

export const userProfile: UserProfile = {
  name: "Shakshi Kumari",
  handle: "shakshikumari",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
  bio: "Creative Developer exploring spatial interaction, Three.js, and aesthetic glassmorphism schemas.",
  location: "Neo-San Francisco",
  website: "https://shakshi.dev",
  level: 48,
  stats: {
    views: 485900,
    viewsGrowth: 24.5,
    engagement: 14.8,
    engagementGrowth: 4.2,
    followersCount: 12400,
    followersGrowth: 15.1,
    streakDays: 45,
    nextLevelProgress: 72,
  },
  skills: ["React 19", "Vite", "WebXR", "Spatial UI", "TailwindCSS v4", "Three.js", "Framer Motion", "Neuro design"],
  interests: ["Augmented Reality", "Cybernetic Aesthetics", "Nothing OS Design", "Ambient Technology", "Decentralized Web"],
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
  ]
};
