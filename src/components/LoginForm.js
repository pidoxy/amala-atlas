"use client";

import { signIn, getSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleOAuthConfigured, setIsGoogleOAuthConfigured] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
    setIsGoogleOAuthConfigured(process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === 'true');
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signIn('google', { 
        callbackUrl: '/',
        redirect: false 
      });
      
      if (result?.error) {
        console.error('Google OAuth not configured:', result.error);
        alert('Google OAuth is not configured yet. Please use "Test Login" for now, or check the setup guide.');
        setIsLoading(false);
      } else if (result?.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Google OAuth is not configured yet. Please use "Test Login" for now.');
      setIsLoading(false);
    }
  };

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="mt-8 space-y-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {isGoogleOAuthConfigured ? (
        <div>
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </div>
            )}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Google OAuth is not configured yet.
          </p>
          <p className="text-xs text-muted-foreground">
            Please contact the administrator to set up authentication.
          </p>
        </div>
      )}
      
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
