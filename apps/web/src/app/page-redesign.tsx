import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/services";
import { AuthRedirect } from "@/components/auth-redirect";
import { JsonLd } from "@/components/json-ld";
import { getCharityStats, DEFAULT_CHARITY_STATS } from "@/data/public";
import {
  Gift,
  Calendar,
  Heart,
  Users,
  Sparkles,
  CheckCircle2,
  Star,
  TrendingUp
} from "lucide-react";

export const metadata: Metadata = {
  title: "Never Forget a Gift Again | FareGalo - Gift Planning Made Simple",
  description:
    "Organize gifts for everyone you love. Track ideas, set budgets, and stay on top of every birthday, holiday, and special occasion. Plus, 10% of our profits go to charity.",
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const charityStats = (await getCharityStats()) ?? DEFAULT_CHARITY_STATS;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.length ? process.env.NEXT_PUBLIC_APP_URL : "https://faregalo.com";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-fuchsia-950 flex flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "FareGalo - Gift Planning Made Simple",
          url: baseUrl,
          description:
            "Organize gifts for everyone you love. Track ideas, set budgets, and stay on top of every birthday, holiday, and special occasion.",
          mainEntity: {
            "@type": "SoftwareApplication",
            name: "FareGalo",
            applicationCategory: "LifestyleApplication",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            description:
              "Gift planning and organization app for families and friends.",
          },
        }}
      />

      {/* Client-side auth redirect */}
      <AuthRedirect />

      {/* Background decorative elements - Holiday themed */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent" />
      <div className="absolute inset-0 overflow-hidden">
        {/* Decorative gift boxes pattern */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-lg rotate-12 blur-sm" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-violet-400/10 to-fuchsia-400/10 rounded-lg -rotate-12 blur-sm" />
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-lg rotate-45 blur-sm" />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-violet-500 shadow-lg shadow-pink-500/20">
              <Gift className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">FareGalo</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              asChild
              className="text-purple-200 hover:text-white hover:bg-purple-800/50"
            >
              <Link href={AUTH_ROUTES.signIn}>Sign in</Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white shadow-lg shadow-pink-500/25"
            >
              <Link href={AUTH_ROUTES.signUp}>Start Planning</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-4xl">
          {/* Trust badge */}
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-violet-500/20 border border-pink-400/30 text-white text-sm font-medium backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-pink-300" />
            <span>Trusted by 1,200+ families for holiday gift planning</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Never Forget a{" "}
            <span className="bg-gradient-to-r from-pink-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Perfect Gift
            </span>
            {" "}Again
          </h1>

          <p className="text-xl md:text-2xl text-purple-100 mb-4 max-w-3xl mx-auto leading-relaxed">
            The gift planning app for people who care. Track ideas, manage budgets, and stay organized for every birthday, holiday, and special occasion.
          </p>

          <p className="text-base text-purple-200 mb-8 max-w-2xl mx-auto">
            From Christmas lists to last-minute birthdays—we help you remember everyone and give thoughtfully, every time.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white text-lg px-8 shadow-xl shadow-pink-500/30 transform hover:scale-105 transition-all"
            >
              <Link href={AUTH_ROUTES.signUp}>Start Planning Gifts - It's Free</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-purple-400/40 text-purple-100 hover:bg-purple-800/50 hover:text-white hover:border-purple-300/60 text-lg px-8 backdrop-blur-sm"
            >
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>

          {/* Quick value props */}
          <div className="flex flex-wrap justify-center gap-6 text-purple-200 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-pink-400" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-violet-400" />
              <span>No credit card needed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-fuchsia-400" />
              <span>Set up in 2 minutes</span>
            </div>
          </div>
        </div>
      </main>

      {/* Social Proof Bar */}
      <section className="relative z-10 border-y border-purple-700/30 bg-purple-900/30 backdrop-blur-sm py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-white">1,200+</div>
              <div className="text-sm text-purple-300">Happy families</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-purple-700/50" />
            <div>
              <div className="text-2xl font-bold text-pink-400">12,500+</div>
              <div className="text-sm text-purple-300">Gifts tracked</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-purple-700/50" />
            <div>
              <div className="text-2xl font-bold text-violet-400">4.9/5</div>
              <div className="text-sm text-purple-300">User rating</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-purple-700/50" />
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-sm text-purple-300">Top rated app</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Gift Planning Made{" "}
            <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
              Ridiculously Simple
            </span>
          </h2>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            No more last-minute panic or forgotten birthdays. Organize all your gift giving in one beautiful place.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {/* Step 1 */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/30 to-violet-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gradient-to-br from-purple-900/80 to-violet-900/80 rounded-2xl p-8 border border-purple-700/50 backdrop-blur-sm h-full">
              <div className="w-14 h-14 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/25 transform group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-3">Add Your People</h3>
                <p className="text-purple-200 leading-relaxed">
                  Create a list of everyone you want to buy gifts for—family, friends, coworkers, or that neighbor who always feeds your cat.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gradient-to-br from-violet-900/80 to-fuchsia-900/80 rounded-2xl p-8 border border-violet-700/50 backdrop-blur-sm h-full">
              <div className="w-14 h-14 mx-auto mb-6 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25 transform group-hover:scale-110 transition-transform">
                <Gift className="w-7 h-7 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-3">Track Gift Ideas</h3>
                <p className="text-purple-200 leading-relaxed">
                  Save gift ideas throughout the year. Set budgets, add notes, and track purchases so you're always prepared for any occasion.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-500/30 to-pink-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gradient-to-br from-fuchsia-900/80 to-pink-900/80 rounded-2xl p-8 border border-fuchsia-700/50 backdrop-blur-sm h-full">
              <div className="w-14 h-14 mx-auto mb-6 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-fuchsia-500/25 transform group-hover:scale-110 transition-transform">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-3">Never Miss an Occasion</h3>
                <p className="text-purple-200 leading-relaxed">
                  Track holidays, birthdays, and special dates. Get organized early and give thoughtful gifts that show you care.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary CTA */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-white text-purple-900 hover:bg-purple-50 text-lg px-8 shadow-xl transform hover:scale-105 transition-all font-semibold"
          >
            <Link href={AUTH_ROUTES.signUp}>Get Started Now - It's Free</Link>
          </Button>
          <p className="mt-4 text-sm text-purple-300">Join 1,200+ families already organized for the holidays</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 bg-gradient-to-b from-transparent via-purple-950/50 to-transparent py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need for{" "}
              <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                Stress-Free Gift Giving
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 rounded-2xl p-8 border border-purple-700/30 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-violet-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Budget Tracking</h3>
                  <p className="text-purple-200 leading-relaxed">
                    Set spending limits for each person and stay on track. See your total holiday budget at a glance.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-violet-900/40 to-fuchsia-900/40 rounded-2xl p-8 border border-violet-700/30 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">AI Gift Suggestions</h3>
                  <p className="text-purple-200 leading-relaxed">
                    Get personalized gift recommendations based on interests, age, and occasion. Never run out of ideas.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-fuchsia-900/40 to-pink-900/40 rounded-2xl p-8 border border-fuchsia-700/30 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Family Collaboration</h3>
                  <p className="text-purple-200 leading-relaxed">
                    Share lists with family members to coordinate gifts and avoid duplicates. Perfect for big families.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 rounded-2xl p-8 border border-pink-700/30 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Holiday Planning</h3>
                  <p className="text-purple-200 leading-relaxed">
                    Create separate lists for Christmas, birthdays, anniversaries, and more. Stay organized year-round.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Loved by{" "}
            <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
              Thoughtful Gift-Givers
            </span>
          </h2>
          <p className="text-lg text-purple-200">See what families are saying about FareGalo</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Testimonial 1 */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gradient-to-br from-purple-900/80 to-violet-900/80 rounded-2xl p-6 border border-purple-700/50 backdrop-blur-sm h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-violet-400 rounded-full flex items-center justify-center text-white font-bold">
                  SJ
                </div>
                <div>
                  <h4 className="font-bold text-white">Sarah Johnson</h4>
                  <p className="text-sm text-purple-300">Mom of 3</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-purple-100 leading-relaxed">
                "FareGalo saved Christmas! I used to scramble last minute, but now I track ideas all year. My kids actually got thoughtful gifts this time!"
              </p>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gradient-to-br from-violet-900/80 to-fuchsia-900/80 rounded-2xl p-6 border border-violet-700/50 backdrop-blur-sm h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-full flex items-center justify-center text-white font-bold">
                  MC
                </div>
                <div>
                  <h4 className="font-bold text-white">Michael Chen</h4>
                  <p className="text-sm text-purple-300">Busy professional</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-purple-100 leading-relaxed">
                "I travel for work and used to forget everyone's birthdays. Now FareGalo keeps me organized and my family thinks I'm thoughtful again."
              </p>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gradient-to-br from-fuchsia-900/80 to-pink-900/80 rounded-2xl p-6 border border-fuchsia-700/50 backdrop-blur-sm h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                  EP
                </div>
                <div>
                  <h4 className="font-bold text-white">Emily Parker</h4>
                  <p className="text-sm text-purple-300">Large family coordinator</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-purple-100 leading-relaxed">
                "With 12 nieces and nephews, gift-giving was chaos. The budget tracking and shared lists are game-changers for our family!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Charity Badge - Secondary Position */}
      <section className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/50 to-teal-950/50 border border-emerald-500/20 p-8">
            {/* Animated glow effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />

            <div className="relative flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              {/* Heart icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Heart className="w-8 h-8 text-white fill-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  Give Gifts That Give Back
                </h3>
                <p className="text-emerald-100 mb-3">
                  When you plan gifts with FareGalo, you're also making a difference.
                  <strong className="text-white"> We donate 10% of our profits to charity</strong>—so far we've given{" "}
                  <span className="text-emerald-400 font-semibold">{charityStats.fuzzy_raised_amount}</span> to causes that matter.
                </p>
                <Link
                  href="/giving-pledge"
                  className="inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Learn about our giving pledge
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-violet-500 rounded-3xl blur-2xl opacity-30" />
            <div className="relative bg-gradient-to-br from-purple-900/90 to-violet-900/90 rounded-3xl p-12 border border-purple-700/50 backdrop-blur-sm">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Ready to Be the{" "}
                <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                  Best Gift-Giver
                </span>{" "}
                Ever?
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Join 1,200+ families who never miss a birthday or scramble for holiday gifts. Start planning in minutes.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white text-purple-900 hover:bg-purple-50 text-xl px-10 py-6 shadow-2xl transform hover:scale-105 transition-all font-bold"
              >
                <Link href={AUTH_ROUTES.signUp}>Start Planning For Free</Link>
              </Button>
              <p className="mt-4 text-sm text-purple-300">
                No credit card required • Free forever • Set up in 2 minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-8 text-center space-y-4 border-t border-purple-700/30">
        <div className="flex justify-center gap-6 text-sm text-purple-300">
          <Link href="/giving-pledge" className="hover:text-pink-400 transition-colors">
            Our Giving Pledge
          </Link>
          <span className="text-purple-700">•</span>
          <Link href="/privacy" className="hover:text-pink-400 transition-colors">
            Privacy
          </Link>
          <span className="text-purple-700">•</span>
          <Link href="/terms" className="hover:text-pink-400 transition-colors">
            Terms
          </Link>
        </div>
        <p className="text-purple-400 text-sm">
          © {new Date().getFullYear()} FareGalo. Making gift-giving thoughtful and organized.
        </p>
      </footer>
    </div>
  );
}
