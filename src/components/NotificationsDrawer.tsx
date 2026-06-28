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
        return <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />;
      case NotificationType.COMMENT:
        return <MessageSquare className="h-3.5 w-3.5 text-accent-blue" />;
      case NotificationType.FOLLOW:
        return <UserPlus className="h-3.5 w-3.5 text-[#34D399]" />;
      default:
        return <Award className="h-3.5 w-3.5 text-primary-custom" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Title Panel */}
      <div className="relative overflow-hidden rounded-[24px] border border-border-custom bg-card p-5 shadow-main transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#7B61FF]/5 via-transparent to-transparent pointer-events-none" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bell className="h-5 w-5 text-primary-custom" />
            <h2 className="font-heading text-base font-bold text-text-custom">Notifications</h2>
          </div>
          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1.5 font-sans text-xs text-[#34D399] font-bold hover:underline cursor-pointer"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications list */}
      <div className="flex flex-col gap-3">
        {notifications.length === 0 ? (
          <div className="rounded-[24px] border border-border-custom bg-card p-12 text-center shadow-sm">
            <p className="font-sans text-xs text-muted-custom font-semibold">All quiet here! No new notifications.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onMarkRead(notif.id)}
              className={`group relative overflow-hidden rounded-2xl border p-4.5 transition-all duration-300 flex gap-4 cursor-pointer ${
                notif.isRead 
                  ? "bg-card border-border-custom hover:bg-black/[0.01] dark:hover:bg-white/[0.01]" 
                  : "bg-primary-custom/[0.03] dark:bg-primary-custom/[0.05] border-primary-custom/20 hover:bg-primary-custom/[0.05]"
              }`}
            >
              {/* Unread indicator dot */}
              {!notif.isRead && (
                <div className="absolute top-5 right-5 h-2 w-2 rounded-full bg-primary-custom shadow-md shadow-primary-custom/40" />
              )}

              {/* Avatar / Icon layout */}
              <div className="relative shrink-0">
                {notif.actor ? (
                  <img 
                    src={notif.actor.avatar} 
                    alt="" 
                    className="h-10 w-10 rounded-full object-cover border border-border-custom"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#7B61FF] to-[#A855F7] p-0.5">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-card">
                      <Bell className="h-4.5 w-4.5 text-primary-custom" />
                    </div>
                  </div>
                )}
                {/* Micro Category Icon Pill */}
                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-card border border-border-custom shadow-sm">
                  {getIcon(notif.type)}
                </div>
              </div>

              {/* Text context details */}
              <div className="flex-1 overflow-hidden">
                <span className="font-heading text-xs font-bold text-text-custom block pr-4 leading-tight">
                  {notif.title}
                </span>
                <p className="font-sans text-xs text-muted-custom mt-1 font-semibold leading-relaxed">
                  {notif.description}
                </p>
                <span className="font-sans text-[10px] text-muted-custom/60 font-bold block mt-2">
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
