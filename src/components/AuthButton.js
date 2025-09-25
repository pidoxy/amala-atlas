"use client";

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [isGoogleOAuthConfigured, setIsGoogleOAuthConfigured] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
    setIsGoogleOAuthConfigured(process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === 'true');
  }, []);

  // Show loading state during hydration
  if (!isClient || status === 'loading') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
        <div className="w-16 h-4 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <Link 
          href="/profile"
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors min-w-0"
        >
          <Image
            src={session.user.image || '/logo.png'}
            alt={session.user.name}
            width={32}
            height={32}
            className="rounded-full flex-shrink-0"
            sizes="32px"
            loading="lazy"
          />
          <span className="hidden sm:inline truncate max-w-32">{session.user.name}</span>
        </Link>
        <button
          onClick={() => signOut()}
          className="bg-destructive text-destructive-foreground font-medium py-2 px-3 rounded-lg hover:bg-destructive/90 transition-all duration-200 shadow-sm hover:shadow-md text-sm whitespace-nowrap flex-shrink-0"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isGoogleOAuthConfigured && (
        <button
          onClick={() => signIn('google')}
          className="bg-primary text-primary-foreground font-medium py-2 px-4 rounded-lg hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md text-sm whitespace-nowrap"
        >
          Sign In
        </button>
      )}
    </div>
  );
}
