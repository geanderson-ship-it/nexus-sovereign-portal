'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { signIn } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Eye, EyeOff } from 'lucide-react';
import { useUser } from '@/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

import { useLocale } from '@/hooks/use-locale';

const loginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido.' }),
  password: z.string().min(1, { message: 'Senha obrigatória.' }),
});


export default function LoginPage() {
  const { t } = useLocale();
  const { user, isUserLoading: loading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingVendas, setIsSubmittingVendas] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordVendas, setShowPasswordVendas] = useState(false);

  const [vendasEmail, setVendasEmail] = useState('');
  const [vendasPassword, setVendasPassword] = useState('');

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!loading && user) {
      router.push('/profile');
    }
  }, [user, loading, router]);


  const handleSuccessfulLogin = () => {
    toast({
        title: t('login.toast.success.title'),
        description: t('login.toast.success.description'),
    });
    // Reload completo para garantir que o AuthProvider detecte a sessão
    setTimeout(() => {
      window.location.href = '/profile';
    }, 500);
  };

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    try {
      await signIn({ username: values.email, password: values.password });
      handleSuccessfulLogin();
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.name === 'UserNotFoundException' || error.name === 'NotAuthorizedException') {
         errorMessage = t('login.toast.error.invalidCredentials');
      }
      toast({
        variant: 'destructive',
        title: t('common.error' as any) || 'Erro',
        description: errorMessage,
      });
      setIsSubmitting(false);
    }
  };

  const handleVendasLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingVendas(true);
    
    setTimeout(() => {
      const allowedEmails = ['demo@nexus.com', 'emerson.santoglass@gmail.com'];
      if (allowedEmails.includes(vendasEmail.toLowerCase().trim()) && vendasPassword === 'vendas2026') {
        localStorage.setItem('vendas_auth', 'true');
        toast({ title: 'Acesso Liberado', description: 'Redirecionando para o Portal de Vendas...' });
        router.push('/gabinete-vendas');
      } else {
        toast({ variant: 'destructive', title: 'Erro', description: 'E-mail ou senha de vendas incorretos.' });
        setIsSubmittingVendas(false);
      }
    }, 800);
  };
  
  if (loading || user) {
    return <div className="flex min-h-screen items-center justify-center bg-background">{t('intelligence.loading' as any) || 'Carregando...'}</div>;
  }

  return (
    <div className="relative flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center py-12 px-4 text-white">
      
      {/* FIXED BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/nexus-hero-hologram.png"
          alt="Nexus Login Background"
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
          <CardTitle className="text-2xl">{t('login.title')}</CardTitle>
          <CardDescription>
            Acesso Restrito
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="admin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-900/50 border border-slate-800">
              <TabsTrigger value="admin" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400">Diretoria</TabsTrigger>
              <TabsTrigger value="vendas" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400">Vendedores</TabsTrigger>
            </TabsList>
            
            <TabsContent value="admin" className="space-y-4 focus:outline-none">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('login.emailLabel')}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t('login.emailPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>{t('login.passwordLabel')}</FormLabel>
                      <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                        {t('login.forgotPassword')}
                      </Link>
                    </div>
                    <div className="relative">
                        <FormControl>
                          <Input type={showPassword ? 'text' : 'password'} {...field} />
                        </FormControl>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? t('login.submitting') : t('login.submit')}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            {t('login.noAccount')} {' '}
            <Link href="/signup" className="text-blue-500 hover:underline">
              {t('login.createAccountLink')}
            </Link>
          </div>
            </TabsContent>

            <TabsContent value="vendas" className="space-y-4 focus:outline-none">
              <form onSubmit={handleVendasLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label>E-mail Corporativo</Label>
                  <Input 
                    type="email" 
                    placeholder="vendedor@nexus.com" 
                    value={vendasEmail}
                    onChange={(e) => setVendasEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Senha de Acesso</Label>
                  <div className="relative">
                    <Input 
                      type={showPasswordVendas ? 'text' : 'password'} 
                      value={vendasPassword}
                      onChange={(e) => setVendasPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordVendas(!showPasswordVendas)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                    >
                        {showPasswordVendas ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-4" disabled={isSubmittingVendas}>
                  {isSubmittingVendas ? 'Autenticando...' : 'Acessar Showroom'}
                </Button>
              </form>
              <div className="mt-4 text-center text-xs text-slate-500">
                Acesso exclusivo para parceiros comerciais autorizados.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
