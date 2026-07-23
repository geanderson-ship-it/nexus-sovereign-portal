import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { to, sender, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: 'Parâmetros obrigatórios ausentes.' }, { status: 400 });
    }

    // Identifica credenciais corretas do remetente
    let fromEmail = process.env.GMAIL_EMPRESA_EMAIL || 'geanderson@nexustreinamento.com';
    let fromPass = (process.env.GMAIL_EMPRESA_PASS || '').replace(/\s+/g, '');

    if (sender === 'vendas@nexustreinamento.com') {
      fromEmail = process.env.GMAIL_VENDAS_EMAIL || 'vendas@nexustreinamento.com';
      fromPass = (process.env.GMAIL_VENDAS_PASS || '').replace(/\s+/g, '');
    }

    // Configura o transportador SMTP do Gmail corporativo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: fromEmail,
        pass: fromPass,
      },
    });

    // Converte o corpo do texto do e-mail para HTML básico com quebras de linha para manter formatação premium
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #020617; color: #cbd5e1; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
        <div style="text-align: center; margin-bottom: 25px; border-bottom: 1px solid #1e293b; padding-bottom: 15px;">
          <div style="display: inline-block; width: 45px; height: 45px; line-height: 45px; border-radius: 10px; background-color: #1e1b4b; border: 1px solid #eab308; color: #eab308; font-size: 20px; font-weight: bold; text-align: center;">N</div>
          <h3 style="color: #ffffff; margin-top: 10px; margin-bottom: 5px; font-size: 16px; uppercase tracking-widest;">NEXUS HOLDING GROUP</h3>
          <span style="color: #64748b; font-size: 10px; font-weight: bold; uppercase; letter-spacing: 0.1em;">Comunicação Soberana Criptografada</span>
        </div>
        
        <div style="font-size: 13px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap;">
          ${body.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        </div>

        <div style="margin-top: 30px; border-top: 1px solid #1e293b; padding-top: 15px; text-align: center; font-size: 9px; color: #475569;">
          Este e-mail corporativo foi processado via canal seguro corporativo Nexus.<br />
          Nexus Holding Group — Tecnologia Soberana de Negócios.
        </div>
      </div>
    `;

    // Dispara o e-mail real
    await transporter.sendMail({
      from: `"Diretoria Nexus" <${fromEmail}>`,
      to,
      subject,
      text: body,
      html: htmlContent,
    });

    console.log(`[API Send Invite] E-mail enviado com sucesso de ${fromEmail} para ${to}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API Send Invite Error]', error);
    return NextResponse.json({ error: error.message || 'Erro ao enviar e-mail por SMTP.' }, { status: 500 });
  }
}
