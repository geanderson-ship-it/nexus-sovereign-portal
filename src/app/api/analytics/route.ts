import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

const TABLE = process.env.NEXUS_ANALYTICS_TABLE || 'nexus-page-events';

const region =
  process.env.VITE_AWS_REGION ||
  process.env.NEXUS_REGION ||
  process.env.AMPLIFY_REGION ||
  'us-east-1';

const accessKeyId =
  process.env.NEXUS_ACCESS_KEY_ID ||
  process.env.AMPLIFY_ACCESS_KEY_ID ||
  process.env.AWS_ACCESS_KEY_ID ||
  '';

const secretAccessKey =
  process.env.NEXUS_SECRET_ACCESS_KEY ||
  process.env.AMPLIFY_SECRET_ACCESS_KEY ||
  process.env.AWS_SECRET_ACCESS_KEY ||
  '';

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({
  region,
  credentials: { accessKeyId, secretAccessKey },
}));

export async function POST(req: NextRequest) {
  try {
    const { page, event, device, country } = await req.json();

    await dynamo.send(new PutCommand({
      TableName: TABLE,
      Item: {
        id: randomUUID(),
        timestamp: new Date().toISOString(),
        page: page || '/',
        event: event || 'page_view',
        device: device || 'desktop',
        country: country || 'BR',
      },
    }));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}

export async function GET() {
  try {
    const { Items: events = [] } = await dynamo.send(new ScanCommand({
      TableName: TABLE,
      Limit: 1000,
    }));

    const now = Date.now();
    const last7days = events.filter(e => now - new Date(e.timestamp).getTime() < 7 * 24 * 60 * 60 * 1000);
    const last30min = events.filter(e => now - new Date(e.timestamp).getTime() < 30 * 60 * 1000);
    const today = events.filter(e => now - new Date(e.timestamp).getTime() < 24 * 60 * 60 * 1000);

    // Páginas mais visitadas
    const pageCount: Record<string, number> = {};
    last7days.forEach(e => { pageCount[e.page] = (pageCount[e.page] || 0) + 1; });
    const topPages = Object.entries(pageCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path, views]) => ({
        path,
        title: path === '/' ? 'Início' : path.replace(/\//g, ' ').replace(/-/g, ' ').trim(),
        views,
      }));

    // Dispositivos
    const deviceCount: Record<string, number> = {};
    last7days.forEach(e => { deviceCount[e.device || 'desktop'] = (deviceCount[e.device || 'desktop'] || 0) + 1; });
    const total = last7days.length || 1;
    const devices = Object.entries(deviceCount).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round((count / total) * 100),
    }));

    // Tráfego por dia (últimos 7 dias)
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const weeklyTraffic = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const count = last7days.filter(e => {
        const ed = new Date(e.timestamp);
        return ed.getDate() === d.getDate() && ed.getMonth() === d.getMonth();
      }).length;
      return { day: days[d.getDay()], users: count };
    });

    // Últimos 30 minutos em blocos de 5min
    const last30Minutes = Array.from({ length: 7 }, (_, i) => {
      const minAgo = (6 - i) * 5;
      const count = last30min.filter(e => {
        const diff = (now - new Date(e.timestamp).getTime()) / 60000;
        return diff >= minAgo && diff < minAgo + 5;
      }).length;
      return { minute: minAgo === 0 ? 'Agora' : `${minAgo}m`, users: count };
    });

    return NextResponse.json({
      realtime: { activeUsers: last30min.length, last30Minutes },
      topPages: topPages.length > 0 ? topPages : [{ path: '/', title: 'Início', views: 0 }],
      devices: devices.length > 0 ? devices : [{ name: 'Desktop', value: 100 }],
      weeklyTraffic,
      trafficSource: [{ name: 'Direto', value: today.length }],
      overallGrowth: last7days.length,
      totalEvents: events.length,
      todayEvents: today.length,
      weekEvents: last7days.length,
    });
  } catch {
    return NextResponse.json({
      realtime: { activeUsers: 0, last30Minutes: Array.from({ length: 7 }, (_, i) => ({ minute: `${(6-i)*5}m`, users: 0 })) },
      topPages: [],
      devices: [{ name: 'Desktop', value: 100 }],
      weeklyTraffic: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(day => ({ day, users: 0 })),
      trafficSource: [{ name: 'Direto', value: 0 }],
      overallGrowth: 0,
      totalEvents: 0,
      todayEvents: 0,
      weekEvents: 0,
    });
  }
}
