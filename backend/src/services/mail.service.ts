import transporter from "../config/mail.js";
import env from "../config/env.js";

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendMail = async ({
  to,
  subject,
  html,
}: SendMailOptions): Promise<void> => {
  await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject,
    html,
  });
};
