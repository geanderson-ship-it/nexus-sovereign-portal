'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Copy, Mail, ExternalLink, RefreshCw, Check, Sparkles, Send, ArrowLeft } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export default function AgendaGeradorPage() {
  // Estado do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [templateId, setTemplateId] = useState('turismo');
  
  // Estados de feedback
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  // Lista de templates oficiais da Nexus
  const templates: EmailTemplate[] = [
    {
      id: 'turismo',
      name: 'Inovação no Turismo (Prefeituras)',
      subject: 'Inovação no Turismo de {empresa}: Inteligência Artificial e Fortalecimento do Comércio Local',
      body: `Prezada {nome},

Tudo bem?

A Nexus Holding Group desenvolveu uma tecnologia pioneira focada no fortalecimento do comércio local e na atração de turistas municipais através de assistentes virtuais inteligentes interativos e IA aplicada.

Gostaríamos de realizar uma rápida demonstração virtual de 15 minutos para apresentar os resultados práticos dessa solução.

Para facilitar a escolha do melhor horário para você e sua equipe, geramos um link de agendamento exclusivo onde você pode escolher a data e o horário mais convenientes:

{link}

O link acima já está pré-identificado com suas informações, bastando apenas escolher o dia e confirmar. A sala de videoconferência segura será criada automaticamente pelo nosso sistema.

Ficamos no aguardo de sua confirmação.

Atenciosamente,

Equipe de Vendas
Nexus Holding Group`
    },
    {
      id: 'comercial',
      name: 'Apresentação Comercial Geral',
      subject: 'Parceria Estratégica Nexus Holding Group — {empresa}',
      body: `Prezada {nome},

Espero que este e-mail a encontre bem.

A Nexus Holding Group é líder no desenvolvimento de ecossistemas tecnológicos avançados e inteligência artificial voltados à automação de atendimento, inteligência de mercado e escala comercial.

Gostaríamos de propor uma breve reunião de 15 minutos para apresentar nosso portfólio de soluções e entender como podemos cooperar para a aceleração da {empresa}.

Para que possa escolher a data e horário de sua preferência com facilidade, disponibilizo nosso link de agendamento direto personalizado:

{link}

Seus dados já estão sincronizados com nossa agenda. Assim que você selecionar o horário ideal, o sistema reservará a sala de meet e enviará o convite de forma automática.

Desde já, agradeço pela atenção.

Atenciosamente,

Geanderson Leandro Schuh
Presidente-Diretor — Nexus Holding Group`
    },
    {
      id: 'followup',
      name: 'Follow-up / Acompanhamento',
      subject: 'Reunião de Apresentação de Soluções Nexus — {empresa}',
      body: `Olá, {nome}, tudo bem?

Estou passando para fazer um breve acompanhamento sobre a nossa conversa anterior sobre as soluções da Nexus Holding Group para a {empresa}.

Caso queira agendar a apresentação em um dia e horário de sua preferência para alinharmos os detalhes, basta acessar o link abaixo:

{link}

O link já está configurado com seus dados. É só clicar, escolher o horário e a sala de conferência virtual será reservada de imediato.

Qualquer dúvida, permaneço à inteira disposição.

Atenciosamente,

Equipe de Vendas
Nexus Holding Group`
    }
  ];

  // Gera o link de fricção zero com os parâmetros da URL
  const generateLink = () => {
    const baseUrl = 'https://nexustreinamento.com/agenda';
    const params = new URLSearchParams();
    
    if (nome.trim()) params.append('name', nome.trim());
    if (email.trim()) params.append('email', email.trim());
    if (empresa.trim()) params.append('company', empresa.trim());
    if (whatsapp.trim()) params.append('phone', whatsapp.trim());
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  // Processa o template substituindo as variáveis
  const getProcessedTemplate = () => {
    const selected = templates.find(t => t.id === templateId) || templates[0];
    const link = generateLink();
    
    const resolvedNome = nome.trim() || '[Nome do Cliente]';
    const resolvedEmpresa = empresa.trim() || '[Nome da Empresa]';
    
    let subject = selected.subject
      .replace(/{empresa}/g, resolvedEmpresa)
      .replace(/{nome}/g, resolvedNome);
      
    let body = selected.body
      .replace(/{nome}/g, resolvedNome)
      .replace(/{empresa}/g, resolvedEmpresa)
      .replace(/{link}/g, link);
      
    return { subject, body, link };
  };

  const { subject, body, link } = getProcessedTemplate();

  // Helper para abrir localmente no localhost em ambiente de teste
  const getTestLink = (url: string) => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return url.replace('https://nexustreinamento.com', 'http://localhost:3000');
    }
    return url;
  };

  // Copia o link de agendamento para o clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Converte o texto simples para HTML para suportar links clicáveis ao colar
  const getHtmlVersion = (textBody: string, linkUrl: string) => {
    let escaped = textBody
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
      
    if (linkUrl) {
      const escapedLink = linkUrl.replace(/&/g, '&amp;');
      escaped = escaped.replace(
        escapedLink, 
        `<a href="${escapedLink}" style="color: #2563eb; text-decoration: underline; font-weight: bold;">${escapedLink}</a>`
      );
    }
    
    const paragraphs = escaped.split('\n\n').map(p => {
      return `<p style="margin-bottom: 12px; font-family: sans-serif; font-size: 14px; color: #1e293b; line-height: 1.6;">${p.replace(/\n/g, '<br />')}</p>`;
    });
    
    return `<div style="font-family: sans-serif; max-width: 600px;">${paragraphs.join('')}</div>`;
  };

  // Copia o corpo do e-mail para o clipboard (Rich Text + HTML)
  const handleCopyBody = async () => {
    try {
      const htmlContent = getHtmlVersion(body, link);
      
      const blobHtml = new Blob([htmlContent], { type: 'text/html' });
      const blobText = new Blob([body], { type: 'text/plain' });
      
      const data = [
        new ClipboardItem({
          'text/html': blobHtml,
          'text/plain': blobText
        })
      ];
      
      await navigator.clipboard.write(data);
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    } catch (err) {
      // Fallback para navegadores sem suporte
      navigator.clipboard.writeText(body);
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    }
  };

  // Abre o Gmail com a mensagem pré-preenchida
  const handleOpenGmail = () => {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const encodedTo = encodeURIComponent(email.trim());
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
    window.open(gmailUrl, '_blank');
  };

  // Limpa o formulário
  const handleClear = () => {
    setNome('');
    setEmail('');
    setEmpresa('');
    setWhatsapp('');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden antialiased">
      {/* Background Cyber Tech Grid com Brilhos Dourados e Azuis */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER DE NAVEGAÇÃO */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1 text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <Image 
            src="/nexus-holding-group-logo.jpg" 
            alt="Nexus Holding Group Logo" 
            width={120} 
            height={36} 
            className="object-contain h-6 w-auto"
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-full font-semibold border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Outbound Sovereign
          </span>
        </div>
      </header>

      {/* DASHBOARD GRID */}
      <section className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* LADO ESQUERDO: ENTRADA DE DADOS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-amber-500" />
            
            <div className="mb-6">
              <h2 className="text-xl font-bold font-headline tracking-wide text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                Dados do Prospect
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Insira as informações do cliente para automatizar a montagem do e-mail e do link.
              </p>
            </div>

            <div className="space-y-4">
              {/* NOME */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Nome Completo</label>
                <input 
                  type="text" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Dáfhnne Rocha" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Endereço de E-mail</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: ger.turismo@urubici.sc.gov.br" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
                />
              </div>

              {/* EMPRESA */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Empresa / Prefeitura</label>
                <input 
                  type="text" 
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  placeholder="Ex: Prefeitura Municipal de Urubici" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
                />
              </div>

              {/* TELEFONE/WHATSAPP (OPCIONAL) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">WhatsApp/Telefone (Opcional)</label>
                <input 
                  type="text" 
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Ex: 49999998888" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
                />
              </div>

              {/* SELEÇÃO DE TEMPLATE */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Modelo de Mensagem</label>
                <select 
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/60 transition-all cursor-pointer"
                >
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* BOTÃO LIMPAR */}
              <div className="pt-2 flex justify-end">
                <button 
                  onClick={handleClear}
                  className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1 py-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Limpar Campos
                </button>
              </div>
            </div>
          </div>

          {/* BOX DE INFORMAÇÕES TÉCNICAS */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-5 text-xs text-slate-400 space-y-2">
            <span className="font-bold text-slate-300 block mb-1">Como funciona a Integração do Gmail:</span>
            <p>
              Ao clicar em <strong>"Enviar pelo Gmail"</strong>, uma nova janela de rascunho oficial do Google será aberta.
            </p>
            <p>
              O sistema detecta a sua sessão do Gmail logada e cria a mensagem instantaneamente. Certifique-se de estar logado na conta correta (<code className="text-blue-400">geanderson@</code> ou <code className="text-blue-400">vendas@</code>) no seu navegador.
            </p>
          </div>
        </div>

        {/* LADO DIREITO: PREVISÃO EM TEMPO REAL E AÇÕES */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* VISUALIZAÇÃO DO EMAIL */}
          <div className="flex-1 bg-slate-900/80 border border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col min-h-[480px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-850 mb-4">
              <span className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-450" />
                Live Preview do E-mail
              </span>
              <span className="text-xs text-emerald-450 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                Pronto para envio
              </span>
            </div>

            {/* ASSUNTO PREVIEW */}
            <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-3.5 mb-4 text-sm flex gap-2">
              <span className="text-slate-500 font-semibold select-none">Assunto:</span>
              <span className="text-white font-medium">{subject}</span>
            </div>

            {/* CORPO PREVIEW */}
            <div className="flex-1 bg-slate-950/80 border border-slate-850 rounded-xl p-4 text-sm font-mono text-slate-300 overflow-y-auto whitespace-pre-wrap leading-relaxed max-h-[350px]">
              {body.split(link).length === 2 ? (
                <>
                  {body.split(link)[0]}
                  <a 
                    href={getTestLink(link)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 hover:text-blue-300 hover:underline font-bold transition-all break-all"
                    title="Clique para testar o agendamento"
                  >
                    {link}
                  </a>
                  {body.split(link)[1]}
                </>
              ) : (
                body
              )}
            </div>

            {/* LINK GERADO PREVIEW */}
            <div className="mt-4 bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 text-xs flex items-center justify-between gap-3 overflow-hidden">
              <div className="truncate text-slate-400 flex items-center min-w-0">
                <span className="text-blue-400 font-bold select-none mr-2 flex-shrink-0">Link Gerado:</span>
                <a 
                  href={getTestLink(link)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-mono text-slate-300 hover:text-blue-400 hover:underline transition-colors truncate flex items-center gap-1"
                  title="Clique para abrir e testar em nova aba"
                >
                  <span className="truncate">{link}</span>
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                </a>
              </div>
              <button 
                onClick={handleCopyLink}
                className="flex-shrink-0 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-white border border-blue-500/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 font-semibold text-xs"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Copiado!' : 'Copiar Link'}
              </button>
            </div>

            {/* BOTÕES DE AÇÕES PRINCIPAIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
              <button 
                onClick={handleCopyBody}
                className="bg-slate-850 hover:bg-slate-800 text-white border border-slate-700/80 rounded-2xl py-3 px-4 transition-all flex items-center justify-center gap-2 font-bold text-sm shadow-md"
              >
                {copiedBody ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                {copiedBody ? 'Mensagem Copiada!' : 'Copiar Corpo da Mensagem'}
              </button>
              
              <button 
                onClick={handleOpenGmail}
                className="bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl py-3 px-4 transition-all flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-blue-500/10 border border-blue-450/20 group"
              >
                <Send className="w-4 h-4 text-blue-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                Abrir & Redigir no Gmail
              </button>
            </div>

            {/* INSTRUÇÃO DE COLAGEM */}
            <div className="mt-4 text-xs text-slate-400 bg-slate-950/40 p-3.5 rounded-2xl border border-slate-850 leading-relaxed">
              💡 <strong>Dica de Produtividade:</strong> O botão <strong>"Copiar Corpo da Mensagem"</strong> copia o e-mail formatado em Rich Text. Ao colar (<kbd className="bg-slate-800 px-1 py-0.5 rounded text-[10px]">Ctrl</kbd> + <kbd className="bg-slate-800 px-1 py-0.5 rounded text-[10px]">V</kbd>) no Gmail ou Outlook, o link ficará azul e <strong>100% clicável de imediato</strong>!
            </div>
          </div>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500">
        Nexus Holding Group &copy; 2026. Todos os direitos reservados.
      </footer>
    </main>
  );
}
