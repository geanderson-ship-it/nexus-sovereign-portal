'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TacticalPulseProps {
  isSpeaking?: boolean;
  isThinking?: boolean;
  className?: string;
}

export function TacticalPulse({ isSpeaking, isThinking, className }: TacticalPulseProps) {
  return (
    <div className={cn("relative flex items-center justify-center w-32 h-32", className)}>
      
      {/* Background Radar Rings */}
      {[0.4, 0.7, 1].map((scale, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 border border-emerald-500/20 rounded-full"
          animate={{
            scale: isSpeaking ? [scale, scale * 1.1, scale] : scale,
            opacity: isThinking ? [0.1, 0.3, 0.1] : 0.2,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Core Pulse */}
      <motion.div
        className="relative w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center overflow-hidden"
        animate={{
          boxShadow: isSpeaking 
            ? ["0 0 20px rgba(16,185,129,0.2)", "0 0 50px rgba(16,185,129,0.5)", "0 0 20px rgba(16,185,129,0.2)"] 
            : "0 0 20px rgba(16,185,129,0.2)",
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {/* Internal Scanline/Wave */}
        <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent h-1/2 w-full"
            animate={{ top: ["-50%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Central Core Dot */}
        <motion.div 
          className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]"
          animate={{
            scale: isSpeaking ? [1, 1.5, 1] : 1,
            opacity: isThinking ? [0.5, 1, 0.5] : 1,
          }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      </motion.div>

      {/* Axis Crosshair Elements */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-emerald-500/40" />
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-emerald-500/40" />
         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-emerald-500/40" />
         <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-emerald-500/40" />
      </div>

       {/* HUD Lat-Long Micro-text (Simulated) */}
       <div className="absolute -bottom-6 flex flex-col items-center">
          <span className="text-[8px] font-mono text-emerald-800 tracking-widest uppercase">
            {isThinking ? "PROCES_DANTE_AXIS" : "AXIS_STANDBY"}
          </span>
          <span className="text-[6px] font-mono text-emerald-900 mt-1">
            43.1209° N | 77.6321° W
          </span>
       </div>

    </div>
  );
}
