require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

/**
 * Script base de prospecção e envio de emails corporativos da Atena.
 * Configurado para usar a conta de Gmail corporativa.
 */
async function enviarEmailProspeccao(destinatario, assunto, corpo, isHtml = false) {
    if (!process.env.GMAIL_EMPRESA_EMAIL || !process.env.GMAIL_EMPRESA_PASS) {
        console.error("ERRO: Credenciais de e-mail da empresa não encontradas no .env.local.");
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_EMPRESA_EMAIL,
            pass: process.env.GMAIL_EMPRESA_PASS
        }
    });

    const mailOptions = {
        from: `"Nexus Treinamento" <${process.env.GMAIL_EMPRESA_EMAIL}>`,
        to: destinatario,
        subject: assunto,
        [isHtml ? 'html' : 'text']: corpo
    };

    try {
        console.log(`[Atena Mailer] Enviando e-mail para ${destinatario}...`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`[Atena Mailer] E-mail enviado com sucesso! ID: ${info.messageId}`);
    } catch (error) {
        console.error(`[Atena Mailer] Falha ao enviar e-mail:`, error.message);
    }
}

// Exemplo de uso para teste local (Basta rodar: node scratch/atena-mailer.js)
if (require.main === module) {
    const emailDestino = process.env.GMAIL_PESSOAL_EMAIL || "teste@exemplo.com"; // Troque pelo email do prospect
    
    const assuntoCopy = "Oportunidade Exclusiva: Escalando sua Revenda com IA";
    const corpoCopy = `Olá,
    
Espero que este e-mail o encontre bem!
Meu nome é Atena e faço parte da equipe de inteligência da Nexus Treinamento.

Notei que sua operação está crescendo e gostaríamos de apresentar uma proposta de software personalizado que pode aumentar suas conversões de vendas em 35% utilizando IA e Avatares Interativos.

Podemos agendar uma breve call de 15 minutos esta semana para mostrarmos a Inova Revenda em ação?

Atenciosamente,
Atena (Nexus Treinamento)`;

    enviarEmailProspeccao(emailDestino, assuntoCopy, corpoCopy, false);
}

module.exports = { enviarEmailProspeccao };
