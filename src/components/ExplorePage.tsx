import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Search, 
  Sparkles, 
  Flame, 
  Compass, 
  Zap, 
  Award,
  Filter,
  Grid,
  TrendingUp,
  Image,
  Activity
} from "lucide-react";
import { Post, SuggestedCreator } from "../types";
import PostCard from "./PostCard";

interface ExplorePageProps {
  posts: Post[];
  creators: SuggestedCreator[];
  onLike: (id: string) => void;
  onVote: (postId: string, optionId: string) => void;
  onBookmark: (id: string) => void;
  onShare: (id: string) => void;
  onAddComment: (postId: string, text: string) => void;
}

const CATEGORIES = [
  { id: "all", label: "All Realities", icon: Compass, color: "text-[#7C5CFF]" },
  { id: "spatial", label: "Spatial Design", icon: Sparkles, color: "text-[#00D4FF]" },
  { id: "neural", label: "Neural Models", icon: Zap, color: "text-[#00FFA3]" },
  { id: "hardware", label: "Nothing Hardware", icon: Flame, color: "text-[#FF5A5F]" },
];

export default function ExplorePage({
  posts,
  creators,
  onLike,
  onVote,
  onBookmark,
  onShare,
  onAddComment,
}: ExplorePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.handle.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (selectedCategory === "all") return matchesSearch;
    if (selectedCategory === "spatial") {
      return matchesSearch && (post.content.toLowerCase().includes("vision") || post.content.toLowerCase().includes("spatial") || post.type === "IMAGE");
    }
    if (selectedCategory === "neural") {
      return matchesSearch && (post.content.toLowerCase().includes("ai") || post.content.toLowerCase().includes("brain") || post.type === "MOOD");
    }
    if (selectedCategory === "hardware") {
      return matchesSearch && (post.content.toLowerCase().includes("hardware") || post.content.toLowerCase().includes("nothing") || post.type === "POLL");
    }
    return matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Large Glowing Search Panel */}
      <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-white/4 p-6 shadow-xl backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#7C5CFF]/5 via-transparent to-transparent pointer-events-none" />
        
        <h2 className="font-heading text-xl font-bold text-white mb-2">Explore the Sphere</h2>
        <p className="text-xs text-[#98A2B3] mb-4">Discover spatial configurations, interactive synths, and neural expressions from curators around the globe.</p>

        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-[#7C5CFF]" />
          <input
            type="text"
            placeholder="Search keywords, creators, or neural nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-white/8 bg-black/40 py-3.5 pl-12 pr-4 text-xs text-white placeholder-white/30 outline-none focus:border-[#7C5CFF] focus:shadow-[0_0_15px_rgba(124,92,255,0.15)] transition-all"
          />
        </div>
      </div>

      {/* Category Horizontal Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-heading font-medium transition-all ${
                isSelected 
                  ? "bg-gradient-to-r from-[#7C5CFF]/15 to-[#00D4FF]/15 border-[#7C5CFF] text-white shadow-md shadow-[#7C5CFF]/10" 
                  : "bg-white/[0.02] border-white/6 text-[#98A2B3] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`h-4 w-4 ${cat.color}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid of Featured Nodes / Curators */}
      <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-white/4 p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4 text-[#00FFA3]">
          <Award className="h-4.5 w-4.5" />
          <h3 className="font-space text-xs font-bold uppercase tracking-wider">Apex Curators</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {creators.map((c) => (
            <div 
              key={c.id} 
              className="relative overflow-hidden rounded-2xl border border-white/6 bg-white/[0.01] p-4 flex flex-col justify-between hover:bg-white/[0.03] hover:border-white/10 transition-all group"
            >
              <div className="flex gap-2.5 items-center mb-3">
                <img src={c.avatar} alt="" className="h-9 w-9 rounded-lg object-cover" />
                <div>
                  <span className="font-heading text-xs font-semibold text-white block truncate leading-tight">{c.name}</span>
                  <span className="font-mono text-[9px] text-[#98A2B3]">@{c.handle}</span>
                </div>
              </div>
              <p className="text-[10px] text-[#98A2B3] leading-relaxed mb-4 line-clamp-2">{c.bio}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="font-mono text-[9px] text-white/50">{c.followers} followers</span>
                <span className="rounded-md bg-[#7C5CFF]/10 border border-[#7C5CFF]/20 px-1.5 py-0.5 font-space text-[8px] font-bold text-[#7C5CFF]">LVL {c.level}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Masonry / List results of discovered Posts */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <TrendingUp className="h-4.5 w-4.5 text-[#00D4FF]" />
            <h3 className="font-space text-xs font-bold uppercase tracking-wider">Feed Sync Results ({filteredPosts.length})</h3>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="rounded-[22px] border border-white/6 bg-white/[0.01] p-12 text-center">
            <p className="font-sans text-xs text-[#98A2B3]">No matching spatial connections found. Adjust your filters or query.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={onLike}
                onVote={onVote}
                onBookmark={onBookmark}
                onShare={onShare}
                onAddComment={onAddComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
