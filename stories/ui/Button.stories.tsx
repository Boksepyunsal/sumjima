import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ui/button';
import { Mail, Plus, Trash2 } from 'lucide-react';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: [
        'xs',
        'sm',
        'default',
        'lg',
        'icon',
        'icon-xs',
        'icon-sm',
        'icon-lg',
      ],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '견적 요청하기',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: '삭제',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: '취소',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: '임시저장',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: '로그아웃',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: '자세히 보기',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: '소형 버튼',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: '지금 바로 시작하기',
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Mail />
        이메일로 로그인
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    size: 'icon',
    variant: 'outline',
    'aria-label': '추가',
    children: <Plus />,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: '비활성화됨',
  },
};

export const DestructiveWithIcon: Story = {
  args: {
    variant: 'destructive',
    size: 'sm',
    children: (
      <>
        <Trash2 />
        삭제
      </>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
