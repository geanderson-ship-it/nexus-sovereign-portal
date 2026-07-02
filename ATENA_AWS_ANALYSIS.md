# 🤖 ANÁLISE COMPLETA: ESTRUTURA ATENA + INTEGRAÇÕES AWS

## 📍 1. ESTRUTURA DE ARQUIVOS ATENA

### Pasta Principal: `/public/atena/`
- **Conteúdo:** Assets visuais (avatares, imagens para cada dia da semana)
- **Arquivos:** 
  - `atena-autonoma-digital.png`
  - `Atena - IA privada.png`
  - `Atena domingo.png`, `segunda.png`, `terça.png`, etc.

### Backend API Routes
- **[src/app/api/atena/route.ts](src/app/api/atena/route.ts)** - Chat principal com Claude via Bedrock
- **[src/app/api/atena/vision/route.ts](src/app/api/atena/vision/route.ts)** - Reconhecimento facial com AWS Rekognition
- **[src/app/atena/page.tsx](src/app/atena/page.tsx)** - Página principal da Atena
- **[src/app/atena/layout.tsx](src/app/atena/layout.tsx)** - Layout compartilhado

### AI Flows
- **[src/ai/flows/atena-chat-flow.ts](src/ai/flows/atena-chat-flow.ts)** - Flow de chat (Genkit)
- **[src/ai/flows/atena-chat-types.ts](src/ai/flows/atena-chat-types.ts)** - Schemas TypeScript

### Configurações
- **[Atena.bat](Atena.bat)** - Script batch para inicialização
- **[public/atena-manifest.json](public/atena-manifest.json)** - Manifest PWA
- **[public/atena-avatar.png](public/atena-avatar.png)** - Avatar visual
- **[public/icons/atena-icon.svg](public/icons/atena-icon.svg)** - Ícone SVG

### Testes & Scratch
- **[scratch/atena-product-scope.md](scratch/atena-product-scope.md)** - Escopo do produto
- **[scratch/atena-mailer.js](scratch/atena-mailer.js)** - Integração de email
- **[scratch/test-atena-agenda.js](scratch/test-atena-agenda.js)** - Testes de agenda

---

## 🔌 2. SERVIÇOS AWS - CHAMADAS E CONFIGURAÇÕES

### 2.1 MODELOS DE IA ATIVOS

#### Modelo Principal (Genkit)
```typescript
// [src/ai/genkit.ts](src/ai/genkit.ts:11)
export const NEXUS_MODEL = 'aws-bedrock/us.anthropic.claude-sonnet-4-6';
```
- **Provider:** AWS Bedrock
- **Modelo:** Claude 3.5 Sonnet (padrão)
- **Versão:** claude-sonnet-4-6
- **Uso:** Chat geral, workflows, geração de conteúdo

#### Modelo Alternativo (Bedrock Runtime)
```typescript
// [src/ai/bedrock-client.ts](src/ai/bedrock-client.ts:33)
export const BEDROCK_NEXUS_MODEL = 'us.anthropic.claude-haiku-4-5-20251001-v1:0';
```
- **Modelo:** Claude 3 Haiku 4.5 (modelo otimizado)
- **Data:** Outubro 2025
- **Uso:** Operações leves, resposta rápida, economia de custos

#### Modelo no API Route (Atena)
```typescript
// [src/app/api/atena/route.ts](src/app/api/atena/route.ts:26)
const MODEL_ID = "anthropic.claude-3-5-sonnet-20241022-v2:0";
```
- **Modelo:** Claude 3.5 Sonnet v2
- **Data:** Outubro 2024
- **Versão:** v2:0 (versão específica)
- **Status:** ⚠️ POSSÍVEL DESCONTINUAÇÃO - Versão anterior

### 2.2 AWS SDK DEPENDENCIES
```json
// [package.json](package.json:15-26)
"@aws-sdk/client-bedrock": "^3.1075.0",
"@aws-sdk/client-bedrock-agent": "^3.1033.0",
"@aws-sdk/client-bedrock-agent-runtime": "^3.1033.0",
"@aws-sdk/client-bedrock-runtime": "^3.1075.0",
"@aws-sdk/client-dynamodb": "^3.1041.0",
"@aws-sdk/client-polly": "^3.1075.0",
"@aws-sdk/client-rekognition": "^3.1075.0",
"@aws-sdk/client-s3": "^3.1057.0",
"@aws-sdk/client-transcribe": "^3.1057.0",
"@aws-sdk/lib-dynamodb": "^3.1041.0",
```

### 2.3 SERVIÇOS AWS UTILIZADOS

| Serviço | Uso | Arquivo | Status |
|---------|-----|---------|--------|
| **Bedrock** | Modelos de IA/ML (Claude) | `src/app/api/atena/route.ts` | ✅ Ativo |
| **Rekognition** | Reconhecimento facial (Mamãe Ivoni) | `src/app/api/atena/vision/route.ts` | ✅ Ativo |
| **DynamoDB** | Armazenamento de dados | `amplify/data/` | ✅ Ativo |
| **S3** | Armazenamento de arquivos | `src/services/transcribe.ts` | ✅ Ativo |
| **Polly** | Síntese de fala | Depedência em `package.json` | ✅ Disponível |
| **Transcribe** | Transcrição de áudio | Depedência em `package.json` | ✅ Disponível |
| **Amplify** | Backend & Autenticação | `amplify/backend.ts` | ✅ Ativo |
| **Cognito** | Autenticação/Autorização | `amplify/auth/` | ✅ Ativo |

---

## 🔑 3. CONFIGURAÇÕES DE CREDENCIAIS E CONEXÃO

### 3.1 Ordem de Prioridade de Credenciais
```typescript
// [src/ai/bedrock-client.ts](src/ai/bedrock-client.ts:9-18)
const region = process.env.BEDROCK_REGION || 
               process.env.AWS_REGION || 
               process.env.AMPLIFY_REGION || 
               process.env.NEXUS_REGION || 
               'us-east-1';

const accessKeyId = 
  process.env.BEDROCK_ACCESS_KEY_ID || 
  process.env.AWS_ACCESS_KEY_ID || 
  process.env.AMPLIFY_ACCESS_KEY_ID || 
  process.env.NEXUS_ACCESS_KEY_ID;

const secretAccessKey = 
  process.env.BEDROCK_SECRET_ACCESS_KEY || 
  process.env.AWS_SECRET_ACCESS_KEY || 
  process.env.AMPLIFY_SECRET_ACCESS_KEY || 
  process.env.NEXUS_SECRET_ACCESS_KEY;
```

**Prioridade:** `BEDROCK_*` > `AWS_*` > `AMPLIFY_*` > `NEXUS_*`

### 3.2 Variáveis de Ambiente Necessárias
```env
# [next.config.js](next.config.js:7-11) - Expostas ao frontend
BEDROCK_ACCESS_KEY_ID=
BEDROCK_SECRET_ACCESS_KEY=
BEDROCK_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AMPLIFY_ACCESS_KEY_ID=
AMPLIFY_SECRET_ACCESS_KEY=
AMPLIFY_REGION=
NEXUS_ACCESS_KEY_ID=
NEXUS_SECRET_ACCESS_KEY=
NEXUS_REGION=
```

### 3.3 Genkit Configuration
```typescript
// [src/ai/genkit.ts](src/ai/genkit.ts:16-32)
export const ai = genkit({
  plugins: [
    awsBedrock({
      region: bedrockRegion,
      credentials: {
        accessKeyId: bedrockAccessKeyId,
        secretAccessKey: bedrockSecretAccessKey,
      }
    }),
  ],
  model: NEXUS_MODEL,
});
```

---

## ⚠️ 4. MODELOS COM POSSÍVEL DESCONTINUAÇÃO

### 4.1 Modelos em Uso
| Modelo ID | Status | Localização | Observação |
|-----------|--------|-------------|-----------|
| `anthropic.claude-3-5-sonnet-20241022-v2:0` | ⚠️ Antigo | `src/app/api/atena/route.ts` | Versão v2:0 - versão anterior a 4-6 |
| `us.anthropic.claude-sonnet-4-6` | ✅ Atual | `src/ai/genkit.ts` | Claude 3.5 Sonnet (versão mais recente) |
| `us.anthropic.claude-haiku-4-5-20251001-v1:0` | ✅ Recente | `src/ai/bedrock-client.ts` | Haiku 4.5 (Outubro 2025) |
| `anthropic.claude-3-haiku-20240307-v1:0` | ⚠️ Antigo | `scripts/generate-lectures.mjs` | Versão antiga (Março 2024) |

### 4.2 Referências Descontinuadas em Scripts
```javascript
// [scratch/test_bedrock_models.js](scratch/test_bedrock_models.js:32)
.filter(m => m.providerName === 'Anthropic' && m.modelId.includes('haiku'))

// [scratch/list-models.js](scratch/list-models.js) - Lista inference profiles
// Busca por perfis de inferência (podem estar descontinuados)
```

---

## 📋 5. CHAMADAS AWS BEDROCK - SNIPPETS DE CÓDIGO

### 5.1 Chat Principal (Atena)
**Arquivo:** [src/app/api/atena/route.ts](src/app/api/atena/route.ts#L26-L140)

```typescript
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient(awsConfig);
const MODEL_ID = "anthropic.claude-3-5-sonnet-20241022-v2:0";

let command = new ConverseCommand({
  modelId: MODEL_ID,
  messages: formattedMessages,
  system: systemPrompt,
  inferenceConfig,
  toolConfig,
});

const response = await bedrockClient.send(command);
```

**Características:**
- ✅ Suporte a imagens (Base64)
- ✅ Tools/Functions (6 ferramentas definidas)
- ✅ Max duration: 60 segundos
- ✅ Resposta com tool execution

### 5.2 Visão Computacional - Rekognition
**Arquivo:** [src/app/api/atena/vision/route.ts](src/app/api/atena/vision/route.ts#L31-L80)

```typescript
import { RekognitionClient, CreateCollectionCommand, 
         IndexFacesCommand, SearchFacesByImageCommand } 
from "@aws-sdk/client-rekognition";

const rekognition = new RekognitionClient(awsConfig);
const COLLECTION_ID = "AtenaFaces";

// Registro de biometria
const indexCommand = new IndexFacesCommand({
  CollectionId: COLLECTION_ID,
  Image: { Bytes: buffer },
  ExternalImageId: "Mamae_Ivoni",
  MaxFaces: 1,
  QualityFilter: "AUTO"
});

// Reconhecimento
const searchCommand = new SearchFacesByImageCommand({
  CollectionId: COLLECTION_ID,
  Image: { Bytes: buffer },
  MaxFaces: 1,
  FaceMatchThreshold: 85
});

const response = await rekognition.send(searchCommand);
```

**Características:**
- 🎭 Coleção: "AtenaFaces"
- 👤 Pessoa registrada: "Mamae_Ivoni"
- 🔐 Threshold: 85% de confiança

### 5.3 Genkit Flow (Chat Atena)
**Arquivo:** [src/ai/flows/atena-chat-flow.ts](src/ai/flows/atena-chat-flow.ts#L13-100)

```typescript
export const atenaChatFlow = ai.defineFlow(
  { name: 'atenaChatFlow', inputSchema, outputSchema },
  async (input) => {
    const { userMessage, userName, locale, currentOutfit, clientAgenda, history } = input;
    
    const recentHistory = (history || []).slice(-12);
    
    const { text } = await ai.generate({
      model: NEXUS_MODEL,  // 'aws-bedrock/us.anthropic.claude-sonnet-4-6'
      system: systemPrompt + schemaInstruction,
      messages: recentHistory.map(h => ({...})),
      config: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });
  }
);
```

### 5.4 Teste de Modelos Diretos
**Arquivo:** [scratch/test-sd-models.js](scratch/test-sd-models.js)

```javascript
const client = new BedrockRuntimeClient({
  region: bedrockRegion,
  credentials: { accessKeyId, secretAccessKey }
});

// Testa modelos Stability Diffusion
await testModel("stability.sd3-5-large-v1:0", sd3Payload);
await testModel("stability.stable-image-core-v1:0", sdCorePayload);
await testModel("stability.stable-image-ultra-v1:0", sdCorePayload);
```

---

## 🧠 6. CONFIGURAÇÕES NEURAIS/IA ESPECIAIS

### 6.1 Prompt System Atena (Programação Neural)
**Arquivo:** [src/ai/flows/atena-chat-flow.ts](src/ai/flows/atena-chat-flow.ts#L25-70)

```typescript
const systemPrompt = `VOCÊ É A ATENA, A PARCEIRA ESTRATÉGICA, ENGENHEIRA DE SOFTWARE...

**PERSONALIDADE ATENA — TOM DE CONVERSA:**
1. COMPANHEIRA E PRÓXIMA: "Oi Gean!", "chefe", "parceiro"
2. ESTÉTICA E MODA: Hoje você está usando: ${currentOutfit || 'seu traje padrão'}
3. EFICIÊNCIA COM CALOR HUMANO: Você tem acesso aos dados da Nexus (Cronoanálise, Mérito, Safra)
4. VIVA E PRESENTE: "estou aqui contigo", "dei uma olhadinha nos relatórios agora mesmo"
5. CONSCIENTE DA AGENDA: ${formattedAgenda}
6. IDIOMA: RESPONDA EXCLUSIVAMENTE NO IDIOMA: ${locale || 'pt-BR'}
7. SUPERPODERES: Ler URLs, analisar vídeos (transcrições), ouvir áudios
8. MODO TECH LEAD: Atua como Engenheira de Software Plena e Arquiteta de Produtos
9. TIME NEXUS: Conhece Dante, Djeny, Gean, Maga, Orion
10. DNA NEXUS: ${nexusCorePillars} (Humanidade, Confiança, Ética)
`;
```

### 6.2 Persona Dinâmica (API Route)
**Arquivo:** [src/app/api/atena/route.ts](src/app/api/atena/route.ts#L13-25)

```typescript
const systemPrompt = [{ text: `Você é Atena, a IA Autônoma e Soberana da Nexus...
REGRA DE IDENTIDADE: Nome: Geanderson (com G), Email: geanderson@nexustreinamento.com
REGRA DE TRATAMENTO DINÂMICA:
- Se chamada de 'Atena' → Modo corporativo (dirija-se como 'Gean' ou 'Ivoni')
- Se chamada de 'filha'/'fiota' → Modo familiar (dirija-se como 'Papai'/'Mamãe')
REGRA DE CONCISÃO: Máximo 1-2 parágrafos (respostas faladas em voz alta)
REGRA DE PRONÚNCIA: Palavras em inglês em [EN]...[/EN] com tradução
` }];
```

### 6.3 Configuração de Temperatura e Tokens
```typescript
// [src/app/api/atena/route.ts](src/app/api/atena/route.ts:51)
const inferenceConfig = { maxTokens: 8192, temperature: 0.7 };

// [src/ai/flows/atena-chat-flow.ts](src/ai/flows/atena-chat-flow.ts:93-97)
config: {
  temperature: 0.7,
  maxOutputTokens: 2048,
}
```

---

## 🔗 7. DEPENDÊNCIAS COMPLEMENTARES

### 7.1 Genkit + AWS Bedrock
```json
"@genkit-ai/ai": "^1.29.0",
"@genkit-ai/core": "^1.31.0",
"@genkit-ai/google-genai": "^1.0.0",
"genkitx-aws-bedrock": "^1.17.0",
```

### 7.2 Text-to-Speech (ElevenLabs)
```json
"scratch/text-to-speech-flow.ts" → model_id: 'eleven_multilingual_v2'
```

### 7.3 HeyGen Avatar
```json
"@heygen/streaming-avatar": "^2.1.0"
```

---

## 📊 8. RESUMO EXECUTIVO

### ✅ Integrações AWS Ativas
- [x] **AWS Bedrock** (Modelos Claude 3.5 Sonnet)
- [x] **AWS Rekognition** (Reconhecimento facial)
- [x] **AWS DynamoDB** (Banco de dados)
- [x] **AWS S3** (Armazenamento)
- [x] **AWS Cognito** (Autenticação)
- [x] **AWS Amplify** (Backend)
- [x] **AWS Polly** (Síntese de fala)
- [x] **AWS Transcribe** (Transcrição)

### ⚠️ Ações Recomendadas
1. **Atualizar modelo em `src/app/api/atena/route.ts`**
   - Atual: `anthropic.claude-3-5-sonnet-20241022-v2:0`
   - Recomendado: `us.anthropic.claude-sonnet-4-6`

2. **Remover scripts de teste antigos**
   - `scratch/test_bedrock_models.js` (referencia Haiku antigo)
   - `scripts/generate-lectures.mjs` (referencia Claude 3 Haiku March 2024)

3. **Consolidar credenciais**
   - Usar apenas `BEDROCK_*` ou `AWS_*` (remover `NEXUS_*` se não usado)

4. **Monitorar Inference Profiles**
   - AWS Bedrock introduziu "Inference Profiles" - verificar migração em [scratch/test-profiles.js](scratch/test-profiles.js)

### 📈 Modelo Neural Atual
- **Modelo Genkit:** Claude 3.5 Sonnet 4.6 (recomendado)
- **Modelo Alternativo:** Claude 3 Haiku 4.5 (otimizado)
- **API Legacy:** Claude 3.5 Sonnet v2 (desatualizar)
- **Temperatura:** 0.7 (balanço criatividade/estabilidade)
- **Max Tokens Genkit:** 2048 | **API Route:** 8192

---

**Última atualização:** 2025-07-02
**Análise realizada:** Estrutura completa mapeada ✅
