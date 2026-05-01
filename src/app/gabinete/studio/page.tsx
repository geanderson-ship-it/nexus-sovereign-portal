'use client';

import React from 'react';
import { 
  GithubHeader, 
  GithubFileList, 
  GithubReadme, 
  GithubSidebar 
} from '@/components/gabinete/github-style-studio';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GitBranch, ChevronDown, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from '@/hooks/use-locale';
import { StudioNexusPro } from '@/components/gabinete/studio-nexus-pro';
import { LayoutDashboard, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StudioGabinetePage() {
  const { t } = useLocale();
  const [viewMode, setViewMode] = React.useState<'app' | 'git'>('app');

  return (
    <div className="min-h-screen bg-[#080b10] text-[#f0f6fc] font-sans selection:bg-blue-500/30">
      {/* View Toggle Bar */}
      <div className="bg-zinc-900/50 border-b border-zinc-800 px-4 py-2 flex justify-end gap-2 fixed top-0 left-0 right-0 z-[100] backdrop-blur-sm">
         <Button 
           size="sm" 
           variant={viewMode === 'app' ? 'default' : 'outline'}
           onClick={() => setViewMode('app')}
           className={cn(
             "h-7 text-[10px] uppercase font-black tracking-widest gap-2 transition-all",
             viewMode === 'app' ? "bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]" : "border-zinc-700 text-zinc-500 hover:text-white"
           )}
         >
           <LayoutDashboard className="h-3 w-3" /> Studio App
         </Button>
         <Button 
           size="sm" 
           variant={viewMode === 'git' ? 'default' : 'outline'}
           onClick={() => setViewMode('git')}
           className={cn(
             "h-7 text-[10px] uppercase font-black tracking-widest gap-2 transition-all",
             viewMode === 'git' ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "border-zinc-700 text-zinc-500 hover:text-white"
           )}
         >
           <Code2 className="h-3 w-3" /> Repository View
         </Button>
      </div>

      <div className="pt-11" style={{ height: 'calc(100vh - 44px)' }}>
        {viewMode === 'app' ? (
          <StudioNexusPro />
        ) : (
          <>
            {/* GitHub Style Header */}
            <GithubHeader />

      <main className="container mx-auto py-8 px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content (Left/Center) */}
          <div className="flex-1 min-w-0">
            
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex rounded-md overflow-hidden border border-zinc-700 shadow-sm">
                  <Button variant="ghost" size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 gap-2 border-r border-zinc-700 h-8 text-xs px-3">
                    <GitBranch className="h-4 w-4 text-zinc-500" /> main
                  </Button>
                  <Button variant="ghost" size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 h-8 text-xs px-2">
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
                  <span className="font-semibold text-zinc-200">1</span> <span className="hover:text-blue-400 cursor-pointer">branch</span>
                  <span className="text-zinc-700 mx-1">|</span>
                  <span className="font-semibold text-zinc-200">14</span> <span className="hover:text-blue-400 cursor-pointer">tags</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Go to file" 
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-md py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <Button size="sm" className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 gap-2 h-8 text-xs px-3">
                  Add file <ChevronDown className="h-3 w-3" />
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-500 text-white gap-2 h-8 text-xs px-3 font-bold">
                  <Plus className="h-4 w-4" /> {t('gabinete.studio.actions.newScript')}
                </Button>
              </div>
            </div>

            {/* File Explorer */}
            <GithubFileList />

            {/* Readme Section */}
            <GithubReadme />

          </div>

          {/* Sidebar (Right) */}
          <div className="w-full lg:w-72 space-y-8">
            <GithubSidebar />
          </div>

        </div>

        {/* Floating Back Button */}
        <div className="fixed bottom-8 left-8 z-50">
          <Button asChild variant="outline" className="rounded-full bg-zinc-900/80 backdrop-blur-md border-zinc-700 hover:bg-zinc-800 text-zinc-400 hover:text-white gap-2 shadow-xl">
            <Link href="/gabinete">
              <ArrowLeft className="h-4 w-4" /> {t('gabinete.studio.backToGabinete')}
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer (GitHub Style) */}
      <footer className="border-t border-zinc-800 py-10 mt-20">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
          <div className="flex items-center gap-4">
             <Image src="/logo-nexus-shield.png" alt="Nexus Shield" width={24} height={24} className="opacity-50 grayscale" />
             <span>© 2026 Nexus Intelligence Group.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <span className="hover:text-blue-400 cursor-pointer">Terms</span>
            <span className="hover:text-blue-400 cursor-pointer">Privacy</span>
            <span className="hover:text-blue-400 cursor-pointer">Security</span>
            <span className="hover:text-blue-400 cursor-pointer">Status</span>
            <span className="hover:text-blue-400 cursor-pointer">Docs</span>
            <span className="hover:text-blue-400 cursor-pointer">Contact</span>
          </div>
        </div>
      </footer>
        </>
      )}
      </div>
    </div>
  );
}
