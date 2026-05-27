'use client';

import { useUser, useMemoAuth } from '@/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { updateUserAttributes } from 'aws-amplify/auth';
import { useToast } from '@/hooks/use-toast';
import { useNickname } from '@/hooks/use-nickname';

import { allCourses, Course } from '@/lib/courses-data';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Award, Users, Zap } from 'lucide-react';
import { isAdminUser } from '@/lib/constants';
import placeholderImages from '@/lib/placeholder-images.json';
import { eventEmitter } from '@/auth/event-emitter';
import { useLocale } from '@/hooks/use-locale';


interface Purchase {
  id: string;
  userId: string;
  courseId: string;
  purchaseDate: string; 
  price: number;
}

interface PurchasedCourse extends Purchase {
  courseDetails: Course;
}


export default function ProfilePage() {
  const { t } = useLocale();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const { nickname, saveNickname } = useNickname(user?.email);
  const [nicknameInput, setNicknameInput] = useState('');

  useEffect(() => {
    if (nickname) setNicknameInput(nickname);
  }, [nickname]);

  const displayName = nickname || user?.displayName?.split(' ')[0] || 'Comandante';

  const isAdmin = useMemo(() => isAdminUser(user), [user]);
  const purchasedCourses = useMemo((): PurchasedCourse[] => {
    if (isAdmin) {
      return allCourses
        .filter(c => c.type === 'course')
        .map(course => ({
          id: `admin-${course.slug}`,
          userId: user?.uid || 'admin',
          courseId: course.slug,
          purchaseDate: new Date().toISOString(),
          price: course.discountedPrice,
          courseDetails: course
        }));
    }
    return [];
  }, [isAdmin, user?.uid]);
  const purchasesLoading = false;
  const hasAccessToMentoria = useMemo(() => purchasedCourses.length > 0 || isAdmin, [purchasedCourses, isAdmin]);


  const userInitials = useMemo(() => {
    const name = user?.displayName;
    if (!name) return '';
    const names = name.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
  }, [user?.displayName]);

  const isLoading = isUserLoading || purchasesLoading;

  if (isLoading || !user) {
    return (
      <div className="bg-secondary/20">
        <div className="container mx-auto py-12 md:py-20">
          <div className="mb-12 flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                  <Skeleton className="h-10 w-80" />
                  <Skeleton className="h-6 w-64" />
              </div>
          </div>
          <Card>
              <CardHeader>
                  <CardTitle>{t('profile.myCourses' as any) || 'Meus Cursos.'}</CardTitle>
                  <CardDescription>
                      {t('profile.myCoursesDescription' as any) || 'Aqui estão todos os cursos que você adquiriu. Comece a aprender agora!'}
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      <Skeleton className="h-80 w-full" />
                      <Skeleton className="h-80 w-full" />
                      <Skeleton className="h-80 w-full" />
                  </div>
              </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-slate-100">
      
      {/* FIXED BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/assets/dante-builder-v3.png"
          alt="Nexus Command Deck"
          fill
          priority
          className="object-cover opacity-20"
          style={{ objectPosition: 'center center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/65 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.03)_0%,transparent_60%)]" />
      </div>

      {/* Grid Scanlines Ambience */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] scale-125 pointer-events-none z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="light-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#light-grid)" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto py-12 md:py-20 px-4">
          <div className="mb-12 flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              <Avatar className="h-24 w-24 border-2 border-primary shadow-2xl">
              <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? 'Avatar'} />
              <AvatarFallback className="text-3xl bg-primary/20 text-primary">{userInitials}</AvatarFallback>
              </Avatar>
              <div>
              <h1 className={cn('text-4xl font-bold tracking-tighter text-primary [text-shadow:0_0_15px_rgba(245,158,11,0.15)]', 'font-headline')}>
                  Bem-vindo(a), {displayName}!
              </h1>
              <p className="text-lg text-muted-foreground">{user.email}</p>
              </div>
          </div>
          
          {/* Card de Apelido */}
          <Card className="mb-8 bg-zinc-950/65 border border-white/5 backdrop-blur-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                ✏️ Como prefere ser chamado?
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                Apenas um apelido para uso no site. Não altera seu cadastro.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  placeholder={`Ex: Comandante, Guerreiro...`}
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveNickname(nicknameInput)}
                  className="bg-black/40 border-zinc-700 text-white max-w-xs focus:border-primary"
                />
                <Button
                  onClick={() => {
                    saveNickname(nicknameInput);
                    toast({ title: `Pronto! Agora você é ${nicknameInput || user.displayName?.split(' ')[0]}.` });
                  }}
                  variant="outline"
                  className="border-primary/40 text-primary hover:bg-primary/10"
                >
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
          {hasAccessToMentoria ? (
               <Card className="my-12 bg-zinc-950/65 border border-primary/10 backdrop-blur-md shadow-2xl shadow-black/60">
                  <CardHeader className="border-b border-white/5 pb-4">
                      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
                          <div className="relative w-28 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-lg bg-neutral-900">
                              <Image 
                                  src="/Nexus Cursos/Instrutores Dante e Djeny.png" 
                                  alt="Instrutores Dante e Djeny" 
                                  fill
                                  sizes="(max-width: 768px) 7rem, 7rem"
                                  className="object-cover"
                                  priority
                              />
                          </div>
                          <div>
                              <CardTitle className="font-headline text-2xl text-white">{t('profile.commandRoom.title')}</CardTitle>
                              <CardDescription className="text-gray-400">{t('profile.commandRoom.description')}</CardDescription>
                          </div>
                      </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                      
                      {/* CARD 1: SALA DE CONSELHO TÁTICO (DANTE) */}
                      <button 
                        onClick={() => eventEmitter.emit('open-chat', { context: 'clan' })}
                        className="group relative flex items-center gap-4 p-5 rounded-2xl bg-zinc-950/80 border-2 border-amber-500/20 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-500 hover:-translate-y-1.5 text-left w-full overflow-hidden"
                      >
                        {/* Glowing orange/amber aura behind the card on hover */}
                        <div className="absolute -inset-2 rounded-[24px] bg-gradient-to-br from-amber-500/15 to-orange-600/15 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 -z-10 pointer-events-none" />
                        
                        {/* Mentor Image (Dante) */}
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-amber-500/30 group-hover:border-amber-500 transition-colors duration-500 bg-neutral-900 shadow-2xl">
                          <Image
                            src="/IAs Nexus/Dante - mentor.png"
                            alt="Prof. Dante"
                            fill
                            sizes="6rem"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                          />
                        </div>

                        {/* Card copy */}
                        <div className="flex-1 space-y-1.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/25 text-[9px] font-black tracking-widest text-amber-400 uppercase animate-pulse">
                            ⚔️ OPERACIONAL
                          </span>
                          <h3 className="font-headline text-lg font-bold text-white group-hover:text-primary transition-colors duration-300">
                            {t('profile.clanRoom.title')}
                          </h3>
                          <p className="text-xs text-neutral-400 font-sans line-clamp-2 leading-relaxed">
                            {t('profile.clanRoom.description')}
                          </p>
                          <div className="text-[10px] font-black text-amber-400/80 uppercase tracking-wider pt-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
                            Acessar Terminal ➔
                          </div>
                        </div>
                      </button>

                      {/* CARD 2: MATRIZ DE MÉRITO E COMPETÊNCIAS (DJENY) */}
                      <button 
                        onClick={() => eventEmitter.emit('open-chat', { context: 'djeny' })}
                        className="group relative flex items-center gap-4 p-5 rounded-2xl bg-zinc-950/80 border-2 border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-500 hover:-translate-y-1.5 text-left w-full overflow-hidden"
                      >
                        {/* Glowing emerald/cyan aura behind the card on hover */}
                        <div className="absolute -inset-2 rounded-[24px] bg-gradient-to-br from-emerald-500/15 to-cyan-600/15 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 -z-10 pointer-events-none" />
                        
                        {/* Mentor Image (Djeny) */}
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-emerald-500/30 group-hover:border-emerald-500 transition-colors duration-500 bg-neutral-900 shadow-2xl">
                          <Image
                            src="/IAs Nexus/Djeny - mentora.png"
                            alt="Prof. Djeny"
                            fill
                            sizes="6rem"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                          />
                        </div>

                        {/* Card copy */}
                        <div className="flex-1 space-y-1.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-[9px] font-black tracking-widest text-emerald-400 uppercase animate-pulse">
                            🪷 SINERGIA & MÉRITO
                          </span>
                          <h3 className="font-headline text-lg font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
                            {t('profile.djenyTerminal.title')}
                          </h3>
                          <p className="text-xs text-neutral-400 font-sans line-clamp-2 leading-relaxed">
                            {t('profile.djenyTerminal.description')}
                          </p>
                          <div className="text-[10px] font-black text-emerald-400/80 uppercase tracking-wider pt-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
                            Acessar Terminal ➔
                          </div>
                        </div>
                      </button>

                  </CardContent>
              </Card>
             ) : (
                <Card className="text-center max-w-2xl mx-auto my-12">
                    <CardHeader>
                    <div className="flex justify-center mb-4">
                        <Users className="h-16 w-16 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-2xl">
                        {t('profile.mentorshipAccess' as any) || 'Acesso à Mentoria do Clã Nexus.'}
                    </CardTitle>
                    <CardDescription>
                        {t('profile.mentorshipDescription' as any) || 'A mentoria 24/7 com Dante & Djeny é um benefício exclusivo para membros que possuem pelo menos um curso com Acesso Total.'}
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <p className="text-muted-foreground">
                        {t('profile.mentorshipUnlock' as any) || 'Para desbloquear estas e outras ferramentas de elite, adquira qualquer um dos nossos cursos.'}
                    </p>
                    </CardContent>
                    <CardFooter>
                    <Button asChild className="w-full">
                        <Link href="/courses">
                        <BookOpen className="mr-2 h-4 w-4" />
                        {t('profile.viewCourses' as any) || 'Ver Cursos e Desbloquear Acesso'}
                        </Link>
                    </Button>
                    </CardFooter>
                </Card>
             )}

            <Card className="mt-12 bg-zinc-950/60 border-2 border-primary/20 backdrop-blur-md shadow-xl shadow-black/40">
                <CardHeader>
                <CardTitle className="text-white font-headline text-2xl">{t('profile.myCourses' as any) || 'Meus Cursos.'}</CardTitle>
                <CardDescription className="text-gray-400">
                    {t('profile.myCoursesDescription' as any) || 'Aqui estão todos os cursos que você adquiriu. Comece a aprender agora!'}
                </CardDescription>
                </CardHeader>
                <CardContent>
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <Skeleton className="h-80 w-full" />
                        <Skeleton className="h-80 w-full" />
                        <Skeleton className="h-80 w-full" />
                    </div>
                ) : purchasedCourses.length === 0 ? (
                    <div className="py-12 text-center">
                    <p className="mb-4 text-lg text-muted-foreground">{t('profile.noCourses' as any) || 'Você ainda não se inscreveu em nenhum curso.'}</p>
                    <Button asChild>
                        <Link href="/courses">{t('profile.exploreCourses' as any) || 'Explorar Cursos'}</Link>
                    </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {purchasedCourses.map((purchase) => (
                        <Card key={purchase.id} className="flex flex-col overflow-hidden transition-all duration-300 bg-zinc-900/50 border-2 border-primary/10 hover:border-primary/40 hover:scale-[1.02] shadow-xl group">
                        <div className="relative h-48 w-full">
                            <Image
                            src={purchase.courseDetails.image.src}
                            alt={purchase.courseDetails.image.alt}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                            data-ai-hint={purchase.courseDetails.image.hint}
                            />
                        </div>
                        <CardHeader>
                            <CardTitle className="font-headline">{purchase.courseDetails.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-muted-foreground whitespace-pre-line font-sans line-clamp-3">{purchase.courseDetails.description}</p>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                            <Button asChild className="w-full">
                            <Link href={`/courses/${purchase.courseDetails.slug}`}>
                                <BookOpen className="mr-2 h-4 w-4" />
                                {t('profile.accessCourse' as any) || 'Acessar Curso'}
                            </Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full">
                            <Link href={`/certificate/view?id=${purchase.id}`}>
                                <Award className="mr-2 h-4 w-4" />
                                {t('profile.viewCertificate' as any) || 'Ver Certificado'}
                            </Link>
                            </Button>
                        </CardFooter>
                        </Card>
                    ))}
                    </div>
                )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
