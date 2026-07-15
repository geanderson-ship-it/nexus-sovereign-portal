// @ts-nocheck
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

export async function checkEmails(conta: 'pessoal' | 'empresarial' | 'vendas', pasta: 'entrada' | 'enviados' | 'spam' | 'lixeira' = 'entrada', max: number = 3) {
  let email, pass;
  if (conta === 'pessoal') {
    email = process.env.GMAIL_PESSOAL_EMAIL;
    pass = process.env.GMAIL_PESSOAL_PASS;
  } else if (conta === 'vendas') {
    email = process.env.GMAIL_VENDAS_EMAIL;
    pass = process.env.GMAIL_VENDAS_PASS;
  } else {
    email = process.env.GMAIL_EMPRESA_EMAIL;
    pass = process.env.GMAIL_EMPRESA_PASS;
  }

  let imapPath = 'INBOX';
  if (pasta === 'enviados') imapPath = '[Gmail]/E-mails enviados';
  if (pasta === 'spam') imapPath = '[Gmail]/Spam';
  if (pasta === 'lixeira') imapPath = '[Gmail]/Lixeira';

  if (!email || !pass) {
    throw new Error(`Credenciais ausentes no cofre (.env.local) para a conta ${conta}.`);
  }

  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: { user: email, pass: pass },
    logger: false
  });

  await client.connect();
  let lock;
  try {
    lock = await client.getMailboxLock(imapPath);
  } catch(e) {
    // Tenta fallback para inglês caso o Gmail esteja em outro idioma
    if (pasta === 'enviados') imapPath = '[Gmail]/Sent Mail';
    if (pasta === 'spam') imapPath = '[Gmail]/Spam';
    if (pasta === 'lixeira') imapPath = '[Gmail]/Trash';
    lock = await client.getMailboxLock(imapPath);
  }
  
  const results = [];
  try {
    const status = await client.mailboxOpen(imapPath);
    if (status.exists > 0) {
      const fromSeq = Math.max(1, status.exists - max + 1);
      const seq = `${fromSeq}:${status.exists}`;
      
      for await (let message of client.fetch(seq, { source: true, envelope: true })) {
        if (message.source) {
           const parsed = await simpleParser(message.source);
           const textBody = (parsed.text || '').substring(0, 1000); // Limita tamanho por segurança
           results.push({
             remetente: parsed.from?.text || message.envelope.from.map(f => f.address).join(', '),
             assunto: parsed.subject || message.envelope.subject,
             data: parsed.date || message.envelope.date,
             resumo_conteudo: textBody
           });
        }
      }
    }
  } finally {
    lock.release();
    await client.logout();
  }
  
  return results.reverse(); // Ordem decrescente (mais novos primeiro)
}
