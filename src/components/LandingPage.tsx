import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Heart, 
  MessageSquare, 
  UserPlus, 
  Compass, 
  Bell, 
  Check, 
  Smile, 
  Send,
  Smartphone,
  Flame,
  Star
} from "lucide-react";
import { UserProfile } from "../types";

interface LandingPageProps {
  onEnterApp: (customProfile?: Partial<UserProfile>) => void;
  currentProfile: UserProfile;
}

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", // Aria
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", // Zephyr
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80", // Lumina
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", // Nova
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", // Kaelen
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80"  // Caelia
];

export default function LandingPage({ onEnterApp, currentProfile }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(currentProfile.avatar);
  const [bio, setBio] = useState("Exploring the creative boundaries of SocialSphere...");
  const [location, setLocation] = useState("Neo-San Francisco");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEnterApp({
      name: displayName || currentProfile.name,
      handle: username || currentProfile.handle,
      avatar: selectedAvatar,
      bio: bio,
      location: location
    });
  };

  const handleGuestAccess = () => {
    onEnterApp();
  };

  return (
    <div className="relative min-h-[calc(100vh-76px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 select-none overflow-hidden">
      
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <div className="animate-blob-1 absolute top-10 left-10 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#7B61FF]/15 to-[#60A5FA]/10 blur-[100px]" />
        <div className="animate-blob-2 absolute bottom-10 right-10 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#FF6EC7]/12 to-[#FFA94D]/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[25%] w-[300px] h-[300px] rounded-full bg-[#60A5FA]/10 blur-[90px] animate-pulse" />
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* LEFT COLUMN: HERO SPECS & BRIEFING (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col text-left gap-6 lg:pr-4">
          
          {/* Badge indicator */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7B61FF]/10 to-[#FF6EC7]/10 px-4 py-1.5 border border-[#7B61FF]/15 w-fit shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#7B61FF] animate-pulse" />
            <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#7B61FF]">SocialSphere Playground</span>
          </motion.div>

          {/* Main Display Typography */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.1] dark:text-white"
          >
            Where Ideas Become <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7B61FF] via-[#FF6EC7] to-[#FFA94D]">
              Connections.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300 font-medium"
          >
            Welcome to a premium, design-first playground built for visionaries, creators, and developers. No corporate noise, no algorithm fatigue—just pure aesthetic storytelling, micro-interactions, and beautiful spatial cards.
          </motion.p>

          {/* AUTHENTICATION COMPOSER CONTAINER (Pure White Card) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-[28px] border border-gray-200/80 bg-white p-6 shadow-xl dark:bg-gray-900/90 dark:border-gray-800"
          >
            {/* Header Tabs inside Auth Card */}
            <div className="flex border-b border-gray-100 dark:border-gray-800 pb-3 mb-4.5 gap-4">
              <button
                onClick={() => setActiveTab("login")}
                className={`pb-2.5 text-xs font-heading font-bold transition-all border-b-2 cursor-pointer ${
                  activeTab === "login"
                    ? "border-[#7B61FF] text-[#7B61FF] font-extrabold"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Access Account
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`pb-2.5 text-xs font-heading font-bold transition-all border-b-2 cursor-pointer ${
                  activeTab === "register"
                    ? "border-[#7B61FF] text-[#7B61FF] font-extrabold"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Join the Network
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              
              {/* Display Name Input */}
              <div>
                <label className="block font-sans text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-1">
                  {activeTab === "login" ? "Your Display Name" : "Choose Display Name"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={activeTab === "login" ? "Shakshi Kumari" : "e.g., Jane Doe"}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-[#7B61FF] dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500 transition-all"
                />
              </div>

              {/* Username Input */}
              <div>
                <label className="block font-sans text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-1">
                  Handle Name
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-xs text-gray-400 font-bold">@</span>
                  <input
                    type="text"
                    required
                    placeholder={activeTab === "login" ? "shakshikumari" : "username"}
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-8 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-[#7B61FF] dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500 transition-all"
                  />
                </div>
              </div>

              {/* Advanced Register Details */}
              {activeTab === "register" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex flex-col gap-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-sans text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Location</label>
                      <input
                        type="text"
                        placeholder="Neo-San Francisco"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-[#7B61FF] dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Occupation Vibe</label>
                      <input
                        type="text"
                        placeholder="UI Designer"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-[#7B61FF] dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Avatar Selector Presets */}
              <div>
                <label className="block font-sans text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-1.5">
                  Pick Your Visual Vibe
                </label>
                <div className="flex gap-2 items-center overflow-x-auto pb-1.5">
                  {AVATAR_PRESETS.map((avUrl, i) => (
                    <div 
                      key={i}
                      onClick={() => setSelectedAvatar(avUrl)}
                      className={`h-9 w-9 rounded-full p-[2px] cursor-pointer shrink-0 transition-all duration-200 ${
                        selectedAvatar === avUrl 
                          ? "bg-gradient-to-tr from-[#7B61FF] to-[#FF6EC7] scale-110" 
                          : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-800"
                      }`}
                    >
                      <img 
                        src={avUrl} 
                        alt="Preset choice" 
                        className="h-full w-full rounded-full object-cover border border-white dark:border-gray-950" 
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row gap-2.5 mt-2">
                <button
                  type="submit"
                  className="flex-1 group flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#7B61FF] to-[#FF6EC7] py-2.5 text-xs font-heading font-bold text-white shadow-lg shadow-[#7B61FF]/15 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span>{activeTab === "login" ? "Synchronize & Enter" : "Establish Identity"}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  type="button"
                  onClick={handleGuestAccess}
                  className="rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-gray-900 py-2.5 px-4 text-xs font-heading font-bold text-gray-500 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-white transition-all cursor-pointer"
                >
                  Quick Guest Access
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: 3D FLOATING MOBILE SHOWCASE & OVERLAPPING ELEMENTS (7 Cols) */}
        <div className="lg:col-span-7 relative h-[560px] md:h-[620px] flex items-center justify-center">
          
          {/* Overlapping Phone Mockup #1 (Main Focus - Centered) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20, rotateY: -15, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0, rotateY: -10, rotateX: 6 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ transformStyle: "preserve-3d", perspective: 1000 }}
            className="absolute left-[15%] md:left-[25%] z-20 w-[240px] h-[480px] bg-white rounded-[36px] shadow-2xl border-4 border-gray-900 p-2 overflow-hidden flex flex-col justify-between"
          >
            {/* Phone Screen Simulated Content */}
            <div className="flex flex-col h-full bg-[#F6F7FB] rounded-[28px] p-3 overflow-hidden justify-between">
              
              {/* Phone Header Indicator */}
              <div className="flex justify-between items-center text-[8px] font-sans font-extrabold text-gray-400 mb-2">
                <span>9:41</span>
                <div className="w-12 h-3.5 bg-gray-900 rounded-full mx-auto" />
                <div className="flex gap-1">
                  <span>5G</span>
                  <div className="w-3 h-2 bg-gray-400 rounded-sm" />
                </div>
              </div>

              {/* Stories Bar */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 shrink-0">
                <div className="h-9 w-9 rounded-full p-[1.5px] bg-gradient-to-tr from-[#7B61FF] via-[#FF6EC7] to-[#FFA94D] shrink-0">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" className="h-full w-full rounded-full object-cover border border-white" />
                </div>
                <div className="h-9 w-9 rounded-full p-[1.5px] bg-gradient-to-tr from-[#7B61FF] via-[#FF6EC7] to-[#FFA94D] shrink-0">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" className="h-full w-full rounded-full object-cover border border-white" />
                </div>
                <div className="h-9 w-9 rounded-full p-[1.5px] bg-gray-200 shrink-0">
                  <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" className="h-full w-full rounded-full object-cover border border-white" />
                </div>
              </div>

              {/* Mock Feed Post Card */}
              <div className="flex-1 rounded-2xl bg-white p-2.5 border border-gray-100 flex flex-col gap-1.5 overflow-hidden my-2 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80" className="h-6 w-6 rounded-full object-cover" />
                  <div className="flex flex-col">
                    <span className="text-[8px] font-heading font-extrabold text-gray-800">Nova Star</span>
                    <span className="text-[6px] text-gray-400">@novastar</span>
                  </div>
                </div>
                <p className="text-[8px] text-gray-600 leading-snug">
                  Unwinding inside the virtual sunset sandbox. Loving the neon frequencies! 🌅✨
                </p>
                <div className="h-28 rounded-xl overflow-hidden mt-1 bg-gray-100 relative">
                  <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80" className="w-full h-full object-cover" />
                </div>
                
                {/* Floating micro reaction bar */}
                <div className="flex items-center justify-between text-[7px] font-bold text-gray-400 mt-1">
                  <span className="flex items-center gap-0.5 text-red-500"><Heart className="h-2.5 w-2.5 fill-current" /> 1.2K</span>
                  <span className="flex items-center gap-0.5"><MessageSquare className="h-2.5 w-2.5" /> 84</span>
                  <span className="rounded bg-gray-100 px-1 font-mono text-[5px]">Share</span>
                </div>
              </div>

              {/* Bottom Nav Mockup */}
              <div className="bg-white rounded-xl p-1.5 flex justify-around items-center border border-gray-100 shadow-sm shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#7B61FF]" />
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <div className="w-3 h-3 bg-gradient-to-tr from-[#7B61FF] to-[#FF6EC7] rounded-full flex items-center justify-center text-white text-[7px] font-bold shadow-md shadow-[#7B61FF]/20">+</div>
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <div className="w-2 h-2 rounded-full bg-gray-300" />
              </div>
            </div>
          </motion.div>

          {/* Overlapping Phone Mockup #2 (Secondary - Rotated Right/Underneath) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 120, rotateY: 15, rotateX: 5 }}
            animate={{ opacity: 0.75, scale: 0.9, x: 110, rotateY: 12, rotateX: 4 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            style={{ transformStyle: "preserve-3d" }}
            className="absolute left-[38%] md:left-[45%] z-10 w-[220px] h-[440px] bg-white rounded-[32px] shadow-2xl border-4 border-gray-200 p-1.5 overflow-hidden flex flex-col justify-between opacity-80"
          >
            {/* Phone Screen Content (Profile Mockup) */}
            <div className="flex flex-col h-full bg-[#F6F7FB] rounded-[24px] p-2.5 overflow-hidden justify-between">
              <div className="h-16 w-full rounded-xl bg-gradient-to-r from-[#7B61FF] to-[#FF6EC7] shrink-0" />
              
              <div className="flex flex-col items-center -mt-8 mb-auto shrink-0">
                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" className="h-14 w-14 rounded-full object-cover border-2 border-white" />
                <span className="text-[10px] font-heading font-extrabold text-gray-800 mt-1">Lumina Chen</span>
                <span className="text-[7px] text-gray-400">@lumina</span>
                
                <div className="flex gap-2.5 my-2">
                  <div className="text-center">
                    <span className="block text-[8px] font-bold text-gray-800">12K</span>
                    <span className="text-[5px] uppercase tracking-wider text-gray-400 font-bold">Followers</span>
                  </div>
                  <div className="text-center border-x border-gray-200 px-2">
                    <span className="block text-[8px] font-bold text-gray-800">250</span>
                    <span className="text-[5px] uppercase tracking-wider text-gray-400 font-bold">Following</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-[8px] font-bold text-gray-800">14.8%</span>
                    <span className="text-[5px] uppercase tracking-wider text-gray-400 font-bold">Engagement</span>
                  </div>
                </div>
              </div>

              {/* Grid elements */}
              <div className="grid grid-cols-3 gap-1 my-2">
                <div className="aspect-square bg-gray-200 rounded-md overflow-hidden"><img src="https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" /></div>
                <div className="aspect-square bg-gray-200 rounded-md overflow-hidden"><img src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" /></div>
                <div className="aspect-square bg-gray-200 rounded-md overflow-hidden"><img src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" /></div>
              </div>

              {/* Follow Button */}
              <div className="rounded-lg bg-gradient-to-r from-[#7B61FF] to-[#FF6EC7] py-1 text-center text-[7px] font-bold text-white shadow-sm shrink-0">
                Connected
              </div>
            </div>
          </motion.div>

          {/* FLOATING UI CARD #1 (Nova Star followed you notification - TOP LEFT) */}
          <motion.div
            initial={{ opacity: 0, x: -40, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="animate-float-slow absolute top-[8%] left-[2%] z-30 flex items-center gap-2.5 rounded-2xl bg-white/95 border border-gray-100 p-3 shadow-lg backdrop-blur-md max-w-[210px]"
          >
            <div className="relative shrink-0">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" className="h-8 w-8 rounded-full object-cover" />
              <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF6EC7] text-[7px] text-white">
                <UserPlus className="h-2 w-2" />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-heading font-extrabold text-gray-800 leading-tight">Nova Star followed you</span>
              <span className="text-[8px] text-gray-400 font-semibold mt-0.5">Level 56 Cybernetic Artist</span>
            </div>
          </motion.div>

          {/* FLOATING UI CARD #2 (Zephyr liked comment - MIDDLE LEFT) */}
          <motion.div
            initial={{ opacity: 0, x: -50, y: 30 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="animate-float-medium absolute bottom-[22%] left-[4%] z-30 flex items-center gap-2.5 rounded-2xl bg-white/95 border border-gray-100 p-3 shadow-lg backdrop-blur-md max-w-[210px]"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-[#7B61FF] to-[#60A5FA] text-white shrink-0">
              <Heart className="h-3.5 w-3.5 fill-current text-white animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-heading font-bold text-gray-800 leading-tight">"This looks liquid! 🌊"</span>
              <span className="text-[8px] text-gray-400 font-semibold mt-0.5">Zephyr Vance liked your post</span>
            </div>
          </motion.div>

          {/* FLOATING UI CARD #3 (Aria Thorne comment bubble - RIGHT) */}
          <motion.div
            initial={{ opacity: 0, x: 60, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="animate-float-fast absolute top-[28%] right-[4%] z-30 flex flex-col gap-1.5 rounded-2xl bg-white/95 border border-gray-100 p-3 shadow-lg backdrop-blur-md max-w-[190px] text-left"
          >
            <div className="flex items-center gap-2">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" className="h-6 w-6 rounded-full object-cover" />
              <span className="text-[9px] font-heading font-bold text-gray-800">Aria Thorne</span>
              <span className="rounded bg-[#7B61FF]/10 text-[#7B61FF] text-[6px] px-1 font-bold">LVL 42</span>
            </div>
            <p className="text-[9px] text-gray-600 font-medium leading-normal">
              Are we launching this spatial engine tomorrow? Ready for synchronization! 🚀
            </p>
          </motion.div>

          {/* DECORATIVE GLASS REACTION BLOBS & EMOTICONS */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-[40%] left-[42%] z-30 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 border border-gray-100 shadow-md text-sm cursor-pointer"
          >
            🔥
          </motion.div>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[35%] right-[22%] z-30 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 border border-gray-100 shadow-md text-xs"
          >
            ✨
          </motion.div>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-[18%] left-[48%] z-30 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 border border-gray-100 shadow-md text-xs"
          >
            ❤️
          </motion.div>
          
          {/* BACKGROUND BLURRED ORBS WITHIN SHOWCASE */}
          <div className="absolute top-[50%] left-[30%] w-[160px] h-[160px] rounded-full bg-[#FF6EC7]/15 blur-[40px] pointer-events-none -z-10" />
        </div>

      </div>

      {/* FOOTER SPECS SUMMARY */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-gray-400 font-semibold tracking-wider font-sans">
        BUILD V3.1 • DRIVER ACTIVE • GEMINI COGNITION POWERED
      </div>
    </div>
  );
}
