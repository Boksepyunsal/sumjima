/* eslint-disable */
'use client';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Database } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ArrowLeft, CheckCircle, Send } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type Proposal = Database['public']['Tables']['proposals']['Row'] & {
  profiles: { username: string | null } | null;
};
type Message = Database['public']['Tables']['messages']['Row'] & {
  profiles: { username: string | null } | null;
};

export default function ChatPage() {
  const params = useParams();
  const requestId = params.id as string;
  const proposalId = params.proposalId as string;
  const supabase = createClient();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: fetchedUser },
      } = await supabase.auth.getUser();
      if (!fetchedUser) {
        router.push('/login');
        return;
      }
      setCurrentUser(fetchedUser);
    };
    getUser();
  }, [supabase, router]);

  useEffect(() => {
    if (!proposalId) return;

    const fetchData = async () => {
      setLoading(true);

      const { data: proposalData, error: proposalError } = await supabase
        .from('proposals')
        .select(`*, profiles ( username )`)
        .eq('id', Number(proposalId))
        .single();

      if (proposalError || !proposalData) {
        console.error('Error fetching proposal:', proposalError);
        setProposal(null);
        setLoading(false);
        return;
      }
      setProposal(proposalData as Proposal);

      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`*, profiles ( username )`)
        .eq('proposal_id', Number(proposalId))
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
      } else {
        setChatMessages(messagesData as Message[]);
      }

      setLoading(false);
    };

    fetchData();
  }, [proposalId, supabase]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (!proposalId) return;

    const channel = supabase
      .channel(`messages-for-proposal-${proposalId}`)
      .on<Message>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `proposal_id=eq.${proposalId}`,
        },
        async (payload) => {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', payload.new.sender_id)
            .single();

          if (error) {
            console.error('Error fetching profile for new message', error);
            setChatMessages((prev) => [...prev, payload.new as Message]);
          } else {
            const formattedMessage = {
              ...payload.new,
              profiles: profileData,
            } as Message;
            setChatMessages((prev) => [...prev, formattedMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, proposalId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !proposal || !currentUser) return;

    const messageToInsert: Database['public']['Tables']['messages']['Insert'] =
      {
        proposal_id: proposal.id,
        sender_id: currentUser.id,
        message: newMessage,
      };

    const { error } = await supabase
      .from('messages')
      .insert(messageToInsert as any);

    if (error) {
      console.error(error);
      alert('메시지 전송에 실패했습니다.');
    } else {
      setNewMessage('');
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    messages.forEach((msg) => {
      const dateStr = new Date(msg.created_at).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const last = groups[groups.length - 1];
      if (!last || last.date !== dateStr) {
        groups.push({ date: dateStr, messages: [msg] });
      } else {
        last.messages.push(msg);
      }
    });
    return groups;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">채팅을 불러오는 중...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">채팅을 찾을 수 없습니다.</p>
            <Button asChild variant="outline" className="mt-4 bg-transparent">
              <Link href={`/requests/${requestId}`}>요청으로 돌아가기</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(chatMessages);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 flex-col bg-muted/30">
        {/* Chat Header */}
        <div className="border-b border-border bg-background px-4 py-3 shadow-sm">
          <div className="container mx-auto flex items-center gap-3">
            <Link
              href={`/requests/${requestId}`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex flex-1 items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">
                  {proposal.profiles?.username || '서비스 제공자'}
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  {proposal.price} / {proposal.contact}
                </p>
              </div>
              <Badge
                variant="outline"
                className="border-primary/50 text-primary text-xs"
              >
                <CheckCircle className="mr-1 h-3 w-3" />
                VERIFIED
              </Badge>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-2xl px-4 py-6">
            {chatMessages.length === 0 ? (
              <div className="flex h-full items-center justify-center py-16 text-center">
                <div>
                  <p className="text-muted-foreground">
                    아직 메시지가 없습니다.
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    먼저 인사를 건네보세요!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messageGroups.map((group) => (
                  <div key={group.date}>
                    <div className="mb-4 flex justify-center">
                      <Badge variant="secondary" className="text-xs">
                        {group.date}
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      {group.messages.map((msg) => {
                        const isMine = msg.sender_id === currentUser?.id;
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className="max-w-[75%]">
                              <div
                                className={`mb-1 flex items-center gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
                              >
                                {!isMine && (
                                  <div className="h-7 w-7 rounded-full bg-muted" />
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {isMine
                                    ? '나'
                                    : msg.profiles?.username || '상대방'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(msg.created_at).toLocaleTimeString(
                                    'ko-KR',
                                    {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }
                                  )}
                                </span>
                                {isMine && (
                                  <div className="h-7 w-7 rounded-full bg-primary/20" />
                                )}
                              </div>
                              <div
                                className={`rounded-lg px-4 py-3 ${
                                  isMine
                                    ? 'bg-primary text-primary-foreground'
                                    : 'border border-border bg-background'
                                }`}
                              >
                                <p className="text-sm">{msg.message}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="border-t border-border bg-background px-4 py-3">
          <div className="container mx-auto max-w-2xl">
            <div className="flex items-center gap-2">
              <Input
                placeholder="메시지를 입력하세요..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
