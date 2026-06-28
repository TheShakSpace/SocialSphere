import React, { useState } from "react";
import { motion } from "motion/react";
import { Settings, Shield, Bell, Eye, EyeOff, Check, Cpu, Sparkles } from "lucide-react";

interface SettingsPageProps {
  addToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function SettingsPage({ addToast }: SettingsPageProps) {
  const [spatialTracking, setSpatialTracking] = useState(true);
  const [neuralEnhance, setNeuralEnhance] = useState(true);
  const [ambientGlow, setAmbientGlow] = useState(true);
  const [interactiveGlass, setInteractiveGlass] = useState(true);
  const [privateMode, setPrivateMode] = useState(false);

  const handleToggle = (setting: string, val: boolean, setter: (v: boolean) => void) => {
    setter(!val);
    addToast(`${setting} updated successfully!`, "success");
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Configuration Header Title */}
      <div className="relative overflow-hidden rounded-[24px] border border-border-custom bg-card p-5 shadow-main transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#7B61FF]/5 via-transparent to-transparent pointer-events-none" />
        <div className="flex items-center gap-2.5">
          <Settings className="h-5 w-5 text-accent-blue" />
          <h2 className="font-heading text-base font-bold text-text-custom">Settings</h2>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="flex flex-col gap-4">
        {/* Visual Engine Config */}
        <div className="rounded-[24px] border border-border-custom bg-card p-5 shadow-main transition-colors duration-300">
          <div className="flex items-center gap-2 mb-4 text-[#7B61FF]">
            <Cpu className="h-4.5 w-4.5" />
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider">Visual Preferences</h3>
          </div>

          <div className="flex flex-col gap-4">
            {/* Ambient Glow Blob */}
            <div className="flex items-center justify-between p-3.5 rounded-xl hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
              <div className="pr-4">
                <span className="font-heading text-xs font-bold text-text-custom block">Animated Background Blobs</span>
                <span className="font-sans text-[10px] text-muted-custom mt-1 block font-semibold leading-relaxed">Render smooth, drifting background color blur spheres in the canvas.</span>
              </div>
              <button
                onClick={() => handleToggle("Background blobs setting", ambientGlow, setAmbientGlow)}
                className={`relative w-11 h-6 shrink-0 rounded-full transition-colors duration-300 border focus:outline-none cursor-pointer ${
                  ambientGlow ? "bg-primary-custom border-primary-custom" : "bg-black/10 dark:bg-white/10 border-border-custom"
                }`}
              >
                <motion.div
                  animate={{ x: ambientGlow ? 20 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-4.5 h-4.5 rounded-full bg-white shadow-md absolute top-0.5"
                />
              </button>
            </div>

            {/* Interactive Glass Tilt */}
            <div className="flex items-center justify-between p-3.5 rounded-xl hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
              <div className="pr-4">
                <span className="font-heading text-xs font-bold text-text-custom block">3D Perspective Card Tilt</span>
                <span className="font-sans text-[10px] text-muted-custom mt-1 block font-semibold leading-relaxed">Apply a premium cursor-following tilt rotation transform to feed cards.</span>
              </div>
              <button
                onClick={() => handleToggle("Perspective tilt setting", interactiveGlass, setInteractiveGlass)}
                className={`relative w-11 h-6 shrink-0 rounded-full transition-colors duration-300 border focus:outline-none cursor-pointer ${
                  interactiveGlass ? "bg-primary-custom border-primary-custom" : "bg-black/10 dark:bg-white/10 border-border-custom"
                }`}
              >
                <motion.div
                  animate={{ x: interactiveGlass ? 20 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-4.5 h-4.5 rounded-full bg-white shadow-md absolute top-0.5"
                />
              </button>
            </div>
          </div>
        </div>

        {/* AI & Intelligence Config */}
        <div className="rounded-[24px] border border-border-custom bg-card p-5 shadow-main transition-colors duration-300">
          <div className="flex items-center gap-2 mb-4 text-[#34D399]">
            <Sparkles className="h-4.5 w-4.5" />
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider">AI Features</h3>
          </div>

          <div className="flex flex-col gap-4">
            {/* Neural Enhance Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
              <div className="pr-4">
                <span className="font-heading text-xs font-bold text-text-custom block">AI Mood Synchronization</span>
                <span className="font-sans text-[10px] text-muted-custom mt-1 block font-semibold leading-relaxed">Synthesize active inputs into our server-side models to generate creative emotion tags.</span>
              </div>
              <button
                onClick={() => handleToggle("AI mood synchronizer setting", neuralEnhance, setNeuralEnhance)}
                className={`relative w-11 h-6 shrink-0 rounded-full transition-colors duration-300 border focus:outline-none cursor-pointer ${
                  neuralEnhance ? "bg-[#34D399] border-[#34D399]" : "bg-black/10 dark:bg-white/10 border-border-custom"
                }`}
              >
                <motion.div
                  animate={{ x: neuralEnhance ? 20 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-4.5 h-4.5 rounded-full bg-white shadow-md absolute top-0.5"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Security & Access Core */}
        <div className="rounded-[24px] border border-border-custom bg-card p-5 shadow-main transition-colors duration-300">
          <div className="flex items-center gap-2 mb-4 text-[#38BDF8]">
            <Shield className="h-4.5 w-4.5" />
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider">Privacy & Safety</h3>
          </div>

          <div className="flex flex-col gap-4">
            {/* Private Mode Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
              <div className="pr-4">
                <span className="font-heading text-xs font-bold text-text-custom block">Private Account Mode</span>
                <span className="font-sans text-[10px] text-muted-custom mt-1 block font-semibold leading-relaxed">Conceal follower indices and level indicators from search directories.</span>
              </div>
              <button
                onClick={() => handleToggle("Privacy account mode", privateMode, setPrivateMode)}
                className={`relative w-11 h-6 shrink-0 rounded-full transition-colors duration-300 border focus:outline-none cursor-pointer ${
                  privateMode ? "bg-[#38BDF8] border-[#38BDF8]" : "bg-black/10 dark:bg-white/10 border-border-custom"
                }`}
              >
                <motion.div
                  animate={{ x: privateMode ? 20 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-4.5 h-4.5 rounded-full bg-white shadow-md absolute top-0.5"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Static Diagnostic Note */}
        <div className="rounded-[24px] border border-border-custom bg-black/[0.01] dark:bg-white/[0.01] p-4.5 text-center transition-colors">
          <span className="block font-heading text-[9px] text-muted-custom font-bold uppercase tracking-widest mb-1.5">SYSTEM HEALTH</span>
          <div className="flex items-center justify-center gap-3 text-[11px] font-semibold text-[#34D399]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
              <span>API Gateway Synchronized</span>
            </span>
            <span>•</span>
            <span>GPU Viewport: 60 FPS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
