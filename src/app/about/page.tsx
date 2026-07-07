
'use client';

import { Heart, Zap, Rocket, Target, ShieldCheck, Scale, Handshake, BrainCircuit } from 'lucide-react';
import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/hooks/use-locale';

export default function AboutPage() {
  const { t } = useLocale();
  
  const alicercePillars = [
      { icon: Heart, title: "Visão Humana", text: "A tecnologia deve servir ao potencial humano, ampliando nossa capacidade criativa e estratégica, jamais substituindo a essência do negócio." },
      { icon: ShieldCheck, title: "Soberania de Dados", text: "Garantimos que o capital intelectual da sua empresa permaneça 100% On-Premise e sob as regras estritas do seu firewall corporativo." },
      { icon: Scale, title: "Segurança Extrema", text: "Construímos ecossistemas inquebráveis onde a infraestrutura protege as decisões mais críticas e sigilosas da sua operação." },
      { icon: BrainCircuit, title: "Algoritmos Éticos", text: "Nossas inteligências artificiais operam livres de vieses, focadas exclusivamente na matemática da eficiência, na verdade e no resultado puro." },
  ];

  const impulsoPillars = [
      { icon: Handshake, title: "Reciprocidade Evolutiva", text: "Crescemos e evoluímos na exata proporção em que escalamos os lucros, os resultados e a autonomia dos nossos parceiros de negócios." },
      { icon: Rocket, title: "Vanguarda Tecnológica", text: "Não acompanhamos as tendências. Nós moldamos e desenvolvemos as tecnologias que vão ditar as regras do mercado nas próximas décadas." },
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
          Ecossistema de Elite em Arquitetura Cibernética
        </p>
         <p className="mx-auto mt-4 max-w-4xl text-lg text-muted-foreground leading-relaxed">
          Nascemos da premissa de que a intuição corporativa não é mais suficiente para garantir a sobrevivência de um império. Projetamos tecnologias soberanas e inovação de altíssimo nível para empresas que não aceitam margem de erro.
        </p>
      </div>

      <div className="my-16 grid grid-cols-1 gap-12 lg:grid-cols-12 md:items-center">
        <div className="lg:col-span-7 flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl font-bold font-headline text-foreground">
            O Arquiteto
          </h2>
          <p className="mt-6 text-2xl md:text-3xl text-primary font-semibold italic border-l-4 border-primary pl-6">
            "A tecnologia deve se submeter à estratégia humana, não o contrário."
          </p>
           <p className="mt-8 text-xl text-muted-foreground leading-relaxed">
            Sob o comando do <strong>Diretor Geanderson</strong>, a Nexus Holding Group se consolidou como o pilar central de transformação e evolução corporativa. 
          </p>
          <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
            Sua visão não é apenas acompanhar as tendências, mas <strong className="text-primary font-bold">desenvolver a arquitetura cibernética</strong> que ditará as regras das próximas décadas. Com uma abordagem direta e sem margem para amadorismo, ele orquestra as divisões Treinamento e Intelligence com um único objetivo:
          </p>
          <p className="mt-8 text-2xl text-foreground font-bold drop-shadow-md">
            Soberania absoluta para os nossos parceiros de negócios.
          </p>
        </div>
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative h-80 w-80 md:h-[400px] md:w-[400px] overflow-hidden rounded-3xl shadow-[0_0_50px_rgba(37,99,235,0.3)] border-2 border-primary/30 bg-black/60 p-2">
            <Image
              src={placeholderImages.founder.src}
              alt="Diretor Geanderson"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="rounded-2xl"
              style={{ objectFit: 'cover', objectPosition: 'top' }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-10 md:grid-cols-2 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center text-center">
          <ShieldCheck className="h-16 w-16 text-primary mb-2" />
          <h3 className="mt-4 text-3xl font-bold font-headline text-foreground">A Nossa Missão</h3>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Fornecer a infraestrutura de inteligência definitiva para corporações de alto nível. Descomplicar a tecnologia avançada e transformá-la em lucro, eficiência e segurança extrema.
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <Target className="h-16 w-16 text-primary mb-2" />
          <h3 className="mt-4 text-3xl font-bold font-headline text-foreground">A Nossa Visão</h3>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Ser o principal ecossistema fechado de evolução empresarial e IA Soberana do mundo, onde a visão estratégica humana sempre possua a palavra final.
          </p>
        </div>
      </div>

      <section className="my-24">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tighter font-headline text-foreground">
            A Arquitetura de Valores
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-xl text-muted-foreground">
            Os princípios imutáveis que sustentam todas as nossas operações, algoritmos e parcerias estratégicas.
          </p>
        </div>
        <div className="mt-12">
            <h3 className="text-3xl font-bold text-center text-primary mb-8">Pilares Soberanos</h3>
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

      </div>
    </div>
  );
}
