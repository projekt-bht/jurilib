'use client';
import { ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FeedbackButton() {
  const pathname = usePathname();
  if (pathname === '/feedback') return null;

  return (
    <Link
      href="/feedback"
      className="fixed bottom-4 right-4 bg-primary text-primary-foreground font-bold hover:bg-primary-hover hover:text-primary-hover-foreground p-3 rounded-full cursor-pointer z-50"
      aria-label="Open feedback page"
    >
      <div className="flex items-center gap-2">
        <ThumbsUp />
        <span className="rounded-full">Feedback</span>
      </div>
    </Link>
  );
}
