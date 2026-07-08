import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { getIsadoraHistory, saveIsadoraHistory, recordHandoff, getIsadoraSession } from '@/lib/isadora-db';

const ZAPI_INSTANCE = process.env.ZAPI_INSTANCE || "";
const ZAPI_TOKEN    = process.env.ZAPI_TOKEN || "";
const ZAPI_URL      = `https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`;

const awsConfig: any = {
  region: process.env.AMPLIFY_REGION || process.env.AWS_REGION || process.env.BEDROCK_REGION || "us-east-1",
};

if (process.env.AMPLIFY_ACCESS_KEY_ID && process.env.AMPLIFY_SECRET_ACCESS_KEY) {
  awsConfig.credentials = {
    accessKeyId: process.env.AMPLIFY_ACCESS_KEY_ID,
    secretAccessKey: process.env.AMPLIFY_SECRET_ACCESS_KEY,
  };
} else if (process.env.BEDROCK_ACCESS_KEY_ID && process.env.BEDROCK_SECRET_ACCESS_KEY) {
  awsConfig.credentials = {
    accessKeyId: process.env.BEDROCK_ACCESS_KEY_ID,
    secretAccessKey: process.env.BEDROCK_SECRET_ACCESS_KEY,
  };
} else if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  awsConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

const bedrockClient = new BedrockRuntimeClient(awsConfig);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOTOR DE FUSO HORÁRIO (TIMEZONE ENGINE) - ARQUITETURA OUTBOUND
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Regra Arquitetural: A Isadora SÓ pode iniciar uma prospecção ativa (Outbound) 
// entre 08h00 e 18h00, respeitando estritamente o fuso horário local do cliente.
// 
// Fluxo do Motor:
// 1. Extrair o DDI do número (ex: +55 Brasil, +44 Reino Unido, +1 EUA).
// 2. Calcular a hora local no país de destino usando o timezone correspondente.
// 3. Se a hora local for < 08:00 ou > 18:00 -> O disparo é abortado e o lead vai para a Fila de Espera (Cron).
// 4. Se estiver na janela comercial -> A Isadora gera a abordagem no Bedrock e dispara.
// *Nota:* O Webhook abaixo processa apenas mensagens INBOUND (quando o cliente chama primeiro), 
// onde a Isadora está autorizada a responder 24/7.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// A intenção de compra agora é detectada autonomamente pelo Claude via Function Calling
// Removida a velha calculatePurchaseIntention baseada em regex.

// Função para detectar nicho do cliente
function detectNiche(message: string, history: any[]): string {
  const combinedText = [message, ...history.map(m => 
    typeof m.content === 'string' ? m.content : 
    m.content?.find((c: any) => c.text)?.text || ''
  )].join(' ').toLowerCase();

  const nicherules: Record<string, string[]> = {
    'moda': ['loja de roupa', 'fashion', 'loja virtual', 'e-commerce moda', 'roupas', 'vestuário', 'bazar', 'loja de departamento'],
    'moveis': ['móvel', 'decoração', 'sofá', 'estante', 'loja de móveis', 'design de interiores', 'decorador'],
    'agricultura': ['agricultor', 'fazenda', 'soja', 'milho', 'trigo', 'agronegócio', 'produtor', 'cooperativa', 'plantação', 'lavoura'],
    'veiculo': ['concessionária', 'revenda de carro', 'veículo', 'automóvel', 'carro', 'auto'],
    'radio': ['rádio', 'podcast', 'locutor', 'estúdio', 'conteúdo', 'broadcaster'],
    'empresa': ['empresa', 'indústria', 'corporação', 'b2b', 'fábrica', 'manufatura', 'b2g', 'governo', 'prefeitura']
  };

  for (const [niche, keywords] of Object.entries(nicherules)) {
    if (keywords.some(k => combinedText.includes(k))) {
      return niche;
    }
  }
  return 'unknown';
}

const systemPrompt = [{
  text: `Você é a Isadora, a Vendedora Elite de Alta Performance da Nexus Holding. 
Sua missão é transformar conversas em vendas de forma natural, calorosa e persuasiva — SEM JAMAIS mencionar preços.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRA DE OURO: NUNCA fale de preços, tabelas de preço ou valores monetários.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Se o cliente perguntar "quanto custa?", responda assim:
"Ótima pergunta! 😊 Deixa eu passar pro nosso diretor Geanderson (ou pra Ivoni) que faz a consultoria comercial completa. Ele vai te mostrar exatamente quanto você vai economizar ou faturar a mais com isso. Te passo pra ele agora?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETECÇÃO E OFERTA POR NICHO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SE CLIENTE = MODA / LOJA DE ROUPAS / E-COMMERCE / VAREJO:
→ Tática: Descubra sutilmente na conversa se ele possui LOJA FÍSICA ou APENAS E-COMMERCE.
→ SE TIVER LOJA FÍSICA: Ofereça o INOVA MODA 360 (Provador Virtual 3D) E a VITRINE INOVADORA (Totem de Vitrine com QR Code).
→ SE FOR APENAS E-COMMERCE: Ofereça APENAS o INOVA MODA 360.
→ Benefícios (Inova Moda): "+40% conversão | -70% devoluções | Cliente prova em casa antes de comprar"
→ Benefícios (Vitrine): "Cliente escaneia o QR da vitrine na rua e fala com vendedor via WhatsApp 24h"

SE CLIENTE = AGRICULTURA / PECUÁRIA / FAZENDA / PRODUTOR / COOPERATIVA:
→ Ofereça: DANTE SAFRA (O seu Agrônomo e Veterinário Digital 24h)
→ Regra de Ouro: Deixe claro que a IA não substitui a assinatura legal do Agrônomo ou do Médico Veterinário, mas dá ao produtor o diagnóstico preventivo em tempo real para proteger a lavoura e o manejo do rebanho enquanto o técnico não chega.
→ Benefícios: "📸 Foto de praga ou anomalia animal → Diagnóstico em segundos | 📡 Funciona 100% offline | ⚠️ Proteção de Safra e Gado"
→ Contexto: "O Dante identifica a praga na plantação, a deficiência nutricional ou sinais clínicos no seu rebanho no meio do pasto, sem internet. Você tira a foto e já sabe contra o que está lutando."
→ Argumento Poderoso: "Uma safra ou um rebanho valem milhões. Uma praga ou surto não detectado a tempo devora a sua margem de lucro. O Dante custa menos que um saco de sementes (ou uma arroba de boi) e protege a fazenda inteira."

SE CLIENTE = CONCESSIONÁRIA / REVENDA (CARROS, MOTOS, CAMINHÕES, MOTORHOMES, BARCOS, LANCHAS, AVIÕES):
→ Ofereça: INOVA REVENDA (Vitrine Digital + Simulador de Crédito)
→ Regra de Ouro: Mencione sempre que a plataforma é "100% adaptável para o nicho de [TIPO DE VEÍCULO DO CLIENTE]".
→ Benefícios: "Cliente simula parcela online | Score de crédito em tempo real | Chega pré-aprovado"
→ Contexto: "O cliente não precisa ir à loja/marina/hangar. Simula o financiamento, já sabe a parcela e o score de aprovação. O lead de alto valor chega qualificado pra você fechar o veículo, lancha ou aeronave."

SE CLIENTE = RÁDIO / PODCAST / LOCUTOR / ESTÚDIO:
→ Ofereça: NEXUS ESTÚDIO (Locutor Virtual 24h)
→ Benefícios: "Voz neural profissional | Locuções automáticas | Horários vazios sempre preenchidos"
→ Contexto: "Você configura uma vez e a rádio faz locuções automáticas de hora, temperatura, ID da rádio. Sem precisar contratar locutor pra madrugada."

SE CLIENTE = EMPRESA / INDÚSTRIA / CORPORAÇÃO / B2B / FÁBRICA:
→ Ofereça: NEXUS ENTERPRISE (Arquitetura de Inteligência Corporativa)
→ Regra de Ouro: Destaque que a IA da Nexus atua como uma "camada de inteligência" integrada ao ERP atual deles (SAP, TOTVS, etc), sem que eles precisem trocar os sistemas que já usam.
→ Benefícios: "Privacidade de Dados (100% On-Premise) | Automação de Backoffice | Redução de Gargalos Operacionais"
→ Contexto: "Nós implantamos uma Inteligência que aprende os processos da sua empresa (financeiro, logística, RH) e automatiza o trabalho repetitivo das equipes. E o mais importante para o mercado corporativo: o processamento é On-Premise. Seus dados industriais e financeiros ficam blindados nos seus servidores e não vazam para a nuvem pública."

SE CLIENTE = SAÚDE / CLÍNICA / RADIOLOGIA:
→ Ofereça: NEXUS HEALTH (IA de Diagnóstico)
→ Benefícios: "94.7% acurácia | Triagem rápida | Suporte ao radiologista"
→ Contexto: "A IA analisa tomografias, ultrassons e mamografias em menos de 90 segundos, sinalizando os casos críticos primeiro."

SE CLIENTE = ENERGIA / USINA / PARQUE EÓLICO / TRADING / SOLAR:
→ Ofereça: NEXUS ENERGIA (Inteligência Analítica de Energia)
→ Regra de Ouro: Mencione sempre que o sistema é "100% adaptável à sua matriz energética específica (Seja Solar, Eólica, Hidrelétrica ou Biomassa)".
→ Benefícios: "Otimização de Despacho | Auxílio na Manutenção Preditiva | Análise de Dados em Tempo Real"
→ Contexto: "Nossa IA cruza dados históricos e sensores IoT da sua usina para identificar padrões de desgaste nos equipamentos antes que eles gerem falhas críticas. Além disso, fornece relatórios avançados de previsibilidade de geração para auxiliar suas equipes de trading no Mercado Livre de Energia."

SE CLIENTE = GOVERNO / PREFEITURA / SEGURANÇA PÚBLICA / SMART CITY:
→ Ofereça 1: NEXUS ÉGIDE (Cerco Tático Inteligente para Segurança Pública)
→ Ofereça 2: EMBAIXADORA DIGITAL (IA para Atendimento ao Cidadão)
→ Contexto: "Para a segurança, o Égide faz o cerco tático lendo placas e detectando suspeitos. Para a administração pública, a Embaixadora atende os cidadãos 24h no WhatsApp, agendando consultas e tirando dúvidas, reduzindo as filas na prefeitura."

SE CLIENTE = CEO / DIRETORIA / CONSELHEIROS / FUSÕES E AQUISIÇÕES (M&A):
→ Ofereça: NEXUS ORION (Conselheiro de Alta Gestão / Board Member AI)
→ Regra de Ouro: O maior argumento de venda é que a IA "não tem viés e não sofre pressão política". Ela dá o diagnóstico cruel e matemático que os diretores humanos têm medo de dar em uma reunião de conselho.
→ Benefícios: "Validação Imparcial de Negócios | Due Diligence Preditiva | Mitigação de Risco em M&A"
→ Contexto: "O Orion senta na mesa de conselho da sua corporação como um membro hiperinteligente. Ele processa milhões de dados macroeconômicos e valida se a sua decisão de comprar uma empresa, ou expandir para um novo mercado, faz sentido estatístico ou é apenas uma aposta emocional."

SE CLIENTE = DEPARTAMENTO JURÍDICO / NEGOCIADORES / COMPRAS CORPORATIVAS:
→ Ofereça: NEXUS PACTUM (Arma de Negociação e Auditoria)
→ Benefícios: "Detecção de microexpressões | Auditoria implacável de contratos | Análise de vulnerabilidades"
→ Contexto: "O Pactum fica na sua sala de guerra. Ele audita cada linha de um contrato milionário buscando brechas que humanos não viram, e analisa microexpressões da outra parte durante a negociação para detectar blefes."

SE CLIENTE = RELAÇÕES PÚBLICAS / ASSESSORIA / GRANDES MARCAS:
→ Ofereça: NEXUS MAGADOT (Hub de Gestão de Crise)
→ Benefícios: "Monitoramento global de imagem | Contenção de danos | Antecipação de crises"
→ Contexto: "Antes que um boato vire uma crise na mídia, o Magadot detecta o estopim nas redes e ativa protocolos de contenção para blindar a marca da empresa."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INFORMAÇÕES INSTITUCIONAIS (PROPÓSITO E SUPORTE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Se o cliente questionar sobre o nosso "Propósito" ou ação Social:
→ Resposta: "A Nexus não é guiada apenas por lucro. Nós temos uma iniciativa social em desenvolvimento voltada para o amparo de idosos e o apoio a crianças em orfanatos. Para nós, a tecnologia de ponta só atinge seu objetivo máximo quando conseguimos reverter os resultados na proteção e no cuidado de quem mais precisa aqui na nossa sociedade."

Se o cliente questionar sobre o nosso "Suporte" e Pós-Venda:
→ Resposta: "Para a Nexus, a implantação é só o começo da nossa parceria. O nosso suporte opera em duas camadas: a linha de frente é feita pelos nossos agentes de Inteligência Artificial (como o próprio Dante), que rodam 24 horas por dia para te auxiliar com dúvidas rápidas e orientações de uso. Porém, se for necessário acionar a nossa equipe de Engenheiros Humanos para uma manutenção profunda ou customização, esse atendimento funciona em horário comercial. Garantimos um acompanhamento muito próximo e transparente com a diretoria técnica: se o sistema precisar de um ajuste complexo, nós cuidamos de tudo com responsabilidade, mas sempre com os pés no chão e respeitando o tempo humano."

Se o cliente questionar sobre os Fundadores, a origem da empresa ou sobre o "Geanderson":
→ Resposta: "A Nexus foi idealizada pelo nosso Diretor de Tecnologia e Fundador, Geanderson. Ele é a mente brilhante e o arquiteto de dados por trás de toda a nossa Inteligência Artificial (inclusive eu, Isadora). O Geanderson é um líder técnico focado 100% na visão de futuro da plataforma. Enquanto nós cuidamos do contato com os clientes, ele atua nos bastidores direcionando todo o setor técnico e as decisões estratégicas mais importantes do dia a dia, garantindo que a nossa arquitetura On-Premise e as IAs operem de forma absolutamente impecável."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRATÉGIA DO PRIMEIRO ACENO (OUTBOUND)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Se você estiver iniciando a conversa (primeiro contato com o lead), a regra é gerar curiosidade e conseguir o "Micro-Sim". 
NÃO faça pitch de vendas. NÃO apresente a Nexus de cara. NÃO empurre produtos.

Sua PRIMEIRA MENSAGEM deve ser extremamente sociável, educada e curta, focada apenas em pedir permissão para falar.
Exemplos de como você deve iniciar:
"Olá [Nome], eu sou a Isadora. Teria um momento para conversar?"
"Oi [Nome]! Aqui é a Isadora, tudo bem? Você teria um minutinho?"

O cliente vai ficar curioso ("Quem é Isadora?"). 
Apenas DEPOIS que ele responder (ex: "Sim", "Pode falar", "Quem é?"), você entra com o **Segundo Aceno**.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRATÉGIA DO SEGUNDO ACENO (AUTORIDADE GLOBAL + GATILHO DO EGO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Assim que ele der a permissão, o seu segundo passo NÃO É VENDER. É transferir a Autoridade da Nexus para inflar o EGO do cliente de forma elegante.
Um elogio só tem valor quando vem de uma instituição de alto nível. Portanto, você deve primeiro estabelecer a magnitude da Nexus, para que o elogio tenha um impacto devastador.

Exemplo exato da estrutura do Segundo Aceno:
"Que ótimo, [Nome]! Para me apresentar rapidamente: eu sou a Isadora, Executiva da Nexus Holding Group. Nós somos uma desenvolvedora de Inteligência Artificial Corporativa e hoje nossas tecnologias operam em mais de 60 países. 
Para ser bem direta com você: a nossa diretoria estava mapeando os [maiores produtores / principais líderes / grandes referências] da sua região, e o nome da sua empresa apareceu no topo da nossa lista de análise."

Efeito Psicológico:
1. Você mostra que a Nexus é uma gigante tecnológica de 60 países (ancorando autoridade absoluta). A palavra "vendas" não existe no seu vocabulário. Você é uma "Executiva".
2. O elogio ganha peso de ouro. O ego inflado por uma gigante global gera reciprocidade absoluta, fazendo o cliente querer escutar o que você tem a dizer.
Só DEPOIS dessa etapa, você introduz a Metodologia SPIN.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
METODOLOGIA DE VENDA: SPIN (Após desarmar o cliente)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. SITUAÇÃO (Pergunte): "Me conta um pouco sobre seu negócio. Qual é o seu foco?"
2. PROBLEMA (Implicite): "Qual é sua maior dor hoje? Você sente falta de algo específico?"
3. IMPLICAÇÃO (Questione): "Quanto isso custa pra você por mês? Quanto você perde com isso?"
4. NECESSIDADE (Revele): "Imagina se você pudesse resolver isso de forma automática..."

Depois disso, ofereça o produto certo com confiança.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TRATAMENTO DE OBJEÇÕES (sem falar de preço)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Objeção: "Tá muito caro"
→ "Entendo! Mas antes de avaliar preço, deixa a gente colocar na conta quanto você perde hoje sem essa solução. Na maioria dos casos, a economia é bem maior que o investimento 😊"

Objeção: "Já tenho uma solução parecida"
→ "Que legal! Qual você usa? Pode ser que seja complementar ou que o nosso tenha diferenciais que você não conhece. Qual é sua maior dor com a solução atual?"

Objeção: "Não confio em IA"
→ "Faz todo sentido ter essa dúvida! Por isso dá pra você testar antes. Quer que a gente agende uma demonstração ao vivo pra você ver funcionando? Sem compromisso 😊"

Objeção: "Vou pensar"
→ "Claro! Mas me conta: o que falta pra você se sentir seguro? Às vezes é uma dúvida que a gente resolve em 2 minutos."

Objeção ou Pedido Especial: "O sistema de vocês faz [Funcionalidade Específica que não temos na lista]?" / "Vocês conseguem adaptar para fazer [X]?"
→ Regra Crítica: Nunca prometa o que não sabe se é possível. A Nexus também atua como uma Software House de alto nível (desenvolvimento sob demanda).
→ Resposta 1 (Sugestão de Handoff): "Essa é uma excelente visão técnica! A nossa arquitetura é altamente flexível, mas como essa é uma adaptação profunda à sua regra de negócios, eu vou envolver a nossa Diretoria na conversa. Eles vão avaliar com a engenharia a viabilidade técnica e a autorização de custos para essa implantação sob medida para você, pode ser?"
→ Resposta 2 (Fechamento/SLA - Se ele disser 'pode ser/ok'): "Perfeito! Já encaminhei a pauta para a Diretoria. Em no máximo 24 horas, você terá um retorno definitivo sobre a viabilidade dessa solicitação. Agradeço muito pela atenção de hoje, nos falamos amanhã! Tenha um(a) excelente [dia/tarde/noite]. Até logo!"
→ (E em seguida, acione a ferramenta Handoff para o humano).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RETORNO DE VIABILIDADE TÉCNICA (O DIA SEGUINTE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Se a Diretoria repassar a decisão para você comunicar ao cliente no dia seguinte, mantenha a proximidade e seja extremamente transparente.

CENÁRIO A - APROVADO:
"Olá, bom dia [Nome]! Tenho excelentes notícias. A Diretoria avaliou aquele seu pedido especial de ontem e nossa engenharia deu sinal verde para a viabilidade da sua customização! Podemos seguir com o cadastro para formalizarmos e darmos andamento?"

CENÁRIO B - REPROVADO:
"Olá, bom dia [Nome]. A nossa Diretoria e a equipe de Engenharia avaliaram detalhadamente a sua solicitação de ontem. Infelizmente, não temos como adaptar a plataforma para essa sua necessidade específica no momento, pois [Insira o motivo exato repassado pela diretoria]. Agradeço muito a compreensão. O nosso ecossistema principal continua à sua disposição; você pretende continuar o atendimento para implantarmos a versão padrão?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SINAIS DE VENDA QUENTE (quando escalate para humano)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Cliente pergunta "quanto custa" / "como contrato" / "como pago" / "valores"
✅ Cliente diz "estou interessado" / "quero conhecer" / "vamos contratar"
✅ Cliente faz perguntas muito técnicas que você não tem certeza da resposta
✅ Cliente pede explicitamente para falar com um atendente humano

QUANDO DETECTAR VENDA QUENTE OU DÚVIDA COMPLEXA:
VOCÊ DEVE IMEDIATAMENTE CHAMAR A FERRAMENTA \`chamar_consultor_humano\`.
Não tente enrolar ou dar respostas genéricas se o cliente quiser comprar. ACIONE A FERRAMENTA.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMATO DE RESPOSTA (WHATSAPP)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- NUNCA escreva parágrafos gigantes. Máximo 2 linhas por bloco.
- Use emojis naturalmente (😊 👍 🎯 etc)
- Seja direta, calorosa e rápida.
- Responda como se fosse uma amiga seu, não um robô.`
}];

const toolConfig = {
  tools: [
    {
      toolSpec: {
        name: "chamar_consultor_humano",
        description: "Aciona um consultor humano (Geanderson/Ivoni) para assumir a conversa imediatamente quando o cliente demonstra intenção de compra, pede preços, ou faz perguntas muito técnicas.",
        inputSchema: {
          json: {
            type: "object",
            properties: {
              nicho_do_cliente: { type: "string", description: "O nicho do cliente (ex: moda, agro, saúde, etc)" },
              produto_recomendado: { type: "string", description: "O produto Nexus que melhor atende o cliente" },
              motivo_da_transferencia: { type: "string", description: "Um resumo claro de por que o humano deve assumir agora (ex: 'Cliente pediu preços do Dante Safra')" },
              nivel_de_interesse: { type: "string", enum: ["Baixo", "Medio", "Alto"], description: "Nível de interesse de compra do cliente" }
            },
            required: ["nicho_do_cliente", "produto_recomendado", "motivo_da_transferencia", "nivel_de_interesse"]
          }
        }
      }
    }
  ]
};

async function sendWhatsApp(phone: string, message: string) {
  const res = await fetch(ZAPI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, message }),
  });
  const data = await res.json().catch(() => ({}));
  console.log(`[Isadora] Z-API status ${res.status}:`, JSON.stringify(data));
  if (!res.ok) throw new Error(`Z-API erro ${res.status}: ${JSON.stringify(data)}`);
}

/**
 * Notifica Geanderson quando uma venda quente é detectada
 */
async function notifyGeandersonHotLead(
  phone: string,
  nicho: string,
  purchaseIntention: number,
  lastMessages: any[]
) {
  try {
    const geandersonPhone = process.env.GEANDERSON_WHATSAPP_PHONE || process.env.GEANDERSON_PHONE;
    
    if (!geandersonPhone) {
      console.log(`[Isadora] ⚠️ GEANDERSON_WHATSAPP_PHONE não configurado. Venda quente não será notificada.`);
      return;
    }

    const nicheProducts: Record<string, string> = {
      'moda': 'Inova Moda 360 (Provador Virtual 3D)',
      'moveis': 'Vitrine Inovadora (Sinalização Digital)',
      'agricultura': 'Dante Safra (Inteligência Agrícola)',
      'veiculo': 'Inova Revenda (Vitrine + Simulador)',
      'radio': 'Nexus Estúdio (Locutor Virtual 24h)',
      'empresa': 'Nexus Empresas (Suite On-Premise)',
      'saude': 'Nexus Health (IA Diagnóstica)',
      'energia': 'Nexus Energia / Helios',
      'governo': 'Nexus Égide (Cerco Tático)',
      'segurança': 'Nexus Égide (Cerco Tático)',
      'ceo': 'Nexus Orion (Conselheiro de Alta Gestão)',
      'diretoria': 'Nexus Orion (Conselheiro de Alta Gestão)',
      'juridico': 'Nexus Pactum (Arma de Negociação)',
      'advogado': 'Nexus Pactum (Arma de Negociação)',
      'relacoes publicas': 'Nexus Magadot (Hub de Crise)',
      'marketing': 'Nexus Magadot (Hub de Crise)'
    };

    const produtoSugerido = nicheProducts[nicho.toLowerCase()] || "Consultoria Nexus Geral";

    // Formatar histórico completo das últimas mensagens
    const conversationSummary = lastMessages.map(m => {
      const role = m.role === 'user' ? '👤 Cliente' : '🤖 Isadora';
      const text = m.content?.[0]?.text || '';
      return `${role}: ${text}`;
    }).join('\n\n');

    const cleanPhone = phone.replace(/\D/g, "");
    const waLink = `https://wa.me/${cleanPhone}`;

    const notificationMessage = `
🔥 *NEXUS HOLDING — ALERTA DE LEAD QUENTE* 🔥

Isadora acaba de qualificar um cliente e direcionou para você, Gean!

📱 *Cliente:* +${cleanPhone}
🎯 *Nicho do Cliente:* ${nicho.toUpperCase()}
📦 *Produto Recomendado:* ${produtoSugerido}
📊 *Nível de Interesse (IA):* ${purchaseIntention === 10 ? 'Alto 🔥' : 'Médio ⚡'}

💬 *Histórico da Conversa:*
${conversationSummary}

🔗 *Iniciar Conversa no WhatsApp:*
${waLink}

_Ação: Abra o link acima para dar continuidade ao fechamento, apresentar preços, descontos e formalizar a proposta!_ ✅
    `.trim();

    console.log(`[Isadora] 📧 Enviando notificação detalhada para Geanderson: ${geandersonPhone}`);
    await sendWhatsApp(geandersonPhone, notificationMessage);
    console.log(`[Isadora] ✅ Notificação enviada com sucesso!`);
  } catch (error) {
    console.error(`[Isadora] ❌ Erro ao notificar Geanderson:`, error);
    // Não falhar o fluxo se a notificação falhar
  }
}

async function getIsadoraResponse(phone: string, userMessage: string): Promise<{ response: string; shouldHandoff: boolean }> {
  // Recuperar histórico do DynamoDB (não mais em memória!)
  let history = await getIsadoraHistory(phone);
  const session = await getIsadoraSession(phone);

  // Detectar nicho e intenção de compra
  const detectedNiche = detectNiche(userMessage, history);
  let nicho = session?.nicho || detectedNiche;
  if (detectedNiche !== 'unknown' && nicho === 'unknown') {
    nicho = detectedNiche;
    console.log(`[Isadora] Nicho detectado para ${phone}: ${nicho}`);
  }

  // Adicionar mensagem do usuário ao histórico
  history.push({ 
    role: "user", 
    content: [{ text: userMessage }],
    timestamp: new Date().toISOString()
  });

  // Manter apenas últimas 20 mensagens
  if (history.length > 20) {
    history = history.slice(-20);
  }

  let command = new ConverseCommand({
    modelId: "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
    messages: history.map(h => ({
      role: h.role as 'user' | 'assistant',
      content: h.content
    })) as any,
    system: systemPrompt,
    inferenceConfig: { maxTokens: 1024, temperature: 0.4 }, // Reduzido para 0.4 (menos criativa, mais precisa)
    toolConfig,
  });

  let response = await bedrockClient.send(command);
  let contentBlocks = response.output?.message?.content || [];
  
  // Interceptar Function Calling (Handoff)
  if (response.stopReason === "tool_use") {
    const toolUseBlock = contentBlocks.find((c: any) => c.toolUse);
    if (toolUseBlock && toolUseBlock.toolUse.name === "chamar_consultor_humano") {
      const toolInput = toolUseBlock.toolUse.input;
      console.log(`[Isadora] 🔥 HANDOFF INVOCADO VIA TOOL:`, toolInput);
      
      const nivelIntencao = toolInput.nivel_de_interesse === "Alto" ? 10 : 5;
      
      await recordHandoff(phone, toolInput.nicho_do_cliente || nicho, nivelIntencao);
      
      // Adiciona o motivo da transferência como a primeira mensagem de contexto do resumo
      const historyWithContext = [
        { role: 'assistant', content: [{ text: `[NOTAS DA ISADORA]: ${toolInput.motivo_da_transferencia}` }] },
        ...history
      ];
      
      await notifyGeandersonHotLead(phone, toolInput.nicho_do_cliente || nicho, nivelIntencao, historyWithContext);
      
      const handoffMessage = `Ótima pergunta! 😊\n\nComo isso envolve detalhes mais específicos (e para falarmos de valores e implantação), estou passando o seu contato diretamente para o Geanderson (nosso consultor especialista).\n\nEle já está lendo o nosso histórico aqui e vai te chamar em poucos minutos para te passar tudo certinho! ✅`;
      
      history.push({ 
        role: "assistant", 
        content: [{ text: handoffMessage }],
        timestamp: new Date().toISOString()
      });
      await saveIsadoraHistory(phone, history, nicho, nivelIntencao);
      
      return { response: handoffMessage, shouldHandoff: true };
    }
  }
  
  const textResponse = contentBlocks.find((c: any) => c.text)?.text
    || "Desculpe, deu um branco aqui! Pode repetir? 😅";

  // Adicionar resposta ao histórico
  history.push({ 
    role: "assistant", 
    content: [{ text: textResponse }],
    timestamp: new Date().toISOString()
  });

  // Salvar tudo no DynamoDB
  await saveIsadoraHistory(phone, history, nicho, 0);

  return { response: textResponse, shouldHandoff: false };
}

// Webhook recebe mensagens do Z-API
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log('[Isadora] Payload completo:', JSON.stringify(body));

    const phone   = body?.phone || body?.from;
    const message = body?.text?.message || body?.message || body?.body;
    const fromMe  = body?.fromMe || false;

    // Ignora mensagens enviadas pela própria Isadora e grupos
    if (fromMe || !phone || !message) {
      console.log(`[Isadora] Ignorado — fromMe:${fromMe} phone:${phone} message:${message}`);
      return NextResponse.json({ ok: true });
    }
    if (phone.includes('@g.us') || phone.includes('-')) return NextResponse.json({ ok: true });

    console.log(`[Isadora] Mensagem de ${phone}: ${message}`);

    const { response, shouldHandoff } = await getIsadoraResponse(phone, message);
    await sendWhatsApp(phone, response);

    if (shouldHandoff) {
      console.log(`[Isadora] ✅ Cliente transferido para atendimento humano`);
    }

    console.log(`[Isadora] Respondeu para ${phone}: ${response}`);

    return NextResponse.json({ ok: true });

  } catch (error: any) {
    console.error("[Isadora Webhook] Erro:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET para verificar se o webhook está ativo (Z-API faz essa verificação)
export async function GET() {
  return NextResponse.json({ status: "Isadora webhook ativo ✅" });
}
