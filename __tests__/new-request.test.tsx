import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewRequestPage from '@/app/requests/new/page';

// Mock useRouter
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Header to avoid async updates and dependency on useSupabase logic inside Header
jest.mock('@/components/header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>,
}));

// Mock Supabase
const mockInsert = jest.fn();
// We don't need 'select' mock anymore since Header is mocked
const mockFrom = jest.fn(() => ({
  insert: mockInsert,
}));

const mockSupabaseClient = {
  from: mockFrom,
  auth: { signOut: jest.fn() },
};

// Mock useSupabase hook
const mockUseSupabase = jest.fn();
jest.mock('@/components/supabase-provider', () => ({
  useSupabase: () => mockUseSupabase(),
}));

// Mock Radix UI Select components to simplify testing
jest.mock('@/components/ui/select', () => ({
  Select: ({ onValueChange, children }: any) => (
    <div data-testid="mock-select-container">
      <select
        data-testid="mock-select"
        onChange={(e) => onValueChange(e.target.value)}
      >
        {children}
      </select>
    </div>
  ),
  SelectTrigger: ({ children }: any) => (
    <div data-testid="select-trigger">{children}</div>
  ),
  SelectValue: () => <div>Select Value</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ value, children }: any) => (
    <option value={value}>{children}</option>
  ),
}));

describe('NewRequestPage', () => {
  beforeAll(() => {
    window.alert = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to login if user is not authenticated', () => {
    mockUseSupabase.mockReturnValue({
      supabase: mockSupabaseClient,
      user: null,
      isLoading: false,
    });

    render(<NewRequestPage />);

    expect(window.alert).toHaveBeenCalledWith('로그인이 필요합니다.');
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('renders the form correctly when authenticated', () => {
    mockUseSupabase.mockReturnValue({
      supabase: mockSupabaseClient,
      user: { id: 'test-user-id' },
      isLoading: false,
    });

    render(<NewRequestPage />);

    expect(screen.getByLabelText(/제목/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/상세 내용/i)).toBeInTheDocument();
    // Check for our mocked selects
    expect(screen.getAllByTestId('mock-select')).toHaveLength(2);
    expect(
      screen.getByRole('button', { name: /요청서 등록하기/i })
    ).toBeInTheDocument();
  });

  it('shows alert if fields are missing on submit', () => {
    mockUseSupabase.mockReturnValue({
      supabase: mockSupabaseClient,
      user: { id: 'test-user-id' },
      isLoading: false,
    });

    render(<NewRequestPage />);

    const submitButton = screen.getByRole('button', {
      name: /요청서 등록하기/i,
    });
    fireEvent.click(submitButton);

    expect(window.alert).toHaveBeenCalledWith('모든 필드를 입력해주세요.');
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('submits the form successfully with valid data', async () => {
    mockUseSupabase.mockReturnValue({
      supabase: mockSupabaseClient,
      user: { id: 'test-user-id' },
      isLoading: false,
    });
    mockInsert.mockResolvedValue({ error: null });

    render(<NewRequestPage />);

    // 1. Title
    const titleInput = screen.getByLabelText(/제목/i);
    fireEvent.change(titleInput, { target: { value: 'Test Request Title' } });

    // 2. Description
    const descInput = screen.getByLabelText(/상세 내용/i);
    fireEvent.change(descInput, {
      target: { value: 'Test Description Content' },
    });

    // 3. Select Category & Region
    const selects = screen.getAllByTestId('mock-select');
    // Assuming order: Category is first, Region is second
    const categorySelect = selects[0];
    const regionSelect = selects[1];

    fireEvent.change(categorySelect, { target: { value: '청소' } });
    fireEvent.change(regionSelect, { target: { value: '서울 마포구' } });

    // Submit
    const submitButton = screen.getByRole('button', {
      name: /요청서 등록하기/i,
    });
    fireEvent.click(submitButton);

    // Verify Supabase call
    expect(mockInsert).toHaveBeenCalledWith({
      title: 'Test Request Title',
      description: 'Test Description Content',
      category: '청소',
      region: '서울 마포구',
      author_id: 'test-user-id',
    });

    // Verify Success Alert & Redirect
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        '요청서가 성공적으로 등록되었습니다.'
      );
      expect(mockPush).toHaveBeenCalledWith('/requests');
    });
  });
});
