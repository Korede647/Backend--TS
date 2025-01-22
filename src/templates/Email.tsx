import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { render } from "@react-email/render";
import OtpEmail from "../templates/OtpEmail";
import React from "react";
import WelcomeEmail from "../templates/Welcome";
import ResetPasswordEmail from "../templates/PwResetEmail";

dotenv.config();

interface SendEmailOptions {
  to: string;
  subject: string;
  otp: string;
}

interface WelcomeEmailOptions {
  to: string;
  subject: string;
  name: string;
}

interface ResetPasswordOptions {
  to: string;
  subject: string;
  name: string;
  resetLink: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail({ to, subject, otp }: SendEmailOptions) {
  const emailHtml = await render(<OtpEmail otp={otp} />);
  await transporter.sendMail({
    from: `Futurerify <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: emailHtml,
  });
}

export async function welcomeEmail({ to, subject, name }: WelcomeEmailOptions) {
  const emailHtml = await render(<WelcomeEmail name={name} />);
  await transporter.sendMail({
    from:  `Futurerify <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: emailHtml,
  });
}

  export async function sendResetPasswordEmail({ to, subject, name, resetLink}: ResetPasswordOptions){
    const emailHtml = await render(<ResetPasswordEmail name={name} resetLink={resetLink} />);
    await transporter.sendMail({
      from: `Futurerify <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: emailHtml,
    })
  }
