import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { GET } from '@/app/auth/callback/route';

// Mock @supabase/ssr
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(),
}));

// Helper to mock NextRequest since using actual NextRequest in test env with polyfills is tricky
const createMockRequest = (url: string) =>
  ({
    url,
    cookies: {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    },
  }) as unknown as NextRequest;

describe('Auth Callback API', () => {
  const mockExchangeCodeForSession = jest.fn();
  const mockOrigin = 'http://localhost:3000';

  beforeEach(() => {
    jest.clearAllMocks();
    (createServerClient as jest.Mock).mockReturnValue({
      auth: {
        exchangeCodeForSession: mockExchangeCodeForSession,
      },
    });
  });

  it('redirects to login with error if no code is provided', async () => {
    const req = createMockRequest(`${mockOrigin}/auth/callback`);
    const response = await GET(req);

    // Verify redirect
    expect(response.status).toBe(307); // NextResponse.redirect default status
    expect(response.headers.get('location')).toBe(
      `${mockOrigin}/login?error=auth-code-error`
    );
    expect(mockExchangeCodeForSession).not.toHaveBeenCalled();
  });

  it('exchanges code for session and redirects to origin if code is provided', async () => {
    const code = 'test-auth-code';
    const req = createMockRequest(`${mockOrigin}/auth/callback?code=${code}`);

    // Mock successful exchange
    mockExchangeCodeForSession.mockResolvedValue({
      data: { session: {} },
      error: null,
    });

    const response = await GET(req);

    // Verify Supabase client creation and method call
    expect(createServerClient).toHaveBeenCalled();
    expect(mockExchangeCodeForSession).toHaveBeenCalledWith(code);

    // Verify redirect to origin (home)
    expect(response.status).toBe(307);
    const location = response.headers.get('location');
    expect(location?.replace(/\/$/, '')).toBe(mockOrigin.replace(/\/$/, ''));
  });
});
