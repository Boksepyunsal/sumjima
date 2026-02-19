import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/components/ui/input';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search'],
    },
    disabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: '이름을 입력하세요',
    type: 'text',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'example@email.com',
  },
};

export const WithValue: Story = {
  args: {
    type: 'text',
    defaultValue: '입력된 값',
  },
};

export const Disabled: Story = {
  args: {
    type: 'text',
    placeholder: '비활성화된 입력',
    disabled: true,
  },
};

export const Invalid: Story = {
  args: {
    type: 'text',
    defaultValue: '잘못된 값',
    'aria-invalid': true,
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: '비밀번호를 입력하세요',
  },
};
