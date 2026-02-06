import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';

import type { Database } from '@/lib/database.types';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const response = NextResponse.redirect(requestUrl.origin);
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.delete({ name, ...options });
          },
        },
      }
    );
    await supabase.auth.exchangeCodeForSession(code);
    return response;
  }

  // 인증 코드가 없거나 오류 발생 시 로그인 페이지로 리디렉션
  return NextResponse.redirect(
    `${requestUrl.origin}/login?error=auth-code-error`
  );
}
