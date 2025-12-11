import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/services";
import { getCharityStats, DEFAULT_CHARITY_STATS } from "@/data/public";

export const metadata: Metadata = {
  title: "Our Giving Pledge",
  description:
    "Listy Gifty donates $5 per premium user to SickKids Hospital each December.",
  alternates: {
    canonical: "/giving-pledge",
  },
};

export default async function GivingPledgePage() {
  const stats = (await getCharityStats()) ?? DEFAULT_CHARITY_STATS;
  const progressPercent = Math.min((stats.raised_amount / stats.goal_amount) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/listygifty-logo.png"
              alt="Listy Gifty"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-xl font-bold text-white">Listy Gifty</span>
          </Link>
          <Button variant="ghost" asChild className="text-slate-300 hover:text-white hover:bg-slate-800">
            <Link href={AUTH_ROUTES.signIn}>Sign in</Link>
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Heart Icon */}
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-xl shadow-rose-500/25">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10 text-white"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Giving Pledge
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
            We donate <span className="text-emerald-400 font-bold">$5 per premium user</span> to{" "}
            <span className="text-white font-semibold">SickKids Hospital</span> each December.
          </p>

          {/* Progress Counter */}
          <div className="mb-10 p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="text-sm text-slate-400 mb-2">{stats.year} Goal</div>
            <div className="flex items-baseline justify-center gap-1 mb-4">
              <span className="text-5xl md:text-6xl font-bold text-emerald-400">${stats.raised_amount}</span>
              <span className="text-2xl text-slate-500">/ ${stats.goal_amount}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <p className="text-slate-400 mb-10">
            Because the best gifts help those who need it most.
          </p>

          {/* SickKids Video */}
          <div className="mb-12 rounded-xl overflow-hidden shadow-2xl shadow-black/50">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/K59IY7Iuxpc?si=bRQBUnh0FnVAWjb5"
              title="SickKids Hospital"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full aspect-video max-w-xl mx-auto"
            />
          </div>

          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-lg px-8"
          >
            <Link href={AUTH_ROUTES.signUp}>
              Get Started
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Listy Gifty
        </p>
      </footer>
    </div>
  );
}
