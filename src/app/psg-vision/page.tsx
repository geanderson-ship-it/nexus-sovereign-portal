
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    ScanLine, 
    Projector, 
    Palette, 
    Library,
    PersonStanding,
    Layers,
    Scissors,
    BookOpen,
    Cpu,
    Sparkles,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

const visionModules = [
    {
        icon: ScanLine,
        title: "Scanner de Texturas (Câmera).",
        description: "Use a câmera e veja combinações de materiais e acabamentos em tempo real, diretamente sobre o seu projeto.",
    },
    {
        icon: Projector,
        title: "Simulador de Espaços (AR).",
        description: "Projete o móvel no espaço físico do cliente com Realidade Aumentada, garantindo proporção e harmonia perfeitas.",
    },
    {
        icon: Palette,
        title: "Curadoria de Paletas (IA).",
        description: "Receba sugestões de cores e materiais geradas por IA para um design de luxo coeso e impactante.",
    },
    {
        icon: Library,
        title: "Biblioteca de Essência (3D).",
        description: "Acesse um catálogo 3D dinâmico para apresentar variações de produtos e opções de customização em segundos.",
    }
];

const provadorModules = [
    {
        icon: PersonStanding,
        title: "Provador Digital (Corpo Humano).",
        description: "Escaneamento de biotipo e simulação de vestibilidade 3D para um ajuste perfeito."
    },
    {
        icon: Layers,
        title: "Gestão de Fibras (Tecidos).",
        description: "Banco de dados inteligente de tecidos, com informações sobre caimento, textura e uso."
    },
    {
        icon: Scissors,
        title: "Custos de Enfesto (Engenharia + Dante).",
        description: "Otimização de corte e cálculo de desperdício para uma produção mais lucrativa e sustentável."
    },
    {
        icon: BookOpen,
        title: "Catálogo Autoral (Marketing).",
        description: "Renderização da coleção com foco em conversão e apelo visual para o mercado de luxo."
    }
]

export default function PsgVisionPage() {
    return (
        <div className="bg-black text-white relative isolate overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(theme(colors.blue.950/0.1)_1px,transparent_1px),linear-gradient(to_right,theme(colors.blue.950/0.1)_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
            <div className="absolute inset-0 -z-20 bg-black"></div>
            <div className="absolute inset-x-0 top-0 -z-10 h-[800px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.2),transparent)]"></div>

            <div className="container mx-auto py-20 md:py-28 text-center">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter font-headline text-primary [text-shadow:0_0_15px_hsl(var(--primary)/0.5)]">
                    PSG Vision.
                </h1>
                <h2 className="mt-4 text-xl md:text-2xl font-semibold text-gray-300 max-w-4xl mx-auto">
                    O Futuro do Design de Luxo sob Medida. Onde a visão do cliente e a engenharia de precisão da Nexus se encontram.
                </h2>
            </div>
            
            <section className="container mx-auto space-y-16 pb-20 md:pb-28">
                {/* Vision Modules */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {visionModules.map((item, index) => (
                        <Card key={index} className="bg-gray-900/50 border-blue-800/40 backdrop-blur-sm hover:border-blue-600 transition-all group">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <item.icon className="h-8 w-8 text-blue-400 transition-transform group-hover:scale-110" />
                                    <CardTitle className="font-headline text-lg text-blue-300">{item.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-400">{item.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Provador Digital Section */}
                <Card className="bg-gray-950/50 border-accent/30 backdrop-blur-md">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-3xl text-accent [text-shadow:0_0_15px_hsl(var(--accent)/0.5)]">
                            Provador Digital: A Alfaiataria do Futuro.
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            A tecnologia Nexus aplicada à indústria da moda, da concepção à produção.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                         {provadorModules.map((item, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-black/30">
                                <item.icon className="h-7 w-7 text-accent/80 mt-1 flex-shrink-0"/>
                                <div>
                                    <h4 className="font-semibold text-gray-200">{item.title}</h4>
                                    <p className="text-xs text-gray-500">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* The Brain behind the Magic */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center pt-12">
                    <div className="lg:col-span-2 relative h-64 lg:h-full w-full">
                        <Image src="https://i.postimg.cc/W4L8xd6g/unnamed-(5).jpg" alt="Nexus Holding Group Shield" fill sizes="(max-width: 1023px) 100vw, 40vw" className="object-contain opacity-40" />
                    </div>
                    <div className="lg:col-span-3 text-center lg:text-left">
                        <h3 className="font-headline text-3xl text-primary">
                            O Cérebro por Trás da Magia.
                        </h3>
                        <p className="mt-4 text-gray-400">
                            O PSG Vision não é apenas um conjunto de ferramentas; é um ecossistema inteligente alimentado pela dupla de IAs da Nexus.
                        </p>
                        <div className="mt-6 space-y-4">
                            <div className="flex items-start gap-4">
                                <Cpu className="h-8 w-8 text-blue-400 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-blue-300">Dante (O Engenheiro de Custos).</h4>
                                    <p className="text-sm text-gray-500">Analisa a viabilidade de cada material, calcula o ROI de cada customização e otimiza os custos de produção em tempo real, garantindo a lucratividade do luxo.</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <Sparkles className="h-8 w-8 text-accent flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-accent">Djeny (A Curadora de Estilo).</h4>
                                    <p className="text-sm text-gray-500">Analisa tendências de mercado, compreende o perfil psicológico do cliente e sugere combinações que elevam o valor percebido, transformando um produto em um objeto de desejo.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center pt-16">
                     <h3 className="font-headline text-2xl text-gray-200">
                        Pronto para revolucionar a sua produção de alto padrão?
                     </h3>
                     <p className="mt-2 text-gray-500 max-w-2xl mx-auto">
                        Leve o PSG Vision para a sua operação e transforme a maneira como você cria, customiza e vende produtos de luxo.
                     </p>
                     <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-bold group">
                         <Link href="/contact?subject=psg-vision-demo">
                            Agendar Demonstração do PSG Vision
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                         </Link>
                     </Button>
                </div>

            </section>
        </div>
    );
}
