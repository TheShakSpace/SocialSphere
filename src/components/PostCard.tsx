import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Play, 
  Pause,
  Mic,
  Activity,
  Award,
  Sparkles,
  ChevronDown,
  Volume2
} from "lucide-react";
import { Post, Comment } from "../types";
import GlassContainer from "./GlassContainer";

interface PostCardProps {
  key?: string;
  post: Post;
  onLike: (id: string) => void;
  onVote: (postId: string, optionId: string) => void;
  onBookmark: (id: string) => void;
  onShare: (id: string) => void;
  onAddComment: (postId: string, text: string) => void;
}

export default function PostCard({
  post,
  onLike,
  onVote,
  onBookmark,
  onShare,
  onAddComment
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [showCreatorCard, setShowCreatorCard] = useState(false);

  const handleVoteLocal = (optionId: string) => {
    onVote(post.id, optionId);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText);
    setCommentText("");
  };

  // Compute total votes for poll
  const totalVotes = post.pollOptions?.reduce((acc, opt) => acc + opt.votes, 0) || 0;

  // Visual glows depending on mood / post style
  const getGlowColor = () => {
    if (post.moodLabel === "Cyberpunk") return "rgba(255, 90, 95, 0.12)";
    if (post.moodLabel === "Cosmic") return "rgba(124, 92, 255, 0.15)";
    if (post.moodLabel === "Inspired") return "rgba(0, 255, 163, 0.12)";
    return "rgba(0, 212, 255, 0.08)";
  };

  return (
    <GlassContainer 
      glowColor={getGlowColor()}
      className="relative flex flex-col gap-4"
    >
      {/* Reflection glow inside */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none rounded-[22px]" />

      {/* Post Creator / Header */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Creator Profile Image with Dynamic Creator Level Hover Card */}
          <div 
            className="relative cursor-pointer"
            onMouseEnter={() => setShowCreatorCard(true)}
            onMouseLeave={() => setShowCreatorCard(false)}
          >
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              className="h-10 w-10 rounded-xl object-cover border border-[#7C5CFF]/30"
            />
            {post.author.isCreator && (
              <div className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gradient-to-tr from-[#7C5CFF] to-[#00D4FF] text-[8px] font-bold text-white shadow-md border border-[#070B14]">
                ★
              </div>
            )}

            {/* Float-in Creator Hover Profile Card */}
            <AnimatePresence>
              {showCreatorCard && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute left-0 top-12 z-30 w-64 rounded-2xl border border-white/10 bg-[#070B14]/95 p-4 shadow-2xl backdrop-blur-2xl"
                >
                  <div className="flex items-center gap-3">
                    <img src={post.author.avatar} alt="" className="h-12 w-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-heading text-xs font-bold text-white flex items-center gap-1">
                        {post.author.name}
                        {post.author.isVerified && <Sparkles className="h-3 w-3 text-[#00FFA3]" />}
                      </h4>
                      <p className="font-mono text-[9px] text-[#98A2B3]">@{post.author.handle}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/6 pt-2.5">
                    <div>
                      <span className="block font-mono text-[8px] text-[#98A2B3] uppercase">Creator Rank</span>
                      <span className="font-heading text-xs font-semibold text-white">Tier {post.author.level}</span>
                    </div>
                    <div>
                      <span className="block font-mono text-[8px] text-[#98A2B3] uppercase">Vibe Status</span>
                      <span className="font-heading text-xs font-semibold text-[#00FFA3]">Synthesized</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-xs font-bold text-white hover:underline cursor-pointer">
                {post.author.name}
              </span>
              {post.author.isVerified && (
                <Sparkles className="h-3 w-3 text-[#00FFA3]" />
              )}
              <span className="rounded-full bg-[#7C5CFF]/15 px-1.5 py-0.5 font-mono text-[8px] font-bold text-[#7C5CFF]">
                LVL {post.author.level}
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#98A2B3]">@{post.author.handle} • {post.timestamp}</span>
          </div>
        </div>

        {/* Aura pill for mood posts */}
        {post.type === "MOOD" && post.moodLabel && (
          <div className={`flex items-center gap-1.5 rounded-full bg-gradient-to-r ${post.moodGradient || "from-[#7C5CFF] to-[#00D4FF]"} px-3 py-0.5 font-space text-[10px] font-bold text-white shadow-md`}>
            <Activity className="h-3 w-3 animate-pulse" />
            <span>{post.moodLabel}</span>
          </div>
        )}
      </div>

      {/* Post Text Description */}
      <p className="font-sans text-xs leading-relaxed text-white/90">
        {post.content}
      </p>

      {/* Main Feature Rendering depending on Post Type */}
      <div className="relative">
        {/* Render 3D Image Preview */}
        {post.type === "IMAGE" && post.mediaUrl && (
          <div className="relative overflow-hidden rounded-[16px] border border-white/8 shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-[#7C5CFF]/5">
            <img 
              src={post.mediaUrl} 
              alt="SocialSphere spatial visual" 
              className="w-full object-cover max-h-[360px]"
            />
            {/* Ambient edge overlay lighting */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/40 via-transparent to-transparent pointer-events-none" />
          </div>
        )}

        {/* Render Democratic Voting Poll */}
        {post.type === "POLL" && post.pollOptions && (
          <div className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/[0.01] p-4">
            {post.pollOptions.map((opt) => {
              const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
              const hasVoted = post.pollVotedOptionId === opt.id;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleVoteLocal(opt.id)}
                  className="group relative flex w-full items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] p-3 transition-all hover:bg-white/5 text-left"
                >
                  {/* Dynamic Slide-in Percentage Bar */}
                  <div 
                    className="absolute inset-y-0 left-0 rounded-l-xl bg-gradient-to-r from-[#7C5CFF]/15 to-[#00D4FF]/10 transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                  />

                  <div className="relative z-10 flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-colors ${hasVoted ? "border-[#00FFA3] bg-[#00FFA3]" : "border-white/20"}`}>
                      {hasVoted && <div className="h-1.5 w-1.5 rounded-full bg-[#070B14]" />}
                    </div>
                    <span className="font-heading text-xs font-medium text-white">{opt.text}</span>
                  </div>

                  <span className="relative z-10 font-mono text-xs font-semibold text-[#00D4FF]">
                    {percentage}% <span className="text-[10px] text-[#98A2B3]">({opt.votes})</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Render Ambient Sound Track Player */}
        {post.type === "MUSIC" && post.musicTrack && (
          <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-gradient-to-r from-[#7C5CFF]/10 to-transparent p-4">
            <div className="relative group/album cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
              <img 
                src={post.musicTrack.albumArt} 
                alt="Album art" 
                className="h-14 w-14 rounded-xl object-cover border border-white/10"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl opacity-0 group-hover/album:opacity-100 transition-opacity">
                {isPlaying ? <Pause className="h-5 w-5 text-[#00FFA3]" /> : <Play className="h-5 w-5 text-[#00FFA3]" />}
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <span className="font-heading text-xs font-bold text-white block truncate">{post.musicTrack.title}</span>
              <span className="font-mono text-[10px] text-[#98A2B3] block">{post.musicTrack.artist}</span>
              
              {/* Animated Wave Form Visualizer */}
              <div className="mt-2.5 flex items-end gap-[2px] h-6 overflow-hidden">
                {post.musicTrack.waveData?.map((h, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: isPlaying ? `${Math.max(15, h * (0.4 + Math.random() * 0.6))}%` : "15%" }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className={`w-[3px] rounded-full ${isPlaying ? "bg-[#7C5CFF]" : "bg-white/10"}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col items-end justify-between h-14">
              <span className="font-mono text-[10px] text-[#98A2B3]">{post.musicTrack.duration}</span>
              <Volume2 className={`h-4.5 w-4.5 ${isPlaying ? "text-[#00FFA3] animate-pulse" : "text-white/20"}`} />
            </div>
          </div>
        )}

        {/* Render Voice Core Audio player */}
        {post.type === "VOICE" && post.voiceMemo && (
          <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-gradient-to-r from-[#FFC857]/10 to-transparent p-4">
            <button 
              onClick={() => setVoicePlaying(!voicePlaying)}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFC857]/15 hover:bg-[#FFC857]/25 text-[#FFC857] transition-all"
            >
              {voicePlaying ? <Pause className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>

            <div className="flex-1">
              <span className="font-heading text-[10px] font-semibold text-white/40 uppercase tracking-widest block mb-1">Vocal Stream Broadcast</span>
              
              {/* Dynamic Voice Graph */}
              <div className="flex items-center gap-[3px] h-6">
                {post.voiceMemo.waveData.map((val, idx) => (
                  <motion.div 
                    key={idx}
                    animate={{ height: voicePlaying ? `${val}%` : "20%" }}
                    transition={{ type: "spring", stiffness: 150, damping: 15 }}
                    className={`w-[2px] rounded-full flex-1 ${voicePlaying ? "bg-[#FFC857]" : "bg-white/15"}`}
                  />
                ))}
              </div>
            </div>

            <span className="font-mono text-[10px] text-[#FFC857]">{post.voiceMemo.duration}</span>
          </div>
        )}
      </div>

      {/* Post Action Buttons (Like, Comment, Share, Bookmark) */}
      <div className="flex items-center justify-between border-t border-white/6 pt-3 mt-1 text-[#98A2B3]">
        <div className="flex items-center gap-4">
          {/* Like Interaction */}
          <button 
            onClick={() => onLike(post.id)}
            className="flex items-center gap-1.5 hover:text-[#FF5A5F] transition-all group/btn"
          >
            <Heart className={`h-4.5 w-4.5 transition-transform group-hover/btn:scale-110 ${post.hasLiked ? "text-[#FF5A5F] fill-[#FF5A5F]" : ""}`} />
            <span className="font-mono text-xs">{post.likes}</span>
          </button>

          {/* Comment Dropdown trigger */}
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 hover:text-[#00D4FF] transition-all group/btn"
          >
            <MessageSquare className="h-4.5 w-4.5 transition-transform group-hover/btn:scale-110" />
            <span className="font-mono text-xs">{post.commentsCount}</span>
          </button>

          {/* Share Action */}
          <button 
            onClick={() => onShare(post.id)}
            className="flex items-center gap-1.5 hover:text-[#00FFA3] transition-all group/btn"
          >
            <Share2 className="h-4.5 w-4.5 transition-transform group-hover/btn:scale-110" />
            <span className="font-mono text-xs">{post.shares}</span>
          </button>
        </div>

        {/* Bookmark Interaction */}
        <button 
          onClick={() => onBookmark(post.id)}
          className="hover:text-[#7C5CFF] transition-all group/btn"
        >
          <Bookmark className={`h-4.5 w-4.5 transition-transform group-hover/btn:scale-110 ${post.hasBookmarked ? "text-[#7C5CFF] fill-[#7C5CFF]" : ""}`} />
        </button>
      </div>

      {/* Expandable Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/6 pt-3 mt-1"
          >
            {/* List Comments */}
            <div className="flex flex-col gap-3 mb-4 max-h-[220px] overflow-y-auto pr-1">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comm) => (
                  <div key={comm.id} className="flex gap-2.5 items-start">
                    <img src={comm.author.avatar} alt="" className="h-8 w-8 rounded-lg object-cover border border-white/5" />
                    <div className="flex-1 rounded-xl bg-white/[0.02] border border-white/4 p-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-heading text-[10px] font-bold text-white">@{comm.author.handle}</span>
                        <span className="font-mono text-[9px] text-[#98A2B3]">{comm.timestamp}</span>
                      </div>
                      <p className="font-sans text-xs text-white/80">{comm.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center">
                  <span className="font-mono text-[10px] text-[#98A2B3]">No connection logs. Be the first to comment!</span>
                </div>
              )}
            </div>

            {/* Post comment input */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Synthesize a response..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 rounded-xl border border-white/8 bg-black/40 px-3.5 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-[#7C5CFF]"
              />
              <button
                type="submit"
                className="rounded-xl bg-white/5 hover:bg-[#7C5CFF]/15 hover:text-[#7C5CFF] border border-white/10 px-4 py-2 text-xs font-semibold text-white transition-all"
              >
                Transmit
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassContainer>
  );
}
