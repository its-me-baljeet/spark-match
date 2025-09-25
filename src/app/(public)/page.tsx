import HeroSection from "@/components/dashboard/hero-section";
import Gradient from "@/components/gradients/main-gradient";
import Header from "@/components/header/header";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Gradient />
      <Header />
      <HeroSection />
    </div>
  );
}
