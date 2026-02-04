"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle,
  User,
} from "lucide-react"

// Mock data for the request
const mockRequestDetails: Record<
  string,
  {
    id: number
    category: string
    title: string
    description: string
    region: string
    time: string
    offers: number
    status: "open" | "closed" | "matched"
    author: string
    createdAt: string
  }
> = {
  "1": {
    id: 1,
    category: "이사/용달",
    title: "마포구 원룸이사 용달 필요합니다",
    description:
      "마포구 서교동에서 홍대입구역 근처로 이사 예정입니다.\n\n- 원룸 (약 10평)\n- 가전: 냉장고, 세탁기, 에어컨\n- 가구: 침대, 책상, 옷장\n- 박스 약 15개 정도\n\n희망 일자: 다음 주 토요일\n오전 시간대 선호합니다.",
    region: "서울 마포구",
    time: "10분 전",
    offers: 0,
    status: "open",
    author: "김철수",
    createdAt: "2026-02-04",
  },
  "2": {
    id: 2,
    category: "청소",
    title: "강남구 에어컨 청소 견적 문의 (시스템 에어컨 2대)",
    description:
      "강남구 역삼동 오피스텔입니다.\n\n시스템 에어컨 2대 분해 청소 원합니다.\n브랜드: LG 휘센\n\n평일 저녁이나 주말 가능합니다.",
    region: "서울 강남구",
    time: "30분 전",
    offers: 3,
    status: "open",
    author: "이영희",
    createdAt: "2026-02-04",
  },
  "3": {
    id: 3,
    category: "이사/용달",
    title: "서초구 포장이사 견적 요청, 사다리차 필요함",
    description:
      "서초구 방배동 빌라 3층에서 같은 동네 아파트 12층으로 이사합니다.\n\n- 25평형 가구 전체\n- 사다리차 필수 (엘리베이터 없음)\n- 포장이사 원함\n\n희망일: 2월 중순",
    region: "서울 서초구",
    time: "1시간 전",
    offers: 0,
    status: "open",
    author: "박민수",
    createdAt: "2026-02-04",
  },
  "4": {
    id: 4,
    category: "청소",
    title: "송파구 입주청소 업체 구합니다 (34평 확장형)",
    description:
      "송파구 잠실동 아파트 입주청소입니다.\n\n- 34평 확장형\n- 베란다 2개\n- 입주 전 전체 청소 원함\n\n입주일: 2월 15일",
    region: "서울 송파구",
    time: "2시간 전",
    offers: 0,
    status: "matched",
    author: "최지은",
    createdAt: "2026-02-04",
  },
  "5": {
    id: 5,
    category: "철거",
    title: "홍대입구역 근처 인테리어 철거 견적 문의드립니다",
    description:
      "마포구 서교동 상가 인테리어 철거입니다.\n\n- 약 15평 규모\n- 기존 인테리어 전체 철거\n- 폐기물 처리 포함 원함\n\n급하지 않습니다. 견적 먼저 받아보고 싶습니다.",
    region: "서울 마포구",
    time: "3시간 전",
    offers: 5,
    status: "open",
    author: "정호진",
    createdAt: "2026-02-04",
  },
}

// Mock proposals
interface Proposal {
  id: number
  providerName: string
  message: string
  price: string
  contact: string
  createdAt: string
}

const mockProposals: Record<string, Proposal[]> = {
  "2": [
    {
      id: 1,
      providerName: "클린마스터",
      message:
        "안녕하세요, 시스템 에어컨 전문 청소업체입니다. 분해 청소 후 항균 처리까지 해드립니다.",
      price: "12만원 (2대)",
      contact: "010-1234-5678",
      createdAt: "20분 전",
    },
    {
      id: 2,
      providerName: "에어컨닥터",
      message: "LG 휘센 전문입니다. 당일 예약 가능하고 청소 후 사진 전달드립니다.",
      price: "10만원 (2대)",
      contact: "카카오톡: aircon_doc",
      createdAt: "25분 전",
    },
    {
      id: 3,
      providerName: "홈케어서비스",
      message:
        "경력 10년차 기사님이 직접 방문합니다. 친환경 세제 사용하며 아이가 있는 가정도 안심하고 이용하세요.",
      price: "15만원 (2대, 항균코팅 포함)",
      contact: "오픈채팅: homecare123",
      createdAt: "28분 전",
    },
  ],
  "5": [
    {
      id: 1,
      providerName: "철거왕",
      message: "상가 철거 전문업체입니다. 폐기물 처리 포함 견적입니다.",
      price: "150만원",
      contact: "010-9876-5432",
      createdAt: "1시간 전",
    },
    {
      id: 2,
      providerName: "마포인테리어철거",
      message:
        "홍대 인근 단골 업체입니다. 깔끔하게 철거하고 청소까지 해드립니다.",
      price: "130만원",
      contact: "카카오톡: mapo_demo",
      createdAt: "2시간 전",
    },
  ],
}

// Mock chat messages
interface ChatMessage {
  id: number
  sender: "me" | "provider" | "system"
  senderName: string
  message: string
  time: string
  isProposal?: boolean
  proposalData?: {
    price: string
    contact: string
  }
}

export default function RequestDetailPage() {
  const params = useParams()
  const requestId = params.id as string
  const request = mockRequestDetails[requestId]

  const [proposalDialogOpen, setProposalDialogOpen] = useState(false)
  const [chatDialogOpen, setChatDialogOpen] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

  // New proposal form state
  const [proposalMessage, setProposalMessage] = useState("")
  const [proposalPrice, setProposalPrice] = useState("")
  const [proposalContact, setProposalContact] = useState("")
  const [mySubmittedProposal, setMySubmittedProposal] = useState<Proposal | null>(null)
  const [myChatHistory, setMyChatHistory] = useState<Record<string, ChatMessage[]>>({})

  const proposals = mockProposals[requestId] || []
  const allProposals = mySubmittedProposal ? [...proposals, mySubmittedProposal] : proposals

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

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedProposal) return
    const newMsg: ChatMessage = {
      id: chatMessages.length + 1,
      sender: "me",
      senderName: "나",
      message: newMessage,
      time: new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
    const updatedMessages = [...chatMessages, newMsg]
    setChatMessages(updatedMessages)
    
    // Update chat history
    setMyChatHistory((prev) => ({
      ...prev,
      [selectedProposal.id.toString()]: updatedMessages,
    }))
    
    setNewMessage("")
  }

  const handleSubmitProposal = () => {
    if (!proposalMessage.trim() || !proposalPrice.trim() || !proposalContact.trim()) return
    
    const now = new Date()
    const timeString = now.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    })
    
    // Create new proposal
    const newProposal: Proposal = {
      id: Date.now(),
      providerName: "나 (서비스 제공자)",
      message: proposalMessage,
      price: proposalPrice,
      contact: proposalContact,
      createdAt: "방금 전",
    }
    
    // Create initial chat messages with proposal info
    const proposalChatMessages: ChatMessage[] = [
      {
        id: 1,
        sender: "system",
        senderName: "시스템",
        message: `${request.author}님에게 제안서를 보냈습니다.`,
        time: timeString,
      },
      {
        id: 2,
        sender: "me",
        senderName: "나",
        message: proposalMessage,
        time: timeString,
        isProposal: true,
        proposalData: {
          price: proposalPrice,
          contact: proposalContact,
        },
      },
    ]
    
    setMySubmittedProposal(newProposal)
    setMyChatHistory((prev) => ({
      ...prev,
      [newProposal.id.toString()]: proposalChatMessages,
    }))
    
    // Close proposal dialog and open chat
    setProposalDialogOpen(false)
    setProposalMessage("")
    setProposalPrice("")
    setProposalContact("")
    
    // Auto-open chat with the new proposal
    setSelectedProposal(newProposal)
    setChatMessages(proposalChatMessages)
    setChatDialogOpen(true)
  }

  const openChat = (proposal: Proposal) => {
    setSelectedProposal(proposal)
    
    // Load existing chat history or create initial messages for this proposal
    const existingHistory = myChatHistory[proposal.id.toString()]
    if (existingHistory) {
      setChatMessages(existingHistory)
    } else {
      // For existing proposals (mock data), show initial greeting
      const initialMessages: ChatMessage[] = [
        {
          id: 1,
          sender: "provider",
          senderName: proposal.providerName,
          message: proposal.message,
          time: proposal.createdAt,
          isProposal: true,
          proposalData: {
            price: proposal.price,
            contact: proposal.contact,
          },
        },
      ]
      setChatMessages(initialMessages)
      setMyChatHistory((prev) => ({
        ...prev,
        [proposal.id.toString()]: initialMessages,
      }))
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
                      {request.time}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {request.author}
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
                  받은 제안 ({allProposals.length}건)
                </h2>
                {allProposals.length > 0 ? (
                  <div className="space-y-3">
                    {allProposals.map((proposal) => (
                      <Card key={proposal.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">
                                  {proposal.providerName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {proposal.createdAt}
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
                  <DialogTitle className="text-base">
                    {selectedProposal?.providerName}
                  </DialogTitle>
                  <DialogDescription className="text-xs">
                    Encrypted / Zero-Fee
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
                  <div key={msg.id}>
                    {msg.sender === "system" ? (
                      <div className="flex justify-center">
                        <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                          {msg.message}
                        </span>
                      </div>
                    ) : (
                      <div
                        className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] ${msg.sender === "me" ? "order-2" : ""}`}
                        >
                          <div className="mb-1 flex items-center gap-2">
                            {msg.sender !== "me" && (
                              <div className="h-8 w-8 rounded-full bg-muted" />
                            )}
                            <span className="text-xs text-muted-foreground">
                              {msg.senderName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {msg.time}
                            </span>
                            {msg.sender === "me" && (
                              <div className="h-8 w-8 rounded-full bg-primary/20" />
                            )}
                          </div>
                          <div
                            className={`rounded-lg px-4 py-3 ${
                              msg.sender === "me"
                                ? "bg-primary text-primary-foreground"
                                : "border border-border bg-background"
                            }`}
                          >
                            {msg.isProposal && msg.proposalData ? (
                              <div className="space-y-2">
                                <p className="text-sm">{msg.message}</p>
                                <div className="mt-3 rounded border border-border/50 bg-background/50 p-2">
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className={msg.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}>예상 비용:</span>
                                    <span className="font-semibold">{msg.proposalData.price}</span>
                                  </div>
                                  <div className="mt-1 flex items-center gap-2 text-xs">
                                    <span className={msg.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}>연락처:</span>
                                    <span className="font-mono">{msg.proposalData.contact}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm">{msg.message}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
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
