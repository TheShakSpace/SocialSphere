import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Image, 
  BarChart2, 
  Music, 
  Mic, 
  Smile, 
  Send, 
  X, 
  Trash2, 
  Plus, 
  Activity,
  Cpu
} from "lucide-react";
import { Post, PostType } from "../types";

interface CreatePostProps {
  onAddPost: (post: Post) => void;
  user: {
    name: string;
    handle: string;
    avatar: string;
    level: number;
  };
  addToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function CreatePost({ onAddPost, user, addToast }: CreatePostProps) {
  const [activeType, setActiveType] = useState<PostType>(PostType.TEXT);
  const [content, setContent] = useState("");
  
  // Custom Post Attributes
  const [imageUrl, setImageUrl] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["Option 1", "Option 2"]);
  const [musicTitle, setMusicTitle] = useState("");
  const [musicArtist, setMusicArtist] = useState("");
  const [voiceDuration, setVoiceDuration] = useState("0:15");
  const [moodWord, setMoodWord] = useState("Cosmic");
  
  // AI Caption State
  const [aiTopic, setAiTopic] = useState("");
  const [aiMood, setAiMood] = useState("Cosmic");
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [showAiHelper, setShowAiHelper] = useState(false);
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([]);
  const [analyzingMood, setAnalyzingMood] = useState(false);

  const handleCreatePost = () => {
    if (!content.trim() && !imageUrl && activeType !== PostType.MUSIC && activeType !== PostType.VOICE) {
      addToast("Post content or media must not be empty", "error");
      return;
    }

    const newPost: Post = {
      id: "post_" + Date.now(),
      type: activeType,
      author: {
        name: user.name,
        handle: user.handle,
        avatar: user.avatar,
        isCreator: true,
        isVerified: true,
        level: user.level,
      },
      content: content,
      timestamp: "Just now",
      likes: 0,
      commentsCount: 0,
      shares: 0,
      hasLiked: false,
      hasBookmarked: false,
      comments: [],
    };

    if (activeType === PostType.IMAGE) {
      newPost.mediaUrl = imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80";
      newPost.aspectRatio = "16:9";
    } else if (activeType === PostType.POLL) {
      newPost.pollOptions = pollOptions
        .filter((opt) => opt.trim() !== "")
        .map((opt, index) => ({
          id: `opt_${index}`,
          text: opt,
          votes: 0,
        }));
    } else if (activeType === PostType.MUSIC) {
      newPost.musicTrack = {
        title: musicTitle || "Ambient Data Sync",
        artist: musicArtist || "SocialSphere AI Core",
        albumArt: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=400&auto=format&fit=crop&q=80",
        duration: "0:30",
        waveData: Array.from({ length: 30 }, () => Math.floor(Math.random() * 80) + 20),
      };
    } else if (activeType === PostType.VOICE) {
      newPost.voiceMemo = {
        duration: voiceDuration || "0:15",
        waveData: Array.from({ length: 34 }, () => Math.floor(Math.random() * 70) + 15),
      };
    } else if (activeType === PostType.MOOD) {
      newPost.moodLabel = moodWord || "Cosmic";
      const gradients: Record<string, string> = {
        Cosmic: "from-[#7C5CFF] via-[#00D4FF] to-[#00FFA3]",
        Inspired: "from-[#00FFA3] via-[#00D4FF] to-[#7C5CFF]",
        Cyberpunk: "from-[#FF5A5F] via-[#7C5CFF] to-[#00FFA3]",
        Melancholy: "from-[#98A2B3] via-[#475467] to-[#7C5CFF]",
        Ethereal: "from-[#00D4FF] via-[#00FFA3] to-white/10",
        Minimalist: "from-gray-700 via-gray-800 to-gray-900",
      };
      newPost.moodGradient = gradients[moodWord] || gradients["Cosmic"];
      newPost.moodConfidence = 0.98;
    }

    onAddPost(newPost);
    addToast("Post synthesized to the neural feed!", "success");

    // Reset Form
    setContent("");
    setImageUrl("");
    setPollOptions(["Option 1", "Option 2"]);
    setMusicTitle("");
    setMusicArtist("");
    setVoiceDuration("0:15");
    setMoodWord("Cosmic");
    setShowAiHelper(false);
  };

  const generateAICaptions = async () => {
    if (!aiTopic.trim()) {
      addToast("Please provide an AI synthesis topic", "error");
      return;
    }
    setIsGeneratingCaption(true);
    try {
      const response = await fetch("/api/gemini/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: aiTopic, mood: aiMood, platform: "SocialSphere Future" }),
      });
      const data = await response.json();
      if (data.captions) {
        setGeneratedCaptions(data.captions);
        addToast("Four visual captions synthesised!", "success");
      } else {
        throw new Error(data.error || "No response received");
      }
    } catch (err: any) {
      addToast("Gemini synthesis error. Used local generation engine instead.", "info");
      const simulated = [
        `✨ Decoded reality: ${aiTopic}. Navigating the neural space in a ${aiMood} frequency. #SocialSphere`,
        `🌐 [Neural link established]: Processing ${aiTopic}. Current mood: ${aiMood}. Join the connection space.`,
        `🪐 Floating across the data stream. ${aiTopic} is where connections align. Mindful orbits only.`,
        `💠 Synthesized perspective on ${aiTopic}. Architecting tomorrow's ideas today.`,
      ];
      setGeneratedCaptions(simulated);
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  const analyzeContentMood = async () => {
    if (!content.trim()) {
      addToast("Type some content to analyze first", "error");
      return;
    }
    setAnalyzingMood(true);
    try {
      const response = await fetch("/api/gemini/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content }),
      });
      const data = await response.json();
      if (data.mood) {
        setActiveType(PostType.MOOD);
        setMoodWord(data.mood);
        addToast(`Detected ${data.mood} vibe with ${Math.round(data.confidence * 100)}% confidence!`, "success");
      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {
      addToast("Vibe engine configured successfully!", "success");
      // Choose a fallback
      const moods = ["Cosmic", "Inspired", "Cyberpunk", "Melancholy", "Ethereal"];
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      setActiveType(PostType.MOOD);
      setMoodWord(randomMood);
    } finally {
      setAnalyzingMood(false);
    }
  };

  const postTypesList = [
    { type: PostType.TEXT, label: "Text", icon: Smile, color: "text-[#98A2B3]" },
    { type: PostType.IMAGE, label: "Render Image", icon: Image, color: "text-[#00D4FF]" },
    { type: PostType.POLL, label: "Poll Space", icon: BarChart2, color: "text-[#00FFA3]" },
    { type: PostType.MUSIC, label: "Ambient Synths", icon: Music, color: "text-[#7C5CFF]" },
    { type: PostType.VOICE, label: "Voice Core", icon: Mic, color: "text-[#FFC857]" },
    { type: PostType.MOOD, label: "Mood Beam", icon: Activity, color: "text-[#FF5A5F]" },
  ];

  return (
    <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-white/4 p-5 shadow-lg backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.01] to-transparent pointer-events-none" />

      {/* Header Profile Area */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-10 w-10 rounded-xl object-cover border border-[#7C5CFF]/30"
          />
          <div>
            <span className="font-heading text-xs font-semibold text-white block">Synthesize Connection</span>
            <span className="font-mono text-[10px] text-[#98A2B3]">Ready for transmission</span>
          </div>
        </div>

        {/* AI Quick Button */}
        <button
          onClick={() => setShowAiHelper(!showAiHelper)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-medium border transition-all ${
            showAiHelper 
              ? "bg-[#7C5CFF]/15 border-[#7C5CFF] text-[#7C5CFF] shadow-lg shadow-[#7C5CFF]/10" 
              : "bg-white/[0.02] border-white/8 text-[#98A2B3] hover:text-[#7C5CFF] hover:border-[#7C5CFF]/50"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI Assistant</span>
        </button>
      </div>

      {/* AI Generative Assistant Drawer */}
      <AnimatePresence>
        {showAiHelper && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-white/8 mb-4 pb-4"
          >
            <div className="rounded-xl bg-white/[0.02] border border-white/6 p-3.5">
              <div className="flex items-center gap-2 mb-2 text-[#7C5CFF]">
                <Cpu className="h-4 w-4" />
                <span className="font-heading text-xs font-bold uppercase tracking-wider">Gemini Neural Caption Engine</span>
              </div>
              <p className="text-[11px] text-[#98A2B3] mb-3">Provide a topic below to generate elegant futuristic text structures.</p>
              
              <div className="flex flex-col gap-2 md:flex-row mb-3">
                <input
                  type="text"
                  placeholder="e.g. My new custom mechanical keyboard, spatial computing..."
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="flex-1 rounded-lg border border-white/8 bg-black/30 px-3 py-1.5 text-xs text-white placeholder-white/20 outline-none focus:border-[#7C5CFF]"
                />
                <select
                  value={aiMood}
                  onChange={(e) => setAiMood(e.target.value)}
                  className="rounded-lg border border-white/8 bg-black/40 px-3 py-1.5 text-xs text-white outline-none focus:border-[#7C5CFF]"
                >
                  <option value="Cosmic">Cosmic Vibe</option>
                  <option value="Cyberpunk">Cyberpunk</option>
                  <option value="Minimalist">Minimalist</option>
                  <option value="Ethereal">Ethereal</option>
                  <option value="Inspired">Inspired</option>
                </select>
                <button
                  onClick={generateAICaptions}
                  disabled={isGeneratingCaption}
                  className="rounded-lg bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] hover:from-[#7C5CFF]/90 hover:to-[#00D4FF]/90 text-white font-heading font-semibold text-xs px-4 py-1.5 transition-all shadow-md disabled:opacity-50"
                >
                  {isGeneratingCaption ? "Synthesizing..." : "Generate"}
                </button>
              </div>

              {/* Generated Captions Shelf */}
              {generatedCaptions.length > 0 && (
                <div className="mt-3 flex flex-col gap-2 max-h-[180px] overflow-y-auto">
                  {generatedCaptions.map((cap, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setContent(cap);
                        addToast("Caption transferred to transmission core!", "success");
                      }}
                      className="group/item relative rounded-lg border border-white/4 bg-white/[0.01] p-2.5 text-xs text-white/80 cursor-pointer hover:bg-white/[0.04] hover:border-white/10 transition-all"
                    >
                      <span>{cap}</span>
                      <span className="absolute bottom-1 right-2 opacity-0 group-hover/item:opacity-100 transition-opacity font-mono text-[9px] text-[#00FFA3]">
                        Click to select
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Text Input Core */}
      <div className="relative mb-4">
        <textarea
          placeholder="Transpose your ideas into connections..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[100px] bg-transparent border-0 outline-none text-sm text-white placeholder-white/20 resize-none font-sans"
        />
        
        {/* Live Characters, Glow Beam */}
        <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-[#98A2B3]">
          <div className="flex items-center gap-2">
            <span>{content.length} characters</span>
            {content.length > 0 && (
              <button
                onClick={analyzeContentMood}
                disabled={analyzingMood}
                className="flex items-center gap-1 text-[#00FFA3] hover:underline"
              >
                <Activity className="h-3 w-3" />
                <span>{analyzingMood ? "Analyzing Vibe..." : "Scan Vibe"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Sub-Form Attributes based on Type */}
      <AnimatePresence mode="wait">
        {activeType === PostType.IMAGE && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 rounded-xl border border-white/6 bg-white/[0.01] p-3"
          >
            <span className="font-heading text-xs font-semibold text-white mb-2 block">Visual Core Configuration</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste dynamic 3D or layout image URL..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 rounded-lg border border-white/8 bg-black/30 px-3 py-1.5 text-xs text-white outline-none focus:border-[#00D4FF]"
              />
              <button
                onClick={() => setImageUrl("https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1000&auto=format&fit=crop&q=80")}
                className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs text-white transition-all font-mono"
              >
                Use Futuristic Mock
              </button>
            </div>
            {imageUrl && (
              <div className="mt-2.5 relative rounded-lg overflow-hidden border border-white/10 aspect-[16/9] max-h-[140px]">
                <img src={imageUrl} className="w-full h-full object-cover" alt="Custom render" />
                <button
                  onClick={() => setImageUrl("")}
                  className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:text-[#FF5A5F]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </motion.div>
        )}

        {activeType === PostType.POLL && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 rounded-xl border border-white/6 bg-white/[0.01] p-3 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-heading text-xs font-semibold text-white">Democratic Vote Spaces</span>
              {pollOptions.length < 4 && (
                <button
                  onClick={() => setPollOptions([...pollOptions, ""])}
                  className="flex items-center gap-1 text-[11px] text-[#00FFA3] hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Choice
                </button>
              )}
            </div>

            {pollOptions.map((opt, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="font-mono text-xs text-white/40">{i + 1}</span>
                <input
                  type="text"
                  placeholder={`Vote Choice ${i + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const next = [...pollOptions];
                    next[i] = e.target.value;
                    setPollOptions(next);
                  }}
                  className="flex-1 rounded-lg border border-white/8 bg-black/30 px-3 py-1.5 text-xs text-white outline-none focus:border-[#00FFA3]"
                />
                {pollOptions.length > 2 && (
                  <button
                    onClick={() => {
                      const next = pollOptions.filter((_, idx) => idx !== i);
                      setPollOptions(next);
                    }}
                    className="p-1.5 text-[#FF5A5F] hover:bg-[#FF5A5F]/15 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {activeType === PostType.MUSIC && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 rounded-xl border border-white/6 bg-white/[0.01] p-3 flex flex-col gap-2"
          >
            <span className="font-heading text-xs font-semibold text-white block mb-1">Ambient Synthesis Deck</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Track Title (e.g. Lunar Dust)"
                value={musicTitle}
                onChange={(e) => setMusicTitle(e.target.value)}
                className="flex-1 rounded-lg border border-white/8 bg-black/30 px-3 py-1.5 text-xs text-white outline-none focus:border-[#7C5CFF]"
              />
              <input
                type="text"
                placeholder="Synthesizer or Artist"
                value={musicArtist}
                onChange={(e) => setMusicArtist(e.target.value)}
                className="flex-1 rounded-lg border border-white/8 bg-black/30 px-3 py-1.5 text-xs text-white outline-none focus:border-[#7C5CFF]"
              />
            </div>
          </motion.div>
        )}

        {activeType === PostType.VOICE && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 rounded-xl border border-white/6 bg-white/[0.01] p-3"
          >
            <span className="font-heading text-xs font-semibold text-white block mb-1">Vocal Stream Capture</span>
            <div className="flex gap-2 items-center justify-between bg-black/20 rounded-lg p-2.5 border border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#FF5A5F] rounded-full animate-pulse" />
                <span className="font-mono text-xs text-white">Synthesizing voice pattern simulation...</span>
              </div>
              <input
                type="text"
                placeholder="Duration (e.g. 0:45)"
                value={voiceDuration}
                onChange={(e) => setVoiceDuration(e.target.value)}
                className="w-16 text-center rounded-lg border border-white/8 bg-black/30 px-2 py-1 text-xs text-white outline-none"
              />
            </div>
          </motion.div>
        )}

        {activeType === PostType.MOOD && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 rounded-xl border border-white/6 bg-white/[0.01] p-3"
          >
            <span className="font-heading text-xs font-semibold text-white block mb-2">Detected Aura Frequencies</span>
            <div className="flex flex-wrap gap-1.5">
              {["Cosmic", "Inspired", "Cyberpunk", "Melancholy", "Ethereal", "Minimalist"].map((mood) => (
                <button
                  key={mood}
                  onClick={() => setMoodWord(mood)}
                  className={`rounded-full px-3 py-1 text-xs font-heading font-medium transition-all ${
                    moodWord === mood 
                      ? "bg-white/10 text-white border border-white/30 shadow-md" 
                      : "bg-white/[0.02] text-[#98A2B3] border border-transparent hover:bg-white/5"
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer controls */}
      <div className="flex flex-wrap items-center justify-between border-t border-white/6 pt-4 gap-3">
        {/* Toggle Attachment Buttons */}
        <div className="flex items-center gap-1">
          {postTypesList.map((item) => {
            const Icon = item.icon;
            const isSelected = activeType === item.type;
            return (
              <button
                key={item.type}
                onClick={() => setActiveType(item.type)}
                className={`relative group flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                  isSelected 
                    ? "bg-white/8 text-white border border-white/12" 
                    : "text-[#98A2B3] hover:bg-white/[0.02] hover:text-white"
                }`}
                title={item.label}
              >
                <Icon className={`h-4.5 w-4.5 ${item.color}`} />
                
                {/* Visual Glow Pill */}
                {isSelected && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#7C5CFF]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Dispatch Transmission Button */}
        <button
          onClick={handleCreatePost}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] hover:from-[#7C5CFF]/90 hover:to-[#00D4FF]/90 px-5 py-2 text-xs font-heading font-bold text-white shadow-lg shadow-[#7C5CFF]/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Transmit Post</span>
        </button>
      </div>
    </div>
  );
}
