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

    // Se existir um diferente, remove
    if (existingManifest) {
      existingManifest.remove();
    }

    // Injeta o novo manifesto secreto
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = manifestUrl;
    document.head.appendChild(link);

    return () => {
      // Quando sair do módulo protegido, remove o manifesto
      link.remove();
    };
  }, [manifestUrl]);

  return null;
}
