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
  const [weatherCelsius, setWeatherCelsius] = useState(19);

  // Simple current day format
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Dynamic Widget Row: Weather & Live Time - Nothing OS Style */}
      <div className="grid grid-cols-2 gap-4">
        {/* Weather Widget */}
        <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-white/4 p-4 shadow-lg backdrop-blur-md">
          <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#00FFA3] animate-pulse" />
          <div className="flex items-center gap-2 text-[#00D4FF] mb-2">
            <CloudSun className="h-4.5 w-4.5" />
            <span className="font-space text-[10px] font-bold uppercase tracking-widest">AETHER</span>
          </div>
          <span className="font-heading text-xl font-bold text-white block">
            {weatherCelsius}°C
          </span>
          <span className="font-sans text-[10px] text-[#98A2B3]">
            Neo-San Francisco
          </span>
        </div>

        {/* Calendar Widget */}
        <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-white/4 p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 text-[#7C5CFF] mb-2">
            <Calendar className="h-4.5 w-4.5" />
            <span className="font-space text-[10px] font-bold uppercase tracking-widest">CHRONO</span>
          </div>
          <span className="font-heading text-xs font-bold text-white block">
            {formattedDate}
          </span>
          <span className="font-mono text-[9px] text-[#98A2B3]">
            Streak: {stats.streakDays} Days
          </span>
        </div>
      </div>

      {/* Mini Creator Analytics Widget */}
      <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-white/4 p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[#00FFA3]">
            <Layers className="h-4.5 w-4.5" />
            <span className="font-space text-[10px] font-bold uppercase tracking-widest">MINI ANALYTICS</span>
          </div>
          <span className="rounded-full bg-[#00FFA3]/15 px-2 py-0.5 font-mono text-[9px] font-bold text-[#00FFA3]">
            +{stats.engagementGrowth}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="block font-mono text-[9px] text-[#98A2B3] uppercase">Impressions</span>
            <span className="font-space text-base font-bold text-white">
              {(stats.views / 1000).toFixed(1)}K
            </span>
          </div>
          <div>
            <span className="block font-mono text-[9px] text-[#98A2B3] uppercase">Followers</span>
            <span className="font-space text-base font-bold text-white">
              {(stats.followersCount / 1000).toFixed(1)}K
            </span>
          </div>
        </div>

        {/* Sparkles micro-bar graphics */}
        <div className="flex items-end gap-1.5 h-12 w-full mt-2 bg-black/20 p-2 rounded-xl border border-white/4">
          {[20, 45, 30, 60, 55, 75, 45, 90, 80, 100].map((h, idx) => (
            <div 
              key={idx}
              className="w-full rounded-sm bg-gradient-to-t from-[#7C5CFF] to-[#00D4FF]"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Trending Topics (Glass panel) */}
      <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-white/4 p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 text-white mb-4">
          <TrendingUp className="h-4.5 w-4.5 text-[#00D4FF]" />
          <h3 className="font-space text-xs font-bold uppercase tracking-wider">Trending Signals</h3>
        </div>

        <div className="flex flex-col gap-3">
          {trending.map((topic) => (
            <div 
              key={topic.id}
              className="group flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/[0.01] transition-all cursor-pointer"
            >
              <div>
                <span className="block font-mono text-[9px] text-[#98A2B3]">{topic.category}</span>
                <span className="font-heading text-xs font-semibold text-white group-hover:text-[#00D4FF] transition-colors">
                  #{topic.hashtag}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-mono text-[10px] text-white">{topic.postsCount}</span>
                <span className="font-mono text-[8px] text-[#00FFA3]">Hot</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Creators */}
      <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-white/4 p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 text-white mb-4">
          <UserPlus className="h-4.5 w-4.5 text-[#7C5CFF]" />
          <h3 className="font-space text-xs font-bold uppercase tracking-wider">Suggested Nodes</h3>
        </div>

        <div className="flex flex-col gap-4">
          {suggestions.map((creator) => (
            <div key={creator.id} className="flex gap-3 items-center justify-between">
              <div className="flex gap-2.5 items-center">
                <div className="relative">
                  <img 
                    src={creator.avatar} 
                    alt={creator.name} 
                    className="h-9 w-9 rounded-lg object-cover border border-[#7C5CFF]/20"
                  />
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#7C5CFF] font-space text-[8px] font-bold text-white border border-[#070B14]">
                    {creator.level}
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span className="font-heading text-xs font-semibold text-white block truncate leading-tight">
                    {creator.name}
                  </span>
                  <span className="font-mono text-[9px] text-[#98A2B3] block">@{creator.handle}</span>
                </div>
              </div>

              {/* Action Connection Button */}
              <button
                onClick={() => onFollowToggle(creator.id)}
                className={`rounded-lg px-3 py-1 font-heading text-[10px] font-bold transition-all ${
                  creator.isFollowing 
                    ? "bg-white/8 text-[#98A2B3] border border-white/10" 
                    : "bg-[#7C5CFF] hover:bg-[#7C5CFF]/90 text-white shadow-md"
                }`}
              >
                {creator.isFollowing ? "Linked" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Daily System Manifestation Quote */}
      <div className="rounded-[22px] border border-white/6 bg-white/[0.01] p-4 text-center">
        <span className="block font-mono text-[8px] text-[#98A2B3] uppercase tracking-widest mb-1.5">DAILY MANIFESTATION</span>
        <p className="font-heading text-[11px] leading-relaxed text-white/80 italic">
          "The best way to predict the cybernetic future is to design the connections."
        </p>
      </div>
    </div>
  );
}
