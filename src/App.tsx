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
  Bookmark,
  Sun,
  Moon
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

// Redesigned premium pages
import LandingPage from "./components/LandingPage";
import CommunitiesPage from "./components/CommunitiesPage";
import MessagesPage from "./components/MessagesPage";
import BookmarksPage from "./components/BookmarksPage";

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
  
  const [theme, setTheme] = useState<"light" | "dark" | any>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") return "dark";
      return "light";
    }
    return "light";
  });

  React.useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);
  
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
  const handleEnterApp = (customProfile?: Partial<UserProfile>) => {
    if (customProfile) {
      setProfile((prev) => ({
        ...prev,
        ...customProfile
      }));
    }
    setView("app");
    addToast("Successfully linked neural spectrum to SocialSphere!", "success");
  };

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
    <div className="relative min-h-screen overflow-x-hidden bg-background text-text-custom transition-colors duration-300">
      {/* 3D AMBIENT AURORA BACKGROUNDS */}
      <div className="pointer-events-none fixed inset-0 -z-30 overflow-hidden">
        {/* Soft Glowing Orbs */}
        <div className="animate-blob-1 absolute -left-1/4 -top-1/4 h-[550px] w-[550px] rounded-full bg-gradient-to-tr from-[#7B61FF]/10 to-[#38BDF8]/10 blur-[120px] dark:from-[#7B61FF]/20 dark:to-[#38BDF8]/15" />
        <div className="animate-blob-2 absolute -right-1/4 -bottom-1/4 h-[650px] w-[650px] rounded-full bg-gradient-to-tr from-[#FF6EC7]/8 to-[#FF9F43]/8 blur-[140px] dark:from-[#FF6EC7]/15 dark:to-[#FF9F43]/15" />
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
              className="relative overflow-hidden rounded-[16px] border border-border-custom bg-card/90 p-4 shadow-main backdrop-blur-xl flex items-center gap-3"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#7B61FF]/5 to-transparent pointer-events-none" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#34D399] animate-pulse" />
              <p className="font-heading text-xs font-semibold text-text-custom/90 pr-4">{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* HEADER BAR FOR QUICK NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-border-custom bg-card/85 backdrop-blur-md shadow-sm transition-colors duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView("landing")}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#7B61FF] to-[#A855F7] p-0.5 shadow-lg shadow-[#7B61FF]/10">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-card">
                <Layers className="h-4.5 w-4.5 text-primary-custom" />
              </div>
            </div>
            <span className="font-logo text-sm font-bold tracking-wider text-text-custom">
              SOCIAL<span className="text-primary-custom">SPHERE</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={() => {
                const nextTheme = theme === "light" ? "dark" : "light";
                setTheme(nextTheme);
                addToast(`Atmosphere switched to ${nextTheme === "light" ? "Bright Day" : "Nebula Night"}`, "info");
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-custom bg-card text-text-custom hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Toggle theme atmosphere"
            >
              {theme === "light" ? (
                <Moon className="h-4.5 w-4.5 text-[#7B61FF]" />
              ) : (
                <Sun className="h-4.5 w-4.5 text-[#FF9F43]" />
              )}
            </button>

            {view === "landing" ? (
              <button
                onClick={() => setView("app")}
                className="group flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#7B61FF] to-[#A855F7] px-4.5 py-2 text-xs font-heading font-bold text-white shadow-lg shadow-[#7B61FF]/15 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Launch Space</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            ) : (
              <button
                onClick={() => setView("landing")}
                className="rounded-xl border border-border-custom bg-card px-4.5 py-2 text-xs font-heading font-bold text-muted-custom hover:text-text-custom hover:bg-black/5 dark:hover:bg-white/5 transition-all"
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
            <LandingPage onEnterApp={handleEnterApp} currentProfile={profile} />
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

                  {activeTab === "messages" && (
                    <motion.div
                      key="messages"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <MessagesPage addToast={addToast} />
                    </motion.div>
                  )}

                  {activeTab === "communities" && (
                    <motion.div
                      key="communities"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <CommunitiesPage addToast={addToast} />
                    </motion.div>
                  )}

                  {activeTab === "bookmarks" && (
                    <motion.div
                      key="bookmarks"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <BookmarksPage
                        posts={posts}
                        onLike={handleLike}
                        onVote={handleVote}
                        onBookmark={handleBookmark}
                        onShare={handleShare}
                        onAddComment={handleAddComment}
                      />
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
