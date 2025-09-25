"use client";

import { ReactNode, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import gqlClient from "@/services/graphql";
import { CHECK_USER } from "@/utils/queries";

interface OnboardingGuardProps {
  children: ReactNode;
}

export default function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!isLoaded) return;
      if (!user?.id) {
        setChecking(false);
        return;
      }

      try {
        const data: { checkExistingUser: boolean } = await gqlClient.request(
          CHECK_USER,
          { clerkId: user.id }
        );
        if (!data?.checkExistingUser) {
          // store the path they were trying to access
          sessionStorage.setItem("redirectAfterOnboarding", pathname);
          router.push("/onboarding");
        }
      } catch (err) {
        console.error("OnboardingGuard error:", err);
      } finally {
        setChecking(false);
      }
    };

    checkOnboarding();
  }, [user, isLoaded, router, pathname]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Checking profile...</p>
      </div>
    );
  }

  return <>{children}</>;
}
