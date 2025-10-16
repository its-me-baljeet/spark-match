"use client";

import gqlClient from "@/services/graphql";
import { CHECK_USER } from "@/utils/queries";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { LoadingSpinner } from "./loader/loading-spinner";

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

      // Skip onboarding check if already on onboarding page
      if (pathname === "/onboarding") {
        setChecking(false);
        return;
      }

      try {
        const data: { checkExistingUser: boolean } = await gqlClient.request(
          CHECK_USER,
          { clerkId: user.id } // Changed from email to clerkId
        );
        
        if (!data?.checkExistingUser) {
          // Store the path they were trying to access
          sessionStorage.setItem("redirectAfterOnboarding", pathname);
          router.push("/onboarding");
        }
      } catch (err) {
        console.error("OnboardingGuard error:", err);
        // On error, allow through but maybe redirect to onboarding to be safe
        router.push("/onboarding");
      } finally {
        setChecking(false);
      }
    };

    checkOnboarding();
  }, [user, isLoaded, router, pathname]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}