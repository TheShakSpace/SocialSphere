import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Layers, 
  Activity, 
  Compass, 
  Bell, 
  User, 
  Settings, 
  Terminal, 
  Star, 
  Shield, 
  ArrowRight, 
  Zap,
  Flame,
  Maximize2,
  Lock,
  Globe,
  Plus,
  Play,
  Heart,
  MessageSquare,
  Bookmark
} from "lucide-react";

// Components
import Sidebar from "./components/Sidebar";
import RightPanel from "./components/RightPanel";
import CreatePost from "./components/CreatePost";
import PostCard from "./components/PostCard";
import ExplorePage from "./components/ExplorePage";
import ProfilePage from "./components/ProfilePage";
import NotificationsDrawer from "./components/NotificationsDrawer";
import SettingsPage from "./components/SettingsPage";
import CommandPalette from "./components/CommandPalette";

// Mock Data
import { 
  initialStories, 
  initialPosts, 
  trendingTopics, 
  suggestedCreators, 
  userProfile, 
  initialNotifications 
} from "./mockData";

import { Post, UserProfile, AppNotification, Story } from "./types";

// Dynamic Glass Toast implementation
interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export default function App() {
  const [view, setView] = useState<"landing" | "app">("landing");
  const [activeTab, setActiveTab] = useState("feed");
  
  // App States
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [suggestions, setSuggestions] = useState(suggestedCreators);
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  
  // Command Palette & Modal triggers
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = "toast_" + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // State Interaction Callbacks
  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          const hasLiked = !post.hasLiked;
          return {
            ...post,
            hasLiked,
            likes: hasLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
    addToast("Neural node pulse synchronized!", "success");
  };

  const handleVote = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            pollVotedOptionId: optionId,
            pollOptions: post.pollOptions?.map((opt) => ({
              ...opt,
              votes: opt.id === optionId ? opt.votes + 1 : opt.votes,
            })),
          };
        }
        return post;
      })
    );
    addToast("Democratic ballot submitted to the sphere", "success");
  };

  const handleBookmark = (id: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          const hasBookmarked = !post.hasBookmarked;
          return {
            ...post,
            hasBookmarked,
          };
        }
        return post;
      })
    );
    addToast("Post stored inside local data caches", "success");
  };

  const handleShare = (id: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            shares: post.shares + 1,
          };
        }
        return post;
      })
    );
    addToast("Connection URL shared to external client platforms", "success");
  };

  const handleAddComment = (postId: string, text: string) => {
    const newComment = {
      id: "comm_" + Date.now(),
      author: {
        name: profile.name,
        handle: profile.handle,
        avatar: profile.avatar,
      },
      content: text,
      timestamp: "Just now",
      likes: 0,
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [newComment, ...(post.comments || [])],
          };
        }
        return post;
      })
    );
    addToast("Comment successfully transmitted to feed core", "success");
  };

  const handleFollowToggle = (id: string) => {
    setSuggestions((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const isFollowing = !c.isFollowing;
          return {
            ...c,
            isFollowing,
          };
        }
        return c;
      })
    );
    addToast("Network connection nodes modified!", "success");
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast("All interactions marked as read", "success");
  };

  const unreadNotifications = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070B14] text-white">
      {/* 3D AMBIENT AURORA BACKGROUNDS */}
      <div className="pointer-events-none fixed inset-0 -z-30 overflow-hidden">
        {/* Soft Glowing Orbs */}
        <div className="animate-blob-1 absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-[#7C5CFF]/15 to-[#00D4FF]/10 blur-[130px] opacity-70" />
        <div className="animate-blob-2 absolute -right-1/4 -bottom-1/4 h-[700px] w-[700px] rounded-full bg-gradient-to-tr from-[#00FFA3]/12 to-[#7C5CFF]/10 blur-[150px] opacity-60" />
        
        {/* Abstract glowing central horizon line */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent blur-sm" />
      </div>

      {/* GLOBAL TOAST BANNER OVERLAYS */}
      <div className="fixed right-6 top-6 z-50 flex flex-col gap-2.5 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative overflow-hidden rounded-xl border border-white/10 bg-[#070B14]/90 p-4 shadow-2xl backdrop-blur-xl flex items-center gap-3"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#7C5CFF]/5 to-transparent pointer-events-none" />
              <div className="h-2 w-2 rounded-full bg-[#00FFA3] animate-pulse" />
              <p className="font-heading text-xs font-semibold text-white/90 pr-4">{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* HEADER BAR FOR QUICK NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#070B14]/65 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView("landing")}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#7C5CFF] to-[#00D4FF] p-0.5 shadow-lg shadow-[#7C5CFF]/20">
              <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-[#070B14]">
                <Layers className="h-4 w-4 text-[#00FFA3]" />
              </div>
            </div>
            <span className="font-logo text-sm font-bold tracking-wider text-white">
              SOCIAL<span className="text-[#00D4FF]">SPHERE</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {view === "landing" ? (
              <button
                onClick={() => setView("app")}
                className="group flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] px-4 py-2 text-xs font-heading font-bold text-white shadow-lg shadow-[#7C5CFF]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Launch Space</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            ) : (
              <button
                onClick={() => setView("landing")}
                className="rounded-xl border border-white/8 bg-white/4 px-4 py-2 text-xs font-heading font-bold text-[#98A2B3] hover:text-white hover:bg-white/10 transition-all"
              >
                Product Specs
              </button>
            )}
          </div>
        </div>
      </header>

      {/* COMMAND PALETTE */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setView("app");
        }}
        onGenerateCaption={() => {
          setActiveTab("feed");
          setView("app");
          addToast("Opened post caption synthesis core!", "info");
        }}
      />

      {/* CORE CONTENT LAYOUT SWITCHER */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <AnimatePresence mode="wait">
          {view === "landing" ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-24"
            >
              {/* Giant Hero Title & Illustration */}
              <div className="text-center relative py-12">
                {/* 3D background floating geometric spheres */}
                <div className="absolute -top-10 left-12 h-14 w-14 rounded-full border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md animate-bounce pointer-events-none" style={{ animationDuration: "6s" }} />
                <div className="absolute bottom-6 right-16 h-10 w-10 rounded-full border border-white/10 bg-gradient-to-tr from-[#7C5CFF]/20 to-[#00D4FF]/20 blur-[1px] shadow-2xl pointer-events-none" />

                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#7C5CFF]/30 bg-[#7C5CFF]/10 px-4 py-1.5 font-space text-[11px] font-bold text-[#7C5CFF] mb-6 shadow-lg shadow-[#7C5CFF]/5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>INTELLIGENT SOCIAL ENGINE V3.1</span>
                </motion.div>

                <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-none">
                  Where Ideas Become <span className="bg-gradient-to-r from-[#7C5CFF] via-[#00D4FF] to-[#00FFA3] bg-clip-text text-transparent">Connections</span>
                </h1>
                
                <p className="mt-6 font-sans text-sm text-[#98A2B3] max-w-xl mx-auto leading-relaxed">
                  Experience a luxurious spatial paradigm of interaction. Blending deep physical glass aesthetics, custom ambient synthesizers, and server-side generative intelligence.
                </p>

                <div className="mt-8 flex justify-center gap-4">
                  <button
                    onClick={() => setView("app")}
                    className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] hover:from-[#7C5CFF]/90 hover:to-[#00D4FF]/90 px-6 py-3 font-heading font-bold text-white shadow-xl shadow-[#7C5CFF]/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <span>Begin Exploration</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <button
                    onClick={() => setIsCommandPaletteOpen(true)}
                    className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 hover:bg-white/10 px-6 py-3 font-heading font-semibold text-white transition-all"
                  >
                    <Terminal className="h-4.5 w-4.5 text-[#00D4FF]" />
                    <span>Command Bar (⌘K)</span>
                  </button>
                </div>
              </div>

              {/* 3D Animated Mockup Layout */}
              <div className="relative justify-center flex">
                <div 
                  style={{
                    perspective: 1200,
                  }}
                  className="w-full max-w-4xl"
                >
                  <motion.div 
                    initial={{ rotateX: 20, rotateY: -10, scale: 0.95 }}
                    animate={{ rotateX: 12, rotateY: -6, scale: 1 }}
                    transition={{ type: "spring", stiffness: 80, damping: 15 }}
                    className="rounded-[22px] border border-white/12 bg-white/5 p-4 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative overflow-hidden"
                  >
                    {/* Visual glowing border */}
                    <div className="absolute inset-0 border border-white/10 rounded-[22px] pointer-events-none" />
                    
                    {/* Fake Web Header dots */}
                    <div className="flex items-center gap-1.5 mb-4 px-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#FF5A5F]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#FFC857]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#00FFA3]" />
                      <span className="font-mono text-[9px] text-white/30 ml-2">https://socialsphere.space/galaxy</span>
                    </div>

                    {/* Inside Mock layout */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 opacity-90">
                      {/* Sidebar mock */}
                      <div className="border border-white/6 bg-white/[0.01] rounded-xl p-3 flex flex-col gap-3">
                        <div className="h-6 w-3/4 bg-white/10 rounded-md" />
                        <div className="h-4 w-full bg-white/5 rounded-md" />
                        <div className="h-4 w-5/6 bg-white/5 rounded-md" />
                        <div className="h-4 w-4/5 bg-white/5 rounded-md" />
                      </div>
                      
                      {/* Center mock feed */}
                      <div className="md:col-span-2 flex flex-col gap-4">
                        {/* Mock post create */}
                        <div className="border border-white/8 bg-white/4 rounded-xl p-4 flex flex-col gap-2">
                          <div className="flex gap-2 items-center">
                            <div className="h-6 w-6 rounded-full bg-white/20" />
                            <div className="h-4 w-1/3 bg-white/10 rounded-md" />
                          </div>
                          <div className="h-10 w-full bg-white/5 rounded-md" />
                        </div>

                        {/* Mock post card */}
                        <div className="border border-white/8 bg-white/4 rounded-xl p-4 flex flex-col gap-3">
                          <div className="flex gap-2 items-center">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#7C5CFF] to-[#00D4FF]" />
                            <div>
                              <div className="h-4 w-20 bg-white/10 rounded-md" />
                              <div className="h-3 w-12 bg-white/5 rounded-md mt-1" />
                            </div>
                          </div>
                          <div className="h-16 w-full bg-white/10 rounded-lg" />
                        </div>
                      </div>

                      {/* Right utility mock */}
                      <div className="border border-white/6 bg-white/[0.01] rounded-xl p-3 flex flex-col gap-3">
                        <div className="h-6 w-1/2 bg-white/10 rounded-md" />
                        <div className="h-10 w-full bg-white/5 rounded-md" />
                        <div className="h-12 w-full bg-white/5 rounded-md" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* High-Fidelity Features Grid */}
              <div className="flex flex-col gap-6">
                <div className="text-center">
                  <span className="font-space text-[10px] font-bold text-[#00FFA3] uppercase tracking-widest">ARCHITECTURE</span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-1.5">Engineered to Inspire</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Feature 1 */}
                  <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-white/4 p-6 shadow-md backdrop-blur-md">
                    <Zap className="h-8 w-8 text-[#00D4FF] mb-4" />
                    <h3 className="font-heading text-sm font-bold text-white mb-2">Liquid Glassmorphism</h3>
                    <p className="font-sans text-xs text-[#98A2B3] leading-relaxed">
                      Interface panels with simulated dynamic depth. Responsive 3D rotation transforms coordinate to mouse coordinates.
                    </p>
                  </div>

                  {/* Feature 2 */}
                  <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-white/4 p-6 shadow-md backdrop-blur-md">
                    <Activity className="h-8 w-8 text-[#00FFA3] mb-4 animate-pulse" />
                    <h3 className="font-heading text-sm font-bold text-white mb-2">Ambient Vibe Synthesis</h3>
                    <p className="font-sans text-xs text-[#98A2B3] leading-relaxed">
                      Continuous mood and vibe scanning powered by server-side Gemini AI models. Render emotional gradients into visual spaces.
                    </p>
                  </div>

                  {/* Feature 3 */}
                  <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-white/4 p-6 shadow-md backdrop-blur-md">
                    <Sparkles className="h-8 w-8 text-[#7C5CFF] mb-4" />
                    <h3 className="font-heading text-sm font-bold text-white mb-2">Omnipresent AI Assistant</h3>
                    <p className="font-sans text-xs text-[#98A2B3] leading-relaxed">
                      Need custom titles or high-vibe creative structures? Transmit topics to the Gemini engine for immediate narrative generation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing Cards (For the ultimate expensive product feel) */}
              <div className="flex flex-col gap-6">
                <div className="text-center">
                  <span className="font-space text-[10px] font-bold text-[#7C5CFF] uppercase tracking-widest">TRANSMISSION FREQUENCY</span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-1.5">Choose Your Level</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto w-full">
                  {/* Basic */}
                  <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-white/4 p-6 shadow-md flex flex-col justify-between">
                    <div>
                      <span className="font-space text-[10px] font-bold text-[#98A2B3] uppercase">Standard</span>
                      <h3 className="font-heading text-lg font-bold text-white mt-1">Creator Core</h3>
                      <p className="text-xs text-[#98A2B3] mt-2 mb-4">Perfect for casual narrative transmission and spatial interaction.</p>
                      <span className="font-heading text-2xl font-bold text-white block">$0 / Month</span>
                    </div>
                    <button onClick={() => setView("app")} className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-all">
                      Access Deck
                    </button>
                  </div>

                  {/* Pro / Ultra */}
                  <div className="relative overflow-hidden rounded-[22px] border border-white/12 bg-white/5 p-6 shadow-xl flex flex-col justify-between">
                    <div className="absolute top-2 right-4 rounded-full bg-[#7C5CFF]/20 border border-[#7C5CFF]/40 px-2.5 py-0.5 font-space text-[8px] font-bold text-[#7C5CFF]">APEX STATUS</div>
                    <div>
                      <span className="font-space text-[10px] font-bold text-[#00D4FF] uppercase">Premium</span>
                      <h3 className="font-heading text-lg font-bold text-white mt-1">Quantum Supernova</h3>
                      <p className="text-xs text-[#98A2B3] mt-2 mb-4">Unlimited server-side generative AI queries and full custom badge access.</p>
                      <span className="font-heading text-2xl font-bold text-white block">$12 / Month</span>
                    </div>
                    <button onClick={() => { setView("app"); addToast("Apex Premium subscription synthesized!", "success"); }} className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] py-2.5 text-xs font-bold text-white hover:scale-[1.01] transition-all shadow-md shadow-[#7C5CFF]/15">
                      Transmit Premium
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <footer className="border-t border-white/5 pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#98A2B3]">
                <span>Designed by senior UI/UX Architects.</span>
                <span>© 2026 SocialSphere space corporation.</span>
              </footer>
            </motion.div>
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* LEFT FLOATING SIDEBAR (3 Cols) */}
              <div className="lg:col-span-3">
                <Sidebar
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  user={profile}
                  unreadCount={unreadNotifications}
                  openCommandPalette={() => setIsCommandPaletteOpen(true)}
                  onLogout={() => {
                    setView("landing");
                    addToast("Disconnected from SocialSphere core.", "info");
                  }}
                />
              </div>

              {/* CENTER COMPILATION FEED OR OTHER TAB CONTENTS (6 Cols) */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                <AnimatePresence mode="wait">
                  {activeTab === "feed" && (
                    <motion.div
                      key="feed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col gap-6"
                    >
                      {/* Stories Carousel Row */}
                      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-none items-center">
                        {/* Create Story Button */}
                        <div className="flex flex-col items-center shrink-0 gap-1.5 cursor-pointer">
                          <div className="h-14 w-14 rounded-full border border-dashed border-white/20 hover:border-[#7C5CFF] flex items-center justify-center transition-colors">
                            <Plus className="h-5 w-5 text-white/50 hover:text-white" />
                          </div>
                          <span className="font-heading text-[9px] font-medium text-white/60">Add Vibe</span>
                        </div>

                        {stories.map((story) => (
                          <div 
                            key={story.id} 
                            onClick={() => addToast(`Stream view synthesized for ${story.author.name}!`, "info")}
                            className="flex flex-col items-center shrink-0 gap-1.5 cursor-pointer group"
                          >
                            <div className={`h-14 w-14 rounded-full p-[2px] transition-transform duration-300 group-hover:scale-105 ${story.author.hasUnread ? "bg-gradient-to-tr from-[#7C5CFF] via-[#00D4FF] to-[#00FFA3]" : "bg-white/10"}`}>
                              <img 
                                src={story.author.avatar} 
                                alt={story.author.name} 
                                className="h-full w-full rounded-full object-cover border-2 border-[#070B14]"
                              />
                            </div>
                            <span className="font-heading text-[9px] font-medium text-white/80 group-hover:text-white truncate max-w-[60px]">
                              {story.author.name.split(" ")[0]}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Post Synthesizer form */}
                      <CreatePost
                        user={profile}
                        onAddPost={(p) => setPosts([p, ...posts])}
                        addToast={addToast}
                      />

                      {/* Compilation Feed List of PostCards */}
                      <div className="flex flex-col gap-6">
                        {posts.map((post) => (
                          <PostCard
                            key={post.id}
                            post={post}
                            onLike={handleLike}
                            onVote={handleVote}
                            onBookmark={handleBookmark}
                            onShare={handleShare}
                            onAddComment={handleAddComment}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "explore" && (
                    <motion.div
                      key="explore"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ExplorePage
                        posts={posts}
                        creators={suggestions}
                        onLike={handleLike}
                        onVote={handleVote}
                        onBookmark={handleBookmark}
                        onShare={handleShare}
                        onAddComment={handleAddComment}
                      />
                    </motion.div>
                  )}

                  {activeTab === "notifications" && (
                    <motion.div
                      key="notifications"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <NotificationsDrawer
                        notifications={notifications}
                        onMarkRead={handleMarkRead}
                        onMarkAllRead={handleMarkAllRead}
                      />
                    </motion.div>
                  )}

                  {activeTab === "profile" && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ProfilePage
                        profile={profile}
                        posts={posts}
                        onUpdateProfile={handleUpdateProfile}
                        onLike={handleLike}
                        onVote={handleVote}
                        onBookmark={handleBookmark}
                        onShare={handleShare}
                        onAddComment={handleAddComment}
                        addToast={addToast}
                      />
                    </motion.div>
                  )}

                  {activeTab === "settings" && (
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <SettingsPage addToast={addToast} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* RIGHT UTILITY WIDGET PANEL (3 Cols) */}
              <div className="lg:col-span-3">
                <RightPanel
                  trending={trendingTopics}
                  suggestions={suggestions}
                  onFollowToggle={handleFollowToggle}
                  stats={profile.stats}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
