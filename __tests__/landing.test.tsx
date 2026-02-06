import React from 'react';
import { render, screen } from '@testing-library/react';
import LandingPage from '@/app/page';

// Mock Header
jest.mock('@/components/header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>,
}));

describe('LandingPage', () => {
  it('renders the hero section with title and CTA button', () => {
    render(<LandingPage />);

    // Check for main title
    const titleElement = screen.getByText(/수수료 뒤에 숨지 마세요/i);
    expect(titleElement).toBeInTheDocument();

    // Check for "지금 바로 시작하기" button (CTA)
    const ctaButton = screen.getByRole('link', { name: /지금 바로 시작하기/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', '/requests/new');
  });

  it('renders the process section', () => {
    render(<LandingPage />);

    // Check for process section title
    const processTitle = screen.getByText(/서비스 이용 방법/i);
    expect(processTitle).toBeInTheDocument();

    // Check for process steps
    expect(screen.getByText('요청서 작성')).toBeInTheDocument();
    expect(screen.getByText('직거래 제안')).toBeInTheDocument();
    expect(screen.getByText('수수료 0원')).toBeInTheDocument();
  });
});
