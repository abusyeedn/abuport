import { useState, useEffect, type CSSProperties } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Icon } from "@iconify/react"


interface TechGroup {
  group: string
  items: { label: string; icon: string }[]
}

interface FlowColumn {
  label: string
  flow: string[]
}

interface FeatureItem {
  title: string
  body?: string
  list?: string[]
  media?: string
}

interface ListGroup {
  label: string
  list: string[]
}

interface CaseStudySection {
  heading: string
  body?: string
  list?: string[]
  media?: string
  tech?: TechGroup[]
  flow?: string[]
  columns?: FlowColumn[]
  features?: FeatureItem[]
  groups?: ListGroup[]
}

interface CardData {
  title: string
  subtitle: string
  description: string
  features: string[]
  accent: string
  icon: string
  image: string
  caseStudy?: CaseStudySection[]
}

const CARDS: CardData[] = [
  {
    title: "Registration → Booking Funnel",
    subtitle: "Case Study 01 — Configurable attendee journey",
    description: "Organizers leaned on Google Forms and WhatsApp to vet attendees before booking. I designed a configurable registration phase — questionnaires, approvals, paid registration — that transitions approved users straight into booking, replacing fragmented manual workflows with one system.",
    features: ["Configurable questionnaires", "Approve / reject workflow", "Free or paid registration", "Auto-transition into booking"],
    accent: "#ef4444",
    icon: "📋",
    image: "/gallery/kyn1.jpg",
    caseStudy: [
      {
        heading: "Overview",
        body: "Kynhood originally supported a straightforward ticket booking experience where users could discover an event, purchase tickets, and attend. While this worked well for concerts and public gatherings, it wasn't suitable for workshops, networking events, tournaments, hackathons, or community-led experiences where organizers wanted to evaluate attendees before accepting bookings.\n\nMany organizers solved this problem by directing users to Google Forms or WhatsApp groups, reviewing applications manually, and sharing payment links individually. Although functional, this fragmented experience increased operational effort, created confusion for attendees, and led to drop-offs before booking.\n\nTo solve this, I designed a Registration-to-Booking Funnel that introduced a configurable event lifecycle. Organizers could now collect registrations, ask custom questions, review responses, approve or reject attendees, and automatically transition approved users into the booking phase — all within a single event.",
      },
      {
        heading: "Business Problem",
        body: "The platform only supported direct bookings, assuming every attendee was immediately eligible to purchase a ticket. Without an approval system, organizers had to depend on external tools to collect applications, manually review responses, and communicate booking links. This created disconnected workflows, inconsistent communication, and unnecessary administrative effort.\n\nFrom the attendee's perspective, the journey lacked transparency. Users often registered through external forms without knowing whether they had been accepted, when bookings would open, or what the next step would be.",
        list: [
          "No registration phase before booking",
          "Manual attendee approvals using external tools",
          "No questionnaire support",
          "No approval or rejection workflow",
          "No way to collect registration fees separately",
          "Poor visibility into attendee status",
          "High drop-off between registration and booking",
        ],
      },
      {
        heading: "Product Vision",
        body: "Rather than treating registration as an extension of booking, I redefined it as an independent phase within the event lifecycle. The vision was to build a flexible system capable of supporting multiple event formats through configurable phases instead of fixed booking flows. Organizers could choose between direct booking or a structured registration process depending on their event requirements — keeping the platform simple for public events while providing advanced capabilities for curated experiences.",
      },
      {
        heading: "Objectives",
        body: "The primary objective was to reduce manual operational work while improving booking quality and attendee conversion. The feature needed to:",
        list: [
          "Allow organizers to configure registration before booking",
          "Support both free and paid registrations",
          "Collect attendee information through customizable questionnaires",
          "Enable organizer approval or rejection",
          "Automatically transition approved users into booking",
          "Keep attendees informed through notifications at every stage",
        ],
      },
      {
        heading: "Research & Discovery",
        body: "Before beginning the design process, I analyzed how organizers were managing registrations and reviewed competing products across the event and community space. Although several platforms supported registrations, most handled only a portion of the workflow — organizers still relied on external tools for approvals, questionnaires, or communication. This research reinforced that the opportunity wasn't another registration form — it was a unified attendee management system.",
        list: ["Eventbrite", "Meetup", "Luma", "Airmeet", "Townscript", "Google Forms", "Discord Communities"],
      },
      {
        heading: "Key Insights",
        body: "Organizers valued attendee quality more than attendee quantity, especially for workshops, networking events, and invite-only experiences. Even a small registration fee significantly reduced low-intent registrations and increased commitment.\n\nParticipants expected clear communication throughout the journey. When approval timelines and booking windows weren't communicated effectively, users often abandoned the process before completing their purchase.",
      },
      {
        heading: "Personas — Organizer",
        body: "Organizers wanted greater control over who attended their events while minimizing manual work. They needed tools to collect applications, review responses, and approve only relevant participants without leaving the platform.",
        list: ["Improve attendee quality", "Reduce operational effort", "Review applications efficiently", "Manage registrations from one place"],
      },
      {
        heading: "Personas — Attendee",
        body: "Attendees wanted a clear and predictable experience from registration through booking. They expected transparency about approval status and timely communication throughout the process.",
        list: ["Simple registration", "Clear next steps", "Timely notifications", "Smooth booking after approval"],
      },
      {
        heading: "Existing Journey",
        body: "Discover Event → Book Ticket → Payment → Confirmation\n\nWhile effective for open events, this flow couldn't accommodate experiences requiring participant screening or approvals.",
      },
      {
        heading: "Proposed Journey",
        body: "Discover Event → Register → Complete Questionnaire → Await Organizer Review → Approved / Rejected → Booking Opens → Purchase Ticket → Booking Confirmed → Attend Event\n\nThis phased architecture allowed the same event listing to support both public and curated experiences.",
      },
      {
        heading: "Solution",
        body: "The solution centered around separating registration from booking while maintaining a seamless user experience. Organizers could now enable a registration phase during event creation. Depending on their needs, they could choose between free or paid registrations, add custom questionnaires, configure approval workflows, and define registration timelines. Approved users automatically became eligible for booking once the booking phase opened, eliminating manual coordination and improving conversion.",
      },
      {
        heading: "Design Decisions",
        list: [
          "Registration and booking were separated to reduce confusion and provide organizers with greater flexibility",
          "Paid registrations were introduced to improve attendee commitment while keeping ticket purchases separate",
          "Questionnaires became configurable so organizers could collect information specific to each event instead of relying on generic forms",
          "Approval workflows were optional, ensuring the feature worked equally well for public events and invite-only experiences",
          "Notifications were integrated throughout the journey to reduce uncertainty and improve completion rates",
        ],
      },
      {
        heading: "Edge Cases Considered",
        body: "Because the experience involved multiple phases, numerous scenarios needed to be addressed. Designing these scenarios early helped reduce ambiguity during development and testing.",
        list: [
          "Registration without questionnaires",
          "Paid registration followed by rejection",
          "Registration closing before booking opens",
          "Registration remaining open until the event starts",
          "Duplicate registrations",
          "Booking after approval expiration",
          "Automatic transition between phases",
          "Events without organizer approval",
        ],
      },
      {
        heading: "My Role",
        body: "I led the end-to-end UX design process while contributing significantly to product definition. Although my primary responsibility was design, I also worked closely with product managers and engineers to define feature behavior, ensuring the final implementation aligned with both business objectives and technical constraints.",
        list: ["Product discovery", "UX strategy", "User flows", "Information architecture", "Interaction design", "Business logic definition", "Edge case documentation", "Engineering collaboration", "Sprint planning", "UAT validation"],
      },
      {
        heading: "Expected Business Impact",
        body: "The Registration-to-Booking Funnel created a scalable framework for managing curated events without increasing operational complexity. By replacing fragmented workflows with a unified system, organizers gained complete visibility into attendee management while participants experienced a transparent and structured booking journey. The feature positioned the platform to support a much broader range of event formats — from public ticketed events to application-based community experiences — using the same underlying architecture.",
      },
    ],
  },
  {
    title: "Chase & Cheer",
    subtitle: "Live multiplayer cricket quiz — Marina Mall IPL screening",
    description: "A real-time multiplayer cricket quiz where an emcee controlled the entire game while hundreds of participants joined from their phones and competed live on a leaderboard. Supported 150+ concurrent participants throughout the event.",
    features: ["Single shared game state", "Emcee-controlled admin dashboard", "Live leaderboard & Rethink Mode", "150+ concurrent participants"],
    accent: "#f97316",
    icon: "🏏",
    image: "/gallery/kyn2.jpg",
    caseStudy: [
      {
        heading: "Overview",
        body: "Kyn partners with brands, malls, pubs, and event organizers to build interactive audience engagement experiences around live events.\n\nWe'd already run one such game, Chase & Cheer, with partners like Jyke & Hydell and a few other venues. It landed well and proved something useful — live games genuinely pull people into a cricket screening rather than having them just sit in the background.\n\nSo when Marina Mall came on board for their IPL screening, the business wanted something different this time, not a repeat of Chase & Cheer, but a fresh engagement experience entirely.\n\nI was brought in to build that new game — same spirit, same philosophy, just a different experience for people at the screening.\n\nWhat I ended up building, as a side project, was a real-time multiplayer cricket quiz. An emcee ran the show while hundreds of people joined in from their phones and competed live on a shared leaderboard.\n\nOn the night, it held up past 150 concurrent participants and kept the crowd engaged right through to the end of the screening.",
        media: "Marina Mall IPL screening — event photo",
      },
      {
        heading: "Business Requirement",
        body: "The goal was never to replace Chase & Cheer — it had already proven itself across multiple venues.\n\nWhat the business actually wanted was another format we could pull out for future partnerships and big public screenings. The brief was fairly open, but a few things were non-negotiable. The new experience needed to:",
        list: [
          "Be easy for anyone to join using their phone",
          "Allow an emcee to control the flow of the game",
          "Keep audiences engaged between overs and innings",
          "Display scores and rankings in real-time",
          "Give sponsors and partners natural visibility throughout the experience",
          "Be reusable for future events with minimal setup",
        ],
      },
      {
        heading: "My Approach",
        body: "I didn't want players moving through their own quiz independently — that felt closer to a form than a live event. So instead, the whole platform was built around one shared game state.\n\nEvery participant sees the exact same screen at the exact same moment. The instant the emcee starts a question:",
        list: ["Everyone received it simultaneously", "The countdown started simultaneously", "Answers closed simultaneously", "Results were revealed simultaneously", "Leaderboards refreshed simultaneously"],
      },
      {
        heading: "User Journey",
        columns: [
          { label: "Player", flow: ["Scan QR Code", "Enter Name, Mobile Number & Email", "Wait for Quiz to Start", "Get Ready Countdown", "Answer Question", "Waiting for Reveal", "View Result", "Live Leaderboard", "Next Question"] },
          { label: "Emcee / Admin", flow: ["Login", "Select Saved Quiz", "Start Question", "Monitor Live Responses", "Reveal Correct Answer", "Display Leaderboard", "Repeat Until Event Ends"] },
        ],
        media: "Player mobile flow + Admin dashboard control center",
      },
      {
        heading: "Tech Stack",
        body: "Nothing exotic here — a fairly standard modern real-time web stack, picked for speed of building over novelty.",
        tech: [
          {
            group: "Frontend",
            items: [
              { label: "React 18", icon: "logos:react" },
              { label: "Vite", icon: "logos:vitejs" },
              { label: "TypeScript", icon: "logos:typescript-icon" },
              { label: "Tailwind CSS", icon: "logos:tailwindcss-icon" },
              { label: "Shadcn/UI", icon: "simple-icons:shadcnui" },
            ],
          },
          {
            group: "State Management",
            items: [{ label: "Zustand", icon: "solar:database-bold" }],
          },
          {
            group: "Backend",
            items: [{ label: "Supabase (Lovable Cloud)", icon: "logos:supabase-icon" }],
          },
          {
            group: "Realtime",
            items: [{ label: "Supabase Realtime Channels", icon: "solar:wi-fi-router-bold" }],
          },
          {
            group: "Animation",
            items: [{ label: "Framer Motion", icon: "logos:framer" }],
          },
          {
            group: "Charts",
            items: [{ label: "Recharts", icon: "solar:chart-2-bold" }],
          },
          {
            group: "Notifications",
            items: [{ label: "Sonner", icon: "solar:bell-bold" }],
          },
        ],
      },
      {
        heading: "Architecture",
        body: "Realtime sync was the whole point, so the architecture was built around it from day one.",
        flow: ["Players", "Supabase Realtime", "Shared Game State", "Admin Dashboard", "Score Engine", "Leaderboard"],
      },
      {
        heading: "Features I Built",
        features: [
          {
            title: "Live Multiplayer Gameplay",
            body: "No app to install — players just joined from their phones. Once the emcee hit start, everyone was in it together, live.",
            media: "Live gameplay — players on mobile",
          },
          {
            title: "Admin Dashboard",
            body: "This is where the emcee ran the whole show:",
            list: ["Start questions", "Lock and unlock questions", "Reveal answers", "Monitor participant count", "View live responses", "End the quiz"],
          },
          {
            title: "Multiple Question Types",
            body: "Didn't want it to feel like the same MCQ over and over, so I mixed in numeric predictions, image-based questions, and team picks — each with its own scoring logic.",
          },
          {
            title: "Live Leaderboard",
            body: "Scores recalculated right after each question and updated for everyone at once. People stuck around just to watch their rank move.",
            media: "Live leaderboard — real-time rankings",
          },
          {
            title: "Rethink Mode",
            body: "Some questions got flagged as Rethink Questions — players got a second shot at them later in the game, with points scaled to how many attempts they got right. Ended up being one of the more fun mechanics in the whole game.",
          },
          {
            title: "Quiz Sessions",
            body: "Organizers could save a full quiz and just reload it for the next event instead of rebuilding it from scratch — makes the whole thing reusable.",
          },
        ],
      },
      {
        heading: "Real-Time Synchronization",
        body: "Keeping everyone in sync was honestly the hardest part of this build.\n\nEvery time the admin changed something — new question, timer, reveal — it had to hit every connected phone at basically the same instant, no refresh needed. All of it ran through Supabase Realtime subscriptions.\n\nRather than juggling local state per device, I kept one shared piece of state everyone read from:\n\ninterface GameState {\n  activeQuestion: string | null\n  status: \"waiting\" | \"active\" | \"ended\"\n  isLocked: boolean\n  correctAnswerRevealed: boolean\n}\n\nWhen the emcee hit Start Question, this is what fired:\n\nawait supabase\n  .from(\"game_state\")\n  .update({\n    active_question: question.id,\n    status: \"active\"\n  })\n\nThat update propagated to every player instantly. Answers were saved the same way, independently per player:\n\nawait supabase\n  .from(\"responses\")\n  .insert({\n    participant_id,\n    question_id,\n    answer\n  })\n\nScoring only ran after the admin revealed the correct answer — not before.",
      },
      {
        heading: "Event Outcome",
        body: "Ran this live at Marina Mall's IPL screening. Here's how it actually went:",
        list: [
          "More than 150 participants stayed connected simultaneously",
          "The application remained stable throughout the screening, running until approximately 11 PM",
          "The emcee could monitor participant counts and responses live from the dashboard",
          "Leaderboards updated instantly after every question",
          "Audiences stayed engaged between overs instead of passively watching the screen",
          "Sponsors received repeated visibility through branded questions and event interactions",
        ],
        media: "Event night — Marina Mall IPL screening",
      },
      {
        heading: "Business Impact",
        groups: [
          { label: "For Participants", list: ["Interactive match-day experience", "Live competition with other fans", "Instant feedback after every question", "Real-time rankings"] },
          { label: "For Event Hosts", list: ["Easy-to-use admin controls", "Live audience participation metrics", "Reusable quiz sessions", "Better crowd engagement"] },
          { label: "For Sponsors", list: ["Higher brand exposure", "More audience interaction", "Sponsor-integrated questions and branding opportunities"] },
        ],
      },
      {
        heading: "My Contribution",
        body: "Built the whole MVP myself, end to end.\n\nI leaned on Claude as a coding assistant to move faster — it helped write a good chunk of the code — but the product thinking, the architecture, the data model, and the realtime sync strategy were all mine to figure out.",
      },
      {
        heading: "Reflection",
        body: "What this taught me: good audience engagement isn't really about clever questions — it's about making people feel like they're in it together. Once the gameplay, scoring, and leaderboard were all synced up, the quiz stopped feeling like a side activity and started feeling like part of the match itself. And it's a good reminder that a scrappy MVP, built fast, can still hold up under 150+ people playing live at once.",
      },
    ],
  },
  {
    title: "Notify",
    subtitle: "Notification-driven inventory sync",
    description: "While working on Kyn, we were exploring ways to solve one of the biggest problems in the venue booking ecosystem—inventory synchronization. Within two days, I built a working proof of concept that used Android notifications as the integration layer.",
    features: ["Android Notification Listener", "Deterministic booking parser", "Auto slot blocking via API", "Built in 2 days with Claude"],
    accent: "#8b5cf6",
    icon: "◈",
    image: "/gallery/kyn3.jpg",
    caseStudy: [
      {
        heading: "Overview",
        body: "While working on Kyn, we were exploring ways to solve one of the biggest problems in the venue booking ecosystem—inventory synchronization.\n\nUnlike industries such as airlines or cinemas, sports turfs and activity centers don't have a shared inventory protocol. Most venue owners list the same slot across multiple booking platforms, but these platforms don't expose APIs that allow inventory to stay synchronized.\n\nOur long-term vision was to eventually build something similar to ONDC for slot-based venues—a common inventory layer that different booking platforms could connect to. However, building such an ecosystem would require participation from large industry players, making it a long-term initiative rather than an immediate solution.\n\nAs a short-term experiment, I was asked to explore whether we could automate inventory updates without relying on APIs.\n\nWithin two days, I built a working proof of concept that used Android notifications as the integration layer.\n\nAlthough it was only a demo project, it successfully validated that notifications could be transformed into real-time inventory events.",
      },
      {
        heading: "Background",
        body: "Whenever a booking happens on platforms like TurfTown or District, venue managers immediately receive a confirmation notification on their phones.\n\nThat made me wonder:\n\n\"If venue managers already receive booking information through notifications, do we actually need APIs?\"\n\nInstead of integrating with booking platforms, maybe we could integrate with the notifications they already send.\n\nThat became the entire idea behind this MVP.",
        media: "Booking confirmation notification (TurfTown / District)",
      },
      {
        heading: "Why We Didn't Build APIs",
        body: "Our original vision was much bigger.\n\nWe wanted to build a unified inventory protocol for slot-based venues, similar to how cinema chains maintain seat availability across different ticketing platforms.\n\nBut that kind of solution only works when multiple large players agree to participate.\n\nSince no common protocol existed—and competitors had no incentive to expose their APIs—we needed another way to validate the idea.\n\nThis notification-based solution was built to answer one simple question:\n\nCan we automate inventory synchronization without requiring any cooperation from other platforms?",
      },
      {
        heading: "The Business Problem",
        body: "One of our venue partners, VGP Turf Arena, listed their inventory on multiple booking platforms including TurfTown and District.\n\nIf someone booked a slot on one platform, the venue staff had to manually block the same slot inside Kyn.\n\nEvery missed update increased the risk of double bookings.\n\nThe existing workflow looked like this:",
        flow: ["Booking happens", "Venue receives notification", "Staff opens Kyn dashboard", "Searches for slot", "Blocks inventory manually", "Repeats several times every day"],
        media: "Manual workflow diagram — booking to inventory block",
      },
      {
        heading: "The Business Problem (continued)",
        body: "Although simple, this process depended entirely on humans remembering to perform each step.",
      },
      {
        heading: "My Goal",
        body: "Build a lightweight Android application capable of:",
        list: [
          "Reading booking notifications",
          "Understanding booking details",
          "Identifying venue, date and slot",
          "Calling Kyn APIs automatically",
          "Closing inventory without manual intervention",
        ],
      },
      {
        heading: "My Goal (continued)",
        body: "The objective wasn't to build a polished product.\n\nThe objective was to validate whether notifications could become an integration layer.",
      },
      {
        heading: "Tech Stack",
        body: "Since this was an exploration project, I optimized for speed instead of perfection. I built the entire MVP using:",
        tech: [
          {
            group: "Mobile",
            items: [
              { label: "Kotlin", icon: "logos:kotlin-icon" },
              { label: "Android Studio", icon: "logos:android-icon" },
              { label: "Notification Listener Service", icon: "solar:bell-bold" },
            ],
          },
          {
            group: "Backend",
            items: [
              { label: "Supabase", icon: "logos:supabase-icon" },
              { label: "REST APIs", icon: "solar:server-2-bold" },
            ],
          },
          {
            group: "Deployment",
            items: [{ label: "Vercel", icon: "logos:vercel-icon" }],
          },
          {
            group: "Admin Dashboard",
            items: [{ label: "React", icon: "logos:react" }],
          },
        ],
      },
      {
        heading: "Tech Stack (continued)",
        body: "The entire project was completed in approximately two days, using AI-assisted development with Claude to rapidly prototype the architecture and implementation.",
      },
      {
        heading: "How It Worked",
        body: "The onboarding process was intentionally simple.\n\nOnce the APK was installed, the venue manager granted Notification Access permission on Android.\n\nInside the application, they selected which applications should be monitored.\n\nFor the demo, I configured: WhatsApp, Gmail\n\nI also manually registered the mobile number and email address whose notifications should be parsed.\n\nThis ensured that only booking confirmations from trusted sources were processed.",
        media: "App onboarding — notification access + monitored apps",
      },
      {
        heading: "The Demo Flow",
        body: "Once setup was complete, the workflow looked like this.\n\nA booking confirmation was sent through WhatsApp or Gmail containing details such as: Venue, Date, Time, Booking confirmation",
        flow: ["The application intercepted the notification", "The parsing engine extracted the booking details", "Structured booking data was generated", "A backend API was triggered", "The corresponding slot was automatically marked unavailable inside the Kyn portal"],
        media: "Kyn dashboard — slot auto-marked unavailable",
      },
      {
        heading: "The Demo Flow (continued)",
        body: "Without anyone opening the dashboard, inventory was updated within seconds.\n\nWatching the slot disappear automatically after receiving a notification became the most satisfying part of the demo.",
      },
      {
        heading: "Building the Parser",
        body: "The notifications weren't designed for machines.\n\nThey were written for humans.\n\nThat meant every message had slightly different wording.\n\nInstead of relying on AI, I built a deterministic parser that looked for predefined booking patterns.\n\nFrom every notification, I extracted:",
        list: ["Venue", "Booking date", "Slot timing", "Booking status"],
        media: "Parser logic — notification text to structured payload",
      },
      {
        heading: "Building the Parser (continued)",
        body: "Once validated, the parser converted the notification into a structured API payload.",
      },
      {
        heading: "Challenges",
        body: "The biggest challenge wasn't writing Kotlin code.\n\nIt was figuring out how to reliably extract structured information from completely unstructured notification text.\n\nSince every platform formats confirmations differently, the parser had to remain flexible while still being predictable.\n\nAnother challenge was ensuring the application only processed booking notifications and ignored everything else.\n\nThis required app-level filtering as well as sender-level validation.",
      },
      {
        heading: "Pitching the Idea",
        body: "Once the prototype was ready, we demonstrated it to one of our organizer partners.\n\nInitially, we believed this could become an add-on feature priced around ₹500 per month.\n\nThe discussion took an interesting turn.\n\nThe organizer explained that whenever double bookings happened, they usually handled it manually by either:",
        list: ["Offering another slot", "Giving customers a 50% discount", "Refunding part of the booking"],
      },
      {
        heading: "Pitching the Idea (continued)",
        body: "Although the existing process worked, it consumed operational time and affected customer experience.\n\nWhen we demonstrated automatic inventory synchronization, they immediately saw its value.\n\nSurprisingly, they said they would be comfortable paying around ₹5,000 per month for a reliable solution because preventing even a few double bookings every month would save significantly more than that.\n\nThat conversation completely changed how we valued the product.",
        media: "Organizer pitch — pricing discussion (₹500 → ₹5,000/mo)",
      },
      {
        heading: "Key Learnings",
        body: "This project taught me that validating a business idea doesn't always require months of development.\n\nSometimes, a small but functional prototype is enough to start meaningful conversations with customers.\n\nTechnically, I learned how Android's Notification Listener framework can be used beyond its traditional purpose and how event-driven architectures can be created without direct platform integrations.\n\nFrom a product perspective, the biggest lesson was understanding the difference between solving a technical problem and solving an operational one.\n\nThe organizer wasn't buying a notification parser.\n\nThey were buying peace of mind.",
      },
      {
        heading: "What's Next?",
        body: "Although this MVP achieved its objective, it was never intended to be the final solution.\n\nThe long-term vision remains much bigger.\n\nInstead of relying on notifications, the goal is to build a dedicated inventory layer for slot-based venues that can integrate directly with multiple booking platforms—similar to how centralized inventory systems operate in industries like cinema and hospitality.\n\nThis prototype simply proved that the business problem was worth solving and that there was genuine willingness to pay for a better solution.\n\nDespite being completed in just two days, the project successfully validated both the technical feasibility and the commercial potential of notification-driven inventory synchronization.",
      },
    ],
  },
  {
    title: "Tribe Building",
    subtitle: "Find your people",
    description: "Interest-based micro-communities with shared calendars, group chats and member roles that grow organically.",
    features: ["Interest matching", "Group messaging", "Shared calendar", "Member roles"],
    accent: "#0ea5e9",
    icon: "⬡",
    image: "/gallery/kyn4.jpg",
  },
  {
    title: "Booking Engine",
    subtitle: "Seamless ticketing",
    description: "In-app payment, QR check-in, instant confirmation and smart cancellation — zero redirects, zero friction.",
    features: ["In-app payment", "QR check-in", "Instant confirmation", "Smart cancellation"],
    accent: "#10b981",
    icon: "◎",
    image: "/gallery/kyn5.jpg",
  },
  {
    title: "Discovery Feed",
    subtitle: "Personalised for you",
    description: "Curated feed powered by location, interests and social graph — surfaces events and tribes before users search.",
    features: ["Algorithmic curation", "Near-me filter", "Category browse", "Trending events"],
    accent: "#f59e0b",
    icon: "◉",
    image: "/gallery/kyn6.jpg",
  },
  {
    title: "Engagement Score",
    subtitle: "Gamified participation",
    description: "Kyn Points system drives repeat engagement — streaks, badges and a community leaderboard keep users active.",
    features: ["Activity streaks", "Badge system", "Community leaderboard", "Redeemable rewards"],
    accent: "#ec4899",
    icon: "★",
    image: "/gallery/kyn7.jpg",
  },
  {
    title: "Design System",
    subtitle: "Brand & components",
    description: "Built a scalable token-based design system in Figma — used across iOS, Android and Web with a single source of truth.",
    features: ["Color & type tokens", "Component library", "iOS + Android", "Figma auto-layout"],
    accent: "#6366f1",
    icon: "▣",
    image: "/gallery/kyn8.jpg",
  },
  {
    title: "50K+ Users",
    subtitle: "And growing",
    description: "Shipped 12 major features in 14 months across 3 cities — 4.8★ App Store rating and 200+ events hosted monthly.",
    features: ["50K+ downloads", "200+ monthly events", "15+ cities", "4.8 ★ App Store"],
    accent: "#ef4444",
    icon: "↗",
    image: "/gallery/kyn9.jpg",
  },
]

function ArrowRight({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function FlipIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  )
}

function CardFlip({ card, onReadMore }: { card: CardData; onReadMore: () => void }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="kyn-card-root"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      style={{
        perspective: "2000px",
        height: "300px",
        width: "100%",
        position: "relative",
      }}
    >
      {/* Flip container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.5s cubic-bezier(0.77,0,0.175,1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ── FRONT ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
            borderRadius: "16px",
            overflow: "hidden",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Cover image */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <img
              src={card.image}
              alt={card.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none", userSelect: "none" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, rgba(255,255,255,0.85) 100%)" }} />
          </div>

          {/* Bottom text */}
          <div style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", borderTop: "1px solid #e2e8f0" }}>
            <div>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: "1rem", color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.3, transition: "transform 0.4s ease", transform: flipped ? "translateY(-4px)" : "translateY(0)" }}>
                {card.title}
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.4, transition: "transform 0.4s ease 0.05s", transform: flipped ? "translateY(-4px)" : "translateY(0)" }}>
                {card.subtitle}
              </p>
            </div>
            <div style={{ flexShrink: 0, opacity: 0.5 }}>
              <FlipIcon color={card.accent} />
            </div>
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "16px",
            padding: "20px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            <div style={{ marginBottom: "12px" }}>
              <h3 style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "0.95rem", color: "#0f172a", letterSpacing: "-0.02em" }}>{card.title}</h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.76rem",
                  color: "#64748b",
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                } as CSSProperties}
              >
                {card.description}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {card.features.map((f, i) => (
                <div
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.78rem",
                    color: "#334155",
                    transition: "transform 0.3s cubic-bezier(0.23,1,0.32,1), opacity 0.3s cubic-bezier(0.23,1,0.32,1)",
                    transitionDelay: `${i * 50 + 150}ms`,
                    transform: flipped ? "translateX(0)" : "translateX(-10px)",
                    opacity: flipped ? 1 : 0,
                  }}
                >
                  <ArrowRight color={card.accent} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          {card.caseStudy && (
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "10px", marginTop: "10px", flexShrink: 0 }}>
              <button
                onClick={(e) => { e.stopPropagation(); onReadMore() }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", border: `1px solid ${card.accent}40`, borderRadius: "10px", padding: "8px 12px",
                  background: `${card.accent}12`, cursor: "pointer", font: "inherit",
                }}
              >
                <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0f172a" }}>Read full case study</span>
                <ArrowRight color={card.accent} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StepFlow({ steps, accent }: { steps: string[]; accent: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", marginTop: "4px" }}>
      {steps.map((step, i) => (
        <div key={step} style={{ display: "flex", gap: "10px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <div
              style={{
                width: "20px", height: "20px", borderRadius: "50%",
                background: `${accent}16`, border: `1.5px solid ${accent}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.65rem", fontWeight: 700, color: accent, flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: "1.5px", flex: 1, minHeight: "14px", background: `${accent}30` }} />
            )}
          </div>
          <div style={{ paddingBottom: "12px" }}>
            <span style={{ fontSize: "0.88rem", color: "#0f172a", lineHeight: 1.5, fontWeight: 400 }}>{step}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function CaseStudyPanel({ card, onClose }: { card: CardData; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const panel = (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 99998,
          background: "rgba(15,23,42,0.25)", backdropFilter: "blur(2px)",
        }}
      />

      {/* Slide-in panel */}
      <motion.div
        key="panel"
        initial={{ x: "100%" }}
        animate={{ x: 0, transition: { type: "spring", stiffness: 150, damping: 20 } }}
        exit={{ x: "100%", transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } }}
        style={{
          position: "fixed", top: 0, right: 0, zIndex: 99999,
          width: "clamp(320px, 48%, 680px)",
          height: "100vh",
          background: "#ffffff",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.10), 0 20px 50px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0",
          borderRight: "none",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 28px",
          borderBottom: "1px solid #e2e8f0",
          flexShrink: 0,
        }}>
          <div>
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: card.accent, textTransform: "uppercase", letterSpacing: "0.07em" }}>
              {card.subtitle}
            </span>
            <h2 style={{ margin: "3px 0 0", fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
              {card.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              flexShrink: 0, width: "34px", height: "34px", borderRadius: "8px",
              border: "1px solid #e2e8f0", background: "#f8fafc",
              cursor: "pointer", fontSize: "0.95rem", color: "#64748b", lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px" }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: "14px",
              overflow: "hidden",
              marginBottom: "24px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >
            <img
              src={card.image}
              alt={card.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
          {card.caseStudy?.map((section) => (
            <div key={section.heading} style={{ marginBottom: "24px" }}>
              <h3 style={{ margin: "0 0 8px", fontSize: "0.75rem", fontWeight: 700, color: card.accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {section.heading}
              </h3>
              {section.body && section.body.split("\n\n").map((p, i) => {
                const isCode = p.includes("{") && (p.includes("interface ") || p.includes("await supabase"))
                if (isCode) {
                  return (
                    <pre
                      key={i}
                      style={{
                        margin: "0 0 8px", padding: "14px 16px", borderRadius: "10px",
                        background: "#f8fafc", border: "1px solid #e2e8f0",
                        fontSize: "0.78rem", lineHeight: 1.6, color: "#334155",
                        fontFamily: "'SF Mono', 'Fira Code', monospace",
                        whiteSpace: "pre-wrap", overflowX: "auto",
                      }}
                    >
                      {p}
                    </pre>
                  )
                }
                return (
                  <p key={i} style={{ margin: "0 0 8px", fontSize: "0.90rem", lineHeight: 1.7, color: "#475569" }}>
                    {p}
                  </p>
                )
              })}
              {section.list && (
                <ul style={{ margin: "6px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "5px" }}>
                  {section.list.map((item) => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.88rem", color: "#334155", lineHeight: 1.55 }}>
                      <span style={{ flexShrink: 0, marginTop: "5px" }}><ArrowRight color={card.accent} /></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.flow && <StepFlow steps={section.flow} accent={card.accent} />}
              {section.columns && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "4px" }}>
                  {section.columns.map((col) => (
                    <div key={col.label}>
                      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: card.accent, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {col.label}
                      </span>
                      <div style={{ marginTop: "8px" }}>
                        <StepFlow steps={col.flow} accent={card.accent} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {section.features && (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginTop: "4px" }}>
                  {section.features.map((feature) => (
                    <div key={feature.title}>
                      <h4 style={{ margin: "0 0 6px", fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" }}>
                        {feature.title}
                      </h4>
                      {feature.body && (
                        <p style={{ margin: "0 0 6px", fontSize: "0.88rem", lineHeight: 1.6, color: "#475569" }}>
                          {feature.body}
                        </p>
                      )}
                      {feature.list && (
                        <ul style={{ margin: "4px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "4px" }}>
                          {feature.list.map((item) => (
                            <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.85rem", color: "#334155", lineHeight: 1.5 }}>
                              <span style={{ flexShrink: 0, marginTop: "4px" }}><ArrowRight color={card.accent} /></span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {feature.media && (
                        <div
                          style={{
                            marginTop: "8px", width: "100%", aspectRatio: "16 / 9", borderRadius: "10px",
                            border: `1px dashed ${card.accent}55`, background: `${card.accent}08`,
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            gap: "6px", padding: "10px", textAlign: "center",
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={card.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity={0.7}>
                            <rect x="3" y="5" width="18" height="14" rx="2" />
                            <circle cx="8.5" cy="10" r="1.5" />
                            <path d="M21 15l-5-5-9 9" />
                          </svg>
                          <span style={{ fontSize: "0.68rem", color: "#64748b", lineHeight: 1.4 }}>{feature.media}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {section.groups && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px", marginTop: "4px" }}>
                  {section.groups.map((group) => (
                    <div key={group.label} style={{ padding: "14px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: card.accent, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {group.label}
                      </span>
                      <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
                        {group.list.map((item) => (
                          <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "6px", fontSize: "0.82rem", color: "#334155", lineHeight: 1.45 }}>
                            <span style={{ flexShrink: 0, marginTop: "4px" }}><ArrowRight color={card.accent} /></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              {section.tech && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                  {section.tech.flatMap((group) => group.items).map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        padding: "6px 10px", borderRadius: "8px",
                        border: "1px solid #e2e8f0", background: "#f8fafc",
                      }}
                    >
                      <Icon icon={item.icon} width={16} height={16} />
                      <span style={{ fontSize: "0.8rem", color: "#334155", fontWeight: 500 }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
              {section.media && (
                <div
                  style={{
                    marginTop: "12px",
                    width: "100%",
                    aspectRatio: "16 / 9",
                    borderRadius: "12px",
                    border: `1px dashed ${card.accent}55`,
                    background: `${card.accent}08`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={card.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity={0.7}>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <circle cx="8.5" cy="10" r="1.5" />
                    <path d="M21 15l-5-5-9 9" />
                  </svg>
                  <span style={{ fontSize: "0.72rem", color: "#64748b", lineHeight: 1.4 }}>{section.media}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </>
  )

  return createPortal(<AnimatePresence>{panel}</AnimatePresence>, document.body)
}

export default function KynhoodBentoCards() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          width: "100%",
        }}
      >
        {CARDS.map((card, i) => (
          <CardFlip key={card.title} card={card} onReadMore={() => setOpenIndex(i)} />
        ))}
      </div>
      {openIndex !== null && (
        <CaseStudyPanel card={CARDS[openIndex]} onClose={() => setOpenIndex(null)} />
      )}
    </>
  )
}
