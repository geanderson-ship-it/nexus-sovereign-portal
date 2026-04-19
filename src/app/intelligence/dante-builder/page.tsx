
'use client';

import { ArrowLeft, Cpu } from 'lucide-react';
import Link from 'next/link';
import DanteBuilderChat from '@/components/dante-builder-chat';

export default function DanteBuilderPage() {
  return (
    <div className="flex flex-col h-full text-white">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/intelligence">
          <ArrowLeft className="h-6 w-6 hover:text-cyan-400 transition-colors" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-cyan-400 font-headline uppercase italic flex items-center gap-2">
            <Cpu className="h-6 w-6" /> Terminal Dante Builder
          </h1>
          <p className="text-sm text-gray-500 font-mono tracking-widest uppercase">
            Engenharia de Aberturas e Esquadrias de Elite.
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center p-4">
        <DanteBuilderChat />
      </div>
    </div>
  );
}
