# UX Directions: Homepage Redesign

## Context

**User Prompt:**
> Let's make the homepage better!

**Screenshots:**
- eames-sessions/homepage-current.png (copied from .eames/screenshots/screenshot-1765815999215.png)

---

## Design Brief

**Context**
The current Listy Gifty homepage has a solid foundation with modern dark theme and comprehensive feature coverage. However, the page feels quite long and dense, with multiple sections that create cognitive overload. The testimonials use humorous but not credible quotes, and the visual hierarchy could be stronger to guide users toward conversion.

**Requirements**
- Maintain the existing dark theme and gradient aesthetic
- Improve visual hierarchy and content flow  
- Enhance conversion elements and social proof
- Reduce cognitive load while keeping comprehensive information
- Keep all existing functionality and links

---

## Matched Patterns

- `too-much-explanatory-text.txt` - Long sections competing for attention
- `ui-looks-messy.txt` - Visual hierarchy and polish opportunities
- `users-ignore-important-documents.txt` - Social proof and testimonials need better presentation

---

## Directions

### Direction 1: Streamlined Focus

**Solution:**
- Consolidate the 8+ sections into 5 key sections: Hero, Features, How It Works, Social Proof, CTA
- Move holiday examples and sharing details to dedicated info pages
- Strengthen testimonials with more credible quotes and better visual presentation
- Create stronger visual hierarchy with better spacing and typography contrast

**UX Flow:** User lands on hero → sees clear value prop → understands 4 key features → learns simple 3-step process → sees credible social proof → converts with strong final CTA

**What we fix:** Reduces cognitive overload and creates a clearer path to conversion.

**Why this works:** Fewer sections mean users can process the value proposition more easily and won't get lost in secondary information.

**Trade-offs:** Some detailed information moves to secondary pages, but primary conversion path becomes much clearer.

### Direction 2: Progressive Disclosure

**Solution:**
- Keep all current sections but reorganize with collapsible content areas
- Add "Learn More" links that expand detailed information inline
- Improve testimonial credibility with real customer stories and photos
- Add interactive elements like feature demos or calculators

**UX Flow:** User sees overview → can dive deeper into any area of interest → interactive elements keep them engaged → social proof builds trust → multiple CTAs throughout capture intent at different stages

**What we fix:** Maintains comprehensive information while allowing users to control their experience depth.

**Why this works:** Users who want details can get them without overwhelming users who want quick conversion.

**Trade-offs:** More complex interaction design and development effort, potential for users to get lost in expanded content.

