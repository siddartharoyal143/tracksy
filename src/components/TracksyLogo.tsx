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
  animated = false,
  className = "",
}) => {
  const logoWidth = {
    sm: 110,
    md: 170,
    lg: 250,
    xl: 340,
  }[size];

  const logo = (
    <img
      src={tracksyLogo}
      alt="Tracksy Logo"
      className="object-contain select-none"
      style={{
        width: `${logoWidth}px`,
        height: "auto",
      }}
      draggable={false}
    />
  );

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {animated ? (
        <motion.div
          animate={{
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {logo}
        </motion.div>
      ) : (
        logo
      )}
    </div>
  );
};

export default TracksyLogo;
