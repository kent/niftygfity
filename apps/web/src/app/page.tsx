import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/services";
import { AuthRedirect } from "@/components/auth-redirect";
import { JsonLd } from "@/components/json-ld";
import { InteractiveDemo } from "@/components/interactive-demo";
import { HeroPreview } from "@/components/hero-preview";

export const metadata: Metadata = {
  title: "Listy Gifty: Never Stress About Gifts Again",
  description:
    "The smartest way to manage gift lists. Track gifts across occasions, balance spending between loved ones, get AI suggestions, and stay organized with status notifications.",
  alternates: {
    canonical: "/",
  },
};

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Track Gifts by Gift List",
    description: "Stay organized across Christmas, birthdays, anniversaries, and more. Get status updates and email notifications so nothing falls through the cracks.",
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    title: "Match Up Gifts Fairly",
    description: "Worried one kid has more than another? Our matching tool helps you balance gifts so everyone feels equally loved.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Compare Spending",
    description: "See at a glance who you've been generous with and who needs more love. Perfect for making sure parents, friends, or siblings are treated fairly.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "AI Gift Suggestions",
    description: "Stuck on what to get? Our AI analyzes interests, past gifts, and budget to suggest perfect presents they'll actually love.",
    gradient: "from-cyan-500 to-blue-500",
  },
];

const testimonials = [
  {
    quote: "This is the best app in the world!",
    author: "Kent's Mom",
    rating: 5,
  },
  {
    quote: "I don't know why my husband built this.",
    author: "Kent's Wife",
    rating: 5,
  },
  {
    quote: "I think my Dad sells Bitcoin.",
    author: "Kent's Children",
    rating: 5,
  },
  {
    quote: "These are great reviews",
    author: "Kyle F.",
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(rating)].map((_, i) => (
        <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.length ? process.env.NEXT_PUBLIC_APP_URL : "https://listygifty.com";

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col overflow-hidden">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Listy Gifty: Never Stress About Gifts Again",
          url: baseUrl,
          description:
            "The smartest way to manage gift lists. Track gifts across occasions, balance spending, and get AI suggestions.",
          mainEntity: {
            "@type": "SoftwareApplication",
            name: "Listy Gifty",
            applicationCategory: "LifestyleApplication",
            description:
              "A gift list management app that helps you organize presents for family and friends, track your budget, and coordinate with others.",
            author: {
              "@type": "Organization",
              name: "Listy Gifty",
            },
          },
        }}
      />
      
      <AuthRedirect />

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Header */}
      <header className="relative container mx-auto px-4 py-6 z-10">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/listygifty-logo.png"
              alt="Listy Gifty"
              width={44}
              height={44}
              className="rounded-lg"
              priority
            />
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
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-500/25"
            >
              <Link href={AUTH_ROUTES.signUp}>Get Started Free</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative flex-1 z-10">
        <section className="container mx-auto px-4 pt-12 pb-20 md:pt-20 md:pb-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Giving Pledge Banner */}
            <Link
              href="/giving-pledge"
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-medium hover:bg-rose-500/20 hover:border-rose-500/30 transition-colors"
            >
              <span>❤️</span>
              <span>10% of profits go to SickKids Hospital</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Main headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Never Stress About{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 tracking-normal whitespace-nowrap">
                Gifts Again
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              The only app that tracks gifts across every holiday, balances spending between loved ones, and suggests perfect presents with AI.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-lg px-8 py-6 h-auto shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300"
              >
                <Link href={AUTH_ROUTES.signUp}>
                  Start Planning for Free
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600 text-lg px-8 py-6 h-auto"
              >
                <Link href="#features">See How It Works</Link>
              </Button>
            </div>

            {/* NEW: Interactive Preview */}
            <div className="mb-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">See It In Action</h3>
                <p className="text-slate-400">This is what your gift planning will look like</p>
              </div>
              <HeroPreview />
            </div>

            {/* Social proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07 3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm">5.0 from happy families</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-700" />
              <div className="text-sm">
                <span className="text-violet-400 font-semibold">10%</span> of profits support charity
              </div>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Everything You Need for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                Perfect Gifting
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              From tracking to balancing to AI suggestions, we&apos;ve thought of everything so you don&apos;t have to.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/5"
              >
                {/* Icon */}
                <div className={`w-14 h-14 mb-6 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg`}>
                  {feature.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>

                {/* Hover effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </div>
            ))}
          </div>
        </section>

        {/* Holidays Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Not Just{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-green-400">
                Christmas
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Plan gifts for every occasion that matters to you and your loved ones.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {[
              { name: "Christmas", emoji: "🎄" },
              { name: "Hanukkah", emoji: "🕎" },
              { name: "Diwali", emoji: "🪔" },
              { name: "Easter", emoji: "🐣" },
              { name: "Valentine's Day", emoji: "💝" },
              { name: "Mother's Day", emoji: "💐" },
              { name: "Father's Day", emoji: "👔" },
              { name: "Birthdays", emoji: "🎂" },
              { name: "Anniversaries", emoji: "💍" },
              { name: "Thanksgiving", emoji: "🦃" },
              { name: "New Year", emoji: "🎉" },
              { name: "Graduation", emoji: "🎓" },
              { name: "Eid", emoji: "🌙" },
              { name: "Ramadan", emoji: "⭐" },
            ].map((holiday) => (
              <div
                key={holiday.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800 transition-colors"
              >
                <span className="text-lg">{holiday.emoji}</span>
                <span className="text-sm font-medium">{holiday.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Sharing & Privacy Section */}
        <section id="sharing" className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative p-10 md:p-14 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-fuchsia-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
                {/* Icon */}
                <div className="shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center shadow-xl shadow-fuchsia-500/25">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                    Share Lists,{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-400">
                      Keep Control
                    </span>
                  </h2>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    Invite family, friends, or coworkers to collaborate on a holiday list with a simple link. They can add gifts and people too. Your other lists stay private by default.
                  </p>

                  <ul className="space-y-3 mb-8 text-left max-w-md mx-auto lg:mx-0">
                    {[
                      "Share a link to invite collaborators instantly",
                      "Work together on gifts and people in real-time",
                      "Regenerate your link anytime to revoke access",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-300">
                        <svg className="w-5 h-5 text-fuchsia-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white shadow-lg shadow-fuchsia-500/25"
                  >
                    <Link href={AUTH_ROUTES.signUp}>
                      Start Sharing for Free
                      <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Simple as{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">
                1-2-3
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Get started in minutes, not hours. Our intuitive design makes gift planning effortless.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Circles with connectors */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-xl shadow-violet-500/25 flex-shrink-0">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <div className="hidden md:block w-24 lg:w-32 h-0.5 bg-gradient-to-r from-violet-500 to-violet-500/30" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-xl shadow-violet-500/25 flex-shrink-0">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <div className="hidden md:block w-24 lg:w-32 h-0.5 bg-gradient-to-r from-violet-500/30 to-violet-500" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-xl shadow-violet-500/25 flex-shrink-0">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
            </div>

            {/* Labels */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-3">Add Your People</h3>
                <p className="text-slate-400">Import family, friends, coworkers. Everyone you buy gifts for.</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-3">Plan Your Gifts</h3>
                <p className="text-slate-400">Track ideas, set budgets, and get AI suggestions for each person.</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-3">Balance & Relax</h3>
                <p className="text-slate-400">Our tools ensure fair spending. Notifications keep you on track.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Loved by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                Real Families
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Don&apos;t just take our word for it. Here&apos;s what our users have to say.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300"
              >
                <StarRating rating={testimonial.rating} />
                <p className="text-lg text-white mt-4 mb-6 leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <span className="text-slate-300 font-medium">- {testimonial.author}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="relative max-w-4xl mx-auto text-center p-12 md:p-16 rounded-3xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-violet-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-fuchsia-500/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Ready to Make Gifting Effortless?
              </h2>
              <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">
                Join thousands of families who&apos;ve made holiday stress a thing of the past. Start free today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-violet-700 hover:bg-slate-100 text-lg px-8 py-6 h-auto shadow-xl font-semibold"
                >
                  <Link href={AUTH_ROUTES.signUp}>
                    Get Started Free
                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-slate-400 mt-4">
                No credit card required
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative container mx-auto px-4 py-12 z-10">
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Image
                src="/listygifty-logo.png"
                alt="Listy Gifty"
                width={32}
                height={32}
                className="rounded-md"
              />
              <span className="text-sm font-semibold text-white">Listy Gifty</span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/giving-pledge" className="text-sm text-slate-400 hover:text-violet-400 transition-colors">
                Our Giving Pledge
              </Link>
            </div>

            <div className="text-center md:text-right">
              <p className="text-slate-500 text-sm">
                © {new Date().getFullYear()} Listy Gifty. Made with 💜 for gift givers everywhere
              </p>
              <p className="text-slate-600 text-xs mt-1">
                10% of profits support charity
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
