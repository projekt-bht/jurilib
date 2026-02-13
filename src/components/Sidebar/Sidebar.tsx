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

// Add new primary navigation items here
const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/search', label: 'Neuer Termin', icon: Plus },
  { href: '/case', label: 'Meine Fälle', icon: FolderOpen },
  { href: '/appointment', label: 'Meine Termine', icon: CalendarDays },
];

// Add new secondary navigation items here
const secondaryItems = [
  { href: '/organization', label: 'Organisationen', icon: Building2 },
  { href: '/team', label: 'Team', icon: Users },
];

// Add new bottom navigation items here
const bottomItems = [
  { href: '/settings', label: 'Einstellungen', icon: Settings },
  { href: '/docs', label: 'Hilfe', icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { login } = useLoginContext();
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Don't render if not logged in
  if (!login) return null;
  else if (pathname === '/docs') return null; // Don't render on docs page

  return (
    <>
      <aside
        className={`
          hidden lg:flex lg:fixed lg:top-22.5 lg:left-0 lg:h-[calc(100vh-73px)] bg-background/95 backdrop-blur-xl border-r border-border z-30 flex-col
          transition-all duration-300 ease-in-out will-change-[width]
          ${isCollapsed ? 'lg:w-16' : 'lg:w-56'}
        `}
      >
        <div className="flex flex-col h-full py-3">
          {/* Main Navigation */}
          <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
            {/* Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-500 w-full text-muted-foreground hover:text-foreground hover:bg-accent-gray-soft overflow-hidden min-h-[40px] cursor-pointer"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 mx-auto" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm whitespace-nowrap">Einklappen</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className=" border-t border-border/50" />

            <div className="space-y-0.5">
              <p
                className={`px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider h-6 transition-opacity duration-300 ${
                  isCollapsed ? 'opacity-0' : 'opacity-100'
                }`}
              >
                Für dich
              </p>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-6 px-3 py-2.5 rounded-lg transition-all duration-200 overflow-hidden min-h-10
                      ${
                        isActive
                          ? 'bg-accent-blue text-accent-white font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent-gray-soft'
                      }
                    `}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon
                      className={`w-5 h-5 shrink-0 ${isActive ? 'text-accent-white' : ''} ${isCollapsed ? 'mx-auto' : ''}`}
                    />
                    {!isCollapsed && (
                      <span className="text-sm whitespace-nowrap">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-3 border-t border-border/50" />

            {/* Secondary Navigation */}
            <div className="space-y-0.5">
              <p
                className={`px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider h-6 transition-opacity duration-300 ${
                  isCollapsed ? 'opacity-0' : 'opacity-100'
                }`}
              >
                Entdecken
              </p>
              {secondaryItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 overflow-hidden min-h-[40px]
                      ${
                        isActive
                          ? 'bg-accent-blue text-accent-white font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent-gray-soft'
                      }
                    `}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon
                      className={`w-5 h-5 shrink-0 ${isActive ? 'text-accent-white' : ''} ${isCollapsed ? 'mx-auto' : ''}`}
                    />
                    {!isCollapsed && (
                      <span className="text-sm whitespace-nowrap">{item.label}</span>
                    )}
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
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 overflow-hidden min-h-[40px]
                    ${
                      isActive
                        ? 'bg-accent-blue text-accent-white font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent-gray-soft'
                    }
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon
                    className={`w-5 h-5 shrink-0 ${isActive ? 'text-accent-white' : ''} ${isCollapsed ? 'mx-auto' : ''}`}
                  />
                  {!isCollapsed && <span className="text-sm whitespace-nowrap">{item.label}</span>}
                </Link>
              );
            })}
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
                    isActive
                      ? 'bg-accent-blue text-accent-white font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-accent-white' : ''}`} />
                <span className="text-[11px] font-medium line-clamp-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Spacer */}
      <div
        className={`hidden lg:block shrink-0 transition-all duration-300 ease-in-out will-change-[width] ${isCollapsed ? 'lg:w-16' : 'lg:w-56'}`}
      />

      {/* Mobile Bottom Spacer */}
      <div className="lg:hidden h-10 sm:h-12" />
    </>
  );
}
