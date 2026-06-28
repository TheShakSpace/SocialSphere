import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, 
  Send, 
  Search, 
  Circle, 
  Phone, 
  Video, 
  Sparkles, 
  Info, 
  Plus, 
  Smile, 
  Image as ImageIcon 
} from "lucide-react";

interface ChatFriend {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
  lastMessage: string;
  unreadCount: number;
  level: number;
}

interface ChatMessage {
  id: string;
  sender: "me" | "friend";
  content: string;
  timestamp: string;
}

const INITIAL_FRIENDS: ChatFriend[] = [
  {
    id: "f1",
    name: "Aria Thorne",
    handle: "ariathorne",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    isOnline: true,
    lastMessage: "The liquid glass layers are working perfectly at 90hz!",
    unreadCount: 2,
    level: 42
  },
  {
    id: "f2",
    name: "Zephyr Vance",
    handle: "zephyr",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    isOnline: true,
    lastMessage: "I voted for React Three Fiber! Spatial web is accelerating fast.",
    unreadCount: 0,
    level: 35
  },
  {
    id: "f3",
    name: "Lumina Chen",
    handle: "lumina",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    isOnline: false,
    lastSeen: "2 hours ago",
    lastMessage: "Can you review my augmented reality wireframes tonight?",
    unreadCount: 0,
    level: 19
  },
  {
    id: "f4",
    name: "Nova Star",
    handle: "novastar",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    isOnline: true,
    lastMessage: "Listen to my cyber synthwave track over headphones!",
    unreadCount: 1,
    level: 56
  }
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  f1: [
    { id: "m1", sender: "friend", content: "Hey! Just pushed the final depth settings into my spatial wireframes.", timestamp: "10:30 AM" },
    { id: "m2", sender: "me", content: "Awesome Aria! Did you bind them to custom hand tracking gestures?", timestamp: "10:32 AM" },
    { id: "m3", sender: "friend", content: "Yes! And the glass refraction layout translates beautifully.", timestamp: "10:33 AM" },
    { id: "m4", sender: "friend", content: "The liquid glass layers are working perfectly at 90hz!", timestamp: "10:34 AM" }
  ],
  f2: [
    { id: "m5", sender: "me", content: "Hey Zephyr, what framework do you prefer for 3D interactions?", timestamp: "Yesterday" },
    { id: "m6", sender: "friend", content: "Definitely React Three Fiber paired with WebXR layers. It scales well.", timestamp: "Yesterday" },
    { id: "m7", sender: "friend", content: "I voted for React Three Fiber! Spatial web is accelerating fast.", timestamp: "Yesterday" }
  ],
  f3: [
    { id: "m8", sender: "friend", content: "Let's catch up on Neo-San Francisco design meetups soon.", timestamp: "2 days ago" },
    { id: "m9", sender: "friend", content: "Can you review my augmented reality wireframes tonight?", timestamp: "2 days ago" }
  ],
  f4: [
    { id: "m10", sender: "me", content: "Your latest synthwave mix is playing on loop in my sandbox!", timestamp: "4 hours ago" },
    { id: "m11", sender: "friend", content: "Aww thank you! It means so much. The bassline took me forever to synthesize.", timestamp: "3 hours ago" },
    { id: "m12", sender: "friend", content: "Listen to my cyber synthwave track over headphones!", timestamp: "3 hours ago" }
  ]
};

export default function MessagesPage({ addToast }: { addToast: (msg: string, type: "success" | "error" | "info") => void }) {
  const [friends, setFriends] = useState<ChatFriend[]>(INITIAL_FRIENDS);
  const [activeFriendId, setActiveFriendId] = useState("f1");
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [typedText, setTypedText] = useState("");
  const [search, setSearch] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeFriendId]);

  const activeFriend = friends.find(f => f.id === activeFriendId) || friends[0];
  const currentChatMessages = messages[activeFriendId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedText.trim()) return;

    const newMsg: ChatMessage = {
      id: "msg_" + Date.now(),
      sender: "me",
      content: typedText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update messages
    setMessages(prev => ({
      ...prev,
      [activeFriendId]: [...(prev[activeFriendId] || []), newMsg]
    }));

    // Update last message in friends list
    setFriends(prev => prev.map(f => {
      if (f.id === activeFriendId) {
        return { ...f, lastMessage: typedText, unreadCount: 0 };
      }
      return f;
    }));

    setTypedText("");
    addToast("Neural transmission successfully broadcast!", "success");

    // Simulated reply after 2 seconds
    setTimeout(() => {
      const simulatedReplies = [
        "Absolutely gorgeous! Let's schedule a session to test this layout.",
        "Your frequency matches mine perfectly. Let's build the layers!",
        "Stellar perspectives! I am synchronizing my client terminal as we speak.",
        "Yes! Let's sync on that design idea inside SocialSphere tonight."
      ];
      const replyText = simulatedReplies[Math.floor(Math.random() * simulatedReplies.length)];

      const friendMsg: ChatMessage = {
        id: "msg_reply_" + Date.now(),
        sender: "friend",
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(p => ({
        ...p,
        [activeFriendId]: [...(p[activeFriendId] || []), friendMsg]
      }));

      setFriends(p => p.map(f => {
        if (f.id === activeFriendId) {
          return { ...f, lastMessage: replyText };
        }
        return f;
      }));

      addToast(`${activeFriend.name} broadcasted a response!`, "info");
    }, 2000);
  };

  const filteredFriends = friends.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    f.handle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-md dark:bg-gray-900/40 dark:border-gray-800 h-[calc(100vh-140px)] flex select-none text-left">
      
      {/* 1. FRIENDS LIST SIDEBAR (4 Cols) */}
      <div className="w-[30%] sm:w-[35%] border-r border-gray-50 dark:border-gray-800 flex flex-col h-full shrink-0">
        
        {/* Header search */}
        <div className="p-4 border-b border-gray-50 dark:border-gray-800 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#7B61FF]">
            <MessageSquare className="h-4.5 w-4.5" />
            <span className="font-heading text-[10px] font-bold uppercase tracking-wider">Inbox Channel</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search chat thread..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-gray-50/50 py-2 pl-9 pr-3 text-[11px] text-gray-800 placeholder-gray-400 outline-none focus:border-[#7B61FF] dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all"
            />
          </div>
        </div>

        {/* Scrollable threads list */}
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5 scrollbar-none">
          {filteredFriends.map((f) => {
            const isActive = f.id === activeFriendId;
            return (
              <div
                key={f.id}
                onClick={() => {
                  setActiveFriendId(f.id);
                  // Clear unreads when clicking
                  setFriends(prev => prev.map(item => item.id === f.id ? { ...item, unreadCount: 0 } : item));
                }}
                className={`relative group flex gap-3 items-center p-3 rounded-2xl cursor-pointer transition-all duration-300 ${
                  isActive 
                    ? "bg-[#7B61FF]/10 border border-[#7B61FF]/10" 
                    : "border border-transparent hover:bg-gray-50/50 dark:hover:bg-gray-800/40"
                }`}
              >
                {/* Avatar with Status indicator */}
                <div className="relative shrink-0">
                  <img src={f.avatar} alt="" className="h-9 w-9 rounded-full object-cover border border-gray-100" />
                  <span className={`absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full border-2 border-white dark:border-gray-900 ${f.isOnline ? "bg-[#34D399]" : "bg-gray-300"}`} />
                </div>

                {/* Info summary */}
                <div className="hidden sm:flex flex-col overflow-hidden flex-1 text-left">
                  <div className="flex justify-between items-center">
                    <span className={`font-heading text-xs font-bold truncate leading-tight ${isActive ? "text-[#7B61FF]" : "text-gray-800 dark:text-white"}`}>
                      {f.name}
                    </span>
                    {f.unreadCount > 0 && (
                      <span className="h-4.5 min-w-4.5 rounded-full bg-[#FF6EC7] text-white flex items-center justify-center text-[8px] font-sans font-bold px-1 animate-pulse">
                        {f.unreadCount}
                      </span>
                    )}
                  </div>
                  <span className="font-sans text-[10px] text-gray-400 truncate mt-0.5">{f.lastMessage}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. CHAT FEED & MESSAGE AREA (8 Cols) */}
      <div className="flex-1 flex flex-col h-full bg-gray-50/30 dark:bg-transparent">
        
        {/* Thread Header details */}
        <div className="p-4 border-b border-gray-50 dark:border-gray-800 bg-white dark:bg-gray-900/10 flex items-center justify-between shrink-0">
          <div className="flex gap-2.5 items-center">
            <div className="relative shrink-0">
              <img src={activeFriend.avatar} alt="" className="h-9.5 w-9.5 rounded-full object-cover border border-gray-100" />
              <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-white dark:border-gray-900 ${activeFriend.isOnline ? "bg-[#34D399]" : "bg-gray-300"}`} />
            </div>
            <div className="text-left">
              <span className="font-heading text-xs font-bold text-gray-800 dark:text-white block leading-tight">
                {activeFriend.name}
              </span>
              <span className="font-sans text-[10px] text-gray-400 block mt-0.5">
                {activeFriend.isOnline ? "Active Stream Online" : `Last linked ${activeFriend.lastSeen}`} • LVL {activeFriend.level}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-400">
            <button className="p-2 hover:text-[#7B61FF] rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition-colors"><Phone className="h-4 w-4" /></button>
            <button className="p-2 hover:text-[#7B61FF] rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition-colors"><Video className="h-4 w-4" /></button>
            <button className="p-2 hover:text-[#7B61FF] rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition-colors"><Info className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Message bubbles body area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 scrollbar-none">
          <AnimatePresence initial={false}>
            {currentChatMessages.map((m) => {
              const isMe = m.sender === "me";
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2.5 max-w-[85%] ${isMe ? "ml-auto" : "mr-auto"}`}
                >
                  {!isMe && (
                    <img src={activeFriend.avatar} alt="" className="h-7 w-7 rounded-full object-cover shrink-0 mb-1 border border-gray-100 shadow-sm" />
                  )}
                  
                  <div className="flex flex-col text-left">
                    <div className={`rounded-2xl px-4 py-2.5 text-xs font-sans font-medium leading-relaxed ${
                      isMe 
                        ? "bg-gradient-to-r from-[#7B61FF] to-[#A855F7] text-white rounded-br-none shadow-md shadow-[#7B61FF]/10" 
                        : "bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                    }`}>
                      {m.content}
                    </div>
                    <span className={`text-[8px] text-gray-400 font-semibold mt-1 px-1 ${isMe ? "text-right" : "text-left"}`}>
                      {m.timestamp}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Message Input Composers */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-50 dark:border-gray-800 bg-white dark:bg-gray-900/10 flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-gray-400">
            <button type="button" className="p-2 hover:text-[#7B61FF] rounded-xl transition-colors cursor-pointer"><Plus className="h-4.5 w-4.5" /></button>
            <button type="button" className="p-2 hover:text-[#7B61FF] rounded-xl transition-colors cursor-pointer"><ImageIcon className="h-4.5 w-4.5" /></button>
            <button type="button" className="p-2 hover:text-[#7B61FF] rounded-xl transition-colors cursor-pointer"><Smile className="h-4.5 w-4.5" /></button>
          </div>

          <input
            type="text"
            placeholder={`Reply to ${activeFriend.name}...`}
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            className="flex-1 rounded-2xl border border-gray-100 bg-gray-50/50 py-3 px-4.5 text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-[#7B61FF] dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all"
          />

          <button
            type="submit"
            className="rounded-2xl h-11 w-11 bg-gradient-to-tr from-[#7B61FF] to-[#FF6EC7] text-white flex items-center justify-center shadow-lg shadow-[#7B61FF]/15 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
