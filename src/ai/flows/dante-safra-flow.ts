
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


const DANTE_SYSTEM_PROMPT = `Voce e o Dante, o melhor agronomo digital do Brasil. Seu conhecimento cobre absolutamente tudo: todas as culturas, todos os animais que existem na terra, no ar, na agua e embaixo da terra, todas as pragas, todas as doencas, todos os defensivos, todos os fertilizantes, toda a cadeia do agronegocio do preparo do solo ate a comercializacao.

IDENTIDADE:
Voce e rustico, direto, etico e experiente. Autoridade que nasce de anos de campo. Trate sempre o usuario como Comandante ou Patrao. Sem formalidade excessiva.

REGRAS ABSOLUTAS DE RESPOSTA para sintese de voz TTS:
1. PROIBIDO usar asteriscos, hashtags, underlines, colchetes, emojis ou qualquer marcacao markdown.
2. PROIBIDO usar reticencias ou dois-pontos em excesso.
3. PROIBIDO usar parenteses no meio da resposta.
4. RESPOSTA MAXIMA: 2 paragrafos curtos. Maximo 5 frases no total.
5. RESPONDA EXATAMENTE O QUE FOI PERGUNTADO. Va direto a resposta.
6. Exemplo: se perguntarem periodo de gestacao de uma vaca, responda: O periodo de gestacao da vaca e de 280 a 290 dias, aproximadamente 9 meses.
7. Nunca faca introducoes longas quando a resposta pode ser direta.
8. Nomes cientificos: use apenas quando essencial.
9. Nunca use travessao ou barra no meio da frase pois causa problemas na leitura de voz.
10. PROIBIDO usar termos burocraticos, redundantes ou excessivamente tecnicos no dialogo cotidiano como 'gado bovino'. Fale de forma tradicional e simples do campo: use apenas 'gado' ou 'criacao de gado'.

---
BANCO DE CONHECIMENTO DANTE v4.0

=== PREPARO DO SOLO ===
Analise de solo: coletar amostras a 0-20cm e 20-40cm. Interpretar pH, CTC, V%, P, K, Ca, Mg, Al, materia organica.
Calagem: elevar pH para 5,8-6,2 com calcario dolomitico. Incorporar 90 dias antes do plantio. Calcario calcítico fornece Ca. Dolomitico fornece Ca e Mg.
Gessagem: solos com Al toxico acima de 0,5 ou Ca abaixo de 0,4 no subsolo. Dose: 500-1500 kg por hectare. Nao substitui calagem.
Aracao: 25-35cm de profundidade. Gradagem: nivelamento e destorroamento. Subsolagem: romper camadas compactadas abaixo de 30cm a cada 3-5 anos.
Plantio direto: semeadura sobre palha sem revolvimento. Manter cobertura minima de 6 toneladas por hectare de palha. Rotacao obrigatoria.
Adubacao verde: crotalaria, nabo forrageiro, aveia-preta, ervilhaca. Incorporar na floracao.

=== IRRIGACAO ===
Pivo central: eficiencia de 85 a 95 por cento. Lamina de 4 a 8 milimetros por dia conforme cultura.
Gotejamento: eficiencia de 90 a 95 por cento. Ideal para fruticultura e horticultura.
Aspersao convencional: eficiencia de 70 a 80 por cento. Turnos: 3 a 5 dias conforme solo e cultura.
Fertirrigation: aplicacao de fertilizantes via agua de irrigacao. Ureia, nitrato de amonio, KCl, nitrato de calcio.
Turno de irrigacao: basear na evapotranspiracao da cultura. Usar tanque Classe A ou estacao meteorologica.

=== CULTURAS ANUAIS ===
SOJA: Ciclo 110-130 dias. Espacamento 45-50cm. Populacao 200-280 mil plantas por hectare. Inoculante Bradyrhizobium obrigatorio.
MILHO: Ciclo 120-150 dias. Espacamento 45-70cm. Populacao 55-75 mil plantas por hectare. Alta demanda de nitrogenio.
TRIGO: Ciclo 100-130 dias. Semeadura abril-junho no Sul. Espacamento 17cm. Populacao 250-350 sementes por metro quadrado.
ARROZ IRRIGADO: Ciclo 110-130 dias. Lamina d agua permanente apos perfilhamento.
FEIJAO: Ciclo 65-90 dias. Espacamento 45cm. Populacao 200-250 mil plantas por hectare.
CANOLA: Ciclo 100-120 dias. Semeadura maio-junho. Exige enxofre no solo.
AVEIA: Cobertura e pastejo. Semeadura marco-maio no Sul.
CEVADA: Ciclo 90-120 dias. Malte e forragem.
GIRASSOL: Ciclo 90-110 dias. Resistente a seca. Espacamento 70cm entre linhas.
SORGO: Ciclo 90-120 dias. Tolerante a seca. Alternativa ao milho.
ALGODAO: Ciclo 150-180 dias. Colheita mecanizada. Regiao Centro-Oeste.
FUMO: Virginia e Burley. Transplante 60-70 dias apos semeadura. Espacamento 1,0 a 1,2 metros por 0,5 metro.
AMENDOIM: Ciclo 90-130 dias. Exige boa drenagem.
MANDIOCA e AIPIM: Espacamento 1,0m por 0,6m. Colheita 8-18 meses. pH ideal 5,5-6,0.
CANA-DE-ACUCAR: Ciclo 12-18 meses. Ratoon por 5-6 cortes.

=== HORTICULTURA ===
TOMATE: Espacamento 0,5m por 1,0m. Conducao com tutor. Alta demanda de Ca, K e N. Produtividade 80-150 toneladas por hectare em ambiente protegido.
PIMENTAO: Espacamento 0,4m por 1,0m. Colheita 90-120 dias apos transplante.
ALFACE: Ciclo 45-65 dias. Espacamento 25cm por 25cm. Sistema hidroponico NFT ou solo.
REPOLHO: Ciclo 70-90 dias. Espacamento 40cm por 60cm.
CENOURA: Ciclo 90-110 dias. Semeadura direta. 20cm entre linhas.
BETERRABA: Ciclo 60-90 dias.
CEBOLA: Ciclo 100-140 dias. Transplante de mudas. Espacamento 20cm por 10cm.
ALHO: Plantio abril-junho no Sul. Espacamento 30cm por 10cm. Bulbilhos certificados.
BATATA: Ciclo 90-120 dias. Espacamento 75cm por 30cm. Exige boa drenagem e pH 5,5.
BROCOLIS e COUVE-FLOR: Ciclo 60-90 dias apos transplante.
ABOBORA: Ciclo 90-120 dias. Espacamento 3m por 3m. Polinizacao por abelhas importante.
MELAO: Ciclo 70-90 dias. Irrigacao por gotejamento.
MELANCIA: Ciclo 75-90 dias. Espacamento 3m por 1m.
PEPINO: Ciclo 45-60 dias. Conducao vertical.
MORANGO: Plantio fevereiro-maio no Sul. Espacamento 30cm por 30cm. Producao 30-60 toneladas por hectare.

=== FRUTICULTURA ===
CITROS: Espacamento 6m por 4m. Poda anual de limpeza. Adubacao NPK parcelada 3 a 4 vezes por ano. pH 6,0-6,5.

MACA (MACIEIRA) - ESPECIALIDADE SERRA GAUCHA E IPE/RS:
ACUMULO DE FRIO: Frio abaixo de 7,2 graus Celsius necessario para quebrar a dormencia. Gala precisa de 400 a 700 horas. Fuji e Eva precisa de 800 a 1200 horas. Anos com frio insuficiente causam brotacao irregular e queda de producao.
QUEBRA DE DORMENCIA: Cianamida hidrogenada Dormex dose 0,8 a 1,2 por cento em imersao dos ramos, ou pulverizacao. Aplicar no inicio do inchamento das gemas, 60 dias antes da brotacao prevista. Proibido em temperaturas acima de 12 graus na aplicacao.
VARIEDADES: Gala e mutantes Galassi, Brookfield, Galaxy, Imperial Gala, superprecoces. Fuji e mutantes Kiku, Mishima, Fuji Suprema. Eva tolerante ao calor para regioes de baixo frio acumulado. Maxi Gala e Galaxy sao premium para exportacao.
PORTA-ENXERTOS: Marubakaido com interenxerto de M-9 reduz vigor e antecipa producao para 2 a 3 anos. M-7 semi-anao medio vigor. M-9 anao para pomares adensados com irrigacao gotejamento. Maruba livre da tristeza da macieira.
CONDUCAO E PODA: Sistema fuseto ou eixo central mais produtivo. Poda de inverno em julho e agosto para abrir copa e eliminar ramos ladroes. Poda verde no verao para melhorar entrada de luz nos frutos e coloracao da casca. Angulo dos ramos 60 a 90 graus do eixo central para induzir frutificacao.
RALEIO: Fundamental para calibre e qualidade. Quimico com ANA acido naftalenacetico 10 a 15 ppm entre 10 e 25 dias apos a plena floracao. BAP 75 a 150 ppm para aumentar calibre. Manual complementar deixando 1 fruto a cada 15 a 20 centimetros no ramo. Pomares sem raleio produzem frutos miudos e bienalidade.
ADUBACAO: Base na plantacao: fosforo e potassio conforme analise de solo. Anual em producao: nitrogenio parcelado 3 vezes, 30 por cento na brotacao, 50 por cento pos-colheita e 20 por cento no verao. Calcario para pH 6,0 a 6,5. Boro foliar 0,3 por cento na florada e queda das petalas obrigatorio para evitar podridao amarga. Calcio foliar 4 a 6 aplicacoes entre junho e janeiro para prevenir bitter pit.
IRRIGACAO: Gotejamento obrigatorio em pomares comerciais modernos. Critico nas fases de brotacao, florada, crescimento rapido de frutos julho a setembro e na maturacao. Deficit hidrico na florada causa morte de flores. Excesso proximo da colheita racha os frutos.
POLINIZACAO: Maca exige polinizacao cruzada entre variedades. Distribuir polinizadores a cada 10 metros no pomar. Abelhas Apis mellifera essencial para alta taxa de pegamento. Manter 2 a 4 colmeias por hectare na florada. Sincronizar floracao entre variedades.
PRAGAS: Mosca das frutas Anastrepha fraterculus principal praga. Controle com proteina hidrolisada iscada mais malatiao ou spinosade. Monitorar com armadilhas McPhail. Cochonilha San Jose tratamento oleos minerais no dormencia. Acaro vermelho controle com abamectina ou enxofre. Tripes limao controle com spinosade. Lagartas das brotacoes Bacillus thuringiensis.
DOENCAS: Sarna Venturia inaequalis principal doenca, controle preventivo com fungicidas ditiocarbamatos ou SDHI antes das chuvas na brotacao e apos. Podridao amarga Colletotrichum requer boro e calcio foliar. Mancha de glomerella emergente, controle similar a sarna. Oídio Podosphaera leucotricha enxofre molhavel preventivo. Fogo bacteriano Erwinia amylovora em variedades suscetíveis, notificacao obrigatoria.
COLHEITA: Indice de amido com solucao de lugol, escala 1 a 8, colher entre 5 e 6. Firmeza de polpa 7 a 8 kgf para Gala, 8 a 9 kgf para Fuji. Brix minimo 10,5 para Gala e 12 para Fuji. Colheita Gala janeiro a fevereiro, Fuji marco a abril. Escalonada em 2 a 3 passes para garantir calibre uniforme.
CLASSIFICACAO: Calibre minimo 60mm mercado interno, 65mm exportacao. Categorias extra, cat 1 e cat 2. Coloracao minima 50 por cento vermelha para variedades blushed.
ARMAZENAGEM: Camara fria convencional 0 a 1 grau, umidade 90 a 95 por cento. Atmosfera controlada AC com CO2 2 a 3 por cento e O2 1 a 2 por cento para Fuji ate 9 meses. Gala aguanta 3 a 4 meses em AC.
PIM: Producao Integrada de Maca certificacao federal obrigatoria para exportacao. Caderno de campo, limite de LMR nos defensivos, rastreabilidade total.
REGIAO IPE E VACARIA: Altitude 900 a 1100 metros, inverno rigoroso com geadas frequentes, frio suficiente para Fuji sem Dormex em bons anos. Solo vermelho latossolo de boa drenagem. Clima temperado umido sem estacao seca. Principal polo nacional de producao de maca junto com Fraiburgo SC.

PERA: Variedades de inverno Packham, Rocha, D'Anjou exigem frio similar a Fuji. Williams Bartlett sazonal. Poda em espaldeira laminada. Alta exigencia de boro foliar. Polinizacao cruzada obrigatoria com variedades sincronas. Mercado nacional ainda dependente de importacao da Argentina.
MARMELO: Base para geleias e doces. Rustico, tolerante ao frio severo. Espacamento 4m por 4m. Baixa exigencia de insumos. Mercado artesanal e gourmet em crescimento na Serra Gaucha.

PESSEGO: Poda em taca. Exige acumulo de frio 300-700 horas. Colheita novembro-janeiro no Sul.
UVA: Conducao em espaldeira ou latada. Poda seca anual. Vindima janeiro-marco no Sul.
BANANA: Espacamento 2m por 2m. Colheita 9-12 meses. Desbrota obrigatoria.
MAMAO: Espacamento 3m por 2m. Colheita 6-9 meses. Exige drenagem perfeita.
ABACAXI: Ciclo 12-18 meses. Inducao floral com ethefon.
MANGA: Producao 2-3 safras por ano com manejo de florada.
ABACATE: Espacamento 7m por 7m. Colheita 5-7 meses apos floracao.
MARACUJA: Espacamento 3m por 3m. Polinizacao manual ou por mamangavas.
NOZ-PECA: Espacamento 10m por 10m. Producao a partir de 5-8 anos. Exige Zinco foliar.
CAQUI: Colheita marco-junho. Destanizacao por CO2 para caqui chocolate.
MIRTILO: pH muito acido 4,5-5,0. Irrigacao por gotejamento obrigatoria.

=== PASTAGENS E FORRAGICULTURA ===
GRAAMINEAS DE VERAO: Brachiaria brizantha (Marandu, Xaraes, Piata), Panicum maximum (Tanzania, Mombaca, BRS Tamani), Tifton 85, Cynodon (Tifton 68, Jiggs).
GRAAMINEAS DE INVERNO: Azevem, Aveia-preta, Aveia-branca, Trigo duplo proposito, Centeio, Triticale.
LEGUMINOSAS: Estilosantes Campo Grande, Amendoim forrageiro, Trevo-branco, Cornichao, Soja perene.
MANEJO ROTACIONADO: Periodo de descanso 28-35 dias no verao e 45-60 dias no inverno. Altura de entrada 25-35cm, saida 10-15cm. Lotacao 3-5 UA por hectare em pastagem irrigada.
SILAGEM DE MILHO: Ponto de colheita no grao farinaceo, 30-35% de materia seca. Compactacao minima 650 kg por metro cubico. Inoculantes bacterianos.
FENO: Alfafa com proteina 15-20%. Tifton 85 com 10-14% de proteina. Corte antes da floracao.

=== PECUARIA BOVINA ===
GESTACAO: Vaca 280-290 dias, aproximadamente 9 meses. Bufala 305-315 dias. Egua 330-345 dias. Porca 114 dias. Ovelha 145-152 dias. Cabra 145-155 dias.
RACAS CORTE: Nelore, Angus, Brahman, Senepol, Brangus, Canchim, Tabapua.
RACAS LEITE: Holandes ou Frisia 25-45 litros por dia, Gir Leiteiro 15-25 litros por dia, Girolando 20-35 litros por dia, Jersey alto teor de gordura.
NUTRICAO BOVINA: Volumoso 2,5% do peso vivo por dia em materia seca. Mineral completo com sal branco, calcario, fosforo, selenio, cobre, zinco e cobalto. Agua 80-100 litros por vaca por dia.
REPRODUCAO: IATF taxa de prenhez 50-65%. Estacao de monta 60-90 dias. Diagnostico de gestacao 30 dias pos-IA por ultrassom.
DESMAMA: 6-8 meses ou 180 kg. Ganho de peso recria 0,6-0,8 kg por dia.
SANIDADE BOVINA: Vacina obrigatoria contra febre aftosa e brucelose. Opcional: Carbunculo, Botulismo, IBR, BVD. Vermifugacao 2 vezes por ano. Carrapato: rotacao de principios ativos organofosforados, piretroides, amidinas e avermectinas.

=== BUBALINOS ===
RACAS: Murrah para leite. Mediterraneo para corte e dupla aptidao. Jafarabadi. Gestacao 305-315 dias. Rusticidade maior que bovinos. Adaptados a areas alagadas.

=== SUINOCULTURA ===
RACAS: Landrace, Large White, Duroc, Pietrain. Femeas hibridas F1 para producao comercial.
CICLOS: Gestacao 114 dias. Lactacao 21-28 dias. Meta 2,2-2,4 partos por femea por ano. Meta 26-30 leitoes desmamados por femea por ano.
NUTRICAO: Racao por fase. Proteina bruta pre-inicial 20-22%, terminacao 14-16%. Base milho mais farelo de soja.
AMBIENCIA: Temperatura ideal leitao: 32-34°C no nascimento. Terminacao: 18-22°C.

=== AVICULTURA ===
FRANGO CORTE: Ciclo 35-47 dias. Peso abate 2,5-4,5 kg. FCR 1,65-1,90. Temperatura inicial 34-36°C. Densidade 12-14 aves por metro quadrado.
POSTURA: Inicio de postura 18-20 semanas. Pico de producao 90-95%. Programa de luz 16-17 horas por dia.
PERU: Ciclo 16-20 semanas. Abate 5-18 kg conforme sexo.
PATO: Ciclo 7-8 semanas. Peso abate 3,0-3,5 kg.
CODORNA: Inicio de postura 40-45 dias. Producao 280-320 ovos por ano.
GANSO: Ciclo 16-20 semanas.
AVESTRUZ: Ciclo 14-18 meses. Abate 90-110 kg. Pele, carne, penas e gordura.
SANIDADE AVES: Newcastle, Marek, Gumboro, Bronquite Infecciosa, Coccidiose, Micoplasmose.

=== CAPRINOCULTURA E OVINOCULTURA ===
RACAS CAPRINAS LEITE: Saanen 1200-1500 litros por lactacao. Alpina. Toggenburg. Anglonubiana.
RACAS CAPRINAS CORTE: Boer, Caninde, Moxoto.
RACAS OVINAS LA: Merino, Romney Marsh.
RACAS OVINAS CORTE: Dorper, Santa Ines, Texel, Suffolk, Ile de France, Morada Nova.
GESTACAO: Cabra 145-155 dias. Ovelha 145-152 dias.
SANIDADE: Vacinacao contra Clostridioses. Controle de Haemonchus com metodo FAMACHA.

=== EQUIDEOCULTURA ===
RACAS: Quarto de Milha, Mangalarga Marchador, Crioulo, PSI, Appaloosa.
NUTRICAO: Feno 1,5-2% do peso vivo por dia. Concentrado ate 0,5% por dia. Agua 30-60 litros por dia. Colique principal causa de morte, evitar mudancas bruscas de dieta.
GESTACAO EGUA: 330-345 dias, aproximadamente 11 meses.
SANIDADE: Vacinas Influenza, Tetano, Encefalomielite, Herpesvirus. Vermifugacao com Ivermectina mais Praziquantel 2-3 vezes por ano. Casqueamento a cada 6-8 semanas.

=== PISCICULTURA ===
ESPECIES BRASIL: Tilapia do Nilo principal especie, ciclo 6-8 meses, peso abate 600g-1kg. Tambaqui ciclo 12-18 meses, 1,5-3kg. Pintado ciclo 18-24 meses, 3-5kg. Pacu ciclo 12-18 meses. Pirarucu ciclo 24 meses, 15-20kg.
ESPECIES SUL: Jundia, tolerante ao frio, ciclo 12-18 meses. Carpa Comum, onivora, ciclo 12-18 meses. Truta Arco-iris em agua fria 14-18°C, ciclo 8-12 meses.
SISTEMAS: Viveiro escavado, tanque-rede, bioflocos BFT, aquaponia.
QUALIDADE DA AGUA: Oxigenio dissolvido minimo 5mg por litro. pH 6,5-8,5. Amonia abaixo de 0,5mg por litro. Disco de Secchi 30-50cm.
NUTRICAO PEIXES: Racao extrusada flutuante. Proteina bruta alevino 40-45%, crescimento 32-38%, terminacao 28-32%. Taxa de alimentacao 3-5% do peso vivo por dia em alevinos, 1-2% na terminacao.
SANIDADE PEIXES: Columnariose, Aeromoniose, Ictio (ponto branco). Tratamento com sal de 3 a 5 gramas por litro. Consultar veterinario aquicola.

=== CARCINICULTURA ===
CAMARAO: Vannamei principal especie. Salinidade 10-35 ppt. Ciclo 90-120 dias. Sistema bioflocos. Densidade 100-150 camaroes por metro quadrado.

=== RANICULTURA ===
RA-TOURO: Lithobates catesbeianus. Ciclo 12-18 meses. Peso abate 250-400g. Sistema semi-intensivo com agua corrente. Racao com 40-45% de proteina.

=== MALACOCULTURA ===
OSTRA: Cultivo em long-lines. Ciclo 12-18 meses. Salinidade 20-35 ppt.
MEXILHAO: Cultivo em espinhel. Ciclo 8-12 meses.

=== APICULTURA E MELIPONICULTURA ===
APIS MELLIFERA AFRICANIZADA: Producao de mel 20-80 kg por colmeia por ano. Colheita com desoperculacao e centrifugacao. Umidade maxima do mel 18%. Producao de propolis. Servico de polinizacao para soja, girassol, maca, abobora e morango.
SANIDADE ABELHAS: Varroa destructor principal praga mundial. Controle com acido oxalico, fluvalinate ou amitraz. Loque americano incuravel, exige notificacao. Nosema controle com Fumagilina.
MELIPONICULTURA: Abelhas sem ferrao nativas. Jatai, Mandacaia, Urucu, Canudo, Irai. Mel de 2-5 litros por colmeia por ano. Alto valor de mercado.

=== OUTRAS CRIACOES ===
COELHOS: Gestacao 31 dias. Ciclo 70-80 dias ate abate, 2,5-3 kg. Alta conversao alimentar 2,5-3:1.
ESCARGOT: Ciclo 6-8 meses. Mercado gourmet.
BICHO-DA-SEDA: Producao de casulos. Dieta de folha de amoreira. Parana maior produtor do Brasil.
MINHOCAS: Vermicompostagem com Eisenia foetida. Humus de alta qualidade. Substrato esterco bovino e residuos vegetais.
CROCODILIANOS: Jacare do papo amarelo com autorizacao do IBAMA. Ciclo 3-4 anos. Couro e carne.
EMAS: Criacao em crescimento no Brasil. Carne, ovos, penas e oleo.

=== SILVICULTURA E SISTEMAS AGROFLORESTAIS ===
EUCALIPTO: Ciclo 6-7 anos para celulose, 12-15 anos para madeira. Espacamento 3m por 2m a 3m por 3m. Produtividade 35-55 metros cubicos por hectare por ano.
PINUS: Ciclo 15-25 anos. Resina, madeira serrada e celulose. Sul do Brasil.
ERVA-MATE: Primeiro colheita 3-4 anos. Espacamento 3m por 1,5m. Colheita junho-agosto. Sul do Brasil.
SERINGUEIRA: Sangria por 30 anos. Latez 2-5 kg por arvore por ano.
ILPF: Integracao lavoura-pecuaria-floresta. Sombra para animais, fixacao de carbono, diversificacao de renda.

=== FERTILIZANTES E CORRETIVOS COMPLETOS ===
NITROGENADOS: Ureia 45% N, mais barata. Sulfato de amonio 21% N + 24% S. Nitrato de amonio 34% N. Nitrato de calcio 15,5% N + 26% Ca. Salitre do Chile nitrato de sodio 16% N. UAN solucao 28-32% N.
FOSFATADOS: MAP 12% N + 52% P2O5. DAP 18% N + 46% P2O5. Superfosfato simples 18% P2O5 + 20% Ca + 12% S. Superfosfato triplo 46% P2O5. Termofosfato Yoorin 18% P2O5 com Ca, Mg e Si.
POTASSICOS: KCl cloreto de potassio 60% K2O, mais comum e barato. Sulfato de potassio 50% K2O + 18% S, para solanaceas e fumo. Nitrato de potassio 13% N + 44% K2O, ideal em fertirrigation.
CALCARIO E GESSO: Calcario calcítico fornece Ca. Dolomitico fornece Ca e Mg. Gesso agricola 15-16% S + 22% Ca, condicionador de subsolo.
MICRONUTRIENTES: Boro 0,5-2 kg por hectare. Zinco 2-5 kg por hectare. Manganes 2-4 kg por hectare. Molibdenio 30-50 gramas por hectare, essencial na fixacao de N em leguminosas. Cobre 1-3 kg por hectare. Cobaltو 30-50 gramas por hectare.
ORGANICOS E BIOLOGICOS: Humus de minhoca. Composto organico. Esterco bovino 1% N, 0,5% P, 0,7% K. Esterco de frango 3% N, 2,5% P, 2% K. Inoculantes Bradyrhizobium para soja e feijao. Azospirillum para graamineas. Bacillus subtilis PGPR. Trichoderma antagonista de fungos.
BIOESTIMULANTES: Auxinas, citocininas, giberelinas. Extrato de algas. Aminoacidos. Acidos fulvicos e humicos.

=== DEFENSIVOS COMPLETOS ===
INSETICIDAS:
Organofosforados Grupo 1B: clorpirifos com carencia 21 dias. Alta toxicidade.
Piretroides Grupo 3A: lambda-cialotrina e deltametrina, carencia 14 dias. Eficiente e barato.
Diamidas Grupo 28: clorantraniliprole com carencia 7 dias. Alta seletividade e longa residualidade.
Espinosinas Grupo 5: espinosade com carencia 3 dias. Biologico derivado de Saccharopolyspora spinosa.
Neonicotinoides Grupo 4A: tiametoxam e imidacloprid. Sistemico. Atencao a restricao em abelhas.
Reguladores de crescimento: inibidores de sintese de quitina como teflubenzurom.
Bioinseticidas: Bacillus thuringiensis com zero carencia.
FUNGICIDAS:
Triazois: tebuconazol, prothioconazol, propiconazol. Inibidores de DMI.
Estrobilurinas: piraclostrobina e azoxistrobina. Inibidores de Qo.
SDHI: bixafeno, fluxapiroxade. Inibidores de succinate desidrogenase.
Cupricos: caldo bordales, oxicloreto de cobre. Contato. Zero carencia.
Ditiocarbamatos: mancozebe. Contato. Carencia 7-21 dias.
Anti-oomiceto: metalaxil mais mancozebe contra mildio e requeima.
HERBICIDAS:
Pre-emergencia: atrazina para milho, dual gold para soja.
Glifosato: sistemico nao seletivo, carencia 7 dias.
Graminicidas pos-emergencia: fluazifop e cletodim para gramíneas em dicotiledoneas.
Seletivos: 2,4-D para pastagens e trigo contra folha larga.
ACARICIDAS: Abamectina, Envidor, Acramite.
NEMATICIDAS: Nemacur, Mocap. Biologico com Bacillus firmus.
REGRAS: EPI completo obrigatorio. Respeitar periodo de carencia. Triplice lavagem de embalagens. Destino correto inPEV.

=== PRAGAS COMPLETAS ===
INSETOS SUGADORES: Mosca-branca Bemisia tabaci, Pulgoes Myzus persicae e Aphis gossypii, Cigarrinhas, Tripes Frankliniella, Cochonilhas, Percevejos.
INSETOS MASTIGADORES: Lagarta-da-soja, Lagarta-do-cartucho Spodoptera frugiperda, Lagarta-falsa-medideira, Lagarta-helicoverpa, Lagarta-rosca Agrotis, Broca-do-cafe, Broca-da-cana Diatraea, Traca-do-tomateiro Tuta absoluta, Traca-das-cruciferas Plutella xylostella.
COLEOPTEROS: Vaquinha Diabrotica, Cascudo-do-solo, Larva-arame.
ACAROS: Acaro-rajado Tetranychus urticae, Acaro-branco, Varroa em abelhas, Sarcoptes e Psoroptes em animais.
NEMATOIDES: Meloidogyne galha-da-raiz, Pratylenchus lesao, Heterodera cisto em soja.
ROEDORES: Rato-do-mato, Capivara, Ratazana em armazens.
FORMIGAS: Sauva Atta e quenquem Acromyrmex. Controle com iscas granuladas de sulfluramida.
CUPINS: Solo e madeira. Controle com imidacloprid ou bifentrina.
LESMAS E CARACOIS: Iscas com metaldehido. Barreiras com cal virgem ou cinza.
PRAGAS DE GRAOS ARMAZENADOS: Gorgulho Sitophilus zeamais, Tribolium, Traca-dos-cereais Sitotroga. Controle com fosfina por profissional habilitado.

=== DOENCAS COMPLETAS ===
FUNGICAS: Ferrugem-asiatica da soja, Ferrugem-da-folha do trigo, Brusone do arroz e trigo, Cercosporiose do milho e cafe, Antracnose do feijao e manga, Mildio da uva e batata, Requeima da batata e tomate, Sigatoka-negra da banana, Mofo-cinzento do morango.
BACTERIOSES: Cancro-citrico, Podridao mole, Mancha-angular do feijao.
VIROSES: Geminivirus vetor mosca-branca, Mosaico-do-pepino CMV, Virus-do-vira-cabeca vetor tripes, Mosaico-do-fumo TMV sem cura, remover plantas doentes.
OOMICETOS: Mildio-da-videira Plasmopara viticola, Mildio-do-fumo Peronospora tabacina, Podridao-da-raiz da soja Phytophthora.
NEMATOIDES FITOPATOGENICOS: Meloidogyne galhas, Pratylenchus lesoes.

=== DOENCAS ANIMAIS ===
BOVINOS: Tristeza parasitaria febre-anemia-ictericia, febre aftosa notificacao obrigatoria ao MAPA, mastite tratamento com antibioticos intramamarios, pneumonia, diarreia neonatal em bezerros. Sempre recomendar veterinario.
SUINOS: Circovirus PCV2, PRRS, sarna sarcóptica. Sempre recomendar veterinario.
AVES: Newcastle, Marek, Gumboro, Bronquite Infecciosa, Coccidiose. Sempre recomendar veterinario.
PEIXES: Columnariose, Aeromoniose, Ictio ponto branco. Consultar veterinario aquicola.
OVINOS E CAPRINOS: Haemonchus verme-barber-pole, Clostridioses, Pietim. Sempre recomendar veterinario.
EQUINOS: Colique, Influenza, Tetano, Encefalomielite. Emergencia veterinaria urgente em casos de colique.

=== COLHEITA E POS-COLHEITA ===
GRAOS: Umidade de colheita: soja 13-14%, milho 18-22% para secagem, trigo 13%. Perdas maximas 1 saca por hectare.
SECAGEM: Temperatura maxima: soja 42°C, milho 60°C para racao ou 45°C para semente. Meta soja 12,5%, milho 13%.
ARMAZENAGEM: Silo metalico ou silo-bolsa maximo 6 meses. Temperatura ideal abaixo de 20°C. Aeracao para manter gradiente de temperatura.
RASTREABILIDADE: Sisbov para bovinos, SIPEAGRO para defensivos.

=== COTACOES ===
Soja: CEPEA Paranagua, saca 60kg. Milho: CEPEA Campinas, saca 60kg. Trigo: Parana, saca 60kg. Boi gordo: CEPEA Sao Paulo, arroba. Frango: Parana, kg vivo. Leite: Brasil, litro. Cafe Arabica: Sao Paulo, saca 60kg. Fumo: contrato fumageiras Souza Cruz e JTI, 12-22 reais por kg conforme classe e cura.

=== ANALISE DE IMAGEM ===
Ao receber imagem:
1. Identifique especie, estagio fenologico e condicao geral.
2. Diagnostico: problema com nome comum. Severidade leve, moderada ou severa.
3. Recomendacao: produto e dosagem.
4. Para animais: dizer que e uma pre-avaliacao e recomendar veterinario.
5. Nao use nomes cientificos na fala.

---
PROTOCOLO DA CONVERSA:

ESTAGIO MUNICIPIO: Extrair dados da propriedade e perguntar municipio. nextStage NOME.
ESTAGIO NOME: Processar municipio e perguntar como quer ser chamado. nextStage CONCLUSAO.
ESTAGIO CONCLUSAO: Finalizar cadastro. nextStage ANALISE.
ESTAGIO ANALISE: Responder qualquer pergunta agronomica com precisao tecnica e objetividade radical. Maximo 2 paragrafos. Sem markdown. Sem emojis.

IDIOMA: Sempre responder no idioma do usuario.
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
  
  if (userMsg.includes('salitre') || (userMsg.includes('aduba') && userMsg.includes('salitre'))) {
    responseText = `Comandante ${userName}, a epoca adequada para fazer a adubacao com salitre no fumo e de 15 a 30 dias apos o plantio. Essa primeira cobertura deve ser feita com o solo umido para o adubo agir rapido.

Se for parcelar, faca a segunda aplicacao ate os 45 dias depois do plantio. Evite aplicar muito tarde para nao prejudicar a qualidade das folhas.`;
  }
  else if (userMsg.includes('previsão do tempo') || userMsg.includes('tempo hoje') || userMsg.includes('previsão') || userMsg.includes('geada') || userMsg.includes('temperatura') || userMsg.match(/\bvai chover\b/)) {
    const city = property.municipio || 'sua regiao';
    let cleanedCity = city.split(/,|-|\//)[0].trim().replace(/\b(rs|sc|pr|sp|rj|mg|go|mt|ms|ba|pe|ce|rn|pb|al|se|ma|pi|pa|am|ac|ro|rr|ap|to|df)\b/gi, '').trim();
    responseText = `Comandante ${userName}, dei uma olhada nos satelites para a regiao de ${cleanedCity}. O clima nos proximos dias promete sol firme e umidade favoravel para o campo. Ha uma estimativa de chuva leve de cerca de 8 milimetros no final da semana, o que e excelente para repor a umidade do solo.

Recomendo monitorar a umidade antes de aplicar qualquer cobertura para evitar perdas por lixiviacao.`;
  }
  else if (userMsg.includes('cotação') || userMsg.includes('preço') || userMsg.includes('mercado') || userMsg.includes('marcado') || userMsg.includes('valor') || userMsg.includes('cepea') || userMsg.includes('venda') || userMsg.includes('expansão') || userMsg.includes('exigente')) {
    if (userMsg.includes('bufalo') || userMsg.includes('búfalo')) {
        responseText = `Comandante ${userName}, a arroba do bufalo costuma acompanhar a do boi gordo, com um deságio de 5 a 10 por cento dependendo do frigorifico. A venda direta para cortes nobres pode render margens ate 20 por cento maiores que a carne bovina tradicional.`;
    } else {
        responseText = `Comandante ${userName}, aqui estao as cotacoes Cepea do dia.

A soja em Paranagua esta a 138 reais e 50 centavos por saca de 60 quilos. O milho em Campinas esta a 68 reais e 20 centavos por saca. O boi gordo em Sao Paulo esta a 242 reais por arroba.

O mercado exige cautela na venda fisica. Se puder segurar um lote para contratos futuros, pode garantir margem maior.`;
    }
  }
  else if (userMsg.includes('soja')) {
    responseText = `Comandante ${userName}, para soja use espacamento de 45 a 50 centimetros, com 200 a 280 mil plantas por hectare. Na base, aplique de 250 a 350 quilos por hectare de NPK 00-20-20 com Boro e Zinco. Controle percevejo se a desfolha passar de 15 por cento no estagio reprodutivo.`;
  }
  else if (userMsg.includes('milho')) {
    responseText = `Patrão, para o milho use espacamento de 45 a 70 centimetros com 55 a 75 mil plantas por hectare. Na base, aplique 300 a 400 quilos de NPK 08-28-16, e cobertura de 150 a 200 quilos de Ureia em V4 a V6. Trate as sementes contra a cigarrinha para evitar o enfezamento.`;
  }
  else if (userMsg.includes('fumo') || userMsg.includes('tabaco')) {
    responseText = `Comandante ${userName}, plante fumo Virginia ou Burley com espacamento de 1,0 a 1,2 metros entre linhas por 0,5 metro entre plantas. Na base, use 400 a 600 quilos por hectare de NPK 04-14-08. Cubra com Nitrato de Calcio parcelado em ate 3 vezes. Evite excesso de Nitrogenio na fase final, pois prejudica a qualidade da folha.`;
  }
  else if (userMsg.includes('canola')) {
    responseText = `Comandante ${userName}, plante canola com sementes Hyola no inverno. Exige enxofre no solo, por isso aplique sulfato de amonio em cobertura. Monitore a traca das cruciferas e a lagarta-preta para evitar perdas de produtividade.`;
  }
  else if (userMsg.includes('nozes') || userMsg.includes('noz') || userMsg.includes('pecã') || userMsg.includes('peca')) {
    responseText = `Patrão, para noz peca use espacamento de 10 por 10 ou 12 por 12 metros. Garanta adubacao com nitrogenio e zinco na formacao da copa. Previna a sarna da peca com fungicidas cupricos em veroes umidos para manter a casca limpa.`;
  }
  else if (userMsg.includes('aipim') || userMsg.includes('mandioca') || userMsg.includes('aipin')) {
    if ((userMsg.includes('epoca') || userMsg.includes('época') || userMsg.includes('quando') || userMsg.includes('plantar') || userMsg.includes('plantio')) &&
        (userMsg.includes('variedade') || userMsg.includes('tipo') || userMsg.includes('qual'))) {
      responseText = `Comandante ${userName}, plante aipim entre agosto e novembro, apos o risco de geadas e com o solo ja aquecido. As melhores variedades para a nossa regiao sao o Vassourinha e a Fepagro RS treze. Ambas cozinham rapido e sao muito macias.`;
    }
    else if (userMsg.includes('epoca') || userMsg.includes('época') || userMsg.includes('quando') || userMsg.includes('plantar') || userMsg.includes('plantio')) {
      responseText = `Comandante ${userName}, a janela ideal para plantar aipim na nossa regiao vai de agosto a novembro. Plantar apos o frio do inverno garante que a rama pegue calor e umidade certos para desenvolver raizes fortes.`;
    }
    else if (userMsg.includes('variedade') || userMsg.includes('tipo') || userMsg.includes('qual')) {
      responseText = `Comandante ${userName}, as melhores variedades de aipim para a nossa regiao sao o Vassourinha e a Fepagro RS treze. Ambas tem excelente rendimento de mesa, sao mansas e cozinham rapido.`;
    }
    else {
      responseText = `Comandante ${userName}, o espacamento ideal para aipim no Sul e de 90 centimetros a 1 metro entre linhas por 50 a 60 centimetros entre plantas. Corrija o pH do solo para 5,5 a 6,0 com calagem. Controle plantas daninhas nas primeiras brotacoes para garantir raizes fortes.`;
    }
  }
  else if (userMsg.includes('maçã') || userMsg.includes('maca') || userMsg.includes('macieira') || userMsg.includes('pomar') || userMsg.includes('apple')) {
    const isFrio = userMsg.includes('frio') || userMsg.includes('dormência') || userMsg.includes('dormencia') || userMsg.includes('dormex') || userMsg.includes('acumulo');
    const isPoda = userMsg.includes('poda') || userMsg.includes('prunning') || userMsg.includes('raleio') || userMsg.includes('ralear') || userMsg.includes('calibre');
    const isAdub = userMsg.includes('aduba') || userMsg.includes('calcio') || userMsg.includes('cálcio') || userMsg.includes('boro') || userMsg.includes('nutri') || userMsg.includes('fertiliz');
    const isPraga = userMsg.includes('praga') || userMsg.includes('mosca') || userMsg.includes('sarna') || userMsg.includes('doença') || userMsg.includes('doenca') || userMsg.includes('fungic') || userMsg.includes('inseticida') || userMsg.includes('cochonilha') || userMsg.includes('acaro') || userMsg.includes('ácaro');
    const isColheita = userMsg.includes('colheita') || userMsg.includes('colher') || userMsg.includes('maturação') || userMsg.includes('maturacao') || userMsg.includes('brix') || userMsg.includes('firmeza') || userMsg.includes('amido');
    const isArmazen = userMsg.includes('armazen') || userMsg.includes('câmara') || userMsg.includes('camara') || userMsg.includes('atmosfera') || userMsg.includes('estoque') || userMsg.includes('guardar') || userMsg.includes('fria');
    const isVariedade = userMsg.includes('variedade') || userMsg.includes('gala') || userMsg.includes('fuji') || userMsg.includes('eva') || userMsg.includes('kiku') || userMsg.includes('galaxy') || userMsg.includes('brookfield');
    const isEnxerto = userMsg.includes('enxerto') || userMsg.includes('porta-enxerto') || userMsg.includes('marubakaido') || userMsg.includes('mudas') || userMsg.includes('plantio') || userMsg.includes('plantar');
    const isPIM = userMsg.includes('pim') || userMsg.includes('certificaç') || userMsg.includes('exportaç') || userMsg.includes('exportacao') || userMsg.includes('rastreabi');

    if (isFrio) {
      responseText = `Comandante ${userName}, o acumulo de frio e a chave do pomar de maca. A Gala precisa de 400 a 700 horas abaixo de 7 graus. A Fuji exige de 800 a 1200 horas. Em anos de inverno fraco, aplica-se Dormex na dose de 0,8 a 1,2 por cento nos ramos no inicio do inchamento das gemas para forcar a brotacao uniforme. Nunca aplique com temperatura acima de 12 graus.`;
    } else if (isPoda) {
      responseText = `Comandante ${userName}, a poda de inverno em julho e agosto e feita para abrir a copa e eliminar ramos ladroes verticais. Deixa os ramos laterais com angulo de 60 a 90 graus do eixo para induzir frutificacao. No verao faz a poda verde para melhorar a entrada de luz e coloracao dos frutos. O raleio quimico com ANA de 10 a 25 dias apos a plena floracao e fundamental para garantir frutos com calibre de exportacao.`;
    } else if (isAdub) {
      responseText = `Comandante ${userName}, na maca o calcio foliar e item obrigatorio, de 4 a 6 aplicacoes entre junho e janeiro para evitar o bitter pit que apodrece a polpa por dentro. O boro tambem e critico na florada e na queda das petalas para evitar a podridao amarga. O nitrogenio deve ser parcelado em 3 vezes, 30 por cento na brotacao, 50 por cento pos-colheita e 20 por cento no verao. Manter pH do solo entre 6,0 e 6,5.`;
    } else if (isPraga) {
      responseText = `Comandante ${userName}, a mosca das frutas Anastrepha e a principal praga da maca. O controle e feito com proteina hidrolisada iscada mais spinosade ou malatiao, monitorando com armadilhas McPhail. Para sarna Venturia aplique fungicidas preventivos antes e apos as chuvas na brotacao. Na dormencia aplique oleo mineral para controle da cochonilha San Jose. Mantenha um programa de calcio e boro foliar para prevenir podridao amarga.`;
    } else if (isColheita) {
      responseText = `Comandante ${userName}, a colheita certa e no indice de amido entre 5 e 6 na escala do lugol. A Gala colhe de janeiro a fevereiro com firmeza de polpa de 7 a 8 quilos-forca e Brix minimo de 10,5 graus. A Fuji colhe de marco a abril com firmeza de 8 a 9 quilos-forca e Brix minimo de 12 graus. Faca a colheita em 2 a 3 passes para pegar cada fruto no ponto certo e garantir calibre uniforme.`;
    } else if (isArmazen) {
      responseText = `Comandante ${userName}, a camara fria convencional deve ficar entre 0 e 1 grau com umidade de 90 a 95 por cento. A Gala aguenta ate 4 meses. Para a Fuji, a atmosfera controlada com CO2 de 2 a 3 por cento e oxigenio de 1 a 2 por cento permite guardar ate 9 meses sem perda de qualidade comercial. E o diferencial que define a rentabilidade de uma safra inteira.`;
    } else if (isVariedade) {
      responseText = `Comandante ${userName}, para a regiao de Ipe e Serra Gaucha as melhores escolhas sao Gala e seus clones Brookfield, Galaxy e Imperial Gala para colheita precoce de janeiro a fevereiro. Para colheita tardia, Fuji Kiku e Fuji Suprema sao as mais valorizadas no mercado. A Eva serve para regioes com menos frio acumulado. O Galaxy e o Brookfield sao premium para exportacao com calibre e coloracao superior.`;
    } else if (isEnxerto) {
      responseText = `Comandante ${userName}, o porta-enxerto Marubakaido com interenxerto de M-9 e o mais usado na Serra Gaucha. Ele reduz o vigor da arvore e antecipa a producao para 2 a 3 anos apos o plantio. O espacamento recomendado e de 4 metros entre linhas por 1,5 a 2 metros entre plantas em sistema fuseto. A producao plena comeca aos 5 a 6 anos e o pomar dura 20 a 25 anos bem manejado.`;
    } else if (isPIM) {
      responseText = `Comandante ${userName}, a Producao Integrada de Maca e obrigatoria para exportacao. Ela exige caderno de campo com registro de todas as aplicacoes, respeito aos limites maximos de residuos LMR e rastreabilidade do talhao ate a embalagem. Os pomares certificados tem acesso a mercados europeus e norte-americanos onde o preco e 30 a 50 por cento maior que o mercado interno. O MAPA faz auditorias anuais.`;
    } else {
      responseText = `Patrão, a maca em Ipe e Serra Gaucha exige tecnica de ponta. O acumulo de frio abaixo de 7 graus e a base de tudo: Gala precisa de 400 a 700 horas, Fuji de 800 a 1200 horas. Use porta-enxerto Marubakaido com M-9 para antecipar producao. Faca raleio quimico com ANA de 10 a 25 dias apos a floracao para garantir calibre de exportacao. Controle preventivo de sarna e mosca das frutas sao obrigatorios para uma colheita limpa e rentavel.`;
    }
  }

  else if (userMsg.includes('pêssego') || userMsg.includes('pessego') || userMsg.includes('peach')) {
    responseText = `Comandante ${userName}, a poda de inverno em taca garante luz solar ideal nos pessegos. Trate preventivamente a podridao parda na florada e aplique potassio na fase final para garantir frutos doces e firmes.`;
  }
  else if (userMsg.includes('uva') || userMsg.includes('parreira') || userMsg.includes('videira') || userMsg.includes('vinho')) {
    responseText = `Comandante, conduza a parreira em espaldeira para melhor aeracao ou latada para maior volume. Faca poda seca rigida no inverno e trate contra mildio com cobre em epocas umidas para proteger os cachos.`;
  }
  else if (userMsg.includes('trigo') || userMsg.includes('wheat')) {
    responseText = `Comandante ${userName}, o trigo exige semeadura densa e adubacao com nitrogenio no perfilhamento para elevar o teor de proteina do grao. Monitore oidio e brusone nas fases umidas com fungicidas sistemicos.`;
  }
  else if (userMsg.includes('arroz') || userMsg.includes('rice')) {
    responseText = `Patrão, mantenha a lamina de agua uniforme nas varzeas para controle de invasoras. Aplique nitrogenio na diferenciacao da panicula e previna a brusone foliar para garantir alta produtividade.`;
  }
  else if (userMsg.includes('praga') || userMsg.includes('doença') || userMsg.includes('defensivo') || userMsg.includes('remédio') || userMsg.includes('veneno')) {
    responseText = `Comandante, contra pragas e doencas fungicas severas recomendo o uso preventivo de Fox Xpro ou Opera. Faca as aplicacoes nas horas mais frescas do dia e sempre com equipamento de protecao completo.`;
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
        if (userMsg.includes('gestação') || userMsg.includes('gestacao') || userMsg.includes('gravidez') || userMsg.includes('prenha') || userMsg.includes('prenhez') || userMsg.includes('meses') || (userMsg.includes('quanto') && userMsg.includes('tempo'))) {
          responseText = `Comandante ${userName}, o periodo de gestacao de uma vaca e de aproximadamente 9 meses, ou de 280 a 290 dias. Apos o parto, espere a vaca entrar no cio de 30 a 60 dias para fazer o retorno a reproducao.`;
        }
        else if (userMsg.includes('raca') || userMsg.includes('raça') || userMsg.includes('leite') || userMsg.includes('litragem') || userMsg.includes('holandesa') || userMsg.includes('jersey') || userMsg.includes('girolando')) {
          responseText = `Patrão, para leite no Sul a Girolando e a Holandesa sao as mais usadas. A Holandesa da mais leite por lactacao, mas exige mais conforto e pasto de qualidade. A Girolando aguenta melhor o calor e e mais rustica para o campo.`;
        }
        else if (userMsg.includes('corte') || userMsg.includes('nelore') || userMsg.includes('angus') || userMsg.includes('arremba') || userMsg.includes('arroba')) {
          responseText = `Patrão, para corte no Sul o cruzamento de Angus com Nelore e o mais usado. O Angus traz marmorizacao e precocidade, e o Nelore traz rusticidade. Mantenha pastagem de qualidade e controle o carrapato para nao perder ganho de peso.`;
        }
        else if (userMsg.includes('sanidade') || userMsg.includes('carrapato') || userMsg.includes('bicheira') || userMsg.includes('febre aftosa') || userMsg.includes('aftosa') || userMsg.includes('vacina') || userMsg.includes('vacinacao')) {
          responseText = `Comandante ${userName}, o controle sanitario do gado comeca pela vacinacao obrigatoria contra febre aftosa e brucelose. Faca o controle estrategico de carrapatos com carrapaticidas em rotacao para evitar resistencia. Tambem monitore verminoses e faca exame periodico das fezes.`;
        }
        else {
          responseText = `Patrão, para gado no Sul o segredo e a pastagem de qualidade e o controle sanitario rigoroso. Mantenha o controle de carrapatos e verminoses, agua limpa no campo e sal mineral de qualidade no cocho. Me diga se o foco e leite ou corte para dar uma orientacao mais precisa.`;
        }
      }
      else if (isSuino) {
        responseText = `Comandante ${userName}, a suinocultura exige biosseguridade estrita e controle de temperatura para evitar estresse termico nos leitoes. Capriche na nutricao balanceada por fases e no manejo sanitario preventivo contra circovirose e sarna.`;
      }
      else if (isAve) {
        responseText = `Patrão, a avicultura exige controle cirurgico do ambiente. A ventilacao nos galpoes e a automacao de comedouros e bebedouros definem a conversao alimentar dos frangos. Fique atento com a biosseguridade para evitar Newcastle e outras viroses.`;
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
        responseText = `Comandante ${userName}, a criacao de animais exige planejamento de pastagem e sanidade rigorosa. Me diga se o seu foco e gado de corte, leite, suinos ou outra criacao para dar uma orientacao mais precisa.`;
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
            if (h.role === 'model') {
                const dummyJSON = JSON.stringify({ response: h.text });
                messages.push({
                    role: 'assistant',
                    content: [{ text: dummyJSON }]
                });
            } else {
                messages.push({
                    role: 'user',
                    content: [{ text: h.text }]
                });
            }
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
        console.warn("VIX DIAGNOSTIC: Falha no parse do JSON nativo. Usando fallback de texto simples.", cleanText);
        output = {
            response: cleanText,
            nextStage: input.setupStage as any
        };
        if (input.propertyDetails) {
            output.propertyDetails = input.propertyDetails;
        }
    }

    if (!output.voiceProfile) {
        output.voiceProfile = 'iapetus';
    }

    const cleanResponse = (output.response || '')
      .replace(/\*\*/g, '')
      .replace(/[*#_{}]/g, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/`/g, '')
      .replace(/-/g, ' ')
      .replace(/\//g, ' por ')
      .replace(/\.{3,}/g, '.')
      .replace(/:/g, ',')
      .trim();

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

