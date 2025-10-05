import { SignedOut, SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await auth();
  if (session.userId) redirect("/dashboard");

  return (
    <>
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
          <h1 className="text-4xl font-bold mb-4">Welcome to Notemaker</h1>
          <SignInButton mode="modal">
            <Button size="lg">Sign In to Get Started</Button>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  );
}