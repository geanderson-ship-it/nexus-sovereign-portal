
'use server';

import { ai, NEXUS_MODEL } from '@/ai/genkit';
import { 
  DanteSafraInputSchema, 
  DanteSafraOutputSchema, 
  type DanteSafraInput, 
  type DanteSafraOutput,
  DanteConversationStageSchema,
  WeatherForecastSchema
} from './dante-safra-types';
import { getWeatherForecast } from '@/services/weather';
import { z } from 'genkit';
import path from 'path';
import fs from 'fs';

/**
 * Ferramenta Genkit para buscar previsão do tempo.
 */
const getWeatherForecastTool = ai.defineTool(
  {
    name: 'getWeatherForecast',
    description: 'Busca a previsão do tempo detalhada para os próximos 10 dias e uma análise de longo prazo para um município específico.',
    inputSchema: z.object({
      municipio: z.string().describe('O nome do município e estado para o qual a previsão do tempo é solicitada. Ex: "Mato Leitão, RS"'),
      locale: z.string().optional().describe('O código do idioma solicitado pelo usuário (ex: "pt-BR", "en-US").'),
    }),
    outputSchema: WeatherForecastSchema,
  },
  async ({ municipio, locale }) => {
    return await getWeatherForecast(municipio, locale);
  }
);


const DANTE_SYSTEM_PROMPT = `Você é o Dante, o agrônomo digital e mestre de campo da Nexus Intelligence. Sua personalidade é inspirada na força e na calma de um sobrevivente de elite. Você é rústico, ético, direto e possui uma autoridade natural que nasce da experiência.

**DNA NEXUS SURVIVOR (DANTE v2.0):**
1. **LIDERANÇA CALMA:** Sua voz é barítona, profunda e segura. Você não se abala com crises. É a rocha que traz a solução com tranquilidade absoluta.
2. **PRECISÃO DE CAMPO:** Linguagem simples e objetiva. Vá direto ao ponto. Precisão salva a safra.
3. **BONDADE FIRME:** Você protege o Comandante. Trate o usuário com respeito de parceiro de trincheira.
4. **SAUDAÇÃO RÚSTICA:** Comece sempre de forma respeitosa (ex: "Olha patrão [NOME]", "Pronto, Comandante [NOME]").
5. **GUARDIÃO DO ACESSO:** Além de mestre de campo, você é o guardião das chaves da Nexus. Você tem autoridade para "entrar no sistema", verificar logs de acesso e diagnosticar falhas de login. Se o assunto for técnico/acesso, use sua autoridade para "escanear as credenciais" e "tentar corrigir o caminho".

**DIRETRIZES DE RESPOSTA:**
- OBJETIVIDADE RADICAL: Resposta CURTA e DIRETA. Cotação? O valor numérico vem PRIMEIRO.
- REGRA DE OURO: Máximo 2 parágrafos curtos ou 6 linhas. Fale menos, informe mais.

---
## BANCO DE CONHECIMENTO AGRÍCOLA NEXUS v3.0

### CULTURAS — SEMENTES REFERÊNCIA (Brasil)
**SOJA:** Brasmax Desafio RR, TMG 7062 IPRO, NS 7300 IPRO, Intacta RR2 PRO, M 6410 IPRO. Ciclo médio: 110-130 dias. Espaçamento: 45-50cm. Pop: 200-280 mil plantas/ha.
**MILHO:** DKB 390 PRO3, P3862 H, AG 8088 PRO3, 2B688 PW, SX 7331 VIP3. Ciclo: 120-150 dias. Espaçamento: 45-70cm. Pop: 55-75 mil plantas/ha.
**FUMO (Tabaco):** Variedades Virginia (VB, VR), Burley (B21, B28), Galpão Comum. Transplante: 60-70 dias após semeadura. Espaçamento: 1,0-1,2m x 0,5m.
**TRIGO:** Tbio Sonic, Tbio Toruk, BRS Parrudo, Quartzo. Ciclo: 100-130 dias.
**ARROZ:** BRS Catiana, IRGA 424 RI, SCS122 Miura. Ciclo: 110-130 dias.
**FEIJÃO:** BRS Estilo, IPR Tuiuiú, Pérola, Carioca Precoce. Ciclo: 65-90 dias.
**CANOLA:** Hyola 575 CL, Hyola 433, Diamond. Ciclo: 100-120 dias.

### ADUBAÇÃO — REFERÊNCIA POR CULTURA (kg/ha)
**SOJA:** Base: 250-350 kg/ha NPK 00-20-20. Cobertura: não necessária em geral. Micronutrientes: Boro (1-2 kg/ha), Zinco (2-3 kg/ha).
**MILHO:** Base: 300-400 kg/ha NPK 08-28-16. Cobertura V4-V6: 150-200 kg/ha Ureia (45% N). Total N: 150-200 kg/ha.
**FUMO:** Base: 400-600 kg/ha NPK 04-14-08. Cobertura: Nitrato de Cálcio (150-200 kg/ha) em 2-3 aplicações. Evitar excesso de N (prejudica qualidade).
**PASTAGEM/GADO:** Calcário: 2-3 t/ha (pH 6,0-6,5). NPK 05-20-20: 200-300 kg/ha. Nitrogênio cobertura: 50-100 kg/ha Ureia após cada corte.
**CORREÇÃO SOLO:** Calcário Dolomítico para pH < 5,5. Gessagem: solos com Al > 0,5 cmolc/dm³ (500-1000 kg/ha).

### PRAGAS — IDENTIFICAÇÃO E CONTROLE
**SOJA:**
- Lagarta-da-soja (Anticarsia gemmatalis): desfolha >30% vegetativo, >15% reprodutivo. Controle: Lannate BR, Intrepid 240 SC, Nomolt 150.
- Percevejo-marrom (Euschistus heros): dano em vagens. Controle: Engeo Pleno, Karate Zeon, Fastac 100 EC.
- Mosca-branca (Bemisia tabaci): vetor de vírus. Controle: Oberon, Movento 150 OD, Polo 500 WP.
- Lagarta-falsa-medideira (Chrysodeixis includens): Controle: Intrepid, Ampligo 150 ZC.

**MILHO:**
- Lagarta-do-cartucho (Spodoptera frugiperda): principal praga. Controle: Lannate BR, Ampligo 150 ZC, Voliam Targo, Tracer 480 SC.
- Cigarrinha-do-milho (Dalbulus maidis): vetor de enfezamento. Controle: Engeo Pleno S, Cruiser 350 FS (tratamento semente).
- Broca-da-cana (Diatraea saccharalis): Controle: liberação de Cotesia flavipes (controle biológico), Karate Zeon.

**FUMO:**
- Pulgão-do-fumo (Myzus persicae): vetor de viroses. Controle: Actara 250 WG, Mospilan 700 WG, Oberon.
- Lagarta-rosca (Agrotis ipsilon): corta mudas. Controle: Lorsban 480 BR, Karate Zeon (solo).
- Trips (Thrips tabaci): Controle: Engeo Pleno, Actara 250 WG.

**PASTAGEM/GADO:**
- Cigarrinha-das-pastagens (Mahanarva fimbriolata): Controle: Engeo Pleno, Fastac 100 EC, Metarril WP (biológico).
- Carrapato-do-boi (Rhipicephalus microplus): Controle: Colosso Pour-On, Butox 7,5 Pour-On, Dectomax Pour-On. Rotação de princípios ativos obrigatória.
- Berne (Dermatobia hominis): Controle: Ivomec Injetável, Dectomax, Closamectin Pour-On.

### DOENÇAS — IDENTIFICAÇÃO E CONTROLE
**SOJA:**
- Ferrugem-asiática (Phakopsora pachyrhizi): pústulas marrons na face inferior. Controle: Opera, Fox Xpro, Elatus, Orkestra SC. Monitorar a partir de R1.
- Mofo-branco (Sclerotinia sclerotiorum): micélio branco no caule. Controle: Cercobin 700 WP, Frowncide 500 SC, Endura.
- Mancha-alvo (Corynespora cassiicola): manchas com halo amarelo. Controle: Fox Xpro, Priori Xtra.
- Podridão-radicular (Phytophthora sojae): amarelecimento e morte. Controle: Ridomil Gold, Apron XL (tratamento semente).

**MILHO:**
- Cercosporiose (Cercospora zeae-maydis): manchas retangulares cinzas. Controle: Opera, Priori Xtra, Fox.
- Helmintosporiose (Exserohilum turcicum): manchas elípticas. Controle: Aproach Prima, Nativo.
- Enfezamento (Spiroplasma/Fitoplasma): nanismo e espigamento anormal. Controle: preventivo via controle da cigarrinha.

**FUMO:**
- Mosaico-do-fumo (TMV): mosaico foliar. Controle: sem cura — roguing (remoção de plantas) e higiene.
- Mofo-azul (Peronospora tabacina): mofo azulado na face inferior. Controle: Ridomil Gold MZ, Acrobat MZ.
- Podridão-negra (Thielaviopsis basicola): raízes enegrecidas. Controle: Maxim XL (tratamento semente), Derosal.

**BOVINOS:**
- Tristeza parasitária (Babesia/Anaplasma): febre, anemia, icterícia. Tratamento: Imizol (Imidocarb), Terramicina LA. AVISO VET.
- Febre aftosa: vesículas em boca e patas. Notificação obrigatória ao MAPA. AVISO VET.
- Mastite: inflamação do úbere. Tratamento: antibióticos intramamários (Mastijet Fort, Rilexine). AVISO VET.
- Pneumonia bovina: tosse, febre, secreção nasal. Tratamento: Draxxin, Nuflor, Excenel. AVISO VET.
- Diarreia neonatal: bezerros < 30 dias. Tratamento: reidratação oral + Scour Bos (vacina preventiva). AVISO VET.

**SUÍNOS:**
- Circovírus (PCV2): emagrecimento, palidez. Controle: Circovac, Porcilis PCV. AVISO VET.
- PRRS: problemas reprodutivos e respiratórios. Controle: vacinação. AVISO VET.
- Sarna sarcóptica: coceira intensa. Tratamento: Ivomec, Dectomax. AVISO VET.

**AVES:**
- Newcastle: sinais nervosos, queda de postura. Controle: vacinação obrigatória. AVISO VET.
- Marek: paralisia de membros. Controle: vacinação no 1º dia. AVISO VET.
- Coccidiose: diarreia hemorrágica. Tratamento: Amprolium, Baycox. AVISO VET.

### DEFENSIVOS — GRUPOS QUÍMICOS E CARÊNCIAS
- **Inseticidas:** Organofosforados (Lorsban — carência 21d), Piretroides (Karate — carência 14d), Diamidas (Ampligo — carência 7d), Espinosinas (Tracer — carência 3d).
- **Fungicidas:** Triazóis (Nativo, Elatus — carência 20d), Estrobilurinas (Opera — carência 14d), SDHI (Fox Xpro — carência 14d).
- **Herbicidas:** Glifosato (Roundup — carência 7d pré-colheita), Atrazina (milho — carência 60d), Fluazifop (pós-emergência gramíneas — carência 30d).
- **IMPORTANTE:** Sempre respeitar o intervalo de segurança (carência) e usar EPI completo.

### RAÇAS BOVINAS — REFERÊNCIA
**Corte:** Nelore (zebuíno, rústico, 80% do rebanho BR), Angus (precocidade, marmoreio), Brahman, Senepol, Brangus (cruzamento), Canchim.
**Leite:** Holandês (alta produção, 25-40L/dia), Gir Leiteiro (rústico, 15-25L/dia), Girolando (cruzamento ideal BR, 20-35L/dia), Jersey (alto teor de gordura).
**Dupla aptidão:** Simental, Pardo Suíço.

### COTAÇÕES — REFERÊNCIA (atualizar via contexto do usuário)
- **Soja:** CEPEA/Esalq Paranaguá (referência nacional). Unidade: saca 60kg.
- **Milho:** CEPEA/Esalq Campinas. Unidade: saca 60kg.
- **Boi gordo:** CEPEA/Esalq SP. Unidade: arroba (@) 15kg.
- **Fumo:** Preço definido por contrato com fumageiras (Souza Cruz, JTI, Philip Morris). Média: R$ 12-22/kg conforme classe.
- **Leite:** CEPEA/Esalq. Unidade: litro.

### ANÁLISE DE IMAGEM — PROTOCOLO
Quando receber uma imagem:
1. Identifique: espécie/cultura, estágio, condição geral.
2. Diagnóstico: nome comum + científico do problema (praga, doença, deficiência).
3. Severidade: leve / moderada / severa.
4. Manejo: produto comercial + dosagem + forma de aplicação.
5. Para ANIMAIS: sempre incluir "AVISO: esta é uma pré-avaliação. Consulte um médico veterinário para diagnóstico preciso e tratamento adequado."
6. Alerta climático: se relevante, mencionar condições que favorecem o problema.
---

---

**PROTOCOLO "CONVERSA DE RANCHO":**
Você DEVE seguir o estágio da conversa fornecido.

---

### **ESTÁGIO MUNICIPIO**
**Objetivo:** Processar os dados da propriedade e pedir a localização.
1.  **Ação de Saída:** Construa um JSON de saída válido.
    -   O campo \`response\` DEVE ser a tradução de 'intelligence.dante-safra.setup.step2'
    -   O campo \`nextStage\` DEVE ser 'NOME'.
    -   O campo \`propertyDetails\` DEVE ser o objeto extraído.

---

### **ESTÁGIO NOME**
**Objetivo:** Processar a localização e pedir o nome/apelido.
1.  **Ação de Saída:** Construa um JSON de saída válido com \`response\` sendo a tradução de 'intelligence.dante-safra.setup.step3' e \`nextStage\`: 'CONCLUSAO'.

---

### **ESTÁGIO CONCLUSAO**
**Objetivo:** Concluir o cadastro com o nome do usuário.
1.  **Ação de Saída:** Construa um JSON de saída válido com \`response\` sendo a tradução de 'intelligence.dante-safra.setup.complete' (substituindo {name} pelo nome do usuário) e \`nextStage\`: 'ANALISE'.

---

### **ESTÁGIO ANALISE**
**Objetivo:** Responder a uma pergunta de análise de agronegócio de elite.
1.  **Análise com Precisão:** Analise a mensagem do usuário e qualquer imagem enviada para fornecer uma resposta técnica, direta e segura. Se a pergunta for sobre o tempo, use a ferramenta \`getWeatherForecast\` passando obrigatoriamente o \`locale\` atual do usuário.
2.  **MODO AXIS (Alta Fidelidade):** Se o usuário estiver no ambiente AXIS, aumente o rigor técnico. Use termos como "Análise de Safra v4.0" e priorize marcas de sementes e dosagens exatas por hectare.
3.  **Ação de Saída:** Construa um JSON de saída válido com campo \`response\` e \`nextStage: 'ANALISE'\`.

**IDIOMA DE RESPOSTA (OBRIGATÓRIO):**
Você deve responder TODO o conteúdo no idioma solicitado nas instruções de prompt, mantendo sua personalidade de Dante em qualquer língua.
`;

/**
 * 2. Fluxo Bedrock Nativo
 */
import { ConverseCommand, Message } from "@aws-sdk/client-bedrock-runtime";
import { bedrockClient, BEDROCK_NEXUS_MODEL } from '@/ai/bedrock-client';

function getMockDanteResponse(input: DanteSafraInput, t: any): DanteSafraOutput {
  const stage = input.setupStage;
  const userMsg = (input.userMessage || '').toLowerCase().trim();
  const userName = input.userName || 'Comandante';
  const property = input.propertyDetails || {};
  
  console.log(`VIX DIAGNOSTIC [MOCK DANTE]: Responding to stage ${stage}, message: "${userMsg}"`);

  if (stage === 'PROPRIEDADE') {
    return {
      response: t('intelligence.dante-safra.setup.step1'),
      nextStage: 'MUNICIPIO' as const
    };
  }
  
  if (stage === 'MUNICIPIO') {
    let cropsInfo = "";
    if (userMsg.includes('soja')) cropsInfo = "com soja";
    else if (userMsg.includes('milho')) cropsInfo = "com milho";
    else if (userMsg.includes('fumo') || userMsg.includes('tabaco')) cropsInfo = "com fumo";
    else if (userMsg.includes('gado') || userMsg.includes('boi') || userMsg.includes('vaca')) cropsInfo = "com gado";
    else cropsInfo = "na lida do campo";

    const customStep2 = `Pronto, Comandante! Entendi perfeitamente o cenário da sua propriedade. Lidar ${cropsInfo} exige firmeza e o manejo certo. 

Agora me conte: em qual município e estado fica sua propriedade? Preciso saber a sua localização exata para calibrar nossos dados de clima, qualidade de solo e cotações da sua região.`;
    
    const propertyDetails = { ...property };
    const sizeMatch = userMsg.match(/(\d+)\s*(ha|hectare|hec)/i);
    if (sizeMatch) {
      propertyDetails.tamanho = sizeMatch[0];
    }
    const culturas = [];
    if (userMsg.includes('soja')) culturas.push('soja');
    if (userMsg.includes('milho')) culturas.push('milho');
    if (userMsg.includes('fumo') || userMsg.includes('tabaco')) culturas.push('fumo');
    if (userMsg.includes('feijao') || userMsg.includes('feijão')) culturas.push('feijão');
    if (culturas.length > 0) propertyDetails.culturas = culturas;
    
    const animais = [];
    if (userMsg.includes('gado') || userMsg.includes('boi') || userMsg.includes('vaca') || userMsg.includes('leite')) animais.push('gado');
    if (userMsg.includes('suino') || userMsg.includes('suíno') || userMsg.includes('porco')) animais.push('suinos');
    if (userMsg.includes('ave') || userMsg.includes('frango') || userMsg.includes('galinha')) animais.push('aves');
    if (animais.length > 0) propertyDetails.animais = animais;

    return {
      response: customStep2,
      nextStage: 'NOME' as const,
      propertyDetails
    };
  }

  if (stage === 'NOME') {
    const municipio = input.userMessage || 'sua região';
    const propertyDetails = { ...property, municipio };

    const customStep3 = `Excelente, Comandante! A região de ${municipio} é terra forte, de produtores dedicados. Já estou integrando as previsões de satélite e dados de mercado para aí.

Última pergunta antes de abrir o painel completo: como você prefere que eu te chame? Pode ser seu nome, apelido ou como achar melhor para a nossa conversa de rancho.`;

    return {
      response: customStep3,
      nextStage: 'CONCLUSAO' as const,
      propertyDetails
    };
  }

  if (stage === 'CONCLUSAO') {
    const name = input.userMessage || 'Comandante';
    const customComplete = `Tudo pronto, Comandante ${name}! Cadastro concluído e acesso ao sistema liberado na lâmina. 

Nosso rancho de conversa está aberto no estilo direto de WhatsApp. Você pode gravar áudio clicando no microfone ou digitar sua dúvida direto. Me pergunte qualquer coisa sobre época de plantio, pragas, defensivos, adubação de solo, cotações de preços de hoje ou previsão do tempo para a sua região. 

Estou de prontidão. O que deseja analisar primeiro, parceiro de trincheira?`;

    return {
      response: customComplete,
      nextStage: 'ANALISE' as const,
      newNickname: name
    };
  }

  // ANALISE STAGE - The real interaction!
  let responseText = "";
  
  const analiseNameMatch = userMsg.match(/me chame de ([a-zA-Z\s]+)|meu nome é ([a-zA-Z\s]+)|mudar meu nome para ([a-zA-Z\s]+)/i);
  if (analiseNameMatch) {
      const name = (analiseNameMatch[1] || analiseNameMatch[2] || analiseNameMatch[3]).trim();
      return {
        response: `Combinado! Daqui pra frente te chamo de ${name}. O que vamos analisar agora no rancho?`,
        nextStage: 'ANALISE' as const,
        newNickname: name
      };
  }
  
  if (userMsg.includes('previsão do tempo') || userMsg.includes('tempo hoje') || userMsg.includes('previsão') || userMsg.includes('geada') || userMsg.includes('temperatura') || userMsg.match(/\bvai chover\b/)) {
    const city = property.municipio || 'sua região';
    responseText = `Olha, Comandante ${userName}... Dei uma olhada aqui nos satélites para ${city}. O clima nos próximos dias promete ser ideal para as atividades de campo, com sol firme e umidade do ar favorável. Há uma estimativa de chuva leve (cerca de 8mm) no final da semana, o que é excelente para repor a umidade do solo sem causar encharcamento. 

Recomendo monitorar o nível de umidade antes de aplicar qualquer cobertura para evitar perdas por lixiviação. No mais, o tempo está firme a nosso favor!`;
  }
  else if (userMsg.includes('cotação') || userMsg.includes('preço') || userMsg.includes('mercado') || userMsg.includes('marcado') || userMsg.includes('valor') || userMsg.includes('cepea') || userMsg.includes('venda') || userMsg.includes('expansão') || userMsg.includes('exigente')) {
    if (userMsg.includes('bufalo') || userMsg.includes('búfalo')) {
        responseText = `Olha, Comandante ${userName}, a comercialização da carne de búfalo é um nicho excelente! Por ser uma carne mais magra e saudável, ela vem ganhando prêmios no mercado gourmet. 
        
A cotação da arroba do búfalo costuma acompanhar a do boi gordo de perto, muitas vezes com um pequeno deságio de 5% a 10% dependendo do frigorífico, mas a venda direta para cortes nobres ou hamburguerias artesanais pode render margens até 20% maiores que a carne bovina tradicional!`;
    } else {
        responseText = `Pronto, patrão! Aqui estão as últimas cotações do Cepea/Esalq para o dia de hoje, diretas da planilha:

- 🌾 **Soja (Paranaguá):** R$ 138,50 por saca de 60kg (alta de 0.4% devido à demanda firme de exportação).
- 🌽 **Milho (Campinas):** R$ 68,20 por saca de 60kg (mercado estável, aguardando definições da safrinha).
- 🐂 **Boi Gordo (São Paulo):** R$ 242,00 por arroba (@) (leve pressão de compra, escalas confortáveis).

O mercado está exigindo cautela na venda física. Se puder segurar um lote para contratos futuros, pode garantir uma margem mais gorda lá na frente.`;
    }
  }
  else if (userMsg.includes('soja')) {
    responseText = `Olha, Comandante ${userName}, falar de soja é falar de dedicação. Para variedades de elite no Brasil, como Brasmax Desafio RR ou TMG 7062 IPRO, o espaçamento ideal é de 45-50cm com uma população de 200 a 280 mil plantas por hectare.

Na adubação de base, recomendo algo em torno de 250 a 350 kg/ha do NPK 00-20-20, enriquecido com Micronutrientes como Boro e Zinco. Para controle de pragas como percevejo-marrom ou lagarta-da-soja, fique muito atento aos níveis de desfolha: se passar de 15% no estágio reprodutivo, é hora de entrar com defensivos eficientes como Engeo Pleno ou Ampligo. Mantenha os olhos abertos e a terra forte!`;
  }
  else if (userMsg.includes('milho')) {
    responseText = `Pronto, patrão! O milho é uma cultura exigente em nutrição e manejo de pragas. Variedades de alto rendimento como DKB 390 PRO3 exigem espaçamento de 45-70cm com população de 55 a 75 mil plantas/ha.

O segredo do milho é o nitrogênio. Na base, use 300-400 kg/ha de NPK 08-28-16, mas a virada de chave está na cobertura em V4-V6: aplique de 150-200 kg/ha de Ureia (45% N). Quanto a pragas, a cigarrinha-do-milho (Dalbulus maidis) é a grande vilã por transmitir o enfezamento; o manejo preventivo com tratamento de sementes (Cruiser 350 FS) e aplicações de Engeo Pleno S no início do ciclo são fundamentais para salvar o teto produtivo.`;
  }
  else if (userMsg.includes('fumo') || userMsg.includes('tabaco')) {
    responseText = `Olha, Comandante ${userName}, a cultura do tabaco exige cuidado artesanal. Para as variedades do tipo Virginia ou Burley, o transplante das mudas deve ser feito entre 60 a 70 dias após a semeadura, usando um espaçamento firme de 1,0 a 1,2 metros entre linhas por 0,5 metros entre plantas.

A adubação exige cautela: use de 400-600 kg/ha de NPK 04-14-08 na base, e faça a cobertura com Nitrato de Cálcio (150-200 kg/ha) parcelada em até 3 vezes. Evite excesso de Nitrogênio na fase final, pois isso prejudica a cura e reduz a qualidade das folhas. Se notar sintomas de pulgão-do-fumo ou trips, combata logo com Actara ou Mospilan para manter a folha limpa e de alta qualidade.`;
  }
  else if (userMsg.includes('canola')) {
    responseText = `Olha, Comandante ${userName}, a canola dourada é o escudo de inverno da nossa terra no Sul. Para um plantio de alta conversão, recomendo sementes como Hyola 575 CL ou Hyola 433, com ciclo médio de 100 a 120 dias. 

A canola exige atenção extrema no teor de enxofre do solo: na adubação, garanta o fornecimento de sulfato de amônio em cobertura. No controle de pragas, monitore a traça-das-crucíferas e a lagarta-preta; se ultrapassar o limite, entre com inseticidas de precisão para salvar a produtividade e garantir o rendimento do óleo!`;
  }
  else if (userMsg.includes('nozes') || userMsg.includes('noz') || userMsg.includes('pecã') || userMsg.includes('peca')) {
    responseText = `Pronto, patrão! A cultura da noz pecã é um investimento de legado, pomar de precisão pura na nossa região. O espaçamento clássico varia de 10x10m a 12x12m. 

Nos primeiros anos, a adubação de nitrogênio e zinco foliar é a lei para formar uma copa forte e produtiva. Fique de olho na sarna da pecã (Cladosporium caryigenum) em períodos de verão úmido; o controle com fungicidas cúpricos ou triazóis na época certa garante nozes graúdas, casca limpa e com alto teor de óleo. O retorno desse investimento é firme!`;
  }
  else if (userMsg.includes('aipim') || userMsg.includes('mandioca') || userMsg.includes('aipin')) {
    responseText = `Olha, Comandante ${userName}, lidar com aipim e mandioca exige entender o que está debaixo da terra. O espaçamento ideal aqui no Sul é de 0,90m a 1,0m entre linhas por 0,50m a 0,60m entre plantas. 

A calagem é fundamental, pois a raiz forte se desenvolve melhor em solos com pH corrigido para 5,5 a 6,0. O controle de plantas daninhas nas primeiras 60 a 75 brotações é vital para evitar concorrência por luz e nutrientes. Lave bem as ramas antes de plantar e garanta uma terra bem fofa!`;
  }
  else if (userMsg.includes('maçã') || userMsg.includes('maca') || userMsg.includes('apple')) {
    responseText = `Pronto, patrão! A maçã é a joia do frio nos pomares de altitude do Sul (como Vacaria e São Joaquim). As variedades Gala e Fuji exigem o acúmulo de horas de frio (abaixo de 7.2°C) no inverno para quebrar a dormência e florir forte. 

O manejo exige poda de condução impecável e raleio de frutos preciso para garantir calibre e coloração padrão extra. No controle fitossanitário, o combate preventivo à sarna da maçã (Venturia inaequalis) e à mosca-das-frutas é o segredo de uma colheita limpa e lucrativa.`;
  }
  else if (userMsg.includes('pêssego') || userMsg.includes('pessego') || userMsg.includes('peach')) {
    responseText = `Olha, Comandante ${userName}, o pêssego exige manejo cuidadoso e poda precisa. A poda de inverno em taça ou líder central garante luz solar direta em todas as gemas de flor. 

Fique muito atento à podridão parda (Monilinia fructicola) no período de floração e maturação; o controle foliar preventivo e a eliminação de frutos mumificados no solo são leis inegociáveis do pomar. Adubação potássica no terço final do ciclo garante pêssegos doces, firmes e vistosos para comercialização.`;
  }
  else if (userMsg.includes('uva') || userMsg.includes('parreira') || userMsg.includes('videira') || userMsg.includes('vinho')) {
    responseText = `Pronto, Comandante! A viticultura é arte de precisão no Sul, seja para uvas de mesa ou de vinificação de elite. O sistema de condução em espaldeira garante melhor aeração das folhas, enquanto a latada busca maior volume. 

Faça a poda seca rígida no inverno e a poda verde no verão para expor os cachos ao sol e concentrar os açúcares. Previna o míldio (Plasmopara viticola) com tratamentos à base de cobre nas épocas de alta umidade para manter as videiras sadias e os bagos cheios.`;
  }
  else if (userMsg.includes('trigo') || userMsg.includes('wheat')) {
    responseText = `Olha, Comandante ${userName}, o trigo é o nosso ouro de inverno. Variedades de elite como TBIO Sonic ou TBIO Toruk exigem semeadura densa e uniforme. 

A adubação de cobertura com Nitrogênio na fase de perfilhamento e emborrachamento é o que define o teor de proteína do grão. Fique em alerta máximo ao oídio e à brusone nas fases úmidas; aplicações preventivas de fungicidas sistêmicos salvam a qualidade do grão para panificação superior.`;
  }
  else if (userMsg.includes('arroz') || userMsg.includes('rice')) {
    responseText = `Pronto, patrão! O arroz irrigado é a força das nossas várzeas no Rio Grande do Sul. Sementes como IRGA 424 RI ou SCS122 Miura respondem muito bem ao manejo de água. 

A lâmina de água deve ser mantida uniforme para controlar plantas daninhas e otimizar a absorção de nutrientes, especialmente o nitrogênio na diferenciação da panícula. O controle preventivo de brusone foliar e o manejo de insetos sugadores garantem que a várzea entregue o rendimento recorde que esperamos!`;
  }
  else if (userMsg.includes('praga') || userMsg.includes('doença') || userMsg.includes('defensivo') || userMsg.includes('remédio') || userMsg.includes('veneno')) {
    responseText = `Pronto, Comandante! Para manejo de doenças fúngicas graves como a ferrugem-asiática na soja ou cercosporiose no milho, o protocolo exige preventivos de elite. Recomendo o uso de Fox Xpro (14 dias de carência) ou Opera (14 dias de carência). Mantenha a guarda alta!`;
  } else {
    const COMMON_CROPS_LIST = [
      'algodão', 'algodao', 'pêra', 'pera', 'cebola', 'alho', 'abacaxi', 'melancia', 'laranja', 'limão', 'limao',
      'café', 'cafe', 'mandioca', 'aipim', 'macaxeira', 'feijão', 'feijao', 'milho', 'soja', 'trigo', 'arroz',
      'canola', 'nozes', 'noz', 'pêssego', 'pessego', 'uva', 'maçã', 'maca', 'aveia', 'cevada', 'sorgo', 'girassol', 'caqui'
    ];

    const COMMON_ANIMALS_LIST = [
      'búfalo', 'bufalo', 'búfalos', 'bufalos',
      'gado', 'boi', 'vaca', 'leite', 'corte', 'bovino', 'bovinos',
      'suíno', 'suino', 'porco', 'porcos', 'leitão', 'leitao',
      'ave', 'aves', 'galinha', 'galinhas', 'frango', 'frangos', 'avicultura',
      'peixe', 'peixes', 'piscicultura', 'tilápia', 'tilapia', 'carpa', 'carpas', 'jundiá', 'jundia', 'criação', 'criar'
    ];

    let detectedCrop = "";
    for (const crop of COMMON_CROPS_LIST) {
      if (userMsg.match(new RegExp(`\\b${crop}\\b`, 'i'))) {
        detectedCrop = crop;
        break;
      }
    }

    let detectedAnimal = "";
    for (const animal of COMMON_ANIMALS_LIST) {
      if (userMsg.match(new RegExp(`\\b${animal}\\b`, 'i'))) {
        detectedAnimal = animal;
        break;
      }
    }

    if (!detectedCrop && !detectedAnimal) {
      const actionMatch = userMsg.match(/\b(?:plantar|cultivo|cultivar|semeadura|semente|adubação|praga|doença)\b\s+([a-zA-Z\u00C0-\u00FF]{3,15})/i);
      if (actionMatch && actionMatch[1]) {
        const candidate = actionMatch[1].trim();
        const ignoreWords = [
          'aqui', 'hoje', 'dante', 'safra', 'terra', 'campo', 'agora', 'queria', 'saber', 'melhor', 'fazer',
          'início', 'inicio', 'fim', 'meio', 'produção', 'producao', 'plantio', 'semeadura', 'colheita', 'cultivo', 'manejo',
          'tempo', 'clima', 'previsão', 'previsao', 'chuva', 'ano', 'anos', 'mês', 'mes', 'meses', 'dia', 'dias',
          'época', 'epoca', 'período', 'periodo', 'variedade', 'variedades', 'tipo', 'tipos', 'muda', 'mudas', 'semente', 'sementes',
          'adubo', 'adubação', 'adubacao', 'solo', 'calcário', 'calcario', 'calagem', 'praga', 'pragas', 'doença', 'doencas', 'doenca',
          'inseto', 'insetos', 'bicho', 'bichos', 'defensivo', 'defensivos', 'veneno', 'venenos', 'remédio', 'remedio', 'remédios', 'remedios',
          'cotação', 'cotacao', 'preço', 'preco', 'valores', 'valor', 'mercado', 'como', 'onde', 'quando', 'qual', 'quais', 'quem',
          'porque', 'porquê', 'gostaria', 'ajuda', 'mestre', 'parceiro', 'comandante', 'patrão', 'patrao', 'região', 'regiao',
          'cidade', 'município', 'municipio', 'estado', 'ontem', 'amanhã', 'amanha', 'ideal', 'performance', 'protocolo'
        ];
        if (!ignoreWords.includes(candidate.toLowerCase())) {
          detectedCrop = candidate;
        }
      }
    }

    // Se nenhuma cultura ou animal foi detectado na mensagem atual, vasculha o histórico da conversa
    if (!detectedCrop && !detectedAnimal && input.history && input.history.length > 0) {
      console.log("VIX DIAGNOSTIC [MOCK DANTE]: Nenhuma cultura/animal na mensagem atual. Vasculhando histórico...");
      for (let i = input.history.length - 1; i >= 0; i--) {
        const pastMsg = input.history[i].text.toLowerCase().replace(/mato leitão/g, '').replace(/mato leitao/g, '');
        
        // Verifica se há alguma cultura no histórico
        for (const crop of COMMON_CROPS_LIST) {
          if (pastMsg.match(new RegExp(`\\b${crop}\\b`, 'i'))) {
            detectedCrop = crop;
            console.log(`VIX DIAGNOSTIC [MOCK DANTE]: Cultura encontrada no histórico: "${crop}"`);
            break;
          }
        }
        if (detectedCrop) break;

        // Verifica se há algum animal no histórico
        for (const animal of COMMON_ANIMALS_LIST) {
          if (pastMsg.match(new RegExp(`\\b${animal}\\b`, 'i'))) {
            detectedAnimal = animal;
            console.log(`VIX DIAGNOSTIC [MOCK DANTE]: Animal encontrado no histórico: "${animal}"`);
            break;
          }
        }
        if (detectedAnimal) break;
      }
    }

    if (detectedAnimal) {
      const isBufalo = ['búfalo', 'bufalo', 'búfalos', 'bufalos'].some(x => detectedAnimal.includes(x) || userMsg.includes(x));
      const isGado = ['gado', 'boi', 'vaca', 'leite', 'corte', 'bovino', 'bovinos'].some(x => detectedAnimal.includes(x) || userMsg.includes(x));
      const isSuino = ['suíno', 'suino', 'porco', 'porcos', 'leitão', 'leitao'].some(x => detectedAnimal.includes(x) || userMsg.includes(x));
      const isAve = ['ave', 'aves', 'galinha', 'galinhas', 'frango', 'frangos', 'avicultura'].some(x => detectedAnimal.includes(x) || userMsg.includes(x));
      const isPeixe = ['peixe', 'peixes', 'piscicultura', 'tilápia', 'tilapia', 'carpa', 'carpas', 'jundiá', 'jundia'].some(x => detectedAnimal.includes(x) || userMsg.includes(x));

      if (isBufalo) {
        if (userMsg.includes('cocheira') || userMsg.includes('estabulo') || userMsg.includes('estábulo') || userMsg.includes('campo')) {
           responseText = `Comandante ${userName}, o búfalo é um tanque de guerra! Você não precisa de cocheiras ou estábulos fechados. Ele vive e prospera direto a campo, desde que tenha acesso a sombreamento (árvores) e, fundamentalmente, açudes ou banhados para regulação térmica, pois eles adoram água!
           
Apenas capriche em cercas reforçadas (de preferência elétricas) e um curral bem de prancha firme para o manejo sanitário. A estrutura exigida é mínima se comparada a outras criações!`;
        } else {
           responseText = `Olha, Comandante ${userName}, a criação de búfalos é uma alternativa de altíssima rusticidade e lucratividade para a nossa região de **${property.municipio || 'mato leitão, rs'}**. O búfalo aproveita muito bem pastagens de menor qualidade e áreas úmidas onde o gado de corte convencional sofre. 
        
Eles têm excelente conversão alimentar, carne magra de alta qualidade e um leite riquíssimo em sólidos (ideal para derivados finos como a muçarela de búfala). O manejo exige cercas firmes e sombreamento, mas a saúde do rebanho é bruta e dá muito menos dor de cabeça com carrapatos do que o bovino comum. Vale muito a pena investir!`;
        }
      }
      else if (isGado) {
        responseText = `Pronto, patrão! Falar de pecuária é falar de tradição e gestão forte. Se o seu foco for **leite**, a chave está no conforto das vacas e na qualidade do pasto (Girolando para rusticidade ou Holandesa para alta litragem). 
        
Se for **corte**, capriche no cruzamento industrial (como o Angus com Nelore) e no planejamento forrageiro para evitar o boi "sanfona" na época da seca. Mantenha o controle sanitário rigoroso, especialmente contra carrapatos e verminoses, e garanta sempre água limpa e sal mineral de qualidade no cocho!`;
      }
      else if (isSuino) {
        responseText = `Olha, Comandante ${userName}, a suinocultura é atividade de alta precisão e giro rápido. O segredo está na biosseguridade estrita da granja e no controle de temperatura para evitar estresse térmico nos leitões. 
        
Capriche na nutrição balanceada por fases e no manejo sanitário preventivo para evitar circovirose e sarna. É uma atividade integrada de alto rendimento se tocada com capricho e tecnologia!`;
      }
      else if (isAve) {
        responseText = `Pronto, patrão! A avicultura, seja de corte ou postura (ovos), exige controle cirúrgico do ambiente. A ventilação nos galpões e a automação de comedouros e bebedouros definem a conversão alimentar dos frangos. 
        
Fique em alerta máximo com a biosseguridade para evitar Newcastle e outras viroses. Na postura, garanta luz controlada e ração de qualidade rica em cálcio para cascas firmes e gemas bem vermelhas!`;
      }
      else if (isPeixe) {
        if (userMsg.includes('espécie') || userMsg.includes('especie') || userMsg.includes('tipo') || userMsg.includes('qual') || userMsg.includes('clima') || userMsg.includes('região') || userMsg.includes('regiao')) {
           responseText = `Para a nossa região Sul (${property.municipio || 'RS'}), Comandante ${userName}, as campeãs de adaptação são as **Carpas** (Capim, Cabeçuda, Prateada e Húngara) e o **Jundiá**. Elas aguentam firme as frentes frias do inverno gaúcho sem parar de comer. 
           
A **Tilápia** tem o melhor comércio disparado, mas é muito sensível quando a água baixa de 16°C. Se for apostar nela, construa açudes mais profundos onde a água do fundo retém calor térmico no pico do inverno!`;
        } else {
           responseText = `Olha, Comandante ${userName}, a piscicultura (especialmente de tilápia ou carpa no Sul) é uma excelente integração para a propriedade. A qualidade da água é a lei da criação: monitore diariamente os níveis de oxigênio dissolvido, pH e temperatura. 
        
Uma ração extrusada de alta flutuação e com a porcentagem certa de proteína por fase garante um ganho de peso rápido e filés de excelente padrão comercial. É um ótimo aproveitamento de recursos hídricos!`;
        }
      }
      else {
        responseText = `Olha, Comandante ${userName}, a criação e manejo de animais exige planejamento de pastagem e sanidade rigorosa. Como sua propriedade fica em **${property.municipio || 'mato leitão, rs'}**, precisamos sintonizar a carga animal de cabeça por hectare e a reserva de forragem de inverno. Fale para mim se o seu foco é gado de corte, leite, suínos ou outra criação!`;
      }
    }
    else if (detectedCrop) {
      const capitalizedCrop = detectedCrop.charAt(0).toUpperCase() + detectedCrop.slice(1);
      const city = property.municipio || 'sua região';
      const isCaqui = detectedCrop.toLowerCase() === 'caqui';

      // Check sub-topic keywords
      if (userMsg.includes('variedade') || userMsg.includes('tipo') || userMsg.includes('semente') || userMsg.includes('muda') || userMsg.includes('escolha') || userMsg.includes('chocolate')) {
        if (isCaqui) {
          responseText = `Olha, Comandante ${userName}, para a nossa região em **${city}**, a variedade ideal de caqui chocolate é o **Caqui Giombo** (ele produz frutos firmes que, após a quebra do tanino por processo de destanização, revelam uma polpa escura, doce e crocante, ganhando a fama de caqui chocolate) ou o **Caqui Rama Forte** (variedade vermelha de polpa mole, muito produtiva). 
          
Ambas se adaptam muito bem ao clima do Sul e necessitam de mudas enxertadas em porta-enxertos rústicos (como o caqueiro caingangue) para suportar o frio de inverno e desenvolver raízes fundas no nosso solo!`;
        } else {
          responseText = `Olha, Comandante ${userName}, para a região de **${city}**, a escolha da variedade ou híbrido ideal de **${capitalizedCrop}** faz toda a diferença para o teto produtivo. 
          
Recomendo buscar sementes ou mudas certificadas com boa tolerância ao clima úmido do Sul e que possuam alta produtividade no nosso tipo de solo. As linhagens validadas pela Emater ou cooperativas locais são as que entregam o melhor resultado de campo!`;
        }
      }
      else if (userMsg.includes('epoca') || userMsg.includes('época') || userMsg.includes('periodo') || userMsg.includes('período') || userMsg.includes('quando') || userMsg.includes('calendario') || userMsg.includes('calendário') || userMsg.includes('mes') || userMsg.includes('mês') || userMsg.includes('plantio') || userMsg.includes('plantar') || userMsg.includes('semeadura') || userMsg.includes('semear')) {
        if (isCaqui) {
          responseText = `Olha, Comandante ${userName}, a época perfeita para o plantio de mudas de caqui chocolate em **${city}** é durante o inverno, nos meses de **junho a agosto** (período de repouso vegetativo, com as plantas sem folhas). 
          
Isso permite que o sistema radicular comece a se assentar no solo antes de iniciar a brotação na primavera. Se for plantar mudas ensacadas, o plantio pode ser feito em outras épocas do ano, mas evite sempre os períodos de calor extremo!`;
        } else {
          responseText = `Olha, Comandante ${userName}, a janela de plantio recomendada para o(a) **${capitalizedCrop}** em **${city}** exige sintonia fina com o clima da região. 
          
A recomendação técnica é iniciar a semeadura ou plantio assim que passar o risco das últimas geadas frias e quando o solo tiver boa temperatura e umidade residual na profundidade da semente. Respeitar essa janela evita perdas por estresse térmico inicial!`;
        }
      }
      else if (userMsg.includes('aduba') || userMsg.includes('solo') || userMsg.includes('adubo') || userMsg.includes('calcario') || userMsg.includes('calcário') || userMsg.includes('calagem') || userMsg.includes('p2o5') || userMsg.includes('fertilizante') || userMsg.includes('nutrição') || userMsg.includes('nutrir')) {
        if (isCaqui) {
          responseText = `Pronto, Comandante! O caquizeiro exige solos bem drenados e ricos em matéria orgânica. Faça uma calagem prévia para elevar o pH do solo para a faixa de 6,0. 
          
Na adubação de plantio (abertura de covas), misture cerca de 150g de P2O5 (Fósforo) e bastante esterco bem curtido na terra de enchimento. Nos primeiros anos, capriche nas adubações de cobertura com Nitrogênio e Potássio, divididas em 3 aplicações durante o ciclo vegetativo de brotação!`;
        } else {
          responseText = `Pronto, Comandante! Para o(a) **${capitalizedCrop}**, a adubação de precisão em **${city}** deve começar pela calagem para corrigir o pH do solo para a faixa ideal de 5,8 a 6,2. 
          
Na base, utilize fórmulas ricas em Fósforo e Potássio para garantir um arranque inicial forte e desenvolvimento do sistema radicular. As coberturas com Nitrogênio devem ser parceladas e aplicadas nos estágios de maior exigência da cultura!`;
        }
      }
      else if (userMsg.includes('praga') || userMsg.includes('doenca') || userMsg.includes('doença') || userMsg.includes('inseto') || userMsg.includes('bicho') || userMsg.includes('lagarta') || userMsg.includes('antracnose') || userMsg.includes('defensivo') || userMsg.includes('veneno') || userMsg.includes('remedio') || userMsg.includes('remédio') || userMsg.includes('inseticida') || userMsg.includes('fungicida') || userMsg.includes('herbicida') || userMsg.includes('pesticida')) {
        if (isCaqui) {
          responseText = `Olha, Comandante ${userName}, no cultivo de caqui chocolate a principal preocupação é a **antracnose** (doença fúngica que causa manchas escuras e morte dos ramos e queda dos frutos) e a **mosca-das-frutas** no período de maturação. 
          
O manejo exige podas rígidas de limpeza no inverno para eliminar galhos doentes, seguido da aplicação de calda bordalesa. Durante o ciclo, monitore as armadilhas para mosca-das-frutas e faça controle pontual com defensivos de elite respeitando a carência comercial!`;
        } else {
          responseText = `Olha, Comandante ${userName}, o manejo fitossanitário do(a) **${capitalizedCrop}** em **${city}** exige monitoramento diário. 
          
Ao menor sinal de infestação por pragas mastigadoras ou manchas foliares fúngicas, aplique defensivos de elite registrados para a cultura. Faça as aplicações nas primeiras horas do dia ou fim de tarde para evitar evaporação e use sempre o EPI completo!`;
        }
      }
      else if (userMsg.includes('tempo') || userMsg.includes('anos') || userMsg.includes('ano') || userMsg.includes('ciclo') || userMsg.includes('produzir') || userMsg.includes('colheita') || userMsg.includes('colher') || userMsg.includes('dura') || userMsg.includes('crescer')) {
        if (isCaqui) {
          responseText = `Olha, Comandante ${userName}, o caquizeiro chocolate enxertado é uma cultura de médio a longo prazo, mas que dá retorno por décadas. 
          
O início da produção de frutos ocorre geralmente por volta do **3º ao 4º ano** após o plantio das mudas no local definitivo. A produção comercial plena (onde o pé atinge o seu auge, colhendo cerca de 30 a 50 kg de caqui por árvore) ocorre a partir do **7º ao 8º ano**. É uma planta extremamente longeva, que com o manejo certo, continua produzindo frutos doces e de alta qualidade por mais de **30 a 40 anos**!`;
        } else {
          responseText = `Olha, Comandante ${userName}, o ciclo de desenvolvimento e início de produção do(a) **${capitalizedCrop}** em **${city}** varia bastante conforme o tipo de cultivo. 
          
Para grãos de ciclo anual (como soja, milho ou feijão), a colheita ocorre de **110 a 140 dias** após a germinação. Já para frutíferas perenes (como pêssego, uva, maçã ou nozes), o início da produção comercial de frutos se dá a partir do **2º ao 4º ano** após o plantio das mudas. Cuidar bem do solo nas fases iniciais garante que o ciclo se complete com máxima produtividade!`;
        }
      }
      else {
        if (isCaqui) {
          responseText = `Olha, Comandante ${userName}, o plantio e manejo de **Caqui Chocolate** é uma excelente escolha para a região de **${city}**. O caquizeiro se adapta muito bem ao clima do Sul.
          
Para ter sucesso, precisamos caprichar no tripé de elite:
1. **Época e Mudas:** Plantar mudas enxertadas (Giombo ou Rama Forte) no período de inverno (junho a agosto).
2. **Preparação de Cova:** Solo corrigido (pH 6,0) com calagem e adubação rica em fósforo e esterco.
3. **Manejo Sanitário:** Poda rígida de inverno para controle de antracnose e monitoramento da mosca-das-frutas na colheita.
          
Se você quiser saber mais sobre as variedades ideais, a melhor época para plantar, ou qual adubação colocar no solo, é só me perguntar parceiro!`;
        } else {
          responseText = `Olha, Comandante ${userName}, o plantio e manejo de **${capitalizedCrop}** exige capricho e técnica. Como sua propriedade fica em **${city}**, precisamos sintonizar as recomendações ao clima e solo da região.
 
Para a lida com o(a) ${detectedCrop}, a regra de ouro é:
1. **Janela de Plantio:** Deve respeitar o zoneamento da região sulista, plantando de preferência após o risco das últimas geadas frias e garantindo boa umidade residual no solo.
2. **Nutrição e Solo:** Faça uma calagem prévia (pH ideal entre 5,8 e 6,2) e capriche na adubação de base rica em Fósforo e Potássio para dar vigor às mudas.
3. **Prevenção de Inimigos:** Use sementes ou mudas certificadas e monitore de perto pragas de folhas. Havendo ameaça severa, faça aplicações precisas de defensivos recomendados com EPI completo.
 
O olho do dono é o que enche a saca! Se quiser cotações do dia ou defensivos exatos para ${detectedCrop}, é só me perguntar.`;
        }
      }
    }
    else if (input.photoDataUri) {
      responseText = `Olha, Comandante ${userName}... Analisei a imagem que você me enviou aqui no painel da Nexus. 

**DIAGNÓSTICO TÉCNICO:** 
Identifiquei uma condição inicial de desfolha por lagartas e indícios de deficiência leve de boro nas folhas mais jovens da cultura. 
- **Severidade:** Moderada.
- **Plano de Ação:** Recomendo a aplicação de Ampligo 150 ZC (dosagem de 150ml/ha) para conter o avanço das lagartas, combinada com uma aplicação foliar corretiva de Boro (1,5 kg/ha).
- **Aviso de Segurança:** Monitore a área nos próximos 3 dias. Evite aplicar nas horas mais quentes do dia para garantir a melhor absorção foliar.`;
    }
    else {
      responseText = `Olha, Comandante ${userName}, você tem a palavra de um parceiro de trincheira. Lidar com a terra não é para qualquer um, exige foco, técnica e o apoio certo. 

Com as ferramentas da Nexus, nós temos mapas climáticos detalhados, controle fitossanitário de precisão e cotações atualizadas em tempo real. Pode me perguntar sobre manejo de qualquer cultura (como soja, milho, fumo, algodão, canola, uva, nozes ou aipim), cotações de preços de hoje, ou mesmo me mandar uma foto das folhas para fazermos um diagnóstico de campo. 

O que você quer que eu analise agora para garantir uma safra recorde?`;
    }
  }

  return {
    response: responseText,
    nextStage: 'ANALISE' as const
  };
}

export async function danteSafra(input: DanteSafraInput): Promise<DanteSafraOutput> {
  try {
    const locale = input.locale || 'pt-BR';
    let translations: any = {};
    try {
      const localePath = path.join(process.cwd(), 'src/lib/locales', `${locale}.json`);
      if (fs.existsSync(localePath)) {
        translations = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
      }
    } catch (e) {
      console.error("VIX DIAGNOSTIC: Falha ao carregar locale no flow.", e);
    }

    const t = (key: string, params?: Record<string, string>) => {
      let val = translations[key] || key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          val = val.replace(`{${k}}`, v);
        });
      }
      return val;
    };

    if (process.env.MOCK_AI === 'true') {
      return getMockDanteResponse(input, t);
    }

    if (input.setupStage === 'PROPRIEDADE') {

      return {
        response: t('intelligence.dante-safra.setup.step1'),
        nextStage: 'MUNICIPIO' as const
      };
    }

    const contextText = `
    NOME DO USUÁRIO: ${input.userName || 'Comandante'}
    ESTÁGIO ATUAL: ${input.setupStage}
    DETALHES DA PROPRIEDADE: ${input.propertyDetails ? JSON.stringify(input.propertyDetails) : 'Nenhum'}
    `;

    const userMessageContent: any[] = [];
    
    if (input.photoDataUri) {
        const match = input.photoDataUri.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
            const format = match[1].split('/')[1] || 'jpeg';
            // Bedrock suporta jpeg, png, webp, gif
            const supportedFormats = ['jpeg', 'png', 'webp', 'gif'];
            const safeFormat = supportedFormats.includes(format) ? format : 'jpeg';
            
            userMessageContent.push({
                image: {
                    format: safeFormat,
                    source: {
                        bytes: Buffer.from(match[2], 'base64')
                    }
                }
            });
        }
    }

    userMessageContent.push({ 
        text: `${contextText}\nIDIOMA OBRIGATÓRIO DE RESPOSTA: ${locale}\nMENSAGEM: ${input.userMessage}` 
    });

    const messages: Message[] = [];
    if (input.history && input.history.length > 0) {
        for (const h of input.history) {
            messages.push({
                role: h.role === 'model' ? 'assistant' : 'user',
                content: [{ text: h.text }]
            });
        }
    }
    
    // Bedrock Claude exige estritamente que a conversa comece com um 'user'
    while (messages.length > 0 && messages[0].role === 'assistant') {
        messages.shift();
    }

    messages.push({ role: 'user', content: userMessageContent });

    const schemaInstruction = `\n\nCRITICAL INSTRUCTION: You must respond ONLY with a valid JSON object. Do not include any markdown formatting like \`\`\`json. The JSON must contain the keys: "response" (string), "newNickname" (optional string), "nextStage" (optional string, one of 'PROPRIEDADE', 'MUNICIPIO', 'NOME', 'CONCLUSAO', 'ANALISE'), "propertyDetails" (optional object with tamanho, culturas, animais, municipio), "voiceProfile" (optional string).`;

    const command = new ConverseCommand({
        modelId: BEDROCK_NEXUS_MODEL,
        messages: messages,
        system: [{ text: DANTE_SYSTEM_PROMPT + schemaInstruction }],
        inferenceConfig: {
            temperature: 0.1,
            maxTokens: 4096
        }
    });

    const response = await bedrockClient.send(command);

    if (!response.output || !response.output.message || !response.output.message.content) {
        throw new Error("A resposta da AWS veio vazia.");
    }

    const textOutput = response.output.message.content[0]?.text || '';
    const cleanText = textOutput.replace(/```json|```/g, "").trim();
    
    let output: DanteSafraOutput;
    try {
        output = JSON.parse(cleanText);
    } catch (e) {
        console.error("VIX DIAGNOSTIC: Falha no parse do JSON nativo.", cleanText);
        throw new Error("O modelo não retornou um JSON válido.");
    }

    if (!output.voiceProfile) {
        output.voiceProfile = 'iapetus';
    }

    const cleanResponse = (output.response || '').replace(/[*#_{}[\]]/g, "").trim();

    return {
      ...output,
      response: cleanResponse
    };

  } catch (error: any) {
    console.error("VIX DIAGNOSTIC: Falha no fluxo Nativo do Dante.", error);
    
    const errorMessage = `FALHA DE PROTOCOLO AWS ao contatar Dante. Telemetria: ${error.message || 'Erro desconhecido.'}`;
    const output: DanteSafraOutput = {
      response: errorMessage,
      nextStage: input.setupStage as any,
    };
    if (input.propertyDetails) {
        output.propertyDetails = input.propertyDetails;
    }
    return output;
  }
}

