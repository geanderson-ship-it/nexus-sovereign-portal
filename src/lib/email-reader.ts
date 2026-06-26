import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

export async function checkEmails(conta: 'pessoal' | 'empresarial', max: number = 3) {
  const email = conta === 'pessoal' ? process.env.GMAIL_PESSOAL_EMAIL : process.env.GMAIL_EMPRESA_EMAIL;
  const pass = conta === 'pessoal' ? process.env.GMAIL_PESSOAL_PASS : process.env.GMAIL_EMPRESA_PASS;

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
  let lock = await client.getMailboxLock('INBOX');
  
  const results = [];
  try {
    const status = await client.mailboxOpen('INBOX');
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
