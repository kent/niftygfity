# UI Implementation: Interactive Demo

## Overview

Creating an engaging interactive demo section that showcases ListyGifty's core functionality through a hands-on 3-step walkthrough. This will be positioned between the hero and features sections.

1. **InteractiveDemo** - Main demo section container with step selection
2. **DemoSlideshow** - Wrapped Spotify-style slideshow component  
3. **DemoMockups** - Realistic app interface previews for each step

---

## Task 1: InteractiveDemo Section

**File:** `apps/web/src/components/interactive-demo.tsx` (new file)

**What to build:**
A section component that introduces the demo with clear value proposition and launches the slideshow experience. Includes three preview cards showing the demo steps, with prominent "Try It Yourself" CTA that opens the full slideshow. Matches existing homepage section styling with violet-to-fuchsia gradient themes and proper spacing.

**Visual structure:**
```
┌─────────────────────────────────────────────────────────────────┐
│                    Interactive Demo Section                     │
│                                                                 │
│     🎯 Try ListyGifty in 60 Seconds                            │
│                                                                 │
│     See how easy gift planning can be with our                 │
│     3-step interactive walkthrough.                            │
│                                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                       │
│  │ Step 1  │  │ Step 2  │  │ Step 3  │                       │
│  │ Add     │  │ Plan    │  │ Stay    │                       │
│  │ People  │  │ Gifts   │  │ Balanced│                       │
│  └─────────┘  └─────────┘  └─────────┘                       │
│                                                                 │
│           [Try It Yourself - Opens Demo]                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Success Criteria:**
| Criterion | Expected |
|-----------|----------|
| Section renders in homepage | Component appears between hero and features |
| Three step cards display correctly | Each card shows step number, title, and brief description |
| CTA button triggers slideshow | Click opens DemoSlideshow modal |
| Styling matches homepage theme | Uses violet-fuchsia gradients and slate backgrounds |
| Responsive design works | Cards stack on mobile, remain side-by-side on desktop |
| Proper spacing maintained | 20px (py-20) section padding matches other sections |

**Style guide excerpt:**
- Background: `bg-slate-950` (#020617)
- Section Card: `bg-slate-900/50` (#0F172A with 50% opacity)  
- Text Primary: `text-white`
- Text Secondary: `text-slate-400`
- CTA Button: `bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500`
- Spacing: `py-20` (section), `p-8` (cards)

**Code pattern:**
```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DemoSlideshow } from './demo-slideshow';

const demoSteps = [
  {
    number: 1,
    title: "Add People",
    description: "Import family, friends, coworkers",
    icon: "👥"
  },
  {
    number: 2, 
    title: "Plan Gifts",
    description: "Track ideas, set budgets, get AI suggestions",
    icon: "🎁"
  },
  {
    number: 3,
    title: "Stay Balanced", 
    description: "Our tools ensure fair spending",
    icon: "⚖️"
  }
];

export function InteractiveDemo() {
  const [showSlideshow, setShowSlideshow] = useState(false);

  return (
    <>
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Try ListyGifty in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              60 Seconds
            </span>
          </h2>
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
            See how easy gift planning can be with our 3-step interactive walkthrough.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {demoSteps.map((step) => (
              <div 
                key={step.number}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm mb-3 mx-auto">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.description}</p>
              </div>
            ))}
          </div>

          <Button
            size="lg"
            onClick={() => setShowSlideshow(true)}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-lg px-8 py-6 h-auto shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300"
          >
            Try It Yourself
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h6m2 5.5V19c0-1.657-1.343-3-3-3H6c-1.657 0-3 1.343-3 3v2.5M12 12.5V12" />
            </svg>
          </Button>
        </div>
      </section>

      {showSlideshow && (
        <DemoSlideshow onClose={() => setShowSlideshow(false)} />
      )}
    </>
  );
}
```

---

## Task 2: DemoSlideshow Modal

**File:** `apps/web/src/components/demo-slideshow.tsx` (new file)

**What to build:**
Full-screen modal slideshow following the Wrapped Spotify Experience pattern. Three slides showing realistic app mockups for each step: adding people, planning gifts, and balancing spending. Includes progress bar, tap/swipe navigation, vibrant gradients, and smooth transitions. Auto-advances every 6 seconds but allows manual control.

**Visual structure:**
```
┌─────────────────────────────────────┐
│ [ListyGifty] [||] [🔊] [X]         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━     │  ← Progress bar
│                                     │
│    ╱╲    ╱╲                         │
│   ╱  ╲  ╱  ╲     Step 1            │
│  ╱    ╲╱    ╲                       │
│ ╱              ╲   Add Your People   │
│                                     │
│   [Mock interface showing           │
│    person cards being added]        │
│                                     │
│   Import family, friends,           │
│   coworkers. Everyone you           │
│   buy gifts for.                    │
│                                     │
│            [Continue Demo]          │
└─────────────────────────────────────┘
```

**Success Criteria:**
| Criterion | Expected |
|-----------|----------|
| Modal overlays full screen | Covers entire viewport with dark backdrop |
| Three slides render correctly | Each slide shows unique demo content |
| Progress bar shows current position | Visual indicator of slide 1/2/3 |
| Navigation works via tap/swipe | Left/right tap areas and swipe gestures |
| Auto-advance with pause control | 6-second intervals with play/pause toggle |
| Close button always visible | X in top-right closes modal |
| Vibrant gradient backgrounds | Each slide has unique gradient combination |
| Mobile-first responsive design | Works well on mobile and desktop |

**Style guide excerpt:**
- Background: `bg-slate-950` (base with gradients)
- Progress: `bg-violet-600` (active), `bg-slate-700` (inactive)
- Text: `text-white` (headlines), `text-slate-300` (body)
- Gradients: `from-violet-500 to-fuchsia-500`, `from-amber-500 to-orange-500`, `from-cyan-500 to-blue-500`
- Border: `rounded-2xl`

**Code pattern:**
```tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface Slide {
  id: number;
  title: string;
  description: string;
  gradient: string;
  mockup: React.ReactNode;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Add Your People",
    description: "Import family, friends, coworkers. Everyone you buy gifts for.",
    gradient: "from-violet-500 to-fuchsia-500",
    mockup: <div className="w-full max-w-sm mx-auto bg-slate-800 rounded-lg p-4 border border-slate-600">
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
          <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center text-white text-sm font-bold">M</div>
          <span className="text-white">Mom</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
          <div className="w-8 h-8 bg-fuchsia-500 rounded-full flex items-center justify-center text-white text-sm font-bold">D</div>
          <span className="text-white">Dad</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-slate-600 rounded-lg opacity-50">
          <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center text-slate-300 text-sm">+</div>
          <span className="text-slate-300">Add person...</span>
        </div>
      </div>
    </div>
  }
  // Additional slides...
];

interface DemoSlideshowProps {
  onClose: () => void;
}

export function DemoSlideshow({ onClose }: DemoSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <span className="text-white font-semibold">ListyGifty Demo</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-slate-300 hover:text-white"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </Button>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onClose}
          className="text-slate-300 hover:text-white"
        >
          ✕
        </Button>
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-8">
        <div className="flex gap-1">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded ${
                index <= currentSlide ? 'bg-violet-600' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Slide content */}
      <div className="flex-1 px-4 pb-8">
        <div className={`relative h-full rounded-3xl bg-gradient-to-br ${currentSlideData.gradient} p-8 overflow-hidden`}>
          {/* Gradient shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {currentSlideData.title}
            </h2>
            
            <div className="mb-8">
              {currentSlideData.mockup}
            </div>
            
            <p className="text-lg text-white/90 mb-8 max-w-md">
              {currentSlideData.description}
            </p>

            <Button
              onClick={nextSlide}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
            >
              {currentSlide === slides.length - 1 ? 'Start Free' : 'Continue Demo'}
            </Button>
          </div>

          {/* Navigation areas */}
          <div 
            className="absolute left-0 top-0 w-1/3 h-full cursor-pointer"
            onClick={prevSlide}
          />
          <div 
            className="absolute right-0 top-0 w-1/3 h-full cursor-pointer"
            onClick={nextSlide}
          />
        </div>
      </div>
    </div>
  );
}
```

---

## Task 3: Homepage Integration

**File:** `apps/web/src/app/page.tsx` (modify existing)

**What to build:**
Integrate the InteractiveDemo component into the existing homepage between the hero section and features section. Import and place the component while maintaining existing layout structure and spacing.

**Visual structure:**
```
┌─────────────────────────────────────┐
│           Hero Section              │ ← Existing
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│        Interactive Demo             │ ← New
│        (Try in 60 Seconds)         │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│        Features Section             │ ← Existing  
└─────────────────────────────────────┘
```

**Success Criteria:**
| Criterion | Expected |
|-----------|----------|
| Component imports correctly | No TypeScript errors on InteractiveDemo import |
| Positioned between hero and features | Demo appears after hero CTA, before "Everything You Need" |
| Layout flow maintains | No broken spacing or visual gaps |
| Existing sections unaffected | Hero and features render exactly as before |

**Style guide excerpt:**
- No styling changes needed - just integration
- Maintain existing `<main>` and `<section>` structure

**Code pattern:**
```tsx
// Add import at top
import { InteractiveDemo } from "@/components/interactive-demo";

// In the JSX, after hero section and before features:
export default function HomePage() {
  // ... existing code ...
  
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* ... existing header and hero sections ... */}
      
      <main className="relative flex-1 z-10">
        {/* ... existing hero section ... */}
        
        {/* NEW: Interactive Demo Section */}
        <InteractiveDemo />
        
        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-20">
          {/* ... existing features content ... */}
        </section>
        
        {/* ... rest of existing sections ... */}
      </main>
      
      {/* ... existing footer ... */}
    </div>
  );
}
```

---

## What NOT to Do

- Do NOT modify existing hero or features sections styling
- Do NOT add the demo inside the hero section itself
- Do NOT break the existing responsive behavior
- Do NOT add complex animations that slow page load
