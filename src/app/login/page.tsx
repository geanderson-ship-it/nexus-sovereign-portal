'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth, useUser, useFirestore } from '@/firebase';
import Image from 'next/image';
import { ADMIN_EMAILS } from '@/lib/constants';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useLocale } from '@/hooks/use-locale';

const loginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido.' }),
  password: z.string().min(1, { message: 'Senha obrigatória.' }),
});


export default function LoginPage() {
  const { t } = useLocale();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading: loading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: ADMIN_EMAILS[0],
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
        title: t('contact.toast.title'),
        description: t('login.toast.success.description'),
    });
    setIsSubmitting(false);
  };

  const handleGoogleSignIn = () => {
    if (!auth || !firestore) return;
    setIsSubmitting(true);
    
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const userDocRef = doc(firestore, 'users', result.user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          const { displayName, email } = result.user;
          const [firstName, ...lastNameParts] = displayName?.split(' ') || ['', ''];
          const lastName = lastNameParts.join(' ');
          
          await setDoc(userDocRef, {
              id: result.user.uid,
              firstName: firstName || '',
              lastName: lastName || '',
              email: email,
              registrationDate: new Date().toISOString(),
          });
        }
        handleSuccessfulLogin();
      })
      .catch((error: any) => {
        toast({
          variant: 'destructive',
          title: t('common.error' as any) || 'Erro',
          description: error.message,
        });
        setIsSubmitting(false);
      });
  };

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    if (!auth) return;
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      handleSuccessfulLogin();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('common.error' as any) || 'Erro',
        description: error.message,
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
          <CardTitle className="text-2xl">{t('login.title' as any) || 'A conexão começa aqui.'}</CardTitle>
          <CardDescription>
            {t('login.description' as any) || 'Entre no seu centro de comando.'}
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
                    <FormLabel>{t('contact.form.email')}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} />
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
                      <FormLabel>{t('login.password' as any) || 'Senha.'}</FormLabel>
                      <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                        {t('login.forgotPassword' as any) || 'Esqueceu a senha?'}
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
                {isSubmitting ? (t('common.loading' as any) || 'Conectando...') : (t('login.cta' as any) || 'Estabelecer Conexão')}
              </Button>
            </form>
          </Form>
           <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t('login.orConnectWith' as any) || 'Ou conecte-se com.'}
                </span>
              </div>
            </div>
           <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting}>
              {isSubmitting ? (t('common.loading' as any) || 'Aguarde...') : (t('login.googleCta' as any) || 'Conectar com Google')}
           </Button>
          <div className="mt-4 text-center text-sm">
            {t('login.noAccount' as any) || 'Não tem um acesso?'} {' '}
            <Link href="/signup" className="text-primary hover:underline">
              {t('login.signupCta' as any) || 'Criar um Ponto de Acesso'}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
