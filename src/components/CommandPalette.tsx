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
        { name: "View Notifications", shortcut: "G N", action: () => { onNavigate("notifications"); onClose(); }, icon: Bell },
        { name: "My Profile", shortcut: "G P", action: () => { onNavigate("profile"); onClose(); }, icon: User },
        { name: "Settings", shortcut: "G S", action: () => { onNavigate("settings"); onClose(); }, icon: Settings },
      ],
    },
    {
      category: "AI Assistant",
      items: [
        { name: "Generate AI Caption", shortcut: "⌥ C", action: () => { onGenerateCaption(); onClose(); }, icon: Sparkles },
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
          className="fixed inset-0 bg-black/50 backdrop-blur-md"
        />

        {/* Command dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-xl overflow-hidden rounded-[24px] border border-border-custom bg-card shadow-hover backdrop-blur-xl transition-all"
        >
          {/* Subtle reflection overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />

          {/* Search Input bar */}
          <div className="flex items-center gap-3 border-b border-border-custom px-4.5 py-4">
            <Search className="h-4.5 w-4.5 text-primary-custom" />
            <input
              type="text"
              placeholder="Search actions or navigate..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent font-heading text-xs text-text-custom placeholder-muted-custom outline-none"
              autoFocus
            />
            <span className="rounded-lg border border-border-custom bg-black/5 dark:bg-white/10 px-2 py-1 font-sans text-[9px] font-bold text-muted-custom">
              ESC
            </span>
          </div>

          {/* Commands lists */}
          <div className="max-h-[320px] overflow-y-auto p-2">
            {filteredCommands.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Terminal className="mb-2.5 h-7 w-7 text-muted-custom/40" />
                <p className="text-xs text-muted-custom font-semibold">No commands found.</p>
              </div>
            ) : (
              filteredCommands.map((group, gIdx) => (
                <div key={gIdx} className="mb-4 last:mb-0">
                  <h3 className="px-3.5 py-1 font-heading text-[10px] font-bold uppercase tracking-wider text-muted-custom">
                    {group.category}
                  </h3>
                  <div className="mt-1.5 flex flex-col gap-0.5">
                    {group.items.map((item, iIdx) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={iIdx}
                          onClick={item.action}
                          className="flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left hover:bg-black/5 dark:hover:bg-white/5 group transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4.5 w-4.5 text-muted-custom group-hover:text-primary-custom transition-colors" />
                            <span className="font-heading text-xs font-bold text-text-custom/90 group-hover:text-text-custom transition-colors">
                              {item.name}
                            </span>
                          </div>
                          <span className="font-sans text-[10px] font-bold text-muted-custom/40 group-hover:text-muted-custom transition-colors">
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
          <div className="flex items-center justify-between border-t border-border-custom bg-black/[0.01] dark:bg-white/[0.01] px-4.5 py-2.5 text-[10px] font-sans font-bold text-muted-custom">
            <div className="flex gap-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
            </div>
            <span>SocialSphere</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
