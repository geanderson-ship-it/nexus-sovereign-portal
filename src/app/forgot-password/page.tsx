'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<1 | 2>(1);

  const handleRequestCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword({ username: email });
      toast({
        title: 'Ordem de Avanço.',
        description: 'Código de 6 dígitos enviado para seu e-mail.',
      });
      setStep(2);
    } catch (error: any) {
      let description = 'Ocorreu um erro desconhecido. Tente novamente mais tarde.';
      if (error.name === 'UserNotFoundException') {
        description = 'Nenhum usuário encontrado com este e-mail. Verifique o endereço digitado.';
      } else if (error.name === 'InvalidParameterException') {
        description = 'O formato do e-mail é inválido.';
      } else {
        description = `Não foi possível enviar o e-mail de recuperação. Erro: ${error.message}`;
      }
      toast({ variant: 'destructive', title: 'Alerta de Rota.', description });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!code || !newPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
      toast({
        title: 'Senha redefinida com sucesso!',
        description: 'Você já pode fazer login com sua nova senha.',
      });
      router.push('/login');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro ao redefinir', description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center py-12 px-4 text-white">
      
      {/* FIXED BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/nexus-hero-hologram.png"
          alt="Nexus Recovery Background"
          fill
          priority
          className="object-cover opacity-25"
          style={{ objectPosition: 'center center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/65 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.03)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <Card className="w-full max-w-sm border-primary/20 bg-black/60 backdrop-blur-md shadow-2xl text-slate-100">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <Logo width={200} height={67} />
            </div>
            <CardTitle className="text-2xl">
              {step === 1 ? 'Esqueceu sua senha?' : 'Redefinir Senha'}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {step === 1 
                ? 'Sem problemas. Insira seu e-mail e enviaremos o código para você redefinir sua senha.' 
                : `Enviamos um código de 6 dígitos para ${email}.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <form onSubmit={handleRequestCode} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200">E-mail.</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-black/40 border-white/10 text-white placeholder-slate-500 focus:border-primary"
                  />
                  {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                </div>
                <Button type="submit" className="w-full font-headline tracking-wider uppercase" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar Código'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleConfirmReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-slate-200">Código de 6 dígitos</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    required
                    className="bg-black/40 border-white/10 text-white placeholder-slate-500 focus:border-primary tracking-widest text-center text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-slate-200">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="********"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="bg-black/40 border-white/10 text-white placeholder-slate-500 focus:border-primary"
                  />
                  {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                </div>
                <Button type="submit" className="w-full font-headline tracking-wider uppercase bg-emerald-600 hover:bg-emerald-500 text-white" disabled={isSubmitting}>
                  {isSubmitting ? 'Confirmando...' : 'Salvar Nova Senha'}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-slate-400">
              Lembrou a senha?{' '}
              <Link href="/login" className="text-primary hover:underline font-semibold">
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
