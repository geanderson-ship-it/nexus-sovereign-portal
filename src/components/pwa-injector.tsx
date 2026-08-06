'use client';

import { useEffect } from 'react';

export function PWAManifestInjector({ manifestUrl }: { manifestUrl: string }) {
  useEffect(() => {
    // Procura se já existe um manifesto global
    const existingManifest = document.querySelector('link[rel="manifest"]');
    
    // Se a URL já for a mesma, não faz nada
    if (existingManifest && existingManifest.getAttribute('href') === manifestUrl) {
      return;
    }

    let originalHref: string | null = null;
    let customLink: HTMLLinkElement | null = null;

    if (existingManifest) {
      // Em vez de deletar o elemento gerenciado pelo Next.js, apenas alteramos o href e guardamos o original
      originalHref = existingManifest.getAttribute('href');
      existingManifest.setAttribute('href', manifestUrl);
    } else {
      // Se não existir, criamos um novo
      customLink = document.createElement('link');
      customLink.rel = 'manifest';
      customLink.href = manifestUrl;
      document.head.appendChild(customLink);
    }

    return () => {
      // Ao desmontar, restaura o estado original sem alterar a estrutura do DOM do Next.js
      if (existingManifest && originalHref) {
        existingManifest.setAttribute('href', originalHref);
      } else if (customLink) {
        customLink.remove();
      }
    };
  }, [manifestUrl]);

  return null;
}
