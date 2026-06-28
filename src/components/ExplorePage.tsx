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
  { id: "all", label: "All Topics", icon: Compass, color: "text-[#7B61FF]" },
  { id: "spatial", label: "Spatial Design", icon: Sparkles, color: "text-[#38BDF8]" },
  { id: "neural", label: "Neural Models", icon: Zap, color: "text-[#34D399]" },
  { id: "hardware", label: "Device Hardware", icon: Flame, color: "text-[#FF5A5F]" },
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
    <div className="flex flex-col gap-6 select-none">
      {/* Large Glowing Search Panel */}
      <div className="relative overflow-hidden rounded-[24px] border border-border-custom bg-card p-6 shadow-main transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#7B61FF]/5 via-transparent to-transparent pointer-events-none" />
        
        <h2 className="font-heading text-xl font-bold text-text-custom mb-1.5">Explore the Sphere</h2>
        <p className="text-xs text-muted-custom mb-4 font-semibold">Discover spatial layouts, interactive voice synthesis, and dynamic vibe cards from creators worldwide.</p>

        <div className="relative">
          <Search className="absolute left-4.5 top-3.5 h-4.5 w-4.5 text-primary-custom" />
          <input
            type="text"
            placeholder="Search ideas, designers, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-border-custom bg-black/[0.01] dark:bg-white/[0.01] py-3.5 pl-12 pr-4 text-xs text-text-custom placeholder-muted-custom outline-none focus:border-primary-custom transition-all"
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
              className={`flex items-center gap-2 rounded-full border px-4.5 py-2 text-xs font-heading font-bold transition-all shrink-0 cursor-pointer ${
                isSelected 
                  ? "bg-primary-custom/10 border-primary-custom text-primary-custom shadow-sm" 
                  : "bg-card border-border-custom text-muted-custom hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <Icon className={`h-4 w-4 ${cat.color}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid of Featured Nodes / Curators */}
      <div className="relative overflow-hidden rounded-[24px] border border-border-custom bg-card p-5 shadow-main transition-colors duration-300">
        <div className="flex items-center gap-2 mb-4 text-primary-custom">
          <Award className="h-4.5 w-4.5" />
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider">Apex Creators</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {creators.map((c) => (
            <div 
              key={c.id} 
              className="relative overflow-hidden rounded-2xl border border-border-custom bg-black/[0.01] dark:bg-white/[0.01] p-4.5 flex flex-col justify-between hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all group cursor-pointer"
            >
              <div className="flex gap-2.5 items-center mb-3.5">
                <img src={c.avatar} alt="" className="h-9 w-9 rounded-full object-cover border border-primary-custom/10" />
                <div className="overflow-hidden">
                  <span className="font-heading text-xs font-bold text-text-custom block truncate leading-tight">{c.name}</span>
                  <span className="font-sans text-[10px] text-muted-custom block mt-0.5 font-semibold">@{c.handle}</span>
                </div>
              </div>
              <p className="text-[11px] text-muted-custom leading-relaxed mb-4.5 line-clamp-2 font-semibold">{c.bio}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="font-sans text-[10px] text-muted-custom font-bold">{c.followers} followers</span>
                <span className="rounded-xl bg-primary-custom/10 border border-primary-custom/20 px-2 py-0.5 font-sans text-[9px] font-extrabold text-primary-custom">LVL {c.level}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Masonry / List results of discovered Posts */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-text-custom">
            <TrendingUp className="h-4.5 w-4.5 text-accent-blue" />
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider">Sphere Feed Discoveries ({filteredPosts.length})</h3>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="rounded-[24px] border border-border-custom bg-card p-12 text-center shadow-sm">
            <p className="font-sans text-xs text-muted-custom font-semibold">No matching post connections found. Relax your search parameters!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4.5">
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
