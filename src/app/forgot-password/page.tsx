
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useAuth } from '@/firebase';

export default function ForgotPasswordPage() {
  const auth = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!auth) return;
    
    setError('');

    if (!email) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Ordem de Avanço.',
        description: 'Missão cumprida. Verifique sua caixa de entrada para o próximo nível.',
      });
      setEmail('');
    } catch (error: any) {
      let description = 'Ocorreu um erro desconhecido. Tente novamente mais tarde.';
      switch (error.code) {
        case 'auth/user-not-found':
          description = 'Nenhum usuário encontrado com este e-mail. Verifique o endereço digitado.';
          break;
        case 'auth/invalid-email':
          description = 'O formato do e-mail é inválido.';
          break;
        default:
          description = `Não foi possível enviar o e-mail de recuperação. Código do erro: ${error.code}`;
          break;
      }
      toast({
        variant: 'destructive',
        title: 'Alerta de Rota.',
        description: description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo width={200} height={67} />
          </div>
          <CardTitle className="text-2xl">Esqueceu sua senha?</CardTitle>
          <CardDescription>
            Sem problemas. Insira seu e-mail e enviaremos um link para você
            redefinir sua senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail.</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? 'Enviando...'
                : 'Enviar e-mail de redefinição'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Lembrou a senha?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Fazer login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
