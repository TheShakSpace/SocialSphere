/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum PostType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  POLL = "POLL",
  MUSIC = "MUSIC",
  VOICE = "VOICE",
  MOOD = "MOOD"
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface MusicTrack {
  title: string;
  artist: string;
  albumArt: string;
  duration: string;
  waveData?: number[];
}

export interface VoiceMemo {
  audioUrl?: string;
  duration: string;
  waveData: number[];
}

export interface Comment {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    isCreator?: boolean;
    level?: number;
  };
  content: string;
  timestamp: string;
  likes: number;
  hasLiked?: boolean;
}

export interface Post {
  id: string;
  type: PostType;
  author: {
    name: string;
    handle: string;
    avatar: string;
    isVerified?: boolean;
    isCreator?: boolean;
    level: number;
  };
  content: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
  shares: number;
  hasLiked?: boolean;
  hasBookmarked?: boolean;
  hasShared?: boolean;
  
  // Specific post parameters
  mediaUrl?: string;
  aspectRatio?: string;
  pollOptions?: PollOption[];
  pollVotedOptionId?: string;
  musicTrack?: MusicTrack;
  voiceMemo?: VoiceMemo;
  moodLabel?: string;
  moodGradient?: string;
  moodConfidence?: number;
  comments?: Comment[];
}

export interface Story {
  id: string;
  author: {
    name: string;
    avatar: string;
    hasUnread: boolean;
  };
  mediaUrl: string;
  type: "IMAGE" | "GRADIENT";
  gradient?: string;
}

export interface TrendingTopic {
  id: string;
  hashtag: string;
  postsCount: string;
  category: string;
  momentum: "up" | "stable" | "hot";
}

export interface SuggestedCreator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  followers: string;
  level: number;
  isFollowing?: boolean;
  bio: string;
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  iconName: string; // Lucide icon lookup string
  color: string; // border/glow color
  unlockedAt: string;
}

export interface CreatorStats {
  views: number;
  viewsGrowth: number;
  engagement: number;
  engagementGrowth: number;
  followersCount: number;
  followersGrowth: number;
  streakDays: number;
  nextLevelProgress: number; // 0 - 100
}

export interface UserProfile {
  name: string;
  handle: string;
  avatar: string;
  coverImage: string;
  bio: string;
  location: string;
  website: string;
  level: number;
  stats: CreatorStats;
  skills: string[];
  interests: string[];
  badges: AchievementBadge[];
}

export enum NotificationType {
  LIKE = "LIKE",
  COMMENT = "COMMENT",
  FOLLOW = "FOLLOW",
  BADGE = "BADGE",
  ACHIEVEMENT = "ACHIEVEMENT"
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  actor?: {
    name: string;
    avatar: string;
    handle: string;
  };
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  badgeName?: string;
}
