import React, { useRef, useState } from "react";
import { motion } from "motion/react";

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  glowColor?: string; // e.g. "rgba(124, 92, 255, 0.15)"
  enableTilt?: boolean;
}

export default function GlassContainer({
  children,
  className = "",
  id,
  glowColor = "rgba(124, 92, 255, 0.04)",
  enableTilt = true,
}: GlassContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate rotation (-10 to 10 degrees)
    const rotY = ((mouseX - width / 2) / (width / 2)) * 8;
    const rotX = -((mouseY - height / 2) / (height / 2)) * 8;

    // Calculate glare percentage
    const glX = (mouseX / width) * 100;
    const glY = (mouseY / height) * 100;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlareX(glX);
    setGlareY(glY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      id={id}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className={`group relative overflow-hidden rounded-[22px] border border-white/8 bg-white/4 p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 ${className}`}
    >
      {/* Dynamic Back Ambient Glow */}
      <div
        className="absolute -inset-px -z-10 rounded-[22px] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(120px circle at ${glareX}% ${glareY}%, ${glowColor}, transparent)`,
        }}
      />

      {/* Inner Border Refraction Line */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-[22px] border border-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)`,
        }}
      />

      {/* Futuristic Liquid Glare Reflection Overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-tr from-transparent via-white/5 to-transparent transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.3 : 0,
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.12) 0%, transparent 50%)`,
        }}
      />

      {/* Main 3D Container Wrapper */}
      <div
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
            : "rotateX(0deg) rotateY(0deg) translateZ(0px)",
          transition: isHovered ? "none" : "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
          transformStyle: "preserve-3d",
        }}
        className="h-full w-full"
      >
        {children}
      </div>
    </motion.div>
  );
}
