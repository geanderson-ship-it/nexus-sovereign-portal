import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Fornece a configuração de servidores ICE (STUN/TURN) para o cliente WebRTC.
 *
 * As credenciais do TURN NUNCA devem ficar hard-coded no frontend nem em
 * variáveis NEXT_PUBLIC_* (que são embutidas no bundle enviado ao navegador).
 * Aqui elas são lidas de variáveis de ambiente somente-servidor e entregues
 * sob demanda. Idealmente, use credenciais TURN de curta duração (TURN REST
 * API / time-limited credentials) para reduzir o impacto de um vazamento.
 */
export async function GET() {
  const turnUrls = (process.env.TURN_URLS ||
    'turn:52.90.49.196:3478,turn:52.90.49.196:3478?transport=tcp')
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean);

  const turnUser = process.env.TURN_USERNAME;
  const turnCredential = process.env.TURN_CREDENTIAL;

  const iceServers: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ];

  // Só adiciona o TURN se as credenciais estiverem configuradas no servidor.
  if (turnUser && turnCredential) {
    iceServers.push({
      urls: turnUrls,
      username: turnUser,
      credential: turnCredential,
    });
  } else {
    console.warn(
      '[Vision ICE] TURN_USERNAME/TURN_CREDENTIAL não configurados. ' +
        'A sala funcionará apenas com STUN (pode falhar atrás de firewalls corporativos).'
    );
  }

  return NextResponse.json(
    { iceServers },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}
