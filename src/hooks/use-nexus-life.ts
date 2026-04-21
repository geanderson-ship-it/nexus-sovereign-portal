'use client';

import { useState, useEffect, useMemo } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';

export function useNexusLife() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smooth springs for eye and head movement
  const springConfig = { stiffness: 60, damping: 20, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Transform coordinates for subtle perspective (range -20 to 20 pixels)
  const gazeX = useTransform(smoothX, [0, 1], [-15, 15]);
  const gazeY = useTransform(smoothY, [0, 1], [-10, 10]);
  
  // Transform for head tilt (rotation in degrees)
  const tiltX = useTransform(smoothY, [0, 1], [3, -3]);
  const tiltY = useTransform(smoothX, [0, 1], [-5, 5]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize position to 0-1
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Handle Blinking logic
  const [isBlinking, setIsBlinking] = useState(false);
  useEffect(() => {
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
      
      const nextBlink = Math.random() * 4000 + 2000;
      return setTimeout(blink, nextBlink);
    };
    
    const timeout = setTimeout(blink, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return {
    mouseX: smoothX,
    mouseY: smoothY,
    gazeX,
    gazeY,
    tiltX,
    tiltY,
    isBlinking
  };
}
