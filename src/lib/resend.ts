import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://queimaai.vercel.app';

function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0D0D0D;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111111;border-radius:16px;overflow:hidden;border:1px solid #1f1f1f;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#00AEEF18,#0D0D0D);padding:32px;border-bottom:1px solid #1f1f1f;text-align:center;">
          <p style="margin:0;font-size:30px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">Queima AI 🔥</p>
          <p style="margin:6px 0 0;font-size:12px;color:#00AEEF;font-weight:600;letter-spacing:1px;">SEU COACH DE FITNESS COM IA</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px 32px;">${content}</td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 32px;border-top:1px solid #1f1f1f;text-align:center;">
          <p style="margin:0;color:#4B5563;font-size:12px;">© 2025 Queima AI · Todos os direitos reservados</p>
          <p style="margin:8px 0 0;color:#374151;font-size:11px;">Você está recebendo este email porque se cadastrou no Queima AI.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const features = [
    { icon: '📸', title: 'Leitor de Calorias', desc: 'Fotografe sua refeição e descubra as calorias na hora' },
    { icon: '💪', title: 'Treino Personalizado', desc: 'Plano de exercícios montado pela IA para seu objetivo' },
    { icon: '🥗', title: 'Dieta com IA',        desc: 'Cardápio semanal baseado nos seus dados e metas' },
  ];

  const rows = features.map(f => `
    <tr><td style="padding:14px 0;border-bottom:1px solid #1f1f1f;">
      <table cellpadding="0" cellspacing="0"><tr>
        <td width="40" style="font-size:22px;vertical-align:middle;">${f.icon}</td>
        <td style="vertical-align:middle;padding-left:8px;">
          <p style="margin:0;color:#ffffff;font-size:15px;font-weight:600;">${f.title}</p>
          <p style="margin:2px 0 0;color:#6B7280;font-size:13px;">${f.desc}</p>
        </td>
      </tr></table>
    </td></tr>`).join('');

  const body = `
    <h2 style="margin:0 0 12px;font-size:24px;font-weight:800;color:#ffffff;">Bem-vindo, ${name}! 👋</h2>
    <p style="margin:0 0 28px;color:#9CA3AF;font-size:15px;line-height:1.7;">
      Seu perfil está pronto. Agora você tem acesso ao seu coach de fitness e nutrição com inteligência artificial.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">${rows}</table>
    <div style="text-align:center;margin-bottom:32px;">
      <a href="${APP_URL}/dashboard"
         style="display:inline-block;background:#00AEEF;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 36px;border-radius:50px;">
        Acessar o App →
      </a>
    </div>
    <div style="background:#1a1a1a;border-radius:12px;padding:18px 20px;border-left:3px solid #00AEEF;">
      <p style="margin:0 0 4px;color:#00AEEF;font-size:13px;font-weight:700;">💡 Dica de primeira vez</p>
      <p style="margin:0;color:#9CA3AF;font-size:13px;line-height:1.5;">
        Comece pelo <strong style="color:#ffffff;">Leitor de Calorias</strong> — tire uma foto da sua próxima refeição e veja a IA em ação!
      </p>
    </div>`;

  await resend.emails.send({
    from: 'Queima AI <onboarding@resend.dev>',
    to,
    subject: 'Bem-vindo ao Queima AI! 🔥',
    html: layout(body),
  });
}

export async function sendProConfirmationEmail(to: string, name: string, planName: string): Promise<void> {
  const perks = [
    '10 análises de comida por dia',
    '3 dietas geradas por dia',
    '5 treinos gerados por dia',
    'Histórico completo salvo',
    'Suporte prioritário',
  ];

  const rows = perks.map(p => `
    <tr><td style="padding:10px 0;border-bottom:1px solid #1f1f1f;color:#D1FAE5;font-size:14px;">
      ✅ &nbsp;${p}
    </td></tr>`).join('');

  const body = `
    <div style="text-align:center;margin-bottom:32px;">
      <p style="margin:0 0 12px;font-size:48px;">👑</p>
      <h2 style="margin:0 0 6px;font-size:26px;font-weight:900;color:#ffffff;">Você agora é PRO, ${name}!</h2>
      <p style="margin:0;font-size:13px;font-weight:700;color:#EAB308;letter-spacing:1px;">PLANO ${planName.toUpperCase()} ATIVO</p>
    </div>
    <p style="margin:0 0 24px;color:#9CA3AF;font-size:15px;line-height:1.7;text-align:center;">
      Sua assinatura foi confirmada. Aproveite acesso ilimitado a todas as funcionalidades premium.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">${rows}</table>
    <div style="text-align:center;margin-bottom:28px;">
      <a href="${APP_URL}/dashboard"
         style="display:inline-block;background:linear-gradient(135deg,#EAB308,#CA8A04);color:#000000;text-decoration:none;font-weight:800;font-size:15px;padding:14px 36px;border-radius:50px;">
        Aproveitar o PRO →
      </a>
    </div>
    <p style="margin:0;color:#6B7280;font-size:12px;text-align:center;line-height:1.6;">
      Para gerenciar ou cancelar sua assinatura, acesse <strong style="color:#9CA3AF;">Upgrade → Gerenciar Assinatura</strong> no app.<br>
      Cancele quando quiser, sem multas.
    </p>`;

  await resend.emails.send({
    from: 'Queima AI <onboarding@resend.dev>',
    to,
    subject: 'Sua assinatura PRO está ativa! 👑',
    html: layout(body),
  });
}
