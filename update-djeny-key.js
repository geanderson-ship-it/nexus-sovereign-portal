const fs = require('fs');
const filePath = '.env.local';

let env = '';
if (fs.existsSync(filePath)) {
  env = fs.readFileSync(filePath, 'utf8');
}

if (!env.includes('DJENY_ELEVENLABS_VOICE_ID')) {
  fs.appendFileSync(filePath, '\nDJENY_ELEVENLABS_VOICE_ID=gX4eTo1XOTTALJXnDro4\n');
  console.log('Chave adicionada com sucesso no final do .env.local');
} else {
  const newEnv = env.replace(/DJENY_ELEVENLABS_VOICE_ID=.*/g, 'DJENY_ELEVENLABS_VOICE_ID=gX4eTo1XOTTALJXnDro4');
  fs.writeFileSync(filePath, newEnv, 'utf8');
  console.log('Chave atualizada com sucesso no .env.local');
}
