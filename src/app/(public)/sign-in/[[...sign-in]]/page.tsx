import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex-1 flex min-h-[calc(100vh-150px)] md:min-h-[calc(100vh-100px)] justify-center items-center h-full bg-gradient-to-br from-primary/20 via-background to-secondary/20 animate-fade-in">
      <div className="animate-scale-in">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-2xl",
            },
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up" // ✅ Add this to show "Don't have an account? Sign up"
        />
      </div>
    </div>
  );
}
