import HeroSection from "@/components/dashboard/hero-section";
import Gradient from "@/components/gradients/main-gradient";

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden">
      <Gradient />
      <HeroSection />
    </div>
  );
}
