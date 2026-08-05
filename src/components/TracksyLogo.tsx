import React from "react";
import { motion } from "motion/react";
import tracksyLogo from "./tracksy.png";

interface TracksyLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showTagline?: boolean;
  animated?: boolean;
  className?: string;
}

export const TracksyLogo: React.FC<TracksyLogoProps> = ({
  size = "md",
  showText = false,
  showTagline = false,
  animated = false,
  className = "",
}) => {
  const logoSize = {
    sm: 120,
    md: 170,
    lg: 240,
    xl: 320,
  }[size];

  const logoGraphic = (
    <div className="relative inline-flex items-center justify-center">
      <img
        src={tracksyLogo}
        alt="Tracksy Logo"
        className="object-contain drop-shadow-lg"
        style={{
          width: logoSize,
          height: "auto",
        }}
      />
    </div>
  );

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {animated ? (
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {logoGraphic}
        </motion.div>
      ) : (
        logoGraphic
      )}

      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center text-2xl font-black leading-none tracking-tight">
            <span
              style={{
                color: "#111827",
                fontFamily: "Times New Roman, serif",
              }}
            >
              Track
            </span>

            <span
              className="ml-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent"
              style={{
                fontFamily: "Arial, sans-serif",
              }}
            >
              sy
            </span>
          </div>

          {showTagline && (
            <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              TRACK <span className="text-emerald-500">SMART.</span> SPEND{" "}
              <span className="text-purple-600">BETTER.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
