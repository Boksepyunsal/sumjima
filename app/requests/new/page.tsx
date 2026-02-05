"use client"

import { useRouter } from "next/navigation"
import React, { useEffect } from "react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Database } from "@/lib/database.types"
import { useState } from "react"

export default function NewRequestPage() {
  const [category, setCategory] = useState("")
  const [region, setRegion] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const { supabase, user, isLoading } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    // 인증 상태 로딩이 끝나면 사용자 정보를 확인합니다.
    if (isLoading) {
      return
    }
    if (!user) {
      alert("로그인이 필요합니다.")
      router.push("/login")
    }
  }, [user, isLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 이제 user 객체는 항상 최신 상태를 보장합니다.
    if (!user) {
      alert("로그인이 필요합니다.")
      return
    }
    if (!category || !region || !title || !description) {
      alert("모든 필드를 입력해주세요.")
      return
    }

    const requestToInsert: Database["public"]["Tables"]["requests"]["Insert"] =
      { title, description, category, region, author_id: user.id }

    const { error } = await supabase
      .from("requests")
      .insert(requestToInsert as any)

    if (error) {
      console.error("Error creating request:", error)
      alert("요청서 등록에 실패했습니다.")
    } else {
      alert("요청서가 성공적으로 등록되었습니다.")
      router.push("/requests")
    }
  }

  // 인증 상태를 확인하는 동안 로딩 화면을 보여줍니다.
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">사용자 정보를 확인하는 중...</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30 px-4 py-8 md:py-12">
        <div className="container mx-auto max-w-2xl">
          <div className="rounded-lg border border-border bg-background p-6 md:p-8">
            <h2 className="text-2xl font-bold text-foreground">
              무료 견적 요청서 작성
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              필요한 서비스를 자세히 설명해주시면 서비스 제공자가 직접 연락드립니다.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  어떤 서비스가 필요하세요?
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="이사/용달">이사/용달</SelectItem>
                    <SelectItem value="청소">청소</SelectItem>
                    <SelectItem value="수리/설치">수리/설치</SelectItem>
                    <SelectItem value="인테리어">인테리어</SelectItem>
                    <SelectItem value="철거">철거</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Region */}
              <div className="space-y-2">
                <Label htmlFor="region" className="text-sm font-medium">
                  어디서 진행하시나요?
                </Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger id="region">
                    <SelectValue placeholder="지역 선택 (시/구)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="서울 마포구">서울 마포구</SelectItem>
                    <SelectItem value="서울 강남구">서울 강남구</SelectItem>
                    <SelectItem value="서울 서초구">서울 서초구</SelectItem>
                    <SelectItem value="서울 송파구">서울 송파구</SelectItem>
                    <SelectItem value="서울 종로구">서울 종로구</SelectItem>
                    <SelectItem value="서울 용산구">서울 용산구</SelectItem>
                    <SelectItem value="서울 기타">서울 기타</SelectItem>
                    <SelectItem value="경기도">경기도</SelectItem>
                    <SelectItem value="인천">인천</SelectItem>
                    <SelectItem value="기타 지역">기타 지역</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  제목
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="예: 욕실 수전 교체해주실 분 찾습니다"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  상세 내용
                </Label>
                <Textarea
                  id="description"
                  placeholder="원하는 작업 내용과 시간을 자유롭게 적어주세요."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[150px] resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" size="lg" className="w-full text-base">
                요청서 등록하기 (무료)
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
