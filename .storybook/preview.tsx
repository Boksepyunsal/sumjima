import type { Preview, Decorator } from '@storybook/react';
import * as React from 'react';
import '../app/globals.css';
import {
  SupabaseContext,
  type SupabaseContextType,
} from './mocks/supabase-provider.mock';

const mockSupabase: SupabaseContextType['supabase'] = {
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
};

const withSupabaseMock: Decorator = (Story, context) => {
  const isLoggedIn = context.globals['authState'] === 'loggedIn';
  const user = isLoggedIn
    ? { id: 'mock-user-id', email: 'test@example.com' }
    : null;

  return (
    <SupabaseContext.Provider
      value={{ supabase: mockSupabase, user, isLoading: false }}
    >
      <Story />
    </SupabaseContext.Provider>
  );
};

const preview: Preview = {
  globalTypes: {
    authState: {
      description: 'Authentication state',
      defaultValue: 'loggedOut',
      toolbar: {
        title: 'Auth',
        icon: 'user',
        items: [
          { value: 'loggedOut', title: 'Logged Out' },
          { value: 'loggedIn', title: 'Logged In' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withSupabaseMock],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
