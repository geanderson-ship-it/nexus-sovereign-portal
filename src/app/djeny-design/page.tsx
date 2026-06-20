'use client';

import { DjenyDesignModule } from '@/components/gabinete/djeny-design-module';
import { Sparkles, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AuthGate from '@/components/auth-gate';

export default function DjenyDesignStandalone() {
  return (
    <AuthGate requiredLevel="ADMIN">
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      
      {/* HUD Header for Standalone */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-4 px-2">
         <div className="flex items-center gap-2">
             <Sparkles className="h-6 w-6 text-pink-500 shadow-[0_0_8px_theme(colors.pink.500)]" />
             <h1 className="text-xl font-headline font-bold text-white tracking-widest uppercase">Djeny Design Studio</h1>
         </div>
         <Button variant="ghost" asChild className="text-gray-500 hover:text-white">
            <Link href="/intelligence">
                <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
            </Link>
         </Button>
      </div>

      <div className="w-full max-w-4xl h-[85vh]">
          <DjenyDesignModule />
      </div>

       <p className="mt-4 text-[10px] text-gray-600 uppercase tracking-widest">
         Nexus Intelligence // Retrofit Edition
       </p>
      </div>
    </AuthGate>
  );
}
