'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BookOpen, Shield, TrendingUp, Zap, Bot, Sparkles, Award, Terminal, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { individualCourses } from '@/lib/courses-data';
import { useLocale } from '@/hooks/use-locale';

const CourseCard = ({ course }: { course: typeof individualCourses[number] }) => {
  const { t, tArray } = useLocale();

  // Dynamic glow styles based on course type/slug to make it look ultra-premium
  const getGlowStyles = (slug: string) => {
    switch (slug) {
      case 'relacionamento-interpessoal-iniciante':
        return {
          glow: 'border-amber-500/20 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.12)]',
          badge: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          btn: 'bg-amber-600 hover:bg-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.35)] text-white',
          accent: 'text-amber-400 font-bold',
          tagBg: 'bg-amber-500/10 border-amber-500/20 text-amber-300'
        };
      case 'relacionamento-interpessoal-intermediario':
        return {
          glow: 'border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.12)]',
          badge: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
          btn: 'bg-cyan-600 hover:bg-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.35)] text-white',
          accent: 'text-cyan-400 font-bold',
          tagBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300'
        };
      case 'preparando-equipes-intermediario':
        return {
          glow: 'border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)]',
          badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          btn: 'bg-emerald-600 hover:bg-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.35)] text-white',
          accent: 'text-emerald-400 font-bold',
          tagBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
        };
      case 'lideranca-avancado':
        return {
          glow: 'border-indigo-500/20 hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)]',
          badge: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
          btn: 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.35)] text-white',
          accent: 'text-indigo-400 font-bold',
          tagBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
        };
      default:
        return {
          glow: 'border-primary/20 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.12)]',
          badge: 'bg-primary/10 border-primary/30 text-primary',
          btn: 'bg-primary hover:bg-primary/80',
          accent: 'text-primary font-bold',
          tagBg: 'bg-primary/10 border-primary/20 text-primary'
        };
    }
  };

  const styles = getGlowStyles(course.slug);

  return (
    <Card key={course.title} className={cn("group relative flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-2 bg-neutral-950/65 backdrop-blur-md backdrop-saturate-150 border", styles.glow)}>
      {/* Decorative gradient overlay inside the card background */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none" />
      
      <div className="relative h-56 w-full overflow-hidden border-b border-white/5">
        {course.featuredLabel && (
          <div className="absolute top-4 left-4 z-20">
            <span className={cn(
              "px-3 py-1 text-[9px] font-black rounded-md shadow-2xl tracking-widest uppercase flex items-center gap-1 backdrop-blur-sm border border-white/10",
              course.isBestseller ? "bg-amber-500/90 text-black border-amber-400" : "bg-black/85 text-white"
            )}>
              {course.isBestseller ? <Sparkles className="w-3 h-3 animate-spin-slow" /> : <Award className="w-3 h-3" />}
              {t(`courses.${course.slug}.featuredLabel` as any) || course.featuredLabel}
            </span>
          </div>
        )}
        
        {/* Soft neon mask over image to integrate with card theme */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-black/10 z-10" />
        
        <Image
          src={course.image.src}
          alt={course.image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          style={{ objectPosition: 'center' }}
        />
      </div>

      <CardHeader className="relative pb-2">
        <CardTitle className="font-headline text-xl text-white group-hover:text-primary transition-colors duration-300 line-clamp-1">{t(`courses.${course.slug}.title` as any)}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <p className="text-sm text-neutral-400 line-clamp-3 leading-relaxed font-sans">{t(`courses.${course.slug}.description` as any)}</p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {tArray(`courses.${course.slug}.tags` as any).map((tag: string) => (
            <span
              key={tag}
              className={cn("rounded px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider border", styles.tagBg)}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Dynamic metadata layout (Lessons count & AI bonus status) */}
        <div className="mt-5 flex items-center justify-between text-xs text-neutral-400 border-t border-white/5 pt-3">
          <div className="flex items-center gap-1.5 font-medium">
            <BookOpen className="w-4 h-4 text-neutral-500" />
            <span>{course.lessons} {course.lessons === 1 ? 'Aula' : 'Aulas'}</span>
          </div>
          {course.hasAIBonus && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 border border-primary/25 text-[9px] text-primary font-black tracking-wider uppercase animate-pulse">
              <Bot className="w-3.5 h-3.5" />
              <span>BÔNUS IA</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
         <Button asChild className={cn("w-full transition-all duration-300 font-headline uppercase tracking-wider text-xs font-bold py-5 border-none", styles.btn)}>
            <Link href={`/courses/${course.slug}`}>
                <BookOpen className="mr-2 h-4 w-4" />
                {t('courses.card.cta')}
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function CoursesPage() {
  const { t, tArray } = useLocale();
  const leadershipDevelopmentCourses = individualCourses.slice(0, 2);
  const highPerformanceCourses = individualCourses.slice(2, 4);

  return (
    <div className="min-h-screen text-white pb-20 relative">
      
      {/* GLOBAL FIXED BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/assets/lideranca-essencial.png"
          alt="Nexus Courses Background"
          fill
          priority
          className="object-cover opacity-25"
          style={{ objectPosition: 'center center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/55 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.03)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10">
      
      {/* 🌌 Majestic, Cybernetic Top Hero Banner Section */}
      <section className="relative w-full h-[420px] md:h-[520px] flex items-center justify-center overflow-hidden border-b border-white/10">
        
        {/* Background Overlays blended elegantly with the fixed global background */}
        <div className="absolute inset-0 z-0">
          {/* Futuristic overlays for a stunning, state-of-the-art first impression */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/10 z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.65)_100%)] z-10" />
          
          {/* Tech Grid Scanlines Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px] opacity-25 z-10 pointer-events-none" />
          
          {/* Subtle color highlight circles */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none z-10" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-10" />
        </div>

        {/* Content Container */}
        <div className="container mx-auto px-4 z-20 relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-black tracking-widest uppercase mb-6 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.12)]">
            <Shield className="w-3.5 h-3.5" />
            NEXUS ACADEMY • TREINAMENTO DE ELITE
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white font-headline max-w-4xl mx-auto leading-tight [text-shadow:0_0_35px_hsl(var(--primary)/0.25)]">
            {t('courses.title')}
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-neutral-400 font-sans italic leading-relaxed">
            {t('courses.subtitle')}
          </p>

          {/* Glowing Platform Performance Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-10">
            <div className="p-3 md:p-4 rounded-xl bg-neutral-900/40 border border-white/5 backdrop-blur-md hover:border-amber-500/30 transition-colors duration-300">
              <span className="text-xl md:text-2xl font-black text-amber-400 font-headline">30 Anos</span>
              <span className="block text-[9px] text-neutral-500 uppercase tracking-widest font-bold mt-1">Experiência Prática</span>
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-neutral-900/40 border border-white/5 backdrop-blur-md hover:border-cyan-500/30 transition-colors duration-300">
              <span className="text-xl md:text-2xl font-black text-cyan-400 font-headline">Reais</span>
              <span className="block text-[9px] text-neutral-500 uppercase tracking-widest font-bold mt-1">Cursos com Exemplos Reais</span>
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-neutral-900/40 border border-white/5 backdrop-blur-md hover:border-emerald-500/30 transition-colors duration-300">
              <span className="text-xl md:text-2xl font-black text-emerald-400 font-headline">2 IAs</span>
              <span className="block text-[9px] text-neutral-500 uppercase tracking-widest font-bold mt-1">Mentores Dedicados</span>
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-neutral-900/40 border border-white/5 backdrop-blur-md hover:border-indigo-500/30 transition-colors duration-300">
              <span className="text-xl md:text-2xl font-black text-indigo-400 font-headline">24/7</span>
              <span className="block text-[9px] text-neutral-500 uppercase tracking-widest font-bold mt-1">Suporte e Mentoria</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Content Wrapper */}
      <div className="container mx-auto px-4 mt-16 md:mt-24">

        {/* Section de Dores e Valor Comercial */}
        <section className="mb-24 relative">
          <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-headline">
              {t('courses.why.title.prefix')}<span className="text-primary [text-shadow:0_0_15px_hsl(var(--primary)/0.5)]">{t('courses.why.title.nexus')}</span>
            </h2>
            <p className="mt-4 text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              {t('courses.why.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Pilar 1 */}
            <div className="group bg-neutral-900/35 border border-white/5 hover:border-primary/50 rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-15px_hsl(var(--primary)/0.25)] backdrop-blur-sm">
              <div className="bg-primary/10 border border-primary/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 group-hover:bg-primary/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <TrendingUp className="text-primary w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-4 font-headline tracking-tight">{t('courses.pillars.pillar1.title')}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed font-sans">
                {t('courses.pillars.pillar1.description')}
              </p>
            </div>

            {/* Pilar 2 */}
            <div className="group bg-neutral-900/35 border border-white/5 hover:border-blue-500/50 rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-15px_rgba(59,130,246,0.25)] backdrop-blur-sm">
              <div className="bg-blue-500/10 border border-blue-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 group-hover:bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <Zap className="text-blue-400 w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-4 font-headline tracking-tight">{t('courses.pillars.pillar2.title')}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed font-sans">
                {t('courses.pillars.pillar2.description')}
              </p>
            </div>

            {/* Pilar 3 */}
            <div className="group bg-neutral-900/35 border border-white/5 hover:border-emerald-500/50 rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-15px_rgba(16,185,129,0.25)] backdrop-blur-sm">
              <div className="bg-emerald-500/10 border border-emerald-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 group-hover:bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <Bot className="text-emerald-400 w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-4 font-headline tracking-tight">{t('courses.pillars.pillar3.title')}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed font-sans">
                {t('courses.pillars.pillar3.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Doctrine & Mentors Section */}
        <section className="my-28 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-primary/3 blur-[140px] pointer-events-none rounded-full" />
          
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-primary font-headline underline underline-offset-8 decoration-primary/30">
              {t('courses.doctrine.title')}
            </h2>
            <p className="mt-6 text-neutral-200 max-w-4xl mx-auto text-lg leading-relaxed font-sans">
              {t('courses.doctrine.subtitle')}
            </p>
            <p className="mt-4 text-neutral-400 max-w-4xl mx-auto italic font-sans">
              {t('courses.doctrine.p1')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch max-w-5xl mx-auto relative z-10">
            
            {/* Dante Card */}
            <Card className="relative flex flex-col border-2 border-primary/30 bg-neutral-950/60 backdrop-blur-md shadow-2xl shadow-primary/5 group hover:border-primary transition-all duration-500 overflow-hidden rounded-2xl">
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/25 text-[8px] font-black tracking-widest text-amber-400 uppercase">
                <Terminal className="w-3.5 h-3.5" />
                STATUS: STRATEGY READY 🟢
              </div>
              <CardHeader className="relative pt-8 pb-4">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-xl border-2 border-primary/45 group-hover:border-primary transition-all duration-700 shadow-2xl">
                    <Image 
                      src="/IAs Nexus/Dante - mentor.png" 
                      alt="Prof. Dante" 
                      fill 
                      sizes="9rem" 
                      className="object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="inline-block bg-primary/10 border border-primary/20 text-primary text-[9px] font-black px-2.5 py-0.5 rounded-full tracking-widest uppercase">{t('courses.mentors.dante.role')}</span>
                    <CardTitle className="font-headline text-2xl text-primary tracking-tight">{t('courses.mentors.dante.title')}</CardTitle>
                    <CardDescription className="font-bold text-neutral-400 text-xs">{t('courses.mentors.dante.subtitle')}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4 pt-4 pb-6 font-sans">
                <p className="text-neutral-300 leading-relaxed text-sm">
                  {t('courses.mentors.dante.description')}
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-xs text-neutral-400">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Análise tática e resolução de conflitos corporativos reais.</span>
                </div>
              </CardContent>
            </Card>

            {/* Djeny Card */}
            <Card className="relative flex flex-col border-2 border-emerald-500/20 bg-neutral-950/60 backdrop-blur-md shadow-2xl shadow-emerald-500/5 group hover:border-emerald-500 transition-all duration-500 overflow-hidden rounded-2xl">
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-[8px] font-black tracking-widest text-emerald-400 uppercase">
                <Terminal className="w-3.5 h-3.5" />
                STATUS: SYNERGY ACTIVE 🟢
              </div>
              <CardHeader className="relative pt-8 pb-4">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-xl border-2 border-emerald-500/40 group-hover:border-emerald-500 transition-all duration-700 shadow-2xl">
                    <Image 
                      src="/IAs Nexus/Djeny - mentora.png" 
                      alt="Prof. Djeny" 
                      fill 
                      sizes="9rem" 
                      className="object-cover transition-transform duration-700 group-hover:scale-108" 
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black px-2.5 py-0.5 rounded-full tracking-widest uppercase">{t('courses.mentors.djeny.role')}</span>
                    <CardTitle className="font-headline text-2xl text-emerald-400 tracking-tight">{t('courses.mentors.djeny.title')}</CardTitle>
                    <CardDescription className="font-bold text-neutral-400 text-xs">{t('courses.mentors.djeny.subtitle')}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4 pt-4 pb-6 font-sans">
                <p className="text-neutral-300 leading-relaxed text-sm">
                  {t('courses.mentors.djeny.description')}
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-xs text-neutral-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Inteligência emocional, comunicação não violenta e design 360.</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <p className="text-center text-[9px] text-neutral-500 mt-8 tracking-[0.25em] uppercase font-black">{t('courses.mentors.note')}</p>
        </section>

        {/* Leadership Development Section */}
        <section className="mb-24 relative">
          <div className="absolute top-0 left-0 w-72 h-72 bg-amber-500/3 blur-[100px] pointer-events-none rounded-full" />
          <h2 className={cn("text-2xl md:text-3xl font-bold tracking-tight text-center mb-12 text-amber-400 font-headline", "[text-shadow:0_0_20px_rgba(245,158,11,0.15)]")}>{t('courses.category.leadership')}</h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 max-w-5xl mx-auto">
            {leadershipDevelopmentCourses.map((course) => (
              <CourseCard course={course} key={course.slug} />
            ))}
          </div>
        </section>

        {/* High Performance Section */}
        <section className="relative">
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/3 blur-[100px] pointer-events-none rounded-full" />
          <h2 className={cn("text-2xl md:text-3xl font-bold tracking-tight text-center mb-12 text-cyan-400 font-headline", "[text-shadow:0_0_20px_rgba(6,182,212,0.15)]")}>{t('courses.category.performance')}</h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 max-w-5xl mx-auto">
            {highPerformanceCourses.map((course) => (
              <CourseCard course={course} key={course.slug} />
            ))}
          </div>
        </section>

      </div>
    </div>
  </div>
  );
}
