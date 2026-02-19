/* eslint-disable */
'use client';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Database } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  MessageCircle,
  Send,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type RequestDetails = Database['public']['Tables']['requests']['Row'] & {
  profiles: { username: string | null } | null;
};
type Proposal = Database['public']['Tables']['proposals']['Row'] & {
  profiles: { username: string | null } | null;
};

export default function RequestDetailPage() {
  const params = useParams();
  const requestId = params.id as string;
  const supabase = createClient();
  const router = useRouter();

  const [request, setRequest] = useState<RequestDetails | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);

  const [proposalDialogOpen, setProposalDialogOpen] = useState(false);

  // New proposal form state
  const [proposalMessage, setProposalMessage] = useState('');
  const [proposalPrice, setProposalPrice] = useState('');
  const [proposalContact, setProposalContact] = useState('');

  // Helper function for badge variant
  const getBadgeVariant = useCallback((status: RequestDetails['status']) => {
    if (status === 'open') return 'outline';
    if (status === 'matched') return 'secondary';
    return 'outline';
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: fetchedUser },
      } = await supabase.auth.getUser();
      setCurrentUser(fetchedUser);
    };
    getUser();
  }, [supabase]);

  useEffect(() => {
    if (!requestId) return;

    const fetchRequestData = async () => {
      setLoading(true);
      const { data: requestData, error: requestError } = await supabase
        .from('requests')
        .select(`*, profiles ( username )`)
        .eq('id', Number(requestId))
        .single();

      if (requestError || !requestData) {
        // eslint-disable-next-line no-console
        console.error('Error fetching request:', requestError);
        setRequest(null);
      } else {
        setRequest(requestData as RequestDetails);
      }

      const { data: proposalsData, error: proposalsError } = await supabase
        .from('proposals')
        .select(`*, profiles ( username )`)
        .eq('request_id', Number(requestId))
        .order('created_at', { ascending: true });

      if (proposalsError) {
        // eslint-disable-next-line no-console
        console.error('Error fetching proposals:', proposalsError);
      } else {
        setProposals(proposalsData as Proposal[]);
      }

      setLoading(false);
    };

    fetchRequestData();
  }, [requestId, supabase]);

  const handleSubmitProposal = async () => {
    if (
      !proposalMessage.trim() ||
      !proposalPrice.trim() ||
      !proposalContact.trim()
    ) {
      // eslint-disable-next-line no-alert
      alert('모든 필드를 입력해주세요.');
      return;
    }
    if (!currentUser) {
      // eslint-disable-next-line no-alert
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    const proposalToInsert: Database['public']['Tables']['proposals']['Insert'] =
      {
        request_id: Number(requestId),
        provider_id: currentUser.id,
        message: proposalMessage,
        price: proposalPrice,
        contact: proposalContact,
      };

    const { data: newProposal, error } = await supabase
      .from('proposals')
      .insert(proposalToInsert as any)
      .select(`*, profiles ( username )`)
      .single();

    if (error || !newProposal) {
      // eslint-disable-next-line no-alert, no-console
      alert('제안서 제출에 실패했습니다.');
      // eslint-disable-next-line no-console
      console.error(error);
    } else {
      const typed = newProposal as Proposal;

      // 제안 메시지를 채팅 첫 메시지로 자동 삽입
      await supabase.from('messages').insert({
        proposal_id: typed.id,
        sender_id: currentUser.id,
        message: proposalMessage,
      });

      setProposals((prev) => [...prev, typed]);
      setProposalDialogOpen(false);
      setProposalMessage('');
      setProposalPrice('');
      setProposalContact('');
      // 제안 완료 후 채팅 페이지로 이동
      router.push(`/requests/${requestId}/chat/${typed.id}`);
    }
    return undefined;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">요청 정보를 불러오는 중...</p>
        </main>
        <Footer />
      </div>
    );
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
    );
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
                    <Badge
                      variant={getBadgeVariant(request.status)}
                      className={`text-xs ${request.status === 'open' ? 'border-primary/50 text-primary' : ''} ${request.status === 'closed' ? 'text-muted-foreground' : ''}`}
                    >
                      {request.status === 'open' && '모집중'}
                      {request.status === 'matched' && '매칭완료'}
                      {request.status === 'closed' && '마감'}
                    </Badge>
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
                      {request.profiles?.username || '사용자'}
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
                                  {proposal.profiles?.username ||
                                    '서비스 제공자'}
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
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                href={`/requests/${requestId}/chat/${proposal.id}`}
                              >
                                <MessageCircle className="mr-1 h-4 w-4" />
                                채팅
                              </Link>
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
                  {currentUser?.id === request.author_id ? (
                    <>
                      <h3 className="font-semibold text-foreground">
                        내가 올린 요청입니다
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        제안이 오면 채팅으로 소통해보세요.
                      </p>
                    </>
                  ) : (
                    <>
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
                              <Label
                                htmlFor="proposal-message"
                                className="text-sm font-medium"
                              >
                                제안 메시지
                              </Label>
                              <Textarea
                                id="proposal-message"
                                placeholder="서비스 내용과 강점을 소개해주세요."
                                value={proposalMessage}
                                onChange={(e) =>
                                  setProposalMessage(e.target.value)
                                }
                                className="min-h-[100px]"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="proposal-price"
                                className="text-sm font-medium"
                              >
                                예상 비용
                              </Label>
                              <Input
                                id="proposal-price"
                                placeholder="예: 15만원"
                                value={proposalPrice}
                                onChange={(e) =>
                                  setProposalPrice(e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="proposal-contact"
                                className="text-sm font-medium"
                              >
                                연락처 / 오픈채팅
                              </Label>
                              <Input
                                id="proposal-contact"
                                placeholder="예: 010-1234-5678 또는 오픈채팅 링크"
                                value={proposalContact}
                                onChange={(e) =>
                                  setProposalContact(e.target.value)
                                }
                              />
                            </div>
                            <Button
                              className="w-full"
                              onClick={handleSubmitProposal}
                              disabled={!currentUser}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              제안서 보내기 (무료)
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}

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
      </main>

      <Footer />
    </div>
  );
}
