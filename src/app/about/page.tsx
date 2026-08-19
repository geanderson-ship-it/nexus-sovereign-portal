
'use client';

import { Heart, Zap, Rocket, Target, ShieldCheck, Scale, Handshake, BrainCircuit, PlayCircle, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import placeholderImages from '@/lib/placeholder-images.json';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/hooks/use-locale';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getVideoUrl } from '@/lib/video-helper';

export default function AboutPage() {
  const { t } = useLocale();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const alicercePillars = [
      { icon: Handshake, title: "Respeito", text: "Respeitamos a história, a privacidade e o tempo de cada parceiro, desenvolvendo soluções 100% focadas na segurança do seu negócio." },
      { icon: Scale, title: "Ética", text: "Operamos com transparência e integridade em cada linha de código, garantindo conformidade legal e rigor moral." },
      { icon: ShieldCheck, title: "Confiança", text: "Construímos infraestruturas digitais sólidas e seguras para proteger o capital intelectual e os dados da sua empresa." },
      { icon: Heart, title: "Humanidade", text: "A tecnologia existe para servir e potencializar as pessoas. Desenvolvemos sistemas onde o ser humano mantém a decisão final." },
  ];

  const impulsoPillars = [
      { icon: Handshake, title: "Parceria de Resultados", text: "Crescemos junto com você. Nosso objetivo é aumentar a eficiência, o lucro e a autonomia dos nossos parceiros." },
      { icon: Rocket, title: "Inovação Prática", text: "Desenvolvemos e aplicamos as tecnologias que colocam e mantêm a sua empresa à frente da concorrência." },
  ];
  
  return (
    <div className="relative min-h-screen">

      {/* BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/nexus-tech-world-bg.png"
          alt="Nexus Sobre Background"
          fill
          priority
          className="object-cover opacity-35"
          style={{ objectPosition: 'center center' }}
        />
        {/* Dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080b10]/20 via-[#080b10]/80 to-[#080b10]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 container mx-auto py-12 md:py-20">
      <div className="text-center mt-12 mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-headline tracking-tighter text-primary">
          A HOLDING
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-xl md:text-2xl text-foreground font-semibold">
          Tecnologia Prática, Inovação e Inteligência Artificial para o Seu Negócio
        </p>
         <p className="mx-auto mt-4 max-w-4xl text-lg text-muted-foreground leading-relaxed">
          Desenvolvemos sistemas modernos, automação de processos e ferramentas de IA seguras para impulsionar o crescimento de empresas e instituições de forma rápida e protegida.
        </p>
      </div>

      <div className="my-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-headline text-foreground tracking-tighter uppercase drop-shadow-md">
            Liderança & Conselho Autônomo
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            A visão estratégica humana unida à alta precisão dos nossos especialistas e assistentes de Inteligência Artificial.
          </p>
        </div>

        {/* NÍVEL 1: DIRETORIA EXECUTIVA HUMANA */}
        <div className="mb-12 flex flex-col items-center">
          <h3 className="text-2xl font-bold text-primary mb-10 tracking-widest uppercase">Diretoria Executiva (Humanos)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">
            {/* Geanderson */}
            <div className="group relative flex flex-col items-center p-8 bg-black/40 border border-primary/30 rounded-3xl backdrop-blur-xl shadow-[0_0_40px_rgba(37,99,235,0.1)] transition-all hover:border-primary hover:shadow-[0_0_60px_rgba(37,99,235,0.3)]">
              <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6 rounded-2xl overflow-hidden border-2 border-primary/50">
                <div className="absolute inset-0 bg-blue-900/20 z-10 mix-blend-overlay"></div>
                <Image src="/Sobre/gean_diretor.png" alt="Geanderson" fill className="object-cover" />
              </div>
              <h4 className="text-3xl font-bold text-foreground font-headline uppercase text-center">Geanderson</h4>
              <p className="text-primary font-semibold text-lg uppercase tracking-wide mt-2 text-center">Diretor Geral (CEO) & Fundador</p>
              <p className="text-muted-foreground text-center mt-4 text-base leading-relaxed">
                Fundador e Diretor Geral da Nexus Holding Group. Lidera o desenvolvimento estratégico de soluções tecnológicas de ponta e sistemas de inteligência artificial sob medida para impulsionar empresas e governos.
              </p>
            </div>
            
            {/* Ivoni */}
            <div className="group relative flex flex-col items-center p-8 bg-black/40 border border-primary/30 rounded-3xl backdrop-blur-xl shadow-[0_0_40px_rgba(37,99,235,0.1)] transition-all hover:border-primary hover:shadow-[0_0_60px_rgba(37,99,235,0.3)]">
              <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6 rounded-2xl overflow-hidden border-2 border-primary/50">
                <div className="absolute inset-0 bg-blue-900/20 z-10 mix-blend-overlay"></div>
                <Image src="/Sobre/ivoni_nova.jpg" alt="Ivoni Schuh" fill className="object-cover" />
              </div>
              <h4 className="text-3xl font-bold text-foreground font-headline uppercase text-center">Ivoni</h4>
              <p className="text-primary font-semibold text-lg uppercase tracking-wide mt-2 text-center">Diretora Executiva (COO)</p>
              <p className="text-muted-foreground text-center mt-4 text-base leading-relaxed">
                Diretora Executiva da Nexus. Lidera a gestão operacional da Holding, garantindo que cada projeto e estratégia se traduzam em resultados práticos, eficientes e mensuráveis para nossos clientes.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center mb-10">
           <div className="w-1 h-20 bg-gradient-to-b from-primary to-transparent opacity-50"></div>
        </div>

        {/* NÍVEL 2: INTELIGÊNCIA ARTIFICIAL EXCLUSIVA */}
        <div className="flex flex-col items-center mb-12">
          <h3 className="text-xl font-bold text-blue-400 mb-8 tracking-widest uppercase text-center">Inteligência Artificial Exclusiva</h3>
          <div className="w-full max-w-4xl px-4">
            {/* Atena */}
            <div onClick={() => setActiveVideo(getVideoUrl('https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Premium/Atena.mp4', 'Atena - Video.mp4'))} className="flex flex-col items-center p-8 bg-blue-950/20 border border-blue-500/30 rounded-3xl hover:border-blue-400/60 hover:bg-blue-950/30 transition-all shadow-[0_0_40px_rgba(37,99,235,0.15)] relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-500/10 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="relative w-72 h-72 md:w-[400px] md:h-[400px] mb-8 rounded-2xl overflow-hidden border-2 border-blue-500/50 shadow-[0_0_25px_rgba(37,99,235,0.4)]">
                <Image src="/Sobre/atena.png" alt="Atena" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <PlayCircle className="w-24 h-24 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
                </div>
              </div>
              <div className="relative z-10 text-center">
                <h4 className="text-3xl font-bold font-headline text-white uppercase tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] group-hover:text-blue-300 transition-colors">Atena</h4>
                <p className="text-sm md:text-lg text-blue-400 uppercase tracking-widest font-bold mb-4 mt-2">Arquiteta Chefe de I.A.</p>
                <p className="text-base text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">Arquiteta Chefe de Inteligência Artificial da Nexus. Nossa IA especialista em suporte estratégico, automação avançada e apoio na tomada de decisões.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Separator to indicate reporting structure */}
        <div className="flex justify-center mb-12">
           <div className="w-1 h-16 bg-gradient-to-b from-blue-500/50 to-transparent"></div>
        </div>

        {/* NÍVEL 3: CONSELHO AUTÔNOMO DE I.A. */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold text-blue-400 mb-8 tracking-widest uppercase text-center">Conselho Autônomo de I.A.</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl px-4">
            {/* Stela */}
            <Link href="/inicio" className="flex flex-col items-center text-center p-8 bg-slate-900/50 border border-slate-800 rounded-3xl hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.4)] group cursor-pointer">
              <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6 rounded-2xl overflow-hidden border-2 border-slate-700">
                <Image src="/Sobre/stela.jpg" alt="Stela" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <PlayCircle className="w-16 h-16 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-bold font-headline text-slate-200 uppercase group-hover:text-blue-400 transition-colors">Stela</h4>
                <p className="text-sm md:text-base text-blue-400 uppercase tracking-wider font-semibold mb-4 mt-2">Coordenadora Executiva</p>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">Integra a comunicação entre equipes e sistemas, garantindo fluidez, organização e agilidade em todas as unidades da Holding.</p>
              </div>
            </Link>

            {/* Dante */}
            <div onClick={() => setActiveVideo(getVideoUrl('https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Premium/Dante.mp4', 'Dante - Segurança.mp4'))} className="flex flex-col items-center text-center p-8 bg-slate-900/50 border border-slate-800 rounded-3xl hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.4)] group cursor-pointer">
              <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6 rounded-2xl overflow-hidden border-2 border-slate-700">
                <Image src="/Sobre/dante.png" alt="Dante" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <PlayCircle className="w-16 h-16 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-bold font-headline text-slate-200 uppercase group-hover:text-blue-400 transition-colors">Dante</h4>
                <p className="text-sm md:text-base text-blue-400 uppercase tracking-wider font-semibold mb-4 mt-2">Diretor de Segurança da Informação</p>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">Especialista na proteção de redes e dados, auditoria de segurança e blindagem de sistemas corporativos em nuvem.</p>
              </div>
            </div>

            {/* Djeny */}
            <div onClick={() => setActiveVideo(getVideoUrl('https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Premium/Djeny.mp4', 'Djeny - Design.mp4'))} className="flex flex-col items-center text-center p-8 bg-slate-900/50 border border-slate-800 rounded-3xl hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.4)] group cursor-pointer">
              <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6 rounded-2xl overflow-hidden border-2 border-slate-700">
                <Image src="/Sobre/djeny.png" alt="Djeny" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <PlayCircle className="w-16 h-16 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-bold font-headline text-slate-200 uppercase group-hover:text-blue-400 transition-colors">Djeny</h4>
                <p className="text-sm md:text-base text-blue-400 uppercase tracking-wider font-semibold mb-4 mt-2">Diretora de Design e Experiência</p>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">Cria interfaces visuais modernas, intuitivas e de alto impacto, garantindo elegância e facilidade de uso em todas as plataformas.</p>
              </div>
            </div>

            {/* Justine */}
            <Link href="/exclusive/pactum" className="flex flex-col items-center text-center p-8 bg-slate-900/50 border border-slate-800 rounded-3xl hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.4)] group cursor-pointer">
              <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6 rounded-2xl overflow-hidden border-2 border-slate-700">
                <Image src="/Sobre/justine.jpg" alt="Justine" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <PlayCircle className="w-16 h-16 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-bold font-headline text-slate-200 uppercase group-hover:text-blue-400 transition-colors">Justine</h4>
                <p className="text-sm md:text-base text-blue-400 uppercase tracking-wider font-semibold mb-4 mt-2">Coordenadora Jurídica</p>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">Especialista em contratos, conformidade legal (LGPD) e proteção jurídica para garantir segurança total nas operações da empresa.</p>
              </div>
            </Link>

            {/* Isadora */}
            <div onClick={() => setActiveVideo(getVideoUrl('https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Premium/Isadora.mp4', 'Isadora - Embaixadora comercial.mp4'))} className="flex flex-col items-center text-center p-8 bg-slate-900/50 border border-slate-800 rounded-3xl hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.4)] group cursor-pointer">
              <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6 rounded-2xl overflow-hidden border-2 border-slate-700">
                <Image src="/Sobre/isadora.png" alt="Isadora" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <PlayCircle className="w-16 h-16 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-bold font-headline text-slate-200 uppercase group-hover:text-blue-400 transition-colors">Isadora</h4>
                <p className="text-sm md:text-base text-blue-400 uppercase tracking-wider font-semibold mb-4 mt-2">Embaixadora Comercial</p>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">Especialista em expansão comercial e relacionamento, conectando a tecnologia Nexus a novos clientes, empresas e governos.</p>
              </div>
            </div>

            {/* Aurora */}
            <Link href="/proposito" className="flex flex-col items-center text-center p-8 bg-slate-900/50 border border-slate-800 rounded-3xl hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.4)] group cursor-pointer">
              <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6 rounded-2xl overflow-hidden border-2 border-slate-700">
                <Image src="/Sobre/aurora.png" alt="Aurora" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <PlayCircle className="w-16 h-16 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-bold font-headline text-slate-200 uppercase group-hover:text-blue-400 transition-colors">Aurora</h4>
                <p className="text-sm md:text-base text-blue-400 uppercase tracking-wider font-semibold mb-4 mt-2">Coordenadora de Projetos Sociais</p>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">Lidera nossas iniciativas de impacto social e filantropia, garantindo que a tecnologia sirva também para apoiar causas sociais.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-10 md:grid-cols-2 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center text-center">
          <ShieldCheck className="h-16 w-16 text-primary mb-2" />
          <h3 className="mt-4 text-3xl font-bold font-headline text-foreground">A Nossa Missão</h3>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Criar e entregar tecnologia avançada e inteligência artificial de forma simples, prática e segura, ajudando empresas e pessoas a alcançarem seu máximo potencial.
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <Target className="h-16 w-16 text-primary mb-2" />
          <h3 className="mt-4 text-3xl font-bold font-headline text-foreground">A Nossa Visão</h3>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Ser referência global em soluções de IA e inovação corporativa, onde a tecnologia e a liderança humana trabalham sempre em perfeita harmonia.
          </p>
        </div>
      </div>

      <section className="my-24">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tighter font-headline text-foreground">
            A Arquitetura de Valores
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-xl text-muted-foreground">
            Os princípios imutáveis que guiam todas as nossas decisões, projetos e parcerias.
          </p>
        </div>
        <div className="mt-12">
            <h3 className="text-3xl font-bold text-center text-primary mb-8">Nossos Valores</h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {alicercePillars.map((value, i) => (
                <Card key={i} className="flex flex-col text-center items-center bg-black/40 border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                    <value.icon className="h-12 w-12 text-primary drop-shadow-[0_0_10px_rgba(37,99,235,0.6)]" />
                    </div>
                    <CardTitle className="text-foreground">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{value.text}</p>
                </CardContent>
                </Card>
            ))}
            </div>
        </div>
        <div className="mt-16">
            <h3 className="text-3xl font-bold text-center text-blue-400 mb-8">Impulsos de Crescimento</h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {impulsoPillars.map((value, i) => (
                <Card key={i} className="flex flex-col text-center items-center bg-blue-900/10 border-blue-500/20 hover:border-blue-500/50 backdrop-blur-md transition-all shadow-[0_0_40px_rgba(96,165,250,0.15)]">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                    <value.icon className="h-12 w-12 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]" />
                    </div>
                    <CardTitle className="text-foreground">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{value.text}</p>
                </CardContent>
                </Card>
            ))}
            </div>
        </div>
      </section>

      {/* VIDEO MODAL */}
      {mounted && activeVideo && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4" style={{ pointerEvents: 'auto' }}>
          <div className="relative rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(37,99,235,0.5)] border border-blue-500/30 bg-black flex items-center justify-center">
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-[100] p-3 rounded-full bg-black/60 hover:bg-red-600 text-white transition-colors border border-white/20 backdrop-blur-md"
            >
              <X className="w-6 h-6" />
            </button>
            <video 
              src={activeVideo} 
              className="w-auto h-auto max-w-[95vw] max-h-[90vh] object-contain"
              autoPlay 
              controls 
              controlsList="nodownload"
            >
              Seu navegador não suporta a tag de vídeo.
            </video>
          </div>
        </div>,
        document.body
      )}

      </div>
    </div>
  );
}
