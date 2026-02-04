"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
    const supabase = createClient()

    const handleKakaoLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "kakao",
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
        if (error) {
            alert(error.message)
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex flex-1 items-center justify-center bg-muted/30 px-4">
                <div className="w-full max-w-sm text-center">
                    <div className="rounded-lg border border-border bg-background p-6 md:p-8 space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold">로그인</h1>
                            <p className="text-muted-foreground">
                                카카오 계정으로 간편하게 로그인하고
                                <br />
                                숨지마의 모든 서비스를 이용해보세요.
                            </p>
                        </div>
                        <Button
                            onClick={handleKakaoLogin}
                            className="w-full bg-[#FEE500] text-black hover:bg-[#FEE500]/90"
                        >
                            <svg
                                role="img"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-2 h-5 w-5"
                            >
                                <path
                                    d="M12 2C6.477 2 2 5.818 2 10.227c0 2.454.983 4.69 2.607 6.386-.196 1.038-.586 2.64-1.498 3.715-.14.163-.055.41.14.47.197.062.41-.023.47-.222.586-1.74 1.83-3.06 2.2-3.372C7.146 17.738 9.44 18.455 12 18.455c5.523 0 10-3.818 10-8.228C22 5.818 17.523 2 12 2z"
                                    fill="#181600"
                                />
                            </svg>
                            카카오로 1초만에 시작하기
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}