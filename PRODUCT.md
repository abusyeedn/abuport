# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters and hiring managers evaluating Abu Syeed for product design roles. Secondary: potential collaborators — founders, teams, or clients who might want to work with him directly (freelance, cofounder-track, contract).

## Product Purpose

A personal portfolio site for Abu Syeed, a Product Designer with a background in AI & Data Science (B.Tech AI & DS) based in Chennai, India. He is currently looking for new opportunities, having recently wrapped up his tenure at Kynhood. The site showcases real, shipped design work — most prominently his product design role at Kynhood (Jun 2024 – Jul 2026) — alongside a set of independent UX case studies and audits (Coinpedia, FoundIt, PhonePe 2.0, Recruit CRM, Spaarks, a real-estate competitive audit). Success means a visitor quickly understands his design range and technical depth, and can reach him (email/LinkedIn) or download his resume.

## Positioning

Real, shipped product ownership — not just speculative case-study exercises. The flagship credential is that he led product design at Kynhood, a live product, through its Jun 2024 – Jul 2026 run, and the site is built to foreground that over the independent practice-case-studies (which stay present, but subordinate). His AI/Data Science background (e.g. the KNN-based zone-classification proposal in the Kynhood case study) is a supporting differentiator, not the primary one.

## Operating Context

- Single-page home (`App.tsx`) plus dedicated routed pages: `/kynhood2` (flagship case study + sub-projects), `/kynhood2/case/:slug` (individual Kynhood sub-project pages), `/casestudies` and `/casestudies/:caseId` (general case study gallery), `/spaarks`, `/resume`, `/about`.
- Content sources: `src/data/caseStudies.json` (general case studies, scraped/authored as markdown-in-JSON), `src/components/KynhoodBentoCards.tsx` (Kynhood sub-project card data, `ALL_KYNHOOD_CARDS`), static assets under `public/gallery/`.
- Built with React + TypeScript + Vite + react-router-dom + Framer Motion; deployed via Vercel (Analytics/Speed Insights present in deps).
- Design direction was rebuilt (Aug 2026) by adapting motion/layout language from three reference portfolios — vishnuroy.com, harshgond.framer.website, michaeltsirakis.com — into original layouts with Abu's own content; nothing was copy-pasted from those sites.

## Capabilities and Constraints

- All content must be real — no fabricated case studies, metrics, or testimonials.
- No pushes/commits to git without explicit user permission in-session.
- Nothing gets deleted outright; superseded code is archived (see `src/archive/`) rather than removed.
- The site's old in-browser visual "Edit Mode" system has been fully retired (toggle UI and localStorage-backed state removed); do not reintroduce it.
- Color system is being actively restricted project-wide to a green gradient (`#043d33 → #077a4b → #00cbb4`) + dark grey + one light grey — this migration is in progress, not finished. Older components/pages may still carry pre-migration accent colors (blues, yellows, oranges) that haven't been swept yet.
- Fonts are fixed: `FONTS.display` = Libre Baskerville (headings/serif moments), `FONTS.body`/`FONTS.primary` = DM Sans (body text) — set in `src/theme.ts`.

## Brand Commitments

- Name: Abu Syeed. Contact: abusyeed10202@gmail.com, LinkedIn (linkedin.com/in/abusyeed1/).
- Most recent role: Product Designer at Kynhood (June 2024 – July 2026, tenure ended). Currently open to new opportunities.
- Education: B.Tech, AI & Data Science.
- Based in Chennai, India.

## Evidence on Hand

- Kynhood flagship case study + real sub-project case studies (registration/pre-booking funnel, live multiplayer cricket quiz "Chase & Cheer", notification-driven inventory sync "Notify", partial-payments ticketing, QR validation/attendance system, Figma design system work, events content plugin) — `src/components/KynhoodBentoCards.tsx`.
- Independent case studies in `src/data/caseStudies.json`: Coinpedia redesign, FoundIt UX case study, PhonePe 2.0 behind-the-scenes analysis, Recruit CRM enhancements (x2), a competitive UX audit of Indian real-estate platforms, and the Kynhood UX & AI zone-selection write-up.
- Spaarks usability & accessibility audit (`/spaarks` page, own dedicated content).
- Downloadable resume at `/gallery/resume.pdf`.
- No fabricated testimonials, pricing, or client logos exist or should be added.

## Product Principles

1. Every claim and case study must trace to real, verifiable work — no invented metrics or projects.
2. Kynhood, as live shipped work, is the credibility anchor and should read as the flagship, not one card among equals.
3. Design should read as original craft inspired by reference portfolios, never as a copy of their layouts or copy.
4. Prefer archiving over deleting so prior work/state is always recoverable.
5. Ship real interactivity/motion (Framer Motion, scroll reveals) as craft signal, but never at the expense of clarity or load performance.

## Accessibility & Inclusion

No formal accessibility standard has been confirmed as a requirement; no known specific user accessibility needs have been raised for this project.
