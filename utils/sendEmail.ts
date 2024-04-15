import { log } from 'console';
import nodemailer, { Transporter } from 'nodemailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

const nodemailerOptions: SMTPTransport.Options = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || ""),
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  }
}



const sendEmail = async (options: EmailOptions): Promise<void> => {

  if(!process.env.SMTP_PORT){
    console.log("SMTP_PORT is not set, please set it in the config.env file");
    return;
  }

  const transporter: Transporter = nodemailer.createTransport(nodemailerOptions);

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

export default sendEmail;