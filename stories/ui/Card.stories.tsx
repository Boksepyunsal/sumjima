import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>이사/용달 요청</CardTitle>
        <CardDescription>서울 강남구 → 마포구</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          3.5톤 트럭 필요. 포장 서비스 포함. 3월 15일 오전 중 가능하신 분.
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">견적 제안하기</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>청소 요청</CardTitle>
        <CardDescription>경기도 수원시</CardDescription>
        <CardAction>
          <Badge variant="secondary">3 Offers</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          입주 청소, 화장실 2개 포함. 30평대 아파트.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1">
          닫기
        </Button>
        <Button className="flex-1">상세 보기</Button>
      </CardFooter>
    </Card>
  ),
};

export const Simple: Story = {
  render: () => (
    <Card className="w-72">
      <CardContent>
        <p className="text-sm">간단한 카드 내용입니다.</p>
      </CardContent>
    </Card>
  ),
};

export const ProcessCard: Story = {
  render: () => (
    <Card className="w-64 text-center">
      <CardContent className="flex flex-col items-center p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <span className="text-2xl">📦</span>
        </div>
        <h3 className="mt-6 text-lg font-semibold">요청서 작성</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          원하는 서비스를 구체적으로 작성하여 요청하세요.
        </p>
      </CardContent>
    </Card>
  ),
};
