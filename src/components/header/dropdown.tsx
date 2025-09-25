import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export function HeaderDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="sm:hidden">
          <MenuIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <SignedOut>
          <DropdownMenuItem asChild>
            <SignInButton>
              <span className="w-full">Sign In</span>
            </SignInButton>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <SignUpButton>
              <span className="w-full">Sign Up</span>
            </SignUpButton>
          </DropdownMenuItem>
        </SignedOut>

        <SignedIn>
          <DropdownMenuItem asChild>
            <UserButton afterSignOutUrl="/" />
          </DropdownMenuItem>
        </SignedIn>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
