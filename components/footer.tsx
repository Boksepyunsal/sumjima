import { Github } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">숨지마</h4>
            <p className="text-sm text-muted-foreground">
              수수료 0원, 오픈소스 직거래 플랫폼
            </p>
            <Link
              href="https://github.com/Boksepyunsal/sumjima"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Link>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground md:col-span-2 md:text-right">
            <div className="space-x-4">
              <Link href="/terms" className="hover:text-foreground">이용약관</Link>
              <Link href="/privacy" className="font-semibold hover:text-foreground">개인정보처리방침</Link>
            </div>
            <p className="pt-4">상호명: 복세편살 (Boksepyeonsal) | 대표자: 이재호</p>
            <p>사업자등록번호: 590-53-00872</p>
            <p>주소: 경기도 안산시 단원구 광덕1로 385, 301호 (C-5호실)</p>
            <p>고객센터: boksepyunsal24@gmail.com</p>
            <p className="pt-4">© 2024 Sumjima Open Source Project.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
