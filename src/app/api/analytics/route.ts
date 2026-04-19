import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data representing Google Analytics metrics
  // In the future, this will use the google-analytics-data library
  const analyticsData = {
    realtime: {
      activeUsers: 42,
      last30Minutes: [
        { minute: '30m', users: 12 },
        { minute: '25m', users: 18 },
        { minute: '20m', users: 25 },
        { minute: '15m', users: 32 },
        { minute: '10m', users: 38 },
        { minute: '5m', users: 45 },
        { minute: 'Agora', users: 42 },
      ]
    },
    topPages: [
      { path: '/', title: 'Accueil (Home)', views: 2840 },
      { path: '/intelligence', title: 'Nexus Intelligence', views: 2150 },
      { path: '/fr/palestras/gestao-de-conflitos', title: 'Gestion de Conflits (FR)', views: 1560 },
      { path: '/palestras', title: 'Palestras', views: 1420 },
      { path: '/intelligence/djeny-design', title: 'Djeny Design', views: 980 },
    ],
    devices: [
      { name: 'Mobile', value: 62 },
      { name: 'Desktop', value: 31 },
      { name: 'Tablet', value: 7 },
    ],
    countries: [
      { name: 'Brasil', value: 45, growth: 12 },
      { name: 'França', value: 18, growth: 45 },
      { name: 'EUA', value: 15, growth: 8 },
      { name: 'Portugal', value: 12, growth: 5 },
      { name: 'Outros', value: 10, growth: 15 },
    ],
    trafficSource: [
      { name: 'Direto', value: 520 },
      { name: 'Orgânico (Google)', value: 410 },
      { name: 'Redes Sociais', value: 290 },
      { name: 'Referência', value: 150 },
    ],
    overallGrowth: 24.5,
    weeklyTraffic: [
        { day: 'Seg', users: 1400 },
        { day: 'Ter', users: 1750 },
        { day: 'Qua', users: 2100 },
        { day: 'Qui', users: 1950 },
        { day: 'Sex', users: 2450 },
        { day: 'Sáb', users: 1600 },
        { day: 'Dom', users: 1300 },
    ]
  };

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return NextResponse.json(analyticsData);
}
