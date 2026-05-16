'use client';

import React from 'react';
import {
  FileCode,
  GitBranch,
  Star,
  GitFork,
  Eye,
  BookOpen,
  Terminal,
  Search,
  ChevronDown,
  History,
  Play,
  Settings,
  MoreHorizontal,
  Info,
  ExternalLink,
  Code2,
  AlertCircle,
  PlayCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useLocale } from '@/hooks/use-locale';

export function GithubHeader() {
  const { t } = useLocale();
  return (
    <div className="bg-zinc-950/60 border-b border-white/10 pt-4 px-4 md:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-xl font-headline">
          <BookOpen className="h-5 w-5 text-zinc-400" />
          <span className="text-blue-400 hover:underline cursor-pointer">{t('gabinete.studio.owner')}</span>
          <span className="text-zinc-500">/</span>
          <span className="text-white font-bold hover:underline cursor-pointer">{t('gabinete.studio.title')}</span>
          <Badge variant="outline" className="ml-2 border-zinc-700 text-zinc-400 font-mono text-[10px]">Public</Badge>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-md overflow-hidden border border-zinc-700 shadow-sm">
            <Button variant="ghost" size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 gap-2 border-r border-zinc-700 h-8 text-xs px-3">
              <Eye className="h-4 w-4" /> Watch <span className="bg-zinc-800 px-2 py-0.5 rounded-full text-[10px]">12</span>
            </Button>
            <Button variant="ghost" size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 h-8 text-xs px-2">
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex rounded-md overflow-hidden border border-zinc-700 shadow-sm">
            <Button variant="ghost" size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 gap-2 border-r border-zinc-700 h-8 text-xs px-3">
              <GitFork className="h-4 w-4" /> Fork <span className="bg-zinc-800 px-2 py-0.5 rounded-full text-[10px]">3</span>
            </Button>
            <Button variant="ghost" size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 h-8 text-xs px-2">
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex rounded-md overflow-hidden border border-zinc-700 shadow-sm">
            <Button variant="ghost" size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 gap-2 border-r border-zinc-700 h-8 text-xs px-3">
              <Star className="h-4 w-4 text-amber-400" /> Star <span className="bg-zinc-800 px-2 py-0.5 rounded-full text-[10px]">48</span>
            </Button>
            <Button variant="ghost" size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 h-8 text-xs px-2">
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto no-scrollbar">
        <TabItem icon={<Code2 className="h-4 w-4" />} label={t('gabinete.studio.tabs.code')} active />
        <TabItem icon={<AlertCircle className="h-4 w-4" />} label={t('gabinete.studio.tabs.issues')} count={2} />
        <TabItem icon={<GitBranch className="h-4 w-4" />} label={t('gabinete.studio.tabs.pullRequests')} />
        <TabItem icon={<PlayCircle className="h-4 w-4" />} label={t('gabinete.studio.tabs.actions')} />
        <TabItem icon={<Terminal className="h-4 w-4" />} label={t('gabinete.studio.tabs.projects')} />
        <TabItem icon={<BookOpen className="h-4 w-4" />} label={t('gabinete.studio.tabs.wiki')} />
        <TabItem icon={<Settings className="h-4 w-4" />} label={t('gabinete.studio.tabs.settings')} />
      </div>
    </div>
  );
}

function TabItem({ icon, label, active = false, count }: { icon: React.ReactNode, label: string, active?: boolean, count?: number }) {
  return (
    <div className={cn(
      "flex items-center gap-2 px-4 py-3 text-sm cursor-pointer border-b-2 transition-all",
      active
        ? "border-amber-500 text-white font-semibold"
        : "border-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
    )}>
      {icon}
      <span>{label}</span>
      {count !== undefined && (
        <span className="bg-zinc-800 px-1.5 py-0.5 rounded-full text-[10px]">{count}</span>
      )}
    </div>
  );
}

export function GithubFileList() {
  const { t } = useLocale();
  const files = [
    { name: 'src/components/studio-nexus-pro.tsx', message: 'fix: center main title and refine logo positioning', time: '14 mins ago', type: 'file' },
    { name: 'src/components/sequence-builder.tsx', message: 'feat: add marking to upload drop zone', time: '22 mins ago', type: 'file' },
    { name: 'src/app/globals.css', message: 'style: compact central cards and remove scrollbars', time: '8 mins ago', type: 'file' },
    { name: 'voices/camila-neural.voice', message: 'refactor: optimize speech patterns and stacking', time: '45 mins ago', type: 'file' },
    { name: 'config/station-identity.json', message: 'chore: update branding assets and scaling', time: '1 hour ago', type: 'file' },
  ];

  return (
    <div className="border border-zinc-800 rounded-md overflow-hidden bg-zinc-950/40">
      <div className="bg-zinc-900/80 p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">N</div>
          <span className="text-sm font-semibold text-zinc-200">nexus-bot</span>
          <span className="text-sm text-zinc-400 truncate max-w-[200px] md:max-w-md">Update radio locution engine logic</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <History className="h-3 w-3" />
          <span>1,248 commits</span>
        </div>
      </div>
      <div className="divide-y divide-zinc-800">
        {files.map((file) => (
          <div key={file.name} className="flex items-center justify-between p-3 hover:bg-zinc-800/50 cursor-pointer group transition-colors">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <FileCode className="h-4 w-4 text-zinc-500 group-hover:text-blue-400" />
              <span className="text-sm text-zinc-300 hover:text-blue-400 hover:underline truncate">{file.name}</span>
            </div>
            <div className="flex-1 hidden md:block px-4">
              <span className="text-sm text-zinc-500 truncate block">{file.message}</span>
            </div>
            <div className="text-sm text-zinc-500 text-right min-w-[100px]">
              {file.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GithubReadme() {
  const { t } = useLocale();
  return (
    <div className="border border-zinc-800 rounded-md overflow-hidden bg-zinc-950/40 mt-6">
      <div className="bg-zinc-900/80 p-3 border-b border-zinc-800 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-zinc-500" />
        <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">README.md</span>
      </div>
      <div className="p-8 space-y-6 text-zinc-300">
        <div className="relative w-full aspect-[21/9] rounded-lg overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
          <Image
            src="/Nexus Intelligence Studio/Nexus studio chumbo.png"
            alt="Nexus Intelligence Studio Cover"
            fill
            className="object-contain"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold font-headline text-white border-b border-zinc-800 pb-2">{t('gabinete.studio.readme.title')}</h1>
          <p className="text-lg text-zinc-400 italic">{t('gabinete.studio.readme.slogan')}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-amber-400 flex items-center gap-2">
                <Info className="h-5 w-5" /> {t('gabinete.studio.readme.overview')}
              </h2>
              <ul className="space-y-2 text-sm list-disc pl-5 marker:text-amber-500">
                <li><strong className="text-white">Name:</strong> Rádio Encanto FM</li>
                <li><strong className="text-white">Frequency:</strong> 100.1 FM</li>
                <li><strong className="text-white">Location:</strong> São Paulo, SP</li>
                <li><strong className="text-white">Voice Engine:</strong> Amazon Polly Neural (Camila/Thiago)</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
                <Terminal className="h-5 w-5" /> {t('gabinete.studio.readme.status')}
              </h2>
              <div className="bg-black/40 rounded-md p-4 font-mono text-xs border border-blue-500/20">
                <div className="flex justify-between mb-1"><span className="text-green-400">● SYSTEM_ONLINE</span> <span className="text-zinc-500">99.9% uptime</span></div>
                <div className="flex justify-between mb-1"><span className="text-blue-400">● BROADCAST_READY</span> <span className="text-zinc-500">v2.4.0</span></div>
                <div className="flex justify-between"><span className="text-amber-400">● LOCUTION_IDLE</span> <span className="text-zinc-500">Next: 12:00 PM</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-amber-600 hover:bg-amber-500 text-white font-bold gap-2">
              <Play className="h-4 w-4 fill-white" /> {t('gabinete.studio.actions.start')}
            </Button>
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-white/5 gap-2">
              <ExternalLink className="h-4 w-4" /> {t('gabinete.studio.actions.preview')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GithubSidebar() {
  const { t } = useLocale();
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-zinc-200 mb-3">{t('gabinete.studio.sidebar.about')}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          {t('gabinete.studio.sidebar.aboutDesc')}
        </p>
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Search className="h-3.5 w-3.5" />
            <span>radio-automation, neural-tts, nexus</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-300">
            <Eye className="h-3.5 w-3.5" />
            <span className="font-semibold">12</span> watching
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-300">
            <Star className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-semibold">48</span> stars
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-300">
            <GitFork className="h-3.5 w-3.5" />
            <span className="font-semibold">3</span> forks
          </div>
        </div>
      </div>

      <Separator className="bg-zinc-800" />

      <div>
        <h3 className="text-sm font-semibold text-zinc-200 mb-3">{t('gabinete.studio.sidebar.releases')}</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <Badge className="bg-green-600/20 text-green-400 border-green-600/30 text-[10px]">Latest</Badge>
            <div className="flex-1">
              <p className="text-xs font-bold text-zinc-200 hover:text-blue-400 cursor-pointer">v2.4.0 - Neural Polish</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">yesterday</p>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-blue-400 hover:underline cursor-pointer mt-4">+ 14 releases</p>
      </div>

      <Separator className="bg-zinc-800" />

      <div>
        <h3 className="text-sm font-semibold text-zinc-200 mb-3">{t('gabinete.studio.sidebar.languages')}</h3>
        <div className="h-2 w-full flex rounded-full overflow-hidden mb-3">
          <div className="bg-blue-500 h-full w-[60%]" title="TypeScript 60%" />
          <div className="bg-amber-500 h-full w-[25%]" title="Locution Script 25%" />
          <div className="bg-purple-500 h-full w-[15%]" title="JSON Config 15%" />
        </div>
        <div className="grid grid-cols-2 gap-y-2">
          <LanguageItem color="bg-blue-500" name="TypeScript" percentage="60.2%" />
          <LanguageItem color="bg-amber-500" name="Locution" percentage="25.8%" />
          <LanguageItem color="bg-purple-500" name="JSON" percentage="14.0%" />
        </div>
      </div>
    </div>
  );
}

function LanguageItem({ color, name, percentage }: { color: string, name: string, percentage: string }) {
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <div className={cn("h-2 w-2 rounded-full", color)} />
      <span className="text-zinc-200 font-semibold">{name}</span>
      <span className="text-zinc-500">{percentage}</span>
    </div>
  );
}
