import React from "react";
import { Bookmark, Sparkles, Inbox } from "lucide-react";
import { Post } from "../types";
import PostCard from "./PostCard";

interface BookmarksPageProps {
  posts: Post[];
  onLike: (id: string) => void;
  onVote: (postId: string, optionId: string) => void;
  onBookmark: (id: string) => void;
  onShare: (id: string) => void;
  onAddComment: (postId: string, text: string) => void;
}

export default function BookmarksPage({
  posts,
  onLike,
  onVote,
  onBookmark,
  onShare,
  onAddComment,
}: BookmarksPageProps) {
  const savedPosts = posts.filter((p) => p.hasBookmarked);

  return (
    <div className="flex flex-col gap-6 select-none text-left">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-[24px] border border-gray-100 bg-white p-6 shadow-md dark:bg-gray-900/40 dark:border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#7B61FF]/5 via-transparent to-transparent pointer-events-none" />
        <div className="flex items-center gap-2 text-[#7B61FF] mb-2.5">
          <Bookmark className="h-5 w-5 fill-current text-[#7B61FF]" />
          <span className="font-heading text-[10px] font-bold uppercase tracking-widest">SAVED SHELF</span>
        </div>
        <h2 className="font-heading text-xl font-bold text-gray-900 dark:text-white mb-1.5">Your Bookmarked Content</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
          A personal, offline-first vault for storing inspirational posts, audio memo broadcasts, and interactive vibe cards from creators inside the sphere.
        </p>
      </div>

      {/* Bookmarked Items List */}
      <div className="flex flex-col gap-5">
        {savedPosts.length === 0 ? (
          <div className="rounded-[24px] border border-gray-100 bg-white p-12 text-center shadow-md dark:bg-gray-900/20 dark:border-gray-800 flex flex-col items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center dark:bg-gray-800">
              <Bookmark className="h-6 w-6 text-gray-300" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-heading text-xs font-bold text-gray-800 dark:text-gray-200">No Bookmarks Saved</span>
              <span className="font-sans text-[11px] text-gray-400 font-medium">
                Click the bookmark badge on any card inside the Home feed or Explore grid to populate your shelf.
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {savedPosts.map((post) => (
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
