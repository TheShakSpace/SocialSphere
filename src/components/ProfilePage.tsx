import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  Award, 
  Layers, 
  Settings, 
  Sparkles, 
  Grid, 
  Bookmark, 
  Briefcase,
  X,
  Plus
} from "lucide-react";
import { UserProfile, Post } from "../types";
import PostCard from "./PostCard";

interface ProfilePageProps {
  profile: UserProfile;
  posts: Post[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onLike: (id: string) => void;
  onVote: (postId: string, optionId: string) => void;
  onBookmark: (id: string) => void;
  onShare: (id: string) => void;
  onAddComment: (postId: string, text: string) => void;
  addToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function ProfilePage({
  profile,
  posts,
  onUpdateProfile,
  onLike,
  onVote,
  onBookmark,
  onShare,
  onAddComment,
  addToast,
}: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "media">("posts");
  const [showEditModal, setShowEditModal] = useState(false);

  // Form states for profile edit
  const [editName, setEditName] = useState(profile.name);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editLocation, setEditLocation] = useState(profile.location);
  const [editWebsite, setEditWebsite] = useState(profile.website);
  const [editSkills, setEditSkills] = useState(profile.skills.join(", "));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = editSkills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    onUpdateProfile({
      name: editName,
      bio: editBio,
      location: editLocation,
      website: editWebsite,
      skills: skillsArray,
    });

    addToast("Creator profile configuration re-aligned!", "success");
    setShowEditModal(false);
  };

  const myPosts = posts.filter((p) => p.author.handle === profile.handle);
  const bookmarkedPosts = posts.filter((p) => p.hasBookmarked);
  const mediaPosts = posts.filter((p) => p.author.handle === profile.handle && p.type === "IMAGE");

  return (
    <div className="flex flex-col gap-6">
      {/* Covered Profile Banner Card */}
      <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-white/4 shadow-xl">
        {/* Cover Image banner */}
        <div className="h-44 w-full relative overflow-hidden">
          <img 
            src={profile.coverImage} 
            alt="Spatial cover banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-transparent" />
        </div>

        {/* Profile Stats details area */}
        <div className="px-6 pb-6 relative">
          {/* Large Floating Avatar with level bar */}
          <div className="absolute -top-12 left-6">
            <div className="relative">
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="h-24 w-24 rounded-[22px] object-cover border-4 border-[#070B14] shadow-2xl"
              />
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-[#7C5CFF] to-[#00D4FF] font-space text-xs font-bold text-white shadow-lg border-2 border-[#070B14]">
                {profile.level}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-end pt-4 mb-6">
            <button
              onClick={() => {
                setEditName(profile.name);
                setEditBio(profile.bio);
                setEditLocation(profile.location);
                setEditWebsite(profile.website);
                setEditSkills(profile.skills.join(", "));
                setShowEditModal(true);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/4 px-4 py-2 text-xs font-heading font-medium text-white hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <Settings className="h-4 w-4" />
              <span>Modify Core</span>
            </button>
          </div>

          {/* Name & Handle */}
          <div className="mt-2.5">
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl font-bold text-white">{profile.name}</h1>
              <Sparkles className="h-4.5 w-4.5 text-[#00FFA3]" />
            </div>
            <span className="font-mono text-xs text-[#98A2B3]">@{profile.handle}</span>
          </div>

          {/* Bio text */}
          <p className="mt-3 font-sans text-xs leading-relaxed text-white/80 max-w-2xl">
            {profile.bio}
          </p>

          {/* Location & Links */}
          <div className="mt-4 flex flex-wrap gap-4 text-[11px] font-mono text-[#98A2B3]">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#00D4FF]" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <LinkIcon className="h-3.5 w-3.5 text-[#00FFA3]" />
              <a href={profile.website} target="_blank" rel="noreferrer" className="hover:underline hover:text-white">
                {profile.website}
              </a>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#7C5CFF]" />
              <span>Active Streak: {profile.stats.streakDays} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Profile Stats & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Statistics Block */}
        <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-white/4 p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4 text-[#00FFA3]">
            <Layers className="h-4.5 w-4.5" />
            <span className="font-space text-xs font-bold uppercase tracking-wider">Metrics Panel</span>
          </div>
          
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-[9px] text-[#98A2B3] uppercase">Neural Reach</span>
                <span className="font-mono text-[10px] text-[#00FFA3]">+{profile.stats.viewsGrowth}%</span>
              </div>
              <span className="font-space text-xl font-bold text-white">{(profile.stats.views / 1000).toFixed(1)}K</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-[9px] text-[#98A2B3] uppercase">Engagement Stream</span>
                <span className="font-mono text-[10px] text-[#00FFA3]">+{profile.stats.engagementGrowth}%</span>
              </div>
              <span className="font-space text-xl font-bold text-white">{profile.stats.engagement}%</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-mono text-[9px] text-[#98A2B3] uppercase">Next Level Progress</span>
                <span className="font-mono text-[9px] text-white/50">{profile.stats.nextLevelProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] rounded-full" 
                  style={{ width: `${profile.stats.nextLevelProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skill Array and Interests */}
        <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-white/4 p-5 shadow-lg backdrop-blur-md col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-[#00D4FF]">
              <Briefcase className="h-4.5 w-4.5" />
              <span className="font-space text-xs font-bold uppercase tracking-wider">Skill Mapping</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {profile.skills.map((skill) => (
                <span 
                  key={skill}
                  className="rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/25 px-3 py-1 font-heading text-[10px] font-semibold text-[#00D4FF]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="block font-space text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Interests Array</span>
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.map((interest) => (
                <span 
                  key={interest}
                  className="rounded-full bg-white/[0.02] border border-white/8 px-2.5 py-0.5 font-sans text-[10px] text-[#98A2B3]"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real Badges & Achievements unlocked */}
      <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-white/4 p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4 text-[#7C5CFF]">
          <Award className="h-4.5 w-4.5" />
          <h3 className="font-space text-xs font-bold uppercase tracking-wider">Achievements & Quantum Badges</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {profile.badges.map((b) => (
            <div 
              key={b.id}
              className="relative overflow-hidden rounded-xl border p-3.5 flex items-start gap-3 bg-white/[0.01] transition-all hover:bg-white/[0.03]"
              style={{ borderColor: `${b.color}25` }}
            >
              {/* Colored ambient glow */}
              <div className="absolute inset-0 pointer-events-none rounded-xl" style={{ background: `radial-gradient(100px circle at top left, ${b.color}08, transparent)` }} />
              
              <div 
                className="flex h-9 w-9 items-center justify-center rounded-lg shadow-md shrink-0"
                style={{ backgroundColor: `${b.color}15`, color: b.color }}
              >
                <Award className="h-5 w-5" />
              </div>

              <div>
                <span className="font-heading text-xs font-bold text-white block">{b.name}</span>
                <p className="text-[10px] text-[#98A2B3] leading-relaxed mt-0.5">{b.description}</p>
                <span className="font-mono text-[8px] text-white/40 block mt-2">Unlocked {b.unlockedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Menu Navigation for Posts/Saved/Media */}
      <div className="flex flex-col gap-4">
        <div className="flex border-b border-white/8">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-heading font-bold transition-all ${
              activeTab === "posts" 
                ? "border-[#7C5CFF] text-white" 
                : "border-transparent text-[#98A2B3] hover:text-white"
            }`}
          >
            <Grid className="h-4 w-4" />
            <span>My Feed ({myPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-heading font-bold transition-all ${
              activeTab === "saved" 
                ? "border-[#00D4FF] text-white" 
                : "border-transparent text-[#98A2B3] hover:text-white"
            }`}
          >
            <Bookmark className="h-4 w-4" />
            <span>Bookmarked ({bookmarkedPosts.length})</span>
          </button>
        </div>

        {/* List filtered results */}
        <div className="flex flex-col gap-4">
          {activeTab === "posts" && (
            myPosts.length > 0 ? (
              myPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={onLike}
                  onVote={onVote}
                  onBookmark={onBookmark}
                  onShare={onShare}
                  onAddComment={onAddComment}
                />
              ))
            ) : (
              <div className="rounded-[22px] border border-white/6 bg-white/[0.01] p-12 text-center">
                <p className="font-sans text-xs text-[#98A2B3]">No connection transits logged. Synthesize a post to get started!</p>
              </div>
            )
          )}

          {activeTab === "saved" && (
            bookmarkedPosts.length > 0 ? (
              bookmarkedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={onLike}
                  onVote={onVote}
                  onBookmark={onBookmark}
                  onShare={onShare}
                  onAddComment={onAddComment}
                />
              ))
            ) : (
              <div className="rounded-[22px] border border-white/6 bg-white/[0.01] p-12 text-center">
                <p className="font-sans text-xs text-[#98A2B3]">No items bookmarked currently.</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Edit Profile Configuration Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="fixed inset-0 bg-[#070B14]/80 backdrop-blur-md"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/12 bg-white/5 shadow-2xl p-6 backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/8 pb-3 mb-4">
                <h3 className="font-heading text-sm font-bold text-white flex items-center gap-1.5">
                  <Settings className="h-4 w-4 text-[#7C5CFF]" />
                  <span>Modify Creator Config</span>
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="rounded-full bg-white/5 p-1 hover:bg-white/10 text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                <div>
                  <label className="block font-space text-[10px] font-bold text-[#98A2B3] uppercase mb-1">Display Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-xl border border-white/8 bg-black/40 px-3.5 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-[#7C5CFF]"
                  />
                </div>

                <div>
                  <label className="block font-space text-[10px] font-bold text-[#98A2B3] uppercase mb-1">Creator Bio</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full h-20 rounded-xl border border-white/8 bg-black/40 px-3.5 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-[#7C5CFF] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-space text-[10px] font-bold text-[#98A2B3] uppercase mb-1">Nexus Location</label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="w-full rounded-xl border border-white/8 bg-black/40 px-3.5 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-[#7C5CFF]"
                    />
                  </div>

                  <div>
                    <label className="block font-space text-[10px] font-bold text-[#98A2B3] uppercase mb-1">Vessel Link</label>
                    <input
                      type="text"
                      value={editWebsite}
                      onChange={(e) => setEditWebsite(e.target.value)}
                      className="w-full rounded-xl border border-white/8 bg-black/40 px-3.5 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-[#7C5CFF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-space text-[10px] font-bold text-[#98A2B3] uppercase mb-1">Skill Array (comma separated)</label>
                  <input
                    type="text"
                    value={editSkills}
                    onChange={(e) => setEditSkills(e.target.value)}
                    className="w-full rounded-xl border border-white/8 bg-black/40 px-3.5 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-[#7C5CFF]"
                  />
                </div>

                <div className="flex justify-end gap-2.5 border-t border-white/6 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="rounded-xl bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-all"
                  >
                    Abort
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] hover:from-[#7C5CFF]/90 hover:to-[#00D4FF]/90 text-white font-heading font-semibold text-xs px-5 py-2 transition-all shadow-md"
                  >
                    Transmit Configuration
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
