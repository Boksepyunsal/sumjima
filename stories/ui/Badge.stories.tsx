import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'destructive',
        'outline',
        'ghost',
        'link',
      ],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '신규',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: '진행중',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: '마감',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: '대기중',
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'secondary',
    children: (
      <>
        <CheckCircle />
        매칭됨
      </>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
    </div>
  ),
};
