import { CyberGrid } from '@/components/home/CyberGrid';
import { HeroSection } from '@/components/home/HeroSection';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0a0e17] selection:bg-[#00f0ff] selection:text-[#0a0e17]">
      <CyberGrid />
      <HeroSection />
    </main>
  );
}
