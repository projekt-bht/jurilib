import { ArrowUpRight, FileText, Github, Globe } from 'lucide-react';
import Link from 'next/link';

export function LinksAndResources() {
  return (
    <>
      {/* Quick Start Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 ">
        {[
          {
            icon: <Globe className="w-8 h-8" />,
            title: 'Deployment',
            link: 'https://jurilib.de',
          },
          {
            icon: <Github className="w-8 h-8" />,
            title: 'Git-Hub',
            link: 'https://github.com/projekt-bht/jurilib',
          },
          {
            icon: <FileText className="w-8 h-8" />,
            title: 'Confluence',
            link: 'https://projekt-wise25.atlassian.net/wiki/spaces/SOFTWAREEN',
          },
        ].map((card) => (
          <div
            key={card.title}
            className="group relative isolate rounded-2xl
            p-3 overflow-hidden 
            bg-background border
            border-border/40 
            transition-all duration-300
            shadow-sm hover:shadow-md "
          >
            <Link href={card.link}>
              {/* Solid accent bar - 5px left of icon */}
              <div className="ml-2.5 absolute left-12 top-3 bottom-3 w-0.5 rounded-full bg-accent-gray-light" />

              <div className="relative flex items-center gap-5">
                <div className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                  <div className="w-4 h-4 md:w-6 md:h-6 text-accent-blue">{card.icon}</div>
                </div>
                <div className="inline-flex items-center gap-2 text-m font-bold text-foreground tracking-tight">
                  {card.title}
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <br />

      <p>
        Weitere genutzte Anwendungen, wie Figma oder draw.io sind direkt in Confluence eingebunden.
      </p>
    </>
  );
}
