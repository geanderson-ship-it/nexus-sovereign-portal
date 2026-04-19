'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Wind, Thermometer, Droplets, ArrowLeft, Map as MapIcon, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TacticalClimateOverlayProps {
  onClose: () => void;
}

export function TacticalClimateOverlay({ onClose }: TacticalClimateOverlayProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 bg-[#050807] z-50 flex flex-col border border-emerald-500/20 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.9)]"
    >
      {/* Header HUD */}
      <header className="h-16 border-b border-emerald-900/30 bg-black/60 backdrop-blur-xl px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-emerald-500 hover:bg-emerald-500/10 rounded-full" onClick={onClose}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-emerald-700 uppercase tracking-[0.3em] font-bold">MONITORAMENTO_ORBITAL</span>
            <span className="text-xs font-bold text-emerald-100 tracking-widest font-headline uppercase">SATELLITE_FEED // CANAL_77_W</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-4">
             <span className="text-[8px] font-mono text-emerald-800 uppercase tracking-tighter">COORDERNADAS_LOCAIS</span>
             <span className="text-[9px] font-mono text-emerald-400">29.6841° S, 52.1973° W</span>
          </div>
          <Button variant="ghost" size="icon" className="text-emerald-500 hover:bg-emerald-500/10 rounded-full">
            <Layers className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Map View */}
      <div className="flex-1 relative bg-[#0a0f0d] overflow-hidden group">
        {/* Tactical Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f1714_1px,transparent_1px),linear-gradient(to_bottom,#0f1714_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none opacity-20 z-10" />
        
        {/* Stylized Satellite Surface (Simulated with Gradient and Dark Tones) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_100%)] pointer-events-none" />
        <div className="absolute inset-0 mix-blend-overlay opacity-30 grayscale" style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070")', // Tactical data style
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />

        {/* Animated Cloud Layers */}
        <CloudLayer speed={20} opacity={0.3} scale={1.2} />
        <CloudLayer speed={35} opacity={0.2} scale={1.5} delay={5} />
        <CloudLayer speed={50} opacity={0.15} scale={2} delay={10} />

        {/* Region Target Indicator */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <div className="w-48 h-48 border border-emerald-500/30 rounded-full flex items-center justify-center">
            <div className="w-24 h-24 border border-emerald-500/50 rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
            </div>
          </div>
          {/* Scanning Lines */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-emerald-500/20" />
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[1px] bg-emerald-500/20" />
        </motion.div>

        {/* Bottom Telemetry Bar */}
        <aside className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20 pointer-events-none">
           <div className="flex gap-4">
              <TelemetryBox icon={<Thermometer className="h-4 w-4" />} label="TEMPERATURA" value="24.8°C" trend="UP" />
              <TelemetryBox icon={<Droplets className="h-4 w-4" />} label="UMIDADE" value="62%" trend="STABLE" />
              <TelemetryBox icon={<Wind className="h-4 w-4" />} label="VENTO" value="12km/h" trend="NW" />
           </div>
           
           <div className="bg-black/80 backdrop-blur-md border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase">FEED_AO_VIVO // SAT_VIX_4</span>
           </div>
        </aside>
      </div>
    </motion.div>
  );
}

function CloudLayer({ speed, opacity, scale, delay = 0 }: { speed: number, opacity: number, scale: number, delay?: number }) {
  return (
    <motion.div 
      initial={{ x: '-100%', opacity: 0 }}
      animate={{ x: '100%', opacity: opacity }}
      transition={{ 
        duration: speed, 
        repeat: Infinity, 
        ease: "linear",
        delay: delay
      }}
      className="absolute inset-0 pointer-events-none"
    >
      <div 
        className="w-full h-full"
        style={{ 
          background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 60%)',
          filter: 'blur(80px)',
          transform: `scale(${scale})`,
        }} 
      />
    </motion.div>
  );
}

function TelemetryBox({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend: string }) {
  return (
    <div className="bg-black/80 backdrop-blur-md border border-emerald-500/10 p-3 rounded-2xl flex flex-col gap-1 min-w-[120px]">
      <div className="flex items-center gap-2 text-emerald-700">
        {icon}
        <span className="text-[8px] font-mono font-black uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-center justify-between group-hover:scale-105 transition-transform">
        <span className="text-sm font-bold text-emerald-50 font-mono">{value}</span>
        <span className="text-[8px] font-mono text-emerald-500/50">{trend}</span>
      </div>
    </div>
  );
}
