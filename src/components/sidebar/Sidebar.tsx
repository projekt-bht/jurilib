'use client';

import {
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  HelpCircle,
  Home,
  Menu,
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
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { login, setLogin } = useLoginContext();

  const handleLinkClick = () => {
    setIsMobileOpen(false);
  };

  // Don't render if not logged in
  if (!login) return null;
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-[1.1rem] left-4 z-60 md:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-[90px] left-0 h-[calc(100vh-73px)] bg-background/95 backdrop-blur-xl border-r border-border z-30
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-56'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
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
                    onClick={handleLinkClick}
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
                    onClick={handleLinkClick}
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
                  onClick={handleLinkClick}
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
              className="hidden md:flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full text-muted-foreground hover:text-foreground hover:bg-muted/50 justify-center"
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

      {/* Spacer for content */}
      <div
        className={`hidden md:block shrink-0 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-56'}`}
      />
    </>
  );
}
