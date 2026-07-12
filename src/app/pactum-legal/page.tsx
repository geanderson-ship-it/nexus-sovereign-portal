"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Scale, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PactumLegalPage() {
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([
    { role: 'assistant', content: 'Saudações. Eu sou Justine, Consultora Jurídica Chefe e Compliance Officer da Nexus Holding. Por favor, apresente o contrato ou a tese de negócio para que eu possa iniciar a auditoria de riscos legais e compliance.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/justine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, sessionId: 'pactum_geanderson' })
      });
      const data = await res.json();

      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Saudações. Vejo que você ainda não entrou em contato formalmente com a Nexus. Entre em contato com nossos consultores para que eu possa ter a autorização de auditar, proteger e ajudar você em suas operações." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Saudações. Vejo que você ainda não entrou em contato formalmente com a Nexus. Entre em contato com nossos consultores para que eu possa ter a autorização de auditar, proteger e ajudar você em suas operações." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0c] text-[#e0e0e0] font-serif">
      {/* Header Premium */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-[#cca752]/20 bg-[#0f0f13] shadow-md shadow-black/50">
        <div className="flex items-center gap-6">
          <Link href="/exclusive/pactum" className="p-2 bg-[#1a1a24] hover:bg-[#2a2a35] border border-[#2a2a35] rounded-lg transition-colors flex items-center justify-center group">
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-2 bg-[#cca752]/10 rounded-lg border border-[#cca752]/30">
              <Scale className="w-7 h-7 text-[#cca752]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-widest text-[#cca752] uppercase">Pactum Legal</h1>
              <p className="text-xs text-[#8c8c8c] tracking-widest uppercase mt-1">Nexus Holding • Compliance & Jurídico</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-green-700" />
          <span className="text-xs font-sans font-bold text-green-700 tracking-widest uppercase">Sistema Blindado</span>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl w-full mx-auto font-sans">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-xl p-5 shadow-lg ${
              msg.role === 'user' 
                ? 'bg-[#1a1a24] border border-[#2a2a35] text-gray-200 rounded-tr-none' 
                : 'bg-gradient-to-br from-[#121217] to-[#0a0a0c] border border-[#cca752]/30 text-gray-300 rounded-tl-none'
            }`}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-3 mb-3 border-b border-[#cca752]/20 pb-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#cca752]/50 shadow-[0_0_10px_rgba(204,167,82,0.2)] shrink-0">
                    <img src="/justine-avatar.jpg" alt="Justine" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#cca752] uppercase tracking-wider block">Justine</span>
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Chief Legal Officer</span>
                  </div>
                </div>
              )}
              <div className="whitespace-pre-wrap leading-relaxed text-sm">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#121217] border border-[#cca752]/30 rounded-xl rounded-tl-none p-5 shadow-lg flex items-center gap-3">
              <div className="w-2 h-2 bg-[#cca752] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#cca752] rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-[#cca752] rounded-full animate-bounce delay-200"></div>
              <span className="ml-2 text-xs text-[#cca752]/70 uppercase tracking-widest">Analisando Riscos...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="p-6 bg-[#0f0f13] border-t border-[#cca752]/20 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#cca752]/50" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Cole a cláusula de contrato ou descreva a operação..."
            className="w-full bg-[#16161c] border border-[#cca752]/30 rounded-xl py-4 pl-12 pr-16 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#cca752] focus:ring-1 focus:ring-[#cca752]/50 transition-all font-sans text-sm disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#cca752] hover:bg-[#e6c16c] text-[#0a0a0c] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="text-[10px] text-gray-600 tracking-widest uppercase font-sans">Confidencial • Nexus Holding Legal Department</p>
        </div>
      </footer>
    </div>
  );
}
