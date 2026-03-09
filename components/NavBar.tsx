'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export function NavBar() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [scrolledPast, setScrolledPast] = useState(!isHomePage);

  useEffect(() => {
    if (!isHomePage) {
      setScrolledPast(true);
      return;
    }

    setScrolledPast(false);

    const heroTitle = document.getElementById('hero-title');
    if (!heroTitle) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolledPast(!entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(heroTitle);
    return () => observer.disconnect();
  }, [isHomePage]);

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between border-b bg-background px-6 py-4 transition-opacity duration-200 ${
        scrolledPast ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <span className="text-lg font-bold tracking-tight text-foreground">
        Link Shortener
      </span>
      <div className="flex items-center gap-2">
        <SignedOut>
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <Button variant="ghost">Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <Button>Sign Up</Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
