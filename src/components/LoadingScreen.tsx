import React from 'react';
import { motion } from 'motion/react';
import { TracksyLogo } from './TracksyLogo';

interface LoadingScreenProps {
  message?: string;
  onFinish?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Initializing Tracksy AI Engine...',
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#e0eafc] via-[#ece9e6] to-[#fbc2eb] p-6">
      {/* Background ambient glow circles */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-300/30 rounded-full blur-3xl animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center bg-white/70 backdrop-blur-xl border border-white/80 p-10 rounded-3xl shadow-2xl max-w-sm w-full text-center"
      >
        {/* Animated Brand Logo */}
        <TracksyLogo size="xl" showText showTagline animated className="mb-8 flex-col text-center" />

        {/* Loading Spinner / Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-4 shadow-inner border border-slate-200/60">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: ['0%', '45%', '85%', '100%'] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm font-medium text-slate-600"
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
};
