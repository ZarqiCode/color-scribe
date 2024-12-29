"use client";

/**
 * Authentication page that handles user sign-in and sign-up.
 * Uses Supabase Auth UI for a pre-built authentication experience.
 */

import { useEffect } from "react";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="w-full max-w-[400px] px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">ColorScribe</h1>
          <p className="text-zinc-600">Sign in to start taking notes</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#000000',
                    brandAccent: '#262626',
                  },
                  radii: {
                    borderRadiusButton: '8px',
                    buttonBorderRadius: '8px',
                    inputBorderRadius: '8px',
                  },
                },
              },
              style: {
                button: {
                  fontSize: '16px',
                  padding: '12px 24px',
                },
                anchor: {
                  color: '#262626',
                  textDecoration: 'none',
                },
                message: {
                  fontSize: '14px',
                },
                container: {
                  gap: '16px',
                },
              },
            }}
            providers={['github']}
            theme="light"
          />
        </div>
      </div>
    </div>
  );
} 