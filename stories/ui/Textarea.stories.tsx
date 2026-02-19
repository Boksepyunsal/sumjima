import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '@/components/ui/textarea';

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: '요청 내용을 상세히 작성해 주세요.',
  },
};

export const WithValue: Story = {
  args: {
    defaultValue:
      '서울 강남구에서 마포구로 이사입니다.\n3.5톤 트럭 필요하고 포장 서비스도 포함해 주세요.\n3월 15일 오전 9시부터 가능합니다.',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: '비활성화된 입력',
    disabled: true,
  },
};

export const Invalid: Story = {
  args: {
    defaultValue: '내용이 너무 짧습니다.',
    'aria-invalid': true,
  },
};
