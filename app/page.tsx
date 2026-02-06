import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HeroSection } from '@/components/landing/hero-section';
import { ProcessSection } from '@/components/landing/process-section';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <ProcessSection />
      </main>

      <Footer />
    </div>
  );
}
