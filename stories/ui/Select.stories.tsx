import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="카테고리 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="moving">이사/용달</SelectItem>
        <SelectItem value="cleaning">청소</SelectItem>
        <SelectItem value="demolition">철거</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="서비스 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>이사/운반</SelectLabel>
          <SelectItem value="home-moving">가정 이사</SelectItem>
          <SelectItem value="office-moving">사무실 이사</SelectItem>
          <SelectItem value="small-moving">소형 이사</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>청소</SelectLabel>
          <SelectItem value="move-in-cleaning">입주 청소</SelectItem>
          <SelectItem value="move-out-cleaning">이사 청소</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>기타</SelectLabel>
          <SelectItem value="demolition">철거</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <Select defaultValue="cleaning">
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="moving">이사/용달</SelectItem>
        <SelectItem value="cleaning">청소</SelectItem>
        <SelectItem value="demolition">철거</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="비활성화됨" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="moving">이사/용달</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const SmallSize: Story = {
  render: () => (
    <Select>
      <SelectTrigger size="sm" className="w-40">
        <SelectValue placeholder="카테고리" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="moving">이사/용달</SelectItem>
        <SelectItem value="cleaning">청소</SelectItem>
        <SelectItem value="demolition">철거</SelectItem>
      </SelectContent>
    </Select>
  ),
};
