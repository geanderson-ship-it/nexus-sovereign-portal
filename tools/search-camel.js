const { ImapFlow } = require('imapflow');
const path = require('path');
require('dotenv').config({ path: 'c:/Users/geand/Gitclone/nexus-sovereign-portal/.env.local' });

async function searchAccountForCamel(email, pass, label) {
  if (!email || !pass) {
    console.log(`[Email Tool] Conta ${label} não configurada.`);
    return;
  }

  console.log(`[Email Tool] Conectando a ${label} (${email})...`);
  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: { user: email, pass: pass },
    logger: false
  });

  try {
    await client.connect();
    
    // Open INBOX
    let lock = await client.getMailboxLock('INBOX');
    try {
      await client.mailboxOpen('INBOX');
      console.log(`[Email Tool] Buscando e-mails com 'Camel' em ${label}...`);
      
      const results = [];
      for await (let msg of client.fetch({ or: [{ subject: 'Camel' }, { body: 'Camel' }, { from: 'Camel' }] }, { envelope: true, source: true })) {
        results.push(msg);
      }
      
      if (results.length === 0) {
        console.log(`[Email Tool] Nenhum e-mail encontrado com 'Camel' em ${label}.`);
        return;
      }
      
      console.log(`[Email Tool] Encontrado(s) ${results.length} e-mail(s) em ${label}:`);
      
      const simpleParser = require('mailparser').simpleParser;
      for (const msg of results) {
        const parsed = await simpleParser(msg.source);
        console.log('====================================================');
        console.log(`📌 DE: ${parsed.from?.text || 'Desconhecido'}`);
        console.log(`📑 ASSUNTO: ${parsed.subject || 'Sem Assunto'}`);
        console.log(`📅 DATA: ${parsed.date?.toLocaleString('pt-BR') || 'Sem Data'}`);
        console.log('--- CONTEÚDO ---');
        console.log(parsed.text || parsed.html || 'Sem texto.');
        console.log('====================================================\n');
      }
    } finally {
      lock.release();
    }
    
    await client.logout();
  } catch (err) {
    console.error(`[Email Tool] Erro em ${label}:`, err.message);
  }
}

async function run() {
  // 1. Verificar vendas@nexustreinamento.com
  await searchAccountForCamel(process.env.GMAIL_VENDAS_EMAIL, process.env.GMAIL_VENDAS_PASS, 'VENDAS');
  
  // 2. Verificar geanderson@nexustreinamento.com (empresa)
  await searchAccountForCamel(process.env.GMAIL_EMPRESA_EMAIL, process.env.GMAIL_EMPRESA_PASS, 'EMPRESA');
}

run().catch(console.error);
