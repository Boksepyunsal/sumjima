'use client';

import * as React from 'react';
import { createContext, useContext } from 'react';

// Minimal mock Supabase client implementing the methods used by components
const createMockSupabase = () => ({
  from: (_table: string) => ({
    select: (_cols: string) => ({
      eq: (_col: string, _val: unknown) => ({
        single: () =>
          Promise.resolve({
            data: { username: 'storybook_user' },
            error: null,
          }),
      }),
    }),
  }),
  auth: {
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: (_callback: (event: string, session: null) => void) => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
  },
});

type MockSupabase = ReturnType<typeof createMockSupabase>;

export type SupabaseContextType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: MockSupabase & Record<string, any>;
  user: { id: string; email: string; [key: string]: unknown } | null;
  isLoading: boolean;
};

export const SupabaseContext = createContext<SupabaseContextType>({
  supabase: createMockSupabase() as MockSupabase & Record<string, unknown>,
  user: null,
  isLoading: false,
});

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseContext.Provider
      value={{
        supabase: createMockSupabase() as MockSupabase &
          Record<string, unknown>,
        user: null,
        isLoading: false,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => useContext(SupabaseContext);
