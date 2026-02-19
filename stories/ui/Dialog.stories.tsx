import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">다이얼로그 열기</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>견적 요청 확인</DialogTitle>
          <DialogDescription>
            요청 내용을 최종 확인해 주세요. 등록 후에도 수정이 가능합니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button>등록하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>견적 제안하기</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>견적 제안</DialogTitle>
          <DialogDescription>
            서비스 내용과 가격을 입력해 주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input placeholder="제안 금액 (원)" type="number" />
          <Input placeholder="예상 소요 시간" />
        </div>
        <DialogFooter showCloseButton>
          <Button type="submit">제안 보내기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">요청 삭제</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
          <DialogDescription>
            이 작업은 되돌릴 수 없습니다. 요청이 영구적으로 삭제됩니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button variant="destructive">삭제</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithInteraction: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">다이얼로그 열기</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>상호작용 테스트</DialogTitle>
          <DialogDescription>
            play function으로 자동 오픈 테스트
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button>확인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const triggerButton = canvas.getByRole('button', {
      name: '다이얼로그 열기',
    });
    await userEvent.click(triggerButton);

    const dialog = await canvas.findByRole('dialog');
    await expect(dialog).toBeInTheDocument();

    await expect(within(dialog).getByText('상호작용 테스트')).toBeVisible();
  },
};
