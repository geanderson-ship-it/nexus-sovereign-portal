const imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
require('dotenv').config({ path: '.env.local' });

const config = {
    imap: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_APP_PASSWORD,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { servername: 'imap.gmail.com' },
        authTimeout: 10000
    }
};

const pIsEmpresa = {
    imap: {
        user: process.env.GMAIL_EMPRESA_EMAIL,
        password: process.env.GMAIL_EMPRESA_PASS ? process.env.GMAIL_EMPRESA_PASS.replace(/\s/g, '') : '',
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { servername: 'imap.gmail.com' },
        authTimeout: 10000
    }
};

const pIsPessoal = {
    imap: {
        user: process.env.GMAIL_PESSOAL_EMAIL,
        password: process.env.GMAIL_PESSOAL_PASS ? process.env.GMAIL_PESSOAL_PASS.replace(/\s/g, '') : '',
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { servername: 'imap.gmail.com' },
        authTimeout: 10000
    }
};

async function searchBox(connection, boxName, searchTerm) {
    try {
        await connection.openBox(boxName);
        const searchCriteria = [['TEXT', searchTerm]];
        const fetchOptions = { bodies: ['HEADER', 'TEXT', ''], markSeen: false };
        
        const messages = await connection.search(searchCriteria, fetchOptions);
        if (messages.length === 0) return [];
        
        return messages.slice(-5).reverse().map(msg => ({ ...msg, folder: boxName }));
    } catch (e) {
        return [];
    }
}

async function searchAccount(config, accountLabel, searchTerm) {
    if (!config.imap.user || !config.imap.password) {
        console.log(`[Atena] Conta ${accountLabel} não configurada ou sem senha.`);
        return;
    }

    console.log(`[Atena] Conectando à conta ${accountLabel} (${config.imap.user})...`);
    try {
        const connection = await imaps.connect(config);
        
        let allMessages = [];
        allMessages = allMessages.concat(await searchBox(connection, 'INBOX', searchTerm));
        allMessages = allMessages.concat(await searchBox(connection, '[Gmail]/Enviados', searchTerm));
        allMessages = allMessages.concat(await searchBox(connection, '[Gmail]/Sent Mail', searchTerm));

        if (allMessages.length === 0) {
            console.log(`[Atena] Nenhum e-mail sobre "${searchTerm}" na conta ${accountLabel}.\n`);
            connection.end();
            return;
        }

        console.log(`[Atena] Encontrei ${allMessages.length} e-mail(s) com "${searchTerm}" na conta ${accountLabel}:\n`);

        for (const item of allMessages) {
            const all = item.parts.find(p => p.which === '');
            const id = item.attributes.uid;
            
            try {
                const parsed = await simpleParser("Imap-Id: "+id+"\r\n" + all.body);
                console.log('====================================================');
                console.log(`📧 CONTA: ${accountLabel} | PASTA: ${item.folder}`);
                console.log(`📌 DE: ${parsed.from.text}`);
                console.log(`📑 ASSUNTO: ${parsed.subject}`);
                console.log(`📅 DATA: ${parsed.date.toLocaleString('pt-BR')}`);
                console.log('--- CONTEÚDO ---');
                
                let bodyText = parsed.text || '';
                // Mostra um pouco mais de caracteres para ler e-mails de alerta/confirmação da AWS
                const snippet = bodyText.substring(0, 1000).replace(/\n\s*\n/g, '\n').trim();
                
                console.log(snippet);
                console.log('====================================================\n');
            } catch (err) {}
        }

        connection.end();
    } catch (error) {
        console.error(`Erro ao conectar na conta ${accountLabel}:`, error.message);
    }
}

async function startSearch() {
    const searchTerm = 'AWS';
    console.log(`\n[Atena] Iniciando busca por e-mails com "${searchTerm}"...\n`);
    await searchAccount(pIsEmpresa, 'EMPRESA (nexustreinamento)', searchTerm);
    await searchAccount(pIsPessoal, 'PESSOAL (gmail)', searchTerm);
    console.log('[Atena] Busca finalizada.');
}

startSearch();
