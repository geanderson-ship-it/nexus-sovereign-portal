const { ImapFlow } = require('imapflow');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

function findTextPart(structure) {
  if (!structure) return null;
  if (structure.type?.toLowerCase() === 'text/plain') {
    return structure.part || '1';
  }
  if (structure.childNodes && structure.childNodes.length > 0) {
    for (const child of structure.childNodes) {
      const part = findTextPart(child);
      if (part) return part;
    }
  }
  if (structure.type?.toLowerCase() === 'text/html') {
    return structure.part || '1';
  }
  return null;
}

async function getEmailBodyPart(client, uid, partId) {
  try {
    const { content } = await client.download(uid, partId, { uid: true });
    const chunks = [];
    for await (const chunk of content) {
      chunks.push(chunk);
    }
    const rawText = Buffer.concat(chunks).toString('utf-8');
    return rawText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').substring(0, 150).trim();
  } catch (err) {
    return "Sem prévia.";
  }
}

async function run() {
  const email = process.env.GMAIL_VENDAS_EMAIL;
  const pass = process.env.GMAIL_VENDAS_PASS;

  if (!email || !pass) {
    console.error("Credenciais de vendas ausentes no .env.local");
    process.exit(1);
  }

  console.log(`[Email Tool] Conectando a ${email}...`);
  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: { user: email, pass: pass },
    logger: false
  });

  await client.connect();
  console.log("[Email Tool] Conectado!");

  // Listar pastas para achar a de Spam
  const list = await client.list();
  let matchedFolder = list.find(f => 
    f.specialUse === '\\Junk' || 
    f.flags?.has('\\Junk') || 
    f.path.toLowerCase().includes('spam') || 
    f.path.toLowerCase().includes('junk')
  );

  const imapPath = matchedFolder ? matchedFolder.path : '[Gmail]/Spam';
  console.log(`[Email Tool] Abrindo pasta de Spam: ${imapPath}...`);

  let lock = await client.getMailboxLock(imapPath);
  try {
    const status = await client.mailboxOpen(imapPath);
    console.log(`[Email Tool] Total de e-mails em Spam: ${status.exists}`);

    if (status.exists === 0) {
      console.log("[Email Tool] Ninguém na pasta de Spam.");
      return;
    }

    // Buscar mensagens de forma sequencial
    const seq = `1:${status.exists}`;
    const messages = [];
    console.log("[Email Tool] Lendo metadados dos e-mails...");
    for await (let message of client.fetch(seq, { bodyStructure: true, envelope: true })) {
      messages.push(message);
    }

    console.log(`[Email Tool] Baixando snippets de conteúdo para ${messages.length} e-mails...`);
    const emailReport = [];

    // Baixa o conteúdo de cada um
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const partId = findTextPart(message.bodyStructure);
      let textBody = "Sem prévia.";
      if (partId) {
        textBody = await getEmailBodyPart(client, message.uid, partId);
      }

      const from = message.envelope.from?.map(f => `${f.name || ''} <${f.address}>`.trim()).join(', ') || 'Desconhecido';
      const subject = message.envelope.subject || 'Sem Assunto';
      const date = message.envelope.date || new Date();

      emailReport.push({
        idx: i + 1,
        remetente: from,
        assunto: subject,
        data: date,
        resumo: textBody
      });
    }

    // Ordenar do mais novo para o mais antigo
    emailReport.reverse();

    // Gerar relatório em Markdown
    let md = `# Relatório de Spam - vendas@nexustreinamento.com\n\n`;
    md += `Gerado em: ${new Date().toLocaleString('pt-BR')}\n`;
    md += `Total de e-mails lidos: ${emailReport.length}\n\n`;
    md += `| # | Data | Remetente | Assunto | Snippet |\n`;
    md += `|---|------|-----------|---------|---------|\n`;

    emailReport.forEach(e => {
      const cleanSender = e.remetente.replace(/\|/g, '\\|');
      const cleanSubject = e.assunto.replace(/\|/g, '\\|');
      const cleanSnippet = e.resumo.replace(/\|/g, '\\|').substring(0, 100);
      const formattedDate = new Date(e.data).toLocaleDateString('pt-BR');

      md += `| ${e.idx} | ${formattedDate} | ${cleanSender} | ${cleanSubject} | ${cleanSnippet}... |\n`;
    });

    const reportPath = path.join('c:/Users/geand/Gitclone/nexus-sovereign-portal', 'vendas_spam_report.md');
    fs.writeFileSync(reportPath, md, 'utf-8');
    console.log(`[Email Tool] Relatório salvo com sucesso em: ${reportPath}`);

    // Imprimir no console um resumo simples para visualização imediata
    console.log("--- RESUMO DOS EMAILS ---");
    emailReport.slice(0, 20).forEach(e => {
      console.log(`[${e.idx}] ${new Date(e.data).toLocaleDateString('pt-BR')} | ${e.remetente} | ${e.assunto}`);
    });
    if (emailReport.length > 20) {
      console.log(`... e mais ${emailReport.length - 20} e-mails.`);
    }

  } finally {
    lock.release();
    await client.logout();
  }
}

run().catch(console.error);
