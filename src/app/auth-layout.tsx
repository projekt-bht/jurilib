'use client';

import React from 'react';

import { Footer } from '@/components/Footer/Footer';
import { Navbar } from '@/components/Header/Navbar';
import { Sidebar } from '@/components/Sidebar/Sidebar';

import { useLoginContext } from './LoginContext';

interface AuthLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export default function AuthLayout({ children, showFooter = true }: AuthLayoutProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { login, setLogin } = useLoginContext();

  // Logged in view with sidebar, no footer
  if (login) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex min-h-[calc(100vh-5.75rem)]">
          <Sidebar />
          <main className="flex-1 flex flex-col bg-card">{children}</main>
        </div>
      </div>
    );
  }

  // Non-logged in view with footer
  return (
    <div className="min-h-screen bg-card">
      <Navbar />
      <main>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
