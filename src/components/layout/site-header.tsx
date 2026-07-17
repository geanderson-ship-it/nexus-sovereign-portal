
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LogOut, Menu, User as UserIcon, Shield, Globe, ArrowRight, Sparkles, Briefcase, Coins, ChevronDown } from 'lucide-react';
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
    <div className="flex flex-col items-start md:items-center relative group cursor-pointer">
      {/* Efeito UAU de Brilho Fundo */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/0 via-blue-500/30 to-blue-600/0 blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000 pointer-events-none"></div>
      
      <span className="font-headline uppercase flex flex-col md:flex-row items-start md:items-center gap-0 md:gap-3 leading-tight md:leading-normal relative z-10 transition-all duration-500 group-hover:scale-105">
        <span className="font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-300 via-blue-500 to-blue-700 drop-shadow-[0_0_25px_rgba(37,99,235,0.9)] text-3xl sm:text-5xl tracking-[0.15em] md:tracking-[0.2em]">
          Nexus
        </span>
        <span className="font-light text-white tracking-[0.15em] sm:tracking-[0.2em] text-[11px] sm:text-3xl mt-0 md:mt-1 whitespace-nowrap drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
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
    { title: 'Inova Moda', href: '/inovamoda' },
    { title: 'Inova Revenda', href: '/inova-revenda' },
    { title: 'Vitrine Inovadora', href: '/vitrine-inovadora' },
    { title: 'Embaixadora', href: '/nexus-rotas' },
    { title: 'Energia', href: '/energia' },
    { title: 'Enterprise', href: '/nexus-empresas' },
    { title: 'Nexus B2B', href: '/nexus-b2b' },
    { title: t('navAgro') || 'Agro', href: '/agro' },
    { title: t('navPremium') || 'Exclusive', href: '/exclusive' },
    { title: t('navSocial') || 'Social', href: '/proposito' },
    { title: t('navSobre') || 'Sobre', href: '/about' },
  ], [t]);

  if (!isClient) return null;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 lg:px-8 max-w-[1920px] mx-auto flex flex-col py-3">
        
        {/* TOP ROW: Logo & Controls */}
        <div className="flex items-center justify-between w-full">
          {/* Top Left Spacer */}
          <div className="hidden md:flex w-1/3"></div>
          
          <div className="w-1/2 md:w-1/3 flex justify-start md:justify-center">
            <Link href="/" className="items-center flex" onClick={() => setMobileMenuOpen(false)}>
              <TextLogo />
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-end gap-1 sm:gap-2">
           {/* Language Selector (Desktop Only) */}
           <div className="hidden md:block">
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
           </div>

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
                <Link 
                  href="/signup" 
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'sm' }),
                    'border-primary/50 text-primary hover:bg-primary/10 transition-all'
                  )}
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger (Hamburger) */}
          <div className="xl:hidden flex items-center ml-2 relative z-[60]">
            <Button variant="outline" size="sm" className="h-10 w-10 p-0 border-white/20 bg-black/50 text-white hover:bg-white/10 hover:text-white" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
        {/* End of TOP ROW */}
        </div>

        {/* BOTTOM ROW: Navigation Menus (Desktop Only) */}
        <nav className="hidden xl:flex justify-center items-center gap-x-3 2xl:gap-x-5 gap-y-2 mt-5 text-[11px] xl:text-[12px] 2xl:text-[14px] flex-nowrap w-full pb-2 px-4 whitespace-nowrap overflow-x-auto no-scrollbar">
            {mainNav.map((item) => {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.href === '/exclusive' ? '_blank' : undefined}
                  rel={item.href === '/exclusive' ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'transition-all duration-300',
                    item.href === '/inovamoda'
                      ? 'bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:bg-purple-500/20 text-white font-bold capitalize tracking-wide'
                      : item.href === '/inova-revenda'
                      ? 'bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:bg-amber-500/20 text-white font-bold capitalize tracking-wide'
                      : item.href === '/vitrine-inovadora'
                      ? 'bg-pink-500/10 border border-pink-500/30 px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(236,72,153,0.15)] hover:shadow-[0_0_25px_rgba(236,72,153,0.4)] hover:bg-pink-500/20 text-white font-bold capitalize tracking-wide'
                      : item.href === '/energia'
                      ? 'bg-amber-600/10 border border-amber-500/30 px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:bg-amber-600/20 text-white font-bold capitalize tracking-wide'
                      : item.href === '/nexus-empresas'
                      ? 'bg-cyan-600/10 border border-cyan-500/30 px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:bg-cyan-600/20 text-white font-bold capitalize tracking-wide'
                      : item.href === '/nexus-b2b'
                      ? 'bg-emerald-600/10 border border-emerald-500/30 px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:bg-emerald-600/20 text-white font-bold capitalize tracking-wide'
                      : item.href === '/agro'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:bg-emerald-500/20 text-white font-bold capitalize tracking-wide'
                      : item.href === '/exclusive'
                      ? 'bg-violet-500/10 border border-violet-500/30 px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(139,92,246,0.15)] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:bg-violet-500/20 text-white font-bold capitalize tracking-wide'
                      : item.href === '/nexus-rotas'
                      ? 'bg-teal-500/10 border border-teal-500/30 px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(20,184,166,0.15)] hover:shadow-[0_0_25px_rgba(20,184,166,0.4)] hover:bg-teal-500/20 text-white font-bold capitalize tracking-wide'
                      : item.href === '/proposito'
                      ? 'bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:bg-amber-500/20 text-white font-bold capitalize tracking-wide'
                      : pathname === item.href 
                        ? 'bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-md shadow-[0_0_10px_rgba(37,99,235,0.15)] text-foreground font-semibold capitalize tracking-wide' 
                        : 'bg-white/5 border border-white/5 px-3 py-1.5 rounded-md hover:bg-white/10 hover:border-white/10 text-foreground/70 hover:text-foreground font-medium capitalize tracking-wide'
                  )}
                >
                  {item.title}
                </Link>
              );
            })}

            {/* Menu Institucional / Agrupado */}
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:bg-amber-500/20 text-white font-bold flex items-center gap-1 transition-all duration-300 outline-none capitalize tracking-wide">
                Atendimento <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur border-primary/20">
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-primary/10">
                  <Link href="/contact" className="w-full">{t('navContato') || 'Contato Comercial'}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-primary/10">
                  <Link href="/suporte" className="w-full">{t('navSuporte') || 'Central de Suporte'}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          target={item.href === '/exclusive' ? '_blank' : undefined}
                          rel={item.href === '/exclusive' ? 'noopener noreferrer' : undefined}
                          onClick={() => {
                            if (item.href !== '/exclusive') {
                              setMobileMenuOpen(false);
                            }
                          }}
                          className={cn(
                            'flex items-center justify-between p-3 rounded-lg transition-all duration-200 group mb-1',
                            item.href === '/inovamoda'
                            ? 'bg-purple-500/10 text-white drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] font-bold border border-purple-500/50 capitalize tracking-wide'
                            : item.href === '/inova-revenda'
                            ? 'bg-amber-500/10 text-white drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] font-bold border border-amber-500/50 capitalize tracking-wide'
                            : item.href === '/vitrine-inovadora'
                            ? 'bg-pink-500/10 text-white drop-shadow-[0_0_8px_rgba(236,72,153,0.8)] font-bold border border-pink-500/50 capitalize tracking-wide'
                            : item.href === '/energia'
                            ? 'bg-amber-600/10 text-white drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] font-bold border border-amber-500/50 capitalize tracking-wide'
                            : item.href === '/nexus-empresas'
                            ? 'bg-cyan-600/10 text-white drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] font-bold border border-cyan-500/50 capitalize tracking-wide'
                            : item.href === '/nexus-b2b'
                            ? 'bg-emerald-600/10 text-white drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] font-bold border border-emerald-500/50 capitalize tracking-wide'
                            : item.href === '/agro'
                            ? 'bg-emerald-500/10 text-white drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] font-bold border border-emerald-500/50 capitalize tracking-wide'
                            : item.href === '/exclusive'
                            ? 'bg-violet-500/10 text-white drop-shadow-[0_0_8px_rgba(139,92,246,0.8)] font-bold border border-violet-500/50 capitalize tracking-wide'
                            : item.href === '/nexus-rotas'
                            ? 'bg-teal-500/10 text-white drop-shadow-[0_0_8px_rgba(20,184,166,0.8)] font-bold border border-teal-500/50 capitalize tracking-wide'
                            : item.href === '/proposito'
                            ? 'bg-amber-500/10 text-white drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] font-bold border border-amber-500/50 capitalize tracking-wide'
                            : item.href === '/about'
                            ? 'bg-blue-500/10 text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] font-bold border border-blue-500/50 capitalize tracking-wide'
                            : pathname === item.href
                                  ? 'bg-accent/20 text-foreground font-semibold capitalize tracking-wide'
                                  : 'text-foreground/70 hover:bg-accent/10 hover:text-foreground capitalize tracking-wide'
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

                    {/* Atendimento no Mobile */}
                    <details className="group/atendimento border border-amber-500/30 rounded-lg bg-amber-500/5 mt-1 mb-1 overflow-hidden shadow-[0_0_8px_rgba(245,158,11,0.1)]">
                      <summary className="cursor-pointer p-3 text-sm font-bold text-white tracking-wide hover:bg-amber-500/10 transition-colors list-none flex justify-between items-center [&::-webkit-details-marker]:hidden">
                        <span>Atendimento</span>
                        <ChevronDown className="h-4 w-4 transition-transform group-open/atendimento:rotate-180 text-amber-500" />
                      </summary>
                      <div className="flex flex-col gap-1 px-2 pb-2 bg-black/20">
                        <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between p-2 rounded-md text-white/80 hover:text-white hover:bg-amber-500/20 text-sm transition-colors group/sub">
                          <span>{t('navContato') || 'Contato Comercial'}</span>
                          <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all text-amber-500" />
                        </Link>
                        <Link href="/suporte" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between p-2 rounded-md text-white/80 hover:text-white hover:bg-amber-500/20 text-sm transition-colors group/sub">
                          <span>{t('navSuporte') || 'Central de Suporte'}</span>
                          <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all text-amber-500" />
                        </Link>
                      </div>
                    </details>
                  </nav>
                  <div className="p-4 mt-auto border-t border-border/50">
                    <details className="group border border-primary/20 rounded-lg bg-background/50 overflow-hidden">
                      <summary className="cursor-pointer flex items-center justify-between p-3 text-foreground font-bold hover:bg-primary/10 transition-colors list-none [&::-webkit-details-marker]:hidden">
                        <div className="flex items-center gap-3">
                          {user ? (
                            <>
                              <Avatar className="h-8 w-8 border border-primary/20">
                                <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">{userInitials}</AvatarFallback>
                              </Avatar>
                              <span className="truncate max-w-[150px]">{user.displayName || 'Usuário'}</span>
                            </>
                          ) : (
                            <>
                              <UserIcon className="h-5 w-5 text-primary" />
                              <span>Configurações</span>
                            </>
                          )}
                        </div>
                        <ArrowRight className="h-4 w-4 transition-transform group-open:rotate-90 text-primary" />
                      </summary>
                      
                      <div className="flex flex-col p-3 bg-black/30 border-t border-primary/20 gap-4">
                        <div className="grid grid-cols-2 gap-2">
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
                              className="gap-2 h-auto py-2 justify-start px-3 border-border/40 text-xs"
                            >
                              <img src={`https://flagcdn.com/w40/${lang.flag}.png`} width="20" alt={lang.label} className="rounded-sm" />
                              <span className="font-bold">{lang.label}</span>
                            </Button>
                          ))}
                        </div>

                        {isUserLoading ? (
                          <Skeleton className="h-10 w-full" />
                        ) : user ? (
                          <div className="flex flex-col gap-2 border-t border-border/30 pt-4">
                            <Button variant="outline" className="w-full justify-start border-border/40" asChild onClick={() => setMobileMenuOpen(false)}>
                              <Link href="/profile"><UserIcon className="mr-2 h-4 w-4" /> {t('userArea')}</Link>
                            </Button>
                            {isAdmin && (
                              <>
                                <details className="group/gabinete border border-primary/20 rounded-md bg-background/50 overflow-hidden">
                                  <summary className="cursor-pointer p-3 text-sm font-medium text-primary hover:bg-primary/10 transition-colors list-none flex justify-between items-center [&::-webkit-details-marker]:hidden">
                                    <span className="flex items-center gap-2"><Shield className="h-4 w-4" /> Gabinete Diretoria</span>
                                    <ArrowRight className="h-4 w-4 transition-transform group-open/gabinete:rotate-90" />
                                  </summary>
                                  <div className="p-2 flex flex-col gap-2 border-t border-primary/10 bg-black/20">
                                    <Button variant="ghost" className="w-full justify-start text-primary font-medium hover:bg-primary/10" asChild onClick={() => setMobileMenuOpen(false)}>
                                      <Link href="/gabinete"><Shield className="mr-2 h-4 w-4" /> {t('navGabinete')}</Link>
                                    </Button>

                                  </div>
                                </details>

                                <details className="group/comercial mt-2 border border-emerald-500/20 rounded-md bg-background/50 overflow-hidden">
                                  <summary className="cursor-pointer p-3 text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors list-none flex justify-between items-center [&::-webkit-details-marker]:hidden">
                                    <span className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> Área Comercial</span>
                                    <ArrowRight className="h-4 w-4 transition-transform group-open/comercial:rotate-90" />
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
                          <div className="flex flex-col space-y-2 border-t border-border/30 pt-4">
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className={cn(buttonVariants({ variant: 'default', className: 'w-full shadow-[0_0_15px_rgba(37,99,235,0.3)]' }))}>
                              <UserIcon className="mr-2 h-4 w-4" />
                              {t('login')}
                            </Link>
                            <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className={cn(buttonVariants({ variant: 'outline', className: 'w-full border-primary/50 text-primary' }))}>
                              Cadastrar / Criar Conta
                            </Link>
                          </div>
                        )}
                      </div>
                    </details>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
