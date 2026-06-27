import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Sparkles, Terminal, FileText, User, Settings, Compass, Bell } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onGenerateCaption: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  onGenerateCaption,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // Controlled externally
      }
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    {
      category: "Navigation",
      items: [
        { name: "Go to Home Feed", shortcut: "G H", action: () => { onNavigate("feed"); onClose(); }, icon: FileText },
        { name: "Explore Discoveries", shortcut: "G E", action: () => { onNavigate("explore"); onClose(); }, icon: Compass },
        { name: "View Interactions", shortcut: "G N", action: () => { onNavigate("notifications"); onClose(); }, icon: Bell },
        { name: "My Cyber Profile", shortcut: "G P", action: () => { onNavigate("profile"); onClose(); }, icon: User },
        { name: "System Configurations", shortcut: "G S", action: () => { onNavigate("settings"); onClose(); }, icon: Settings },
      ],
    },
    {
      category: "AI Intelligence",
      items: [
        { name: "Synthesize AI Captions", shortcut: "⌥ C", action: () => { onGenerateCaption(); onClose(); }, icon: Sparkles },
      ],
    },
  ];

  const filteredCommands = commands.map((group) => ({
    category: group.category,
    items: group.items.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
        {/* Backdrop glass */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#070B14]/80 backdrop-blur-md"
        />

        {/* Command dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/12 bg-white/5 shadow-2xl backdrop-blur-2xl"
        >
          {/* Subtle reflection overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />

          {/* Search Input bar */}
          <div className="flex items-center gap-3 border-b border-white/8 px-4 py-4">
            <Search className="h-5 w-5 text-[#7C5CFF]" />
            <input
              type="text"
              placeholder="Type a command or navigate..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent font-heading text-sm text-white placeholder-white/30 outline-none"
              autoFocus
            />
            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-[#98A2B3]">
              ESC
            </span>
          </div>

          {/* Commands lists */}
          <div className="max-h-[320px] overflow-y-auto p-2">
            {filteredCommands.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Terminal className="mb-2 h-8 w-8 text-white/20" />
                <p className="text-sm text-white/50">No command neural routes found.</p>
              </div>
            ) : (
              filteredCommands.map((group, gIdx) => (
                <div key={gIdx} className="mb-4 last:mb-0">
                  <h3 className="px-3 py-1 font-space text-[10px] font-semibold uppercase tracking-widest text-[#98A2B3]">
                    {group.category}
                  </h3>
                  <div className="mt-1 flex flex-col gap-0.5">
                    {group.items.map((item, iIdx) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={iIdx}
                          onClick={item.action}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left hover:bg-white/6 group transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4.5 w-4.5 text-[#98A2B3] group-hover:text-[#00D4FF]" />
                            <span className="font-heading text-xs font-medium text-white/80 group-hover:text-white">
                              {item.name}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-white/30 group-hover:text-white/60">
                            {item.shortcut}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer bar */}
          <div className="flex items-center justify-between border-t border-white/6 bg-white/[0.02] px-4 py-2 text-[10px] font-mono text-[#98A2B3]">
            <div className="flex gap-4">
              <span>↑↓ Navigation</span>
              <span>↵ Select</span>
            </div>
            <span>SocialSphere AI-OS v3</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
