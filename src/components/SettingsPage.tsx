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
    addToast(`${setting} configuration updated!`, "success");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Configuration Header Title */}
      <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-white/4 p-5 shadow-xl backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#7C5CFF]/5 via-transparent to-transparent pointer-events-none" />
        <div className="flex items-center gap-2.5">
          <Settings className="h-5 w-5 text-[#00D4FF]" />
          <h2 className="font-heading text-lg font-bold text-white">System Configurations</h2>
        </div>
      </div>

      {/* Settings Sections - Glass Cards */}
      <div className="flex flex-col gap-4">
        {/* Visual Engine Config */}
        <div className="rounded-[22px] border border-white/8 bg-white/4 p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4 text-[#7C5CFF]">
            <Cpu className="h-4.5 w-4.5" />
            <h3 className="font-space text-xs font-bold uppercase tracking-wider">Spatial Rendering Engine</h3>
          </div>

          <div className="flex flex-col gap-4">
            {/* Ambient Glow Blob */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.01] transition-all">
              <div>
                <span className="font-heading text-xs font-semibold text-white block">Ambient Hologram Blob</span>
                <span className="font-sans text-[10px] text-[#98A2B3]">Render large, animated, floating blur spheres in viewport canvas background.</span>
              </div>
              <button
                onClick={() => handleToggle("Ambient Hologram Blob", ambientGlow, setAmbientGlow)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 border focus:outline-none ${
                  ambientGlow ? "bg-[#7C5CFF] border-[#7C5CFF]" : "bg-black/40 border-white/10"
                }`}
              >
                <motion.div
                  animate={{ x: ambientGlow ? 20 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-4 h-4 rounded-full bg-white shadow-md absolute top-0.5"
                />
              </button>
            </div>

            {/* Interactive Glass Tilt */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.01] transition-all">
              <div>
                <span className="font-heading text-xs font-semibold text-white block">3D Glass Tilt Perspective</span>
                <span className="font-sans text-[10px] text-[#98A2B3]">Apply mouse movement parallax and 3D rotation transforms on post cards.</span>
              </div>
              <button
                onClick={() => handleToggle("3D Glass Tilt", interactiveGlass, setInteractiveGlass)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 border focus:outline-none ${
                  interactiveGlass ? "bg-[#7C5CFF] border-[#7C5CFF]" : "bg-black/40 border-white/10"
                }`}
              >
                <motion.div
                  animate={{ x: interactiveGlass ? 20 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-4 h-4 rounded-full bg-white shadow-md absolute top-0.5"
                />
              </button>
            </div>
          </div>
        </div>

        {/* AI & Intelligence Config */}
        <div className="rounded-[22px] border border-white/8 bg-white/4 p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4 text-[#00FFA3]">
            <Sparkles className="h-4.5 w-4.5" />
            <h3 className="font-space text-xs font-bold uppercase tracking-wider">AI Intelligence Nodes</h3>
          </div>

          <div className="flex flex-col gap-4">
            {/* Neural Enhance Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.01] transition-all">
              <div>
                <span className="font-heading text-xs font-semibold text-white block">Continuous Mood Sync</span>
                <span className="font-sans text-[10px] text-[#98A2B3]">Feed content into server-side Gemini 3.5 models to classify visual emotional signals.</span>
              </div>
              <button
                onClick={() => handleToggle("Continuous Mood Sync", neuralEnhance, setNeuralEnhance)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 border focus:outline-none ${
                  neuralEnhance ? "bg-[#00FFA3] border-[#00FFA3]" : "bg-black/40 border-white/10"
                }`}
              >
                <motion.div
                  animate={{ x: neuralEnhance ? 20 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-4 h-4 rounded-full bg-white shadow-md absolute top-0.5"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Security & Access Core */}
        <div className="rounded-[22px] border border-white/8 bg-white/4 p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4 text-[#00D4FF]">
            <Shield className="h-4.5 w-4.5" />
            <h3 className="font-space text-xs font-bold uppercase tracking-wider">Privacy & Neural Shields</h3>
          </div>

          <div className="flex flex-col gap-4">
            {/* Private Mode Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.01] transition-all">
              <div>
                <span className="font-heading text-xs font-semibold text-white block">Incognito Transmission</span>
                <span className="font-sans text-[10px] text-[#98A2B3]">Hide profile stats and creator level indices from public explore queries.</span>
              </div>
              <button
                onClick={() => handleToggle("Incognito Transmission", privateMode, setPrivateMode)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 border focus:outline-none ${
                  privateMode ? "bg-[#00D4FF] border-[#00D4FF]" : "bg-black/40 border-white/10"
                }`}
              >
                <motion.div
                  animate={{ x: privateMode ? 20 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-4 h-4 rounded-full bg-white shadow-md absolute top-0.5"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Static Developer Note */}
        <div className="rounded-[22px] border border-white/6 bg-white/[0.01] p-4 text-center">
          <span className="block font-mono text-[8px] text-[#98A2B3] uppercase tracking-widest mb-1.5">HARDWARE DIAGNOSTIC</span>
          <div className="flex items-center justify-center gap-3 text-xs text-[#00FFA3]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse" />
              <span>Server-side API Connected</span>
            </span>
            <span>•</span>
            <span>Client Render: 60 FPS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
