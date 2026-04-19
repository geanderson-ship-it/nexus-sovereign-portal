const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/ai/flows/dante-safra-flow.ts');
let content = fs.readFileSync(filePath, 'utf8');

const target = 'Se a pergunta for sobre o tempo, use a ferramenta `getWeatherForecast`.';
const replacement = 'Se a pergunta for sobre o tempo, use a ferramenta `getWeatherForecast` passando obrigatoriamente o `locale` atual do usuário.';

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Dante flow prompt updated.');
} else {
    console.error('Target not found in Dante flow prompt.');
    // Check for variation with escaped backticks
    const target2 = 'Se a pergunta for sobre o tempo, use a ferramenta \\`getWeatherForecast\\`.';
    if (content.includes(target2)) {
         content = content.replace(target2, replacement);
         fs.writeFileSync(filePath, content, 'utf8');
         console.log('Dante flow prompt updated (variation).');
    } else {
         console.log('Current context around line 88:');
         const lines = content.split('\n');
         console.log(lines.slice(86, 90).join('\n'));
    }
}
