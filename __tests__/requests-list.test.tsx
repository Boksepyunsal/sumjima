import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import RequestListPage from '@/app/requests/page';

// Mock Header
jest.mock('@/components/header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>,
}));

// Mock Supabase Client (for data fetching in RequestListPage)
const mockOrder = jest.fn();
const mockSelect = jest.fn(() => ({
  order: mockOrder,
}));
const mockFrom = jest.fn(() => ({
  select: mockSelect,
}));
const mockSupabase = {
  from: mockFrom,
};

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}));

const mockRequests = [
  {
    id: 1,
    title: '이사 도와주세요',
    category: '이사/용달',
    region: '서울 마포구',
    created_at: new Date().toISOString(),
    status: 'open',
    proposals: [{ count: 2 }],
  },
  {
    id: 2,
    title: '에어컨 청소',
    category: '청소',
    region: '서울 강남구',
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    status: 'matched',
    proposals: [{ count: 5 }],
  },
];

describe('RequestListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    // Return a promise that never resolves immediately to test loading state
    mockOrder.mockReturnValue(new Promise(() => {}));

    render(<RequestListPage />);
    expect(screen.getByText(/요청 목록을 불러오는 중/i)).toBeInTheDocument();
  });

  it('renders request list after fetching', async () => {
    mockOrder.mockResolvedValue({ data: mockRequests, error: null });

    render(<RequestListPage />);

    // Wait for data to load
    await waitFor(() => {
      expect(
        screen.queryByText(/요청 목록을 불러오는 중/i)
      ).not.toBeInTheDocument();
    });

    // Check titles
    expect(screen.getByText('이사 도와주세요')).toBeInTheDocument();
    expect(screen.getByText('에어컨 청소')).toBeInTheDocument();

    // Check regions
    expect(screen.getByText('서울 마포구')).toBeInTheDocument();
    expect(screen.getByText('서울 강남구')).toBeInTheDocument();

    // Check Status Badges
    expect(screen.getByText('2 Offers')).toBeInTheDocument();
    expect(screen.getByText('Matched')).toBeInTheDocument();
  });

  it('renders empty state if no requests found', async () => {
    mockOrder.mockResolvedValue({ data: [], error: null });

    render(<RequestListPage />);

    await waitFor(() => {
      expect(screen.getByText('No more requests')).toBeInTheDocument();
    });
  });
});
