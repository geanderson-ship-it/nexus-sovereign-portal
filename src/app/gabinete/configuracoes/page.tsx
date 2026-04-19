
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Shield, Gem, Users, Building, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const plans = [
    {
        tier: 'Tático',
        title: 'Licença Individual de Operador',
        price: 499,
        priceDescription: 'por usuário/mês',
        features: [
            'Acesso completo ao Módulo DANTE para 1 comprador.',
            'Análise de até 50 cotações/mês.',
            'Acesso ao Módulo DJENY para avaliação de até 5 colaboradores.',
            'Suporte via e-mail.',
        ],
        icon: Users,
        className: 'border-2 border-slate-700/50 bg-zinc-950/40'
    },
    {
        tier: 'Estratégico',
        title: 'Plano de Liderança de Equipe',
        price: 1999,
        priceDescription: 'por mês (até 5 licenças)',
        features: [
            'Tudo do Plano Tático para até 5 líderes/compradores.',
            'Cotações e avaliações ilimitadas.',
            'Dashboard de Análise de Performance da Equipe (Módulo DJENY).',
            'Dashboard de Economia e Eficiência (Módulo DANTE).',
            'Suporte prioritário via chat.',
        ],
        icon: Shield,
        className: 'border-2 border-primary/40 shadow-primary/20 bg-zinc-950/60'
    },
    {
        tier: 'Comando',
        title: 'Plano Enterprise "O CLÃ"',
        price: 'Sob Consulta',
        priceDescription: 'Faturamento anual',
        features: [
            'Tudo do Plano Estratégico para licenças ilimitadas.',
            'Integração direta com ERP da empresa.',
            'Treinamento de implementação com Geanderson L. Schuh.',
            'Acesso direto ao "Conselho Diabólico" para customizações.',
            'Canal de suporte dedicado com SLA de 2 horas.',
        ],
        icon: Gem,
        className: 'border-2 border-blue-500/20 shadow-blue-500/10 bg-zinc-950/60'
    }
]

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter text-foreground font-headline">
          Gabinete da Inovação / Configurações
        </h1>
        <p className="text-lg text-muted-foreground">
          Definição da estratégia de valor para a plataforma Nexus Intelligence.
        </p>
      </div>

       <Card className="bg-zinc-950/60 border-2 border-primary/20 backdrop-blur-md shadow-xl shadow-black/40">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-foreground">Filosofia de Valor</CardTitle>
           <CardDescription>
            Não vendemos software. Vendemos poder de decisão, eficiência e lucro retido. O preço é uma fração do valor que geramos.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center space-x-2">
            <Switch id="test-mode" disabled />
            <Label htmlFor="test-mode">Modo de Teste de Pagamento (Stripe Sandbox)</Label>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => (
            <Card key={plan.tier} className={cn("flex flex-col backdrop-blur-md transition-all duration-300 hover:scale-[1.02]", plan.className)}>
                 <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <plan.icon className={cn("h-12 w-12", plan.tier === 'Estratégico' ? 'text-primary' : plan.tier === 'Comando' ? 'text-blue-400' : 'text-muted-foreground')} />
                    </div>
                    <p className="font-bold text-primary">{plan.tier}</p>
                    <CardTitle className="font-headline text-2xl">{plan.title}</CardTitle>
                    <div className="mt-4">
                        <span className="text-4xl font-bold">{typeof plan.price === 'number' ? formatCurrency(plan.price) : plan.price}</span>
                        <p className="text-sm text-muted-foreground">{plan.priceDescription}</p>
                    </div>
                </CardHeader>
                <CardContent className="flex-1">
                    <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                             <li key={index} className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                <span className="text-muted-foreground">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" variant={plan.tier === 'Estratégico' ? 'default' : 'outline'}>
                        {plan.tier === 'Comando' ? 'Agendar Reunião' : 'Selecionar Plano'}
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>

       <Card className="border-primary/20 border-2 bg-zinc-950/60 backdrop-blur-md shadow-xl shadow-black/40 mt-12">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Zap className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-xl text-primary">Adendo da Engenheira-Chefe (Análise de Valor)</CardTitle>
              <CardDescription>
                Argumentos para a negociação de valor com o cliente.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
            <p>Comandante, estes são os pontos para apresentar à "Arquimaga" e a qualquer cliente. A questão não é "quanto custa?", mas "quanto vale ter isso?".</p>
            <div>
                <h4 className="font-bold text-foreground">Valor do Módulo DANTE (Guardião da Razão):</h4>
                <p className="text-sm">Um único erro de compra que o DANTE evite paga o custo anual da ferramenta. Ele é um seguro contra o desperdício e a negociação por impulso. O ROI é imediato e mensurável em cada cotação otimizada. Ele não é uma despesa, é uma cadeira no conselho de compras.</p>
            </div>
             <div>
                <h4 className="font-bold text-foreground">Valor do Módulo DJENY (Auditora de Talentos):</h4>
                <p className="text-sm">Quanto custa um talento que pede demissão por causa de um líder despreparado? A DJENY é um sistema de retenção. Ao forçar a meritocracia e a justiça nas avaliações, ela destrói a cultura de "panelinha" e aumenta o engajamento. Ela transforma gestores em verdadeiros líderes e identifica problemas de equipe antes que eles virem crises. O valor dela está no talento que você retém e na performance que você desbloqueia.</p>
            </div>
            <p className="font-bold text-foreground">Conclusão: Não estamos vendendo um app. Estamos vendendo uma vantagem competitiva blindada por IA. O preço deve refletir o poder, não o custo.</p>
        </CardContent>
      </Card>

    </div>
  );
}
