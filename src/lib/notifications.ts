import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ─────────────────────────────────────────────
// Notification WhatsApp via CallMeBot (gratuit)
// ─────────────────────────────────────────────
export async function sendWhatsAppNotification(lead: {
  name: string;
  phone: string;
  car_label?: string;
  message: string;
}): Promise<void> {
  const phone = process.env.CALLMEBOT_PHONE;
  const apiKey = process.env.CALLMEBOT_APIKEY;

  if (!phone || !apiKey) {
    console.warn(
      "WhatsApp notification ignorée : CALLMEBOT_PHONE ou CALLMEBOT_APIKEY manquant",
    );
    return;
  }

  const text = [
    "🚗 *Nouveau lead AutoStore*",
    "",
    `👤 *Nom :* ${lead.name}`,
    `📞 *Téléphone :* ${lead.phone}`,
    lead.car_label ? `🚘 *Voiture :* ${lead.car_label}` : null,
    `💬 *Message :* ${lead.message}`,
    "",
    `👉 Répondre : https://wa.me/${lead.phone.replace(/\D/g, "")}`,
  ]
    .filter(Boolean)
    .join("\n");

  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", phone);
  url.searchParams.set("text", text);
  url.searchParams.set("apikey", apiKey);

  try {
    const res = await fetch(url.toString(), { method: "GET" });
    if (!res.ok) {
      console.error("CallMeBot error:", res.status, await res.text());
    }
  } catch (err) {
    console.error("WhatsApp notification failed:", err);
  }
}

// ─────────────────────────────────────────────
// Notification Email via Resend
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// Email via Resend
// ─────────────────────────────────────────────
export async function sendEmailNotification(lead: {
  name: string;
  phone: string;
  car_label?: string;
  message: string;
}): Promise<void> {
  const to = process.env.NOTIFICATION_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY manquant");
    return;
  }
  if (!to) {
    console.warn("[Email] NOTIFICATION_EMAIL manquant");
    return;
  }

  // ⚠️  IMPORTANT : le domaine "from" doit être vérifié dans Resend
  // Si votre domaine n'est pas encore vérifié, utilisez le domaine
  // de test Resend : onboarding@resend.dev (limité à votre propre email)
  const fromAddress = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  const waLink = `https://wa.me/${lead.phone.replace(/\D/g, "")}`;
  const adminLink = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/admin/leads`;

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [to],
      subject: `🚗 Nouveau lead AutoStore : ${lead.name}${lead.car_label ? ` — ${lead.car_label}` : ""}`,
      html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0D0D0D;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0D0D;padding:32px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- Header -->
        <tr><td style="background:#141414;border-radius:16px 16px 0 0;padding:28px 32px;border-bottom:1px solid #2A2A2A">
          <h1 style="margin:0;font-size:28px;letter-spacing:4px;color:#F5F2EC">
            AUTO<span style="color:#C9A84C">STORE</span>
          </h1>
          <p style="margin:6px 0 0;font-size:13px;color:#8A8A8A;letter-spacing:1px;text-transform:uppercase">
            Nouveau message client
          </p>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#141414;padding:32px">
          <div style="background:#1A1A1A;border:1px solid #2A2A2A;border-radius:12px;padding:24px;margin-bottom:24px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:10px 0;border-bottom:1px solid #222">
                <div style="color:#8A8A8A;font-size:11px;text-transform:uppercase;letter-spacing:1px">Nom</div>
                <div style="color:#F5F2EC;font-size:16px;font-weight:600;margin-top:4px">${lead.name}</div>
              </td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #222">
                <div style="color:#8A8A8A;font-size:11px;text-transform:uppercase;letter-spacing:1px">Téléphone</div>
                <div style="margin-top:4px">
                  <a href="tel:${lead.phone}" style="color:#C9A84C;font-size:16px;font-weight:600;text-decoration:none">${lead.phone}</a>
                </div>
              </td></tr>
              ${
                lead.car_label
                  ? `
              <tr><td style="padding:10px 0;border-bottom:1px solid #222">
                <div style="color:#8A8A8A;font-size:11px;text-transform:uppercase;letter-spacing:1px">Véhicule</div>
                <div style="color:#F5F2EC;font-size:15px;margin-top:4px">🚘 ${lead.car_label}</div>
              </td></tr>`
                  : ""
              }
              <tr><td style="padding:10px 0">
                <div style="color:#8A8A8A;font-size:11px;text-transform:uppercase;letter-spacing:1px">Message</div>
                <div style="color:#F5F2EC;font-size:15px;line-height:1.7;margin-top:8px;white-space:pre-line">${lead.message}</div>
              </td></tr>
            </table>
          </div>

          <!-- CTAs -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:8px" width="50%">
                <a href="${waLink}" style="display:block;background:#25D366;color:#fff;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px">
                  💬 Répondre sur WhatsApp
                </a>
              </td>
              <td style="padding-left:8px" width="50%">
                <a href="${adminLink}" style="display:block;background:#C9A84C;color:#0D0D0D;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px">
                  🖥️ Voir dans l'admin
                </a>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#0D0D0D;border-radius:0 0 16px 16px;padding:20px 32px;border-top:1px solid #1A1A1A;text-align:center">
          <p style="margin:0;color:#8A8A8A;font-size:12px">
            AutoLuxe Congo · Pointe-Noire · Notification automatique
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });

    if (error) {
      console.error("[Email] Resend API error:", JSON.stringify(error));
    } else {
      console.log("[Email] Notification envoyée avec succès. ID:", data?.id);
    }
  } catch (err) {
    console.error("[Email] Exception:", err);
  }
}

// ─────────────────────────────────────────────
// Envoyer les deux en parallèle
// ─────────────────────────────────────────────
export async function notifyNewLead(lead: {
  name: string;
  phone: string;
  car_label?: string;
  message: string;
}): Promise<void> {
  await Promise.allSettled([
    sendWhatsAppNotification(lead),
    sendEmailNotification(lead),
  ]);
}
