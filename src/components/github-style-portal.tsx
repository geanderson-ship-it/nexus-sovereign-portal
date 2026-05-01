'use client';

import React from 'react';
import { 
  FileText, 
  Folder, 
  BookOpen, 
  Star, 
  GitFork, 
  Eye, 
  ChevronDown,
  Info,
  History,
  Shield,
  Circle,
  Code2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function PortalGithubHeader() {
  return (
    <div className="bg-[#0d1117] border-b border-zinc-800 pt-8 pb-4">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xl">
            <Image src="https://i.postimg.cc/t4nTCxJZ/Nexus-studio.png" alt="Nexus Logo" width={40} height={40} className="object-contain" />
            <span className="text-zinc-500">/</span>
            <span className="text-blue-400 hover:underline cursor-pointer">Nexus-Holding-Group</span>
            <span className="text-zinc-500">/</span>
            <span className="font-bold hover:underline cursor-pointer">nexus-sovereign-portal</span>
            <span className="ml-2 px-2 py-0.5 text-xs border border-zinc-700 rounded-full text-zinc-500 font-medium">Public</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-md text-xs font-medium hover:bg-zinc-800 transition-colors">
              <Eye className="h-4 w-4" /> Watch <span className="px-1.5 bg-zinc-800 rounded-full text-[10px]">128</span> <ChevronDown className="h-3 w-3" />
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-md text-xs font-medium hover:bg-zinc-800 transition-colors">
              <GitFork className="h-4 w-4" /> Fork <span className="px-1.5 bg-zinc-800 rounded-full text-[10px]">42</span> <ChevronDown className="h-3 w-3" />
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-md text-xs font-medium hover:bg-zinc-800 transition-colors">
              <Star className="h-4 w-4 text-yellow-500" /> Star <span className="px-1.5 bg-zinc-800 rounded-full text-[10px]">1.2k</span> <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>

        <nav className="flex items-center gap-6 mt-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 px-1 pb-3 border-b-2 border-orange-500 text-sm font-semibold">
            <Code2 className="h-4 w-4" /> Code
          </div>
          <div className="flex items-center gap-2 px-1 pb-3 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
            <Circle className="h-3 w-3" /> Issues <span className="px-1.5 bg-zinc-800 rounded-full text-[10px]">14</span>
          </div>
          <div className="flex items-center gap-2 px-1 pb-3 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
            <GitFork className="h-4 w-4" /> Pull requests <span className="px-1.5 bg-zinc-800 rounded-full text-[10px]">4</span>
          </div>
          <div className="flex items-center gap-2 px-1 pb-3 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
            <History className="h-4 w-4" /> Actions
          </div>
          <div className="flex items-center gap-2 px-1 pb-3 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
            <Shield className="h-4 w-4" /> Security
          </div>
        </nav>
      </div>
    </div>
  );
}

export function PortalFileList() {
  const files = [
    { name: 'src/app', type: 'folder', message: 'feat: implement sovereign portal entry points', time: '1 hour ago' },
    { name: 'src/intelligence', type: 'folder', message: 'refactor: unify AI core flows and locution systems', time: '14 mins ago' },
    { name: 'src/gabinete', type: 'folder', message: 'feat: add GitHub-style view for command center', time: '32 mins ago' },
    { name: 'src/components', type: 'folder', message: 'style: align branding and premium visual patterns', time: '5 mins ago' },
    { name: 'src/hooks', type: 'folder', message: 'feat: add use-announcer for radio automation', time: '45 mins ago' },
    { name: 'src/ai', type: 'folder', message: 'chore: update Dante and Djeny logic layers', time: '2 hours ago' },
    { name: 'public/assets', type: 'folder', message: 'chore: optimize high-fidelity media assets', time: '1 day ago' },
    { name: 'README.md', type: 'file', message: 'docs: update portal architecture and roadmap', time: 'Just now' },
    { name: 'next.config.mjs', type: 'file', message: 'build: configure AWS Bedrock and Polly integration', time: '3 days ago' },
    { name: 'tailwind.config.ts', type: 'file', message: 'style: add Nexus premium color palette', time: '2 weeks ago' },
  ];

  return (
    <div className="border border-zinc-800 rounded-md overflow-hidden bg-[#0d1117] mb-8 shadow-sm">
      <div className="bg-[#161b22] p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">N</div>
          <span className="text-xs font-semibold hover:text-blue-400 cursor-pointer">nexus-architect</span>
          <span className="text-xs text-zinc-400">Initialize Nexus Sovereign Portal with unified command structure</span>
        </div>
        <div className="text-xs text-zinc-500">
          <span className="font-semibold text-zinc-300">a1b2c3d</span> Just now
        </div>
      </div>
      
      <div className="divide-y divide-zinc-800">
        {files.map((file) => (
          <div key={file.name} className="flex items-center p-3 hover:bg-zinc-800/30 transition-colors group">
            <div className="w-8 flex justify-center">
              {file.type === 'folder' ? (
                <Folder className="h-4 w-4 text-blue-400 fill-blue-400/20" />
              ) : (
                <FileText className="h-4 w-4 text-zinc-500" />
              )}
            </div>
            <div className="w-1/4 min-w-[200px]">
              <span className="text-sm hover:text-blue-400 hover:underline cursor-pointer">
                {file.name}
              </span>
            </div>
            <div className="flex-1 truncate pr-4">
              <span className="text-xs text-zinc-400 group-hover:text-zinc-300">
                {file.message}
              </span>
            </div>
            <div className="text-xs text-zinc-500 whitespace-nowrap">
              {file.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PortalReadme() {
  return (
    <div className="border border-zinc-800 rounded-md overflow-hidden bg-[#0d1117]">
      <div className="bg-[#161b22] p-3 border-b border-zinc-800 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-zinc-500" />
        <span className="text-xs font-semibold">README.md</span>
      </div>
      <div className="p-8 md:p-12 prose prose-invert max-w-none">
        <div className="flex items-center justify-center mb-12">
            <Image 
                src="https://i.postimg.cc/t4nTCxJZ/Nexus-studio.png" 
                alt="Nexus Sovereign Portal" 
                width={500} 
                height={150} 
                className="object-contain"
            />
        </div>

        <h1 className="text-4xl font-bold border-b border-zinc-800 pb-4 mb-6">Nexus Sovereign Portal</h1>
        
        <p className="text-zinc-400 mb-8 text-xl leading-relaxed">
          O Portal Soberano da Nexus Holding Group é a interface definitiva de convergência entre inteligência artificial, gestão estratégica e treinamento de elite. Este ecossistema foi projetado para sustentar a soberania operacional da holding através de sistemas autônomos de decisão e broadcasting.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 hover:border-primary/40 transition-colors">
            <h3 className="text-primary font-bold mb-3 flex items-center gap-2">💎 Nexus Treinamento</h3>
            <p className="text-xs text-zinc-500">Desenvolvimento de talentos, palestras de alto impacto e consultoria de vanguarda.</p>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 hover:border-blue-400/40 transition-colors">
            <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">🛡️ Nexus Intelligence</h3>
            <p className="text-xs text-zinc-500">Núcleo de IAs soberanas (Dante e Djeny) para controle de produção, compras e auditoria.</p>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 hover:border-amber-400/40 transition-colors">
            <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2">🎙️ Studio Nexus</h3>
            <p className="text-xs text-zinc-500">Plataforma de broadcasting neural para automação de rádio e comunicação de marca.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold border-b border-zinc-800 pb-2 mb-4">Arquitetura do Sistema</h2>
        <p className="text-zinc-400 mb-6">
          Desenvolvido com Next.js 14 e integrado aos motores neurais da Amazon (Bedrock e Polly), o portal utiliza uma arquitetura de microsserviços internos unificados pelo Gabinete de Comando.
        </p>

        <div className="bg-zinc-900/30 p-6 rounded border border-zinc-800 mb-12">
          <h4 className="text-sm font-bold text-zinc-300 mb-4 uppercase tracking-widest">Key Repositories & Modules</h4>
          <ul className="text-sm text-zinc-400 space-y-3">
            <li className="flex items-center justify-between">
              <span className="hover:text-blue-400 cursor-pointer">/gabinete/studio</span>
              <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded">Operational</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="hover:text-blue-400 cursor-pointer">/intelligence/dante</span>
              <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded">Active</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="hover:text-blue-400 cursor-pointer">/intelligence/djeny</span>
              <span className="text-[10px] bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded">Active</span>
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-800 pt-6">
          <span>© 2026 Nexus Holding Group. Soberania e Convergência.</span>
          <div className="flex gap-4">
            <span className="hover:text-zinc-300 cursor-pointer">Docs</span>
            <span className="hover:text-zinc-300 cursor-pointer">Support</span>
            <span className="hover:text-zinc-300 cursor-pointer">API</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PortalGithubSidebar() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-2">About</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          The Sovereign Portal of Nexus Holding Group. Unifying training, intelligence, and broadcasting under a single sovereign operational interface.
        </p>
      </div>

      <div className="border-t border-zinc-800 pt-6">
        <h3 className="text-sm font-semibold mb-3">Releases <span className="px-1.5 bg-zinc-800 rounded-full text-[10px] text-zinc-500 ml-1">v3.0.0-gold</span></h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-sm font-medium hover:text-blue-400 cursor-pointer">Latest Release</span>
        </div>
      </div>

      <div className="border-t border-zinc-800 pt-6">
        <h3 className="text-sm font-semibold mb-3">Deployment Status</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">AWS Amplify</span>
            <span className="text-green-500 font-bold">LIVE</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">AWS Bedrock</span>
            <span className="text-blue-400 font-bold">READY</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">Firebase DB</span>
            <span className="text-emerald-500 font-bold">SYNCED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
