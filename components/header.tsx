"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 text-primary"
              fill="currentColor"
            >
              <rect x="3" y="3" width="8" height="8" />
              <rect x="13" y="3" width="8" height="8" />
              <rect x="3" y="13" width="8" height="8" />
              <rect x="13" y="13" width="8" height="8" />
            </svg>
          </div>
          <span className="text-xl font-bold text-foreground">숨지마</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/requests"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            요청 목록
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            로그인
          </Link>
          <Button asChild>
            <Link href="/requests/new">견적 요청하기</Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="flex items-center justify-center p-2 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="메뉴 열기"
        >
          <Menu className="h-6 w-6 text-foreground" />
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="/requests"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              요청 목록
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              로그인
            </Link>
            <Button asChild className="w-full">
              <Link href="/requests/new">견적 요청하기</Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  )
}
