# 🚀 MAPA ARQUITETURAL DA ISADORA — Vendedora WhatsApp Elite

**Status**: Sistema em produção com 2 endpoints principais  
**Última atualização**: 2026-07-02  
**Responsável**: Geanderson Schuh (Diretor)

---

## 📋 SUMÁRIO EXECUTIVO

A **Isadora** é uma vendedora virtual de IA movida por **Claude Sonnet 4.5** que atua via **WhatsApp** como especialista de vendas da Nexus Holding Group. Opera através de 2 integrações independentes:

1. **Z-API Integration** → Webhook recebe mensagens e envia respostas
2. **Evolution API** → Alternativa/redundância para envio de mensagens

A Isadora compreende todo o portfólio de produtos Nexus, mapeia nichos de clientes e oferece a solução correta com argumentação comercial estruturada.

---

## 🏗️ ARQUITETURA TÉCNICA

### 1. ENDPOINTS API

#### 1.1 POST `/api/isadora/route.ts`
**Path Completo**: `src/app/api/isadora/route.ts`  
**Propósito**: Interface HTTP para requisições diretas (testes, integração frontend)  
**Método**: POST

**Request Body**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Olá, vendo roupas e preciso aumentar conversão",
      "imageBase64": "data:image/jpeg;base64,..." // Opcional
    }
  ]
}
```

**Response**:
```json
{
  "response": "Oi! Que legal que você vende roupas! 😊 Nesse caso, o Inova Moda 360 vai ser perfeito pro seu negócio...",
  "audioUrl": null
}
```

**Modelo de IA**: `us.anthropic.claude-sonnet-4-6`  
**Max Tokens**: 4096  
**Temperature**: 0.7  

**Funcionalidades**:
- ✅ Aceita imagens em base64
- ✅ Suporte a tool calling (consulta tabela de preços)
- ✅ Context de mensagens múltiplas
- ✅ Error handling com logging

**Variáveis de Ambiente Necessárias**:
```
AMPLIFY_REGION (ou AWS_REGION, BEDROCK_REGION)
AMPLIFY_ACCESS_KEY_ID (ou BEDROCK_ACCESS_KEY_ID, AWS_ACCESS_KEY_ID)
AMPLIFY_SECRET_ACCESS_KEY (ou BEDROCK_SECRET_ACCESS_KEY, AWS_SECRET_ACCESS_KEY)
```

---

#### 1.2 POST `/api/isadora/webhook/route.ts`
**Path Completo**: `src/app/api/isadora/webhook/route.ts`  
**Propósito**: **Webhook principal** - Recebe mensagens do Z-API  
**Método**: POST (recebe webhook) + GET (health check)

**Integração**: Z-API (https://z-api.io/)

**Flow de Recebimento**:
```
Z-API (WhatsApp) 
  → POST /api/isadora/webhook 
  → Valida payload 
  → Chama getIsadoraResponse() 
  → Envia resposta via Z-API sendText
  → Retorna { ok: true }
```

**Payload Z-API**:
```json
{
  "phone": "5551999999999",
  "text": {
    "message": "Olá, como funciona o Dante Safra?"
  },
  "fromMe": false
}
```

**Validações Implementadas**:
- ❌ Ignora mensagens de grupos (`phone.includes('@g.us')`)
- ❌ Ignora mensagens enviadas por nós mesmos (`fromMe: true`)
- ❌ Ignora sem telefone ou mensagem vazia

**Modelo de IA**: `us.anthropic.claude-sonnet-4-5-20250929-v1:0`  
**Max Tokens**: 1024  
**Temperature**: 0.7  

**Tool Calling Integrado**:
```typescript
toolSpec: {
  name: "consultar_tabela_precos",
  description: "Acessa tabela de produtos e preços da Nexus Holding"
}
```

**Histórico de Conversa**: ✅ Armazenado em memória local (últimas 20 mensagens por telefone)

---

#### 1.3 GET/POST `/api/webhook/whatsapp/route.ts`
**Path Completo**: `src/app/api/webhook/whatsapp/route.ts`  
**Propósito**: Alternativa via **Evolution API**  
**Integração**: Evolution API (http://localhost:8080 por padrão)

**Diferenças vs Z-API**:
- Usa **Bedrock `InvokeModelCommand`** (modelo Haiku 4.5 por velocidade)
- Persiste histórico em **DynamoDB** (tabela: `Nexus_Isadora_Memory`)
- Respostas curtas otimizadas (max 400 tokens)
- **Mais escalável** para produção com grandes volumes

**Event Type**: `messages.upsert`

**Flow**:
```
Evolution API 
  → POST /api/webhook/whatsapp 
  → getChatHistory(phone) [DynamoDB] 
  → Claude Haiku 4.5 
  → saveChatHistory() [DynamoDB] 
  → sendWhatsAppMessage() [Evolution API] 
  → Retorna { success: true }
```

**Modelo de IA**: `us.anthropic.claude-haiku-4-5-20251001-v1:0` (velocidade)  
**Max Tokens**: 400 (respostas curtas para WhatsApp)  

---

### 2. CAMADA DE BANCO DE DADOS

#### 2.1 DynamoDB (Histórico de Chat)
**Tabela**: `Nexus_Isadora_Memory`

**Schema**:
```typescript
{
  phone: string // Partition Key
  history: ChatMessage[] // Últimas 15 mensagens (MAX_HISTORY_LENGTH = 15)
  lastInteraction: string // ISO timestamp
}

interface ChatMessage {
  role: 'user' | 'model'
  text: string
}
```

**Path do Código**: `src/lib/memory.ts`  
**Funções**:
- `getChatHistory(phone)` → Fetch histórico
- `saveChatHistory(phone, history)` → Save com trimming automático

**Credenciais**:
```
BEDROCK_REGION (padrão: us-east-1)
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

---

#### 2.2 Tabela de Preços (Mock/LocalHost)
**Path**: `src/lib/nexus-db.ts`

**Produtos Configurados**:

| ID | Nome | Categoria | Preço Venda | Mensalidade |
|---|---|---|---|---|
| NEX-001 | Mentoria Liderança (Individual) | Mentoria | R$ 5.000 | — |
| NEX-002 | Treinamento In-Company | Corporativo | R$ 12.500 | — |
| NEX-003 | Curso Online: IE Básica | EAD | R$ 497 | — |
| NEX-004 | Consultoria Estratégica/h | Consultoria | R$ 850 | — |
| NEX-005 | Palestra Magna (Geanderson) | Eventos | R$ 15.000 | — |
| NEX-006 | Inova Moda 360 | SaaS Enterprise | R$ 45.000 | R$ 15.000 |
| NEX-007 | Vitrine Inovadora | SaaS Enterprise | R$ 45.000 | R$ 15.000 |

**⚠️ CRÍTICO**: Tabela incompleta! Faltam:
- Dante Safra (R$ 999/ano — altamente prioritário!)
- Nexus Empresas (13 módulos com precificação variável)
- Nexus Premium (Maga Dot, Orion, Pactum, Égide)
- Nexus Estúdio
- Nexus Health
- Nexus Energia (Helios)

**Função**: `fetchTabelaDePrecos()` → Promise que simula delay de 800ms

---

### 3. INTEGRAÇÃO WHATSAPP

#### 3.1 Evolution API Integration
**Path**: `src/lib/whatsapp.ts`

**Configuração**:
```typescript
const EVOLUTION_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080'
const EVOLUTION_APIKEY = process.env.EVOLUTION_GLOBAL_APIKEY || ''
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE_NAME || 'Isadora'
```

**Função Principal**:
```typescript
async function sendWhatsAppMessage(phone: string, text: string): Promise<boolean>
```

**Endpoint Z-API**:
```
POST https://api.z-api.io/instances/{ZAPI_INSTANCE}/token/{ZAPI_TOKEN}/send-text

Headers:
  Content-Type: application/json

Body:
  { phone: string, message: string }
```

**Variáveis Necessárias**:
```
EVOLUTION_API_URL
EVOLUTION_GLOBAL_APIKEY
EVOLUTION_INSTANCE_NAME (padrão: 'Isadora')
ZAPI_INSTANCE
ZAPI_TOKEN
```

---

### 4. SYSTEM PROMPTS & PERSONALIDADE

#### 4.1 Prompt Principal (Isadora HTTP - route.ts)
- **Personalidade**: Executiva de vendas de alta performance, calorosa, afiada, honnesta
- **Ton de voz**: Emojis naturais, sem robô, direto
- **Tamanho**: ~3500 caracteres
- **Cobertura**: Todos os 10+ produtos Nexus

**Seções Principais**:
1. **Apresentação inicial**
2. **Mapeamento de nicho → produto certo**
3. **Conhecimento detalhado de cada produto**:
   - Inova Revenda
   - Vitrine Inovadora
   - Dante Safra (PRIORIDADE!)
   - Inova Moda 360
   - Nexus Estúdio
   - Nexus Empresas (12 módulos)
   - Nexus Premium (4 módulos)
   - Nexus Health
   - Nexus Energia (Helios)
4. **Objeções comerciais mapeadas**
5. **Técnicas de venda (SPIN)**
6. **Regras de precificação**
7. **Escalação e humildade**

---

#### 4.2 Prompt Webhook (Z-API & Evolution)
- **Versão**: Simplificada vs HTTP (mais curta)
- **Tool Calling**: `consultar_tabela_precos` integrado
- **Max Output**: 400-1024 tokens (otimizado para WhatsApp)
- **Memory**: Últimas 15-20 mensagens por cliente

---

## 🔄 FLUXOS DE VENDAS

### FLUXO 1: Cliente Chega Sem Contexto
```
Cliente: "Olá"
↓
Isadora: "Oi! 😊 Sou a Isadora, da Nexus Holding. Que bom ter você aqui!"
         "Me conta: qual é o seu negócio?"
↓
Cliente: "Tenho uma loja de roupas"
↓
Isadora: [Mapeia nicho] → Oferece Inova Moda 360
         "Provador virtual 3D, cliente experimenta em casa, reduz devoluções em 70%"
```

### FLUXO 2: Cliente com Dúvida Técnica
```
Cliente: "O Dante Safra funciona sem internet?"
↓
Isadora: [Consulta tabela de preços] 
         "Sim! Funciona 100% offline na roça"
         "Diagnóstico de pragas por foto, suporte 24h"
```

### FLUXO 3: Cliente Pronto para Fechar
```
Cliente: "Qual o preço do Dante Safra?"
↓
Isadora: [Consulta tabela] 
         "R$ 999 por ano — se paga em uma única decisão certa"
↓
Cliente: "Posso negociar?"
↓
Isadora: ⚠️ ESCALAÇÃO!
         "Deixa eu passar pro Geanderson/Ivoni pra fechar com você"
```

---

## 🧠 MODELOS DE IA UTILIZADOS

| Endpoint | Modelo | Versão | Tokens | Use Case |
|---|---|---|---|---|
| POST /api/isadora | Claude Sonnet 4.6 | us.anthropic.claude-sonnet-4-6 | 4096 | Interação web, imagens |
| Webhook Z-API | Claude Sonnet 4.5 | us.anthropic.claude-sonnet-4-5-20250929-v1:0 | 1024 | Conversa WhatsApp |
| Webhook Evolution | Claude Haiku 4.5 | us.anthropic.claude-haiku-4-5-20251001-v1:0 | 400 | Velocidade máxima |

**Tool Calling**: Ambos modelos suportam chamada de `consultar_tabela_precos`

---

## 🪝 WEBHOOKS CONFIGURADOS

### Z-API Webhook
```
Trigger: Nova mensagem no WhatsApp via Z-API
Endpoint: POST https://your-domain.com/api/isadora/webhook
Method: POST
Authentication: Via variável de ambiente ZAPI_TOKEN
Body: { phone, text, fromMe }
```

**Health Check**: GET /api/isadora/webhook → `{ status: "Isadora webhook ativo ✅" }`

### Evolution API Webhook
```
Trigger: messages.upsert event
Endpoint: POST https://your-domain.com/api/webhook/whatsapp
Method: POST
Instance: Configurada via EVOLUTION_INSTANCE_NAME
Body: { data: { message, key: { remoteJid, fromMe } } }
```

**Suporte**: Lê eventos de múltiplos tipos (conversation, extendedTextMessage)

---

## 🌐 PÁGINAS FRONTEND QUE REFERENCIAM ISADORA

| Página | Path | Propósito |
|---|---|---|
| Showroom | `src/app/gabinete/showroom/page.tsx` | Apresentação visual (avatar + vídeo) |
| Hotéis | `src/app/nexus-rotas/hoteis/page.tsx` | Referência em CTA ("Atendimento WhatsApp 24h via Isadora") |
| Propósito | `src/app/proposito/page.tsx` | Menção em contexto de Pactum e vendas |
| Localizações | `src/lib/locales/pt-BR.json` | Chaves i18n (potencial para tradução) |

---

## 🎭 AVATAR & ASSETS

| Arquivo | Tipo | Path |
|---|---|---|
| Isadora.png | Imagem | `public/Vendedora Nexus/Isadora.png` |
| Isadora Nexus.png | Imagem | `public/Vendedora Nexus/Isadora Nexus.png` |
| Video 4m15s | MP4 | `public/avatars/Vídeos/Isadora_-_Executiva_em_vendas_Nexus_holding_Group.mp4` |

**Fallback Frontend**: `isadora.png` se principal não carregar

---

## 📊 SEQUÊNCIA DE EXECUÇÃO (Webhook Z-API)

```
1. Z-API envia POST com { phone, text, fromMe }
   ↓
2. route.ts valida (não é grupo, não é fromMe)
   ↓
3. conversationHistory[phone] buffer local (reseta ao restart do servidor ⚠️)
   ↓
4. Chama Claude Sonnet 4.5 via Bedrock
   ↓
5. Se tool use (consultar_tabela_precos):
     a. Fetch tabelaPrecosNexus
     b. Passa resultado pro modelo
     c. Gera resposta final
   ↓
6. sendWhatsApp(phone, resposta) via Z-API
   ↓
7. Retorna { ok: true }
```

---

## ⚠️ PROBLEMAS IDENTIFICADOS

### 🔴 CRÍTICO

#### 1. **Tabela de Preços INCOMPLETA**
- **Impacto**: Isadora não consegue vender Dante Safra (produto top priority!)
- **Status**: Faltam 15+ produtos
- **Solução necessária**: 
  - Completar `src/lib/nexus-db.ts` com todos os produtos
  - Ou conectar a API real de BD
- **Prioridade**: **MÁXIMA** — bloqueia conversões

#### 2. **Histórico de Conversa Não-Persistente (Z-API)**
- **Impacto**: Cada restart do servidor perde contexto do cliente
- **Causa**: `conversationHistory` é variável local (in-memory)
- **Solução**: Migrar para DynamoDB como faz o webhook Evolution
- **Código**:
  ```typescript
  // Atual (RUIM):
  const conversationHistory: Record<string, any> = {}; // Reseta!
  
  // Necessário (BOM):
  const history = await getChatHistory(phone); // Do DynamoDB
  ```

#### 3. **Z-API vs Evolution — Redundância Frágil**
- **Problema**: 2 webhooks desconectados, sem sincronização
- **Histórico**: Z-API usa in-memory, Evolution usa DynamoDB (inconsistência!)
- **Solução**: Deprecar um ou unificar histórico em DynamoDB

#### 4. **Temperature = 0.7 Em Produção**
- **Impacto**: Respostas podem ser imprecisas/contraditórias em contextos críticos
- **Recomendação**: Usar 0.3-0.5 para vendas (mais consistência, menos criatividade)

---

### 🟡 IMPORTANTE

#### 5. **Sem Rate Limiting**
- **Risco**: Um único cliente pode disparar centenas de requisições
- **Solução**: Implementar rate limiting por phone + IP

#### 6. **Logging Incompleto**
- **Atual**: Apenas console.log (não persistido)
- **Recomendação**: CloudWatch Logs para auditoria + troubleshooting

#### 7. **Sem Validação de Conteúdo**
- **Risco**: Cliente poderia enviar mensagens de 1000+ caracteres
- **Solução**: Limitar tamanho de entrada

#### 8. **EVOLUTION_API_URL = localhost:8080**
- **Problema**: Em produção, apontará para http://localhost:8080
- **Solução**: Implementar fallback claro ou error handling

#### 9. **Tool Calling Sem Retry Logic**
- **Se Z-API indisponível**: Erro 500 silencioso
- **Solução**: Retry com exponential backoff + timeout

---

### 🟠 OPORTUNIDADES DE MELHORIA

#### 10. **Falta de Análise Comportamental**
- **Atual**: Apenas responde perguntas
- **Proposta**: Registrar intentos de compra, objeções, abandonos
- **Valor**: Enables melhor targeting e follow-up

#### 11. **Sem Integração de Payment**
- **Atual**: Apenas escala para Geanderson/Ivoni
- **Proposta**: Link de pagamento direto (Stripe/PIX) para produtos digitais
- **Exemplo**: Curso EAD (R$ 497) poderia ter checkout automático

#### 12. **Sem Análise Sentimento**
- **Oportunidade**: Detectar frustração → escalação automática para humano

#### 13. **Sem A/B Testing**
- **Proposta**: Variar abordagens comerciais, medir taxa de conversão

#### 14. **Sem Analytics Dashboard**
- **Métrica ausentes**:
  - Conversas totais/dia
  - Taxa de conversão por produto
  - Tempo médio de conversa
  - Produtos mais buscados
  - Taxa de escalação (Isadora → humano)

#### 15. **Suporte Multilíngue Limitado**
- **Atual**: Apenas PT-BR
- **Proposta**: Adicionar ES, EN com system prompt multilíngue

#### 16. **Sem Backup/Disaster Recovery**
- **Risco**: Perda total de histórico se DynamoDB falhar
- **Solução**: Replicação cross-region AWS

#### 17. **Modelo Desatualizado**
- **Webhook Z-API**: Claude Sonnet 4.5 (set/2025) ✅
- **Webhook Evolution**: Claude Haiku 4.5 (out/2025) ✅
- **HTTP Route**: Claude Sonnet 4.6 (?? — verificar versão) ⚠️
- **Proposta**: Padronizar para Sonnet 4-5 mais recente

---

## 🛠️ STACK TÉCNICO

| Componente | Tecnologia | Versão |
|---|---|---|
| Runtime | Node.js | ≥ 20 |
| Framework | Next.js | 14+ |
| API Gateway | NextRequest/NextResponse | Native |
| IA | AWS Bedrock | Claude Sonnet/Haiku 4.5 |
| Banco Histórico | DynamoDB | AWS SDK |
| Integração WhatsApp | Z-API + Evolution | Latest |
| Tabela de Preços | Mock/LocalHost | In-memory |
| Auth | Variáveis de ambiente | API Keys |

---

## 🚀 ROADMAP DE MELHORIAS (Priorizado)

### Sprint 1 (CRÍTICO - Esta semana)
- [ ] Completar tabela de preços com Dante Safra + todos os 10+ produtos
- [ ] Implementar DynamoDB para histórico de conversa no Z-API
- [ ] Unificar 2 webhooks em 1 source-of-truth

### Sprint 2 (IMPORTANTE - Próxima semana)
- [ ] Rate limiting por telefone
- [ ] CloudWatch Logs para produção
- [ ] Ajustar temperature para 0.3-0.5 em contextos críticos
- [ ] Retry logic com backoff exponencial

### Sprint 3 (VALOR - Semana 3)
- [ ] Analytics dashboard (conversas, conversões, objeções)
- [ ] Integração de pagamento para produtos digitais
- [ ] Análise de sentimento para escalação automática

### Sprint 4 (EXPANSÃO - Semana 4)
- [ ] Suporte multilíngue (ES, EN)
- [ ] A/B testing de prompts
- [ ] Disaster recovery + backups

---

## 📝 CHECKLIST DE PRODUÇÃO

- [ ] Tabela de preços completa e atualizada
- [ ] DynamoDB configurado e testado
- [ ] Rate limiting implementado
- [ ] CloudWatch Logs ativo
- [ ] Documentação de API atualizada
- [ ] SLA de resposta em produção (< 5s)
- [ ] Monitoramento de erros/falhas
- [ ] Backup e disaster recovery
- [ ] Testes de carga (1000+ msgs/min)
- [ ] Compliance LGPD (histórico de chat)

---

## 🔐 SEGURANÇA & COMPLIANCE

### LGPD Compliance
- ✅ Dados armazenados em BR (DynamoDB)
- ✅ Retenção limitada (últimas 15 mensagens)
- ⚠️ Falta: Direito ao esquecimento (delete endpoint)
- ⚠️ Falta: Consentimento explícito no primeiro contato

### Autenticação
- ✅ API Keys em variáveis de ambiente
- ⚠️ Falta: Rotação de chaves automática
- ⚠️ Falta: Rate limiting por IP/auth

---

## 📞 CONTATOS & ESCALAÇÃO

- **Diretor Responsável**: Geanderson Schuh (Founder)
- **Diretora Comercial**: Ivoni Schuh
- **Suporte Técnico**: DevOps/Backend
- **Escalação de Venda**: Geanderson ou Ivoni (quando cliente pronto para fechar)

---

## 📚 REFERÊNCIAS

- [Z-API Documentation](https://z-api.io/)
- [Evolution API](https://github.com/EvolutionAPI/evolution-api)
- [AWS Bedrock Claude Models](https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids.html)
- [DynamoDB Guide](https://docs.aws.amazon.com/dynamodb/latest/developerguide/)

---

**Documento preparado por**: GitHub Copilot  
**Data**: 2026-07-02  
**Status**: Draft para revisão
