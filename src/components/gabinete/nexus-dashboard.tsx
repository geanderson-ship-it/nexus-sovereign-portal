'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Activity, Globe, TrendingUp, Eye, MousePointer2 } from 'lucide-react';

interface DashboardData {
  realtime: { activeUsers: number; last30Minutes: { minute: string; users: number }[] };
  topPages: { path: string; title: string; views: number }[];
  countries: { name: string; value: number }[];
  weeklyTraffic: { day: string; users: number }[];
  overallGrowth: number;
  todayEvents: number;
  weekEvents: number;
  totalEvents: number;
}

export function NexusDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch$ = async () => {
      try {
        const res = await fetch('/api/analytics');
        setData(await res.json());
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    };
    fetch$();
    const interval = setInterval(fetch$, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {[1,2,3,4].map(i => <Card key={i} className="h-28 animate-pulse bg-zinc-900/50 border-white/5" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-500/30">
          <Activity className="h-6 w-6 text-blue-400 animate-pulse" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white tracking-widest uppercase font-headline">Nexus Intelligence</h3>
          <p className="text-xs text-blue-400 font-mono tracking-widest uppercase">Dashboard de Monitoramento — AWS</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-950/60 border-blue-500/20">
          <CardContent className="p-4 flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Ativos agora</span>
            <span className="text-3xl font-black text-blue-400">{data.realtime.activeUsers}</span>
            <Users className="h-4 w-4 text-blue-400/50" />
          </CardContent>
        </Card>
        <Card className="bg-zinc-950/60 border-emerald-500/20">
          <CardContent className="p-4 flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Eventos hoje</span>
            <span className="text-3xl font-black text-emerald-400">{data.todayEvents}</span>
            <MousePointer2 className="h-4 w-4 text-emerald-400/50" />
          </CardContent>
        </Card>
        <Card className="bg-zinc-950/60 border-purple-500/20">
          <CardContent className="p-4 flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Esta semana</span>
            <span className="text-3xl font-black text-purple-400">{data.weekEvents}</span>
            <TrendingUp className="h-4 w-4 text-purple-400/50" />
          </CardContent>
        </Card>
        <Card className="bg-zinc-950/60 border-amber-500/20">
          <CardContent className="p-4 flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total registrado</span>
            <span className="text-3xl font-black text-amber-400">{data.totalEvents}</span>
            <Eye className="h-4 w-4 text-amber-400/50" />
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Atividade últimos 30min */}
        <Card className="bg-zinc-950/40 border-white/5">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-400" /> Atividade — Últimos 30 min
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.realtime.last30Minutes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="minute" stroke="#888" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#888" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3, fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tráfego semanal */}
        <Card className="bg-zinc-950/40 border-white/5">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" /> Tráfego — Últimos 7 dias
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.weeklyTraffic}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="day" stroke="#888" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#888" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="users" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Páginas mais visitadas */}
      <Card className="bg-zinc-950/40 border-white/5">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Globe className="h-4 w-4 text-purple-400" /> Páginas mais visitadas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-white/5">
            {data.topPages.map((page, i) => (
              <div key={page.path} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-gray-500">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white capitalize">{page.title}</p>
                    <p className="text-[10px] text-gray-500 font-mono">{page.path}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-white">{page.views}</p>
                  <p className="text-[8px] text-emerald-400 uppercase tracking-widest">views</p>
                </div>
              </div>
            ))}
            {data.topPages.length === 0 && (
              <p className="text-center text-gray-500 text-sm py-8">Nenhum dado ainda. Navegue pelo site para gerar métricas.</p>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
