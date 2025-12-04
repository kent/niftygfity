import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/services";
import { getCharityStats, DEFAULT_CHARITY_STATS } from "@/data/public";
import { AuthRedirect } from "@/components/auth-redirect";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Make Your Giving Pledge - Commit to Change Lives | FareGalo",
  description:
    "Join thousands making meaningful charitable pledges. Set your giving goals, choose causes you care about, and track your impact over time.",
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const charityStats = (await getCharityStats()) ?? DEFAULT_CHARITY_STATS;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.length ? process.env.NEXT_PUBLIC_APP_URL : "https://faregalo.com";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Make Your Giving Pledge",
          url: baseUrl,
          description:
            "Join thousands making meaningful charitable pledges. Set your giving goals and track your impact.",
          mainEntity: {
            "@type": "Article",
            headline: "Make Your Giving Pledge",
            description:
              "Commit to making a difference through charitable giving. Choose your causes and pledge amounts.",
            author: {
              "@type": "Organization",
              name: "FareGalo",
            },
          },
        }}
      />
      {/* Client-side auth redirect */}
      <AuthRedirect />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTJoMnYyaC0yem0tNCAyaDJ2Mmgt MnYtMnptMC02aDJ2Mmgt MnYtMnptLTQgOGgydjJoLTJ2LTJ6bTAtNmgydjJoLTJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

      <header className="relative z-10 container mx-auto px-4 py-6">
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
                <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" />
                <path d="M12 12V3" />
                <path d="m8 7 4-4 4 4" />
                <rect x="4" y="12" width="16" height="2" rx="1" />
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
              <span>Trusted by Serious Philanthropists</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-emerald-200">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">100% Transparent</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L8.059 10.59a.75.75 0 00-1.118 1.004l2.13 2.375a.75.75 0 001.168-.043l3.857-5.395z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Impact Verified</span>
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Make Your{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Charitable Giving Count
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            <strong className="text-white">See exactly how your donations create real change.</strong>{" "}
            We research the most effective charities so you can give with confidence.
            Get quarterly impact reports showing <em className="text-emerald-300">how every dollar makes a difference</em>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-lg px-8"
            >
              <Link href={AUTH_ROUTES.signUp}>Create My Giving Pledge</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-lg px-8"
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
            Making your giving pledge is simple and transparent. Start small, grow your impact, and track your difference.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <div className="text-center group">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Set Your Goals</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Choose your giving amount and frequency. Start with any amount that feels meaningful to you.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Choose Causes</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Select from vetted charities across education, environment, health, and social justice causes.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">3</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Track Impact</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              See real stories and metrics showing how your contributions are making a difference in the world.
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
            <span>Join 1,200+ people making a difference</span>
          </div>
        </div>
      </section>

      {/* Trust & Impact Section */}
      <section className="relative z-10 bg-gradient-to-b from-transparent via-slate-950/50 to-transparent py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Real <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">impact</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              See how pledgers are making a difference and building a more generous world, one commitment at a time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Impact Story 1 */}
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
                    <p className="text-emerald-400 text-sm">$50/month pledge</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  &quot;I started small with just $25/month. Seeing the real impact through the platform motivated me to increase my pledge. Last year, I helped fund clean water for 30 families.&quot;
                </p>
                <div className="flex items-center text-xs text-slate-400">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                  <span>Active pledger since 2023</span>
                </div>
              </div>
            </div>

            {/* Impact Story 2 */}
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
                    <p className="text-teal-400 text-sm">$100/month pledge</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  &quot;The transparency is incredible. I get quarterly reports showing exactly where my money went and what impact it had. It&apos;s like having a personal philanthropy advisor.&quot;
                </p>
                <div className="flex items-center text-xs text-slate-400">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mr-2"></div>
                  <span>Active pledger since 2022</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">100%</div>
              <div className="text-slate-400 text-sm">Transparent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">$2.1M</div>
              <div className="text-slate-400 text-sm">Pledged Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-400 mb-1">45+</div>
              <div className="text-slate-400 text-sm">Charities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">1,200</div>
              <div className="text-slate-400 text-sm">Active Pledgers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Charity Tracker */}
      <section className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/50 to-teal-950/50 border border-emerald-500/20 p-8">
            {/* Animated glow effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            
            <div className="relative flex flex-col sm:flex-row items-center gap-6">
              {/* Heart icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 text-white"
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center sm:text-left">
                <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider mb-1">
                  Our Company Pledge: 10% of Revenue to Charity
                </p>
                <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                  <span className="text-4xl font-bold text-white tabular-nums">
                    {charityStats.fuzzy_raised_amount}
                  </span>
                  <span className="text-emerald-400/70 text-sm">total donated so far</span>
                </div>
                <p className="text-slate-400 text-sm mt-2 mb-3">
                  {charityStats.milestone_description}
                </p>
                <Link 
                  href="/giving-pledge" 
                  className="inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Learn about our pledge
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>

              {/* Decorative ribbon */}
              <div className="hidden lg:block absolute -right-1 top-4">
                <div className="w-24 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 transform rotate-45 translate-x-6 flex items-center justify-center">
                  <span className="text-white text-xs font-bold tracking-wide">GIVING</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 container mx-auto px-4 py-8 text-center space-y-4">
        <div className="flex justify-center gap-6 text-sm text-slate-400">
          <Link href="/giving-pledge" className="hover:text-emerald-400 transition-colors">
            Giving Pledge
          </Link>
        </div>
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} FareGalo. Made with 💜
        </p>
      </footer>
    </div>
  );
}
