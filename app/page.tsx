import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, PenTool, MessageCircle, Wallet } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-4 py-16 md:py-24">
          <div className="container mx-auto text-center">
            <h1 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl text-balance">
              수수료 뒤에 숨지 마세요.
              <br />
              100% 무료 직거래.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-muted-foreground md:text-lg text-pretty">
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

        {/* Service Process Section */}
        <section className="border-t border-border px-4 py-16 md:py-24">
          <div className="container mx-auto">
            <div className="text-center">
              <span className="inline-block rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground">
                Service Process
              </span>
              <h2 className="mt-4 text-2xl font-bold text-foreground md:text-3xl">
                서비스 이용 방법
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-muted-foreground text-pretty">
                복잡한 과정 없이 깔끔하고 투명하게. 숨지마는 이렇게 작동합니다.
              </p>
            </div>

            {/* Features Grid */}
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <Card className="border-border bg-background transition-colors hover:border-muted-foreground/30">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                    <PenTool className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-foreground">
                    요청서 작성
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground text-pretty">
                    원하는 서비스를 구체적으로 작성하여 요청하세요. 별도의
                    가입비는 없습니다.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-background transition-colors hover:border-muted-foreground/30">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                    <MessageCircle className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-foreground">
                    직거래 제안
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground text-pretty">
                    서비스 제공자가 직접 견적을 제안합니다. 프로필을 확인하고
                    선택하세요.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-background transition-colors hover:border-muted-foreground/30">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                    <Wallet className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-foreground">
                    수수료 0원
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground text-pretty">
                    매칭 수수료, 중개 수수료 없이 100% 무료입니다. 부담없이
                    이용하세요.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
