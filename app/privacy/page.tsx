import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// 개인정보처리방침 페이지
export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30 px-4 py-8 md:py-12">
        <div className="container mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">개인정보처리방침</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm leading-relaxed text-muted-foreground">
              <p>
                복세편살(이하 &quot;회사&quot;)은(는) 정보통신망 이용촉진 및
                정보보호 등에 관한 법률, 개인정보보호법 등 관련 법령상의
                개인정보보호 규정을 준수하며, 관련 법령에 의거한
                개인정보처리방침을 정하여 이용자 권익 보호에 최선을 다하고
                있습니다.
              </p>

              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  제1조 (개인정보의 수집 및 이용 목적)
                </h3>
                <p>
                  회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고
                  있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
                  이용 목적이 변경되는 경우에는 개인정보보호법에 따라 별도의
                  동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    회원 식별 및 관리: 카카오 로그인을 통한 본인 확인, 연령
                    인증, 불량회원의 부정 이용 방지와 비인가 사용 방지
                  </li>
                  <li>
                    서비스 제공: 요청서 및 제안서 등록, 고수와 요청자 간의
                    원활한 연결 및 채팅 기능 제공
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  제2조 (수집하는 개인정보 항목)
                </h3>
                <p>
                  회사는 회원가입, 원활한 고객상담, 각종 서비스의 제공을 위해
                  최초 회원가입 당시 아래와 같은 개인정보를 수집하고 있습니다.
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    필수항목 (카카오 로그인 시): 닉네임, 프로필 사진, 그 외
                    카카오에서 제공하는 고유 식별 정보
                  </li>
                  <li>선택항목 (카카오 동의 시): 이메일 주소</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  제3조 (개인정보의 보유 및 이용 기간)
                </h3>
                <p>
                  회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
                  개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
                  개인정보를 처리·보유합니다.
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    회원 정보: 서비스 탈퇴 시까지. 단, 관계 법령 위반에 따른
                    수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지
                    보존합니다.
                  </li>
                  <li>
                    법령에 따른 보존: 전자상거래 등에서의 소비자보호에 관한 법률
                    등 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는
                    관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  제4조 (개인정보의 제3자 제공)
                </h3>
                <p>
                  회사는 정보주체의 개인정보를 제1조(개인정보의 수집 및 이용
                  목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의,
                  법률의 특별한 규정 등 개인정보보호법 제17조에 해당하는
                  경우에만 개인정보를 제3자에게 제공합니다.
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    제공받는 자: 서비스 요청자와 해당 요청에 제안한 서비스
                    제공자
                  </li>
                  <li>제공 목적: 원활한 서비스 진행을 위한 상호 간의 소통</li>
                  <li>제공 항목: 닉네임, (제안서에 기재 시) 연락처</li>
                </ul>
              </div>

              <p className="pt-4">
                본 개인정보처리방침은 2026년 2월 2일부터 적용됩니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
