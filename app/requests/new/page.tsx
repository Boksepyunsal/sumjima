"use client"

import React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function NewRequestPage() {
  const [category, setCategory] = useState("")
  const [region, setRegion] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({ category, region, title, description })
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
                    <SelectItem value="moving">이사/용달</SelectItem>
                    <SelectItem value="cleaning">청소</SelectItem>
                    <SelectItem value="repair">수리/설치</SelectItem>
                    <SelectItem value="interior">인테리어</SelectItem>
                    <SelectItem value="demolition">철거</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
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
                    <SelectItem value="seoul-mapo">서울 마포구</SelectItem>
                    <SelectItem value="seoul-gangnam">서울 강남구</SelectItem>
                    <SelectItem value="seoul-seocho">서울 서초구</SelectItem>
                    <SelectItem value="seoul-songpa">서울 송파구</SelectItem>
                    <SelectItem value="seoul-jongno">서울 종로구</SelectItem>
                    <SelectItem value="seoul-yongsan">서울 용산구</SelectItem>
                    <SelectItem value="seoul-other">서울 기타</SelectItem>
                    <SelectItem value="gyeonggi">경기도</SelectItem>
                    <SelectItem value="incheon">인천</SelectItem>
                    <SelectItem value="other">기타 지역</SelectItem>
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
