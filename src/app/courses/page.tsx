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
import { BookOpen, Shield, Heart, TrendingUp, Zap, Bot } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { individualCourses } from '@/lib/courses-data';
import { useLocale } from '@/hooks/use-locale';

const CourseCard = ({ course }: { course: (typeof individualCourses)[0] }) => {
  const { t, tArray } = useLocale();
  return (
    <Card key={course.title} className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl bg-black/40 border-white/10 backdrop-blur-sm">
      <div className="relative h-48 w-full">
        {course.featuredLabel && (
            <div className="absolute top-3 left-3 z-10">
                <span className={cn(
                    "px-3 py-1 text-[10px] font-black rounded-lg shadow-lg tracking-widest uppercase",
                    course.isBestseller ? "bg-primary text-white" : "bg-accent text-black"
                )}>
                    {t(`courses.${course.slug}.featuredLabel` as any) || course.featuredLabel}
                </span>
            </div>
        )}
        <Image
          src={course.image.src}
          alt={course.image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-white">{t(`courses.${course.slug}.title` as any)}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-gray-400 line-clamp-3">{t(`courses.${course.slug}.description` as any)}</p>
        <div className="mt-4 flex flex-wrap gap-2">
            {tArray(`courses.${course.slug}.tags` as any).map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-primary/20 border border-primary/40 px-3 py-1 text-xs text-primary font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
      </CardContent>
      <CardFooter>
         <Button asChild className="w-full bg-primary hover:bg-primary/80">
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
    <div className="min-h-screen bg-black text-white py-12 md:py-20 px-4">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h1 className={cn("text-4xl font-bold tracking-tighter text-primary sm:text-5xl", "font-headline [text-shadow:0_0_20px_hsl(var(--primary)/0.3)]")}>
            {t('courses.title')}
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-400 font-sans italic">
            {t('courses.subtitle')}
          </p>
        </div>

        {/* Section de Dores e Valor Comercial */}
        <section className="mb-20 mt-8 relative">
          <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-white font-headline">
                        {t('courses.why.title.prefix')}<span className="text-primary [text-shadow:0_0_15px_hsl(var(--primary)/0.5)]">{t('courses.why.title.nexus')}</span>
                    </h2>
                    <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                        {t('courses.why.subtitle')}
                    </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Pilar 1 */}
            <div className="group bg-white/5 border border-white/10 hover:border-primary/50 rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-15px_hsl(var(--primary)/0.3)]">
              <div className="bg-primary/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <TrendingUp className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 font-headline tracking-tight">{t('courses.pillars.pillar1.title')}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {t('courses.pillars.pillar1.description')}
              </p>
            </div>

            {/* Pilar 2 */}
            <div className="group bg-white/5 border border-white/10 hover:border-blue-500/50 rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-15px_rgba(59,130,246,0.3)]">
              <div className="bg-blue-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Zap className="text-blue-400 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 font-headline tracking-tight">{t('courses.pillars.pillar2.title')}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {t('courses.pillars.pillar2.description')}
              </p>
            </div>

            {/* Pilar 3 */}
            <div className="group bg-white/5 border border-white/10 hover:border-emerald-500/50 rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-15px_rgba(16,185,129,0.3)]">
              <div className="bg-emerald-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Bot className="text-emerald-400 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 font-headline tracking-tight">{t('courses.pillars.pillar3.title')}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {t('courses.pillars.pillar3.description')}
              </p>
            </div>
          </div>
        </section>

        <section className="my-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-primary font-headline underline underline-offset-8 decoration-primary/30">
                  {t('courses.doctrine.title')}
                </h2>
                <p className="mt-6 text-gray-300 max-w-4xl mx-auto text-lg leading-relaxed">
                  {t('courses.doctrine.subtitle')}
                </p>
                <p className="mt-4 text-gray-400 max-w-4xl mx-auto italic">
                  {t('courses.doctrine.p1')}
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch max-w-5xl mx-auto">
                {/* Dante Card */}
                <Card className="flex flex-col border-2 border-primary/40 bg-white/5 backdrop-blur-md shadow-2xl shadow-primary/10 group hover:border-primary transition-colors duration-500 overflow-hidden">
                    <CardHeader className="relative">
                        <div className="flex items-center gap-6">
                             <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-xl border-2 border-primary/50 group-hover:border-primary transition-all duration-700 shadow-2xl">
                               <Image 
                                src="https://i.postimg.cc/0N4MbZm9/Instrutor-Dante.png" 
                                alt="Prof. Dante" 
                                fill 
                                sizes="10rem" 
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                               />
                             </div>
                             <div className="space-y-2">
                                <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded tracking-tighter uppercase">{t('courses.mentors.dante.role')}</span>
                                <CardTitle className="font-headline text-3xl text-primary flex items-center gap-2 tracking-tight">{t('courses.mentors.dante.title')}</CardTitle>
                                <CardDescription className="font-bold text-gray-400">{t('courses.mentors.dante.subtitle')}</CardDescription>
                             </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4 pt-6">
                        <p className="text-gray-300 leading-relaxed text-sm">
                            {t('courses.mentors.dante.description')}
                        </p>
                    </CardContent>
                </Card>

                {/* Djeny Card */}
                <Card className="flex flex-col border-2 border-emerald-500/30 bg-white/5 backdrop-blur-md shadow-2xl shadow-emerald-500/10 group hover:border-emerald-500 transition-colors duration-500 overflow-hidden">
                    <CardHeader className="relative">
                        <div className="flex items-center gap-6">
                             <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-xl border-2 border-emerald-500/50 group-hover:border-emerald-500 transition-all duration-700 shadow-2xl">
                               <Image 
                                src="https://i.postimg.cc/15zQjS2p/Instrutora-Djeny.png" 
                                alt="Prof. Djeny" 
                                fill 
                                sizes="10rem" 
                                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                               />
                             </div>
                             <div className="space-y-2">
                                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded tracking-tighter uppercase">{t('courses.mentors.djeny.role')}</span>
                                <CardTitle className="font-headline text-3xl text-emerald-400 flex items-center gap-2 tracking-tight">{t('courses.mentors.djeny.title')}</CardTitle>
                                <CardDescription className="font-bold text-gray-400">{t('courses.mentors.djeny.subtitle')}</CardDescription>
                             </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4 pt-6">
                        <p className="text-gray-300 leading-relaxed text-sm">
                            {t('courses.mentors.djeny.description')}
                        </p>
                    </CardContent>
                </Card>
            </div>
            <p className="text-center text-[10px] text-gray-500 mt-8 tracking-[0.2em] uppercase font-bold">{t('courses.mentors.note')}</p>
          </section>

        <section className="mb-24">
            <h2 className={cn("text-3xl font-bold tracking-tighter text-center mb-12 text-primary", "font-headline")}>{t('courses.category.leadership')}</h2>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 max-w-5xl mx-auto">
            {leadershipDevelopmentCourses.map((course) => (
                <CourseCard course={course} key={course.slug} />
            ))}
            </div>
        </section>

        <section>
            <h2 className={cn("text-3xl font-bold tracking-tighter text-center mb-12 text-blue-400", "font-headline")}>{t('courses.category.performance')}</h2>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 max-w-5xl mx-auto">
            {highPerformanceCourses.map((course) => (
                <CourseCard course={course} key={course.slug} />
            ))}
            </div>
        </section>

      </div>
    </div>
  );
}
