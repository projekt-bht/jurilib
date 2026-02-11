import './globals.css';
import './globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import App from './App';
import AuthLayout from './auth-layout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'JuriLib',
  description: 'Developed by Team JuriLib',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* TODO fix me later..*/}
        <App>
          <AuthLayout>
            {/* Offset for fixed header including beta banner */}
            <div className="pt-[7.75rem]">{children}</div>
          </AuthLayout>
        </App>
      </body>
    </html>
  );
}
