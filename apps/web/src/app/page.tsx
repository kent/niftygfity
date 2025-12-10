import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/services";
import { AuthRedirect } from "@/components/auth-redirect";
import { JsonLd } from "@/components/json-ld";
import { getCharityStats, DEFAULT_CHARITY_STATS } from "@/data/public";

export const metadata: Metadata = {
  title: "Listy Gifty: Manage and Share Gift Lists",
  description:
    "The easiest way to create and manage gift lists for holidays. Organize gifts for family and friends, track your budget, share wish lists, and make every holiday stress-free and memorable.",
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const charityStats = (await getCharityStats()) ?? DEFAULT_CHARITY_STATS;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.length ? process.env.NEXT_PUBLIC_APP_URL : "https://listygifty.com";

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Listy Gifty: Manage and Share Gift Lists",
          url: baseUrl,
          description:
            "The easiest way to create and manage gift lists for holidays. Organize gifts for family and friends, track your budget, share wish lists, and make every holiday stress-free and memorable.",
          mainEntity: {
            "@type": "SoftwareApplication",
            name: "Listy Gifty",
            applicationCategory: "LifestyleApplication",
            description:
              "A holiday gift list management app that helps you organize presents for family and friends, track your budget, and coordinate with others. Makes holiday gift-giving stress-free and organized.",
            author: {
              "@type": "Organization",
              name: "Listy Gifty",
            },
          },
        }}
      />
      
      {/* Client-side auth redirect */}
      <AuthRedirect />

      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
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
                <rect x="3" y="8" width="18" height="4" rx="1" />
                <path d="m12 8-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2l-2 2" />
                <path d="M7 12v9a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-9" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Listy Gifty</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              asChild
              className="text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <Link href={AUTH_ROUTES.signIn}>Sign in</Link>
            </Button>
            <Button
              asChild
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <Link href={AUTH_ROUTES.signUp}>Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Make Holiday{" "}
            <span className="text-emerald-400">Gift Lists Easy</span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            The gift list app that makes holidays effortless. Organize gifts for everyone, track your budget, and never forget a present again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-lg px-8 py-4"
            >
              <Link href={AUTH_ROUTES.signUp}>
                Start My Gift Lists →
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-lg px-8 py-4"
            >
              <Link href={AUTH_ROUTES.signIn}>Sign in</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How it <span className="text-emerald-400">works</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Three simple steps to stress-free holiday gift planning.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Add People</h3>
            <p className="text-slate-300">
              Add family, friends, and everyone on your gift list.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Plan Gifts</h3>
            <p className="text-slate-300">
              Brainstorm ideas, set budgets, and save notes about their interests.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Stay Organized</h3>
            <p className="text-slate-300">
              Track purchases, monitor spending, and check off completed gifts.
            </p>
          </div>
        </div>
      </section>

      <footer className="container mx-auto px-4 py-8 text-center space-y-4">
        <div className="flex justify-center gap-6 text-sm text-slate-400">
          <Link href="/giving-pledge" className="hover:text-emerald-400 transition-colors">
            Our Giving
          </Link>
        </div>
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Listy Gifty. Made with 💜 for holiday organizers everywhere
        </p>
        <p className="text-slate-600 text-xs mt-1">
          10% of profits support charity
        </p>
      </footer>
    </div>
  );
}
