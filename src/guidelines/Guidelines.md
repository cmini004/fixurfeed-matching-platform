**Add your own guidelines here**
<!--

# General Guidelines

* Always return exactly 5 creators in the output, no more, no less.
* Each recommended creator must match at least one of the user’s selected interest tags.
* If a creator fulfills multiple roles (e.g., funny and recruiter), still count them as one unique slot.
* Prioritize small or mid-sized creators (under 50K followers) for 1:1 consulting recommendations.
* Inject light randomness among equally qualified creators to ensure variety across sessions.
* Filter creators using tags like “Career Hacks”, “Tactical Tips”, “Wellness”, “Humor”, “Startups”, etc.

# Matching Constraints

Each list of 5 must include:
* One creator in a career-goal-aligned aspirational role (e.g., PM, founder, consultant)
* One creator with recruiting experience (past or present)
* One creator who offers 1:1 consulting or coaching (small creator or public Calendly)
* One creator who likely shares a similar identity to the user (based on gender/race if input is given)
* One creator who is funny, unhinged, or entertainment-driven (“funny rich” person or meme poster)

# Design System Guidelines

* Use Tailwind CSS utility classes for layout and styling
* Stack creator cards in a responsive grid (1 column on mobile, 2–3 on desktop)
* Use `rounded-2xl`, `shadow-md`, and `p-4` for card styling
* Use `text-sm` for tags, `text-lg font-semibold` for names, and `text-base` for bios
* Include a CTA button on each card (e.g., “Follow on LinkedIn”) styled with `bg-primary text-white rounded-md px-4 py-2`

## Creator Card Component

### Structure
Each card should include:
* Name
* Role (e.g., “Founder of AI startup”)
* Platform icons or badges
* Tags (humor, fashion tech, etc.)
* Short bio or vibe
* Match reason (e.g., “Funny + recruiter + career tips”)
* CTA button

### Behavior
* Hover: Slight scale-up or shadow on hover
* Responsive: Stack vertically on small screens
* Identity match: Optionally highlight with a badge (“Looks like you”)

## Platform Tags
* Use emoji or icon + label when showing platforms:
  * TikTok → 🎵 TikTok
  * LinkedIn → 💼 LinkedIn
  * Newsletter → 📰 Newsletter
  * Instagram → 📸 Instagram

# Tone Guidelines

* Keep copy friendly, smart, and Gen-Z-aware but not cringey
* Avoid corporate jargon — talk like a well-informed older sibling
* Use phrases like “funny rich person” or “unhinged and helpful” where appropriate
* Emphasize usefulness, relatability, and variety

# Additional Rules

* Creators should feel aspirational but accessible
* Vary the mix of genders, ethnicities, and regions where possible
* Each creator should have at least 2–3 relevant tags
* Avoid repeating creators across sessions unless user input is identical

--> 