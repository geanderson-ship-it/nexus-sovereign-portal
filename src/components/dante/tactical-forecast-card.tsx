'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Wind, Droplets, Thermometer, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DayForecast {
  day: string;
  temp: string;
  prob: string;
  icon: React.ReactNode;
}

interface TacticalForecastCardProps {
  location: string;
  currentTemp: string;
  moisture: number;
  risk?: string;
  forecast?: DayForecast[];
  className?: string;
}

export function TacticalForecastCard({ location, currentTemp, moisture, risk = "NENHUM_ANOMALIA", forecast, className }: TacticalForecastCardProps) {
  const defaultForecast = forecast || [
    { day: 'SEG', temp: '24°', prob: '10%', icon: <CloudRain className="h-3 w-3" /> },
    { day: 'TER', temp: '26°', prob: '5%', icon: <Thermometer className="h-3 w-3" /> },
    { day: 'QUA', temp: '22°', prob: '80%', icon: <CloudRain className="h-3 w-3" /> },
  ];

  return (
    <div className={cn(
      "w-full max-w-sm bg-black/60 border border-emerald-900/30 rounded-xl p-4 backdrop-blur-xl shadow-2xl relative overflow-hidden",
      className
    )}>
      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(16,185,129,0.02),rgba(0,255,0,0.01))] bg-[length:100%_2px,2px_100%] pointer-events-none opacity-20" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex flex-col">
          <span className="text-[8px] font-mono text-emerald-800 tracking-[0.3em] uppercase">SATELLITE_LINK_A15</span>
          <span className="text-xs font-bold text-emerald-100 font-headline uppercase">{location}</span>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1.5 animate-pulse">
           <ShieldAlert className="h-2.5 w-2.5 text-emerald-400" />
           <span className="text-[8px] font-mono text-emerald-400 tracking-tighter uppercase">{risk}</span>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
         <div className="flex items-center gap-3 bg-emerald-950/20 p-2 rounded-lg border border-emerald-900/20">
            <Thermometer className="h-5 w-5 text-emerald-500" />
            <div className="flex flex-col">
               <span className="text-[8px] font-mono text-emerald-700 uppercase">TEMP_AR</span>
               <span className="text-lg font-mono font-bold text-white">{currentTemp}</span>
            </div>
         </div>
         <div className="flex items-center gap-3 bg-emerald-950/20 p-2 rounded-lg border border-emerald-900/20">
            <Droplets className="h-5 w-5 text-blue-500/50" />
            <div className="flex flex-col">
               <span className="text-[8px] font-mono text-emerald-700 uppercase">UMIDADE_SOLO</span>
               <span className="text-lg font-mono font-bold text-white">{moisture}%</span>
            </div>
         </div>
      </div>

      {/* Mini Forecast List */}
      <div className="flex justify-between relative z-10">
        {defaultForecast.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
             <span className="text-[8px] font-mono text-emerald-800">{item.day}</span>
             <div className="text-emerald-400/60">{item.icon}</div>
             <span className="text-[10px] font-bold text-emerald-100 tracking-tighter">{item.temp}</span>
             <span className="text-[8px] font-mono text-blue-500/40">{item.prob}</span>
          </div>
        ))}
      </div>

       {/* Distance Grid Overlay */}
       <div className="absolute inset-x-0 bottom-0 h-[1px] bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
    </div>
  );
}
