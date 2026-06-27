
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LogOut, Menu, User as UserIcon, Shield, Globe, ArrowRight, Sparkles, Briefcase, Coins } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from 'aws-amplify/auth';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useLocale } from '@/hooks/use-locale';

function TextLogo() {
  const pathname = usePathname();
  const isPremiumPath = pathname?.includes('/energia') || 
                        pathname?.includes('/agro') || 
                        pathname?.includes('/intelligence') || 
                        pathname?.includes('/nexus-empresas');

  return (
    <div className="flex flex-col items-start md:items-center">
      <span className="font-headline uppercase flex flex-col md:flex-row items-start md:items-center gap-0 md:gap-3 leading-tight md:leading-normal">
        <span className="font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-blue-600 drop-shadow-[0_0_20px_rgba(37,99,235,0.6)] text-2xl sm:text-4xl tracking-[0.15em] md:tracking-[0.2em]">
          Nexus
        </span>
        <span className="font-light text-white/90 tracking-[0.15em] sm:tracking-[0.2em] text-[10px] sm:text-2xl mt-0 md:mt-0.5 whitespace-nowrap drop-shadow-sm">
          {isPremiumPath ? 'Holding Group' : 'Treinamento'}
        </span>
      </span>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const { locale, setLocale, t } = useLocale();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: t('common.advanceOrder') || 'Ordem de Avanço.',
        description: t('common.logoutSuccess') || 'Missão cumprida. Desconectado com sucesso.',
      });
      if (mobileMenuOpen) setMobileMenuOpen(false);
      router.push('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('common.routeAlert') || 'Alerta de Rota.',
        description: t('common.logoutError') || 'Houve um problema ao tentar sair da sua conta.',
      });
    }
  };

  const userInitials = useMemo(() => {
    const name = user?.displayName;
    if (!name) return '';
    const names = name.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
  }, [user?.displayName]);

  const isAdmin = useMemo(() => isAdminUser(user), [user]);

  const mainNav = useMemo(() => [
    { title: t('navCourses'), href: '/courses' },
    { title: t('navGaleria'), href: '/gallery' },
    { title: t('navPalestras'), href: '/palestras' },
    { title: t('navIntelligence'), href: '/intelligence' },
    { title: t('navAgro') || 'Agro', href: '/agro' },
    { title: t('navPremium') || 'Premium', href: '/intelligence/premium' },
    { title: t('navSocial') || 'Social', href: '/proposito' },
    { title: t('navSobre'), href: '/about' },
    { title: t('navContato'), href: '/contact' },
    { title: t('navSuporte'), href: '/suporte' },
  ], [t]);

  if (!isClient) return null;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col py-3">
        
        {/* TOP ROW: Logo & Controls */}
        <div className="flex items-center justify-between w-full">
          {/* Top Left Spacer */}
          <div className="hidden md:flex w-1/3"></div>
          
          <div className="w-1/2 md:w-1/3 flex justify-start md:justify-center">
            <Link href="/" className="items-center flex" onClick={() => setMobileMenuOpen(false)}>
              <TextLogo />
            </Link>
          </div>

          <div className="w-1/2 md:w-1/3 flex items-center justify-end gap-2">
           {/* Language Selector */}
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 px-2 h-9 border border-border/50 hover:bg-accent/50 transition-colors">
                {locale === 'pt-BR' && <><img src="https://flagcdn.com/w20/br.png" width="20" alt="BR" className="rounded-sm" /> <span className="text-xs font-bold uppercase tracking-tight">PT</span></>}
                {locale === 'en-US' && <><img src="https://flagcdn.com/w20/us.png" width="20" alt="US" className="rounded-sm" /> <span className="text-xs font-bold uppercase tracking-tight">EN</span></>}
                {locale === 'es-ES' && <><img src="https://flagcdn.com/w20/es.png" width="20" alt="ES" className="rounded-sm" /> <span className="text-xs font-bold uppercase tracking-tight">ES</span></>}
                {locale === 'de-DE' && <><img src="https://flagcdn.com/w20/de.png" width="20" alt="DE" className="rounded-sm" /> <span className="text-xs font-bold uppercase tracking-tight">DE</span></>}
                {locale === 'fr-FR' && <><img src="https://flagcdn.com/w20/fr.png" width="20" alt="FR" className="rounded-sm" /> <span className="text-xs font-bold uppercase tracking-tight">FR</span></>}
                {locale === 'ja-JP' && <><img src="https://flagcdn.com/w20/jp.png" width="20" alt="JA" className="rounded-sm" /> <span className="text-xs font-bold uppercase tracking-tight">JA</span></>}
                {locale === 'zh-CN' && <><img src="https://flagcdn.com/w20/cn.png" width="20" alt="CN" className="rounded-sm" /> <span className="text-xs font-bold uppercase tracking-tight">CN</span></>}
                {locale === 'ar-AE' && <><img src="https://flagcdn.com/w20/ae.png" width="20" alt="AE" className="rounded-sm" /> <span className="text-xs font-bold uppercase tracking-tight">AR</span></>}
                {locale === 'ru-RU' && <><img src="https://flagcdn.com/w20/ru.png" width="20" alt="RU" className="rounded-sm" /> <span className="text-xs font-bold uppercase tracking-tight">RU</span></>}
                <span className="sr-only">{t('navChangeLanguage')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur border-primary/20">
              {[
                { code: 'pt-BR', name: 'Português', sub: 'Brasil', flag: 'br' },
                { code: 'en-US', name: 'English', sub: 'United States', flag: 'us' },
                { code: 'es-ES', name: 'Español', sub: 'España', flag: 'es' },
                { code: 'de-DE', name: 'Deutsch', sub: 'Deutschland', flag: 'de' },
                { code: 'fr-FR', name: 'Français', sub: 'France', flag: 'fr' },
                { code: 'ja-JP', name: '日本語', sub: '日本', flag: 'jp' },
                { code: 'zh-CN', name: '简体中文', sub: '中国', flag: 'cn' },
                { code: 'ar-AE', name: 'العربية', sub: 'دبي', flag: 'ae' },
                { code: 'ru-RU', name: 'Русский', sub: 'Россия', flag: 'ru' }
              ].map((lang) => (
                <DropdownMenuItem key={lang.code} onClick={() => setLocale(lang.code as any)} className="flex items-center gap-3 cursor-pointer hover:bg-primary/10 transition-colors">
                  <img src={`https://flagcdn.com/w20/${lang.flag}.png`} width="20" alt={lang.code} className="rounded-xs" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{lang.name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">{lang.sub}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center gap-2">
            {isUserLoading ? (
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-28" />
              </div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border border-primary/20 hover:border-primary/50 transition-all">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur border-primary/20" align="end" forceMount>
                    <div className="flex flex-col p-2 border-b border-border/50 mb-1">
                      <span className="text-sm font-bold truncate">{user.displayName}</span>
                      <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    </div>
                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-primary/10">
                      <Link href="/profile" className="flex items-center w-full">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>{t('userArea')}</span>
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator className="bg-border/50" />
                        <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary/70">Gabinete Diretoria</div>
                        <DropdownMenuItem asChild className="cursor-pointer hover:bg-primary/10 text-primary font-medium">
                          <Link href="/gabinete" className="flex items-center w-full">
                            <Shield className="mr-2 h-4 w-4" />
                            <span>{t('navGabinete')}</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer hover:bg-blue-500/10 text-blue-400 font-bold">
                          <Link href="/atena" className="flex items-center w-full">
                            <Sparkles className="mr-2 h-4 w-4" />
                            <span>Atena (IA Exclusiva)</span>
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator className="bg-border/50" />
                        <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-500/70">Área Comercial</div>
                        <DropdownMenuItem asChild className="cursor-pointer hover:bg-emerald-500/10 text-emerald-400 font-bold">
                          <Link href="/gabinete-vendas" className="flex items-center w-full">
                            <Briefcase className="mr-2 h-4 w-4" />
                            <span>Showroom Comercial</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer hover:bg-emerald-500/10 text-emerald-400 font-bold">
                          <Link href="/gabinete/precificacao" className="flex items-center w-full">
                            <Coins className="mr-2 h-4 w-4" />
                            <span>Catálogo de Produtos</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive hover:bg-destructive/10 focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('logout')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <Link 
                  href="/login" 
                  className={cn(
                    buttonVariants({ variant: 'default', size: 'sm' }),
                    'bg-primary hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                  )}
                >
                  <UserIcon className="mr-2 h-4 w-4 hidden md:block" />
                  {t('login')}
                </Link>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center ml-1">
            <Button variant="ghost" size="sm" className="h-9 px-2 hover:bg-primary/10" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
        {/* End of TOP ROW */}
        </div>

        {/* BOTTOM ROW: Navigation Menus (Desktop Only) */}
        <nav className="hidden md:flex justify-center items-center gap-x-4 lg:gap-x-6 gap-y-3 mt-4 text-[13px] lg:text-sm flex-wrap w-full pb-2">
            {mainNav.map((item) => {
              if (item.href === '/intelligence') {
                return (
                  <DropdownMenu key={item.href}>
                    <DropdownMenuTrigger asChild>
                      <button className={cn(
                        "flex items-center gap-2 transition-all duration-300",
                        pathname.includes('/intelligence') || pathname.includes('/nexus-empresas') || pathname.includes('/energia')
                          ? "bg-blue-600/20 border border-blue-500/50 px-3 py-1.5 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] text-white font-bold uppercase tracking-widest"
                          : "bg-blue-600/10 border border-blue-600/30 px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.15)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:bg-blue-600/20 text-white font-bold uppercase tracking-widest"
                      )}>
                        {item.title}
                        <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 bg-background/95 backdrop-blur-xl border-blue-500/30 p-2 shadow-2xl shadow-blue-900/20" align="center">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-1 mb-2 border-b border-border/50">Ecossistema Corporativo</div>
                      <DropdownMenuItem asChild className="cursor-pointer hover:bg-blue-500/10 mb-1 p-3 rounded-lg focus:bg-blue-500/20">
                        <Link href="/intelligence" className="flex flex-col">
                          <span className="font-black text-blue-400 uppercase tracking-wider text-sm">Visão Geral Intelligence</span>
                          <span className="text-[10px] text-muted-foreground mt-0.5">O coração da inteligência Nexus</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer hover:bg-cyan-500/10 mb-1 p-3 rounded-lg focus:bg-cyan-500/20">
                        <Link href="/nexus-empresas" className="flex flex-col">
                          <span className="font-black text-cyan-400 uppercase tracking-wider text-sm">Nexus Empresas</span>
                          <span className="text-[10px] text-muted-foreground mt-0.5">Automação para a indústria (B2B)</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer hover:bg-pink-500/10 mb-1 p-3 rounded-lg focus:bg-pink-500/20">
                        <Link href="/inova-revenda" className="flex flex-col">
                          <span className="font-black text-pink-500 uppercase tracking-wider text-sm">Inova Revenda</span>
                          <span className="text-[10px] text-muted-foreground mt-0.5">Concessionárias guiadas por IA</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer hover:bg-purple-500/10 mb-1 p-3 rounded-lg focus:bg-purple-500/20">
                        <Link href="/inova-moda" className="flex flex-col">
                          <span className="font-black text-purple-400 uppercase tracking-wider text-sm">Inova Moda</span>
                          <span className="text-[10px] text-muted-foreground mt-0.5">Provador Virtual c/ GPU</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer hover:bg-fuchsia-500/10 mb-1 p-3 rounded-lg focus:bg-fuchsia-500/20">
                        <Link href="/vitrine-inovadora" className="flex flex-col">
                          <span className="font-black text-fuchsia-400 uppercase tracking-wider text-sm">Vitrine Inovadora</span>
                          <span className="text-[10px] text-muted-foreground mt-0.5">Painel Digital Inteligente</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer hover:bg-amber-500/10 p-3 rounded-lg focus:bg-amber-500/20">
                        <Link href="/energia" className="flex flex-col">
                          <span className="font-black text-amber-500 uppercase tracking-wider text-sm">Nexus Energia</span>
                          <span className="text-[10px] text-muted-foreground mt-0.5">IA e Otimização para o setor elétrico</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'transition-all duration-300',
                    item.href === '/agro'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:bg-emerald-500/20 text-white font-bold uppercase tracking-widest'
                      : item.href === '/vitrine-inovadora'
                      ? 'bg-pink-500/10 border border-pink-500/30 px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(236,72,153,0.15)] hover:shadow-[0_0_25px_rgba(236,72,153,0.4)] hover:bg-pink-500/20 text-white font-bold uppercase tracking-widest'
                      : item.href === '/intelligence/premium'
                      ? 'bg-violet-500/10 border border-violet-500/30 px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.15)] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:bg-violet-500/20 text-white font-bold uppercase tracking-widest'
                      : pathname === item.href 
                        ? 'bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-lg shadow-[0_0_10px_rgba(37,99,235,0.15)] text-foreground font-semibold' 
                        : 'bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10 hover:border-white/10 text-foreground/70 hover:text-foreground font-medium'
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
        </nav>

        {/* Mobile Menu Sheet */}
        <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 border-primary/20 bg-background/98 backdrop-blur-xl">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-border/50">
                    <TextLogo />
                  </div>
                  <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
                    {mainNav.map((item) => {
                      if (item.href === '/intelligence') {
                        return (
                          <details key={item.href} className="group border border-blue-600/30 rounded-lg bg-blue-600/5 overflow-hidden mb-1">
                            <summary className="cursor-pointer flex items-center justify-between p-3 text-white font-bold uppercase tracking-widest list-none [&::-webkit-details-marker]:hidden bg-blue-600/10 hover:bg-blue-600/20 transition-colors">
                              <span className="tracking-wide text-sm">{item.title}</span>
                              <svg className="w-4 h-4 transition-transform group-open:rotate-180 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </summary>
                            <div className="flex flex-col p-2 bg-black/40 gap-1 border-t border-blue-500/20">
                              <Link href="/intelligence" onClick={() => setMobileMenuOpen(false)} className="p-3 text-sm font-bold text-blue-400 hover:bg-blue-500/10 rounded-md">Visão Geral Intelligence</Link>
                              <Link href="/nexus-empresas" onClick={() => setMobileMenuOpen(false)} className="p-3 text-sm font-bold text-cyan-400 hover:bg-cyan-500/10 rounded-md">Nexus Empresas (B2B)</Link>
                              <Link href="/inova-revenda" onClick={() => setMobileMenuOpen(false)} className="p-3 text-sm font-bold text-pink-500 hover:bg-pink-500/10 rounded-md">Inova Revenda</Link>
                              <Link href="/inova-moda" onClick={() => setMobileMenuOpen(false)} className="p-3 text-sm font-bold text-purple-400 hover:bg-purple-500/10 rounded-md">Inova Moda</Link>
                              <Link href="/vitrine-inovadora" onClick={() => setMobileMenuOpen(false)} className="p-3 text-sm font-bold text-fuchsia-400 hover:bg-fuchsia-500/10 rounded-md">Vitrine Inovadora</Link>
                              <Link href="/energia" onClick={() => setMobileMenuOpen(false)} className="p-3 text-sm font-bold text-amber-500 hover:bg-amber-500/10 rounded-md">Nexus Energia</Link>
                            </div>
                          </details>
                        );
                      }

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center justify-between p-3 rounded-lg transition-all duration-200 group mb-1',
                            item.href === '/agro'
                            ? 'bg-emerald-500/10 text-white drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] font-bold border border-emerald-500/50 uppercase tracking-widest'
                            : item.href === '/intelligence/premium'
                            ? 'bg-violet-500/10 text-white drop-shadow-[0_0_8px_rgba(139,92,246,0.8)] font-bold border border-violet-500/50 uppercase tracking-widest'
                                : pathname === item.href
                                  ? 'bg-accent/20 text-foreground font-semibold'
                                  : 'text-foreground/70 hover:bg-accent/10 hover:text-foreground'
                          )}
                        >
                          <span className="text-sm tracking-wide">{item.title}</span>
                          <ArrowRight className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            pathname === item.href ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                          )} />
                        </Link>
                      );
                    })}
                  </nav>
                  <div className="p-4 mt-auto border-t border-border/50">
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {[
                          { code: 'pt-BR', flag: 'br', label: 'PT-BR' },
                          { code: 'en-US', flag: 'us', label: 'EN-US' },
                          { code: 'es-ES', flag: 'es', label: 'ES-ES' },
                          { code: 'ru-RU', flag: 'ru', label: 'RU-RU' }
                        ].map((lang) => (
                          <Button 
                            key={lang.code}
                            variant={locale === lang.code ? 'default' : 'outline'} 
                            size="sm" 
                            onClick={() => { setLocale(lang.code as any); setMobileMenuOpen(false); }} 
                            className="gap-3 h-auto py-3 justify-start px-4 border-border/40"
                          >
                            <img src={`https://flagcdn.com/w40/${lang.flag}.png`} width="24" alt={lang.label} className="rounded-sm" />
                            <span className="text-sm font-bold">{lang.label}</span>
                          </Button>
                        ))}
                      </div>
                      {isUserLoading ? (
                        <Skeleton className="h-10 w-full" />
                      ) : user ? (
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" className="w-full justify-start border-border/40" asChild onClick={() => setMobileMenuOpen(false)}>
                            <Link href="/profile"><UserIcon className="mr-2 h-4 w-4" /> {t('userArea')}</Link>
                          </Button>
                          {isAdmin && (
                            <>
                              <details className="group border border-primary/20 rounded-md bg-background/50 overflow-hidden">
                                <summary className="cursor-pointer p-3 text-sm font-medium text-primary hover:bg-primary/10 transition-colors list-none flex justify-between items-center [&::-webkit-details-marker]:hidden">
                                  <span className="flex items-center gap-2"><Shield className="h-4 w-4" /> Gabinete Diretoria</span>
                                  <ArrowRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                                </summary>
                                <div className="p-2 flex flex-col gap-2 border-t border-primary/10 bg-black/20">
                                  <Button variant="ghost" className="w-full justify-start text-primary font-medium hover:bg-primary/10" asChild onClick={() => setMobileMenuOpen(false)}>
                                    <Link href="/gabinete"><Shield className="mr-2 h-4 w-4" /> {t('navGabinete')}</Link>
                                  </Button>
                                  <Button variant="ghost" className="w-full justify-start text-blue-400 font-bold hover:bg-blue-500/10" asChild onClick={() => setMobileMenuOpen(false)}>
                                    <Link href="/atena"><Sparkles className="mr-2 h-4 w-4" /> Atena (IA Exclusiva)</Link>
                                  </Button>
                                </div>
                              </details>

                              <details className="group mt-2 border border-emerald-500/20 rounded-md bg-background/50 overflow-hidden">
                                <summary className="cursor-pointer p-3 text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors list-none flex justify-between items-center [&::-webkit-details-marker]:hidden">
                                  <span className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> Área Comercial</span>
                                  <ArrowRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                                </summary>
                                <div className="p-2 flex flex-col gap-2 border-t border-emerald-500/10 bg-black/20">
                                  <Button variant="ghost" className="w-full justify-start text-emerald-400 font-bold hover:bg-emerald-500/10" asChild onClick={() => setMobileMenuOpen(false)}>
                                    <Link href="/gabinete-vendas"><Briefcase className="mr-2 h-4 w-4" /> Showroom Comercial</Link>
                                  </Button>
                                  <Button variant="ghost" className="w-full justify-start text-emerald-400 font-bold hover:bg-emerald-500/10" asChild onClick={() => setMobileMenuOpen(false)}>
                                    <Link href="/gabinete/precificacao"><Coins className="mr-2 h-4 w-4" /> Catálogo de Produtos</Link>
                                  </Button>
                                </div>
                              </details>
                            </>
                          )}
                          <Button variant="destructive" className="w-full justify-start mt-2" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" /> {t('logout')}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-2">
                          <Link href="/login" onClick={() => setMobileMenuOpen(false)} className={cn(buttonVariants({ variant: 'default', className: 'w-full shadow-[0_0_15px_rgba(37,99,235,0.3)]' }))}>
                            <UserIcon className="mr-2 h-4 w-4" />
                            {t('login')}
                          </Link>
                        </div>
                      )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
