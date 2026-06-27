const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
require('dotenv').config({ path: '.env.local' });

async function check() {
  const user = process.env.GMAIL_EMPRESA_EMAIL;
  const pass = process.env.GMAIL_EMPRESA_PASS;
  
  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: { user, pass },
    logger: false
  });

  try {
    await client.connect();
    let lock = await client.getMailboxLock('INBOX');
    try {
      const status = await client.mailboxOpen('INBOX');
      const max = 15;
      if (status.exists > 0) {
        const fromSeq = Math.max(1, status.exists - max + 1);
        const seq = `${fromSeq}:${status.exists}`;
        
        for await (let message of client.fetch(seq, { source: true, envelope: true })) {
          if (message.source) {
             const parsed = await simpleParser(message.source);
             const subject = parsed.subject || message.envelope.subject || '';
             
             if (subject.includes('Foz') || subject.includes('Dubai') || subject.includes('Bedrock')) {
                 console.log("==========================================");
                 console.log("De:", parsed.from?.text || message.envelope.from.map(f => f.address).join(', '));
                 console.log("Assunto:", subject);
                 console.log("Conteúdo:\n", parsed.text);
             }
          }
        }
      }
    } finally {
      lock.release();
    }
    await client.logout();
  } catch (err) {
    console.error("FALHA AO CONECTAR:", err.message);
  }
}

check();
