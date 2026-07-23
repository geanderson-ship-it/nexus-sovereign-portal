import { NextRequest, NextResponse } from 'next/server';
import { getAppointments, saveAppointment, AgendaItem } from '@/lib/agenda-db';
import nodemailer from 'nodemailer';

// Helper para enviar e-mails usando o SMTP do Gmail do Gean
async function sendNotificationEmails(appointment: any) {
  const gUser = process.env.GMAIL_EMPRESA_EMAIL || 'geanderson@nexustreinamento.com';
  const gPass = (process.env.GMAIL_EMPRESA_PASS || 'wvcd ntmu hxou ejht').replace(/\s+/g, ''); // remove espaços

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: gUser,
      pass: gPass,
    },
  });

  // 1. Corpo de E-mail para o CLIENTE (Visual Premium)
  const clientHtml = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #030712; color: #f3f4f6; padding: 40px 20px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #1f2937;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="display: inline-block; width: 50px; height: 50px; line-height: 50px; border-radius: 12px; background-color: #1e1b4b; border: 1px solid #eab308; color: #eab308; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px rgba(234, 179, 8, 0.3);">N</div>
        <h2 style="color: #ffffff; margin-top: 15px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;">Reunião Confirmada</h2>
        <p style="color: #eab308; font-size: 11px; font-weight: bold; letter-spacing: 0.2em; text-transform: uppercase; margin: 0;">Nexus Holding Group</p>
      </div>

      <div style="background-color: #0b0f19; border: 1px solid #1e293b; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
        <p style="margin-top: 0; color: #94a3b8; font-size: 14px;">Olá, <strong>${appointment.anfitriao}</strong>,</p>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
          Seu agendamento de alinhamento tático com o <strong>Diretor Geanderson</strong> foi concluído com sucesso. Abaixo estão as credenciais exclusivas da sua sala segura:
        </p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; color: #cbd5e1;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold; width: 100px;">EMPRESA:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #ffffff;">${appointment.empresa}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">ASSUNTO:</td>
            <td style="padding: 8px 0;">${appointment.assunto}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">DATA:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #eab308;">${appointment.data}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">HORÁRIO:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #eab308;">${appointment.horario} (Horário de Brasília)</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin-bottom: 30px;">
        <p style="color: #94a3b8; font-size: 12px; margin-bottom: 15px;">Acesse a sala de videoconferência soberana no horário agendado clicando abaixo:</p>
        <a href="${appointment.local}" target="_blank" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-weight: bold; text-decoration: none; padding: 14px 30px; border-radius: 8px; border: 1px solid #6366f1; box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4); text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em;">
          Acessar Nexus Meet
        </a>
      </div>

      <p style="color: #475569; font-size: 10px; text-align: center; margin: 0; line-height: 1.5;">
        Esta comunicação e o canal da sala de reuniões são criptografados de ponta a ponta pela arquitetura Nexus.<br />
        Nexus Holding Group — Tecnologia Soberana de Negócios.
      </p>
    </div>
  `;

  // 2. Corpo de E-mail para os ANFITRIÕES (Gean & Vendas)
  const hostHtml = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #020617; color: #f8fafc; padding: 40px 20px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #334155;">
      <div style="text-align: center; margin-bottom: 30px;">
        <span style="background-color: #ef4444; color: #ffffff; font-size: 10px; font-weight: bold; padding: 4px 12px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.2em;">Novo Agendamento Confirmado</span>
        <h2 style="color: #ffffff; margin-top: 15px; font-weight: 800; text-transform: uppercase;">Apresentação Solicitada</h2>
        <p style="color: #38bdf8; font-size: 11px; font-weight: bold; letter-spacing: 0.15em; text-transform: uppercase; margin: 0;">Nexus Holding Group</p>
      </div>

      <div style="background-color: #0f172a; border: 1px solid #1e293b; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
        <p style="margin-top: 0; color: #94a3b8; font-size: 14px;">Diretoria Nexus,</p>
        <p style="color: #e2e8f0; font-size: 14px; line-height: 1.6;">
          Um novo cliente realizou o agendamento de uma apresentação comercial e de alinhamento tático diretamente pelo portal.
        </p>

        <h3 style="color: #38bdf8; font-size: 13px; border-b: 1px solid #334155; padding-bottom: 6px; margin-top: 20px;">DADOS DO LEAD / CLIENTE</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #e2e8f0;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: bold; width: 120px;">CONTATO:</td>
            <td style="padding: 6px 0; font-weight: bold;">${appointment.anfitriao}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: bold;">EMPRESA:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${appointment.empresa}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: bold;">E-MAIL:</td>
            <td style="padding: 6px 0;"><a href="mailto:${appointment.email}" style="color: #38bdf8; text-decoration: none;">${appointment.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: bold;">WHATSAPP:</td>
            <td style="padding: 6px 0;"><a href="https://wa.me/${appointment.whatsapp.replace(/\D/g, '')}" target="_blank" style="color: #38bdf8; text-decoration: none;">${appointment.whatsapp}</a></td>
          </tr>
        </table>

        <h3 style="color: #38bdf8; font-size: 13px; border-b: 1px solid #334155; padding-bottom: 6px; margin-top: 20px;">INFORMAÇÕES DA REUNIÃO</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #e2e8f0;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: bold; width: 120px;">ASSUNTO:</td>
            <td style="padding: 6px 0;">${appointment.assunto}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: bold;">DATA / HORÁRIO:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #eab308;">${appointment.data} às ${appointment.horario}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: bold;">LINK SALA MEET:</td>
            <td style="padding: 6px 0;"><a href="${appointment.local}" style="color: #38bdf8; word-break: break-all;">${appointment.local}</a></td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin-bottom: 20px;">
        <a href="${appointment.local}" target="_blank" style="display: inline-block; background-color: #0284c7; color: #ffffff; font-weight: bold; text-decoration: none; padding: 12px 25px; border-radius: 6px; text-transform: uppercase; font-size: 12px; border: 1px solid #0ea5e9;">
          Iniciar Sala Nexus Meet (Host)
        </a>
      </div>
    </div>
  `;

  // Dispara e-mails
  try {
    // E-mail 1: Para os anfitriões (Gean e Vendas)
    await transporter.sendMail({
      from: `"Nexus Agenda Core" <${gUser}>`,
      to: ['geanderson@nexustreinamento.com', 'vendas@nexustreinamento.com'],
      subject: `🚨 Novo Agendamento: ${appointment.empresa} — ${appointment.horario} em ${appointment.data}`,
      html: hostHtml,
    });
    console.log('[API Agenda] Notificação enviada para os hosts.');
  } catch (err) {
    console.error('[API Agenda] Falha ao enviar e-mail de notificação para hosts:', err);
  }

  try {
    // E-mail 2: Para o cliente (se for e-mail válido)
    if (appointment.email && appointment.email.includes('@')) {
      await transporter.sendMail({
        from: `"Nexus Holding Group" <${gUser}>`,
        to: appointment.email,
        subject: `Confirmação de Reunião — ${appointment.data} às ${appointment.horario}`,
        html: clientHtml,
      });
      console.log('[API Agenda] Confirmação enviada para o cliente:', appointment.email);
    }
  } catch (err) {
    console.error('[API Agenda] Falha ao enviar e-mail de confirmação para cliente:', err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const appointments = await getAppointments();
    return NextResponse.json({ appointments });
  } catch (error: any) {
    console.error('[API Agenda GET Error]', error);
    return NextResponse.json({ error: error.message || 'Erro ao carregar agenda.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nome, email, whatsapp, empresa, assunto, data, horario } = await req.json();

    if (!nome || !email || !whatsapp || !empresa || !data || !horario) {
      return NextResponse.json({ error: 'Parâmetros obrigatórios ausentes.' }, { status: 400 });
    }

    // 1. Carrega os compromissos existentes para verificação rigorosa de concorrência
    const existingAppointments = await getAppointments();

    // 2. Formata a data de AAAA-MM-DD para DD/MM/AAAA
    let formattedDate = data;
    if (data.includes('-')) {
      const [year, month, day] = data.split('-');
      formattedDate = `${day}/${month}/${year}`;
    }

    // 3. Garante que não ocorra concorrência/duplo agendamento no mesmo horário
    const isTaken = existingAppointments.some(
      app => app.data === formattedDate && app.horario === horario && app.status === 'Confirmado'
    );

    if (isTaken) {
      return NextResponse.json({ 
        error: 'Este horário acabou de ser reservado por outro cliente. Por favor, selecione outro dia ou horário disponível.' 
      }, { status: 409 });
    }

    // 2. Gerar sala e link real no meet
    const roomId = 'room-' + Math.random().toString(36).substring(2, 9);
    const meetUrl = `https://nexustreinamento.com/gabinete/meet?room=${roomId}&join=true`;

    // 3. Cria o novo agendamento
    const newAppointment: AgendaItem = {
      id: Date.now(),
      evento: `${empresa} — Reunião Estratégica`,
      data: formattedDate,
      horario: horario,
      local: meetUrl,
      anfitriao: nome,
      assunto: assunto || 'Apresentação de Soluções Soberanas',
      observacoes: `Agendamento automático via portal. E-mail: ${email} | WhatsApp: ${whatsapp}`,
      status: 'Confirmado',
      desfecho: 'Em Aberto',
    };

    // 4. Salva no banco compartilhado (JSON + DynamoDB)
    const success = await saveAppointment(newAppointment);

    if (!success) {
      return NextResponse.json({ error: 'Erro ao salvar agendamento no banco.' }, { status: 500 });
    }

    // 5. Envia notificações de e-mail em segundo plano para não impactar na resposta da API
    sendNotificationEmails({
      ...newAppointment,
      empresa,
      email,
      whatsapp,
    }).catch(err => {
      console.error('[API Agenda] Erro geral ao enviar notificações por e-mail:', err);
    });

    return NextResponse.json({ 
      success: true, 
      appointment: newAppointment, 
      meetLink: meetUrl 
    });
  } catch (error: any) {
    console.error('[API Agenda POST Error]', error);
    return NextResponse.json({ error: error.message || 'Erro ao processar agendamento.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const appointment = await req.json();
    if (!appointment.id) {
      return NextResponse.json({ error: 'ID é obrigatório.' }, { status: 400 });
    }
    const success = await saveAppointment(appointment);
    if (!success) {
      return NextResponse.json({ error: 'Erro ao atualizar agendamento.' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API Agenda PUT Error]', error);
    return NextResponse.json({ error: error.message || 'Erro ao atualizar agendamento.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idStr = searchParams.get('id');
    if (!idStr) {
      return NextResponse.json({ error: 'ID é obrigatório.' }, { status: 400 });
    }
    const success = await deleteAppointment(Number(idStr));
    if (!success) {
      return NextResponse.json({ error: 'Erro ao deletar agendamento.' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API Agenda DELETE Error]', error);
    return NextResponse.json({ error: error.message || 'Erro ao deletar agendamento.' }, { status: 500 });
  }
}
