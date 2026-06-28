import React, { useRef, useState } from "react";
import { motion } from "motion/react";

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  glowColor?: string; // e.g. "rgba(123, 97, 255, 0.15)"
  enableTilt?: boolean;
}

export default function GlassContainer({
  children,
  className = "",
  id,
  glowColor = "rgba(123, 97, 255, 0.08)",
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

    // Calculate rotation (-6 to 6 degrees for subtle Dribbble-style tilt)
    const rotY = ((mouseX - width / 2) / (width / 2)) * 6;
    const rotX = -((mouseY - height / 2) / (height / 2)) * 6;

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
        perspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className={`group relative overflow-hidden rounded-[24px] border border-border-custom bg-card p-6 shadow-main hover:shadow-hover transition-all duration-300 ${className}`}
    >
      {/* Dynamic Back Ambient Glow */}
      <div
        className="absolute -inset-px -z-10 rounded-[24px] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
        style={{
          background: `radial-gradient(140px circle at ${glareX}% ${glareY}%, ${glowColor}, transparent)`,
        }}
      />

      {/* Dynamic light reflex halo overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-tr from-transparent via-white/10 to-transparent transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.4 : 0,
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(123, 97, 255, 0.08) 0%, transparent 60%)`,
        }}
      />

      {/* Main 3D Container Wrapper */}
      <div
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`
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
