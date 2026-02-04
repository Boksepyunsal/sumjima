"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Database } from "@/lib/database.types"
import { createClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"
import { ChevronLeft, ChevronRight, MapPin, Plus, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

type Request = Database["public"]["Tables"]["requests"]["Row"] & {
  proposals: [{ count: number }]
}

function getStatusBadge(status: Request["status"], offers: number) {
  switch (status) {
    case "open":
      if (offers > 0) {
        return (
          <Badge variant="secondary" className="text-xs">
            {offers} Offers
          </Badge>
        )
      }
      return (
        <Badge
          variant="outline"
          className="border-primary/50 text-primary text-xs"
        >
          Waiting
        </Badge>
      )
    case "matched":
      return (
        <Badge variant="secondary" className="text-xs">
          Matched
        </Badge>
      )
    case "closed":
      return (
        <Badge variant="outline" className="text-muted-foreground text-xs">
          마감
        </Badge>
      )
    default:
      return null
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "이사/용달":
      return "📦"
    case "청소":
      return "🧹"
    case "철거":
      return "🔨"
    default:
      return "📋"
  }
}

export default function RequestListPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [regionFilter, setRegionFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const supabase = createClient()

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true)
      let query = supabase.from("requests").select(
        `
        *,
        proposals ( count )
      `,
        { count: "exact" }
      )

      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter)
      }
      if (regionFilter !== "all") {
        query = query.like("region", `%${regionFilter}%`)
      }
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,region.ilike.%${searchQuery}%`)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching requests:", error)
      } else {
        setRequests(data as any) // The generated type for count is complex
      }
      setLoading(false)
    }

    fetchRequests()
  }, [supabase, searchQuery, regionFilter, categoryFilter, statusFilter])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">
              Sumjima Requests
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search requests (Region, Title)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Row */}
          <div className="mb-6 flex flex-wrap gap-2">
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-auto min-w-[100px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Region</SelectItem>
                <SelectItem value="마포구">마포구</SelectItem>
                <SelectItem value="강남구">강남구</SelectItem>
                <SelectItem value="서초구">서초구</SelectItem>
                <SelectItem value="송파구">송파구</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-auto min-w-[110px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Category</SelectItem>
                <SelectItem value="이사/용달">이사/용달</SelectItem>
                <SelectItem value="청소">청소</SelectItem>
                <SelectItem value="철거">철거</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-auto min-w-[100px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status</SelectItem>
                <SelectItem value="open">모집중</SelectItem>
                <SelectItem value="matched">매칭됨</SelectItem>
                <SelectItem value="closed">마감</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Request List */}
          <div className="space-y-3">
            {loading ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">요청 목록을 불러오는 중...</p>
              </div>
            ) : (
              requests.map((request) => (
                <Link key={request.id} href={`/requests/${request.id}`}>
                  <Card className="cursor-pointer border-border bg-background p-4 transition-colors hover:border-muted-foreground/50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-foreground leading-snug">
                          {request.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <span>{getCategoryIcon(request.category)}</span>
                            {request.category}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {request.region}
                          </span>
                          <span>•</span>
                          <span>
                            {formatDistanceToNow(new Date(request.created_at), {
                              addSuffix: true,
                              locale: ko,
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {getStatusBadge(request.status as any, request.proposals[0]?.count || 0)}
                      </div>
                    </div>
                  </Card>
                </Link>
              )))}

            {!loading && requests.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No more requests</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Floating Action Button */}
        <Link
          href="/requests/new"
          className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 md:hidden"
          aria-label="새 요청서 작성"
        >
          <Plus className="h-6 w-6" />
        </Link>
      </main>

      <Footer />
    </div>
  )
}
