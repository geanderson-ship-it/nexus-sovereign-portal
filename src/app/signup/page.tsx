
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { signUp, confirmSignUp, autoSignIn } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import { Eye, EyeOff } from 'lucide-react';
import { useUser } from '@/auth';

const client = generateClient();

const signupSchema = z.object({
  firstName: z.string().min(1, { message: 'O nome é obrigatório.' }),
  lastName: z.string().min(1, { message: 'O sobrenome é obrigatório.' }),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z
    .string()
    .min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
    .regex(/[A-Z]/, { message: 'Deve conter pelo menos uma letra maiúscula.' })
    .regex(/[a-z]/, { message: 'Deve conter pelo menos uma letra minúscula.' })
    .regex(/[0-9]/, { message: 'Deve conter pelo menos um número.' })
    .regex(/[^A-Za-z0-9]/, { message: 'Deve conter pelo menos um caractere especial.' }),
});

export default function SignupPage() {
    const { user, isUserLoading: loading } = useUser();
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const [verificationStep, setVerificationStep] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [tempEmail, setTempEmail] = useState('');
    const [tempFormData, setTempFormData] = useState<any>(null);

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        },
    });

    useEffect(() => {
      if (!loading && user) {
        router.push('/');
      }
    }, [user, loading, router]);
    
    const handleSuccessfulLogin = () => {
        toast({
            title: 'Conexão estabelecida.',
            description: 'É um prazer ter sua mente focada conosco.',
        });
        setTimeout(() => {
            window.location.href = '/profile';
        }, 500);
    };
    
    const onSubmit = async (values: z.infer<typeof signupSchema>) => {
        setIsSubmitting(true);
        try {
            const { isSignUpComplete, nextStep } = await signUp({
                username: values.email,
                password: values.password,
                options: {
                    userAttributes: {
                        email: values.email,
                        name: `${values.firstName} ${values.lastName}`,
                        given_name: values.firstName,
                        family_name: values.lastName,
                    },
                    autoSignIn: true,
                }
            });
            
            if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
                setTempEmail(values.email);
                setTempFormData(values);
                setVerificationStep(true);
                toast({
                    title: 'Verifique seu e-mail',
                    description: 'Enviamos um código de confirmação para o seu e-mail.',
                });
            } else if (isSignUpComplete) {
                await createProfileAndComplete(values.email, values);
            }
        } catch (error: any) {
            let errorMessage = error.message;
            if (error.name === 'UsernameExistsException') {
                errorMessage = 'Este e-mail já está em uso. Por favor, faça login.';
            } else if (error.name === 'InvalidPasswordException') {
                errorMessage = 'A senha não atende aos requisitos de segurança.';
            }
            toast({
                variant: 'destructive',
                title: 'Alerta de Rota.',
                description: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const createProfileAndComplete = async (email: string, values: any) => {
        try {
            await autoSignIn();
            const { getCurrentUser } = await import('aws-amplify/auth');
            const currentUser = await getCurrentUser();

            // @ts-expect-error Types not synced yet
            await client.models.UserProfile.create({
                id: currentUser.userId,
                email: email,
                displayName: `${values.firstName} ${values.lastName}`,
                preferences: JSON.stringify({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    registrationDate: new Date().toISOString(),
                }) as any
            });

            handleSuccessfulLogin();
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Alerta de Rota.',
                description: 'Conta criada, mas houve um erro ao configurar o perfil. Entre novamente.',
            });
            router.push('/login');
        }
    };

    const onVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { isSignUpComplete } = await confirmSignUp({
                username: tempEmail,
                confirmationCode: verificationCode
            });
            
            if (isSignUpComplete) {
                await createProfileAndComplete(tempEmail, tempFormData);
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Erro de Validação',
                description: error.message || 'Código incorreto ou expirado.',
            });
            setIsSubmitting(false);
        }
    };
    if (loading || user) {
        return <div className="flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center">Carregando...</div>;
    }

  return (
    <div className="relative flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center py-12 px-4 text-white">
      
      {/* FIXED BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/assets/dante-builder-v3.png"
          alt="Nexus Signup Background"
          fill
          priority
          className="object-cover opacity-20"
          style={{ objectPosition: 'center center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/65 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.03)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <Card className="w-full max-w-lg border-primary/20 bg-black/60 backdrop-blur-md shadow-2xl text-slate-100">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo width={200} height={67} />
          </div>
          <CardTitle className="text-2xl">{verificationStep ? 'Confirme seu e-mail.' : 'Crie sua conta.'}</CardTitle>
          <CardDescription>
            {verificationStep ? 'Digite o código de 6 dígitos que enviamos.' : 'Comece a aprender com os melhores. É rápido e fácil.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {verificationStep ? (
              <form onSubmit={onVerify} className="space-y-4">
                  <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Código de Verificação</label>
                      <Input 
                          placeholder="000000" 
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          maxLength={6}
                          required
                      />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Verificando...' : 'Confirmar e Entrar'}
                  </Button>
              </form>
          ) : (
          <>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome.</FormLabel>
                                <FormControl>
                                    <Input placeholder="Seu nome" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sobrenome.</FormLabel>
                                <FormControl>
                                    <Input placeholder="Seu sobrenome" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                  </div>
                  <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>E-mail.</FormLabel>
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
                              <FormLabel>Senha.</FormLabel>
                              <div className="relative">
                                <FormControl>
                                    <Input type={showPassword ? "text" : "password"} {...field} />
                                </FormControl>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                              </div>
                               <ul className="mt-2 text-xs text-muted-foreground list-disc pl-5 space-y-1">
                                <li>Mínimo de 8 caracteres.</li>
                                <li>Pelo menos uma letra maiúscula.</li>
                                <li>Pelo menos um número.</li>
                                <li>Pelo menos um caractere especial.</li>
                               </ul>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
                  </Button>
              </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Entrar
            </Link>
          </div>
          </>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
