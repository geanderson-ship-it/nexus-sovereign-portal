
'use client';

import { Suspense } from 'react';
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
import { palestras } from '@/lib/courses-data';
import { useLocale } from '@/hooks/use-locale';

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    const whatsappBody = `*Nova Requisição de Contato - Nexus*

*Nome:* ${data.firstName} ${data.lastName}
*E-mail:* ${data.email}
*Telefone:* ${data.phone}
*Empresa:* ${data.company || t('contact.mailto.notInformed')}
--------------------------------
*Assunto:* ${selectedSubject || data.subject}

*Mensagem:*
${data.message}`.trim();

    const whatsappLink = `https://wa.me/5551999799582?text=${encodeURIComponent(whatsappBody)}`;

    window.open(whatsappLink, '_blank');
    setSent(true);
  };

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="mb-12 text-center">
        <h1 className={cn("text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl lg:text-7xl", "font-headline")}>
          {t('contact.title')}
        </h1>
        <p className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl font-sans">
          {t('contact.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-16 md:grid-cols-2">
        <div className="space-y-8">
            <div className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail className="h-6 w-6" />
                </div>
                <div>
                <h3 className="text-xl font-semibold font-headline">{t('contact.email.title')}</h3>
                <p className="text-muted-foreground font-sans">
                    {t('contact.email.text')}
                </p>
                <a href="mailto:geanderson@nexustreinamento.com" className="text-primary hover:underline">
                    geanderson@nexustreinamento.com
                </a>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Phone className="h-6 w-6" />
                </div>
                <div>
                <h3 className="text-xl font-semibold font-headline">{t('contact.phone.title')}</h3>
                <p className="text-muted-foreground font-sans">
                    {t('contact.phone.text')}
                </p>
                <a href="tel:+5551999799582" className="text-primary hover:underline">
                    +55 (51) 99979-9582
                </a>
                <p className="mt-2 text-sm text-muted-foreground">
                    {t('contact.phone.note')}
                </p>
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
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Nexus Treinamento · Desvendando Talentos</p>
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
                    <Label htmlFor="subject">{t('contact.form.subject')}</Label>
                     <Select required name="subject" value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder={t('contact.form.subject.placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>{t('contact.form.subject.group.lectures')}</SelectLabel>
                          {palestras.map(palestra => (
                            <SelectItem key={palestra.slug} value={palestra.slug}>{palestra.title}</SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>{t('contact.form.subject.group.other')}</SelectLabel>
                          <SelectItem value="consultoria">{t('contact.form.subject.option.consulting')}</SelectItem>
                          <SelectItem value="cursos">{t('contact.form.subject.option.courses')}</SelectItem>
                          <SelectItem value="parcerias">{t('contact.form.subject.option.partnerships')}</SelectItem>
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
