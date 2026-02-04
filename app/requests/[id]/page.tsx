"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Database } from "@/lib/database.types"
import { createClient } from "@/lib/supabase/client"
import type { SupabaseClient, User as SupabaseUser } from "@supabase/supabase-js"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  MessageCircle,
  Send,
  User,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type RequestDetails = Database["public"]["Tables"]["requests"]["Row"] & {
  profiles: { username: string | null } | null
}
type Proposal = Database["public"]["Tables"]["proposals"]["Row"] & {
  profiles: { username: string | null } | null
}
type Message = Database["public"]["Tables"]["messages"]["Row"] & {
  profiles: { username: string | null } | null
}

export default function RequestDetailPage() {
  const params = useParams()
  const requestId = params.id as string
  const supabase: SupabaseClient<Database> = createClient()
  const router = useRouter()

  const [request, setRequest] = useState<RequestDetails | null>(null)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<SupabaseUser | null>(null)

  const [proposalDialogOpen, setProposalDialogOpen] = useState(false)
  const [chatDialogOpen, setChatDialogOpen] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<Message[]>([])

  // New proposal form state
  const [proposalMessage, setProposalMessage] = useState("")
  const [proposalPrice, setProposalPrice] = useState("")
  const [proposalContact, setProposalContact] = useState("")

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  useEffect(() => {
    if (!requestId) return

    const fetchRequestData = async () => {
      setLoading(true)
      const { data: requestData, error: requestError } = await supabase
        .from("requests")
        .select(`*, profiles ( username )`)
        .eq("id", Number(requestId))
        .single()

      if (requestError || !requestData) {
        console.error("Error fetching request:", requestError)
        setRequest(null)
      } else {
        setRequest(requestData as RequestDetails)
      }

      const { data: proposalsData, error: proposalsError } = await supabase
        .from("proposals")
        .select(`*, profiles ( username )`)
        .eq("request_id", Number(requestId))
        .order("created_at", { ascending: true })

      if (proposalsError) {
        console.error("Error fetching proposals:", proposalsError)
      } else {
        setProposals(proposalsData as Proposal[])
      }

      setLoading(false)
    }

    fetchRequestData()
  }, [requestId, supabase])

  useEffect(() => {
    if (!selectedProposal) return

    const channel = supabase
      .channel(`messages-for-proposal-${selectedProposal.id}`)
      .on<Message>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `proposal_id=eq.${selectedProposal.id}`,
        },
        async (payload) => {
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", payload.new.sender_id)
            .single()

          if (error) {
            console.error("Error fetching profile for new message", error)
            setChatMessages((prev) => [...prev, payload.new as Message])
          } else {
            const newMessage = {
              ...payload.new,
              profiles: profileData,
            } as Message
            setChatMessages((prev) => [...prev, newMessage])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, selectedProposal])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">요청 정보를 불러오는 중...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!request) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">요청을 찾을 수 없습니다.</p>
            <Button asChild variant="outline" className="mt-4 bg-transparent">
              <Link href="/requests">목록으로 돌아가기</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedProposal || !user) return

    const messageToInsert: Database["public"]["Tables"]["messages"]["Insert"] = {
      proposal_id: selectedProposal.id,
      sender_id: user.id,
      message: newMessage,
    }

    const { error } = await supabase
      .from("messages")
      .insert([messageToInsert])

    if (error) {
      alert("메시지 전송에 실패했습니다.")
      console.error(error)
    } else {
      setNewMessage("")
    }
  }

  const handleSubmitProposal = async () => {
    if (
      !proposalMessage.trim() ||
      !proposalPrice.trim() ||
      !proposalContact.trim()
    ) {
      alert("모든 필드를 입력해주세요.")
      return
    }
    if (!user) {
      alert("로그인이 필요합니다.")
      router.push("/login")
      return
    }

    const proposalToInsert: Database["public"]["Tables"]["proposals"]["Insert"] = {
      request_id: Number(requestId),
      provider_id: user.id,
      message: proposalMessage,
      price: proposalPrice,
      contact: proposalContact,
    }

    const { data: newProposal, error } = await supabase
      .from("proposals")
      .insert([proposalToInsert])
      .select(`*, profiles ( username )`)
      .single()

    if (error || !newProposal) {
      alert("제안서 제출에 실패했습니다.")
      console.error(error)
    } else {
      setProposals((prev) => [...prev, newProposal as Proposal])
      setProposalDialogOpen(false)
      setProposalMessage("")
      setProposalPrice("")
      setProposalContact("")
      openChat(newProposal as Proposal)
    }
  }

  const openChat = async (proposal: Proposal) => {
    setSelectedProposal(proposal)

    const { data, error } = await supabase
      .from("messages")
      .select(`*, profiles ( username )`)
      .eq("proposal_id", proposal.id)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching messages", error)
      setChatMessages([])
    } else {
      setChatMessages(data as Message[])
    }

    setChatDialogOpen(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          {/* Back Button */}
          <Link
            href="/requests"
            className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Link>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary">{request.category}</Badge>
                    {request.status === "open" ? (
                      <Badge
                        variant="outline"
                        className="border-primary/50 text-primary"
                      >
                        모집중
                      </Badge>
                    ) : request.status === "matched" ? (
                      <Badge variant="secondary">매칭완료</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        마감
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-xl font-bold text-foreground md:text-2xl">
                    {request.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {request.region}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDistanceToNow(new Date(request.created_at), {
                        addSuffix: true,
                        locale: ko,
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {request.profiles?.username || "사용자"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-foreground">
                    {request.description}
                  </div>
                </CardContent>
              </Card>

              {/* Proposals Section */}
              <div className="mt-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  받은 제안 ({proposals.length}건)
                </h2>
                {proposals.length > 0 ? (
                  <div className="space-y-3">
                    {proposals.map((proposal) => (
                      <Card key={proposal.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">
                                  {proposal.profiles?.username || "서비스 제공자"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(
                                    new Date(proposal.created_at),
                                    { addSuffix: true, locale: ko }
                                  )}
                                </span>
                              </div>
                              <p className="mt-2 text-sm text-muted-foreground">
                                {proposal.message}
                              </p>
                              <div className="mt-3 flex flex-wrap items-center gap-3">
                                <Badge variant="outline" className="font-mono">
                                  {proposal.price}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {proposal.contact}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openChat(proposal)}
                            >
                              <MessageCircle className="mr-1 h-4 w-4" />
                              채팅
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground">
                        아직 받은 제안이 없습니다.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Sidebar - Proposal CTA */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground">
                    서비스 제공이 가능하신가요?
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    견적과 연락처를 제안해보세요. 수수료는 0원입니다.
                  </p>

                  {/* Proposal Dialog */}
                  <Dialog
                    open={proposalDialogOpen}
                    onOpenChange={setProposalDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="mt-4 w-full">
                        <Send className="mr-2 h-4 w-4" />
                        제안서 보내기
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>제안서 작성</DialogTitle>
                        <DialogDescription>
                          의뢰인에게 보낼 제안서를 작성하세요.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            제안 메시지
                          </label>
                          <Textarea
                            placeholder="서비스 내용과 강점을 소개해주세요."
                            value={proposalMessage}
                            onChange={(e) => setProposalMessage(e.target.value)}
                            className="min-h-[100px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">예상 비용</label>
                          <Input
                            placeholder="예: 15만원"
                            value={proposalPrice}
                            onChange={(e) => setProposalPrice(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            연락처 / 오픈채팅
                          </label>
                          <Input
                            placeholder="예: 010-1234-5678 또는 오픈채팅 링크"
                            value={proposalContact}
                            onChange={(e) => setProposalContact(e.target.value)}
                          />
                        </div>
                        <Button
                          className="w-full"
                          onClick={handleSubmitProposal}
                          disabled={!user}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          제안서 보내기 (무료)
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <div className="mt-4 rounded-lg border border-border bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">
                      숨지마는 중개 수수료를 받지 않습니다.
                      <br />
                      의뢰인과 직접 소통하세요.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Chat Dialog */}
        <Dialog open={chatDialogOpen} onOpenChange={setChatDialogOpen}>
          <DialogContent className="flex h-[500px] max-w-md flex-col p-0">
            <DialogHeader className="border-b border-border px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-base font-semibold">
                    {selectedProposal?.profiles?.username || "서비스 제공자"}
                  </DialogTitle>
                  <DialogDescription className="text-xs font-mono">
                    {selectedProposal?.price} / {selectedProposal?.contact}
                  </DialogDescription>
                </div>
                <Badge
                  variant="outline"
                  className="border-primary/50 text-primary text-xs"
                >
                  <CheckCircle className="mr-1 h-3 w-3" />
                  VERIFIED
                </Badge>
              </div>
            </DialogHeader>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-4 flex justify-center">
                <Badge variant="secondary" className="text-xs">
                  Today
                </Badge>
              </div>
              <div className="space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] ${msg.sender_id === user?.id ? "order-2" : ""}`}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        {msg.sender_id !== user?.id && (
                          <div className="h-8 w-8 rounded-full bg-muted" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {msg.sender_id === user?.id
                            ? "나"
                            : msg.profiles?.username || "상대방"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.created_at).toLocaleTimeString("ko-KR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {msg.sender_id === user?.id && (
                          <div className="h-8 w-8 rounded-full bg-primary/20" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg px-4 py-3 ${msg.sender_id === user?.id
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-background"
                          }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div className="border-t border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  )
}
