"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTJoMnYyaC0yem0tNCAyaDJ2Mmgt MnYtMnptMC02aDJ2Mmgt MnYtMnptLTQgOGgydjJoLTJ2LTJ6bTAtNmgydjJoLTJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-white"
              >
                <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" />
                <path d="M12 12V3" />
                <path d="m8 7 4-4 4 4" />
                <rect x="4" y="12" width="16" height="2" rx="1" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">NiftyGifty</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              asChild
              className="text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <Link href="/login">Sign in</Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white"
            >
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Gift planning,{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              simplified
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Track gift ideas, manage budgets, and never forget a special
            occasion. NiftyGifty helps you organize thoughtful gifts for
            everyone you love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-lg px-8"
            >
              <Link href="/signup">Start planning for free</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-lg px-8"
            >
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="relative z-10 container mx-auto px-4 py-8 text-center">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} NiftyGifty. Made with 💜
        </p>
      </footer>
    </div>
  );
}
