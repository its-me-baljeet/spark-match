import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex-1 flex min-h-[calc(100vh-150px)] md:min-h-[calc(100vh-100px)] justify-center items-center h-full bg-gradient-to-br from-primary/20 via-background to-secondary/20 animate-fade-in">
      <div className="animate-scale-in">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-2xl",
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in" // ✅ Makes sure "Already have an account? Sign in" works
        />
      </div>
    </div>
  );
}
