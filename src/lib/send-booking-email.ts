import { Resend } from "resend";

type BookingEmailInput = {
  to: string;
  name: string;
  hotelName: string;
  whenLabel: string; // already-formatted date + time
  locale: "en" | "ar";
};

// Localized, self-contained copy (email clients don't share the app's i18n).
const COPY = {
  en: {
    subject: "Your Revstay consultation request",
    dir: "ltr",
    greeting: (n: string) => `Hi ${n},`,
    intro:
      "Thanks for booking a free consultation with Revstay. We've received your request and will be in touch to confirm.",
    hotelLabel: "Hotel",
    whenLabel: "Requested time",
    outro:
      "We'll review your hotel's presence and show you where the opportunities are. See you soon!",
    signoff: "— The Revstay team",
  },
  ar: {
    subject: "طلب استشارتك مع Revstay",
    dir: "rtl",
    greeting: (n: string) => `أهلاً ${n},`,
    intro:
      "شكراً لحجزك استشارة مجانية مع Revstay. استلمنا طلبك وهنتواصل معاك نأكّد.",
    hotelLabel: "الفندق",
    whenLabel: "الميعاد المطلوب",
    outro: "هنراجع وجود فندقك ونوريك فين الفرص. نشوفك قريب!",
    signoff: "— فريق Revstay",
  },
} as const;

/**
 * Sends the booking confirmation email. Best-effort: any failure (missing
 * key, Resend error) is logged and swallowed so it never blocks the
 * booking itself. Never logs the API key.
 */
export async function sendBookingConfirmation(
  input: BookingEmailInput
): Promise<{ sent: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM_EMAIL;
  if (!apiKey || !from) {
    return { sent: false };
  }

  const c = COPY[input.locale] ?? COPY.en;
  const resend = new Resend(apiKey);

  const html = `
    <div dir="${c.dir}" style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#faf6ef;padding:32px;color:#2b2620">
      <div style="max-width:520px;margin:0 auto;background:#fffdf9;border:1px solid #eee2cf;border-radius:16px;padding:28px">
        <h1 style="font-size:20px;margin:0 0 16px;color:#8a6c17">Revstay</h1>
        <p style="margin:0 0 12px">${c.greeting(escapeHtml(input.name))}</p>
        <p style="margin:0 0 16px;line-height:1.6;color:#57503f">${c.intro}</p>
        <table style="width:100%;border-collapse:collapse;margin:0 0 16px">
          <tr>
            <td style="padding:8px 0;color:#7c7059;font-size:14px">${c.hotelLabel}</td>
            <td style="padding:8px 0;font-weight:600;text-align:${c.dir === "rtl" ? "left" : "right"}">${escapeHtml(input.hotelName)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#7c7059;font-size:14px">${c.whenLabel}</td>
            <td style="padding:8px 0;font-weight:600;text-align:${c.dir === "rtl" ? "left" : "right"}">${escapeHtml(input.whenLabel)}</td>
          </tr>
        </table>
        <p style="margin:0 0 20px;line-height:1.6;color:#57503f">${c.outro}</p>
        <p style="margin:0;color:#7c7059;font-size:14px">${c.signoff}</p>
      </div>
    </div>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to: input.to,
      subject: c.subject,
      html,
    });
    if (error) {
      console.error("Resend send error:", error.message);
      return { sent: false };
    }
    return { sent: true };
  } catch (err) {
    console.error("Resend send threw:", err instanceof Error ? err.message : err);
    return { sent: false };
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
