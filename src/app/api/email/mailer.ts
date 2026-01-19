// TODO: check ZOD validation

import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

import { apiInstance } from '@/lib/brevo';

type SendEmailParams = {
  toEmail: string;
  subject: string;
  templateFileName: string;
  templateVariables: Record<string, string>;
};

function getLogoAsDataUri(): string {
  const logoPath = path.join(process.cwd(), 'public', 'scale_logo.svg');
  const logoBuffer = readFileSync(logoPath);
  const base64Logo = logoBuffer.toString('base64');
  return `data:image/svg+xml;base64,${base64Logo}`;
}

function compileTemplate(templateFileName: string, variables: Record<string, string>): string {
  const templatePath = path.join(process.cwd(), 'email_templates', `${templateFileName}.hbs`);

  const source = readFileSync(templatePath, 'utf-8');
  const compiled = Handlebars.compile(source);

  // Add logo as data URI to template variables
  const enhancedVariables = {
    ...variables,
    LOGO_URL: getLogoAsDataUri(),
  };

  return compiled(enhancedVariables);
}

export async function sendEmail({
  toEmail,
  subject,
  templateFileName,
  templateVariables,
}: SendEmailParams) {
  const htmlContent = compileTemplate(templateFileName, templateVariables);

  await apiInstance.sendTransacEmail({
    to: [{ email: toEmail }],
    subject,
    htmlContent,
    sender: {
      email: process.env.BREVO_SENDER_EMAIL!,
      name: process.env.BREVO_SENDER_NAME!,
    },
  });
}
