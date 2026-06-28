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
    if (post.moodLabel === "Cyberpunk") return "rgba(255, 110, 199, 0.15)";
    if (post.moodLabel === "Cosmic") return "rgba(123, 97, 255, 0.16)";
    if (post.moodLabel === "Inspired") return "rgba(52, 211, 153, 0.15)";
    return "rgba(56, 189, 248, 0.12)";
  };

  return (
    <GlassContainer 
      glowColor={getGlowColor()}
      className="relative flex flex-col gap-4.5 p-6 transition-all duration-300"
    >
      {/* Reflection glow inside */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none rounded-[24px]" />

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
              className="h-11 w-11 rounded-full object-cover border-2 border-primary-custom/10"
            />
            {post.author.isCreator && (
              <div className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gradient-to-tr from-[#7B61FF] to-[#A855F7] text-[8px] font-bold text-white shadow-md border-2 border-card">
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
                  className="absolute left-0 top-13 z-30 w-64 rounded-2xl border border-border-custom bg-card/95 p-4.5 shadow-hover backdrop-blur-xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img src={post.author.avatar} alt="" className="h-12 w-12 rounded-xl object-cover border border-primary-custom/10" />
                    <div>
                      <h4 className="font-heading text-xs font-bold text-text-custom flex items-center gap-1">
                        {post.author.name}
                        {post.author.isVerified && <Sparkles className="h-3 w-3 text-[#34D399]" />}
                      </h4>
                      <p className="font-sans text-[10px] text-muted-custom">@{post.author.handle}</p>
                    </div>
                  </div>
                  <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-border-custom pt-3">
                    <div>
                      <span className="block font-sans text-[8px] text-muted-custom font-bold uppercase tracking-wider">Creator Rank</span>
                      <span className="font-heading text-[11px] font-bold text-primary-custom">Tier {post.author.level}</span>
                    </div>
                    <div>
                      <span className="block font-sans text-[8px] text-muted-custom font-bold uppercase tracking-wider">Status</span>
                      <span className="font-heading text-[11px] font-bold text-[#34D399]">Verified Hub</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-heading text-xs font-bold text-text-custom hover:underline cursor-pointer">
                {post.author.name}
              </span>
              {post.author.isVerified && (
                <Sparkles className="h-3.5 w-3.5 text-[#34D399]" />
              )}
              <span className="rounded-full bg-primary-custom/10 px-2 py-0.5 font-sans text-[9px] font-extrabold text-primary-custom">
                LVL {post.author.level}
              </span>
            </div>
            <span className="font-sans text-[10px] text-muted-custom block mt-0.5">@{post.author.handle} • {post.timestamp}</span>
          </div>
        </div>

        {/* Aura pill for mood posts */}
        {post.type === "MOOD" && post.moodLabel && (
          <div className={`flex items-center gap-1.5 rounded-full bg-gradient-to-r ${post.moodGradient || "from-[#7B61FF] to-[#A855F7]"} px-3 py-1 font-heading text-[10px] font-extrabold text-white shadow-md shadow-primary-custom/5`}>
            <Activity className="h-3.5 w-3.5 animate-pulse" />
            <span>{post.moodLabel}</span>
          </div>
        )}
      </div>

      {/* Post Text Description */}
      <p className="font-sans text-[13px] leading-relaxed text-text-custom/90 font-medium whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Main Feature Rendering depending on Post Type */}
      <div className="relative">
        {/* Render 3D Image Preview */}
        {post.type === "IMAGE" && post.mediaUrl && (
          <div className="relative overflow-hidden rounded-[20px] border border-border-custom shadow-md transition-all duration-300 hover:scale-[1.005] hover:shadow-hover group/image">
            <img 
              src={post.mediaUrl} 
              alt="SocialSphere spatial visual" 
              className="w-full object-cover max-h-[360px]"
            />
            {/* Ambient edge overlay lighting */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none group-hover/image:opacity-80 transition-opacity" />
          </div>
        )}

        {/* Render Democratic Voting Poll */}
        {post.type === "POLL" && post.pollOptions && (
          <div className="flex flex-col gap-2 rounded-2xl border border-border-custom bg-black/[0.01] dark:bg-white/[0.01] p-4">
            {post.pollOptions.map((opt) => {
              const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
              const hasVoted = post.pollVotedOptionId === opt.id;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleVoteLocal(opt.id)}
                  className="group relative flex w-full items-center justify-between rounded-xl border border-border-custom bg-card p-3.5 transition-all hover:border-primary-custom/40 text-left cursor-pointer overflow-hidden shadow-sm"
                >
                  {/* Dynamic Slide-in Percentage Bar */}
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-custom/10 to-secondary-custom/5 transition-all duration-500 rounded-r-lg" 
                    style={{ width: `${percentage}%` }}
                  />

                  <div className="relative z-10 flex items-center gap-2.5">
                    <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-colors ${hasVoted ? "border-primary-custom bg-primary-custom text-white" : "border-border-custom"}`}>
                      {hasVoted && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="font-heading text-xs font-bold text-text-custom">{opt.text}</span>
                  </div>

                  <span className="relative z-10 font-sans text-xs font-bold text-primary-custom">
                    {percentage}% <span className="text-[10px] text-muted-custom font-normal">({opt.votes} votes)</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Render Ambient Sound Track Player */}
        {post.type === "MUSIC" && post.musicTrack && (
          <div className="flex items-center gap-4.5 rounded-2xl border border-border-custom bg-gradient-to-r from-primary-custom/10 to-transparent p-4">
            <div className="relative group/album cursor-pointer shrink-0" onClick={() => setIsPlaying(!isPlaying)}>
              <img 
                src={post.musicTrack.albumArt} 
                alt="Album art" 
                className="h-14 w-14 rounded-xl object-cover border border-border-custom shadow-sm"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/45 rounded-xl opacity-0 group-hover/album:opacity-100 transition-opacity">
                {isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <span className="font-heading text-xs font-extrabold text-text-custom block truncate">{post.musicTrack.title}</span>
              <span className="font-sans text-[10px] text-muted-custom block font-semibold mt-0.5">{post.musicTrack.artist}</span>
              
              {/* Animated Wave Form Visualizer */}
              <div className="mt-3 flex items-end gap-[2px] h-6 overflow-hidden">
                {post.musicTrack.waveData?.map((h, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: isPlaying ? `${Math.max(15, h * (0.4 + Math.random() * 0.6))}%` : "15%" }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className={`w-[3px] rounded-full ${isPlaying ? "bg-primary-custom" : "bg-black/10 dark:bg-white/10"}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col items-end justify-between h-14 shrink-0">
              <span className="font-mono text-[10px] text-muted-custom font-bold">{post.musicTrack.duration}</span>
              <Volume2 className={`h-4.5 w-4.5 ${isPlaying ? "text-primary-custom animate-pulse" : "text-muted-custom/40"}`} />
            </div>
          </div>
        )}

        {/* Render Voice Core Audio player */}
        {post.type === "VOICE" && post.voiceMemo && (
          <div className="flex items-center gap-4 rounded-2xl border border-border-custom bg-gradient-to-r from-accent-orange/10 to-transparent p-4">
            <button 
              onClick={() => setVoicePlaying(!voicePlaying)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-orange/10 hover:bg-accent-orange/20 text-accent-orange transition-all cursor-pointer"
            >
              {voicePlaying ? <Pause className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>

            <div className="flex-1 overflow-hidden">
              <span className="font-heading text-[9px] font-bold text-accent-orange uppercase tracking-wider block mb-1">Voice Memo Broadcast</span>
              
              {/* Dynamic Voice Graph */}
              <div className="flex items-center gap-[3px] h-6">
                {post.voiceMemo.waveData.map((val, idx) => (
                  <motion.div 
                    key={idx}
                    animate={{ height: voicePlaying ? `${val}%` : "20%" }}
                    transition={{ type: "spring", stiffness: 150, damping: 15 }}
                    className={`w-[2.5px] rounded-full flex-1 ${voicePlaying ? "bg-accent-orange" : "bg-black/10 dark:bg-white/15"}`}
                  />
                ))}
              </div>
            </div>

            <span className="font-mono text-[10px] text-accent-orange font-bold shrink-0">{post.voiceMemo.duration}</span>
          </div>
        )}
      </div>

      {/* Post Action Buttons (Like, Comment, Share, Bookmark) */}
      <div className="flex items-center justify-between border-t border-border-custom pt-3 text-muted-custom">
        <div className="flex items-center gap-5">
          {/* Like Interaction */}
          <button 
            onClick={() => onLike(post.id)}
            className="flex items-center gap-1.5 hover:text-red-500 transition-all group/btn cursor-pointer"
          >
            <Heart className={`h-5 w-5 transition-transform group-hover/btn:scale-110 ${post.hasLiked ? "text-red-500 fill-red-500" : ""}`} />
            <span className="font-sans text-xs font-bold">{post.likes}</span>
          </button>

          {/* Comment Dropdown trigger */}
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 hover:text-primary-custom transition-all group/btn cursor-pointer"
          >
            <MessageSquare className="h-5 w-5 transition-transform group-hover/btn:scale-110" />
            <span className="font-sans text-xs font-bold">{post.commentsCount}</span>
          </button>

          {/* Share Action */}
          <button 
            onClick={() => onShare(post.id)}
            className="flex items-center gap-1.5 hover:text-accent-blue transition-all group/btn cursor-pointer"
          >
            <Share2 className="h-5 w-5 transition-transform group-hover/btn:scale-110" />
            <span className="font-sans text-xs font-bold">{post.shares}</span>
          </button>
        </div>

        {/* Bookmark Interaction */}
        <button 
          onClick={() => onBookmark(post.id)}
          className="hover:text-primary-custom transition-all group/btn cursor-pointer"
        >
          <Bookmark className={`h-5 w-5 transition-transform group-hover/btn:scale-110 ${post.hasBookmarked ? "text-primary-custom fill-primary-custom" : ""}`} />
        </button>
      </div>

      {/* Expandable Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border-custom pt-4 mt-1"
          >
            {/* List Comments */}
            <div className="flex flex-col gap-3.5 mb-4 max-h-[220px] overflow-y-auto pr-1">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comm) => (
                  <div key={comm.id} className="flex gap-2.5 items-start">
                    <img src={comm.author.avatar} alt="" className="h-8.5 w-8.5 rounded-full object-cover border border-border-custom" />
                    <div className="flex-1 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-border-custom p-3">
                      <div className="flex items-center justify-between mb-1 gap-1">
                        <span className="font-heading text-[10px] font-bold text-text-custom">@{comm.author.handle}</span>
                        <span className="font-sans text-[9px] text-muted-custom">{comm.timestamp}</span>
                      </div>
                      <p className="font-sans text-xs text-text-custom/95 leading-relaxed font-medium">{comm.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center">
                  <span className="font-sans text-[11px] font-semibold text-muted-custom">No replies yet. Start the conversation!</span>
                </div>
              )}
            </div>

            {/* Post comment input */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a sweet reply..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 rounded-xl border border-border-custom bg-black/[0.01] dark:bg-white/[0.01] px-4 py-2.5 text-xs text-text-custom placeholder-muted-custom outline-none focus:border-primary-custom transition-all"
              />
              <button
                type="submit"
                className="rounded-xl bg-primary-custom hover:opacity-95 text-xs font-bold text-white px-5 py-2.5 transition-all shadow-sm cursor-pointer"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassContainer>
  );
}
