const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/lib/locales/pt-BR.json');
const ptBR = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const finalKeys = {
  "login.toast.success.description": "Bem-vindo de volta ao centro de comando.",
  "profile.welcome": "Bem-vindo(a), {name}!",
  "profile.default_name": "Aluno(a)",
  "whatsapp.payment.message": "Olá! Efetuei o pagamento de {price} para o curso \"{title}\" e estou enviando o comprovante.",
  "whatsapp.support.message": "Olá! Estou no site da Nexus ({path}) e gostaria de tirar uma dúvida sobre os cursos.",
  "chat.footer.disclaimer": "O {name} é uma IA e pode cometer erros. Confira as respostas. Devido ao alto fluxo, o áudio pode demorar alguns instantes.",
  "chat.placeholder.scenario": "Apresente o cenário...",
  "chat.button.pay": "Liberar Acesso Total Agora",
  "chat.payment.title": "PIX para Acesso Total",
  "chat.payment.qr_desc": "Escaneie o código com seu app de banco.",
  "chat.payment.investment": "Investimento: Acesso Total",
  "chat.payment.qr_button": "Pagar com QR Code",
  "chat.payment.copy_button": "PIX Copia e Cola",
  "chat.payment.copied": "Copiado!",
  "chat.payment.whatsapp_button": "Enviar Comprovante via WhatsApp"
};

Object.assign(ptBR, finalKeys);

fs.writeFileSync(filePath, JSON.stringify(ptBR, null, 2), 'utf8');
console.log('Final keys added to pt-BR.json');
