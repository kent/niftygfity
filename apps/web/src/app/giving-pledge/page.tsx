import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/services";
import { getCharityStats, DEFAULT_CHARITY_STATS } from "@/data/public";
import { JsonLd } from "@/components/json-ld";
import "./styles.css";

export const metadata: Metadata = {
  title: "Giving Pledge - 10% of All Revenue Goes to Charity",
  description:
    "FareGalo pledges 10% of all gross revenue to charitable causes, forever. Learn about our commitment to transparent, sustainable giving.",
  alternates: {
    canonical: "/giving-pledge",
  },
  openGraph: {
    title: "FareGalo Giving Pledge - 10% for Charity",
    description:
      "We donate 10% of all revenue to charity. Your subscription makes a tangible difference in the world.",
  },
};

export default async function GivingPledgePage() {
  const stats = (await getCharityStats()) ?? DEFAULT_CHARITY_STATS;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://faregalo.com";

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-900/30 via-slate-950 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
      
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "FareGalo Giving Pledge",
          description:
            "FareGalo pledges 10% of all gross revenue to charitable causes.",
          url: `${baseUrl}/giving-pledge`,
          mainEntity: {
            "@type": "Article",
            headline: "Our 10% Promise",
            description:
              "FareGalo pledges to donate 10% of all gross revenue to charitable causes, forever.",
            author: {
              "@type": "Organization",
              name: "FareGalo",
            },
          },
        }}
      />
      
      {/* Navigation */}
      <header className="absolute top-0 w-full z-20 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 group-hover:scale-105 transition-transform">
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
          </Link>
          <Button variant="ghost" asChild className="text-white hover:text-white hover:bg-white/10">
            <Link href={AUTH_ROUTES.signIn}>Sign in</Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10">
        <div className="pt-32 pb-20 sm:pt-40 sm:pb-24">
          <div className="container mx-auto px-4 text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-medium mb-8 backdrop-blur-sm fade-in-animation">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 shadow-lg shadow-emerald-400/50"></span>
              </span>
              <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent font-semibold gradient-text-animation">
                The Giving Pledge
              </span>
            </div>

            {/* Main Headline */}
            <div className="mb-8 slide-up-animation">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 tracking-tight leading-none">
                Our{" "}
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 gradient-text-animation">
                    10% Promise
                  </span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 opacity-20 blur-2xl -z-10 animate-pulse"></div>
                </span>
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto rounded-full expand-animation"></div>
            </div>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed fade-in-delayed-animation">
              We believe that success is meaningless unless it's shared. That's why FareGalo pledges to donate{" "}
              <span className="text-white font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent animate-pulse">
                10% of all gross revenue
              </span>{" "}
              to charitable causes, <em className="text-emerald-300">forever</em>.
            </p>

            {/* Enhanced Stats Card */}
            <div className="max-w-2xl mx-auto mb-16 float-animation">
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity gradient-bg-animation"></div>
                
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/90 to-teal-950/90 border border-emerald-500/40 p-10 sm:p-12 backdrop-blur-xl shadow-2xl shadow-emerald-900/20">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '500ms' }} />
                  <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-gradient-to-tr from-teal-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }} />
                  
                  <div className="relative flex flex-col items-center">
                    {/* Icon */}
                    <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-8 h-8 text-white"
                      >
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                      </svg>
                    </div>
                    
                    <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-2">
                      Total Raised So Far
                    </span>
                    <div className="text-6xl sm:text-7xl font-black text-white mb-4 tracking-tight tabular-nums bg-gradient-to-br from-white to-slate-200 bg-clip-text text-transparent">
                      {stats.fuzzy_raised_amount}
                    </div>
                    <p className="text-emerald-200/80 text-base font-medium text-center max-w-sm">
                      {stats.milestone_description}
                    </p>
                    
                    {/* Progress visualization */}
                    <div className="mt-6 w-full max-w-sm">
                      <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full w-3/4 animate-pulse"></div>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 text-center">Growing every day</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-900/20 to-slate-900/20 border border-emerald-500/20 backdrop-blur-sm">
                <div className="text-3xl font-bold text-emerald-400 mb-2">100%</div>
                <div className="text-slate-300 text-sm">Transparent</div>
                <div className="text-slate-400 text-xs mt-1">All donations public</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-teal-900/20 to-slate-900/20 border border-teal-500/20 backdrop-blur-sm">
                <div className="text-3xl font-bold text-teal-400 mb-2">10%</div>
                <div className="text-slate-300 text-sm">Of Revenue</div>
                <div className="text-slate-400 text-xs mt-1">Not just profit</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-900/20 to-slate-900/20 border border-emerald-500/20 backdrop-blur-sm">
                <div className="text-3xl font-bold text-emerald-400 mb-2">Forever</div>
                <div className="text-slate-300 text-sm">Our Promise</div>
                <div className="text-slate-400 text-xs mt-1">Written in our charter</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <section className="py-24 bg-gradient-to-b from-slate-900/50 to-slate-950 border-y border-slate-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
              <div className="slide-in-left-animation">
                <div className="inline-block p-3 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl mb-6">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                  Why we <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">give</span>
                </h2>
                <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
                  <p>
                    Gift-giving is about expressing <strong className="text-white">love, appreciation, and connection</strong>. It's about thinking of others before yourself.
                  </p>
                  <p>
                    We built FareGalo to make that process easier, but we didn't want the spirit of giving to end with our app. By pledging 10% of our revenue, we ensure that every subscription helps someone in need, extending the chain of generosity far beyond our user base.
                  </p>
                  <p>
                    Whether it's supporting education, fighting poverty, or protecting the environment, <em className="text-emerald-300">your subscription makes a tangible difference in the world</em>.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6 slide-in-right-animation">
                {[
                  {
                    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                    title: "Transparent Giving",
                    description: "We publish our donation receipts quarterly so you know exactly where the money goes."
                  },
                  {
                    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                    title: "Sustainable Impact",
                    description: "Recurring monthly donations allow charities to plan ahead and operate more effectively."
                  },
                  {
                    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                    title: "Community Driven",
                    description: "Subscribers vote annually on which causes we support for the coming year."
                  }
                ].map((feature, index) => (
                  <div 
                    key={index} 
                    className="group relative p-8 rounded-3xl bg-gradient-to-br from-slate-900/80 to-slate-800/40 border border-slate-700/50 hover:border-emerald-500/40 transition-all duration-500 backdrop-blur-sm hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                        <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced CTA */}
        <section className="py-32 container mx-auto px-4 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/10 via-transparent to-teal-900/10 rounded-3xl"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="inline-block p-3 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl mb-8">
              <svg className="w-10 h-10 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Ready to make a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">difference</span>?
            </h2>
            <p className="text-slate-300 mb-12 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Start planning thoughtful gifts today and help us support meaningful causes around the world. Every subscription counts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="relative group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-10 h-14 text-lg rounded-full shadow-2xl shadow-emerald-900/20 hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
              >
                <Link href={AUTH_ROUTES.signUp}>
                  <span className="relative z-10 flex items-center gap-2">
                    Join the Movement
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
                </Link>
              </Button>
              
              <div className="flex items-center gap-3 text-slate-400">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Join 1000+ people making a difference</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 text-center border-t border-slate-900/50 relative z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} FareGalo. Made with{" "}
              <span className="text-red-400 animate-pulse">💜</span>{" "}
              and a commitment to giving back.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}