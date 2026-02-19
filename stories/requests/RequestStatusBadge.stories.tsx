import type { Meta, StoryObj } from '@storybook/react';
import { RequestStatusBadge } from '@/components/requests/request-status-badge';

const meta = {
  title: 'Requests/RequestStatusBadge',
  component: RequestStatusBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['open', 'matched', 'closed'],
    },
    offers: {
      control: { type: 'number', min: 0, max: 20 },
    },
  },
} satisfies Meta<typeof RequestStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OpenWaiting: Story = {
  args: {
    status: 'open',
    offers: 0,
  },
};

export const OpenWithOffers: Story = {
  args: {
    status: 'open',
    offers: 3,
  },
};

export const Matched: Story = {
  args: {
    status: 'matched',
    offers: 1,
  },
};

export const Closed: Story = {
  args: {
    status: 'closed',
    offers: 5,
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <RequestStatusBadge status="open" offers={0} />
      <RequestStatusBadge status="open" offers={3} />
      <RequestStatusBadge status="matched" offers={1} />
      <RequestStatusBadge status="closed" offers={5} />
    </div>
  ),
};
