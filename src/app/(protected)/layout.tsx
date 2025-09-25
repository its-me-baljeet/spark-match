import Header from "@/components/header/header";
import OnboardingGuard from "@/components/onboarding-guard";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingGuard>
      <Header />
      {children}
    </OnboardingGuard>
  );
}
