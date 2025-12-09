"use client";

import gqlClient from "@/services/graphql";
import { CHECK_USER } from "@/utils/queries";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { LoadingSpinner } from "./loader/loading-spinner";
import Header from "./header/header";

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

      if (pathname === "/onboarding") {
        setChecking(false);
        return;
      }

      try {
        const data: { checkExistingUser: boolean } = await gqlClient.request(
          CHECK_USER,
          { clerkId: user.id }
        );

        if (!data?.checkExistingUser) {
          sessionStorage.setItem("redirectAfterOnboarding", pathname);
          router.push("/onboarding");
        }
      } catch (err) {
        console.error("OnboardingGuard error:", err);
        router.push("/onboarding");
      } finally {
        setChecking(false);
      }
    };

    checkOnboarding();
  }, [user, isLoaded, router, pathname]);

  // ⭐ Render same structure on server + client
  if (checking) {
    return (
      <>
        <Header />
        <div className="flex-1 flex min-h-[calc(100vh-150px)] md:min-h-[calc(100vh-100px)] justify-center items-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}
