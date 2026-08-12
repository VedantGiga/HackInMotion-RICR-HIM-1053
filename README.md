# MatrixPay Launchpad

I have provided the reference images of the website make it exactly same as the images Build a Premium MatrixPay Fintech Landing Page, build perfectly with pixel perfect design as reference with exact colours and animations



Build a fully responsive, production-quality fintech landing page for “MatrixPay” using the uploaded reference screenshots as the primary visual source of truth.



The goal is to reproduce the same visual language, composition, spacing, typography hierarchy, geometric visuals, navigation behavior, cards, color system, and premium editorial feel shown in the references — while adapting the content to MatrixPay.



Do not create a generic SaaS landing page. The result should feel like a carefully art-directed fintech/infrastructure website.



---



1. TECH STACK



Use:



- React

- Vite

- Tailwind CSS

- GSAP

- GSAP ScrollTrigger

- Lenis smooth scrolling

- Framer Motion where appropriate

- Lucide React for UI icons

- CSS transforms instead of expensive layout animations

- Responsive design for desktop, tablet and mobile



Keep the code componentized and production-ready.



Suggested structure:



- "Navbar"

- "Hero"

- "PerformanceSection"

- "OverviewSection"

- "CapabilitiesSection"

- "CaseStudies"

- "StatsSection"

- "OrbitSection"

- "Footer"



---



2. DESIGN DIRECTION



The uploaded screenshots define the visual direction.



Overall aesthetic



- Premium fintech

- Editorial / Swiss-inspired layout

- High-end startup website

- Extremely clean

- White/off-white primary backgrounds

- Black typography

- Thin gray borders

- Large typography

- Generous whitespace

- Geometric 3D objects

- Grid systems

- Editorial asymmetric layouts

- Minimal but highly intentional UI

- Subtle neon accent colors



Do NOT make it look like a conventional Stripe clone.



Do NOT use:



- gradients everywhere

- excessive glassmorphism

- purple AI aesthetics

- excessive rounded SaaS cards

- generic dashboard mockups

- excessive shadows

- excessive animations



The design should feel architectural, mathematical and premium.



---



3. EXACT COLOR SYSTEM



Use the screenshots as the visual reference.



Primary:



- Black: "#050505"

- White: "#FFFFFF"

- Off-white: "#F7F7F5"

- Light gray: "#E9E9E7"

- Medium gray: "#A5A5A5"



Accent colors:



- Matrix lime: "#DFFF00"

- Cyan: "#18D7D7"

- Blue: "#3156FF"

- Deep navy: "#061126"



Use lime as the primary MatrixPay accent.



Accent colors should appear sparingly:



- navigation menu button

- small geometric details

- 3D object highlights

- buttons

- data labels

- small indicators



Do not introduce additional colors unless absolutely necessary.



---



4. TYPOGRAPHY



Use a modern grotesk/sans-serif font similar to the reference.



Preferred:



- Inter

- Geist

- Neue Haas Grotesk-like fallback



Typography should be bold and oversized.



Hero heading:



- very large

- tight line-height

- approximately 72–100px desktop

- approximately 48–64px tablet

- approximately 40–48px mobile



Section headings:



- 48–72px desktop



Body:



- 16–20px

- muted gray

- generous line-height



Navigation:



- 14–16px

- medium weight



Avoid decorative fonts.



---



5. NAVIGATION



Create a fixed/sticky navigation similar to the reference.



Desktop:



LEFT:

"matrixpay"



CENTER/RIGHT:



- Highlights

- Integrations

- Overview

- Use Cases

- About Us



Add small colored square details around the logo to recreate the reference's visual identity.



On mobile/tablet:



Replace the navigation links with a small lime square menu button.



The menu button should animate using Framer Motion/GSAP.



Opening the menu should reveal a full-screen navigation overlay with large typography.



Navbar should transition subtly when scrolling:



- transparent at top

- slightly opaque/blurred on scroll

- preserve minimal visual appearance



---



6. HERO SECTION



Create a large full-screen hero matching the first reference screenshot.



Desktop composition:



LEFT:



Small decorative grid/dot elements.



Large heading:



Smarter

Payments

Start Here



Below:



“MatrixPay is a modern, white-label payment gateway designed for fintechs, PSPs, ISOs, and ambitious merchants. Fast, flexible, and fully customizable.”



Then an outlined CTA:



"Discover"



The CTA contains a lime square on the right with a black downward arrow.



RIGHT:



Use the uploaded 3D visual/assets.



The primary visual should be a large white wireframe/geometric 3D object.



Place floating payment UI elements around it:



- Payment Send

- amount

- date

- user portrait



Also place a floating user image/card around the object.



Do NOT recreate these visuals with generic CSS if the supplied asset already represents them.



Use the uploaded images/assets directly.



---



7. HERO ANIMATION



Use GSAP + ScrollTrigger.



On initial page load:



1. Logo fades in

2. Navigation items stagger in

3. Decorative grid points fade in

4. Hero heading reveals line-by-line

5. Description fades upward

6. CTA scales/fades in

7. 3D object enters with subtle scale + rotation

8. Floating payment cards enter with stagger



Keep animation smooth and sophisticated.



No exaggerated bounce animations.



The 3D object should have subtle continuous movement.



Use:



- GSAP timeline

- "power3.out"

- "expo.out"

- subtle rotation

- scale

- translate



---



8. PERFORMANCE SECTION



Create the section shown in the second screenshot.



Large left-side heading:



Engineered for

Performance. Designed

for Scale.



Description:



“MatrixPay combines powerful financial infrastructure with cutting-edge payment technologies, helping you go live in days—not months.”



Right side contains a structured 2-column feature grid.



Features:



Full Card Support



Visa, Mastercard, Amex, JCB and more



Alternative Payments



Pix, Blik, SEPA, Open Banking, and more



Card Tools



Tokenization, BIN-routing, Cascading, Load Balancing



Fraud Prevention



3DS2, Velocity Checks, Real-time Risk Scoring



Merchant Tools



Intuitive Dashboard, Reporting, Reconciliation



White-Label Power



Custom domain, branding & invoice templates



Developer Friendly



RESTful APIs, Hosted Checkout, SDKs, Sandbox



24/7 Support



Dedicated account manager, technical support, onboarding assistance



Flexible Deployment



MatrixPay can be run cloud-based or installed on-premise



Use thin borders and large whitespace.



Feature cards should NOT feel like normal SaaS cards.



Use simple line icons.



---



9. FEATURE ANIMATIONS



As the user scrolls:



- Left heading reveals using clip-path/mask animation.

- Description fades upward.

- Feature items appear sequentially.

- Icons draw/fade in.

- Borders animate subtly.

- Feature cards move upward by approximately 20–40px.



Use ScrollTrigger.



Animation should happen only once per section.



---



10. OVERVIEW SECTION



Create a large editorial section matching the third screenshot.



Small eyebrow:



"Overview"



Large heading:



What is MatrixPay?



Left side contains the heading and supporting information.



Right side contains a large geometric 3D composition made from the uploaded visual assets.



Use the provided white cubic/wireframe assets.



Create the feeling that MatrixPay's infrastructure is a physical geometric system.



Add small floating labels:



- white-label

- payment

- banking rails

- API

- security



Connect some labels to the 3D structure using thin SVG lines.



Use tiny colored accent nodes.



---



11. OVERVIEW CONTENT



Create numbered editorial information blocks:



01



MatrixPay is a global, startup-friendly white-label payment gateway built for scale.



02



Built to plug into your business with ease, MatrixPay delivers blazing-fast onboarding, powerful developer tools, and access to a vast network of acquirers, APMs, and banking rails.



03



Flexible infrastructure designed around your business model.



04



Powerful payment capabilities without sacrificing control or customization.



Use the same spacious editorial layout shown in the references.



---



12. SECOND GEOMETRIC VISUAL SECTION



Create another large asymmetric section.



LEFT:



Use the supplied geometric 3D object.



RIGHT:



Feature information:



Merchant Tools



Intuitive Dashboard, Reporting, Reconciliation



White-Label Power



Custom domain, branding & invoice templates



Developer Friendly



RESTful APIs, Hosted Checkout, SDKs, Sandbox



24/7 Support



Dedicated account manager, technical support, onboarding assistance



Flexible Deployment



MatrixPay can be run cloud-based or installed on-premise



Add decorative black dots/grid points around the 3D object.



---



13. CASE STUDIES / HIGHLIGHTS



Create a dark section inspired by the provided reference screenshots.



Background:



Deep navy/black.



Heading:



From ambition to

tangible results



Create 3 large asymmetric case-study cards.



Cards should use the distinctive large rounded geometric shape from the reference:



1. Visa Innovation Program Europe

2. HackZone by Allianz

3. Kickstarting AI in Banking



Each card includes:



- title

- short description

- Read more button

- circular arrow



The first card can use a light background.



The remaining cards can use dark/translucent backgrounds.



Add thin outlines.



---



14. CASE STUDY BACKGROUND ANIMATION



Create an animated particle / grain / fluid background.



Use either:



- Canvas

- WebGL

- Three.js if needed

- GSAP-controlled SVG particles



The background should resemble the supplied reference:



- thousands of tiny particles

- deep blue field

- flowing curved particle formations

- occasional lime/yellow particle streams



Keep performance optimized.



Do NOT create a heavy Three.js scene if a performant Canvas solution is sufficient.



---



15. STATS SECTION



Create a highly editorial statistics section inspired by the supplied reference.



Use huge typography.



Example:



"100+"



with supporting text:



PoCs facilitated through the Visa Innovation Program Europe



Create additional large statistics using the same oversized typographic treatment.



Use asymmetric layouts and large colored geometric backgrounds.



Example palette:



- lime

- pink

- light blue

- white

- deep navy



Do not make it look like a dashboard.



It should look like an editorial annual report / premium fintech website.



---



16. IMAGE / EDITORIAL GRID



Create an image-based editorial section.



Use the supplied reference images/assets.



Create asymmetric image containers with:



- rounded geometric corners

- circular crops

- large rectangular crops

- overlapping images



Possible labels:



- Latest from our Orbit

- Upcoming Events

- Innovation

- Community

- Insights



Use subtle hover effects.



Images should slightly scale on hover using GSAP.



---



17. INTERACTION DESIGN



Every interaction should feel intentional.



Buttons:



- thin border

- subtle hover inversion

- arrow moves slightly

- accent square animates



Cards:



- slight translateY

- image scale

- border transition



Navigation:



- smooth menu animation



3D visuals:



- subtle parallax based on cursor position



Use Framer Motion for small UI interactions.



Use GSAP for:



- page entrance

- scroll animations

- parallax

- complex timelines

- geometric animations



Use Lenis for smooth scrolling.



---



18. LENIS



Install and configure Lenis globally.



Use a smooth scrolling loop integrated with GSAP ScrollTrigger.



Ensure:



- no scroll jank

- no broken anchor links

- mobile scrolling remains usable

- ScrollTrigger updates correctly



Use smooth interpolation rather than an aggressive scroll effect.



---



19. GSAP ARCHITECTURE



Create reusable animation utilities.



Example conceptual structure:



"animations/heroAnimations"

"animations/scrollAnimations"

"animations/parallax"

"animations/textReveal"



Use "gsap.context()" inside React components.



Properly clean up animations on unmount.



Do not create memory leaks.



---



20. TEXT REVEAL SYSTEM



For major headings use a premium text reveal.



Recommended:



- split text into lines

- overflow hidden

- translateY(100%)

- animate to "translateY(0)"



For individual words use staggered animation.



Avoid excessive text animation.



Only major headings should receive dramatic reveals.



---



21. PARALLAX



Implement subtle parallax for:



- 3D objects

- floating user images

- payment cards

- geometric blocks

- background decorative elements



Different layers should move at different speeds.



Mouse movement can produce subtle 3D movement on desktop.



Disable heavy cursor effects on mobile.



---



22. RESPONSIVE DESIGN



Desktop should closely match the supplied screenshots.



Tablet:



- reduce typography

- maintain asymmetric layouts

- preserve visual hierarchy



Mobile:



- stacked layouts

- large typography

- horizontally scrollable or stacked case studies

- simplified 3D visuals

- mobile navigation

- reduced decorative elements



Do not simply shrink the desktop layout.



Recompose sections intelligently for mobile.



---



23. 3D ASSETS



IMPORTANT:



The user will provide the visual assets used in the screenshots.



Use the supplied assets directly wherever possible.



Do not replace them with:



- generic stock images

- random 3D illustrations

- AI-generated substitutes

- unrelated icons



If an asset is a static render, enhance it with:



- scale

- rotation

- parallax

- opacity

- masking

- clipping

- scroll animation



If an asset has transparency, preserve its transparency.



If the provided assets include the exact geometric visuals, treat those assets as the source of truth.



---



24. IMAGE HANDLING



Use:



"object-fit: cover"



where appropriate.



Use:



"object-contain"



for 3D objects and transparent renders.



Do not distort aspect ratios.



Use "loading="lazy"" for below-the-fold images.



Use optimized image formats when possible.



---



25. SPACING SYSTEM



Use a generous editorial grid.



Desktop:



- max-width around 1400–1500px

- large horizontal margins

- 80–160px vertical section spacing



Avoid cramped sections.



The whitespace is a major part of the design.



---



26. IMPORTANT VISUAL RULE



The screenshots are the visual reference.



When making design decisions, prioritize:



1. Screenshot composition

2. Typography scale

3. Spacing

4. Grid

5. Shapes

6. Color

7. Animation

8. Content



Do not substitute the design with a standard component-library layout.



---



27. PERFORMANCE



The website must feel extremely smooth.



Optimize:



- image loading

- GSAP timelines

- ScrollTrigger

- Canvas particles

- 3D rendering

- layout shifts



Prefer GPU-friendly transforms:



"transform"

"opacity"



Avoid animating:



- width

- height

- top

- left



unless necessary.



Use "will-change" sparingly.



Respect "prefers-reduced-motion".



---



28. FINAL PAGE ORDER



Build the complete landing page in this order:



1. Sticky Navigation

2. Hero

3. Performance / Features

4. Overview

5. Infrastructure / Capabilities

6. Case Studies / Highlights

7. Large Statistics

8. Editorial Image Grid

9. Final CTA

10. Footer



---



29. FINAL CTA



Create a large closing section.



Headline:



Build the payment infrastructure

your business deserves.



Supporting text:



“Launch faster. Scale further. Stay in control.”



CTA:



"Talk to MatrixPay"



Secondary CTA:



"Explore the platform"



Use the Matrix lime accent.



Make this section visually impactful but consistent with the rest of the site.



---



30. FOOTER



Minimal footer.



Include:



MatrixPay



Navigation:



- Highlights

- Integrations

- Overview

- Use Cases

- About Us



Additional:



- Privacy

- Terms

- Contact



Keep it spacious and editorial.



---



31. IMPORTANT IMPLEMENTATION RULES



Do NOT:



- use generic gradients

- use purple

- use random colors

- use excessive rounded cards

- use generic SaaS illustrations

- use emoji

- use excessive shadows

- use excessive glassmorphism

- create a dashboard instead of a landing page

- use placeholder lorem ipsum

- ignore the supplied assets

- create generic animations



DO:



- use the screenshots as the visual reference

- use the supplied images/assets

- recreate the geometric compositions

- use huge typography

- use asymmetric editorial grids

- use thin borders

- use lime/cyan accents sparingly

- use smooth Lenis scrolling

- use GSAP ScrollTrigger extensively but tastefully

- use Framer Motion for micro-interactions

- create premium scroll choreography

- make the page feel highly polished



---



32. QUALITY BAR



The finished result should feel like a $20k–$50k premium fintech agency website, not an AI-generated template.



The first viewport should immediately communicate:



premium + financial infrastructure + technology + scale



The design should have strong visual rhythm:



WHITE → GEOMETRIC → WHITE → EDITORIAL → DARK → COLOR → WHITE



Maintain consistent typography and spacing throughout.



Before finishing, inspect the entire page for:



- alignment

- spacing

- responsive behavior

- animation timing

- typography consistency

- image quality

- section transitions

- performance

- mobile layout



Make the implementation polished enough to be presented directly to a client.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
