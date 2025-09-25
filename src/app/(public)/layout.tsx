import OnboardingGuard from "@/components/onboarding-guard";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <OnboardingGuard>{children}</OnboardingGuard>;
}
