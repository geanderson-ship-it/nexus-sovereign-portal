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
  Circle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function GabineteGithubHeader() {
  return (
    <div className="bg-[#0d1117] border-b border-zinc-800 pt-8 pb-4">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xl">
            <Image src="https://i.postimg.cc/t4nTCxJZ/Nexus-studio.png" alt="Nexus Logo" width={40} height={40} className="object-contain" />
            <span className="text-zinc-500">/</span>
            <span className="text-blue-400 hover:underline cursor-pointer">Nexus-Intelligence</span>
            <span className="text-zinc-500">/</span>
            <span className="font-bold hover:underline cursor-pointer">Gabinete-de-Comando</span>
            <span className="ml-2 px-2 py-0.5 text-xs border border-zinc-700 rounded-full text-zinc-500 font-medium">Public</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-md text-xs font-medium hover:bg-zinc-800 transition-colors">
              <Eye className="h-4 w-4" /> Watch <span className="px-1.5 bg-zinc-800 rounded-full text-[10px]">12</span> <ChevronDown className="h-3 w-3" />
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-md text-xs font-medium hover:bg-zinc-800 transition-colors">
              <GitFork className="h-4 w-4" /> Fork <span className="px-1.5 bg-zinc-800 rounded-full text-[10px]">3</span> <ChevronDown className="h-3 w-3" />
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-md text-xs font-medium hover:bg-zinc-800 transition-colors">
              <Star className="h-4 w-4 text-yellow-500" /> Star <span className="px-1.5 bg-zinc-800 rounded-full text-[10px]">48</span> <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>

        <nav className="flex items-center gap-6 mt-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 px-1 pb-3 border-b-2 border-orange-500 text-sm font-semibold">
            <FileText className="h-4 w-4" /> Code
          </div>
          <div className="flex items-center gap-2 px-1 pb-3 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
            <Circle className="h-3 w-3" /> Issues <span className="px-1.5 bg-zinc-800 rounded-full text-[10px]">2</span>
          </div>
          <div className="flex items-center gap-2 px-1 pb-3 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
            <GitFork className="h-4 w-4" /> Pull requests <span className="px-1.5 bg-zinc-800 rounded-full text-[10px]">1</span>
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

export function GabineteFileList() {
  const files = [
    { name: 'intelligence', type: 'folder', message: 'feat: update Maga Live neural voice processing', time: '2 hours ago' },
    { name: 'gabinete', type: 'folder', message: 'fix: align Nexus Studio dashboard header', time: '14 mins ago' },
    { name: 'assets', type: 'folder', message: 'chore: add new high-fidelity avatars', time: '2 days ago' },
    { name: 'config', type: 'folder', message: 'docs: update environment variables for weather API', time: '1 day ago' },
    { name: 'CONTRIBUTING.md', type: 'file', message: 'docs: update contribution guidelines', time: '1 month ago' },
    { name: 'LICENSE', type: 'file', message: 'initial commit: MIT License', time: '3 months ago' },
    { name: 'README.md', type: 'file', message: 'docs: finalize gabinete overview and setup', time: '10 mins ago' },
    { name: 'package.json', type: 'file', message: 'build: add axios and polly dependencies', time: '22 mins ago' },
  ];

  return (
    <div className="border border-zinc-800 rounded-md overflow-hidden bg-[#0d1117] mb-8 shadow-sm">
      <div className="bg-[#161b22] p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">N</div>
          <span className="text-xs font-semibold hover:text-blue-400 cursor-pointer">nexus-admin</span>
          <span className="text-xs text-zinc-400">Restored Studio Nexus Broadcast system and aligned dashboard header</span>
        </div>
        <div className="text-xs text-zinc-500">
          <span className="font-semibold text-zinc-300">44fea2e</span> 10 mins ago
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
            <div className="w-1/4 min-w-[150px]">
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

export function GabineteReadme() {
  return (
    <div className="border border-zinc-800 rounded-md overflow-hidden bg-[#0d1117]">
      <div className="bg-[#161b22] p-3 border-b border-zinc-800 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-zinc-500" />
        <span className="text-xs font-semibold">README.md</span>
      </div>
      <div className="p-8 md:p-12 prose prose-invert max-w-none">
        <div className="flex items-center justify-center mb-8">
            <Image 
                src="https://i.postimg.cc/t4nTCxJZ/Nexus-studio.png" 
                alt="Nexus Studio Logo" 
                width={400} 
                height={120} 
                className="object-contain"
            />
        </div>

        <h1 className="text-3xl font-bold border-b border-zinc-800 pb-4 mb-6">Nexus Gabinete de Comando</h1>
        
        <p className="text-zinc-400 mb-6 text-lg">
          Bem-vindo ao núcleo de operações da Nexus Holding Group. Este repositório centraliza toda a infraestrutura de inteligência artificial, broadcasting e gestão estratégica do ecossistema Nexus.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-blue-400 font-bold mb-2">🎙️ Broadcasting & Media</h3>
            <ul className="text-sm text-zinc-400 space-y-2">
              <li>• Studio Nexus Pro: Automação de rádio AI</li>
              <li>• Maga Live: Avatares de alta fidelidade</li>
              <li>• Orion Live: Assistência em tempo real</li>
            </ul>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-emerald-400 font-bold mb-2">🛡️ Gestão Estratégica (Dante)</h3>
            <ul className="text-sm text-zinc-400 space-y-2">
              <li>• Dante Compras: Negociação e Suprimentos</li>
              <li>• Dante Auditor: Controle de Qualidade</li>
              <li>• Dante PCP: Maestro de Produção</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold border-b border-zinc-800 pb-2 mb-4">Tech Stack</h2>
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs">Next.js 14</span>
          <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs">TypeScript</span>
          <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs">Tailwind CSS</span>
          <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs">AWS Polly</span>
          <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs">AWS Bedrock</span>
          <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs">Firebase</span>
        </div>

        <h2 className="text-2xl font-bold border-b border-zinc-800 pb-2 mb-4">Status do Sistema</h2>
        <div className="bg-zinc-900/30 p-4 rounded border border-zinc-800 text-sm text-zinc-400">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>All systems operational</span>
          </div>
          <div className="text-xs text-zinc-500">Última atualização: {new Date().toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

export function GabineteGithubSidebar() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-2">About</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          The central hub for Nexus Intelligence operations. Porting the professional Studio Nexus broadcast suite and unifiying elite command modules.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="flex items-center gap-1 text-xs text-zinc-400 hover:text-blue-400 cursor-pointer">
            <Info className="h-3 w-3" /> nexus-intelligence.com
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800 pt-6">
        <h3 className="text-sm font-semibold mb-3">Releases <span className="px-1.5 bg-zinc-800 rounded-full text-[10px] text-zinc-500 ml-1">v2.4.0</span></h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-sm font-medium hover:text-blue-400 cursor-pointer">Latest</span>
        </div>
        <p className="text-xs text-zinc-500 mt-1">Nexus Gabinete Elite Command Release</p>
      </div>

      <div className="border-t border-zinc-800 pt-6">
        <h3 className="text-sm font-semibold mb-3">Languages</h3>
        <div className="space-y-3">
          <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden flex">
            <div className="h-full bg-blue-500" style={{ width: '70%' }}></div>
            <div className="h-full bg-purple-500" style={{ width: '20%' }}></div>
            <div className="h-full bg-orange-500" style={{ width: '10%' }}></div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="font-medium">TypeScript</span>
              <span className="text-zinc-500">70.2%</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="font-medium">JavaScript</span>
              <span className="text-zinc-500">19.8%</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className="font-medium">CSS</span>
              <span className="text-zinc-500">10.0%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
