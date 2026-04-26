'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { signIn, signInWithRedirect } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Eye, EyeOff } from 'lucide-react';
import { useUser } from '@/firebase';
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
  const [showPassword, setShowPassword] = useState(false);

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
    // Redireciona via Next.js router para manter o estado da aplicação
    // O FirebaseProvider (Amplify bridge) detectará a mudança de estado via Hub e checkUser
    router.push('/profile');
    setIsSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInWithRedirect({ provider: 'Google' });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('common.error' as any) || 'Erro',
        description: error.message || 'Falha ao conectar com o Google.',
      });
      setIsSubmitting(false);
    }
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
  
  if (loading || user) {
    return <div className="flex min-h-screen items-center justify-center bg-background">{t('intelligence.loading' as any) || 'Carregando...'}</div>;
  }

  return (
    <div className="relative flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center py-12 px-4">
       <Image
          src="https://i.postimg.cc/HsP5WHsx/palestras-para-empresas-industria.jpg"
          alt="Nexus Login Background"
          fill
          sizes="100vw"
          className="object-cover -z-10"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-background/80 -z-10 backdrop-blur-sm" />
      <Card className="w-full max-w-sm border-primary/20 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo width={200} height={67} />
          </div>
          <CardTitle className="text-2xl">{t('login.title')}</CardTitle>
          <CardDescription>
            {t('login.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t('login.submitting') : t('login.submit')}
              </Button>
            </form>
          </Form>
           <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t('login.orWith')}
                </span>
              </div>
            </div>
           <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting}>
              {isSubmitting ? t('login.googleWait') : t('login.googleSubmit')}
           </Button>
          <div className="mt-4 text-center text-sm">
            {t('login.noAccount')} {' '}
            <Link href="/signup" className="text-primary hover:underline">
              {t('login.createAccountLink')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
