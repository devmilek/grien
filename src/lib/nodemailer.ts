import "server-only";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.eu",
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_USER, // generated ethereal user
    pass: process.env.EMAIL_PASS, // generated ethereal password
  },
});

type SendEmailProps = {
  to: string;
  subject: string;
  text: string;
};

export const sendEmail = async ({ to, subject, text }: SendEmailProps) => {
  await transporter.sendMail({
    from: '"Grien 🥘" <grien@devmilek.com>',
    to,
    subject,
    text,
  });
};
