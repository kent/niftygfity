# Enhanced Interactive Demo Implementation

## Overview

Transform the current basic interactive demo into a rich, engaging experience that showcases actual product functionality. This will include an always-visible preview component in the hero section and an enhanced full-screen slideshow.

1. **Hero Preview Component** - Embedded interactive preview in hero section
2. **Enhanced Demo Slideshow** - More realistic mockups with hover interactions
3. **Demo Data Enhancement** - Replace placeholder content with realistic examples

---

## Task 1: Hero Preview Component

**File:** `apps/web/src/components/hero-preview.tsx` (new file)

**What to build:**
A compact, interactive preview component that sits prominently in the hero section. Shows a mini version of the gift list interface with hover states, clickable elements, and smooth animations. Demonstrates the core value prop without requiring a modal or full-screen experience.

**Visual structure:**
```
┌─────────────────────────────────────┐
│ Gift List for Christmas 2024        │
├─────────────────────────────────────┤
│ 👤 Mom           $125    [2 gifts]  │
│   🧶 Knitting Set   $45   ✅        │
│   💡 AI Suggestion: Garden Book     │
├─────────────────────────────────────┤
│ 👤 Dad           $130    [1 gift]   │
│   📚 History Book  $30   🛒         │
│   + Add gift idea...                │
└─────────────────────────────────────┘
```

**Success Criteria:**
| Criterion | Expected |
|-----------|----------|
| Component renders in hero section | Visible preview with realistic data |
| Interactive elements respond | Hover states show on cards and buttons |
| Animations work smoothly | Transitions are 300ms, consistent with design |
| Mobile responsive | Stacks appropriately on mobile |
| Realistic data shown | Names, prices, and gift ideas feel authentic |

**Style guide excerpt:**
- Background: `bg-slate-900/50` with `border-slate-800`
- Text: `text-white` for primary, `text-slate-400` for secondary
- Border: `border-slate-800` with `hover:border-slate-700`
- Spacing: `p-6`, `gap-3` for items

**Code pattern:**
```tsx
"use client";

import { useState } from "react";

interface Gift {
  id: string;
  name: string;
  price: number;
  status: "planned" | "ordered" | "suggestion";
  emoji?: string;
}

interface Person {
  id: string;
  name: string;
  initial: string;
  color: string;
  totalSpent: number;
  gifts: Gift[];
}

export function HeroPreview() {
  const [hoveredPerson, setHoveredPerson] = useState<string | null>(null);
  
  const demoData: Person[] = [
    {
      id: "mom",
      name: "Mom",
      initial: "M",
      color: "bg-violet-500",
      totalSpent: 125,
      gifts: [
        { id: "1", name: "Knitting Set", price: 45, status: "ordered", emoji: "🧶" },
        { id: "2", name: "Garden Book", price: 25, status: "suggestion", emoji: "📚" }
      ]
    },
    // More demo data...
  ];

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-300">
      {/* Implementation */}
    </div>
  );
}
```

---

## Task 2: Enhanced Demo Slideshow

**File:** `apps/web/src/components/demo-slideshow.tsx` (modify existing)

**What to build:**
Enhance the existing slideshow with more realistic mockups, interactive hover states, and better visual design. Add micro-animations and improve the mockup components to feel more like actual interfaces.

**Visual structure:**
Same overall structure but with enhanced mockups that include:
- More realistic names and gift ideas
- Interactive hover states on mockup elements
- Subtle animations and state changes
- Better visual hierarchy

**Success Criteria:**
| Criterion | Expected |
|-----------|----------|
| Enhanced mockups render | More realistic interface previews |
| Hover interactions work | Elements respond to mouse over |
| Smooth transitions | All animations are 300ms |
| Realistic data | Names, gifts, prices feel authentic |
| Progress indication | Clear progress through demo steps |

**Style guide excerpt:**
- Maintain existing gradient backgrounds
- Use `hover:bg-slate-600` for interactive elements
- Add `transition-all duration-300` to mockup elements

**Code pattern:**
```tsx
// Enhanced mockup with hover states
<div className="w-full max-w-sm mx-auto bg-slate-800 rounded-lg p-4 border border-slate-600">
  <div className="space-y-3">
    {mockupItems.map((item) => (
      <div 
        key={item.id}
        className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all duration-300 cursor-pointer"
        onMouseEnter={() => setHoveredItem(item.id)}
      >
        {/* Enhanced content */}
      </div>
    ))}
  </div>
</div>
```

---

## Task 3: Homepage Integration

**File:** `apps/web/src/app/page.tsx` (modify existing)

**What to build:**
Integrate the new HeroPreview component into the hero section, positioning it prominently after the main headline and CTA buttons. Adjust the layout to accommodate the preview while maintaining the strong call-to-action flow.

**Visual structure:**
- Hero headline and description (existing)
- Primary CTA buttons (existing) 
- **NEW: HeroPreview component**
- Social proof (existing)
- Rest of page content (existing)

**Success Criteria:**
| Criterion | Expected |
|-----------|----------|
| HeroPreview appears in hero | Component visible below CTAs |
| Layout remains responsive | Mobile and desktop layouts work |
| Visual hierarchy preserved | CTAs still prominent, preview supportive |
| Spacing consistent | Follows existing spacing patterns |

**Style guide excerpt:**
- Add preview with `mb-16` spacing to match existing elements
- Maintain responsive layout with proper mobile stacking

**Code pattern:**
```tsx
{/* CTA Buttons */}
<div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
  {/* Existing buttons */}
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
  {/* Existing social proof */}
</div>
```

---

## What NOT to Do

- Do NOT make the preview too large or dominant over CTAs
- Do NOT add too many interactive elements that distract from conversion
- Do NOT break the existing responsive layout patterns
