import { PenTool, MessageCircle, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const PROCESS_STEPS = [
  {
    icon: PenTool,
    title: '요청서 작성',
    description:
      '원하는 서비스를 구체적으로 작성하여 요청하세요. 별도의 가입비는 없습니다.',
  },
  {
    icon: MessageCircle,
    title: '직거래 제안',
    description:
      '서비스 제공자가 직접 견적을 제안합니다. 프로필을 확인하고 선택하세요.',
  },
  {
    icon: Wallet,
    title: '수수료 0원',
    description:
      '매칭 수수료, 중개 수수료 없이 100% 무료입니다. 부담없이 이용하세요.',
  },
];

export function ProcessSection() {
  return (
    <section className="border-t border-border px-4 py-16 md:py-24">
      <div className="container mx-auto">
        <div className="text-center">
          <span className="inline-block rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground">
            Service Process
          </span>
          <h2 className="mt-4 text-2xl font-bold text-foreground md:text-3xl">
            서비스 이용 방법
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">
            복잡한 과정 없이 깔끔하고 투명하게. 숨지마는 이렇게 작동합니다.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PROCESS_STEPS.map((step) => (
            <Card
              key={step.title}
              className="border-border bg-background transition-colors hover:border-muted-foreground/30"
            >
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <step.icon className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-pretty text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
