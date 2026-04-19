'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function IntelligenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 overflow-y-auto bg-black border-l border-white/5 pt-14 scrollbar-hide">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-full"
        >
          {children}
        </motion.div>
    </div>
  );
}
