/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatPage from '@/app/requests/[id]/chat/[proposalId]/page';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => ({ id: '1', proposalId: '1' }),
}));

jest.mock('@/components/header', () => ({
  Header: () => <div data-testid="mock-header" />,
}));

jest.mock('@/components/footer', () => ({
  Footer: () => <div data-testid="mock-footer" />,
}));

// Supabase mock
const mockGetUser = jest.fn();
const mockProposalSingle = jest.fn();
const mockMessagesOrder = jest.fn();
const mockMessagesInsert = jest.fn();
const mockProfileSingle = jest.fn();

const mockChannel = {
  on: jest.fn().mockReturnThis(),
  subscribe: jest.fn().mockReturnThis(),
};

const mockSupabase = {
  auth: { getUser: mockGetUser },
  from: jest.fn((table: string) => {
    if (table === 'proposals') {
      return {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: mockProposalSingle,
          }),
        }),
      };
    }
    if (table === 'messages') {
      return {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: mockMessagesOrder,
          }),
        }),
        insert: mockMessagesInsert,
      };
    }
    if (table === 'profiles') {
      return {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: mockProfileSingle,
          }),
        }),
      };
    }
    return {};
  }),
  channel: jest.fn(() => mockChannel),
  removeChannel: jest.fn(),
};

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}));

const PROVIDER_ID = 'provider-user-123';
const REQUESTER_ID = 'requester-user-456';

const mockProposal = {
  id: 1,
  request_id: 1,
  provider_id: PROVIDER_ID,
  message: '에어컨 청소 전문가입니다.',
  price: '10만원',
  contact: '010-1234-5678',
  created_at: new Date().toISOString(),
  profiles: { username: '청소전문가' },
};

// 제안 메시지가 첫 메시지로 삽입된 상황
const firstMessage = {
  id: 1,
  proposal_id: 1,
  sender_id: PROVIDER_ID,
  message: '에어컨 청소 전문가입니다.',
  created_at: new Date().toISOString(),
  profiles: { username: '청소전문가' },
};

describe('ChatPage', () => {
  beforeAll(() => {
    window.alert = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockProposalSingle.mockResolvedValue({ data: mockProposal, error: null });
    mockMessagesOrder.mockResolvedValue({ data: [firstMessage], error: null });
    mockProfileSingle.mockResolvedValue({
      data: { username: '청소전문가' },
      error: null,
    });
  });

  // ─── 인증 ──────────────────────────────────────────────────────────────────

  it('미인증 사용자는 로그인 페이지로 리다이렉트된다', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    render(<ChatPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  // ─── 첫 메시지 자동 삽입 검증 ──────────────────────────────────────────────

  describe('제안 메시지 → 채팅 첫 메시지', () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({ data: { user: { id: REQUESTER_ID } } });
    });

    it('제안 메시지가 채팅방에 첫 메시지로 표시된다', async () => {
      render(<ChatPage />);

      await waitFor(() => {
        expect(
          screen.getByText('에어컨 청소 전문가입니다.')
        ).toBeInTheDocument();
      });
    });

    it('제안자(제공자) 이름으로 첫 메시지가 표시된다', async () => {
      render(<ChatPage />);

      await waitFor(() => {
        // 헤더 + 메시지 발신자 영역 모두에 이름이 표시됨
        expect(screen.getAllByText('청소전문가').length).toBeGreaterThanOrEqual(
          1
        );
      });
    });

    it('첫 메시지 이전에는 "아직 메시지가 없습니다" 상태가 표시된다', async () => {
      mockMessagesOrder.mockResolvedValue({ data: [], error: null });

      render(<ChatPage />);

      await waitFor(() => {
        expect(screen.getByText('아직 메시지가 없습니다.')).toBeInTheDocument();
      });
    });
  });

  // ─── 메시지 송수신 ─────────────────────────────────────────────────────────

  describe('메시지 전송', () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({ data: { user: { id: REQUESTER_ID } } });
      mockMessagesInsert.mockResolvedValue({ error: null });
    });

    it('메시지 입력 후 Enter 키로 전송할 수 있다', async () => {
      render(<ChatPage />);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText('메시지를 입력하세요...')
        ).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText('메시지를 입력하세요...');
      fireEvent.change(input, {
        target: { value: '감사합니다! 언제 방문 가능하신가요?' },
      });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      await waitFor(() => {
        expect(mockMessagesInsert).toHaveBeenCalledWith(
          expect.objectContaining({
            proposal_id: 1,
            sender_id: REQUESTER_ID,
            message: '감사합니다! 언제 방문 가능하신가요?',
          })
        );
      });
    });

    it('Shift+Enter는 전송하지 않는다', async () => {
      render(<ChatPage />);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText('메시지를 입력하세요...')
        ).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText('메시지를 입력하세요...');
      fireEvent.change(input, { target: { value: '줄바꿈 테스트' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: true });

      expect(mockMessagesInsert).not.toHaveBeenCalled();
    });

    it('빈 메시지는 전송되지 않는다', async () => {
      render(<ChatPage />);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText('메시지를 입력하세요...')
        ).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText('메시지를 입력하세요...');
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockMessagesInsert).not.toHaveBeenCalled();
    });

    it('전송 성공 후 입력창이 초기화된다', async () => {
      render(<ChatPage />);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText('메시지를 입력하세요...')
        ).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(
        '메시지를 입력하세요...'
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: '안녕하세요!' } });

      expect(input.value).toBe('안녕하세요!');

      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });
  });

  // ─── 내 메시지 / 상대방 메시지 구분 ────────────────────────────────────────

  describe('메시지 발신자 구분', () => {
    it('내가 보낸 메시지는 "나"로 표시된다', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: REQUESTER_ID } } });

      const myMessage = {
        id: 2,
        proposal_id: 1,
        sender_id: REQUESTER_ID,
        message: '언제 방문 가능하세요?',
        created_at: new Date().toISOString(),
        profiles: { username: '의뢰인' },
      };
      mockMessagesOrder.mockResolvedValue({
        data: [firstMessage, myMessage],
        error: null,
      });

      render(<ChatPage />);

      await waitFor(() => {
        expect(screen.getByText('나')).toBeInTheDocument();
      });
    });

    it('상대방 메시지는 상대방 이름으로 표시된다', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: REQUESTER_ID } } });

      render(<ChatPage />);

      await waitFor(() => {
        // 헤더 + 메시지 발신자 영역 등 최소 1개 이상 표시
        expect(screen.getAllByText('청소전문가').length).toBeGreaterThanOrEqual(
          1
        );
      });
    });

    it('내 메시지와 상대 메시지가 동시에 표시된다', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: REQUESTER_ID } } });

      const myMessage = {
        id: 2,
        proposal_id: 1,
        sender_id: REQUESTER_ID,
        message: '내일 오후 가능하신가요?',
        created_at: new Date().toISOString(),
        profiles: { username: '의뢰인' },
      };
      mockMessagesOrder.mockResolvedValue({
        data: [firstMessage, myMessage],
        error: null,
      });

      render(<ChatPage />);

      await waitFor(() => {
        expect(screen.getByText('나')).toBeInTheDocument();
        expect(screen.getAllByText('청소전문가').length).toBeGreaterThanOrEqual(
          1
        );
        expect(
          screen.getByText('에어컨 청소 전문가입니다.')
        ).toBeInTheDocument();
        expect(screen.getByText('내일 오후 가능하신가요?')).toBeInTheDocument();
      });
    });
  });

  // ─── 제안 정보 표시 ────────────────────────────────────────────────────────

  describe('제안 정보 헤더', () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({ data: { user: { id: REQUESTER_ID } } });
    });

    it('채팅 헤더에 제공자 이름이 표시된다', async () => {
      render(<ChatPage />);

      await waitFor(() => {
        expect(screen.getAllByText('청소전문가').length).toBeGreaterThanOrEqual(
          1
        );
      });
    });

    it('채팅 헤더에 가격과 연락처가 표시된다', async () => {
      render(<ChatPage />);

      await waitFor(() => {
        expect(screen.getByText(/10만원/)).toBeInTheDocument();
        expect(screen.getByText(/010-1234-5678/)).toBeInTheDocument();
      });
    });
  });
});
