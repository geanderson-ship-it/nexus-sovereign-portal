// @ts-nocheck
import { ImapFlow } from 'imapflow';

function findTextPart(structure: any): string | null {
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

async function getEmailBodyPart(client: any, uid: number, partId: string) {
  try {
    const { content } = await client.download(uid, partId, { uid: true });
    const chunks = [];
    for await (const chunk of content) {
      chunks.push(chunk);
    }
    const rawText = Buffer.concat(chunks).toString('utf-8');
    return rawText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').substring(0, 500).trim();
  } catch (err) {
    return "Sem prévia de conteúdo disponível.";
  }
}

export async function checkEmails(
  conta: 'pessoal' | 'empresarial' | 'vendas' | 'ivoni',
  pasta: 'entrada' | 'enviados' | 'spam' | 'lixeira' | 'todos' | 'rascunhos' | 'favoritos' | 'importante' = 'entrada',
  max: number = 3
) {
  let email, pass;
  if (conta === 'pessoal') {
    email = process.env.GMAIL_PESSOAL_EMAIL;
    pass = process.env.GMAIL_PESSOAL_PASS;
  } else if (conta === 'vendas') {
    email = process.env.GMAIL_VENDAS_EMAIL;
    pass = process.env.GMAIL_VENDAS_PASS;
  } else if (conta === 'ivoni') {
    email = process.env.GMAIL_IVONI_EMAIL;
    pass = process.env.GMAIL_IVONI_PASS;
  } else {
    email = process.env.GMAIL_EMPRESA_EMAIL;
    pass = process.env.GMAIL_EMPRESA_PASS;
  }

  if (!email || !pass) {
    throw new Error(`Credenciais ausentes no cofre (.env.local) para a conta ${conta}.`);
  }

  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: { user: email, pass: pass },
    logger: false,
    clientInfo: { name: 'NexusSovereign' }
  });

  // Timeout de 35 segundos para dar bastante margem e evitar estouros
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("A conexão com o servidor de e-mail excedeu o tempo limite (Timeout de 35s).")), 35000)
  );

  const fetchEmailsPromise = (async () => {
    await client.connect();
    
    // Buscar caminho da pasta de forma dinâmica com base na intenção do usuário
    let imapPath = 'INBOX';
    if (pasta !== 'entrada') {
      try {
        const list = await client.list();
        let matchedFolder = null;
        
        if (pasta === 'enviados') {
          matchedFolder = list.find(f => 
            f.specialUse === '\\Sent' || 
            f.flags?.has('\\Sent') || 
            f.path.toLowerCase().includes('sent') || 
            f.path.toLowerCase().includes('enviad')
          );
        } else if (pasta === 'spam') {
          matchedFolder = list.find(f => 
            f.specialUse === '\\Junk' || 
            f.flags?.has('\\Junk') || 
            f.path.toLowerCase().includes('spam') || 
            f.path.toLowerCase().includes('junk') || 
            f.path.toLowerCase().includes('quarentena')
          );
        } else if (pasta === 'lixeira') {
          matchedFolder = list.find(f => 
            f.specialUse === '\\Trash' || 
            f.flags?.has('\\Trash') || 
            f.path.toLowerCase().includes('trash') || 
            f.path.toLowerCase().includes('lix') || 
            f.path.toLowerCase().includes('bin')
          );
        } else if (pasta === 'todos') {
          matchedFolder = list.find(f => 
            f.specialUse === '\\All' || 
            f.flags?.has('\\All') || 
            f.path.toLowerCase().includes('todos') || 
            f.path.toLowerCase().includes('all')
          );
        } else if (pasta === 'rascunhos') {
          matchedFolder = list.find(f => 
            f.specialUse === '\\Drafts' || 
            f.flags?.has('\\Drafts') || 
            f.path.toLowerCase().includes('rascunh') || 
            f.path.toLowerCase().includes('draft')
          );
        } else if (pasta === 'favoritos') {
          matchedFolder = list.find(f => 
            f.specialUse === '\\Flagged' || 
            f.flags?.has('\\Flagged') || 
            f.path.toLowerCase().includes('com estrela') || 
            f.path.toLowerCase().includes('star') || 
            f.path.toLowerCase().includes('flag')
          );
        } else if (pasta === 'importante') {
          matchedFolder = list.find(f => 
            f.flags?.has('\\Important') || 
            f.path.toLowerCase().includes('importante') || 
            f.path.toLowerCase().includes('important')
          );
        }
        
        if (matchedFolder) {
          imapPath = matchedFolder.path;
        } else {
          // Fallbacks padrão
          if (pasta === 'enviados') imapPath = '[Gmail]/E-mails enviados';
          if (pasta === 'spam') imapPath = '[Gmail]/Spam';
          if (pasta === 'lixeira') imapPath = '[Gmail]/Lixeira';
          if (pasta === 'todos') imapPath = '[Gmail]/Todos os e-mails';
          if (pasta === 'rascunhos') imapPath = '[Gmail]/Rascunhos';
          if (pasta === 'favoritos') imapPath = '[Gmail]/Com estrela';
          if (pasta === 'importante') imapPath = '[Gmail]/Importante';
        }
      } catch (err) {
        console.warn("[Email Reader] Erro ao listar pastas para detecção dinâmica:", err);
        if (pasta === 'enviados') imapPath = '[Gmail]/E-mails enviados';
        if (pasta === 'spam') imapPath = '[Gmail]/Spam';
        if (pasta === 'lixeira') imapPath = '[Gmail]/Lixeira';
        if (pasta === 'todos') imapPath = '[Gmail]/Todos os e-mails';
        if (pasta === 'rascunhos') imapPath = '[Gmail]/Rascunhos';
        if (pasta === 'favoritos') imapPath = '[Gmail]/Com estrela';
        if (pasta === 'importante') imapPath = '[Gmail]/Importante';
      }
    }

    let lock = await client.getMailboxLock(imapPath);
    const results = [];
    try {
      const status = await client.mailboxOpen(imapPath);
      if (status.exists > 0) {
        const fromSeq = Math.max(1, status.exists - max + 1);
        const seq = `${fromSeq}:${status.exists}`;
        
        // 1. Fetch envelopes and structures first, freeing the IMAP fetch channel
        const messages = [];
        for await (let message of client.fetch(seq, { bodyStructure: true, envelope: true })) {
          messages.push(message);
        }
        
        // 2. Download the plain text body parts sequentially without socket conflicts
        for (const message of messages) {
          const partId = findTextPart(message.bodyStructure);
          let textBody = "Sem prévia de conteúdo disponível.";
          if (partId) {
            textBody = await getEmailBodyPart(client, message.uid, partId);
          }
          
          results.push({
            remetente: message.envelope.from?.map(f => `${f.name || ''} <${f.address}>`.trim()).join(', ') || 'Desconhecido',
            assunto: message.envelope.subject || 'Sem Assunto',
            data: message.envelope.date || new Date().toISOString(),
            resumo_conteudo: textBody
          });
        }
      }
    } finally {
      lock.release();
      await client.logout();
    }
    
    return results.reverse();
  })();

  return Promise.race([fetchEmailsPromise, timeoutPromise]) as Promise<any[]>;
}
