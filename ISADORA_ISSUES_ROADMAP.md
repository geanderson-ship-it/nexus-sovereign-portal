# 🎯 ISADORA — ISSUES CRÍTICAS & ROADMAP EXECUTIVO

**Data**: 2026-07-02  
**Status**: 17 issues identificadas | 3 críticas | 5 importantes | 9 oportunidades

---

## 🔴 ISSUES CRÍTICAS (Bloqueiam Vendas)

### #1 — Tabela de Preços Incompleta (MÁXIMA PRIORIDADE)
**Impacto**: ⛔ Bloqueante — Isadora não consegue vender o principal produto  
**Produto Afetado**: Dante Safra (R$ 999/ano — 100% ausente)  
**Problema**: 
- `src/lib/nexus-db.ts` tem apenas 7 produtos
- Faltam: Dante Safra, Nexus Empresas (12 módulos), Nexus Premium, Health, Energia

**Manifesto no Código**:
```typescript
// src/lib/nexus-db.ts — INCOMPLETO!
export const tabelaPrecosNexus = [
  // NEX-001 a NEX-007 (apenas básicos)
  // FALTAM: Dante Safra, Empresas, Premium, etc
];
```

**Impacto Comercial**:
```
Cliente: "Qual é o preço do Dante Safra?"
Isadora: [tabela não tem] → Resposta genérica ou erro
Resultado: CONVERSA MORTA ❌
```

**Solução**:
```typescript
// Completar tabelaPrecosNexus com:
{
  id: "DAD-001",
  nome: "Dante Safra",
  categoria: "SaaS",
  precoVenda: 999.00,
  anoalidade: true, // Modelo de venda
  moeda: "BRL",
  status: "Ativo"
},
{
  id: "NEX-EMP-001",
  nome: "Nexus Empresas - Vendas",
  categoria: "SaaS Enterprise",
  precoVenda: 13500.00,
  mensalidade: 540.00,
  moeda: "BRL"
},
// ... 15+ mais
```

**Estimativa**: 1-2 horas  
**Responsável**: Backend Dev  

---

### #2 — Histórico de Conversa Não-Persistente (Z-API)
**Impacto**: 🔄 Contexto perdido a cada restart  
**Problema**: 
```typescript
// src/app/api/isadora/webhook/route.ts
const conversationHistory: Record<string, { role: string; content: any[] }[]> = {};
// ☝️ VARIÁVEL LOCAL — reseta ao reiniciar o servidor!
```

**Resultado Real**:
```
12:00 - Cliente: "Vendo roupas"
12:01 - Isadora: "Legal! Ofereço Inova Moda 360"
[Servidor restart]
12:05 - Cliente: "Qual é o preço?"
12:06 - Isadora: "Qual é o seu negócio?" ← SEM CONTEXTO! ❌
```

**Solução**: Usar `getChatHistory()` do DynamoDB (já existe em `src/lib/memory.ts`)

```typescript
// Antes (RUIM):
if (!conversationHistory[phone]) conversationHistory[phone] = [];

// Depois (BOM):
let history = await getChatHistory(phone); // Fetch DynamoDB
// ... operações
await saveChatHistory(phone, history); // Save DynamoDB
```

**Estimativa**: 30 min  
**Impacto**: Conversas 50%+ mais longas

---

### #3 — Inconsistência entre 2 Webhooks
**Impacto**: 🔀 Dois sistemas paralelos com lógicas diferentes  
**Problema**:
- Z-API: Histórico em-memória (local)
- Evolution: Histórico em DynamoDB (persistente)
- Resultado: Falta de unificação, confusão operacional

**Fluxo Atual** (confuso):
```
Z-API (cliente A)          Evolution (cliente B)
  ↓ in-memory                ↓ DynamoDB
[perda no restart]        [persistente]
```

**Solução Recomendada**:
```
Opção A (Recomendada): Deprecar Z-API, usar apenas Evolution + DynamoDB
Opção B: Unificar ambos para usar DynamoDB
```

**Estimativa**: 1-2 horas para deprecação  
**Custo de não fazer**: Perda de contexto + bugs intermitentes

---

## 🟡 ISSUES IMPORTANTES (Degradam Experiência)

### #4 — Temperature = 0.7 (Imprecisão Comercial)
**Problema**: Respostas podem ser inconsistentes/criativas demais  
**Recomendação**: Usar `temperature: 0.3-0.5` para vendas

```typescript
// Atual:
inferenceConfig: { maxTokens: 1024, temperature: 0.7 }

// Recomendado:
inferenceConfig: { maxTokens: 1024, temperature: 0.4 }
```

**Impacto**: Conversas mais previsíveis e precisas  
**Estimativa**: 5 min

---

### #5 — Sem Rate Limiting
**Risco**: Um cliente pode disparar 1000 requisições em 1 minuto  
**Solução**: Implementar rate limiting por telefone + IP

```typescript
const rateLimit = new Map<string, number[]>();

function checkRateLimit(phone: string, limit = 10, window = 60000) {
  const now = Date.now();
  if (!rateLimit.has(phone)) rateLimit.set(phone, []);
  
  const times = rateLimit.get(phone)!
    .filter(t => now - t < window);
  
  if (times.length >= limit) {
    return false; // Bloqueado
  }
  
  times.push(now);
  rateLimit.set(phone, times);
  return true; // Permitido
}
```

**Estimativa**: 1 hora  
**Impacto de segurança**: Alto

---

### #6 — Logging Incompleto (Sem Auditoria)
**Problema**: Apenas `console.log` (não persiste)  
**Solução**: CloudWatch Logs para produção

```typescript
// Adicionar logs estruturados:
{
  timestamp: "2026-07-02T12:30:45Z",
  phone: "5551999999999",
  message: "Cliente perguntou sobre Dante Safra",
  response: "Resposta enviada com sucesso",
  model: "claude-sonnet-4-5",
  tokensUsed: 342,
  executionTimeMs: 1250
}
```

**Estimativa**: 2 horas  
**Impacto**: Troubleshooting + análise de conversão

---

### #7 — Sem Validação de Entrada
**Risco**: Cliente envia 10.000 caracteres, quebra modelo  
**Solução**: Limitar tamanho de entrada

```typescript
const MAX_MESSAGE_LENGTH = 500; // caracteres

if (message.length > MAX_MESSAGE_LENGTH) {
  return NextResponse.json(
    { error: "Mensagem muito longa" },
    { status: 400 }
  );
}
```

**Estimativa**: 30 min

---

### #8 — Evolution API URL = localhost:8080 (Produção)
**Risco**: Em produção, tentará conectar localhost  
**Solução**: Implementar error handling claro

```typescript
if (!EVOLUTION_APIKEY) {
  console.warn('[WhatsApp] Evolution API não configurada');
  return false; // Falha elegante
}
```

**Estimativa**: 15 min

---

### #9 — Sem Retry Logic
**Problema**: Se Z-API falhar, erro silencioso 500  
**Solução**: Retry com exponential backoff

```typescript
async function sendWithRetry(
  phone: string,
  message: string,
  maxRetries = 3
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await sendWhatsApp(phone, message);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}
```

**Estimativa**: 1 hora

---

## 🟠 OPORTUNIDADES DE VALOR (Roadmap)

| # | Oportunidade | Impacto | Complexidade | Valor |
|---|---|---|---|---|
| #10 | Analytics Dashboard (conversas/conversões/objeções) | Alto | Médio | Alto |
| #11 | Integração de Payment (Stripe/PIX para digitais) | Alto | Alto | Muito Alto |
| #12 | Análise de Sentimento (escalação automática) | Médio | Médio | Médio |
| #13 | A/B Testing de Prompts | Alto | Alto | Médio |
| #14 | Suporte Multilíngue (ES, EN) | Médio | Baixo | Médio |
| #15 | Backup Cross-Region (Disaster Recovery) | Alto | Médio | Alto |
| #16 | Modelo Atualizado (verificar versão 4.6) | Baixo | Baixo | Baixo |
| #17 | Direito ao Esquecimento (LGPD delete endpoint) | Alto | Baixo | Alto |

---

## 📊 MATRIZ DE PRIORIZAÇÃO

```
        Impacto Alto
             ↑
    #1 ●    #10 ●
    #2 ●    #11 ●●
    #3 ●    #12 ●
    #5 ●●   #15 ●
    #6 ●
    #7 ●
    #8 ●
    #9 ●
             ↓
        Complexidade Baixa ← → Alta
```

---

## 🎯 SPRINT RECOMENDADO

### Sprint 1 (ESTA SEMANA) — Release Crítica
**Objetivo**: Tornar Isadora vendável novamente

- [ ] **#1** — Completar tabela de preços (Dante Safra + 10+ produtos)
  - Tempo: 2h
  - Responsável: Backend
  - PR: Update src/lib/nexus-db.ts

- [ ] **#2** — Migrar Z-API para usar DynamoDB
  - Tempo: 1h
  - Responsável: Backend
  - PR: Update src/app/api/isadora/webhook/route.ts

- [ ] **#3** — Unificar ou deprecar webhook redundante
  - Tempo: 1.5h
  - Responsável: Backend
  - Decisão: Manter apenas Evolution API

**Total**: ~4.5 horas  
**Impact**: 🚀 50-100% aumento em conversões

---

### Sprint 2 (PRÓXIMA SEMANA) — Confiabilidade
**Objetivo**: Production-ready

- [ ] **#4** — Ajustar temperature para 0.4
- [ ] **#5** — Implementar rate limiting
- [ ] **#6** — CloudWatch Logs
- [ ] **#7** — Validação de entrada
- [ ] **#8** — Error handling Evolution
- [ ] **#9** — Retry logic

**Total**: ~5 horas  
**Impact**: 🛡️ Infraestrutura robusta

---

### Sprint 3+ (3-4 SEMANAS) — Valor Agregado
**Objetivo**: Diferencial competitivo

- [ ] **#10** — Analytics Dashboard
- [ ] **#11** — Integração de Payment
- [ ] **#12** — Análise Sentimento
- [ ] **#17** — LGPD Compliance (delete)

**Total**: ~15-20 horas  
**Impact**: 💰 +200-300% ROI

---

## 🔧 COMANDOS ÚTEIS

### Verificar Logs da Isadora
```bash
# CloudWatch Logs (quando implementado)
aws logs tail /aws/lambda/isadora-webhook --follow

# Local (temporário)
grep "Isadora" logs/*.txt
```

### Testar Endpoint Diretamente
```bash
curl -X POST http://localhost:3000/api/isadora \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Vendo roupas, preciso aumentar conversão"
      }
    ]
  }'
```

### Verificar Histórico no DynamoDB
```bash
aws dynamodb get-item \
  --table-name Nexus_Isadora_Memory \
  --key '{"phone": {"S": "5551999999999"}}'
```

### Testar Z-API Webhook
```bash
curl -X POST http://localhost:3000/api/isadora/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5551999999999",
    "text": {"message": "Oi Isadora"},
    "fromMe": false
  }'
```

---

## 📞 ESCALAÇÃO

| Issue | Responsável | Contato |
|---|---|---|
| #1-3 (Críticas) | Geanderson Schuh | [Diretor] |
| #4-9 (Importantes) | Backend Dev | [DevOps] |
| #10-17 (Oportunidades) | Product Manager | [PM] |

---

## ✅ DEFINIÇÃO DE PRONTO (Definition of Done)

Cada issue será considerada "pronta" quando:
1. ✅ Código escrito + testado localmente
2. ✅ PR criada com descrição clara
3. ✅ Code review aprovado
4. ✅ Mergido para main
5. ✅ Testado em staging
6. ✅ Documentação atualizada
7. ✅ Deployado em produção
8. ✅ Monitoramento de métricas ativo

---

**Documento preparado por**: GitHub Copilot  
**Data**: 2026-07-02  
**Próxima revisão**: 2026-07-09
