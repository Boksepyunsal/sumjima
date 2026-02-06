import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// 서비스 이용약관 페이지
export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30 px-4 py-8 md:py-12">
        <div className="container mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">서비스 이용약관</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm leading-relaxed text-muted-foreground">
              <p>
                이 약관은 복세편살(이하 &quot;회사&quot;)이 제공하는 숨지마
                서비스(이하 &quot;서비스&quot;)의 이용과 관련하여 회사와
                회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을
                목적으로 합니다.
              </p>

              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  제1조 (플랫폼의 지위 및 면책 조항)
                </h3>
                <p>
                  ① &quot;숨지마&quot;는 서비스 요청자와 서비스 제공자를
                  연결하는 중개 플랫폼의 역할만을 수행합니다.
                </p>
                <p>
                  ② 요청자와 제공자 간에 이루어지는 모든 거래(서비스 계약, 대금
                  결제, 서비스 품질, 하자 보수 등)에 대한 책임은 거래
                  당사자들에게 있으며, 회사는 이에 대해 어떠한 책임도 지지
                  않습니다.
                </p>
                <p>
                  ③ 회사는 회원이 게재한 정보, 자료, 사실의 신뢰도, 정확성 등
                  내용에 관하여는 책임을 지지 않습니다.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  제2조 (과금 정책)
                </h3>
                <p>
                  ① &quot;숨지마&quot;의 모든 서비스(요청서 등록, 제안서 제출,
                  회원 간 연결 등)는 현재 무료로 제공됩니다.
                </p>
                <p>
                  ② 회사는 향후 서비스의 일부 또는 전부에 대해 유료로 전환할 수
                  있으며, 이 경우 변경 사항을 사전에 회원에게 공지합니다.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  제3조 (이용 제한)
                </h3>
                <p>
                  회사는 다음 각 호에 해당하는 행위를 한 회원의 서비스 이용을
                  제한하거나 계정을 정지시킬 수 있습니다.
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>타인의 정보를 도용하거나 허위 내용을 등록하는 행위</li>
                  <li>
                    스팸, 광고, 사기 등 불법적이거나 부적절한 내용을 게시하는
                    행위
                  </li>
                  <li>서비스 운영을 고의로 방해하는 행위</li>
                  <li>기타 법령 및 본 약관에 위배되는 행위</li>
                </ul>
              </div>

              <p className="pt-4">본 약관은 2026년 2월 2일부터 시행됩니다.</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
