
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
import { signUp, confirmSignUp, signInWithRedirect, autoSignIn } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import { Eye, EyeOff } from 'lucide-react';
import { useUser } from '@/firebase';

const client = generateClient();

const signupSchema = z.object({
  firstName: z.string().min(1, { message: 'O nome é obrigatório.' }),
  lastName: z.string().min(1, { message: 'O sobrenome é obrigatório.' }),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'CPF inválido. Use o formato XXX.XXX.XXX-XX.' }),
  birthDate: z.string().min(10, { message: 'Data inválida.' }).regex(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'Use o formato DD/MM/AAAA.' }),
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
            cpf: '',
            birthDate: '',
            password: '',
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
        // The useEffect hook will handle the redirect.
        setIsSubmitting(false);
    };

    const handleGoogleSignIn = async () => {
        setIsSubmitting(true);
        try {
            await signInWithRedirect({ provider: 'Google' });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Alerta de Rota.',
                description: error.message || 'Falha ao conectar com o Google.',
            });
            setIsSubmitting(false);
        }
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
            const [day, month, year] = values.birthDate.split('/').map(Number);
            const dateObject = new Date(year, month - 1, day);
            const birthDateForFirestore = dateObject.toISOString().split('T')[0];

            // Criar registro no DynamoDB (AppSync)
            // Pegamos o UUID gerado pelo Cognito na sessão autoSignIn ou deixamos o id ser preenchido dps.
            // O ideal é passar o sub do usuário. Mas 'signIn' ou 'autoSignIn' precisa rodar primeiro.
            await autoSignIn();
            
            // O ID é necessário pro schema AppSync UserProfile. Vamos tentar pegar o currentUser.
            const { getCurrentUser } = await import('aws-amplify/auth');
            const currentUser = await getCurrentUser();

            await client.models.UserProfile.create({
                id: currentUser.userId,
                email: email,
                displayName: `${values.firstName} ${values.lastName}`,
                preferences: JSON.stringify({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    cpf: values.cpf,
                    birthDate: birthDateForFirestore,
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
    <div className="flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center py-12">
      <Card className="w-full max-w-lg border-primary/20 shadow-2xl">
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
                      <FormLabel>Código de Verificação</FormLabel>
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
                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CPF.</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="000.000.000-00" 
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const maskedValue = value
                                                .replace(/\D/g, '')
                                                .replace(/(\d{3})(\d)/, '$1.$2')
                                                .replace(/(\d{3})(\d)/, '$1.$2')
                                                .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                                                .substring(0, 14);
                                            field.onChange(maskedValue);
                                        }}
                                     />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Data de Nascimento.</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="DD/MM/AAAA"
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const maskedValue = value
                                                .replace(/\D/g, '')
                                                .replace(/(\d{2})(\d)/, '$1/$2')
                                                .replace(/(\d{2})(\d)/, '$1/$2')
                                                .substring(0, 10);
                                            field.onChange(maskedValue);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                  </div>
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
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou continue com.
                </span>
              </div>
            </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting}>
            {isSubmitting ? 'Aguarde...' : 'Inscrever-se com Google'}
          </Button>
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
  );
}
