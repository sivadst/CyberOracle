import LoadingScreen from "@/components/home/LoadingScreen";
import CustomCursor from "@/components/home/CustomCursor";
import HeroSection from "@/components/home/HeroSection";
import CommandCenterPreview from "@/components/home/CommandCenterPreview";
import ProjectEcosystem from "@/components/home/ProjectEcosystem";
import AboutSection from "@/components/home/AboutSection";
import ContactSection from "@/components/home/ContactSection";

export default function Home() {
  return (
    <main className="bg-[#0a0e17] text-white min-h-screen selection:bg-[#00f0ff]/30">
      <LoadingScreen />
      <div className="hidden lg:block">
        <CustomCursor />
      </div>
      
      <HeroSection />
      <CommandCenterPreview />
      <ProjectEcosystem />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
