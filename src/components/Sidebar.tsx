import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Compass,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Layers,
  Sparkles,
  MessageSquare,
  Users,
  Bookmark
} from "lucide-react";
import { UserProfile } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  unreadCount: number;
  openCommandPalette: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  user,
  unreadCount,
  openCommandPalette,
  onLogout,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: "feed", label: "Home Feed", icon: Home },
    { id: "explore", label: "Explore Grid", icon: Compass },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "communities", label: "Communities", icon: Users },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { id: "profile", label: "My Profile", icon: User },
    { id: "settings", label: "Preferences", icon: Settings },
  ];

  return (
    <motion.div
      animate={{ width: isCollapsed ? 82 : 280 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
      className="sticky top-24 flex h-[calc(100vh-110px)] flex-col gap-6 select-none"
    >
      {/* Outer Sidebar Card */}
      <div className="relative flex h-full flex-col justify-between rounded-[24px] border border-border-custom bg-card p-4.5 shadow-main transition-colors duration-300">
        <div>
          {/* Logo Section */}
          <div className="relative mb-6 flex h-14 items-center justify-between px-2">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#7B61FF] to-[#A855F7] p-0.5 shadow-lg shadow-[#7B61FF]/15">
                    <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-card">
                      <Layers className="h-4.5 w-4.5 text-primary-custom" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-heading text-base font-bold tracking-tight text-text-custom">
                      Social<span className="text-primary-custom">Sphere</span>
                    </span>
                    <span className="font-space text-[9px] font-bold tracking-widest text-muted-custom uppercase">
                      V3.1 Core
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {isCollapsed && (
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#7B61FF] to-[#A855F7] p-0.5 shadow-lg shadow-[#7B61FF]/15">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-card">
                  <Layers className="h-4.5 w-4.5 text-primary-custom" />
                </div>
              </div>
            )}

            {/* Collapse Trigger Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute -right-7.5 top-4 flex h-6.5 w-6.5 items-center justify-center rounded-full border border-border-custom bg-card text-text-custom shadow-sm hover:bg-primary-custom hover:text-white hover:scale-105 transition-all cursor-pointer z-20"
            >
              {isCollapsed ? (
                <ChevronRight className="h-3.5 w-3.5" />
              ) : (
                <ChevronLeft className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          {/* Command Palette Instant Trigger */}
          <div className="px-1.5 mb-5">
            <button
              onClick={openCommandPalette}
              className="flex w-full items-center gap-3 rounded-xl border border-border-custom bg-black/[0.02] dark:bg-white/[0.02] py-2.5 px-3.5 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all text-left text-muted-custom"
            >
              <Terminal className="h-4 w-4 text-primary-custom shrink-0" />
              {!isCollapsed && (
                <div className="flex w-full items-center justify-between text-xs font-sans">
                  <span>Command bar</span>
                  <span className="rounded bg-black/5 dark:bg-white/10 px-1.5 py-0.5 text-[9px] text-text-custom font-mono">
                    ⌘K
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 px-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="group relative flex h-11.5 w-full items-center rounded-xl px-3 transition-all duration-300 cursor-pointer"
                >
                  {/* Glowing Background pill for Active state */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className="absolute inset-0 rounded-xl bg-primary-custom/10 border-l-4 border-primary-custom"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}

                  {/* Standard Hover effect */}
                  <div className="absolute inset-0 rounded-xl bg-black/0 dark:bg-white/0 opacity-0 group-hover:bg-black/[0.02] dark:group-hover:bg-white/[0.02] group-hover:opacity-100 transition-all duration-200" />

                  {/* Nav Item Content */}
                  <div className="relative z-10 flex w-full items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <Icon
                        className={`h-5 w-5 transition-transform duration-300 group-hover:scale-105 ${
                          isActive
                            ? "text-primary-custom"
                            : "text-muted-custom group-hover:text-text-custom"
                        }`}
                      />
                      {!isCollapsed && (
                        <span
                          className={`font-heading text-[13px] font-semibold transition-colors duration-200 ${
                            isActive ? "text-primary-custom font-bold" : "text-muted-custom group-hover:text-text-custom"
                          }`}
                        >
                          {item.label}
                        </span>
                      )}
                    </div>

                    {/* Notification badges */}
                    {item.badge !== undefined && (
                      <span className="flex h-5 items-center justify-center rounded-full bg-[#FF6EC7] px-1.5 font-sans text-[10px] font-bold text-white shadow-md">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile Card & Action Area */}
        <div className="flex flex-col gap-3.5">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={() => setActiveTab("profile")}
                className="flex items-center gap-3 rounded-2xl border border-border-custom bg-black/[0.02] dark:bg-white/[0.02] p-3 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all cursor-pointer"
              >
                <div className="relative shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 rounded-xl object-cover border-2 border-primary-custom/20"
                  />
                  <div className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gradient-to-tr from-primary-custom to-secondary-custom font-space text-[9px] font-bold text-white shadow-md border-2 border-card">
                    {user.level}
                  </div>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <div className="flex items-center gap-1">
                    <span className="font-heading text-xs font-bold text-text-custom truncate">
                      {user.name}
                    </span>
                    <Sparkles className="h-3 w-3 text-[#34D399] shrink-0" />
                  </div>
                  <span className="font-sans text-[10px] text-muted-custom truncate">
                    @{user.handle}
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="mx-auto relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-xl object-cover border-2 border-primary-custom/20 hover:scale-105 transition-transform cursor-pointer shadow-sm"
                  onClick={() => setActiveTab("profile")}
                />
                <div className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary-custom font-space text-[9px] font-bold text-white shadow-md border-2 border-card">
                  {user.level}
                </div>
              </div>
            )}
          </AnimatePresence>

          {/* Logout Action button */}
          <div className="flex flex-col gap-1">
            <button
              onClick={onLogout}
              className="group relative flex h-10 w-full items-center rounded-xl px-3 text-muted-custom hover:bg-red-500/10 hover:text-red-500 transition-all cursor-pointer"
            >
              <LogOut className="h-5 w-5 mr-3 transition-transform group-hover:translate-x-0.5" />
              {!isCollapsed && <span className="font-heading text-xs font-semibold">Disconnect</span>}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
