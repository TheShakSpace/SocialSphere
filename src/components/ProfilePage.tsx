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

    addToast("Profile details updated successfully!", "success");
    setShowEditModal(false);
  };

  const myPosts = posts.filter((p) => p.author.handle === profile.handle);
  const bookmarkedPosts = posts.filter((p) => p.hasBookmarked);

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Covered Profile Banner Card */}
      <div className="relative overflow-hidden rounded-[24px] border border-border-custom bg-card shadow-main transition-colors duration-300">
        {/* Cover Image banner */}
        <div className="h-44 w-full relative overflow-hidden">
          <img 
            src={profile.coverImage} 
            alt="Profile cover banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Profile Stats details area */}
        <div className="px-6 pb-6 relative">
          {/* Large Floating Circular Avatar with level bar */}
          <div className="absolute -top-12 left-6">
            <div className="relative">
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="h-24 w-24 rounded-full object-cover border-4 border-card shadow-2xl"
              />
              <div className="absolute -bottom-1 -right-1 flex h-6.5 w-6.5 items-center justify-center rounded-full bg-gradient-to-tr from-[#7B61FF] to-[#A855F7] font-space text-[10px] font-bold text-white shadow-lg border-2 border-card">
                {profile.level}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-end pt-4 mb-5">
            <button
              onClick={() => {
                setEditName(profile.name);
                setEditBio(profile.bio);
                setEditLocation(profile.location);
                setEditWebsite(profile.website);
                setEditSkills(profile.skills.join(", "));
                setShowEditModal(true);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-border-custom bg-black/5 dark:bg-white/5 px-4.5 py-2 text-xs font-heading font-bold text-text-custom hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer shadow-sm"
            >
              <Settings className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Name & Handle */}
          <div className="mt-2.5">
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl font-bold text-text-custom">{profile.name}</h1>
              <Sparkles className="h-4.5 w-4.5 text-[#34D399]" />
            </div>
            <span className="font-sans text-xs text-muted-custom font-semibold">@{profile.handle}</span>
          </div>

          {/* Bio text */}
          <p className="mt-3.5 font-sans text-xs leading-relaxed text-text-custom/80 max-w-2xl font-medium">
            {profile.bio}
          </p>

          {/* Location & Links */}
          <div className="mt-4 flex flex-wrap gap-4 text-[11px] font-sans font-bold text-muted-custom">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-accent-blue" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <LinkIcon className="h-3.5 w-3.5 text-[#34D399]" />
              <a href={profile.website} target="_blank" rel="noreferrer" className="hover:underline hover:text-primary-custom">
                {profile.website}
              </a>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary-custom" />
              <span>Daily Streak: {profile.stats.streakDays} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Profile Stats & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Statistics Block */}
        <div className="relative overflow-hidden rounded-[24px] border border-border-custom bg-card p-5 shadow-main transition-colors duration-300">
          <div className="flex items-center gap-2 mb-4.5 text-[#34D399]">
            <Layers className="h-4.5 w-4.5" />
            <span className="font-heading text-[10px] font-bold uppercase tracking-wider">Metrics Overview</span>
          </div>
          
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-sans text-[10px] text-muted-custom font-bold uppercase">Profile Reach</span>
                <span className="font-sans text-[10px] text-[#34D399] font-bold">+{profile.stats.viewsGrowth}%</span>
              </div>
              <span className="font-heading text-base font-extrabold text-text-custom">{(profile.stats.views / 1000).toFixed(1)}K views</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-sans text-[10px] text-muted-custom font-bold uppercase">Engagement rate</span>
                <span className="font-sans text-[10px] text-[#34D399] font-bold">+{profile.stats.engagementGrowth}%</span>
              </div>
              <span className="font-heading text-base font-extrabold text-text-custom">{profile.stats.engagement}%</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-sans text-[10px] text-muted-custom font-bold uppercase">Next Tier Level Progress</span>
                <span className="font-sans text-[10px] text-primary-custom font-bold">{profile.stats.nextLevelProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden border border-border-custom">
                <div 
                  className="h-full bg-gradient-to-r from-primary-custom to-secondary-custom rounded-full" 
                  style={{ width: `${profile.stats.nextLevelProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skill Array and Interests */}
        <div className="relative overflow-hidden rounded-[24px] border border-border-custom bg-card p-5 shadow-main transition-colors duration-300 col-span-2 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3.5 text-accent-blue">
              <Briefcase className="h-4.5 w-4.5" />
              <span className="font-heading text-[10px] font-bold uppercase tracking-wider">My Skills & Expertises</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              {profile.skills.map((skill) => (
                <span 
                  key={skill}
                  className="rounded-full bg-primary-custom/10 border border-primary-custom/20 px-3.5 py-1 font-sans text-xs font-bold text-primary-custom"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="block font-heading text-[10px] font-bold text-muted-custom uppercase tracking-wider mb-2.5">Saved Category Focuses</span>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span 
                  key={interest}
                  className="rounded-full bg-black/5 dark:bg-white/5 border border-border-custom px-3 py-1 font-sans text-[11px] font-semibold text-text-custom"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real Badges & Achievements unlocked */}
      <div className="relative overflow-hidden rounded-[24px] border border-border-custom bg-card p-5 shadow-main transition-colors duration-300">
        <div className="flex items-center gap-2 mb-4.5 text-[#7B61FF]">
          <Award className="h-4.5 w-4.5" />
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider">Earned Credentials & Milestones</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {profile.badges.map((b) => (
            <div 
              key={b.id}
              className="relative overflow-hidden rounded-2xl border p-4 flex items-start gap-3.5 bg-black/[0.01] dark:bg-white/[0.01] border-border-custom transition-all hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
            >
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: `radial-gradient(100px circle at top left, ${b.color}10, transparent)` }} />
              
              <div 
                className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm shrink-0"
                style={{ backgroundColor: `${b.color}15`, color: b.color }}
              >
                <Award className="h-5.5 w-5.5" />
              </div>

              <div>
                <span className="font-heading text-xs font-bold text-text-custom block leading-tight">{b.name}</span>
                <p className="text-[10px] text-muted-custom leading-relaxed mt-1 font-medium">{b.description}</p>
                <span className="font-sans text-[9px] text-muted-custom/60 font-semibold block mt-2.5">Unlocked {b.unlockedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Menu Navigation for Posts/Saved/Media */}
      <div className="flex flex-col gap-5">
        <div className="flex border-b border-border-custom gap-2">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-heading font-bold transition-all cursor-pointer ${
              activeTab === "posts" 
                ? "border-primary-custom text-primary-custom font-extrabold" 
                : "border-transparent text-muted-custom hover:text-text-custom"
            }`}
          >
            <Grid className="h-4 w-4" />
            <span>My Posts ({myPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-heading font-bold transition-all cursor-pointer ${
              activeTab === "saved" 
                ? "border-primary-custom text-primary-custom font-extrabold" 
                : "border-transparent text-muted-custom hover:text-text-custom"
            }`}
          >
            <Bookmark className="h-4 w-4" />
            <span>Bookmarks ({bookmarkedPosts.length})</span>
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
              <div className="rounded-[24px] border border-border-custom bg-card p-12 text-center shadow-sm">
                <p className="font-sans text-xs text-muted-custom font-semibold">You haven't posted anything yet. Share something on the home feed!</p>
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
              <div className="rounded-[24px] border border-border-custom bg-card p-12 text-center shadow-sm">
                <p className="font-sans text-xs text-muted-custom font-semibold">No bookmarks. Save interesting posts in the feed!</p>
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
              className="fixed inset-0 bg-black/50 backdrop-blur-md"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[24px] border border-border-custom bg-card shadow-hover p-6 backdrop-blur-xl transition-all"
            >
              <div className="flex items-center justify-between border-b border-border-custom pb-4 mb-5">
                <h3 className="font-heading text-sm font-bold text-text-custom flex items-center gap-2">
                  <Settings className="h-4 w-4 text-primary-custom" />
                  <span>Update Profile Information</span>
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="rounded-full bg-black/5 dark:bg-white/10 p-1.5 hover:bg-black/10 dark:hover:bg-white/20 text-text-custom transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                <div>
                  <label className="block font-sans text-[10px] text-muted-custom font-bold uppercase tracking-wider mb-1.5">Profile Display Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-xl border border-border-custom bg-black/[0.01] dark:bg-white/[0.01] px-4 py-2.5 text-xs text-text-custom placeholder-muted-custom outline-none focus:border-primary-custom transition-all"
                  />
                </div>

                <div>
                  <label className="block font-sans text-[10px] text-muted-custom font-bold uppercase tracking-wider mb-1.5">Short Bio</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full h-20 rounded-xl border border-border-custom bg-black/[0.01] dark:bg-white/[0.01] px-4 py-2.5 text-xs text-text-custom placeholder-muted-custom outline-none focus:border-primary-custom resize-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[10px] text-muted-custom font-bold uppercase tracking-wider mb-1.5">Location</label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="w-full rounded-xl border border-border-custom bg-black/[0.01] dark:bg-white/[0.01] px-4 py-2.5 text-xs text-text-custom placeholder-muted-custom outline-none focus:border-primary-custom transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-[10px] text-muted-custom font-bold uppercase tracking-wider mb-1.5">Website Link</label>
                    <input
                      type="text"
                      value={editWebsite}
                      onChange={(e) => setEditWebsite(e.target.value)}
                      className="w-full rounded-xl border border-border-custom bg-black/[0.01] dark:bg-white/[0.01] px-4 py-2.5 text-xs text-text-custom placeholder-muted-custom outline-none focus:border-primary-custom transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-[10px] text-muted-custom font-bold uppercase tracking-wider mb-1.5">Skills (separated by commas)</label>
                  <input
                    type="text"
                    value={editSkills}
                    onChange={(e) => setEditSkills(e.target.value)}
                    className="w-full rounded-xl border border-border-custom bg-black/[0.01] dark:bg-white/[0.01] px-4 py-2.5 text-xs text-text-custom placeholder-muted-custom outline-none focus:border-primary-custom transition-all"
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-border-custom pt-4.5 mt-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 px-4.5 py-2.5 text-xs font-semibold text-text-custom transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-primary-custom to-secondary-custom hover:opacity-95 text-white font-heading font-semibold text-xs px-5.5 py-2.5 transition-all shadow-md cursor-pointer"
                  >
                    Save Changes
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
