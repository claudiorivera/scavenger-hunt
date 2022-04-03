import { EmailConfig } from "next-auth/providers";
import nodemailer from "nodemailer";

import { appTitle } from "~config";
import { renderEmailString, renderPlainTextEmailString } from "~lib";

interface Params {
  identifier: string;
  url: string;
  provider: EmailConfig;
}
export const sendVerificationRequest = ({
  identifier: email,
  url,
  provider,
}: Params) => {
  return new Promise<void>((resolve, reject) => {
    const { server, from } = provider;

    nodemailer.createTransport(server).sendMail(
      {
        to: email,
        from,
        subject: `Sign in to ${appTitle}`,
        text: renderPlainTextEmailString({ url }),
        html: renderEmailString({ url, email }),
      },
      (error) => {
        if (error) {
          console.error("SEND_VERIFICATION_EMAIL_ERROR", email, error);
          return reject(new Error("SEND_VERIFICATION_EMAIL_ERROR"));
        }
        return resolve();
      }
    );
  });
};
