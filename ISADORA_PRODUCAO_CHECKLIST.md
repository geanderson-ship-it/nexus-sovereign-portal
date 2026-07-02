# 🚀 CHECKLIST DE PRODUÇÃO — ISADORA VENDEDORA

**Status Global**: ⚠️ **70% PRONTA**  
**Data**: 2026-07-02  
**Responsável**: Geanderson Schuh (Founder)  
**Última Atualização**: Análise completa

---

## 📊 RESUMO EXECUTIVO

| Categoria | Status | Ação Necessária | Tempo |
|-----------|--------|-----------------|-------|
| **Infraestrutura de IA** | ✅ OK | Nenhuma | — |
| **Webhooks (Z-API/Evolution)** | ⚠️ PARCIAL | Unificar em DynamoDB | 1.5h |
| **Tabela de Preços** | 🔴 CRÍTICO | Completar 60% dos produtos | 1.5h |
| **Histórico Persistente** | 🔴 CRÍTICO | Implementar em Z-API | 45min |
| **Temperature de IA** | 🟡 IMPORTANTE | Reduzir para 0.4 | 5min |
| **Rate Limiting** | 🟡 IMPORTANTE | Implementar proteção | 30min |
| **Notificações** | 🟡 IMPORTANTE | Email/WhatsApp para Geanderson | 1h |
| **Logging** | 🟡 IMPORTANTE | Estruturar logs | 45min |
| **Testes** | 🔴 CRÍTICO | Validar fluxo completo | 2h |
| **Variáveis de Ambiente** | 🔴 CRÍTICO | Validar todas | 30min |
| **DynamoDB Produção** | 🔴 CRÍTICO | Criar tabela em produção | 30min |
| **Monitoramento** | 🟠 OPORTUNIDADE | Alertas em produção | 1h |

---

## 🔴 SPRINT CRÍTICO — DEVE SER FEITO HOJE/AMANHÃ (5h)

### 1️⃣ [MÁXIMA PRIORIDADE] Completar Tabela de Preços — 1h 30min
**Status**: 🔴 BLOQUEANTE  
**Impacto**: Isadora consegue vender apenas 14% do portfólio  
**Arquivo**: `src/lib/nexus-db.ts`

**O que falta**:
- [ ] Dante Safra (R$ 999/ano) — MAIS VENDIDO
- [ ] Nexus Empresas (12 módulos, R$10k-18k cada)
- [ ] Nexus Premium (4 módulos)
- [ ] Nexus Health (R$ 5k/mês)
- [ ] Nexus Energia/Helios
- [ ] Nexus Estúdio

**Checklist**:
```typescript
// Adicionar em tabelaPrecosNexus:
❌ Dante Safra { id: "DAD-001", precoVenda: 999.00, ... }
❌ NEX-EMP-001 a 012 (Nexus Empresas)
❌ NEX-PREMIUM-001 a 004
❌ NEX-HEALTH-001
❌ NEX-ENERGY-001
❌ NEX-STUDIO-001
```

**Teste após**:
```bash
curl -X POST http://localhost:3000/api/isadora \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role":"user","content":"Sou agricultor"}]}'
# Deve responder mencionando Dante Safra com preço
```

**Responsável**: Backend dev  
**Deadline**: HOJE

---

### 2️⃣ [BLOQUEANTE] Histórico Persistente em Z-API — 45min
**Status**: 🔴 CRÍTICO  
**Impacto**: +50% tempo de conversa, contexto não é perdido  
**Arquivo**: `src/app/api/isadora/webhook/route.ts`

**Problema**:
```typescript
// ERRADO ❌ (atual)
const conversationHistory: Record<string, any> = {};

// CORRETO ✅ (deve ser)
import { getChatHistory, saveChatHistory } from '@/lib/memory';
```

**Checklist**:
- [ ] Importar `getChatHistory` e `saveChatHistory` de `src/lib/memory.ts`
- [ ] Remover variável local `conversationHistory`
- [ ] Na função `getIsadoraResponse()`:
  ```typescript
  // Antes de processar:
  let history = await getChatHistory(phone);
  
  // Adicionar mensagem do usuário:
  history.push({ role: 'user', text: userMessage });
  
  // Após resposta:
  await saveChatHistory(phone, history);
  ```
- [ ] Testar com restart do servidor — contexto deve persistir
- [ ] Remover `clientNiche` e `purchaseIntention` do escopo local (mover para DynamoDB se necessário)

**Teste**:
```bash
# Terminal 1: Inicia servidor
npm run dev

# Terminal 2: Envia mensagem 1
curl -X POST http://localhost:3000/api/isadora/webhook \
  -H "Content-Type: application/json" \
  -d '{"phone":"5551999999999","text":{"message":"Olá"}}'

# Restart servidor
# Terminal 2: Envia mensagem 2
curl -X POST http://localhost:3000/api/isadora/webhook \
  -H "Content-Type: application/json" \
  -d '{"phone":"5551999999999","text":{"message":"Qual é o preço?"}}'
# Deve ter contexto da mensagem anterior ✅
```

**Responsável**: Backend dev  
**Deadline**: HOJE

---

### 3️⃣ [BLOQUEANTE] Temperature = 0.4 (Consistência) — 5min
**Status**: 🟡 IMPORTANTE  
**Impacto**: Respostas mais previsíveis e comercialmente consistentes  
**Arquivo**: `src/app/api/isadora/webhook/route.ts`

**Mudança**:
```typescript
// Linha ~180 (Buscar por "temperature: 0.7")

// ANTES ❌
inferenceConfig: { maxTokens: 1024, temperature: 0.7 }

// DEPOIS ✅
inferenceConfig: { maxTokens: 1024, temperature: 0.4 }
```

**Responsável**: Backend dev  
**Deadline**: HOJE

---

### 4️⃣ [BLOQUEANTE] Variáveis de Ambiente — 30min
**Status**: 🔴 CRÍTICO  
**Arquivo**: `.env.local` ou sistema de deployment

**Checklist — Validar que TODAS estão configuradas**:

#### AWS/Bedrock (Necessário)
```bash
✅ BEDROCK_REGION = us-east-1 (ou sua região)
✅ AWS_ACCESS_KEY_ID = XXX
✅ AWS_SECRET_ACCESS_KEY = XXX
✅ AWS_REGION = us-east-1
```

**OU** (alternativo):
```bash
✅ AMPLIFY_REGION = us-east-1
✅ AMPLIFY_ACCESS_KEY_ID = XXX
✅ AMPLIFY_SECRET_ACCESS_KEY = XXX
```

#### Z-API (Se usar Z-API webhook)
```bash
✅ ZAPI_INSTANCE = xxx (seu instance ID)
✅ ZAPI_TOKEN = xxx (seu token)
```

#### Evolution API (Se usar Evolution webhook)
```bash
✅ EVOLUTION_API_URL = http://localhost:8080 (ou URL remota)
✅ EVOLUTION_INSTANCE_NAME = Isadora
✅ EVOLUTION_GLOBAL_APIKEY = xxx
```

#### DynamoDB (Necessário para histórico)
```bash
✅ AWS_REGION = us-east-1
✅ DYNAMODB_TABLE_NAME = Nexus_Isadora_Memory
```

**Validação no código**:
```typescript
// Adicionar em src/app/api/isadora/webhook/route.ts (no início)
if (!ZAPI_INSTANCE || !ZAPI_TOKEN) {
  throw new Error('❌ ZAPI_INSTANCE ou ZAPI_TOKEN não configurados!');
}
console.log('✅ Z-API configurado:', { ZAPI_INSTANCE });
```

**Responsável**: DevOps/Backend  
**Deadline**: HOJE

---

### 5️⃣ [BLOQUEANTE] DynamoDB em Produção — 30min
**Status**: 🔴 CRÍTICO  
**Arquivo**: Console AWS / CloudFormation

**Checklist**:
- [ ] Tabela `Nexus_Isadora_Memory` criada em produção
- [ ] Partition Key: `phone` (string)
- [ ] Atributos: `phone`, `history` (list), `lastInteraction` (string)
- [ ] TTL: 90 dias (opcional, para limpeza automática)
- [ ] Backups habilitados
- [ ] Credenciais da tabela testadas localmente:
  ```bash
  npm install --save-dev @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
  
  # Teste em local com .env correto
  node -e "
    const { getChatHistory, saveChatHistory } = require('./src/lib/memory.ts');
    await saveChatHistory('5551999999999', [{ role: 'user', text: 'teste' }]);
    const hist = await getChatHistory('5551999999999');
    console.log('✅ DynamoDB OK:', hist);
  "
  ```

**Responsável**: DevOps  
**Deadline**: HOJE

---

## 🟡 SPRINT #2 — IMPORTANTE (2-3h)

### 6️⃣ Notificações para Geanderson (Venda Quente) — 1h
**Status**: 🟡 IMPORTANTE  
**Impacto**: Geanderson recebe alerta em tempo real quando cliente está pronto para fechar  
**Arquivo**: `src/app/api/isadora/webhook/route.ts`

**Atual (Broken)**:
```typescript
if (shouldHandoff) {
  // TODO: Notificar Geanderson/Ivoni de venda quente
  console.log(`[Isadora] 🔥 VENDA QUENTE! Registrando handoff para ${phone}`);
  // ← Só loga, não envia nada!
}
```

**O que fazer**:
- [ ] Criar função `notifyHotLead()` que envia:
  - Email para geanderson@nexus.com
  - Mensagem WhatsApp para Geanderson (via Evolution ou outro)
  - Log em DynamoDB (tabela `Nexus_Hot_Leads`)

**Template de notificação**:
```
🔥 VENDA QUENTE DETECTADA!

📱 Cliente: {phone}
🎯 Nicho: {niche}
📊 Intenção: {score}/10
⏰ Horário: {timestamp}

📝 Últimas mensagens:
{historyContext}

➡️ Ação: Ligue/envie WhatsApp para {phone}
```

**Responsável**: Backend dev  
**Deadline**: Sprint 2

---

### 7️⃣ Rate Limiting — 30min
**Status**: 🟡 IMPORTANTE  
**Impacto**: Proteção contra spam/DoS  
**Arquivo**: `src/app/api/isadora/webhook/route.ts`

**Implementação**:
```typescript
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(phone: string, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const timestamps = rateLimitMap.get(phone) || [];
  
  // Remove timestamps fora da janela
  const validTimestamps = timestamps.filter(t => now - t < windowMs);
  
  if (validTimestamps.length >= maxRequests) {
    return false; // Bloqueado
  }
  
  validTimestamps.push(now);
  rateLimitMap.set(phone, validTimestamps);
  return true; // Permitido
}

// No webhook POST:
if (!checkRateLimit(phone)) {
  console.warn(`[Rate Limit] Bloqueado ${phone}`);
  return NextResponse.json({ error: "Muitas requisições" }, { status: 429 });
}
```

**Responsável**: Backend dev  
**Deadline**: Sprint 2

---

### 8️⃣ Logging Estruturado — 45min
**Status**: 🟡 IMPORTANTE  
**Impacto**: Troubleshooting mais fácil em produção  
**Arquivo**: Criar `src/lib/isadora-logger.ts`

**Estrutura**:
```typescript
export function logIsadora(level: 'info'|'warn'|'error', phone: string, action: string, data?: any) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    phone,
    action,
    data,
    env: process.env.NODE_ENV
  };
  
  console.log(JSON.stringify(entry)); // Para CloudWatch
  
  // Opcional: Salvar em DynamoDB
  if (level === 'error') {
    saveLargeLog(entry).catch(e => console.error('Log save failed:', e));
  }
}

// Uso:
logIsadora('info', phone, 'NICHE_DETECTED', { niche, confidence: 0.95 });
logIsadora('warn', phone, 'RATE_LIMIT_HIT', { requests: 12 });
logIsadora('error', phone, 'BEDROCK_FAILURE', { error: error.message });
```

**Responsável**: Backend dev  
**Deadline**: Sprint 2

---

## 🟠 SPRINT #3 — OPORTUNIDADES (1-2h)

### 9️⃣ Monitoramento e Alertas — 1h
**Status**: 🟠 OPORTUNIDADE  
**Impacto**: Detecta problemas antes do cliente reclamar

**Implementar**:
- [ ] CloudWatch metrics para:
  - Requisições/min ao webhook
  - Tempo médio de resposta
  - Taxa de erro
  - Handoffs por hora
- [ ] Alertas:
  - Taxa de erro > 5% → SMS para DevOps
  - Webhook não responde > 10s → alerta
  - Nenhuma conversa em 1h → possível outage

**Responsável**: DevOps  
**Deadline**: Sprint 3

---

### 🔟 Retry Logic — 30min
**Status**: 🟠 OPORTUNIDADE  
**Impacto**: Falhas transitórias não interrompem vendas

**Implementar**:
```typescript
async function sendWhatsAppWithRetry(phone: string, message: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await sendWhatsApp(phone, message);
      return true;
    } catch (error) {
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
      }
    }
  }
  logIsadora('error', phone, 'SEND_FAILED_AFTER_RETRIES');
  return false;
}
```

**Responsável**: Backend dev  
**Deadline**: Sprint 3

---

## ✅ TESTES ANTES DE PRODUÇÃO (2h)

### 🧪 Teste 1: Fluxo Completo End-to-End
```bash
# 1. Cliente envia mensagem (simular Z-API)
curl -X POST https://SEU_DOMINIO/api/isadora/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5551988887777",
    "text": { "message": "Olá, vendo roupas" },
    "fromMe": false
  }'
# Esperado: Isadora responde com InovaModa 360

# 2. Cliente demonstra interesse
curl -X POST https://SEU_DOMINIO/api/isadora/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5551988887777",
    "text": { "message": "Quanto custa?" },
    "fromMe": false
  }'
# Esperado: Escalação + email para Geanderson + WhatsApp

# 3. Servidor reinicia e cliente envia outra
# Esperado: Contexto persiste (saúda pelo nome/nicho)
```

### 🧪 Teste 2: Variáveis de Ambiente
```bash
# Verificar que nenhuma variável está hardcoded
grep -r "instance_id\|api_key\|token" src/app/api/isadora/ --include="*.ts"
# Resultado esperado: Nenhum match (tudo deve vir de .env)
```

### 🧪 Teste 3: DynamoDB Persistência
```bash
# 1. Enviar 5 mensagens
# 2. Restart servidor
# 3. Enviar 1 mensagem final
# 4. Verificar em DynamoDB se histórico tem 6 mensagens
```

### 🧪 Teste 4: Rate Limiting
```bash
# Disparar 50 requisições em 10 segundos do mesmo telefone
for i in {1..50}; do
  curl -X POST http://localhost:3000/api/isadora/webhook \
    -H "Content-Type: application/json" \
    -d '{"phone":"5551999999999","text":{"message":"oi"},"fromMe":false}' &
done
# Esperado: ~40 devem ser bloqueadas com HTTP 429
```

---

## 📋 CHECKLIST FINAL — ANTES DE DEPLOY

```
CONFIGURAÇÃO
☐ Todas as variáveis de ambiente estão em .env.production
☐ BEDROCK_REGION validado
☐ ZAPI_INSTANCE e ZAPI_TOKEN validados (teste com curl)
☐ Evolution API URL testada (se aplicável)
☐ AWS credenciais testadas

CÓDIGO
☐ Tabela de preços completa (60+ produtos)
☐ Histórico persistente em Z-API (DynamoDB)
☐ Temperature = 0.4
☐ Rate limiting implementado
☐ Notificações de venda quente funcionando
☐ Logging estruturado ativo
☐ Retry logic implementado

INFRAESTRUTURA
☐ DynamoDB tabela criada em produção
☐ TTL configurado
☐ Backups habilitados
☐ IAM role com permissões corretas

TESTES
☐ Teste E2E fluxo completo ✅
☐ Teste variáveis de ambiente ✅
☐ Teste persistência DynamoDB ✅
☐ Teste rate limiting ✅
☐ Teste notificações para Geanderson ✅
☐ Teste restart com histórico ✅
☐ Teste com diferentes nichos ✅

DEPLOY
☐ Build production: npm run build
☐ Testes passando: npm run test (se houver)
☐ Logs via CloudWatch habilitados
☐ Monitoramento CloudWatch ativo
☐ SMS/alertas configurados
☐ Rollback plan documentado
```

---

## 🎯 ROADMAP DE IMPLEMENTAÇÃO

### ⏱️ Hoje (CRÍTICOS — 5h)
1. Completar tabela de preços → 1.5h
2. Histórico persistente em Z-API → 45min
3. Temperature 0.4 → 5min
4. Variáveis de ambiente → 30min
5. DynamoDB produção → 30min
6. Testes E2E → 1.5h

### ⏱️ Sprint 2 (IMPORTANTES — 2-3h)
1. Notificações Geanderson → 1h
2. Rate limiting → 30min
3. Logging estruturado → 45min

### ⏱️ Sprint 3 (OPORTUNIDADES — 1-2h)
1. Monitoramento → 1h
2. Retry logic → 30min

---

## 🚨 RISCOS CRÍTICOS

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Histórico perdido em restart | ALTA | Conversas mortas | ✅ Implementar DynamoDB hoje |
| Tabela de preços incompleta | ALTA | Não consegue vender | ✅ Completar hoje |
| Sem notificação para Geanderson | MÉDIA | Perde leads | ✅ Implementar notificações |
| Rate limit abuse | BAIXA | Custos AWS altos | ✅ Rate limit + alertas |
| DynamoDB não configurado | MÉDIA | Tudo quebra | ✅ Validar credenciais hoje |

---

## 📞 CONTATOS RESPONSÁVEIS

- **Geanderson Schuh** (Founder) — Aprovação de deployment, testes comerciais
- **Backend Dev** — Implementação de código
- **DevOps** — Infraestrutura, DynamoDB, monitoramento
- **QA** — Testes de fluxo completo

---

## 📊 ESTIMATIVA TOTAL

| Sprint | Duração | Status | GO/NOGO |
|--------|---------|--------|---------|
| **CRÍTICO** | 5h | Pronto hoje | ✅ GO |
| **IMPORTANTE** | 2-3h | Sprint 2 | 🟡 IF CRÍTICO OK |
| **OPORTUNIDADES** | 1-2h | Sprint 3 | 🟠 AFTER CRITICAL |
| **TOTAL** | ~8-10h | — | — |

**Conclusão**: Isadora está **70% pronta**. Com 5h de trabalho crítico, sobe para **95% produção-ready**.

---

**Preparado por**: GitHub Copilot  
**Data**: 2026-07-02  
**Versão**: 1.0 (Análise Completa)
