# ⚡ GUIA RÁPIDO — IMPLEMENTAÇÃO DOS 3 CRÍTICOS

**Tempo total**: 5 horas  
**Dificuldade**: Fácil (copiar/colar com ajustes)  
**Responsável**: Backend dev

---

## CRÍTICO #1: Completar Tabela de Preços (1h 30min)

### Passo 1: Abrir arquivo
```bash
cd nexus-sovereign-portal
code src/lib/nexus-db.ts
```

### Passo 2: Encontrar o final da tabela
Procure por `NEX-007` — é o último produto. Deve estar assim:

```typescript
  {
    id: "NEX-007",
    nome: "Vitrine Inovadora",
    categoria: "SaaS Enterprise",
    precoVenda: 45000.00,
    mensalidade: 15000.00,
    custoEstimado: 5000.00,
    moeda: "BRL",
    status: "Ativo"
  }
];  // ← FIM DO ARRAY
```

### Passo 3: Adicionar ANTES do `];`

**COPIE E COLE ISTO**:

```typescript
  // ========== DANTE SAFRA ==========
  {
    id: "DAD-001",
    nome: "Dante Safra",
    categoria: "SaaS",
    precoVenda: 999.00,
    anualidade: true,
    descricao: "Terminal tático de IA agrícola — Diagnóstico de pragas, manejo zootécnico, decisões de mercado",
    moeda: "BRL",
    status: "Ativo"
  },

  // ========== NEXUS EMPRESAS (12 módulos) ==========
  {
    id: "NEX-EMP-001",
    nome: "Nexus Empresas - Nexus Vendas",
    categoria: "SaaS Enterprise",
    precoVenda: 13500.00,
    mensalidade: 540.00,
    descricao: "Catálogo completo + OP automática",
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-EMP-002",
    nome: "Nexus Empresas - Nexus Compras",
    categoria: "SaaS Enterprise",
    precoVenda: 15000.00,
    mensalidade: 600.00,
    descricao: "Análise de cotações, -30% custos",
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-EMP-003",
    nome: "Nexus Empresas - Nexus PPCP",
    categoria: "SaaS Enterprise",
    precoVenda: 18000.00,
    mensalidade: 720.00,
    descricao: "Planejamento de produção, -25% custos",
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-EMP-004",
    nome: "Nexus Empresas - Nexus Auditor",
    categoria: "SaaS Enterprise",
    precoVenda: 13500.00,
    mensalidade: 540.00,
    descricao: "Auditoria inteligente em tempo real",
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-EMP-005",
    nome: "Nexus Empresas - Nexus Cronoanalise",
    categoria: "SaaS Enterprise",
    precoVenda: 10500.00,
    mensalidade: 420.00,
    descricao: "Tempos padrão, eficiência operacional",
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-EMP-006",
    nome: "Nexus Empresas - Nexus Almoxarifado",
    categoria: "SaaS Enterprise",
    precoVenda: 10500.00,
    mensalidade: 420.00,
    descricao: "Controle de estoque em tempo real",
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-EMP-007",
    nome: "Nexus Empresas - Nexus Expedição",
    categoria: "SaaS Enterprise",
    precoVenda: 9000.00,
    mensalidade: 360.00,
    descricao: "Otimização de rotas e expedição",
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-EMP-008",
    nome: "Nexus Empresas - Nexus RH",
    categoria: "SaaS Enterprise",
    precoVenda: 12000.00,
    mensalidade: 480.00,
    descricao: "Gestão de recursos humanos integrada",
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-EMP-009",
    nome: "Nexus Empresas - Nexus Financeiro",
    categoria: "SaaS Enterprise",
    precoVenda: 16500.00,
    mensalidade: 660.00,
    descricao: "Contabilidade e gestão financeira 360",
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-EMP-010",
    nome: "Nexus Empresas - Nexus Qualidade",
    categoria: "SaaS Enterprise",
    precoVenda: 11000.00,
    mensalidade: 440.00,
    descricao: "Gestão de qualidade e conformidade",
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-EMP-011",
    nome: "Nexus Empresas - Nexus Segurança",
    categoria: "SaaS Enterprise",
    precoVenda: 13500.00,
    mensalidade: 540.00,
    descricao: "Segurança industrial e prevenção",
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-EMP-012",
    nome: "Nexus Empresas - Nexus Sustentabilidade",
    categoria: "SaaS Enterprise",
    precoVenda: 10000.00,
    mensalidade: 400.00,
    descricao: "Relatórios de sustentabilidade e ESG",
    moeda: "BRL",
    status: "Ativo"
  },

  // ========== NEXUS PREMIUM ==========
  {
    id: "NEX-PREMIUM-001",
    nome: "Nexus Premium - Mentoria VIP",
    categoria: "Premium",
    precoVenda: 50000.00,
    descricao: "Acesso direto a Geanderson Schuh + consultoria estratégica",
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-PREMIUM-002",
    nome: "Nexus Premium - Implementação Full",
    categoria: "Premium",
    precoVenda: 75000.00,
    descricao: "Implementação completa + treinamento + suporte 24h",
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-PREMIUM-003",
    nome: "Nexus Premium - White Label",
    categoria: "Premium",
    precoVenda: 100000.00,
    descricao: "Solução white label customizada",
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-PREMIUM-004",
    nome: "Nexus Premium - API Access",
    categoria: "Premium",
    precoVenda: 35000.00,
    mensalidade: 2000.00,
    descricao: "Acesso ilimitado à API Nexus",
    moeda: "BRL",
    status: "Ativo"
  },

  // ========== NEXUS HEALTH ==========
  {
    id: "NEX-HEALTH-001",
    nome: "Nexus Health",
    categoria: "SaaS",
    precoVenda: 50000.00,
    mensalidade: 5000.00,
    descricao: "IA de diagnóstico médico - 94.7% acurácia",
    moeda: "BRL",
    status: "Ativo"
  },

  // ========== NEXUS ENERGIA ==========
  {
    id: "NEX-ENERGY-001",
    nome: "Nexus Energia / Helios",
    categoria: "SaaS",
    precoVenda: 60000.00,
    mensalidade: 6000.00,
    descricao: "Previsão de PLD + manutenção preditiva + zero apagões",
    moeda: "BRL",
    status: "Ativo"
  },

  // ========== NEXUS ESTÚDIO ==========
  {
    id: "NEX-STUDIO-001",
    nome: "Nexus Estúdio",
    categoria: "SaaS",
    precoVenda: 25000.00,
    mensalidade: 2500.00,
    descricao: "Locutor virtual 24h + síntese de voz profissional",
    moeda: "BRL",
    status: "Ativo"
  }
];
```

### Passo 4: Validar sintaxe
```bash
npm run build
# Se passar, está certo. Se falhar, verifica se fechou todas as chaves/colchetes
```

### Passo 5: Testar com curl
```bash
npm run dev
# Em outro terminal:
curl -X POST http://localhost:3000/api/isadora \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Sou agricultor"}]}'

# Deve responder mencionando DANTE SAFRA com os benefícios
```

✅ **CRÍTICO #1 COMPLETO**

---

## CRÍTICO #2: Histórico Persistente em Z-API (45min)

### Passo 1: Abrir arquivo
```bash
code src/app/api/isadora/webhook/route.ts
```

### Passo 2: Encontrar linhas para substituir

**PROCURE POR**:
```typescript
// Memória de conversa + nicho detectado por número
const conversationHistory: Record<string, { 
  role: string; 
  content: any[] 
}[]> = {};
const clientNiche: Record<string, string> = {};
const purchaseIntention: Record<string, number> = {};
```

**SUBSTITUA POR**:
```typescript
// Imports DynamoDB
import { getChatHistory, saveChatHistory } from '@/lib/memory';

// Nicho detectado por número (pode manter em memória)
const clientNiche: Record<string, string> = {};
const purchaseIntention: Record<string, number> = {};
```

### Passo 3: Encontrar função `getIsadoraResponse`

**PROCURE POR**:
```typescript
async function getIsadoraResponse(phone: string, userMessage: string): Promise<{ response: string; shouldHandoff: boolean }> {
  if (!conversationHistory[phone]) conversationHistory[phone] = [];
```

**SUBSTITUA POR**:
```typescript
async function getIsadoraResponse(phone: string, userMessage: string): Promise<{ response: string; shouldHandoff: boolean }> {
  // Fetch histórico do DynamoDB
  let history = await getChatHistory(phone);
  
  // Converter formato DynamoDB para Bedrock
  const conversationHistory = history.map(msg => ({
    role: msg.role as 'user' | 'model',
    content: [{ text: msg.text }]
  }));
```

### Passo 4: Encontrar onde push na conversa

**PROCURE POR**:
```typescript
  conversationHistory[phone].push({ role: "user", content: [{ text: userMessage }] });

  // Mantém apenas as últimas 20 mensagens
  if (conversationHistory[phone].length > 20) {
    conversationHistory[phone] = conversationHistory[phone].slice(-20);
  }
```

**SUBSTITUA POR**:
```typescript
  // Adicionar mensagem do usuário
  conversationHistory.push({ role: "user", content: [{ text: userMessage }] });

  // Manter últimas 20 mensagens
  conversationHistory.slice(-20);

  // Salvar em DynamoDB
  await saveChatHistory(phone, conversationHistory.map(msg => ({
    role: msg.role,
    text: msg.content[0]?.text || ''
  })));
```

### Passo 5: Encontrar resposta final

**PROCURE POR**:
```typescript
  conversationHistory[phone].push({ role: "assistant", content: [{ text: textResponse }] });

  return { response: textResponse, shouldHandoff: false };
}
```

**SUBSTITUA POR**:
```typescript
  // Adicionar resposta do assistente
  conversationHistory.push({ role: "assistant", content: [{ text: textResponse }] });

  // Salvar em DynamoDB
  await saveChatHistory(phone, conversationHistory.map(msg => ({
    role: msg.role,
    text: msg.content[0]?.text || ''
  })));

  return { response: textResponse, shouldHandoff: false };
}
```

### Passo 6: Ajustar comando Converse

**PROCURE POR**:
```typescript
  let command = new ConverseCommand({
    modelId: "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
    messages: conversationHistory[phone] as any,
    system: systemPrompt,
    inferenceConfig: { maxTokens: 1024, temperature: 0.7 },
    toolConfig,
  });
```

**SUBSTITUA POR**:
```typescript
  let command = new ConverseCommand({
    modelId: "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
    messages: conversationHistory as any,  // ← Remover [phone]
    system: systemPrompt,
    inferenceConfig: { maxTokens: 1024, temperature: 0.4 },  // ← Mudou para 0.4!
    toolConfig,
  });
```

### Passo 7: Testar
```bash
npm run dev

# Terminal 2 - Enviar mensagem 1
curl -X POST http://localhost:3000/api/isadora/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "phone":"5551988887777",
    "text":{"message":"Oi, vendo roupas"},
    "fromMe":false
  }'
# Responde com Inova Moda

# Restart servidor (Ctrl+C e npm run dev novamente)

# Terminal 2 - Enviar mensagem 2
curl -X POST http://localhost:3000/api/isadora/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "phone":"5551988887777",
    "text":{"message":"qual é o preço?"},
    "fromMe":false
  }'
# Deve LEMBRAR que cliente vende roupas ✅
```

✅ **CRÍTICO #2 COMPLETO** (+ Temperature mudada para 0.4!)

---

## CRÍTICO #3: Variáveis de Ambiente (30min)

### Passo 1: Criar arquivo `.env.production`
```bash
cp .env .env.production
# Ou se não existir .env:
touch .env.production
```

### Passo 2: Adicionar variáveis necessárias

**COPIE E COLE ISTO** em `.env.production`:

```bash
# AWS / Bedrock
BEDROCK_REGION=us-east-1
AWS_ACCESS_KEY_ID=<sua-chave-aqui>
AWS_SECRET_ACCESS_KEY=<sua-secreta-aqui>
AWS_REGION=us-east-1

# Z-API
ZAPI_INSTANCE=<seu-instance-id>
ZAPI_TOKEN=<seu-token>

# Evolution API (opcional, se usar Evolution)
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_INSTANCE_NAME=Isadora
EVOLUTION_GLOBAL_APIKEY=<sua-chave>

# Node
NODE_ENV=production

# DynamoDB (será criada no AWS)
DYNAMODB_TABLE_NAME=Nexus_Isadora_Memory
```

### Passo 3: Validar cada variável

```bash
# 1. Bedrock
curl -X POST https://bedrock.us-east-1.amazonaws.com/ \
  -H "Authorization: AWS4-HMAC-SHA256 ..." \
  -d '...'
# Se receber 403 (Unauthorized), variáveis estão erradas
# Se receber 400 (Bad Request), pelo menos credenciais funcionam ✅

# 2. Z-API
curl -I "https://api.z-api.io/instances/$ZAPI_INSTANCE/token/$ZAPI_TOKEN/send-text"
# HTTP 405 (Method Not Allowed) = OK ✅
# HTTP 401 (Unauthorized) = Token errado ❌

# 3. DynamoDB
aws dynamodb describe-table \
  --table-name Nexus_Isadora_Memory \
  --region us-east-1
# Deve retornar descrição da tabela
```

### Passo 4: Fazer build com .env.production
```bash
npm run build
# Se passar, variáveis estão OK
```

✅ **CRÍTICO #3 COMPLETO**

---

## BONUS: Adicionar Validações no Código

Abra `src/app/api/isadora/webhook/route.ts` e adicione NO INÍCIO da função POST:

```typescript
// Validações de variáveis
if (!ZAPI_INSTANCE || !ZAPI_TOKEN) {
  console.error('❌ ERRO: ZAPI_INSTANCE ou ZAPI_TOKEN não configurados');
  return NextResponse.json({ error: 'Configuração Z-API incompleta' }, { status: 500 });
}

console.log('✅ Z-API configurado:', { ZAPI_INSTANCE });
```

---

## ✅ CHECKLIST DE CONCLUSÃO

```
FEITO?
☐ Preços: Dante Safra + Nexus Empresas (12) + Premium (4) + Health + Energia + Studio
☐ Histórico: getChatHistory/saveChatHistory importados e integrados
☐ Temperature: Mudado para 0.4
☐ Variáveis: .env.production criado e preenchido
☐ Build: npm run build passou sem erros
☐ Testes: curl funcionou para cada crítico

SE TUDO OK:
☐ Commit: git add . && git commit -m "fix: 3 críticos para produção"
☐ Push: git push origin main
☐ Review: Geanderson valida
☐ Deploy: Deploy em staging
☐ QA: Testes de fluxo completo
☐ Produção: Deploy em prod
```

---

## 🚨 TROUBLESHOOTING

**Erro: "table.json not found"**
→ Faltou importar `getChatHistory` e `saveChatHistory`

**Erro: "ZAPI_INSTANCE is undefined"**
→ Faltou `.env.production` ou não setou a variável

**Erro: "conversationHistory is not defined"**
→ Removeu a variável local mas não completou a refatoração

**Webhook não responde**
→ Variável `ZAPI_INSTANCE` vazia (servidor não consegue enviar resposta)

**Histórico continua perdendo contexto**
→ DynamoDB tabela não existe. Criar em: https://console.aws.amazon.com/dynamodb/

---

**Tempo total**: ~2.5-3h se tudo correr bem  
**Próximo**: QA + Produção  
**Apoio**: Ler ISADORA_PRODUCAO_CHECKLIST.md para detalhes
