import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  Search, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  Check, 
  Plus, 
  ShieldCheck, 
  MessageSquare,
  Globe,
  Lock
} from "lucide-react";

interface Community {
  id: string;
  name: string;
  tagline: string;
  members: string;
  postsPerDay: string;
  category: string;
  gradient: string;
  isJoined: boolean;
  type: "PUBLIC" | "RESTRICTED";
}

const INITIAL_COMMUNITIES: Community[] = [
  {
    id: "com1",
    name: "Neon Designers Guild 🎨",
    tagline: "Unifying spatial designers pushing the aesthetic boundaries of digital canvases & glassmorphism layout systems.",
    members: "14.2K members",
    postsPerDay: "42 posts today",
    category: "Design",
    gradient: "from-[#7B61FF] via-[#FF6EC7] to-[#FFA94D]",
    isJoined: true,
    type: "PUBLIC"
  },
  {
    id: "com2",
    name: "Synthesizer Society 🎹",
    tagline: "Oscillators, retro wave frequency grids, and generative AI music design. Put your virtual headphones on & sync.",
    members: "8.5K members",
    postsPerDay: "19 posts today",
    category: "Music",
    gradient: "from-[#FF6EC7] via-[#FFA94D] to-[#60A5FA]",
    isJoined: false,
    type: "PUBLIC"
  },
  {
    id: "com3",
    name: "Nothing Tech Explorers 📱",
    tagline: "A fan space for exploring transparent hardware, ambient notifications, and physical product design philosophies.",
    members: "6.1K members",
    postsPerDay: "28 posts today",
    category: "Hardware",
    gradient: "from-[#60A5FA] via-[#7B61FF] to-[#FF6EC7]",
    isJoined: false,
    type: "PUBLIC"
  },
  {
    id: "com4",
    name: "Cosmic Philosophers 🌌",
    tagline: "Deep conversations about spatial computing, augmented consciousness, digital artifacts, and future networks.",
    members: "4.9K members",
    postsPerDay: "12 posts today",
    category: "Philosophy",
    gradient: "from-[#FFA94D] via-[#60A5FA] to-[#7B61FF]",
    isJoined: false,
    type: "RESTRICTED"
  }
];

export default function CommunitiesPage({ addToast }: { addToast: (msg: string, type: "success" | "error" | "info") => void }) {
  const [communities, setCommunities] = useState<Community[]>(INITIAL_COMMUNITIES);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const toggleJoin = (id: string, name: string) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === id) {
        const nextJoined = !c.isJoined;
        addToast(
          nextJoined ? `Successfully entered ${name}! Welcome.` : `Disconnected from ${name}.`,
          nextJoined ? "success" : "info"
        );
        return { ...c, isJoined: nextJoined };
      }
      return c;
    }));
  };

  const filtered = communities.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.tagline.toLowerCase().includes(search.toLowerCase());
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "joined") return matchesSearch && c.isJoined;
    return matchesSearch && c.category.toLowerCase() === activeFilter;
  });

  return (
    <div className="flex flex-col gap-6 select-none text-left">
      
      {/* Title Header Card */}
      <div className="relative overflow-hidden rounded-[24px] border border-gray-100 bg-white p-6 shadow-md dark:bg-gray-900/40 dark:border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#7B61FF]/5 via-transparent to-transparent pointer-events-none" />
        <div className="flex items-center gap-2 text-[#7B61FF] mb-2.5">
          <Users className="h-5 w-5" />
          <span className="font-heading text-[10px] font-bold uppercase tracking-widest">COMMUNITIES HUB</span>
        </div>
        <h2 className="font-heading text-xl font-bold text-gray-900 dark:text-white mb-1.5">Aesthetic Forums</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
          Connect with curated hubs aligned by creative frequencies. Discuss spatial interfaces, transparent hardware, retro music mixes, and creative design philosophies.
        </p>

        {/* Custom Search bar inside community headers */}
        <div className="relative mt-5">
          <Search className="absolute left-4.5 top-3.5 h-4.5 w-4.5 text-[#7B61FF]" />
          <input
            type="text"
            placeholder="Search community keywords, categories, or hubs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 py-3.5 pl-12 pr-4 text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-[#7B61FF] dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all"
          />
        </div>
      </div>

      {/* Filter Tabs Row */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none shrink-0">
        {["all", "joined", "design", "music", "hardware", "philosophy"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`rounded-full px-4.5 py-1.8 text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 border ${
              activeFilter === tab
                ? "bg-[#7B61FF]/10 border-[#7B61FF] text-[#7B61FF] shadow-sm"
                : "bg-white border-gray-100 text-gray-400 hover:text-gray-600 dark:bg-gray-900/40 dark:border-gray-800"
            }`}
          >
            {tab === "all" ? "All Forums" : tab === "joined" ? "My Hubs" : tab}
          </button>
        ))}
      </div>

      {/* List of Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((c) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="group relative overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-md dark:bg-gray-900/40 dark:border-gray-800 hover:scale-[1.01] hover:shadow-lg transition-all flex flex-col justify-between"
            >
              {/* Header Large Colorful Banner/Gradient Line */}
              <div className={`h-24 w-full bg-gradient-to-r ${c.gradient} p-4 flex items-end relative overflow-hidden shrink-0`}>
                <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
                <div className="absolute top-3 right-3 flex gap-1">
                  <span className="flex items-center gap-1 rounded-full bg-white/25 backdrop-blur-md px-2.5 py-0.5 font-sans text-[8px] font-bold text-white uppercase tracking-wider">
                    {c.type === "PUBLIC" ? <Globe className="h-2.5 w-2.5" /> : <Lock className="h-2.5 w-2.5" />} {c.type}
                  </span>
                </div>
                
                <span className="relative z-10 rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 font-sans text-[8px] font-bold text-white uppercase tracking-wider">
                  {c.category}
                </span>
              </div>

              {/* Body details Area */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-heading text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1.5 group-hover:text-[#7B61FF] transition-colors">
                    {c.name}
                  </h3>
                  <p className="font-sans text-[11px] leading-relaxed text-gray-500 dark:text-gray-400 font-semibold line-clamp-2">
                    {c.tagline}
                  </p>
                </div>

                {/* Foot indicators */}
                <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-800/60 pt-3">
                  <div className="flex flex-col">
                    <span className="font-sans text-[10px] font-bold text-gray-700 dark:text-gray-300">{c.members}</span>
                    <span className="font-sans text-[9px] text-[#34D399] font-bold mt-0.5">{c.postsPerDay}</span>
                  </div>

                  {/* Join trigger */}
                  <button
                    onClick={() => toggleJoin(c.id, c.name)}
                    className={`rounded-xl px-4 py-2 font-heading text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
                      c.isJoined
                        ? "bg-gray-100 text-gray-400 hover:bg-red-500/10 hover:text-red-500 dark:bg-gray-800 dark:text-gray-500"
                        : "bg-[#7B61FF] text-white hover:opacity-95 shadow-sm shadow-[#7B61FF]/10"
                    }`}
                  >
                    {c.isJoined ? "Joined Hub" : "Join Hub"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="col-span-1 md:col-span-2 rounded-[24px] border border-gray-100 bg-white p-12 text-center shadow-sm dark:bg-gray-900/20 dark:border-gray-800">
            <p className="font-sans text-xs text-gray-400 font-semibold">No communities matches your filter. Explore and create a custom hub today!</p>
          </div>
        )}
      </div>

    </div>
  );
}
