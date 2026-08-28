
'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLocale } from '@/hooks/use-locale';
import * as gtag from '@/lib/gtag';

// Componente interno que lida com a lógica da URL
function ContactContent() {
  const { t } = useLocale();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const subject = searchParams?.get('subject');
    if (subject) {
      setSelectedSubject(subject);
    }
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // 1. Salvar lead no banco de backup do servidor
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          company: data.company || '',
          subject: selectedSubject || data.subject,
          message: data.message,
        }),
      });
    } catch (err) {
      console.error('Erro ao registrar lead em segundo plano:', err);
    }

    // 2. Construir link do WhatsApp
    const whatsappBody = `*Nova Requisição Executiva - Nexus Holding Group*

*Nome:* ${data.firstName} ${data.lastName}
*E-mail:* ${data.email}
*Telefone:* ${data.phone}
*Empresa:* ${data.company || "Não informada"}
--------------------------------
*Área de Interesse:* ${selectedSubject || data.subject}

*Mensagem:*
${data.message}`.trim();

    const whatsappLink = `https://wa.me/5551999799582?text=${encodeURIComponent(whatsappBody)}`;

    // Track contact click
    gtag.event({
      action: 'contact_click',
      category: 'engagement',
      label: 'whatsapp_button',
    });

    window.open(whatsappLink, '_blank');
    setSent(true);
  };

  return (
    <div className="min-h-screen text-white relative">
      {/* Background de Conexões */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/nexus-agenda-bg.png"
          alt="Nexus Network"
          fill
          priority
          className="object-cover opacity-35"
          style={{ objectPosition: 'center center' }}
        />
        {/* Overlay ajustado para aparecer bem o azul mas proteger o texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/65 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.04)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 container mx-auto py-12 md:py-20">
        <div className="mb-12 text-center">
          <h1 className={cn("text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl lg:text-7xl", "font-headline")}>
            CENTRAL DE EVOLUÇÃO E RESULTADOS
          </h1>
          <p className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl font-sans">
            Pronto para blindar a infraestrutura e acelerar os resultados da sua corporação? Fale agora com a nossa liderança executiva e desenhe seu projeto sob medida.
          </p>
        </div>

      <div className="grid grid-cols-1 items-start gap-16 md:grid-cols-2">
        <div className="space-y-8">
            <div className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail className="h-6 w-6" />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold font-headline">Contatos Executivos</h3>
                    <p className="text-muted-foreground font-sans text-sm mb-2">
                        Canais diretos com a nossa alta gestão.
                    </p>
                  </div>
                  <div className="border-l-2 border-primary/30 pl-3 flex items-start gap-4">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-primary/40 flex-shrink-0 shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-300">
                      <Image
                        src="/gean-diretor.png"
                        alt="Geanderson Leandro Schuh"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-wider text-primary uppercase">Founder & CEO</p>
                      <p className="font-bold text-foreground text-lg mt-0.5">Geanderson Leandro Schuh</p>
                      <div className="flex flex-col text-sm mt-2.5 gap-2">
                        <a href="mailto:geanderson@nexusholdinggroup.com.br" className="text-slate-200 hover:text-primary hover:translate-x-1 text-sm font-medium transition-all flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                            <Mail className="w-3.5 h-3.5" />
                          </span>
                          geanderson@nexusholdinggroup.com.br
                        </a>
                        <a href="https://wa.me/5551999799582" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-emerald-400 hover:translate-x-1 text-sm font-medium transition-all flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-11.98c-.12-.2-.24-.305-.449-.305h-.359c-.209 0-.54.079-.822.387-.282.308-1.077 1.051-1.077 2.562 0 1.512 1.097 2.977 1.247 3.177.151.2 2.158 3.292 5.228 4.613.73.314 1.299.502 1.742.643.733.233 1.4.2 1.928.121.588-.087 1.804-.737 2.06-1.45.256-.713.256-1.32.18-1.45-.076-.13-.277-.207-.578-.356-.301-.15-1.776-.875-2.051-.975-.275-.1-.475-.15-.675.15-.2.3-.776.975-.951 1.175-.175.2-.35.225-.651.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.785-1.676-2.085-.176-.3-.019-.462.132-.612.135-.135.301-.35.451-.525.15-.175.2-.299.3-.5.1-.2.05-.375-.025-.525C8.032 13.12 7.153 10.97 6.647 10.02z" />
                            </svg>
                          </span>
                          +55 (51) 99979-9582
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-2 border-blue-400/30 pl-3 flex items-start gap-4">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-blue-400/40 flex-shrink-0 shadow-lg shadow-blue-400/20 hover:scale-105 transition-transform duration-300">
                      <Image
                        src="/diretora-ivoni-nova.png"
                        alt="Ivoni Severo Schuh"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-wider text-blue-400 uppercase">Co-founder & CCO</p>
                      <p className="font-bold text-foreground text-lg mt-0.5">Ivoni Severo Schuh</p>
                      <div className="flex flex-col text-sm mt-2.5 gap-2">
                        <a href="mailto:ivoni@nexusholdinggroup.com.br" className="text-slate-200 hover:text-blue-400 hover:translate-x-1 text-sm font-medium transition-all flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                            <Mail className="w-3.5 h-3.5" />
                          </span>
                          ivoni@nexusholdinggroup.com.br
                        </a>
                        <a href="https://wa.me/5551999029371" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-emerald-400 hover:translate-x-1 text-sm font-medium transition-all flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-11.98c-.12-.2-.24-.305-.449-.305h-.359c-.209 0-.54.079-.822.387-.282.308-1.077 1.051-1.077 2.562 0 1.512 1.097 2.977 1.247 3.177.151.2 2.158 3.292 5.228 4.613.73.314 1.299.502 1.742.643.733.233 1.4.2 1.928.121.588-.087 1.804-.737 2.06-1.45.256-.713.256-1.32.18-1.45-.076-.13-.277-.207-.578-.356-.301-.15-1.776-.875-2.051-.975-.275-.1-.475-.15-.675.15-.2.3-.776.975-.951 1.175-.175.2-.35.225-.651.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.785-1.676-2.085-.176-.3-.019-.462.132-.612.135-.135.301-.35.451-.525.15-.175.2-.299.3-.5.1-.2.05-.375-.025-.525C8.032 13.12 7.153 10.97 6.647 10.02z" />
                            </svg>
                          </span>
                          +55 (51) 99902-9371
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-2 border-emerald-400/30 pl-3 flex items-start gap-4">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-emerald-400/40 flex-shrink-0 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform duration-300">
                      <Image
                        src="/carla-vendas-nova.jpeg"
                        alt="Carla C. Schuh"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-wider text-emerald-400 uppercase">Executiva de Vendas</p>
                      <p className="font-bold text-foreground text-lg mt-0.5">Carla C. Schuh</p>
                      <div className="flex flex-col text-sm mt-2.5 gap-2">
                        <a href="mailto:vendas@nexusholdinggroup.com.br" className="text-slate-200 hover:text-emerald-400 hover:translate-x-1 text-sm font-medium transition-all flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <Mail className="w-3.5 h-3.5" />
                          </span>
                          vendas@nexusholdinggroup.com.br
                        </a>
                        <a href="https://wa.me/5551993783897" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-emerald-400 hover:translate-x-1 text-sm font-medium transition-all flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-11.98c-.12-.2-.24-.305-.449-.305h-.359c-.209 0-.54.079-.822.387-.282.308-1.077 1.051-1.077 2.562 0 1.512 1.097 2.977 1.247 3.177.151.2 2.158 3.292 5.228 4.613.73.314 1.299.502 1.742.643.733.233 1.4.2 1.928.121.588-.087 1.804-.737 2.06-1.45.256-.713.256-1.32.18-1.45-.076-.13-.277-.207-.578-.356-.301-.15-1.776-.875-2.051-.975-.275-.1-.475-.15-.675.15-.2.3-.776.975-.951 1.175-.175.2-.35.225-.651.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.785-1.676-2.085-.176-.3-.019-.462.132-.612.135-.135.301-.35.451-.525.15-.175.2-.299.3-.5.1-.2.05-.375-.025-.525C8.032 13.12 7.153 10.97 6.647 10.02z" />
                            </svg>
                          </span>
                          +55 (51) 99378-3897
                        </a>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>

            <div className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-6 w-6" />
                </div>
                <div>
                <h3 className="text-xl font-semibold font-headline">{t('contact.address.title')}</h3>
                <p className="text-muted-foreground font-sans">
                    {t('contact.address.text')}
                </p>
                </div>
            </div>
        </div>
        
        <div className="space-y-6 rounded-lg border-2 border-primary/20 bg-zinc-950/60 backdrop-blur-md p-6 text-card-foreground shadow-xl shadow-black/40">
            {sent ? (
              <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="h-12 w-12 text-emerald-400 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase tracking-widest text-white font-headline">Mensagem Enviada!</h2>
                  <p className="text-slate-400 leading-relaxed max-w-sm">
                    Sua mensagem foi encaminhada para a Nexus via WhatsApp. Em breve entraremos em contato com você!
                  </p>
                </div>
                <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Nexus Holding Group · Engenharia de Resultados</p>
                <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 mt-2" onClick={() => setSent(false)}>
                  Enviar outra mensagem
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-center font-headline">{t('contact.form.title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t('contact.form.firstName')}</Label>
                      <Input id="firstName" name="firstName" placeholder={t('contact.form.firstName.placeholder')} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t('contact.form.lastName')}</Label>
                      <Input id="lastName" name="lastName" placeholder={t('contact.form.lastName.placeholder')} required />
                    </div>
                  </div>
                   <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="email">{t('contact.form.email')}</Label>
                        <Input id="email" name="email" type="email" placeholder={t('contact.form.email.placeholder')} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">{t('contact.form.phone')}</Label>
                        <Input id="phone" name="phone" placeholder={t('contact.form.phone.placeholder')} required />
                    </div>
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="company">{t('contact.form.company')}</Label>
                      <Input id="company" name="company" placeholder={t('contact.form.company.placeholder')} />
                    </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Área de Interesse</Label>
                     <Select required name="subject" value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Selecione o setor desejado..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Arquitetura Tecnológica</SelectLabel>
                          <SelectItem value="ia-soberana">Implementação de IA Soberana On-Premise</SelectItem>
                          <SelectItem value="nexus-intelligence">Nexus Intelligence (Automação e Dados)</SelectItem>
                          <SelectItem value="nexus-treinamento">Nexus Treinamento (Evolução Corporativa)</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Negócios</SelectLabel>
                          <SelectItem value="inova-revenda">Inova Revenda (Setor Automotivo)</SelectItem>
                          <SelectItem value="vitrine-inovadora">Vitrine Inovadora (E-commerce / Varejo)</SelectItem>
                          <SelectItem value="parcerias">Parcerias Estratégicas B2B</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">{t('contact.form.message')}</Label>
                    <Textarea id="message" name="message" placeholder={t('contact.form.message.placeholder')} required rows={5} />
                  </div>
                  <Button type="submit" className="w-full">
                    {t('contact.form.cta')}
                  </Button>
                </form>
              </>
            )}
          </div>
      </div>
      </div>
    </div>
  );
}

// Componente Principal (Wrapper com Suspense)
export default function ContactPage() {
  const { t } = useLocale();
  return (
    <Suspense fallback={<div className="container py-20 text-center">{t('contact.form.loading')}</div>}>
      <ContactContent />
    </Suspense>
  );
}
