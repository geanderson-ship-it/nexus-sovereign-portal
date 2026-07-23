'use client';

import Link from 'next/link';
import { Youtube, Facebook, Mail } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { usePathname } from 'next/navigation';

export function SiteFooter() {
  const { t } = useLocale();
  const pathname = usePathname() || '';
  const isExcluded = pathname.includes('/about') || pathname.includes('/proposito') || pathname.includes('/exclusive/egide');

  return (
    <footer className="border-t border-border/40 py-6 md:py-8 relative z-50 mt-12 space-y-12">
      
      {/* CARD WHATSAPP GLOBAL (NEXUS CYBER STYLE) */}
      <div className="container max-w-2xl mx-auto mb-12">
        <div className="bg-gradient-to-br from-[#080b10] via-[#021136] to-[#080b10] backdrop-blur-md border border-blue-500/40 rounded-3xl p-8 md:p-10 flex flex-col items-center text-center shadow-[0_0_40px_rgba(37,99,235,0.2)]">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-900 to-blue-600 border border-blue-400/50 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(59,130,246,0.6)] relative overflow-hidden group">
             {/* Efeito de brilho cibernético */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.8)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <svg className="w-10 h-10 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)] relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </div>
          <h3 className="text-2xl font-black text-white mb-3 drop-shadow-lg">Quer a tecnologia da Nexus na sua empresa?</h3>
          <p className="text-blue-200/80 text-sm leading-relaxed mb-8 max-w-lg font-medium">
            Fale agora com um especialista e descubra como implantar nossas soluções de Inteligência Artificial exclusivas no seu negócio. Atendimento imediato via WhatsApp.
          </p>
          <button
            onClick={() => window.open('https://wa.me/5551999799582?text=Ol%C3%A1!%20Tenho%20interesse%20nas%20solu%C3%A7%C3%B5es%20da%20Nexus%20Holding%20Group.%20Pode%20me%20enviar%20mais%20informa%C3%A7%C3%B5es%3F', '_blank')}
            className="relative flex items-center gap-3 bg-gradient-to-r from-blue-700 to-[#021136] border border-blue-400/50 hover:from-blue-600 hover:to-blue-900 text-yellow-400 hover:text-yellow-300 font-bold px-10 py-5 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.7)] text-sm uppercase tracking-[0.15em] overflow-hidden group"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <svg className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span className="relative z-10 text-yellow-400">Falar com Especialista</span>
          </button>
        </div>
      </div>

      {/* CARD AGENDA GLOBAL (NEXUS CYBER GOLD STYLE) */}
      {!isExcluded && (
        <div className="container max-w-2xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-[#080b10] via-[#3f2b05]/30 to-[#080b10] backdrop-blur-md border border-amber-500/30 rounded-3xl p-8 md:p-10 flex flex-col items-center text-center shadow-[0_0_40px_rgba(234,179,8,0.15)]">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-900/60 to-amber-600/40 border border-amber-400/30 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(234,179,8,0.3)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.5)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <svg className="w-10 h-10 text-amber-400 drop-shadow-[0_0_12px_rgba(234,179,8,0.5)] relative z-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-white mb-3 drop-shadow-lg">Agendamento de Demonstração Soberana</h3>
            <p className="text-amber-200/80 text-sm leading-relaxed mb-8 max-w-lg font-medium">
              Escolha de forma rápida o melhor dia e horário na nossa agenda oficial integrada para receber atendimento exclusivo de 1 hora.
            </p>
            <Link
              href="/agenda"
              className="relative flex items-center justify-center gap-3 bg-gradient-to-r from-amber-700/80 to-[#1f1704] border border-amber-400/40 hover:from-amber-600 hover:to-amber-900 text-yellow-400 hover:text-yellow-300 font-bold px-10 py-5 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_40px_rgba(234,179,8,0.4)] text-sm uppercase tracking-[0.15em] overflow-hidden group w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10">Reservar Data & Hora</span>
            </Link>
          </div>
        </div>
      )}

      {/* Salvaguarda Jurídica Global Nexus */}
      <div className="container">
        <LegalSafeguard />
      </div>

      <div className="container flex flex-col items-center justify-between gap-6 bg-black/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col items-center gap-5">
            <div className="flex flex-col items-center">
                <span className="font-headline text-2xl font-black uppercase tracking-[0.2em] text-blue-500 drop-shadow-md">
                    Nexus Treinamento
                </span>
                <span className="text-sm font-bold italic text-yellow-400 mt-1 drop-shadow-sm">
                    {t('footerSlogan')}
                </span>
            </div>
          <div className="text-center text-sm leading-relaxed text-yellow-400 font-bold drop-shadow-md space-y-1">
            <p>{t('footerRights')}</p>
            <p>CNPJ: 62.938.531/0001-87 | geanderson@nexustreinamento.com</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm font-bold text-yellow-400 drop-shadow-md pt-4 md:pt-0">
          <Link href="/brand-assets" className="transition-colors hover:text-yellow-300">
            {t('footerBrand')}
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-yellow-300">
            {t('footerPrivacy')}
          </Link>
          <Link href="/terms" className="transition-colors hover:text-yellow-300">
            {t('footerTerms')}
          </Link>
          <div className="flex items-center gap-5 ml-2">
            <a
              href="https://www.facebook.com/nexustreinamento/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110"
            >
              <Facebook className="h-6 w-6 text-[#1877F2] drop-shadow-sm" />
              <span className="sr-only">Facebook</span>
            </a>
            <a
              href="https://www.youtube.com/@NexusCursoseTreinamento"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110"
            >
              <Youtube className="h-6 w-6 text-[#FF0000] drop-shadow-sm" />
              <span className="sr-only">YouTube</span>
            </a>
            <a
                href="mailto:geanderson@nexustreinamento.com"
                className="transition-transform hover:scale-110 text-yellow-400 drop-shadow-md hover:text-yellow-300"
            >
                <Mail className="h-6 w-6" />
                <span className="sr-only">E-mail</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
