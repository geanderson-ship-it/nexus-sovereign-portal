'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { 
    Users, 
    Activity, 
    Globe, 
    Smartphone, 
    Monitor, 
    Tablet, 
    TrendingUp, 
    MousePointer2,
    Clock,
    Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/hooks/use-locale';

interface AnalyticsData {
  realtime: {
    activeUsers: number;
    last30Minutes: { minute: string; users: number }[];
  };
  topPages: { path: string; title: string; views: number }[];
  devices: { name: string; value: number }[];
  countries: { name: string; value: number; growth: number }[];
  trafficSource: { name: string; value: number }[];
  weeklyTraffic: { day: string; users: number }[];
  overallGrowth: number;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

export function AnalyticsDashboard() {
  const { t } = useLocale();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to translate labels from the mock API
  const translateLabel = (label: string) => {
    const lowerLabel = label.toLowerCase();
    
    // Devices
    if (lowerLabel === 'mobile') return t('analytics.data.mobile');
    if (lowerLabel === 'desktop') return t('analytics.data.desktop');
    if (lowerLabel === 'tablet') return t('analytics.data.tablet');

    // Countries
    if (lowerLabel === 'brasil') return t('analytics.data.brazil');
    if (lowerLabel === 'frança') return t('analytics.data.france');
    if (lowerLabel === 'eua') return t('analytics.data.usa');
    if (lowerLabel === 'portugal') return t('analytics.data.portugal');
    if (lowerLabel === 'outros') return t('analytics.data.others');

    // Traffic Sources
    if (lowerLabel === 'direto') return t('analytics.data.direct');
    if (lowerLabel === 'orgânico (google)') return t('analytics.data.organic');
    if (lowerLabel === 'redes sociais') return t('analytics.data.social');
    if (lowerLabel === 'referência') return t('analytics.data.referral');

    // Days (if used)
    const days: Record<string, string> = {
      'seg': 'mon', 'ter': 'tue', 'qua': 'wed', 'qui': 'thu', 'sex': 'fri', 'sáb': 'sat', 'dom': 'sun'
    };
    if (days[lowerLabel]) return t(`analytics.data.${days[lowerLabel]}`);

    // Time indicators
    if (lowerLabel === 'agora') return t('analytics.data.now');

    return label;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics');
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-zinc-900/50 border-white/5 h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-500/30">
                  <Activity className="h-6 w-6 text-blue-400 animate-pulse" />
              </div>
              <div>
                  <h3 className="text-2xl font-black text-white tracking-widest uppercase font-headline">{t('analytics.title')}</h3>
                  <p className="text-xs text-blue-400 font-mono tracking-widest uppercase">{t('analytics.subtitle')}</p>
              </div>
          </div>
          <div className="flex items-center gap-6 bg-zinc-950/80 p-4 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-col items-end">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t('analytics.growth')}</span>
                  <span className="text-3xl font-black text-blue-400 flex items-center gap-1">
                      <TrendingUp className="h-5 w-5 text-blue-400" />
                      +{data.overallGrowth}%
                  </span>
              </div>
              <div className="h-10 w-[2px] bg-white/10" />
              <div className="flex flex-col items-end">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t('analytics.activeUsers')}</span>
                  <span className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">{data.realtime.activeUsers}</span>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Traffic Chart */}
        <Card className="lg:col-span-2 bg-zinc-950/40 border-white/5 backdrop-blur-xl shadow-2xl overflow-hidden group">
          <CardHeader className="border-b border-white/5 bg-white/5">
            <CardTitle className="text-sm font-bold uppercase tracking-[0.3em] flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-400" />
              {t('analytics.activityFlow')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.realtime.last30Minutes}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis 
                    dataKey="minute" 
                    stroke="#888" 
                    fontSize={10} 
                    axisLine={false} 
                    tickLine={false}
                    tickFormatter={(tick) => translateLabel(tick)}
                  />
                  <YAxis 
                    stroke="#888" 
                    fontSize={10} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff', borderRadius: '12px', fontSize: '12px' }} 
                    labelFormatter={(label) => translateLabel(label)}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 4, fill: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Device Distribution */}
        <Card className="bg-zinc-950/40 border-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-white/5 bg-white/5">
            <CardTitle className="text-sm font-bold uppercase tracking-[0.3em] flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-purple-400" />
              {t('analytics.devices')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.devices}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {data.devices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff', borderRadius: '12px' }}
                    formatter={(value, name: string) => [value, translateLabel(name)]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full mt-4">
                {data.devices.map((device, i) => (
                    <div key={device.name} className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                        <span className="text-[10px] font-bold text-gray-500 uppercase mb-1">{translateLabel(device.name)}</span>
                        <span className="font-black text-sm text-white">{device.value}%</span>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Top Pages Table */}
          <Card className="lg:col-span-2 bg-zinc-950/40 border-white/5 backdrop-blur-xl shadow-2xl">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-sm font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                  <MousePointer2 className="h-4 w-4 text-emerald-400" />
                  {t('analytics.topPages')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                  <div className="divide-y divide-white/5">
                      {data.topPages.map((page, i) => (
                          <div key={page.path} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group">
                              <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-black text-gray-500 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all">
                                      0{i+1}
                                  </div>
                                  <div className="flex flex-col">
                                      <span className="text-xs font-bold text-white uppercase tracking-tighter">{page.title}</span>
                                      <span className="text-[10px] text-gray-500 font-mono italic">{page.path}</span>
                                  </div>
                              </div>
                              <div className="flex items-center gap-3">
                                  <div className="flex flex-col items-end">
                                      <span className="text-sm font-black text-white">{page.views.toLocaleString()}</span>
                                      <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest">{t('analytics.views')}</span>
                                  </div>
                                  <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                          </div>
                      ))}
                  </div>
              </CardContent>
          </Card>

          {/* Traffic Source / Mini Summary */}
          <div className="space-y-6">
              <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                      <Zap className="h-16 w-16 text-white" />
                  </div>
                  <CardHeader>
                      <CardTitle className="text-xs font-bold uppercase tracking-widest text-blue-300">{t('analytics.globalPresence')}</CardTitle>
                      <CardDescription className="text-white/60 text-xs">{t('analytics.territoryDistribution')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      {data.countries.map((country, i) => (
                          <div key={country.name} className="flex items-center justify-between">
                              <div className="flex flex-col">
                                  <span className="text-xs font-bold text-white uppercase">{translateLabel(country.name)}</span>
                                  <div className="h-1 w-24 bg-white/10 rounded-full mt-1 overflow-hidden">
                                      <motion.div 
                                          initial={{ width: 0 }}
                                          animate={{ width: `${country.value * 2}%` }}
                                          className="h-full bg-blue-500"
                                      />
                                  </div>
                              </div>
                              <div className="flex flex-col items-end">
                                  <span className="text-sm font-black text-white">{country.value}%</span>
                                  <span className="text-[8px] text-emerald-400 font-bold">+{country.growth}% {t('analytics.growthLabel')}</span>
                              </div>
                          </div>
                      ))}
                  </CardContent>
              </Card>

              <Card className="bg-zinc-950/40 border-white/5 backdrop-blur-xl shadow-2xl overflow-hidden h-full">
                  <CardHeader className="border-b border-white/5">
                    <CardTitle className="text-sm font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-400" />
                      {t('analytics.trafficSources')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                      {data.trafficSource.map((source, i) => (
                          <div key={source.name} className="space-y-1">
                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                  <span className="text-gray-400">{translateLabel(source.name)}</span>
                                  <span className="text-white">{source.value} {t('analytics.hits')}</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                  <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(source.value / 1000) * 100}%` }}
                                      transition={{ duration: 1.5, delay: i * 0.1 }}
                                      className="h-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-[0_0_5px_rgba(59,130,246,0.5)]" 
                                  />
                              </div>
                          </div>
                      ))}
                  </CardContent>
              </Card>
          </div>
      </div>
    </div>
  );
}
