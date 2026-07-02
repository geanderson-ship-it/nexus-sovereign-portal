# 🏗️ ISADORA — DIAGRAMA DE ARQUITETURA & FLUXOS

---

## ARQUITETURA GERAL (Visão Técnica)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENTE FINAL                               │
│                    (WhatsApp via Celular)                           │
└────────────────────────────┬────────────────────────────────────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
    ┌───────────────┐  ┌───────────────┐  ┌──────────────┐
    │   Z-API       │  │ Evolution API │  │  Frontend    │
    │ (Webhook)     │  │  (Webhook)    │  │   HTTP       │
    │ Send/Receive  │  │ Send/Receive  │  │ Call         │
    └────────┬──────┘  └────────┬──────┘  └──────┬───────┘
             │                  │                 │
             └──────────────────┼─────────────────┘
                                │
                   ┌────────────▼────────────┐
                   │   NEXT.JS API ROUTES   │
                   ├───────────┬────────────┤
                   │ POST /api/isadora      │  ← HTTP endpoint
                   │ POST /api/isadora/w... │  ← Z-API webhook
                   │ POST /api/webhook/wa.. │  ← Evolution webhook
                   └────────────┬───────────┘
                                │
                   ┌────────────▼────────────────────────┐
                   │    AWS BEDROCK (Claude)            │
                   ├────────────────────────────────────┤
                   │ Sonnet 4.5/4.6 (main)              │
                   │ Haiku 4.5 (fast webhook)           │
                   │ Tool: consultar_tabela_precos      │
                   └────────────┬────────────────────────┘
                                │
                   ┌────────────┴────────────┐
                   │                         │
           ┌───────▼────────┐      ┌────────▼─────────┐
           │  DYNAMODB      │      │  NEXUS DB        │
           │                │      │  (Preços Mock)   │
           │ Histórico      │      │                  │
           │ por Telefone   │      │ tabelaPrecosNexus│
           │                │      │                  │
           │ chat_history[] │      │ 7+ produtos      │
           │ lastInteract.. │      │ (INCOMPLETO!)    │
           └────────────────┘      └──────────────────┘
```

---

## FLUXO DE REQUISIÇÃO (Z-API Webhook)

```
        CLIENTE                                    BACKEND
        ========                                   =======
            │
            │ "Vendo roupas, qual produto?"
            │
            ├─────────────────────────────────────►│
            │        POST /api/isadora/webhook     │
            │        {phone, text, fromMe}         │
            │                                       │ getIsadoraResponse()
            │                                       │ ├─ conversationHistory
            │                                       │ ├─ push user message
            │                                       │ └─ call Bedrock
            │                                       │
            │                                       │ Bedrock.ConverseCommand
            │                                       │ ├─ model: Sonnet 4.5
            │                                       │ ├─ system: SYSTEM_PROMPT
            │                                       │ ├─ messages: [...]
            │                                       │ └─ toolConfig: consultar_precos
            │                                       │
            │                                       │ if toolUse:
            │                                       │   ├─ fetchTabelaDePrecos()
            │                                       │   ├─ pass to model
            │                                       │   └─ get final response
            │                                       │
            │◄─────────────────────────────────────┤
            │  "Ofereco Inova Moda 360..."         │ sendWhatsApp()
            │                                       │ └─ Z-API POST
            │
            ✓ Conversação mantém contexto
              (armazenado em conversationHistory)

⚠️ PROBLEMA: conversationHistory é in-memory
   → Perde histórico se servidor reinicia!
```

---

## FLUXO DE REQUISIÇÃO (Evolution API Webhook + DynamoDB)

```
        CLIENTE                                    BACKEND
        ========                                   =======
            │
            │ "Qual o preço do Dante Safra?"
            │
            ├─────────────────────────────────────►│
            │     POST /api/webhook/whatsapp       │
            │     messages.upsert event            │
            │                                       │ POST handler
            │                                       │ ├─ extract phone, text
            │                                       │ └─ call getIsadoraResponse()
            │                                       │
            │                                       │ getChatHistory(phone)
            │                                       │ └─ DynamoDB GetCommand
            │                                       │
            │                                       │ history.push(user_msg)
            │                                       │
            │                                       │ Bedrock.InvokeModelCommand
            │                                       │ ├─ modelId: Haiku 4.5
            │                                       │ ├─ maxTokens: 400
            │                                       │ └─ contentType: json
            │                                       │
            │                                       │ Extract AI response
            │                                       │
            │                                       │ history.push(ai_response)
            │                                       │
            │                                       │ saveChatHistory(phone, hist)
            │                                       │ └─ DynamoDB PutCommand
            │                                       │
            │                                       │ sendWhatsAppMessage()
            │                                       │ └─ Evolution POST
            │◄─────────────────────────────────────┤
            │  "R$ 999/ano, protege a safra"       │
            │
            ✓ Conversação persistida no DynamoDB
            ✓ Histórico sobrevive ao restart
```

---

## ÁRVORE DE DECISÃO DE PRODUTOS (Isadora)

```
                    Cliente Chega
                         │
                         ▼
            ┌─────────────────────────────┐
            │  "Qual é seu negócio?"       │
            │  (pergunte o nicho)          │
            └────────────┬────────────────┘
                         │
              ┌──────────┼──────────┬──────────────┬────────────┐
              │          │          │              │            │
              ▼          ▼          ▼              ▼            ▼
         ┌────────┐  ┌────────┐  ┌────────┐   ┌────────┐   ┌────────┐
         │ Roupas │  │Móveis  │  │Agricul │   │Empresa │   │Rádio   │
         │ Fashion│  │Varejo  │  │tura    │   │B2B     │   │Podcast │
         └───┬────┘  └───┬────┘  └───┬────┘   └───┬────┘   └───┬────┘
             │           │           │            │            │
             ▼           ▼           ▼            ▼            ▼
      ┌─────────────┐ ┌──────────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐
      │INOVA MODA   │ │ VITRINE  │ │ DANTE   │ │  NEXUS   │ │  NEXUS   │
      │  360        │ │INOVADORA │ │ SAFRA   │ │EMPRESAS  │ │ ESTÚDIO  │
      │             │ │          │ │         │ │          │ │          │
      │ Provador 3D │ │QR Code   │ │IA Agro  │ │ 11 Mód.  │ │Locutor   │
      │ Reduz dev   │ │Digital   │ │Offline  │ │ Enterprise│ │Virtual  │
      │ -70%        │ │Display   │ │-40%     │ │ -30%     │ │24h Auto │
      │             │ │Interativ │ │custos   │ │custos    │ │         │
      │ R$45k setup │ │         │ │         │ │          │ │         │
      │ R$15k/mês   │ │R$45k    │ │ R$999   │ │R$13.5k+  │ │Sob cons │
      │             │ │setup    │ │/ano     │ │R$540/mês │ │         │
      │             │ │R$15k/mês│ │         │ │          │ │         │
      └─────────────┘ └──────────┘ └─────────┘ └──────────┘ └──────────┘
```

---

## MAPEAMENTO DE NICHO → ARGUMENTO DE VENDA

```
┌──────────────────────────────────────────────────────────────────┐
│ CLIENTE DIZ:          │ ISADORA RESPONDE:                        │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│ "Tenho loja de       │ "Que legal! 😊 Você conhece o           │
│  roupas online"       │  Inova Moda 360? É um provador           │
│                       │  virtual 3D que reduz devoluções        │
│                       │  em até 70%. Seu cliente experimenta    │
│                       │  em casa antes de comprar!"             │
│                       │                                          │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│ "Sou produtor de      │ "Nossa, isso muda tudo! 🌾 Deixa        │
│  soja, 100 hectares"  │  eu te apresentar o Dante Safra.        │
│                       │  É como ter um agrônomo 24h no bolso.   │
│                       │  Identifica pragas por foto, funciona   │
│                       │  offline. Se paga em uma decisão certa!"│
│                       │                                          │
├────────────────────────────────────────────────────────────────┤
│                       │                                          │
│ "Sou gerente de       │ "Perfeito! 🏭 O Nexus Empresas          │
│  produção em          │  tem 11 módulos. Qual é a maior         │
│  indústria"           │  dor aqui na produção? Paradas? Erros? │
│                       │  Cada módulo se paga sozinho."          │
│                       │                                          │
├────────────────────────────────────────────────────────────────┤
│                       │                                          │
│ "Trabalho com         │ "Ótimo! 📻 O Nexus Estúdio é um        │
│  rádio, preciso       │  locutor virtual 24h. Cobre os horários │
│  cobrir 24h"          │  que seu locutor não tá. Voz neural,   │
│                       │  ninguém percebe que é IA."             │
│                       │                                          │
└────────────────────────────────────────────────────────────────┘
```

---

## FLUXO DE ESCALAÇÃO (Quando Precisa de Humano)

```
                          ISADORA
                        (Vendedora)
                             │
                             ▼
                    ┌──────────────────┐
                    │ Cliente pergunta │
                    │ sobre preço ou   │
                    │ quer negociar    │
                    └────────┬─────────┘
                             │
                    ┌────────▼────────┐
                    │ ESCALAÇÃO!      │
                    │                 │
                    │ "Deixa eu      │
                    │ passar pro     │
                    │ Geanderson     │
                    │ fechar com     │
                    │ você com      │
                    │ chave de ouro" │
                    └─────┬──────────┘
                          │
            ┌─────────────┴─────────────┐
            │                           │
            ▼                           ▼
      ┌──────────────┐           ┌──────────────┐
      │ Geanderson   │           │   Ivoni      │
      │ (Founder)    │           │ (Comercial)  │
      │ Produtos altos│           │ Produtos     │
      │ $ (Premium,  │           │ mid-range    │
      │ Empresas)    │           │ (Inova,      │
      │              │           │ Dante, etc)  │
      └──────────────┘           └──────────────┘
```

---

## CICLO DE VENDAS (End-to-End)

```
Dia 1 → Cliente vem pelo WhatsApp (cold contact)
        ├─ Isadora se apresenta
        └─ Pergunta nicho

Dia 1 → Isadora oferece produto relevante
        ├─ Explica benefícios
        ├─ Mostra ROI
        └─ Pede feedback

Dia 2-3 → Cliente tem dúvidas
         ├─ Isadora responde com precisão
         ├─ Consulta tabela de preços
         ├─ Enfrenta objeções
         └─ Tenta fechar

Dia 4-5 → Cliente "vou pensar"
         ├─ Isadora faz follow-up
         ├─ Reforça valor
         └─ Coloca urgência (época/vagas)

Dia 6-7 → Cliente pronto para fechar
         ├─ ⚠️ ESCALAÇÃO para Geanderson/Ivoni
         └─ Humano fecha com desconto/acordo

Dia 10 → Follow-up pós-venda
         ├─ Isadora confirma satisfação
         └─ Oferece próxima solução
```

---

## INTEGRAÇÃO COM SISTEMA DE VENDAS

```
┌─────────────────────────────────────────────────────────────┐
│                  GABINETE DE VENDAS                         │
│  (Frontend: src/app/gabinete-vendas/leads/page.tsx)         │
└─────────────────────────────┬───────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
        ┌─────────────┐ ┌────────────┐ ┌──────────┐
        │Lead Capture │ │Isadora Chat│ │Analytics │
        │             │ │(Embedded)  │ │Dashboard │
        │ Formulário  │ │            │ │          │
        │ CTA buttons │ │ Link para  │ │ Conversas│
        │ WhatsApp    │ │ WhatsApp   │ │ Conversão│
        │             │ │ integrado  │ │ Tempo    │
        └────────┬────┘ └────────┬───┘ └────┬─────┘
                 │              │           │
                 └──────────────┼───────────┘
                                │
                   ┌────────────▼─────────────┐
                   │ Isadora WhatsApp Engine  │
                   │ (/api/isadora/*)         │
                   └──────────────────────────┘
```

---

## PROBLEMAS CRÍTICOS (Visual)

```
┌─────────────────────────────────────────────────────────────┐
│                   ISADORA PODE VENDER?                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ✅ Inova Moda 360      → Preço existe                        │
│  ✅ Vitrine Inovadora   → Preço existe                        │
│  ❌ Dante Safra         → FALTA PREÇO NA TABELA!             │
│  ❌ Nexus Empresas      → Apenas 1 módulo (faltam 11!)      │
│  ❌ Nexus Premium       → NÃO ESTÁ LISTADO!                 │
│  ❌ Nexus Health        → NÃO ESTÁ LISTADO!                 │
│  ❌ Nexus Energia       → NÃO ESTÁ LISTADO!                 │
│  ❌ Nexus Estúdio       → NÃO ESTÁ LISTADO!                 │
│                                                               │
│  RESULTADO: 60% do catálogo não-vendável! 😱               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## HISTÓRICO DE CONVERSA (Comparação)

```
┌─────────────────────────────────────────────────────────────┐
│                    Z-API (Atual)                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  conversationHistory = {} // ← IN-MEMORY!                  │
│  │                                                            │
│  ├─ Servidor rodando: ✅ histórico existe                   │
│  │                                                            │
│  └─ Servidor restart: ❌ histórico perdido                  │
│                                                               │
│  Impacto: Contexto perdido a cada deploy                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                Evolution (Recomendado)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  getChatHistory(phone) // ← DYNAMODB!                      │
│  │                                                            │
│  ├─ Servidor rodando: ✅ histórico em DynamoDB              │
│  │                                                            │
│  └─ Servidor restart: ✅ histórico recuperado               │
│                                                               │
│  Impacto: Contexto sempre preservado                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## STACK TECNOLÓGICO (Visualização)

```
                    ┌─────────────────────┐
                    │   FRONTEND React    │
                    │  (showroom, chat)   │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  NEXT.JS 14+ API   │
                    │  Route Handlers    │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  AWS BEDROCK SDK   │
                    │  ConverseCommand   │
                    │  InvokeModelCommand│
                    └──────────┬──────────┘
                               │
         ┌─────────────────────┼──────────────────────┐
         │                     │                      │
         ▼                     ▼                      ▼
    ┌─────────────┐    ┌─────────────┐      ┌──────────────┐
    │ AWS Bedrock │    │  DynamoDB   │      │  Z-API /     │
    │             │    │             │      │ Evolution    │
    │Claude Sonnet│    │ Chat Memory │      │              │
    │Claude Haiku │    │ by Phone    │      │ WhatsApp     │
    └─────────────┘    └─────────────┘      └──────────────┘
```

---

**Diagrama preparado por**: GitHub Copilot  
**Data**: 2026-07-02  
**Atualização recomendada**: A cada novo produto adicionado
