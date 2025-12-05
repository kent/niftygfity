import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/services";
import { AuthRedirect } from "@/components/auth-redirect";
import { JsonLd } from "@/components/json-ld";
import { getCharityStats, DEFAULT_CHARITY_STATS } from "@/data/public";

export const metadata: Metadata = {
  title: "FareGalo - Make Holiday Gift Lists Easy | Gift Organization App",
  description:
    "The easiest way to create and manage gift lists for holidays. Organize gifts for family and friends, track your budget, share wish lists, and make every holiday stress-free and memorable.",
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const charityStats = (await getCharityStats()) ?? DEFAULT_CHARITY_STATS;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.length ? process.env.NEXT_PUBLIC_APP_URL : "https://faregalo.com";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col overflow-hidden relative">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "FareGalo - Holiday Gift Lists Made Easy",
          url: baseUrl,
          description:
            "The easiest way to create and manage gift lists for holidays. Organize gifts for family and friends, track your budget, share wish lists, and make every holiday stress-free and memorable.",
          mainEntity: {
            "@type": "SoftwareApplication",
            name: "FareGalo",
            applicationCategory: "LifestyleApplication",
            description:
              "A holiday gift list management app that helps you organize presents for family and friends, track your budget, and coordinate with others. Makes holiday gift-giving stress-free and organized.",
            author: {
              "@type": "Organization",
              name: "FareGalo",
            },
          },
        }}
      />
      {/* Client-side auth redirect */}
      <AuthRedirect />

      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/30 via-teal-900/20 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0deg,_rgba(6,182,212,0.1)_120deg,_transparent_240deg)] animate-pulse" />

      {/* Animated Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-emerald-400/30 rounded-full animate-pulse" style={{animationDelay: '0s', animationDuration: '3s'}} />
      <div className="absolute top-40 right-20 w-6 h-6 bg-teal-400/20 rounded-full animate-pulse" style={{animationDelay: '1s', animationDuration: '4s'}} />
      <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-emerald-500/40 rounded-full animate-pulse" style={{animationDelay: '2s', animationDuration: '5s'}} />
      <div className="absolute top-1/3 right-10 w-5 h-5 bg-teal-300/25 rounded-full animate-pulse" style={{animationDelay: '1.5s', animationDuration: '3.5s'}} />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDEwMCAwIEwgMCAwIDAgMTAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMCwyNTUsNDAsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTJoMnYyaC0yem0tNCAyaDJ2Mmgt MnYtMnptMC02aDJ2Mmgt MnYtMnptLTQgOGgydjJoLTJ2LTJ6bTAtNmgydjJoLTJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

      <header className="relative z-10 container mx-auto px-4 py-6 backdrop-blur-sm bg-slate-950/30 rounded-2xl mx-4 mt-4 border border-slate-800/50">
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
            <span className="text-xl font-bold text-white">FareGalo</span>
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
              variant="outline"
              className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-400"
            >
              <Link href={AUTH_ROUTES.signUp}>Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-3xl">
          {/* Enhanced Trust Indicators */}
          <div className="mb-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 text-white text-base font-semibold backdrop-blur-sm shadow-lg shadow-emerald-500/10">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
              <span>Trusted by Holiday Organizers</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-emerald-200">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Easy Organization</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L8.059 10.59a.75.75 0 00-1.118 1.004l2.13 2.375a.75.75 0 001.168-.043l3.857-5.395z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Budget Tracking</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                </svg>
                <span className="font-medium">Family Sharing</span>
              </div>
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight leading-[1.1] animate-in fade-in-0 slide-in-from-bottom-2 duration-700">
            Make Holiday{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent animate-pulse">
              Gift Lists Easy
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed animate-in fade-in-0 slide-in-from-bottom-2 duration-1000" style={{animationDelay: '200ms'}}>
            <strong className="text-white bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">The gift list app that makes holidays effortless.</strong>{" "}
            Organize gifts for everyone, track your budget, share wish lists with family, and never forget a present again.
            <span className="text-emerald-300"> Smart gift planning that keeps you organized all season long.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-in fade-in-0 slide-in-from-bottom-2 duration-1000" style={{animationDelay: '400ms'}}>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-lg px-10 py-4 shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-400/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 border border-emerald-400/20"
            >
              <Link href={AUTH_ROUTES.signUp}>
                <span className="flex items-center gap-2">
                  Start My Gift Lists
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white text-lg px-10 py-4 backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300 hover:scale-105"
            >
              <Link href={AUTH_ROUTES.signIn}>Sign in</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* How It Works Section */}
      <section className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How it <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">works</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Turn holiday stress into holiday joy with our simple gift planning app. Three easy steps help you plan ahead, stay within budget, and make every gift meaningful.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className="text-center group p-6 rounded-3xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-emerald-500/10 hover:border-emerald-400/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-emerald-400/20">
              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Add People</h3>
            <p className="text-slate-300 leading-relaxed">
              Add everyone from family and friends to coworkers and neighbors. Build your complete holiday gift list and never miss anyone again.
            </p>
          </div>

          <div className="text-center group p-6 rounded-3xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-teal-500/10 hover:border-teal-400/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-500/30 to-emerald-500/30 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-teal-400/20">
              <svg className="w-10 h-10 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Plan Gifts</h3>
            <p className="text-slate-300 leading-relaxed">
              Brainstorm gift ideas, set budgets for each person, and save notes about their interests. The app helps you remember what everyone loves.
            </p>
          </div>

          <div className="text-center group p-6 rounded-3xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-emerald-500/10 hover:border-emerald-400/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-emerald-400/20">
              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Stay Organized</h3>
            <p className="text-slate-300 leading-relaxed">
              Track purchases, monitor spending across all your lists, and check off completed gifts. Stay organized from planning to wrapping.
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full border-2 border-slate-900"></div>
              <div className="w-6 h-6 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-full border-2 border-slate-900"></div>
              <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full border-2 border-slate-900"></div>
            </div>
            <span>Join 1,200+ organized gift givers</span>
          </div>
        </div>
      </section>

      {/* Trust & Impact Section */}
      <section className="relative z-10 bg-gradient-to-b from-transparent via-slate-950/50 to-transparent py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Real <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">results</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              See how families are saving time, money, and stress by planning their holiday gifts with our easy-to-use app.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* User Story 1 */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Sarah M.</h3>
                    <p className="text-emerald-400 text-sm">Family of 12</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  &quot;Finally, I can keep track of everyone! No more forgetting what I bought or overspending. The budget tracker saved me $300 last Christmas, and I actually enjoyed gift shopping for the first time in years.&quot;
                </p>
                <div className="flex items-center text-xs text-slate-400">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                  <span>User since 2023</span>
                </div>
              </div>
            </div>

            {/* User Story 2 */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">David R.</h3>
                    <p className="text-teal-400 text-sm">Holiday organizer</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  &quot;The family sharing feature is amazing. Everyone can add their wish lists, and I can coordinate with my siblings so we don&apos;t buy duplicate gifts. Made the holidays so much smoother.&quot;
                </p>
                <div className="flex items-center text-xs text-slate-400">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mr-2"></div>
                  <span>User since 2022</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center group p-6 rounded-2xl bg-gradient-to-br from-slate-900/40 to-slate-800/20 backdrop-blur-sm border border-slate-700/30 hover:border-emerald-500/30 transition-all duration-300">
              <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">100%</div>
              <div className="text-slate-300 text-sm font-medium">Free to Use</div>
            </div>
            <div className="text-center group p-6 rounded-2xl bg-gradient-to-br from-slate-900/40 to-slate-800/20 backdrop-blur-sm border border-slate-700/30 hover:border-emerald-500/30 transition-all duration-300">
              <div className="text-4xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform">25K+</div>
              <div className="text-slate-300 text-sm font-medium">Gifts Organized</div>
            </div>
            <div className="text-center group p-6 rounded-2xl bg-gradient-to-br from-slate-900/40 to-slate-800/20 backdrop-blur-sm border border-slate-700/30 hover:border-teal-500/30 transition-all duration-300">
              <div className="text-4xl font-bold text-teal-400 mb-2 group-hover:scale-110 transition-transform">$350</div>
              <div className="text-slate-300 text-sm font-medium">Avg. Saved</div>
            </div>
            <div className="text-center group p-6 rounded-2xl bg-gradient-to-br from-slate-900/40 to-slate-800/20 backdrop-blur-sm border border-slate-700/30 hover:border-emerald-500/30 transition-all duration-300">
              <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">1,200+</div>
              <div className="text-slate-300 text-sm font-medium">Holiday Organizers</div>
            </div>
          </div>
        </div>
      </section>


      <footer className="relative z-10 container mx-auto px-4 py-8 text-center space-y-4">
        <div className="flex justify-center gap-6 text-sm text-slate-400">
          <Link href="/giving-pledge" className="hover:text-emerald-400 transition-colors">
            Our Giving
          </Link>
        </div>
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} FareGalo. Made with 💜 for holiday organizers everywhere
        </p>
        <p className="text-slate-600 text-xs mt-1">
          10% of profits support charity
        </p>
      </footer>
    </div>
  );
}
