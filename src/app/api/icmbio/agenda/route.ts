import { NextRequest, NextResponse } from 'next/server';
import { getICMBioBookings, saveICMBioBooking, deleteICMBioBooking, getBlockedDates, getICMBioSettings, ICMBioBooking } from '@/lib/icmbio-db';
import nodemailer from 'nodemailer';

// Helper para enviar e-mails usando o SMTP corporativo do Gmail do Gean
async function sendNotificationEmail(booking: ICMBioBooking, type: 'novo' | 'cancelado' | 'reagendado') {
  const gUser = process.env.GMAIL_EMPRESA_EMAIL || '';
  const gPass = (process.env.GMAIL_EMPRESA_PASS || '').replace(/\s+/g, '');

  if (!gUser || !gPass) {
    console.warn('[ICMBio API Agenda] Credenciais de e-mail ausentes no .env. Ignorando envio.');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: gUser, pass: gPass },
  });

  // Tema Visual Cyber-Eco (Verde Esmeralda e Dark)
  let title = '';
  let statusText = '';
  let colorTheme = '#10b981'; // Emerald

  if (type === 'novo') {
    title = 'Agendamento Realizado';
    statusText = 'Confirmado com Sucesso';
  } else if (type === 'cancelado') {
    title = 'Agendamento Cancelado';
    statusText = 'Cancelado';
    colorTheme = '#ef4444'; // Red
  } else if (type === 'reagendado') {
    title = 'Agendamento Reagendado';
    statusText = 'Remarcado com Sucesso';
    colorTheme = '#3b82f6'; // Blue
  }

  const emailHtml = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #020804; color: #f3f4f6; padding: 40px 20px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #064e3b;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="display: inline-block; width: 60px; height: 60px; line-height: 60px; border-radius: 16px; background-color: #064e3b; border: 1px solid ${colorTheme}; color: ${colorTheme}; font-size: 26px; font-weight: bold; text-shadow: 0 0 10px rgba(16,185,129, 0.3);">🌿</div>
        <h2 style="color: #ffffff; margin-top: 15px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;">${title}</h2>
        <p style="color: ${colorTheme}; font-size: 11px; font-weight: bold; letter-spacing: 0.2em; text-transform: uppercase; margin: 0;">ICMBio Agenda Digital</p>
      </div>

      <div style="background-color: #03140a; border: 1px solid #064e3b; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
        <p style="margin-top: 0; color: #a7f3d0; font-size: 14px;">Olá, <strong>${booking.partnerName}</strong>,</p>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
          Notificamos que o status da sua reunião técnica de alinhamento com a equipe do <strong>ICMBio</strong> foi atualizado.
        </p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; color: #cbd5e1;">
          <tr>
            <td style="padding: 8px 0; color: #047857; font-weight: bold; width: 120px;">STATUS:</td>
            <td style="padding: 8px 0; font-weight: bold; color: ${colorTheme};">${statusText}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #047857; font-weight: bold;">PARCEIRO / ÓRGÃO:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #ffffff;">${booking.partnerCompany}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #047857; font-weight: bold;">SERVIÇO:</td>
            <td style="padding: 8px 0;">${booking.productName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #047857; font-weight: bold;">DATA:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #10b981;">${booking.selectedDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #047857; font-weight: bold;">HORÁRIO:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #10b981;">${booking.selectedTime} (Horário de Brasília)</td>
          </tr>
          ${booking.vesselName ? `
          <tr>
            <td style="padding: 8px 0; color: #047857; font-weight: bold;">EMBARCAÇÃO:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #ffffff;">${booking.vesselName} (Condutor: ${booking.vesselCaptain})</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #047857; font-weight: bold;">CAPACIDADE:</td>
            <td style="padding: 8px 0;">${booking.vesselCapacity} passageiros (Reg: ${booking.vesselAuthNumber})</td>
          </tr>
          ` : ''}
          ${type === 'cancelado' ? `
          <tr>
            <td style="padding: 8px 0; color: #ef4444; font-weight: bold;">MOTIVO CANCELAMENTO:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #f87171;">${booking.cancelReason} (${booking.cancelCategory})</td>
          </tr>
          ${booking.cancelNotes ? `
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">DETALHES:</td>
            <td style="padding: 8px 0; italic; color: #94a3b8;">"${booking.cancelNotes}"</td>
          </tr>
          ` : ''}
          ` : ''}
        </table>
      </div>

      <div style="text-align: center; margin-bottom: 30px;">
        <p style="color: #64748b; font-size: 11px; margin-bottom: 15px;">
          Para consultar ou modificar seus agendamentos, acesse o painel informando seu e-mail corporativo.
        </p>
        <a href="https://nexustreinamento.com/icmbio/agenda" target="_blank" style="display: inline-block; background-color: #047857; color: #ffffff; font-weight: bold; text-decoration: none; padding: 12px 25px; border-radius: 8px; border: 1px solid #10b981; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2); text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em;">
          Acessar Portal da Agenda
        </a>
      </div>

      <p style="color: #064e3b; font-size: 9px; text-align: center; margin: 0; line-height: 1.5;">
        Este e-mail e suas informações são de uso restrito do destinatário e do ICMBio.<br />
        Tecnologia de Agendamento Soberano operada por Nexus Holding Group.
      </p>
    </div>
  `;

  // Dispara e-mail para o parceiro
  try {
    await transporter.sendMail({
      from: `"ICMBio Agenda Digital" <${gUser}>`,
      to: booking.partnerEmail,
      subject: `[ICMBio] ${title} — ${booking.selectedDate} às ${booking.selectedTime}`,
      html: emailHtml,
    });
    console.log(`[ICMBio API] E-mail enviado com sucesso para ${booking.partnerEmail}`);
  } catch (err) {
    console.error('[ICMBio API] Falha ao enviar e-mail para parceiro:', err);
  }

  // Notifica os administradores (Gean/ICMBio equipe)
  try {
    await transporter.sendMail({
      from: `"Notificações ICMBio" <${gUser}>`,
      to: ['geanderson@nexusholdinggroup.com.br', 'suporte@nexustreinamento.com'],
      subject: `🚨 Atualização Agenda ICMBio: ${booking.partnerCompany} (${type.toUpperCase()})`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Alteração de Agendamento no Painel ICMBio</h2>
          <p><strong>Parceiro:</strong> ${booking.partnerName} (${booking.partnerCompany})</p>
          <p><strong>Ação:</strong> ${type.toUpperCase()}</p>
          <p><strong>Data/Hora:</strong> ${booking.selectedDate} às ${booking.selectedTime}</p>
          <p><strong>E-mail:</strong> ${booking.partnerEmail} | <strong>WhatsApp:</strong> ${booking.partnerPhone}</p>
          ${booking.vesselName ? `
            <p><strong>Embarcação:</strong> ${booking.vesselName} (Condutor: ${booking.vesselCaptain})</p>
            <p><strong>Capacidade:</strong> ${booking.vesselCapacity} pessoas (Reg: ${booking.vesselAuthNumber})</p>
          ` : ''}
          ${type === 'cancelado' ? `<p><strong>Motivo do Cancelamento:</strong> ${booking.cancelReason} [Categoria: ${booking.cancelCategory}]</p>` : ''}
          <a href="https://nexustreinamento.com/icmbio/admin">Acessar Painel Admin ICMBio</a>
        </div>
      `,
    });
  } catch (err) {
    console.error('[ICMBio API] Falha ao enviar e-mail de notificação para administradores:', err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    const bookings = await getICMBioBookings();

    if (email) {
      // Filtrar reservas do parceiro (compara de forma case-insensitive)
      const filtered = bookings.filter(b => b.partnerEmail.toLowerCase() === email.toLowerCase());
      return NextResponse.json({ bookings: filtered });
    }

    return NextResponse.json({ bookings });
  } catch (error: any) {
    console.error('[ICMBio API GET Error]', error);
    return NextResponse.json({ error: error.message || 'Erro ao carregar agendamentos.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { 
      partnerName, partnerEmail, partnerPhone, partnerCompany, productName, selectedDate, selectedTime, reason,
      vesselName, vesselCaptain, vesselCapacity, vesselAuthNumber,
      captainLicenseNumber, captainLicenseExpiry, captainLicenseIssuer,
      segment, guideName, guideCadastur, groupSize, trailName,
      diveInstructorId, diveSpot, flightSpot
    } = await req.json();

    if (!partnerName || !partnerEmail || !partnerPhone || !partnerCompany || !productName || !selectedDate || !selectedTime) {
      return NextResponse.json({ error: 'Parâmetros obrigatórios ausentes.' }, { status: 400 });
    }

    // 1. Converter formato de data se necessário
    let formattedDate = selectedDate;
    if (selectedDate.includes('-')) {
      const [year, month, day] = selectedDate.split('-');
      formattedDate = `${day}/${month}/${year}`;
    }

    // 2. Verificar se a data está bloqueada
    const blockedDates = await getBlockedDates();
    if (blockedDates.includes(selectedDate) || blockedDates.includes(formattedDate)) {
      return NextResponse.json({ error: 'A data selecionada foi bloqueada pelo administrador do ICMBio.' }, { status: 403 });
    }

    // 3. Verificar conflito de data/horário (slot de 1 hora ocupado)
    const bookings = await getICMBioBookings();
    const isTaken = bookings.some(
      b => b.selectedDate === formattedDate && b.selectedTime === selectedTime && b.status !== 'Cancelado'
    );

    if (isTaken) {
      return NextResponse.json({ error: 'Este horário já está reservado. Por favor, selecione outro.' }, { status: 409 });
    }

    // 4. Limite diário dinâmico de operadores configurado pelo ICMBio
    const settings = getICMBioSettings();
    const dailyLimit = settings.dailyOperatorLimit || 20;
    const dailyBookingsCount = bookings.filter(
      b => b.selectedDate === formattedDate && b.status !== 'Cancelado'
    ).length;

    if (dailyBookingsCount >= dailyLimit) {
      return NextResponse.json({ error: `Limite diário de ${dailyLimit} embarcações ativas para esta data foi atingido.` }, { status: 429 });
    }

    // 5. Criar reserva
    const newBooking: ICMBioBooking = {
      id: Date.now(),
      partnerName,
      partnerEmail,
      partnerPhone,
      partnerCompany,
      productName,
      selectedDate: formattedDate,
      selectedTime,
      reason: reason || '',
      status: 'Confirmado',
      vesselName: vesselName || '',
      vesselCaptain: vesselCaptain || '',
      vesselCapacity: vesselCapacity || '',
      vesselAuthNumber: vesselAuthNumber || '',
      captainLicenseNumber: captainLicenseNumber || '',
      captainLicenseExpiry: captainLicenseExpiry || '',
      captainLicenseIssuer: captainLicenseIssuer || '',
      segment: segment || 'barco',
      guideName: guideName || '',
      guideCadastur: guideCadastur || '',
      groupSize: groupSize || '',
      trailName: trailName || '',
      diveInstructorId: diveInstructorId || '',
      diveSpot: diveSpot || '',
      flightSpot: flightSpot || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const success = await saveICMBioBooking(newBooking);
    if (!success) {
      return NextResponse.json({ error: 'Erro ao salvar agendamento.' }, { status: 500 });
    }

    // Disparar e-mail em background
    sendNotificationEmail(newBooking, 'novo').catch(e => console.error(e));

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error: any) {
    console.error('[ICMBio API POST Error]', error);
    return NextResponse.json({ error: error.message || 'Erro ao criar agendamento.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: 'ID da reserva é obrigatório.' }, { status: 400 });
    }

    const bookings = await getICMBioBookings();
    const existing = bookings.find(b => b.id === data.id);

    if (!existing) {
      return NextResponse.json({ error: 'Agendamento não encontrado.' }, { status: 404 });
    }

    // Se houver alteração de data/hora (reagendamento)
    if (data.selectedDate && data.selectedTime && (data.selectedDate !== existing.selectedDate || data.selectedTime !== existing.selectedTime)) {
      let newFormattedDate = data.selectedDate;
      if (data.selectedDate.includes('-')) {
        const [year, month, day] = data.selectedDate.split('-');
        newFormattedDate = `${day}/${month}/${year}`;
      }

      // Validar data bloqueada
      const blockedDates = await getBlockedDates();
      if (blockedDates.includes(data.selectedDate) || blockedDates.includes(newFormattedDate)) {
        return NextResponse.json({ error: 'A nova data selecionada está bloqueada pelo administrador.' }, { status: 403 });
      }

      // Validar conflito de slot
      const isTaken = bookings.some(
        b => b.id !== data.id && b.selectedDate === newFormattedDate && b.selectedTime === data.selectedTime && b.status !== 'Cancelado'
      );

      if (isTaken) {
        return NextResponse.json({ error: 'O novo horário selecionado já está ocupado.' }, { status: 409 });
      }

      // Validar limite diário dinâmico de operadores
      const settings = getICMBioSettings();
      const dailyLimit = settings.dailyOperatorLimit || 20;
      const dailyCount = bookings.filter(
        b => b.id !== data.id && b.selectedDate === newFormattedDate && b.status !== 'Cancelado'
      ).length;

      if (dailyCount >= dailyLimit) {
        return NextResponse.json({ error: `A data de destino atingiu o limite de ${dailyLimit} embarcações ativas.` }, { status: 429 });
      }

      existing.selectedDate = newFormattedDate;
      existing.selectedTime = data.selectedTime;
      existing.updatedAt = new Date().toISOString();
      
      const success = await saveICMBioBooking(existing);
      if (success) {
        sendNotificationEmail(existing, 'reagendado').catch(e => console.error(e));
        return NextResponse.json({ success: true, booking: existing });
      }
    }

    // Se for um cancelamento
    if (data.status === 'Cancelado') {
      existing.status = 'Cancelado';
      existing.cancelReason = data.cancelReason || 'Cancelamento solicitado pelo parceiro';
      existing.cancelCategory = data.cancelCategory || 'Outro';
      existing.cancelNotes = data.cancelNotes || '';
      existing.updatedAt = new Date().toISOString();

      const success = await saveICMBioBooking(existing);
      if (success) {
        sendNotificationEmail(existing, 'cancelado').catch(e => console.error(e));
        return NextResponse.json({ success: true, booking: existing });
      }
    }

    // Outras alterações (Admin editando campos gerais)
    const updatedBooking: ICMBioBooking = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString()
    };

    const success = await saveICMBioBooking(updatedBooking);
    if (!success) {
      return NextResponse.json({ error: 'Erro ao atualizar agendamento.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error: any) {
    console.error('[ICMBio API PUT Error]', error);
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

    const success = await deleteICMBioBooking(Number(idStr));
    if (!success) {
      return NextResponse.json({ error: 'Erro ao excluir agendamento.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[ICMBio API DELETE Error]', error);
    return NextResponse.json({ error: error.message || 'Erro ao excluir agendamento.' }, { status: 500 });
  }
}
