'use client';

import React, { useState } from 'react';
import { DanteSafraAxisIntro } from '@/components/dante-safra-axis-intro';
import { DanteSafraAxisChat } from '@/components/dante-safra-axis-chat';
import { motion, AnimatePresence } from 'framer-motion';

export default function DanteSafraAxisPage() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="h-screen w-full bg-black flex flex-col overflow-hidden">
      
      <AnimatePresence mode="wait">
        {!showChat ? (
          <DanteSafraAxisIntro 
            key="intro" 
            onComplete={() => setShowChat(true)} 
          />
        ) : (
          <motion.div 
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex-1 h-full p-4 md:p-8"
          >
             <DanteSafraAxisChat />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
