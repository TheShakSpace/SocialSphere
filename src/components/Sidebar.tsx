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
    { id: "feed", label: "Home Base", icon: Home },
    { id: "explore", label: "Explore", icon: Compass },
    {
      id: "notifications",
      label: "Interactions",
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { id: "profile", label: "My Profile", icon: User },
    { id: "settings", label: "Configurations", icon: Settings },
  ];

  return (
    <motion.div
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
      className="sticky top-6 flex h-[calc(100vh-48px)] flex-col gap-6"
    >
      {/* Outer Sidebar Glass Panel */}
      <div className="relative flex h-full flex-col justify-between rounded-[22px] border border-white/8 bg-white/4 p-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        {/* Reflection Highlight line */}
        <div className="pointer-events-none absolute inset-0 rounded-[22px] border border-white/5 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent" />

        <div>
          {/* Logo Section */}
          <div className="relative mb-6 flex h-14 items-center justify-between px-2">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2.5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#7C5CFF] to-[#00D4FF] p-0.5 shadow-lg shadow-[#7C5CFF]/20">
                    <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#070B14]">
                      <Layers className="h-4.5 w-4.5 text-[#00FFA3]" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-logo text-lg font-bold tracking-wider text-white">
                      SOCIAL<span className="text-[#00D4FF]">SPHERE</span>
                    </span>
                    <span className="font-mono text-[9px] tracking-widest text-[#98A2B3]">
                      VERSION 3.1
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {isCollapsed && (
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#7C5CFF] to-[#00D4FF] p-0.5 shadow-lg shadow-[#7C5CFF]/20">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#070B14]">
                  <Layers className="h-4.5 w-4.5 text-[#00FFA3]" />
                </div>
              </div>
            )}

            {/* Collapse Trigger Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute -right-7 top-4 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#070B14] text-white hover:bg-white/5 hover:text-[#00D4FF] transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="h-3.5 w-3.5" />
              ) : (
                <ChevronLeft className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          {/* Command Palette Instant Trigger - Nothing OS styling */}
          <div className="px-2 mb-6">
            <button
              onClick={openCommandPalette}
              className="flex w-full items-center gap-3 rounded-xl border border-white/6 bg-white/[0.02] py-2 px-3 hover:bg-white/5 transition-all text-left text-[#98A2B3]"
            >
              <Terminal className="h-4 w-4 text-[#7C5CFF]" />
              {!isCollapsed && (
                <div className="flex w-full items-center justify-between text-xs font-mono">
                  <span>Command bar</span>
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-white">
                    ⌘K
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 px-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="group relative flex h-11 w-full items-center rounded-xl px-3 transition-all duration-300"
                >
                  {/* Glowing Background pill for Active state */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/[0.04] to-white/[0.01] border-l-2 border-[#7C5CFF]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Standard Hover effect */}
                  <div className="absolute inset-0 rounded-xl bg-white/0 opacity-0 group-hover:bg-white/[0.02] group-hover:opacity-100 transition-all duration-200" />

                  {/* Nav Item Content */}
                  <div className="relative z-10 flex w-full items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <Icon
                        className={`h-5 w-5 transition-transform duration-300 group-hover:scale-105 ${
                          isActive
                            ? "text-[#7C5CFF]"
                            : "text-[#98A2B3] group-hover:text-white"
                        }`}
                      />
                      {!isCollapsed && (
                        <span
                          className={`font-heading text-sm font-medium transition-colors duration-200 ${
                            isActive ? "text-white" : "text-[#98A2B3] group-hover:text-white"
                          }`}
                        >
                          {item.label}
                        </span>
                      )}
                    </div>

                    {/* Notification badges */}
                    {item.badge !== undefined && (
                      <span className="flex h-5 items-center justify-center rounded-full bg-[#FF5A5F] px-1.5 font-mono text-[10px] font-bold text-white shadow-lg shadow-[#FF5A5F]/20">
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
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.01] p-2.5"
              >
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 rounded-xl object-cover border border-[#7C5CFF]/30"
                  />
                  <div className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#7C5CFF] font-space text-[9px] font-bold text-white shadow-md border border-[#070B14]">
                    {user.level}
                  </div>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <div className="flex items-center gap-1">
                    <span className="font-heading text-xs font-semibold text-white truncate">
                      {user.name}
                    </span>
                    <Sparkles className="h-3 w-3 text-[#00FFA3]" />
                  </div>
                  <span className="font-mono text-[10px] text-[#98A2B3] truncate">
                    @{user.handle}
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="mx-auto relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-xl object-cover border border-[#7C5CFF]/30 hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => setActiveTab("profile")}
                />
                <div className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#7C5CFF] font-space text-[9px] font-bold text-white shadow-md border border-[#070B14]">
                  {user.level}
                </div>
              </div>
            )}
          </AnimatePresence>

          {/* Action Links */}
          <div className="flex flex-col gap-1">
            <button
              onClick={onLogout}
              className="group relative flex h-10 w-full items-center rounded-xl px-3 text-[#98A2B3] hover:bg-[#FF5A5F]/10 hover:text-[#FF5A5F] transition-all"
            >
              <LogOut className="h-5 w-5 mr-3 transition-transform group-hover:translate-x-0.5" />
              {!isCollapsed && <span className="font-heading text-xs font-medium">Disconnect</span>}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
