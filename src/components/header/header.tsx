import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { ModeToggle } from "../buttons/mode-toggle-btn";
import { HeaderDropdown } from "./dropdown";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 left-0 h-14 w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border bg-background z-50">
      {/* Brand */}
      <div className="flex items-center">
        <Link href={'/'} className="text-xl sm:text-2xl font-bold text-rose-500 tracking-tight">
          MatchSpark
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-4">
        <ModeToggle />
          <Link
            href={"/discover"}
            
          >
            Discover
          </Link>

        {/* Desktop Auth Buttons */}
        <div className="hidden sm:flex items-center gap-3 sm:gap-4">
          <SignedOut>
            <SignInButton>
              <button className="px-4 sm:px-5 h-9 sm:h-10 rounded-full border border-border text-sm sm:text-base font-medium hover:bg-muted transition">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="px-4 sm:px-5 h-9 sm:h-10 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white text-sm sm:text-base font-medium hover:opacity-90 transition">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {/* Mobile Dropdown */}
        <HeaderDropdown />
      </div>
    </header>
  );
}
