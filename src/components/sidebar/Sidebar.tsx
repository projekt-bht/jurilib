'use client';

import {
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  HelpCircle,
  Home,
  Plus,
  Settings,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { useLoginContext } from '@/app/LoginContext';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/new-case', label: 'Neuer Fall', icon: Plus, highlight: true },
  { href: '/cases', label: 'Meine Fälle', icon: FolderOpen },
  { href: '/appointments', label: 'Termine', icon: CalendarDays },
];

const secondaryItems = [
  { href: '/organizations', label: 'Organisationen', icon: Building2 },
  { href: '/team', label: 'Team', icon: Users },
];

const bottomItems = [
  { href: '/settings', label: 'Einstellungen', icon: Settings },
  { href: '/help', label: 'Hilfe', icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { login } = useLoginContext();
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Don't render if not logged in
  if (!login) return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex lg:fixed lg:top-[90px] lg:left-0 lg:h-[calc(100vh-73px)] bg-background/95 backdrop-blur-xl border-r border-border z-30 flex-col
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'lg:w-16' : 'lg:w-56'}
        `}
      >
        <div className="flex flex-col h-full py-3">
          {/* Main Navigation */}
          <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
            <div className="space-y-0.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                      ${isCollapsed ? 'justify-center' : ''}
                      ${
                        item.highlight && !isActive
                          ? 'bg-primary/10 text-primary hover:bg-primary/15'
                          : isActive
                            ? 'bg-muted text-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }
                    `}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon
                      className={`w-4 h-4 shrink-0 ${item.highlight && !isActive ? 'text-primary' : ''}`}
                    />
                    {!isCollapsed && <span className="text-sm">{item.label}</span>}
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-3 border-t border-border/50" />

            {/* Secondary Navigation */}
            <div className="space-y-0.5">
              {!isCollapsed && (
                <p className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Entdecken
                </p>
              )}
              {secondaryItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                      ${isCollapsed ? 'justify-center' : ''}
                      ${
                        isActive
                          ? 'bg-muted text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }
                    `}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span className="text-sm">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Bottom Navigation */}
          <div className="px-2 pt-2 border-t border-border/50 space-y-0.5">
            {bottomItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${isCollapsed ? 'justify-center' : ''}
                    ${
                      isActive
                        ? 'bg-muted text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span className="text-sm">{item.label}</span>}
                </Link>
              );
            })}

            {/* Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full text-muted-foreground hover:text-foreground hover:bg-muted/50 justify-center"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm">Einklappen</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 py-1.5">
        <div className="flex items-center justify-center gap-15 sm:gap-10 md:gap-10 h-12 sm:px-2">
          {[navItems[0], navItems[1], navItems[2]].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center p-2.5 sm:mx-10 md:mx-10 rounded-xl transition-all duration-500
                  ${
                    item.highlight && !isActive
                      ? 'bg-accent-blue text-accent-white hover:bg-accent-blue/75'
                      : isActive
                        ? 'bg-muted text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
              >
                <item.icon
                  className={`w-4 h-4 ${item.highlight && !isActive ? 'text-accent-white' : ''}`}
                />
                <span className="text-[11px] font-medium line-clamp-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Spacer */}
      <div
        className={`hidden lg:block shrink-0 transition-all duration-300 ${isCollapsed ? 'lg:w-16' : 'lg:w-56'}`}
      />

      {/* Mobile Bottom Spacer */}
      <div className="lg:hidden h-10 sm:h-12" />
    </>
  );
}
