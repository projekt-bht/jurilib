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

function compileTemplate(templateFileName: string, variables: Record<string, string>): string {
  const templatePath = path.join(process.cwd(), 'email_templates', `${templateFileName}.hbs`);

  const source = readFileSync(templatePath, 'utf-8');
  const compiled = Handlebars.compile(source);

  return compiled(variables);
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
