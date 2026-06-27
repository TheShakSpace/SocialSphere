import { Post, PostType, Story, TrendingTopic, SuggestedCreator, UserProfile, AppNotification, NotificationType } from "./types";

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

export const initialPosts: Post[] = [
  {
    id: "p1",
    type: PostType.IMAGE,
    author: {
      name: "Aria Thorne",
      handle: "ariathorne",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      isCreator: true,
      isVerified: true,
      level: 42
    },
    content: "Synthesizing the new fluid layout engine inside my Apple Vision Pro setup. Depth parameters are responding beautifully to hand tracking. Realism is no longer a rendering setting; it is a physical canvas. ✨🧠",
    timestamp: "2 hours ago",
    likes: 1248,
    commentsCount: 92,
    shares: 310,
    mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80",
    aspectRatio: "16:9",
    hasLiked: false,
    hasBookmarked: false,
    comments: [
      {
        id: "c1_1",
        author: {
          name: "Zephyr Vance",
          handle: "zephyr",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          level: 28
        },
        content: "The glass refraction effect on those panels is incredibly liquid! Is it running at a stable 90hz?",
        timestamp: "1 hour ago",
        likes: 24
      },
      {
        id: "c1_2",
        author: {
          name: "Lumina Chen",
          handle: "lumina",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
          level: 19
        },
        content: "Wow, this looks amazing Aria! Please drop a tutorial on the hand-to-depth mapping.",
        timestamp: "45 mins ago",
        likes: 12
      }
    ]
  },
  {
    id: "p2",
    type: PostType.POLL,
    author: {
      name: "Zephyr Vance",
      handle: "zephyr_v",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      isCreator: true,
      level: 35
    },
    content: "With Spatial Computing accelerating fast, which framework do you believe will dominate interactive social spaces over the next 24 months? Cast your digital vote. 🌐👇",
    timestamp: "4 hours ago",
    likes: 742,
    commentsCount: 145,
    shares: 88,
    pollOptions: [
      { id: "o1", text: "React Three Fiber / WebXR", votes: 482 },
      { id: "o2", text: "Apple visionOS Native Swift", votes: 350 },
      { id: "o3", text: "Unity Spatial SDK", votes: 215 },
      { id: "o4", text: "Decentralized Engine (WASM)", votes: 94 }
    ],
    hasLiked: true,
    hasBookmarked: true,
    comments: []
  },
  {
    id: "p3",
    type: PostType.MUSIC,
    author: {
      name: "Nova Star",
      handle: "novastar",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      isCreator: true,
      isVerified: true,
      level: 56
    },
    content: "Just rendered this cinematic synthwave orbit track. It represents the quiet light before sunrise over a cybernetic neon Tokyo. Put your headphones on and drift with me. 🎧🌌",
    timestamp: "6 hours ago",
    likes: 2104,
    commentsCount: 198,
    shares: 442,
    musicTrack: {
      title: "Neon Horizon (Orchestral Mix)",
      artist: "Nova Star & Lyria 3",
      albumArt: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=400&auto=format&fit=crop&q=80",
      duration: "0:30",
      waveData: [10, 25, 40, 15, 30, 60, 45, 80, 50, 70, 95, 85, 40, 20, 65, 55, 75, 45, 90, 100, 70, 50, 60, 30, 20, 40, 55, 35, 10, 5]
    },
    hasLiked: false,
    hasBookmarked: false,
    comments: []
  },
  {
    id: "p4",
    type: PostType.MOOD,
    author: {
      name: "Lumina Chen",
      handle: "lumina",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      isCreator: false,
      level: 19
    },
    content: "Floating in a deep, melancholic frequency today. The rainy weather is bouncing off the virtual neon panels. There is something profoundly peaceful about finding comfort in solitude, far away from the crowded noise of traditional social platforms.",
    timestamp: "Yesterday",
    likes: 412,
    commentsCount: 34,
    shares: 12,
    moodLabel: "Melancholy",
    moodGradient: "from-[#98A2B3] via-[#475467] to-[#7C5CFF]",
    moodConfidence: 0.96,
    hasLiked: false,
    hasBookmarked: false,
    comments: []
  },
  {
    id: "p5",
    type: PostType.VOICE,
    author: {
      name: "Kaelen Voss",
      handle: "kaelenv",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      isCreator: true,
      level: 31
    },
    content: "A quick audio broadcast reflecting on how the 'SocialSphere' attention economy rewards quality, depth, and curated connection over raw sensationalist scroll volume. Hear my raw thoughts below. 🎙️⚡",
    timestamp: "1 day ago",
    likes: 831,
    commentsCount: 62,
    shares: 95,
    voiceMemo: {
      duration: "0:42",
      waveData: [5, 15, 25, 45, 60, 20, 10, 40, 75, 85, 95, 40, 20, 50, 80, 90, 70, 30, 45, 65, 85, 100, 80, 60, 40, 25, 15, 30, 50, 70, 60, 40, 20, 10]
    },
    hasLiked: false,
    hasBookmarked: false,
    comments: []
  }
];

export const trendingTopics: TrendingTopic[] = [
  { id: "t1", hashtag: "SpatialInterface", postsCount: "42.8K", category: "Design", momentum: "hot" },
  { id: "t2", hashtag: "NeuralArt", postsCount: "124.5K", category: "Technology", momentum: "up" },
  { id: "t3", hashtag: "NothingOS3", postsCount: "18.3K", category: "Hardware", momentum: "up" },
  { id: "t4", hashtag: "Figma3D", postsCount: "35.1K", category: "Design Tooling", momentum: "stable" },
  { id: "t5", hashtag: "WasmEngine", postsCount: "9.2K", category: "Development", momentum: "stable" }
];

export const suggestedCreators: SuggestedCreator[] = [
  {
    id: "c1",
    name: "Dr. Elian Sterling",
    handle: "sterling_neuro",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    followers: "428K",
    level: 74,
    bio: "Neuroscience researcher exploring cybernetic interfaces & brain-machine connections.",
    isFollowing: false
  },
  {
    id: "c2",
    name: "Caelia Brooks",
    handle: "caelia_3d",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    followers: "89K",
    level: 49,
    bio: "Spatial designer crafting neon physical layouts for augmented reality environments.",
    isFollowing: false
  },
  {
    id: "c3",
    name: "Orion Key",
    handle: "orion_wasm",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    followers: "120K",
    level: 61,
    bio: "Senior Rust & WASM Architect. Reimagining the speed of interactive web pages.",
    isFollowing: true
  }
];

export const userProfile: UserProfile = {
  name: "Shakshi Kumari",
  handle: "shakshikumari",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
  bio: "Creative Technologist & UI Architect. Crafting high-fidelity spatial experiences, liquid glassmorphic structures, and neural integrations. Let's build the future layer by layer.",
  location: "Neo-San Francisco",
  website: "https://socialsphere.space/shakshikumari",
  level: 48,
  stats: {
    views: 485900,
    viewsGrowth: 24.5,
    engagement: 14.8,
    engagementGrowth: 4.2,
    followersCount: 12400,
    followersGrowth: 15.1,
    streakDays: 45,
    nextLevelProgress: 72
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

export const initialNotifications: AppNotification[] = [
  {
    id: "n1",
    type: NotificationType.LIKE,
    actor: {
      name: "Aria Thorne",
      handle: "ariathorne",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    title: "Aria Thorne liked your spatial mockup post.",
    description: "Your post about 'Layered Depth Glass' received a major boost!",
    timestamp: "2 mins ago",
    isRead: false
  },
  {
    id: "n2",
    type: NotificationType.COMMENT,
    actor: {
      name: "Zephyr Vance",
      handle: "zephyr",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    title: "Zephyr Vance commented on your voice Memo.",
    description: "\"Absolute poetry. Curated interaction is exactly where the web is going!\"",
    timestamp: "12 mins ago",
    isRead: false
  },
  {
    id: "n3",
    type: NotificationType.FOLLOW,
    actor: {
      name: "Dr. Elian Sterling",
      handle: "sterling_neuro",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
    },
    title: "Dr. Elian Sterling followed you.",
    description: "Level 74 Cybernetics researcher followed your network profile.",
    timestamp: "1 hour ago",
    isRead: true
  },
  {
    id: "n4",
    type: NotificationType.ACHIEVEMENT,
    title: "Unlocked Achievement: Spatial Visionary!",
    description: "Successfully customized and aligned your spatial 3D card layout.",
    timestamp: "4 hours ago",
    isRead: true,
    badgeName: "Aesthetic Pioneer"
  }
];
