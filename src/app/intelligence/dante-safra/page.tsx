
'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import DanteSafraChat from '@/components/dante-safra-chat';

export default function DanteSafraPage() {
  return (
    <div className="flex flex-col h-full text-white">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/intelligence">
          <ArrowLeft className="h-6 w-6 hover:text-emerald-400 transition-colors" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-emerald-300 font-headline">
            Terminal Dante Safra
          </h1>
          <p className="text-lg text-gray-400">
            Inteligência de precisão para o agronegócio.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <DanteSafraChat />
      </div>
    </div>
  );
}
