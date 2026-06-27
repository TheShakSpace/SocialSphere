import React from "react";
import { motion } from "motion/react";
import { Bell, Heart, MessageSquare, UserPlus, Award, CheckCircle, Trash2 } from "lucide-react";
import { AppNotification, NotificationType } from "../types";

interface NotificationsDrawerProps {
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export default function NotificationsDrawer({
  notifications,
  onMarkRead,
  onMarkAllRead,
}: NotificationsDrawerProps) {
  
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.LIKE:
        return <Heart className="h-4.5 w-4.5 text-[#FF5A5F]" />;
      case NotificationType.COMMENT:
        return <MessageSquare className="h-4.5 w-4.5 text-[#00D4FF]" />;
      case NotificationType.FOLLOW:
        return <UserPlus className="h-4.5 w-4.5 text-[#00FFA3]" />;
      default:
        return <Award className="h-4.5 w-4.5 text-[#7C5CFF]" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title Panel */}
      <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-white/4 p-5 shadow-xl backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#7C5CFF]/5 via-transparent to-transparent pointer-events-none" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bell className="h-5 w-5 text-[#7C5CFF]" />
            <h2 className="font-heading text-lg font-bold text-white">Neural Interactions</h2>
          </div>
          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1 font-mono text-[10px] text-[#00FFA3] hover:underline"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Mark all synchronized</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications list */}
      <div className="flex flex-col gap-3">
        {notifications.length === 0 ? (
          <div className="rounded-[22px] border border-white/6 bg-white/[0.01] p-12 text-center">
            <p className="font-sans text-xs text-[#98A2B3]">No neural activity logged recently.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onMarkRead(notif.id)}
              className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 flex gap-4 cursor-pointer ${
                notif.isRead 
                  ? "bg-white/[0.01] border-white/4 hover:bg-white/[0.02]" 
                  : "bg-gradient-to-r from-white/[0.05] to-white/[0.01] border-white/10 hover:from-white/[0.07]"
              }`}
            >
              {/* Unread indicator dot */}
              {!notif.isRead && (
                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-[#7C5CFF] shadow-lg shadow-[#7C5CFF]/50" />
              )}

              {/* Avatar / Icon layout */}
              <div className="relative shrink-0">
                {notif.actor ? (
                  <img 
                    src={notif.actor.avatar} 
                    alt="" 
                    className="h-10 w-10 rounded-xl object-cover border border-white/5"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#7C5CFF] to-[#00D4FF] p-0.5">
                    <div className="flex h-full w-full items-center justify-center rounded-[9px] bg-[#070B14]">
                      <Bell className="h-4 w-4 text-[#00FFA3]" />
                    </div>
                  </div>
                )}
                {/* Micro Category Icon Pill */}
                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#070B14] border border-white/10 shadow-sm">
                  {getIcon(notif.type)}
                </div>
              </div>

              {/* Text context details */}
              <div className="flex-1">
                <span className="font-heading text-xs font-semibold text-white block pr-4">
                  {notif.title}
                </span>
                <p className="font-sans text-xs text-[#98A2B3] mt-1">
                  {notif.description}
                </p>
                <span className="font-mono text-[9px] text-[#98A2B3]/60 block mt-2">
                  {notif.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
