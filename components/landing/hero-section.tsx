import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="container mx-auto text-center">
        <h1 className="mx-auto max-w-3xl text-balance text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
          수수료 뒤에 숨지 마세요.
          <br />
          100% 무료 직거래.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-muted-foreground md:text-lg">
          오픈소스로 만들어진 투명한 공간. 누구나 비용 0원.
        </p>
        <div className="mt-10">
          <Button asChild size="lg" className="gap-2 text-base">
            <Link href="/requests/new">
              지금 바로 시작하기
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
