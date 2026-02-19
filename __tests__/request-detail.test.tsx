/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RequestDetailPage from '@/app/requests/[id]/page';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => ({ id: '1' }),
}));

jest.mock('@/components/header', () => ({
  Header: () => <div data-testid="mock-header" />,
}));

jest.mock('@/components/footer', () => ({
  Footer: () => <div data-testid="mock-footer" />,
}));

// Supabase mock
const mockGetUser = jest.fn();
const mockRequestsSingle = jest.fn();
const mockProposalsOrder = jest.fn();
const mockProposalsInsertSingle = jest.fn();
const mockMessagesInsert = jest.fn();

const mockSupabase = {
  auth: { getUser: mockGetUser },
  from: jest.fn((table: string) => {
    if (table === 'requests') {
      return {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: mockRequestsSingle,
          }),
        }),
      };
    }
    if (table === 'proposals') {
      return {
        // 목록 조회: from('proposals').select().eq().order()
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: mockProposalsOrder,
          }),
        }),
        // 제안 삽입: from('proposals').insert().select().single()
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: mockProposalsInsertSingle,
          }),
        }),
      };
    }
    if (table === 'messages') {
      return { insert: mockMessagesInsert };
    }
    return {};
  }),
};

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}));

const OWNER_ID = 'owner-user-123';
const OTHER_USER_ID = 'other-user-456';

const mockRequest = {
  id: 1,
  author_id: OWNER_ID,
  title: '에어컨 청소 도와주세요',
  description: '에어컨 청소가 필요합니다.',
  category: '청소',
  region: '서울 마포구',
  status: 'open',
  created_at: new Date().toISOString(),
  profiles: { username: '의뢰인' },
};

describe('RequestDetailPage', () => {
  beforeAll(() => {
    window.alert = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequestsSingle.mockResolvedValue({ data: mockRequest, error: null });
    mockProposalsOrder.mockResolvedValue({ data: [], error: null });
  });

  // ─── 본인 요청 - 제안 불가 ────────────────────────────────────────────────

  describe('본인이 올린 요청 - 제안 불가', () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({ data: { user: { id: OWNER_ID } } });
    });

    it('"내가 올린 요청입니다" 안내 문구가 표시된다', async () => {
      render(<RequestDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('에어컨 청소 도와주세요')).toBeInTheDocument();
      });

      expect(screen.getByText('내가 올린 요청입니다')).toBeInTheDocument();
    });

    it('제안서 보내기 버튼이 표시되지 않는다', async () => {
      render(<RequestDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('에어컨 청소 도와주세요')).toBeInTheDocument();
      });

      expect(
        screen.queryByRole('button', { name: /제안서 보내기/i })
      ).not.toBeInTheDocument();
    });
  });

  // ─── 다른 사람의 요청 - 제안 가능 ────────────────────────────────────────

  describe('다른 사람의 요청 - 제안 가능', () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({ data: { user: { id: OTHER_USER_ID } } });
    });

    it('제안서 보내기 버튼이 표시된다', async () => {
      render(<RequestDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('에어컨 청소 도와주세요')).toBeInTheDocument();
      });

      expect(
        screen.getByRole('button', { name: /제안서 보내기$/i })
      ).toBeInTheDocument();
    });

    it('제안 제출 시 제안 메시지가 채팅 첫 메시지로 자동 삽입된다', async () => {
      const newProposal = {
        id: 99,
        request_id: 1,
        provider_id: OTHER_USER_ID,
        message: '에어컨 청소 전문가입니다.',
        price: '10만원',
        contact: '010-1234-5678',
        created_at: new Date().toISOString(),
        profiles: { username: '제공자' },
      };
      mockProposalsInsertSingle.mockResolvedValue({
        data: newProposal,
        error: null,
      });
      mockMessagesInsert.mockResolvedValue({ error: null });

      render(<RequestDetailPage />);

      // 페이지 로드 대기
      await waitFor(() => {
        expect(screen.getByText('에어컨 청소 도와주세요')).toBeInTheDocument();
      });

      // Dialog 열기
      fireEvent.click(screen.getByRole('button', { name: /제안서 보내기$/i }));

      // Dialog 내 폼 필드가 나타날 때까지 대기
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText('서비스 내용과 강점을 소개해주세요.')
        ).toBeInTheDocument();
      });

      // 폼 작성
      fireEvent.change(
        screen.getByPlaceholderText('서비스 내용과 강점을 소개해주세요.'),
        { target: { value: '에어컨 청소 전문가입니다.' } }
      );
      fireEvent.change(screen.getByPlaceholderText('예: 15만원'), {
        target: { value: '10만원' },
      });
      fireEvent.change(
        screen.getByPlaceholderText('예: 010-1234-5678 또는 오픈채팅 링크'),
        { target: { value: '010-1234-5678' } }
      );

      // 제안서 제출
      fireEvent.click(
        screen.getByRole('button', { name: /제안서 보내기 \(무료\)/i })
      );

      // 제안 메시지가 messages 테이블에 첫 메시지로 삽입되었는지 검증
      await waitFor(() => {
        expect(mockMessagesInsert).toHaveBeenCalledWith({
          proposal_id: 99,
          sender_id: OTHER_USER_ID,
          message: '에어컨 청소 전문가입니다.',
        });
      });

      // 채팅 페이지로 이동했는지 검증
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/requests/1/chat/99');
      });
    });

    it('제안 제출 후 채팅 첫 메시지 삽입이 proposal 저장보다 먼저 실행되지 않는다', async () => {
      const newProposal = {
        id: 55,
        request_id: 1,
        provider_id: OTHER_USER_ID,
        message: '이사 전문 서비스입니다.',
        price: '20만원',
        contact: '010-9999-8888',
        created_at: new Date().toISOString(),
        profiles: { username: '제공자' },
      };
      mockProposalsInsertSingle.mockResolvedValue({
        data: newProposal,
        error: null,
      });
      mockMessagesInsert.mockResolvedValue({ error: null });

      render(<RequestDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('에어컨 청소 도와주세요')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /제안서 보내기$/i }));

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText('서비스 내용과 강점을 소개해주세요.')
        ).toBeInTheDocument();
      });

      fireEvent.change(
        screen.getByPlaceholderText('서비스 내용과 강점을 소개해주세요.'),
        { target: { value: '이사 전문 서비스입니다.' } }
      );
      fireEvent.change(screen.getByPlaceholderText('예: 15만원'), {
        target: { value: '20만원' },
      });
      fireEvent.change(
        screen.getByPlaceholderText('예: 010-1234-5678 또는 오픈채팅 링크'),
        { target: { value: '010-9999-8888' } }
      );

      fireEvent.click(
        screen.getByRole('button', { name: /제안서 보내기 \(무료\)/i })
      );

      await waitFor(() => {
        expect(mockMessagesInsert).toHaveBeenCalled();
      });

      // proposal 저장 먼저, 그 다음 message 삽입 순서 검증
      const proposalCallOrder =
        mockProposalsInsertSingle.mock.invocationCallOrder[0];
      const messagesCallOrder = mockMessagesInsert.mock.invocationCallOrder[0];
      expect(proposalCallOrder).toBeLessThan(messagesCallOrder);
    });

    it('미로그인 상태에서는 제안서 제출 버튼이 비활성화된다', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      render(<RequestDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('에어컨 청소 도와주세요')).toBeInTheDocument();
      });

      // 비로그인이지만 본인 요청이 아니므로 폼은 표시됨
      fireEvent.click(screen.getByRole('button', { name: /제안서 보내기$/i }));

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /제안서 보내기 \(무료\)/i })
        ).toBeDisabled();
      });

      expect(mockMessagesInsert).not.toHaveBeenCalled();
    });

    it('필드 미입력 시 경고 알림이 표시된다', async () => {
      render(<RequestDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('에어컨 청소 도와주세요')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /제안서 보내기$/i }));

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /제안서 보내기 \(무료\)/i })
        ).toBeInTheDocument();
      });

      // 빈 폼으로 제출 시도 (enabled 상태이지만 내용 없음)
      // Note: button is disabled when !currentUser, but currentUser is OTHER_USER_ID here
      fireEvent.click(
        screen.getByRole('button', { name: /제안서 보내기 \(무료\)/i })
      );

      expect(window.alert).toHaveBeenCalledWith('모든 필드를 입력해주세요.');
      expect(mockMessagesInsert).not.toHaveBeenCalled();
    });
  });

  // ─── 기존 제안 목록 표시 ─────────────────────────────────────────────────

  describe('제안 목록 표시', () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({ data: { user: { id: OTHER_USER_ID } } });
    });

    it('받은 제안이 없을 때 안내 문구가 표시된다', async () => {
      mockProposalsOrder.mockResolvedValue({ data: [], error: null });

      render(<RequestDetailPage />);

      await waitFor(() => {
        expect(
          screen.getByText('아직 받은 제안이 없습니다.')
        ).toBeInTheDocument();
      });
    });

    it('받은 제안이 있을 때 목록이 표시된다', async () => {
      const mockProposals = [
        {
          id: 10,
          request_id: 1,
          provider_id: 'some-provider',
          message: '전문 청소 서비스 제공합니다.',
          price: '8만원',
          contact: '010-5555-6666',
          created_at: new Date().toISOString(),
          profiles: { username: '청소업체A' },
        },
      ];
      mockProposalsOrder.mockResolvedValue({
        data: mockProposals,
        error: null,
      });

      render(<RequestDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('청소업체A')).toBeInTheDocument();
        expect(
          screen.getByText('전문 청소 서비스 제공합니다.')
        ).toBeInTheDocument();
        expect(screen.getByText('8만원')).toBeInTheDocument();
      });
    });
  });
});
