const { ImapFlow } = require('imapflow');
require('dotenv').config({ path: '.env.local' });

async function check(email, pass, label) {
    if (!email || !pass) {
        console.error(`ERRO: Credenciais ausentes para ${label}`);
        return;
    }
    const client = new ImapFlow({ host: 'imap.gmail.com', port: 993, secure: true, auth: { user: email, pass: pass }, logger: false });
    try {
        await client.connect();
        console.log(`[${label}] Sucesso! Conectado a ${email}`);
        await client.logout();
    } catch (err) {
        console.error(`[${label}] Falha ao conectar em ${email}:`, err.message);
    }
}

async function main() {
    await check(process.env.GMAIL_PESSOAL_EMAIL, process.env.GMAIL_PESSOAL_PASS, 'PESSOAL');
    await check(process.env.GMAIL_EMPRESA_EMAIL, process.env.GMAIL_EMPRESA_PASS, 'EMPRESA');
}
main();
