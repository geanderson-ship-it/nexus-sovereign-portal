# 🔧 GUIA RÁPIDO DE IMPLEMENTAÇÃO — ISADORA FIXES

**Data**: 2026-07-02  
**Tempo total de implementação**: ~4-5 horas para críticos  
**Dificuldade**: Fácil (sem mudanças arquiteturais)

---

## ✅ FIX #1: Completar Tabela de Preços (30-60 min)

**Arquivo**: `src/lib/nexus-db.ts`

**Ação**:
1. Abra `src/lib/nexus-db.ts`
2. Expanda o array `tabelaPrecosNexus`
3. Adicione os produtos faltantes (código abaixo)
4. Teste com `curl` para validar

**Código a Adicionar**:

```typescript
// Adicionar após NEX-007, dentro de tabelaPrecosNexus array:

  // ========== DANTE SAFRA ==========
  {
    id: "DAD-001",
    nome: "Dante Safra",
    categoria: "SaaS",
    precoVenda: 999.00,
    anualidade: true,
    descricao: "Terminal tático de IA agrícola - Diagnóstico de pragas, manejo zootécnico, decisões de mercado",
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
    descricao: "Análise de cotações, -30% custos de aquisição",
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
    descricao: "Tempos padrão, eficiência por operador",
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
    precoVenda: 10500.00,
    mensalidade: 420.00,
    descricao: "Do estoque ao cliente sem erros",
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-EMP-008",
    nome: "Nexus Empresas - Nexus RH",
    categoria: "SaaS Enterprise",
    precoVenda: 10500.00,
    mensalidade: 420.00,
    descricao: "Recrutamento inteligente, match preditivo",
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-EMP-009",
    nome: "Nexus Empresas - Nexus Estratégia",
    categoria: "SaaS Enterprise",
    precoVenda: 21000.00,
    mensalidade: 840.00,
    descricao: "Conselheiro C-Level, simulador de cenários",
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-EMP-010",
    nome: "Nexus Empresas - Nexus Engenharia",
    categoria: "SaaS Enterprise",
    precoVenda: 16000.00,
    mensalidade: 640.00,
    descricao: "Banco de dados master, BOM, tempos",
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-EMP-011",
    nome: "Nexus Empresas - Nexus Qualidade",
    categoria: "SaaS Enterprise",
    precoVenda: 10500.00,
    mensalidade: 420.00,
    descricao: "Inspeção, checklists, RNC, 5W2H",
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-EMP-012",
    nome: "Nexus Empresas - Pacote Enterprise (11 módulos)",
    categoria: "SaaS Enterprise",
    precoVenda: 120000.00,
    mensalidade: 5280.00,
    desconto: 0.35,
    descricao: "Todos os 11 módulos com 35% desconto",
    moeda: "BRL",
    status: "Ativo"
  },

  // ========== NEXUS PREMIUM ==========
  {
    id: "NEX-PREM-001",
    nome: "Nexus Premium - Maga Dot",
    categoria: "SaaS Premium",
    precoVenda: 0.00, // Sob consulta
    precoUnderConsultation: true,
    descricao: "IA com consciência operacional, treinada com DNA corporativo",
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-PREM-002",
    nome: "Nexus Premium - Orion",
    categoria: "SaaS Premium",
    precoVenda: 0.00,
    precoUnderConsultation: true,
    descricao: "Arquiteto matemático, Big Data, simulador de cenários",
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-PREM-003",
    nome: "Nexus Premium - Pactum",
    categoria: "SaaS Premium",
    precoVenda: 0.00,
    precoUnderConsultation: true,
    descricao: "Arma de negociação - Detecção de blefe, auditoria de contratos",
    moeda: "BRL",
    status: "Ativo"
  },
  {
    id: "NEX-PREM-004",
    nome: "Nexus Premium - Égide",
    categoria: "SaaS Premium",
    precoVenda: 0.00,
    precoUnderConsultation: true,
    descricao: "Blindagem tática - Segurança, LPR, IA preditiva criminal",
    moeda: "BRL",
    status: "Ativo"
  },

  // ========== NEXUS HEALTH ==========
  {
    id: "NEX-HEALTH-001",
    nome: "Nexus Health",
    categoria: "SaaS",
    precoVenda: 0.00,
    precoUnderConsultation: true,
    descricao: "IA Diagnóstica Médica - 94.7% acurácia, < 90s por análise",
    moeda: "BRL",
    status: "Ativo"
  },

  // ========== NEXUS ENERGIA (Helios) ==========
  {
    id: "NEX-ENERGIA-001",
    nome: "Nexus Energia - Helios",
    categoria: "SaaS",
    precoVenda: 0.00,
    precoUnderConsultation: true,
    descricao: "IA Setor Energético - Manutenção preditiva, análise de mercado",
    moeda: "BRL",
    status: "Ativo"
  },

  // ========== NEXUS ESTÚDIO ==========
  {
    id: "NEX-STUDIO-001",
    nome: "Nexus Estúdio",
    categoria: "SaaS",
    precoVenda: 0.00,
    precoUnderConsultation: true,
    descricao: "Locutor virtual IA 24h - Voz neural, automação de rádio",
    moeda: "BRL",
    status: "Ativo"
  },
```

**Teste**:
```bash
# Verificar se Dante Safra agora está na tabela:
curl -X POST http://localhost:3000/api/isadora \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Qual o preço do Dante Safra?"}]
  }'

# Resposta esperada: Inclua "R$ 999" na resposta
```

---

## ✅ FIX #2: Persistir Histórico de Conversa (Z-API) (45 min)

**Arquivo**: `src/app/api/isadora/webhook/route.ts`

**Ação**:
1. Remova a variável local `conversationHistory`
2. Substitua todas as referências por `getChatHistory()` / `saveChatHistory()`
3. Teste com webhook

**Substituições**:

```typescript
// ===== ANTES (linha ~12) =====
const conversationHistory: Record<string, { role: string; content: any[] }[]> = {};

// ===== DEPOIS (REMOVER) =====
// (Usar getChatHistory / saveChatHistory do DynamoDB)

// ===== DENTRO DE getIsadoraResponse() =====

// ANTES:
async function getIsadoraResponse(phone: string, userMessage: string): Promise<string> {
  if (!conversationHistory[phone]) conversationHistory[phone] = [];
  conversationHistory[phone].push({ role: "user", content: [{ text: userMessage }] });

// DEPOIS:
async function getIsadoraResponse(phone: string, userMessage: string): Promise<string> {
  // Fetch histórico do DynamoDB
  const chatHistory = await getChatHistory(phone);
  
  // Converter para formato Bedrock
  const conversationHistory = chatHistory.map((msg: ChatMessage) => ({
    role: msg.role === 'model' ? 'assistant' : 'user',
    content: [{ text: msg.text }]
  }));
  
  conversationHistory.push({ role: "user", content: [{ text: userMessage }] });

// ... resto da lógica ...

// ANTES (final da função):
conversationHistory[phone].push({ role: "assistant", content: [{ text: textResponse }] });
return textResponse;

// DEPOIS:
chatHistory.push({ role: 'model', text: textResponse });
await saveChatHistory(phone, chatHistory);
return textResponse;
```

**Import adicional necessário**:
```typescript
import { getChatHistory, saveChatHistory, ChatMessage } from '@/lib/memory';
```

**Teste**:
```typescript
// No DynamoDB, verificar se histórico está sendo salvo:
// aws dynamodb scan --table-name Nexus_Isadora_Memory
```

---

## ✅ FIX #3: Deprecar Z-API ou Unificar (30 min)

**Opção A — Recomendado: Manter apenas Evolution**

```typescript
// src/app/api/isadora/webhook/route.ts
// Adicione no início do arquivo:

export async function GET() {
  return NextResponse.json({ 
    status: "Deprecated",
    message: "Use POST /api/webhook/whatsapp em vez disso"
  });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({
    error: "Endpoint deprecated. Use /api/webhook/whatsapp"
  }, { status: 410 });
}
```

**Opção B — Manter ambos: Unificar para DynamoDB**

```typescript
// Já feito no FIX #2 acima
// Ambos webhooks agora usam DynamoDB
```

---

## ✅ FIX #4: Ajustar Temperature (5 min)

**Arquivo**: `src/app/api/isadora/webhook/route.ts` + `src/app/api/webhook/whatsapp/route.ts`

**Substituição 1** (Z-API):
```typescript
// ANTES:
inferenceConfig: { maxTokens: 1024, temperature: 0.7 }

// DEPOIS:
inferenceConfig: { maxTokens: 1024, temperature: 0.4 }
```

**Substituição 2** (Evolution):
```typescript
// ANTES:
temperature: 0.7

// DEPOIS:
temperature: 0.4
```

**Substituição 3** (HTTP):
```typescript
// ANTES:
inferenceConfig: { maxTokens: 4096, temperature: 0.7 }

// DEPOIS:
inferenceConfig: { maxTokens: 4096, temperature: 0.4 }
```

---

## ✅ FIX #5: Rate Limiting (60 min)

**Arquivo**: Criar `src/lib/rateLimit.ts`

```typescript
// src/lib/rateLimit.ts

interface RateLimitEntry {
  timestamps: number[];
  firstRequest: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const WINDOW_MS = 60000; // 1 minuto
const MAX_REQUESTS = 30; // máximo 30 requisições por minuto

export function checkRateLimit(phone: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(phone);

  if (!entry) {
    rateLimitMap.set(phone, {
      timestamps: [now],
      firstRequest: now
    });
    return true;
  }

  // Remover timestamps fora da janela
  entry.timestamps = entry.timestamps.filter(t => now - t < WINDOW_MS);

  if (entry.timestamps.length >= MAX_REQUESTS) {
    return false; // Bloqueado
  }

  entry.timestamps.push(now);
  return true;
}

export function resetRateLimit(phone: string): void {
  rateLimitMap.delete(phone);
}

// Limpeza periódica (executar a cada 5 min)
setInterval(() => {
  const now = Date.now();
  for (const [phone, entry] of rateLimitMap.entries()) {
    if (now - entry.firstRequest > WINDOW_MS * 2) {
      rateLimitMap.delete(phone);
    }
  }
}, 5 * 60 * 1000);
```

**Usar no webhook**:
```typescript
// src/app/api/isadora/webhook/route.ts
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = body?.phone || body?.from;

    // Verificar rate limit
    if (!checkRateLimit(phone)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    // ... resto do código ...
```

---

## ✅ FIX #6: CloudWatch Logs (90 min)

**Arquivo**: Criar `src/lib/logger.ts`

```typescript
// src/lib/logger.ts
import { CloudWatchLogsClient, PutLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";

const logsClient = new CloudWatchLogsClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const LOG_GROUP = '/aws/isadora';
const LOG_STREAM = new Date().toISOString().split('T')[0]; // por dia

interface LogEvent {
  timestamp: number;
  message: string;
}

export async function logToCloudWatch(
  level: 'INFO' | 'ERROR' | 'WARN',
  phone: string,
  message: string,
  metadata?: any
) {
  try {
    const logMessage = JSON.stringify({
      level,
      phone,
      message,
      timestamp: new Date().toISOString(),
      metadata
    });

    // Para production, enviar para CloudWatch
    // Por enquanto, logar localmente:
    console.log(logMessage);

    // Descomentar quando CloudWatch estiver configurado:
    /*
    await logsClient.send(new PutLogEventsCommand({
      logGroupName: LOG_GROUP,
      logStreamName: LOG_STREAM,
      logEvents: [{
        timestamp: Date.now(),
        message: logMessage
      }]
    }));
    */
  } catch (error) {
    console.error('Erro ao logar:', error);
  }
}
```

**Usar nos webhooks**:
```typescript
import { logToCloudWatch } from '@/lib/logger';

// Dentro de getIsadoraResponse:
await logToCloudWatch('INFO', phone, 'Mensagem recebida', { text: userMessage });
await logToCloudWatch('INFO', phone, 'Resposta enviada', { response: textResponse });
```

---

## 🚀 CHECKLIST DE IMPLEMENTAÇÃO

### Sprint 1 (Esta semana)
- [ ] **#1** Completar tabela de preços (30-60 min)
  - [ ] Adicionar Dante Safra
  - [ ] Adicionar Nexus Empresas (12 mod)
  - [ ] Adicionar Nexus Premium (4 mod)
  - [ ] Adicionar Nexus Health, Energia, Estúdio
  - [ ] Testar com curl
  
- [ ] **#2** Migrar Z-API para DynamoDB (45 min)
  - [ ] Remover conversationHistory local
  - [ ] Implementar getChatHistory/saveChatHistory
  - [ ] Testar persistência ao restart
  
- [ ] **#3** Deprecar/Unificar webhooks (30 min)
  - [ ] Decidir entre deprecação ou unificação
  - [ ] Implementar
  - [ ] Testar

- [ ] **#4** Ajustar temperature (5 min)
  - [ ] Mudar de 0.7 → 0.4 em 3 arquivos
  - [ ] Testar respostas

**Total Sprint 1**: ~2.5 horas  
**Ganho**: Isadora funcional e vendável

---

### Sprint 2 (Próxima semana)
- [ ] **#5** Rate limiting (60 min)
- [ ] **#6** CloudWatch logs (90 min)
- [ ] **#7** Validação de entrada (30 min)
- [ ] **#8** Error handling Evolution (15 min)
- [ ] **#9** Retry logic (60 min)

**Total Sprint 2**: ~4-5 horas

---

## 🧪 TESTES RECOMENDADOS

### Teste #1: Isadora consegue vender todos os produtos?
```bash
curl -X POST http://localhost:3000/api/isadora \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Qual o preço do Dante Safra?"},
      {"role": "user", "content": "E do Nexus Empresas?"},
      {"role": "user", "content": "Qual o valor da Inova Moda?"}
    ]
  }'

# Esperado: Todas as respostas devem incluir preços
```

### Teste #2: Histórico persiste após restart?
```bash
# 1. Enviar mensagem
# 2. Restart servidor
# 3. Isadora lembra do contexto anterior?

# COM FIX: ✅ SIM
# SEM FIX: ❌ NÃO
```

### Teste #3: Rate limiting funciona?
```bash
# Enviar 31 requisições em 1 minuto
for i in {1..31}; do
  curl -X POST http://localhost:3000/api/isadora/webhook \
    -H "Content-Type: application/json" \
    -d "{\"phone\": \"5551999999999\", \"text\": {\"message\": \"Teste $i\"}, \"fromMe\": false}"
done

# Esperado: Requisição #31 retorna 429 (Too Many Requests)
```

---

## 📞 SUPORTE

| Problema | Solução |
|---|---|
| DynamoDB erro de conexão | Verificar AWS credentials em .env |
| Bedrock erro 401 | Verificar BEDROCK_ACCESS_KEY_ID |
| Z-API não envia mensagem | Verificar ZAPI_INSTANCE e ZAPI_TOKEN |
| Histórico não salva | Verificar se DynamoDB table existe |
| CloudWatch não escreve | CloudWatch está em staging, não production |

---

**Documento preparado por**: GitHub Copilot  
**Data**: 2026-07-02  
**Estimativa de conclusão dos críticos**: ~4-5 horas
