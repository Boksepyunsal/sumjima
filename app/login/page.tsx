"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isSignUp, setIsSignUp] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isSignUp) {
            // Sign up
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                },
            })
            if (error) {
                alert(error.message)
            } else {
                alert("회원가입이 완료되었습니다. 이메일을 확인하여 계정을 활성화해주세요.")
            }
        } else {
            // Sign in
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) {
                alert(error.message)
            } else {
                router.push("/requests")
            }
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex flex-1 items-center justify-center bg-muted/30 px-4">
                <div className="w-full max-w-sm">
                    <form
                        onSubmit={handleAuth}
                        className="rounded-lg border border-border bg-background p-6 md:p-8 space-y-6"
                    >
                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-bold">{isSignUp ? "회원가입" : "로그인"}</h1>
                            <p className="text-muted-foreground">
                                {isSignUp
                                    ? "계정을 만들어 숨지마를 시작하세요."
                                    : "이메일과 비밀번호로 로그인하세요."}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">이메일</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">비밀번호</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full">
                            {isSignUp ? "회원가입" : "로그인"}
                        </Button>
                        <div className="text-center text-sm">
                            {isSignUp ? "이미 계정이 있으신가요?" : "계정이 없으신가요?"}
                            <Button
                                variant="link"
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)}
                            >
                                {isSignUp ? "로그인" : "회원가입"}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    )
}