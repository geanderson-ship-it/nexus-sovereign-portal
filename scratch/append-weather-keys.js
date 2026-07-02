const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/lib/locales/pt-BR.json');
const ptBR = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const weatherKeys = {
  "weather.analysis.title": "Análise Termodinâmica Atualizada",
  "weather.outlook.normal": "Condições seguem padrão previsível para 10 dias. Janela boa para operações regulares.",
  "weather.outlook.dry": "ALERTA: Padrão contínuo de tempo aberto e seco persistente. Atenção ao déficit hídrico nas folhas, programe irrigações se possível.",
  "weather.outlook.rainy": "ATENÇÃO: Cenário aponta alta incidência de chuvas. Risco de encharcamento e dificuldades no uso de maquinário pesado ou pulverização foliar.",
  "weather.outlook.error": "Não foi possível conectar ao satélite meteorológico neste momento. Aja de forma conservadora quanto ao clima e use ferramentas locais.",
  "weather.condition.0": "Céu limpo",
  "weather.condition.1": "Majoritariamente limpo",
  "weather.condition.2": "Parcialmente nublado",
  "weather.condition.3": "Nublado",
  "weather.condition.45": "Nevoeiro",
  "weather.condition.48": "Nevoeiro com geada",
  "weather.condition.51": "Chuvisco leve",
  "weather.condition.53": "Chuvisco moderado",
  "weather.condition.55": "Chuvisco forte",
  "weather.condition.56": "Chuvisco congelante leve",
  "weather.condition.57": "Chuvisco congelante forte",
  "weather.condition.61": "Chuva fraca",
  "weather.condition.63": "Chuva moderada",
  "weather.condition.65": "Chuva forte",
  "weather.condition.66": "Chuva congelante leve",
  "weather.condition.67": "Chuva congelante forte",
  "weather.condition.71": "Neve fraca",
  "weather.condition.73": "Neve moderada",
  "weather.condition.75": "Neve forte",
  "weather.condition.77": "Grãos de neve",
  "weather.condition.80": "Pancada de chuva fraca",
  "weather.condition.81": "Pancada de chuva moderada",
  "weather.condition.82": "Pancada de chuva forte",
  "weather.condition.85": "Pancada de neve fraca",
  "weather.condition.86": "Pancada de neve forte",
  "weather.condition.95": "Tempestade leve",
  "weather.condition.96": "Tempestade com granizo leve",
  "weather.condition.99": "Tempestade forte com granizo",
  "weather.condition.unknown": "Instável"
};

Object.assign(ptBR, weatherKeys);

fs.writeFileSync(filePath, JSON.stringify(ptBR, null, 2), 'utf8');
console.log('Weather keys added to pt-BR.json');
