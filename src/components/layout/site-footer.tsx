'use client';

import Link from 'next/link';
import { Youtube, Facebook, Mail } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';

export function SiteFooter() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-border/40 py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-6">
        <div className="flex flex-col items-center gap-5">
            <div className="flex flex-col items-center">
                <span className="font-headline text-2xl font-black uppercase tracking-[0.2em] text-blue-500 drop-shadow-md">
                    Nexus Treinamento
                </span>
                <span className="text-sm font-bold italic text-yellow-400 mt-1 drop-shadow-sm">
                    {t('footerSlogan')}
                </span>
            </div>
          <div className="text-center text-sm leading-relaxed text-yellow-500 font-medium space-y-1">
            <p>{t('footerRights')}</p>
            <p>CNPJ: 62.938.531/0001-87 | geanderson@nexustreinamento.com</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm font-semibold text-yellow-500 pt-4 md:pt-0">
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
                className="transition-transform hover:scale-110 text-yellow-500 hover:text-yellow-300"
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
