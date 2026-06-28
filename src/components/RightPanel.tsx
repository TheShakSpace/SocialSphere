import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  UserPlus, 
  Compass, 
  Sparkles, 
  CloudSun, 
  Calendar,
  ChevronRight,
  TrendingDown,
  Info,
  Layers
} from "lucide-react";
import { TrendingTopic, SuggestedCreator, CreatorStats } from "../types";

interface RightPanelProps {
  trending: TrendingTopic[];
  suggestions: SuggestedCreator[];
  onFollowToggle: (id: string) => void;
  stats: CreatorStats;
}

export default function RightPanel({
  trending,
  suggestions,
  onFollowToggle,
  stats,
}: RightPanelProps) {
  const [weatherCelsius, setWeatherCelsius] = useState(21);

  // Simple current day format
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-6 w-full select-none">
      {/* Dynamic Widget Row: Weather & Live Time */}
      <div className="grid grid-cols-2 gap-4">
        {/* Weather Widget */}
        <div className="relative overflow-hidden rounded-[24px] border border-border-custom bg-card p-4.5 shadow-main transition-colors duration-300">
          <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-[#34D399] animate-pulse" />
          <div className="flex items-center gap-2 text-accent-blue mb-2.5">
            <CloudSun className="h-4.5 w-4.5" />
            <span className="font-heading text-[10px] font-bold uppercase tracking-wider">WEATHER</span>
          </div>
          <span className="font-heading text-lg font-bold text-text-custom block">
            {weatherCelsius}°C
          </span>
          <span className="font-sans text-[10px] text-muted-custom block mt-0.5">
            San Francisco, CA
          </span>
        </div>

        {/* Calendar Widget */}
        <div className="relative overflow-hidden rounded-[24px] border border-border-custom bg-card p-4.5 shadow-main transition-colors duration-300">
          <div className="flex items-center gap-2 text-primary-custom mb-2.5">
            <Calendar className="h-4.5 w-4.5" />
            <span className="font-heading text-[10px] font-bold uppercase tracking-wider">DATE</span>
          </div>
          <span className="font-heading text-xs font-bold text-text-custom block truncate">
            {formattedDate}
          </span>
          <span className="font-sans text-[10px] text-muted-custom block mt-1 font-semibold">
            Streak: {stats.streakDays} Days 🔥
          </span>
        </div>
      </div>

      {/* Mini Creator Analytics Widget */}
      <div className="relative overflow-hidden rounded-[24px] border border-border-custom bg-card p-5 shadow-main transition-colors duration-300">
        <div className="flex items-center justify-between mb-4.5">
          <div className="flex items-center gap-2 text-primary-custom">
            <Layers className="h-4.5 w-4.5" />
            <span className="font-heading text-[10px] font-bold uppercase tracking-wider">CREATOR INSIGHTS</span>
          </div>
          <span className="rounded-full bg-[#34D399]/15 px-2.5 py-0.5 font-sans text-[9px] font-extrabold text-[#34D399]">
            +{stats.engagementGrowth}% engagement
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="block font-sans text-[10px] text-muted-custom font-bold uppercase tracking-wider">Views</span>
            <span className="font-heading text-base font-extrabold text-text-custom">
              {(stats.views / 1000).toFixed(1)}K
            </span>
          </div>
          <div>
            <span className="block font-sans text-[10px] text-muted-custom font-bold uppercase tracking-wider">Followers</span>
            <span className="font-heading text-base font-extrabold text-text-custom">
              {(stats.followersCount / 1000).toFixed(1)}K
            </span>
          </div>
        </div>

        {/* Sparkles micro-bar graphics */}
        <div className="flex items-end gap-1.5 h-12 w-full mt-2.5 bg-black/[0.01] dark:bg-white/[0.02] p-2.5 rounded-2xl border border-border-custom">
          {[25, 48, 32, 65, 50, 78, 40, 95, 75, 100].map((h, idx) => (
            <div 
              key={idx}
              className="w-full rounded-[3px] bg-gradient-to-t from-primary-custom to-secondary-custom opacity-85 hover:opacity-100 transition-opacity"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="relative overflow-hidden rounded-[24px] border border-border-custom bg-card p-5 shadow-main transition-colors duration-300">
        <div className="flex items-center gap-2 text-text-custom mb-4.5">
          <TrendingUp className="h-4.5 w-4.5 text-accent-blue" />
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider">Trending in Sphere</h3>
        </div>

        <div className="flex flex-col gap-2.5">
          {trending.map((topic) => (
            <div 
              key={topic.id}
              className="group flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:border-border-custom hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all cursor-pointer"
            >
              <div>
                <span className="block font-sans text-[10px] text-muted-custom font-semibold">{topic.category}</span>
                <span className="font-heading text-xs font-bold text-text-custom group-hover:text-primary-custom transition-colors block mt-0.5">
                  #{topic.hashtag}
                </span>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="font-sans text-xs font-bold text-text-custom">{topic.postsCount} posts</span>
                <span className="font-sans text-[9px] font-bold text-[#34D399] uppercase tracking-wider mt-0.5">Popular</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Creators */}
      <div className="relative overflow-hidden rounded-[24px] border border-border-custom bg-card p-5 shadow-main transition-colors duration-300">
        <div className="flex items-center gap-2 text-text-custom mb-4.5">
          <UserPlus className="h-4.5 w-4.5 text-primary-custom" />
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider">Who to Follow</h3>
        </div>

        <div className="flex flex-col gap-4">
          {suggestions.map((creator) => (
            <div key={creator.id} className="flex gap-3 items-center justify-between">
              <div className="flex gap-2.5 items-center overflow-hidden">
                <div className="relative shrink-0">
                  <img 
                    src={creator.avatar} 
                    alt={creator.name} 
                    className="h-9.5 w-9.5 rounded-full object-cover border border-primary-custom/10"
                  />
                  <span className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary-custom font-space text-[8px] font-bold text-white border-2 border-card shadow-sm">
                    {creator.level}
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span className="font-heading text-xs font-bold text-text-custom block truncate leading-tight">
                    {creator.name}
                  </span>
                  <span className="font-sans text-[10px] text-muted-custom block truncate mt-0.5">@{creator.handle}</span>
                </div>
              </div>

              {/* Action Connection Button */}
              <button
                onClick={() => onFollowToggle(creator.id)}
                className={`rounded-xl px-4 py-1.5 font-heading text-[10px] font-bold transition-all cursor-pointer shrink-0 border ${
                  creator.isFollowing 
                    ? "bg-black/5 dark:bg-white/5 text-muted-custom border-border-custom" 
                    : "bg-primary-custom hover:opacity-95 text-white border-primary-custom shadow-sm"
                }`}
              >
                {creator.isFollowing ? "Linked" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Daily System Quote */}
      <div className="rounded-[24px] border border-border-custom bg-black/[0.01] dark:bg-white/[0.01] p-4.5 text-center transition-colors">
        <span className="block font-heading text-[9px] text-muted-custom font-bold uppercase tracking-widest mb-1.5">VIBE OF THE DAY</span>
        <p className="font-sans text-[11px] leading-relaxed text-text-custom/80 font-medium italic">
          "The best way to predict a friendly, connected tomorrow is to design creative spaces today."
        </p>
      </div>
    </div>
  );
}
