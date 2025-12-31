import './globals.css';
import './globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import Feedback from '@/components/FeedbackButton/FeedbackButton';
import { Footer } from '@/components/Footer/Footer';
import { Navbar } from '@/components/Navbar/Navbar';

import App from './App';

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
          <Navbar />
          <div className="pt-23">
            <Feedback />
            {children}
            <Footer />
          </div>
        </App>
      </body>
    </html>
  );
}
