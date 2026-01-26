'use client';

import React from 'react';

import { Footer } from '@/components/footer/Footer';
import { Navbar } from '@/components/header/Navbar';
import { Sidebar } from '@/components/sidebar/Sidebar';

import { useLoginContext } from './LoginContext';

interface AuthLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export default function AuthLayout({ children, showFooter = true }: AuthLayoutProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { login, setLogin } = useLoginContext();

  //   // Show loading state while checking auth
  //   if (isLoading) {
  //     return (
  //       <div className="min-h-screen bg-background flex items-center justify-center">
  //         <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  //       </div>
  //     );
  //   }

  // Logged in view with sidebar, no footer
  if (login) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[calc(100vh-5.75rem)]">
          <Sidebar />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    );
  }

  // Non-logged in view with footer
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
