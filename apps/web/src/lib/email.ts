import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendWaitlistConfirmation(email: string, name?: string) {
  const firstName = name?.split(" ")[0] || "there";

  return getResend().emails.send({
    from: "Teez <hello@teez.live>",
    to: email,
    subject: "You're on the Teez waitlist!",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #22c55e; font-size: 24px; margin-bottom: 16px;">Hey ${firstName}!</h1>
        <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6;">
          Thanks for joining the Teez waitlist. You're now in line for the first AI underwriting tool that lives inside your spreadsheet.
        </p>
        <p style="color: #94a3b8; font-size: 15px; line-height: 1.6;">
          We're building something different — not another web app that replaces your workflow, but an intelligent agent that augments it. Rent roll PDF in, full pro-forma populated in your Excel cells.
        </p>
        <p style="color: #94a3b8; font-size: 15px; line-height: 1.6;">
          We'll reach out soon with early access details. In the meantime, reply to this email if you'd like to share what asset types you work with or what your biggest underwriting pain point is.
        </p>
        <p style="color: #e2e8f0; font-size: 16px; margin-top: 32px;">
          — The Teez Team
        </p>
      </div>
    `,
  });
}
