// Mock for next/navigation used in Storybook
import * as React from 'react';

export const useRouter = () => ({
  push: (path: string) => {
    // eslint-disable-next-line no-console
    console.log('[Mock Router] push:', path);
  },
  replace: (path: string) => {
    // eslint-disable-next-line no-console
    console.log('[Mock Router] replace:', path);
  },
  back: () => {},
  forward: () => {},
  refresh: () => {},
  prefetch: () => {},
});

export const usePathname = () => '/';

export const useSearchParams = () => new URLSearchParams();

export const useParams = () => ({});

export const redirect = (path: string) => {
  // eslint-disable-next-line no-console
  console.log('[Mock Router] redirect:', path);
};
