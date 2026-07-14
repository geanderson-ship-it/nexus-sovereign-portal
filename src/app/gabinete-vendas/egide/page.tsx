'use client';

import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, Lock, ArrowLeft, Activity, Camera, Car, MapPin, AlertCircle, Crosshair, Siren } from 'lucide-react';
import Link from 'next/link';

export default function EgidePage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const isVendasAuth = localStorage.getItem('vendas_auth') === 'true';
    if (!isVendasAuth) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#080b10] flex flex-col items-center justify-center text-rose-500">
        <Lock className="w-12 h-12 mb-4 animate-pulse text-rose-500/50" />
        <h2 className="text-xl font-headline tracking-widest text-rose-500/50 uppercase">Verificando Credenciais Táticas</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-200 pt-32 pb-20 px-4 relative overflow-hidden">
      
      {/* BACKGROUND IMAGE & EFFECTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#02050a]" />
        {/* Grade tática tipo radar */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-30" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] border border-blue-500/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] border border-blue-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 animate-[spin_60s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] border border-blue-500/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-x-1/2 -translate-y-1/2 animate-[spin_10s_linear_infinite]" />
        
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 border-b border-blue-900/30 pb-8">
          <div className="flex items-center gap-4">
            <Link href="/gabinete-vendas" className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-950/30 hover:border-blue-500/50 transition-all group cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.05)]">
              <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-headline text-white flex items-center gap-3">
                <Crosshair className="w-8 h-8 text-rose-500" />
                Nexus Égide (LPR)
              </h1>
              <p className="text-blue-400/70 font-mono text-sm mt-1 uppercase tracking-wider">Centro de Comando & Controle Integrado</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-rose-950/30 border border-rose-900/50 px-4 py-2 rounded-lg backdrop-blur-sm">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-400">Ao Vivo</span>
            </div>
          </div>
        </div>

        {/* TOP METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/60 border-slate-800/60 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-400">Câmeras Ativas (LPR)</p>
                <Camera className="w-5 h-5 text-blue-500/70" />
              </div>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold text-white font-mono">142</h3>
                <span className="text-xs text-blue-400 mb-1 font-bold">100% On</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/60 border-slate-800/60 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-400">Leituras Hoje</p>
                <Car className="w-5 h-5 text-teal-400/70" />
              </div>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold text-white font-mono">84.591</h3>
                <span className="text-xs text-teal-400 mb-1 font-bold">+12% vol</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-rose-900/50 backdrop-blur-md shadow-[0_0_30px_rgba(225,29,72,0.1)] relative overflow-hidden">
            <div className="absolute inset-0 bg-rose-500/10 animate-pulse" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-rose-200">Alertas SINESP / Roubo</p>
                <AlertCircle className="w-5 h-5 text-rose-500" />
              </div>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold text-rose-400 font-mono">03</h3>
                <span className="text-xs text-rose-500 mb-1 font-bold uppercase">Ação Imediata</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800/60 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-400">Status Dante's Safe</p>
                <Shield className="w-5 h-5 text-indigo-400/70" />
              </div>
              <div className="flex items-end gap-2">
                <h3 className="text-xl font-bold text-indigo-400 uppercase tracking-widest mt-1">Normal</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* MAIN RADAR PANEL (MAP SIMULATION) */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl shadow-2xl overflow-hidden">
              <CardHeader className="border-b border-slate-800/50 pb-4 bg-slate-950/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white font-headline flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    Cerco Georreferenciado
                  </CardTitle>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-mono text-slate-400">GPS Lock</span>
                    <span className="px-2 py-1 bg-blue-900/50 text-blue-400 rounded text-[10px] font-mono border border-blue-800/50">Satelite View</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Fake Map Area */}
                <div className="h-[400px] w-full bg-[#0a1120] relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }} />
                  
                  {/* Ponto Seguro */}
                  <div className="absolute top-1/4 left-1/4 flex flex-col items-center">
                    <div className="w-4 h-4 bg-teal-500 rounded-full border-2 border-slate-900 shadow-[0_0_15px_rgba(20,184,166,0.8)] animate-pulse" />
                    <span className="text-[10px] font-mono text-teal-400 mt-1 bg-slate-900/80 px-1 rounded">Cam-04 (Leste)</span>
                  </div>

                  {/* Ponto Seguro 2 */}
                  <div className="absolute bottom-1/3 right-1/4 flex flex-col items-center">
                    <div className="w-4 h-4 bg-teal-500 rounded-full border-2 border-slate-900 shadow-[0_0_15px_rgba(20,184,166,0.8)] animate-pulse" />
                    <span className="text-[10px] font-mono text-teal-400 mt-1 bg-slate-900/80 px-1 rounded">Cam-12 (Sul)</span>
                  </div>

                  {/* PONTO DE ALERTA (Roubo) */}
                  <div className="absolute top-1/2 left-1/2 flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-75" />
                      <div className="w-6 h-6 bg-rose-500 rounded-full border-2 border-white shadow-[0_0_30px_rgba(225,29,72,1)] flex items-center justify-center relative z-10">
                        <Crosshair className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="mt-2 bg-rose-950/90 border border-rose-500/50 p-2 rounded-lg backdrop-blur-md text-center shadow-2xl">
                      <p className="text-xs font-bold text-white uppercase tracking-wider mb-1">Interceptação Sugerida</p>
                      <p className="text-[10px] text-rose-200 font-mono">Veículo: HONDA CIVIC PRATA</p>
                      <p className="text-[10px] text-rose-200 font-mono">Placa: IXO-9A21</p>
                      <div className="mt-2 text-[8px] bg-rose-500 text-white py-0.5 px-2 rounded uppercase font-bold animate-pulse">
                        Alerta SINESP - Roubo/Furto
                      </div>
                    </div>
                  </div>
                  
                  {/* Radar Sweep Line */}
                  <div className="absolute top-1/2 left-1/2 w-[600px] h-1 bg-gradient-to-r from-blue-500/50 to-transparent -translate-y-1/2 origin-left animate-[spin_4s_linear_infinite] pointer-events-none" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
              <CardHeader className="border-b border-slate-800/50 pb-4">
                <CardTitle className="text-lg text-white font-headline flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-400" />
                  Feed LPR Viso-Analítico (Fotos retidas por 90 dias)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-800/50">
                  {[
                    { id: '14:22:05', plate: 'IXO-9A21', desc: 'HONDA CIVIC PRATA', status: 'SINESP/ROUBO', cam: 'Cam-08 Centro' },
                    { id: '14:21:40', plate: 'JJA-1B22', desc: 'TOYOTA COROLLA PRETO', status: 'OK', cam: 'Cam-12 Sul' },
                    { id: '14:21:12', plate: 'PXV-3411', desc: 'FIAT UNO BRANCO', status: 'OK', cam: 'Cam-04 Leste' },
                    { id: '14:20:55', plate: 'QWE-9988', desc: 'VW GOL PRATA', status: 'OK', cam: 'Cam-01 Norte' },
                  ].map((item, idx) => (
                    <div key={idx} className={`p-3 flex items-center justify-between transition-colors ${
                      item.status !== 'OK' ? 'bg-rose-950/20 hover:bg-rose-900/30 border-l-2 border-rose-500' : 'hover:bg-slate-800/20'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-8 bg-white rounded border border-slate-300 flex items-center justify-center">
                          <span className="text-black font-black font-mono tracking-widest text-xs">{item.plate}</span>
                        </div>
                        <div>
                          <p className={`font-bold font-mono text-xs ${item.status !== 'OK' ? 'text-rose-400' : 'text-slate-300'}`}>
                            {item.desc}
                          </p>
                          <p className="text-[10px] text-slate-500">{item.cam}</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <p className="font-mono text-xs text-slate-400">{item.id}</p>
                        <p className={`text-[9px] font-bold uppercase mt-0.5 px-1.5 py-0.5 rounded inline-block ${
                          item.status !== 'OK' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.status}
                        </p>
                        <div className="mt-1 flex items-center gap-1 text-[8px] text-blue-400 bg-blue-900/30 px-1 py-0.5 rounded border border-blue-500/30">
                          <Camera className="w-2 h-2" />
                          <span>FOTO ARQUIVADA (90D)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDEBAR PANEL */}
          <div className="space-y-6">
            <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
              <CardHeader className="pb-2 border-b border-slate-800/50">
                <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Despacho Tático
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  
                  {tacticalStatus === 'alert' && (
                    <div className="bg-rose-950/40 rounded-lg p-4 border border-rose-500/30">
                      <div className="flex items-start gap-3">
                        <Siren className="w-5 h-5 text-rose-500 mt-0.5 animate-pulse" />
                        <div>
                          <h4 className="text-rose-400 font-bold text-sm">Alerta Disparado</h4>
                          <p className="text-xs text-rose-200 mt-1 leading-relaxed">
                            Veículo com restrição de roubo detectado na Cam-08. Deslocamento sugerido da viatura VTR-44 (a 800m do local).
                          </p>
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <button onClick={() => setTacticalStatus('dispatched')} className="py-2 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider rounded transition-colors">
                              Acionar VTR
                            </button>
                            <button onClick={() => setTacticalStatus('ignored')} className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded transition-colors">
                              Ignorar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {tacticalStatus === 'dispatched' && (
                    <div className="bg-teal-950/40 rounded-lg p-4 border border-teal-500/30 animate-in fade-in zoom-in duration-300">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-teal-500 mt-0.5" />
                        <div>
                          <h4 className="text-teal-400 font-bold text-sm">VTR em Deslocamento</h4>
                          <p className="text-xs text-teal-200 mt-1 leading-relaxed">
                            Viatura VTR-44 a caminho da Cam-08. ETA: 2 min. Rastreio LPR contínuo engajado.
                          </p>
                          <button onClick={() => setTacticalStatus('alert')} className="mt-3 w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded transition-colors">
                            Resetar Simulação
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {tacticalStatus === 'ignored' && (
                    <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 text-center animate-in fade-in duration-300">
                      <h4 className="text-slate-400 font-bold text-sm">Alerta Ignorado</h4>
                      <p className="text-xs text-slate-500 mt-1">Ocorrência arquivada no log tático.</p>
                      <button onClick={() => setTacticalStatus('alert')} className="mt-3 py-1.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded transition-colors">
                        Restaurar
                      </button>
                    </div>
                  )}

                  <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-white">Reconhecimento Facial (Aegis)</span>
                      <span className="text-[10px] text-teal-400 bg-teal-500/10 px-1.5 rounded font-mono">Ativo</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mb-2">Monitorando aglomerações e mandados de prisão na Praça Central.</p>
                    <div className="w-full bg-slate-800 rounded-full h-1">
                      <div className="bg-teal-400 h-1 rounded-full animate-[pulse_2s_infinite]" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-950/20 border-blue-900/50 backdrop-blur-xl">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="text-white font-bold mb-2">Demonstração de Escudo</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Esta é uma interface de simulação do Cerco Tático Inteligente para apresentações em CCOs e prefeituras.
                </p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
