import { useState, useEffect, useRef, type CSSProperties } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Icon } from "@iconify/react"
import { useNavigate } from "react-router-dom"
import Lenis from "lenis"
import { FONTS } from "../theme"
import OtpInput from "./OtpInput"

const ACCESS_CODE = "786920"
import KynDsExplorer, {
  KynDsComponentsBrowser,
  KynDsColorTokens,
  KynDsTypeScale,
  KynDsSpacingRadius
} from "./KynDsExplorer"
import { NeighbourhoodColorTokens, NeighbourhoodTypeScale, NeighbourhoodSemanticTokens, NeighbourhoodSizeTokens, NeighbourhoodComponents } from "./NeighbourhoodExplorer"


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
  image?: { src: string; caption?: string }
}

interface ListGroup {
  label: string
  list: string[]
}

interface MetaItem {
  label: string
  value: string
  icon: string
}

interface CaseStudySection {
  heading: string
  body?: string
  list?: string[]
  painPoints?: string[]
  media?: string
  tech?: TechGroup[]
  flow?: string[]
  journey?: { label: string; substeps?: string[] }[]
  columns?: FlowColumn[]
  features?: FeatureItem[]
  groups?: ListGroup[]
  meta?: MetaItem[]
  quote?: string
  image?: { src: string; caption?: string }
  images?: { src: string; caption?: string }[]
  iframe?: { src: string; height?: number; caption?: string }
  figmaEmbed?: string
  custom?: "kyn-ds-explorer" | "kyn-ds-components" | "kyn-ds-colors" | "kyn-ds-typescale" | "kyn-ds-spacing" | "neighbourhood-colors" | "neighbourhood-type-scale" | "neighbourhood-semantic" | "neighbourhood-size" | "neighbourhood-components" | "notify-notifications" | "marina-ipl-photos" | "chase-event-videos"
  cta?: { label: string; href: string }
  code?: string
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
  span?: number
}

const CARDS: CardData[] = [
  {
    title: "Registration → Pre-booking → Booking",
    subtitle: "Launch-day traffic booking funnel",
    description: "I redesigned the event booking flow to handle launch-day traffic spikes, converting high-volume registration demand into committed bookings.",
    features: ["Free & paid registration options", "Refundable ₹100–₹200 commitment fee", "Phase windows organizers can configure in Titan", "Automatic phase switching + edge-case handling"],
    accent: "#3b82f6",
    icon: "📋",
    image: "/gallery/kynhood/kyn1.jpg",
    caseStudy: [
      {
        heading: "Registration → Pre-booking → Booking Funnel",
        body: "How I redesigned the event purchase journey to turn launch-day hype into bookings that actually stick.",
        meta: [
          { label: "Role", value: "1 PM and Myself", icon: "solar:user-id-bold" },
          { label: "Timeline", value: "3 Weeks (design + product 1 week)", icon: "solar:clock-circle-bold" },
          { label: "Platforms", value: "Android • iOS • Web • Organizer Portal • Titan CMS", icon: "solar:devices-bold" },
        ],
      },
      {
        heading: "The Story Behind It",
        body: "We had events on the platform ranging from single-day meetups to big multi-day festivals spread across locations and time slots.\n\nOne launch, in particular, changed how I thought about ticketing entirely.\n\nWhen tickets for U1 Shankar Raja's concert went live, the demand caught everyone off guard. About 12,000 people tried to book the moment sales opened, but only around 4,000 actually made it through before tickets ran out and the servers started struggling. That left close to 8,000 people who wanted a ticket and didn't get one — some priced out, some just lost to a slow, overloaded checkout.\n\nThe real issue wasn't that demand was too high.\n\nIt was that we had no way to tell the difference between someone ready to commit and someone just checking if tickets were still available. Both groups hit the system at the exact same time, in the exact same way.\n\nSo I started asking a different question:",
        quote: "Can we identify serious buyers before the actual ticket sale begins?",
        list: ["Manual, one-by-one approvals", "Inconsistent attendee quality", "A lot of operational overhead", "No single place to manage the workflow", "Conversions lost along the way"],
        image: {
          src: "/gallery/kyncaseimg/flow21.png",
          caption: "Timeline of the Shankar Raja event launch / Traffic spike graph / Booking conversion chart"
        },
      },
      {
        heading: "Business Thinking",
        body: "Instead of opening ticket sales straight away, we looked at adding a Registration Phase before bookings even started. Users would register first by paying a small commitment fee, usually somewhere between ₹100 and ₹200. It wasn't an extra cost — that amount would come back off the final ticket price later.\n\nThis one idea ended up solving a few problems at once.\n\nFor users, it meant:",
        list: ["A guaranteed spot before public booking opened", "Better odds of actually getting a ticket", "The registration amount adjusted fully at checkout", "A real read on genuine demand", "A way to separate casual browsers from serious buyers", "More accurate inventory forecasting"],
      },
      {
        heading: "Business Thinking — Revenue Example",
        body: "Even if some users never came back to finish their booking, the registration fees we'd already collected could help offset the event's marketing spend.\n\nSay 8,000 people registered at ₹100 each — that's ₹8 lakhs of committed revenue before bookings had even opened. Instead of that early traffic just disappearing, it turned into something the business could actually measure.",
      },
      {
        heading: "Designing the Registration Journey",
        body: "Registration couldn't be one-size-fits-all. Different kinds of events needed different attendee journeys, and whatever we built had to stay simple for organizers to actually run.\n\nSo we ended up with two models — Free Registration and Paid Registration — each solving a different need. Both eventually funnel into booking, just by different paths depending on whether money changed hands at registration.",
      },
      {
        heading: "Free Registration",
        body: "Free Registration was for events where organizers wanted to hand-pick who got in before bookings opened.\n\nSince no money changed hands at this stage, organizers could review questionnaire answers and approve or reject people freely — no refunds to worry about, no payment disputes.\n\nIt worked well for workshops, networking events, invite-only communities, and anything with a tight capacity limit.",
        flow: ["Register", "Fill Questionnaire (Optional)", "Await Approval", "Approved", "Pre-booking / Booking Opens", "Book Tickets"],
      },
      {
        heading: "Free Registration — Organizer Config",
        body: "Organizers could configure:",
        list: ["Registration open and close dates", "Custom registration questionnaires", "Approval or rejection workflow", "Registration capacity limits", "Automatic move into Pre-booking or Booking"],
      },
      {
        heading: "Paid Registration",
        body: "Paid Registration was going after a different problem.\n\nInstead of just collecting sign-ups, it asked users for a small commitment fee upfront — typically ₹100 to ₹200 — which later got redeemed against the final ticket price.\n\nWe actually considered adding an approval step here too, but that would've meant refunding rejected users, and the platform didn't support automated refunds yet. So we made a call: no approvals for paid registration. Anyone who paid moved straight into the next phase.\n\nIt wasn't the most elegant solution, but it kept things operationally simple and avoided a messy edge case for both organizers and attendees.",
        flow: ["Register", "Fill Questionnaire", "Pay Registration Fee", "Registration Confirmed", "Wait for Pre-booking", "Redeem Registration Amount", "Book Tickets"],
      },
      {
        heading: "Paid Registration — Benefits",
        body: "Paid Registration allowed organizers to:",
        list: ["Collect genuinely committed attendees before bookings opened", "Forecast demand with more confidence", "Cut down on casual, low-intent registrations", "Redeem the registration amount right at checkout", "Move users into the next phase automatically"],
        images: [
          { src: "/gallery/kyncaseimg/flow20.png", caption: "Event Registration Process" },
          { src: "/gallery/kyncaseimg/flow22.png", caption: "Event Booking Process" },
        ],
      },
      {
        heading: "A New Event Lifecycle",
        body: "Rather than just bolting on another ticket type, I proposed a new event lifecycle altogether.\n\nThe old flow was simple:",
        flow: ["Listing", "Booking", "Confirmation"],
      },
      {
        heading: "A New Event Lifecycle — The Journey Became",
        flow: ["Registration", "Pre-booking", "Booking", "Event"],
      },
      {
        heading: "A New Event Lifecycle — Organizer Choice",
        body: "This gave organizers real control over how their event actually ran.\n\nWhen setting up an event, they could now pick between Direct Booking or Registration First. Choosing Registration First unlocked a set of extra configuration options:",
        list: ["Free or Paid Registration", "Registration fee", "Registration window", "Pre-booking schedule", "Booking release schedule", "Questionnaires", "Approval flow"],
      },
      {
        heading: "A New Event Lifecycle — Titan Configuration",
        body: "Every phase could be configured on its own through Titan, without needing engineering or admin-panel support.",
      },
      {
        heading: "Designing for Organizers and Attendees",
        body: "This wasn't only a user-facing feature — it changed how organizers ran their events too. On the attendee side, though, we kept things deliberately simple.",
        flow: ["Register", "Fill Questionnaire", "Pay Registration Fee", "Wait for Booking", "Receive Notification", "Redeem Registration Amount", "Book Tickets"],
        image: {
          src: "/gallery/kyncaseimg/flow24.jpg",
          caption: "Titan (admin panel) — Event Configuration / Dates & Schedule"
        },
      },
      {
        heading: "Designing for Organizers and Attendees — Organizer Powers",
        body: "For organizers, this opened up a lot more control. They could now:",
        list: ["Configure registration dates", "Configure booking dates", "Limit registrations", "Build custom questionnaires", "Collect uploads", "Approve or reject attendees", "Automatically transition between phases", "View registration analytics"],
      },
      
      {
        heading: "Solving Edge Cases",
        body: "Adding multiple event phases meant dealing with a long tail of edge cases. A few worth calling out:\n\nRegistration validation — a user could only register once. Duplicate attempts got blocked with a clear message instead of silently failing.\n\nCapacity protection — registration count could never exceed available inventory, so we never oversold before bookings even opened.\n\nAutomatic phase transitions — organizers didn't have to manually flip a switch. Titan moved events from Registration to Pre-booking to Booking on its own, based on the dates they'd configured.\n\nRedemption logic — when a registered user finally booked, their registration fee showed up automatically as a green deduction in the price breakup. Platform fees and GST stayed untouched.\n\nAnd for every milestone that mattered, users got notified through:",
        list: ["Push", "In-app inbox", "WhatsApp"],
      },
      {
        heading: "Outcome & Reflection",
        body: "What started as a fix for one chaotic launch became a fully configurable event lifecycle — Registration, Pre-booking, Booking, and Event — reusable across concerts, workshops, conferences, and invite-only formats, with Titan handling phase transitions automatically so nobody missed their booking window.\n\nFor organizers, that meant real controls: registration windows, fees, capacity, questionnaires, locations, and ticket limits, no engineering support needed. For the business, registration became a way to measure demand, forecast inventory, and improve conversion before tickets even went on sale.\n\nFor me, it was the first time I designed around a business outcome instead of a set of screens — asking how to capture demand before booking even starts, not just how users buy tickets.\n\nFree Registration curated attendees through approvals; Paid Registration converted interest into commitment with a redeemable fee. Both paths met back at the same booking journey — consistent for users, flexible for organizers.",
      },
    ],
  },
  {
    title: "Chase & Cheer",
    subtitle: "Live multiplayer cricket quiz",
    description: "A real-time multiplayer cricket quiz app with live emcee control, concurrent phone gameplay, and a real-time leaderboard.",
    features: ["One shared game state for everyone", "Admin dashboard the emcee fully controlled", "Live leaderboard + Rethink Mode", "150+ people playing at once"],
    accent: "#3b82f6",
    icon: "🏏",
    image: "/gallery/kyncaseimg/chase_and_cheer_cover.png",
    span: 1,
    caseStudy: [
      {
        heading: "Overview",
        body: "Kyn partners with brands, malls, pubs, and event organizers to build interactive experiences around live events.\n\nWe'd already run one of these, Chase & Cheer, with partners like Jyke & Hydell and a few other venues. It worked — turns out a live game genuinely pulls people into a cricket screening instead of letting them zone out in the background.\n\nWhen Marina Mall signed on for their IPL screening, the business wanted something new this time, not a repeat of Chase & Cheer but a fresh format entirely.\n\nI got pulled in to build it — same spirit, same idea behind it, just a different experience for people at the screening.\n\nWhat I ended up shipping, as a side project, was a real-time multiplayer cricket quiz. An emcee ran the whole thing while hundreds of people played along from their phones, competing live on a shared leaderboard.\n\nOn the night it held up past 150 people playing at once, and kept the crowd engaged right to the end of the screening.",
        meta: [
          { label: "Role", value: "Product Designer • Solo Builder", icon: "solar:user-id-bold" },
          { label: "Timeline", value: "3 Days", icon: "solar:clock-circle-bold" },
          { label: "Platforms", value: "Mobile Web • Web (Lovable)", icon: "solar:devices-bold" },
        ],
        custom: "marina-ipl-photos",
      },
      {
        heading: "Business Requirement",
        body: "The goal was never to replace Chase & Cheer — that had already proven itself at multiple venues.\n\nWhat the business actually needed was another format to pull out for future partnerships and big screenings. The brief was pretty open, but a few things weren't negotiable. Whatever I built had to:",
        image: {
          src: "/gallery/flow3.png",
          caption: "Chase & Cheer — non-negotiable requirements"
        },
      },
      {
        heading: "My Approach",
        body: "I didn't want players clicking through their own private quiz — that felt more like a form than a live event. So the whole platform was built around one shared game state instead.\n\nEvery participant sees the exact same screen at the exact same moment. The second the emcee starts a question:",
        list: ["It lands on everyone's screen at once", "The countdown starts for everyone at once", "Answers lock for everyone at once", "Results reveal for everyone at once", "The leaderboard refreshes for everyone at once"],
      },
      {
        heading: "User Journey",
        columns: [
          { label: "Player", flow: ["Scan QR Code", "Enter Name, Mobile Number & Email", "Wait for Quiz to Start", "Get Ready Countdown", "Answer Question", "Waiting for Reveal", "View Result", "Live Leaderboard", "Next Question"] },
          { label: "Emcee / Admin", flow: ["Login", "Select Saved Quiz", "Start Question", "Monitor Live Responses", "Reveal Correct Answer", "Display Leaderboard", "Repeat Until Event Ends"] },
        ],
        image: {
          src: "/gallery/kyncaseimg/chase_cheer_flow.png",
          caption: "Player mobile flow (left) + Admin dashboard control center (right)"
        },
      },
      {
        heading: "Tech Stack",
        body: "Nothing exotic here — a pretty standard modern real-time web stack, chosen for how fast I could build with it, not for novelty.",
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
        body: "Realtime sync was the whole point of the game, so the architecture was built around it from day one.",
        flow: ["Players", "Supabase Realtime", "Shared Game State", "Admin Dashboard", "Score Engine", "Leaderboard"],
      },
      {
        heading: "Features I Built",
        features: [
          {
            title: "Live Multiplayer Gameplay",
            body: "No app to install — players just jumped in from their phones. Once the emcee hit start, everyone was in it together, live.",
            image: {
              src: "/gallery/kyncaseimg/chase_cheer_gameplay.png",
              caption: "Live gameplay — player answering questions on mobile"
            },
          },
          {
            title: "Admin Dashboard",
            body: "This is where the emcee actually ran the show:",
            list: ["Start questions", "Lock and unlock questions", "Reveal answers", "Monitor participant count", "View live responses", "End the quiz"],
          },
          {
            title: "Multiple Question Types",
            body: "I didn't want it to feel like the same multiple-choice question on repeat, so I mixed in numeric predictions, image-based questions, and team picks, each with its own scoring logic.",
          },
          {
            title: "Live Leaderboard",
            body: "Scores recalculated right after every question and updated for everyone at the same time. People genuinely stuck around just to watch their rank move.",
            image: {
              src: "/gallery/kyncaseimg/chase_cheer_leaderboard.png",
              caption: "Live leaderboard — All-Time rankings updating in real-time"
            },
          },
          {
            title: "Rethink Mode",
            body: "Some questions got flagged as Rethink Questions — players got a second shot at them later on, with points scaled to how many attempts they got right. Honestly ended up being one of the more fun mechanics in the whole thing.",
          },
          {
            title: "Quiz Sessions",
            body: "Organizers could save a full quiz and reload it for the next event instead of rebuilding it from scratch — that's what makes the whole thing reusable.",
          },
        ],
      },
      {
        heading: "Real-Time Synchronization",
        body: "Keeping everyone in sync was honestly the hardest part of building this.\n\nEvery time the admin changed something — a new question, the timer, a reveal — it had to hit every connected phone at basically the same instant, no refresh required. All of that ran through Supabase Realtime subscriptions.\n\nInstead of juggling local state per device, I kept one shared piece of state that everyone read from:\n\ninterface GameState {\n  activeQuestion: string | null\n  status: \"waiting\" | \"active\" | \"ended\"\n  isLocked: boolean\n  correctAnswerRevealed: boolean\n}\n\nWhen the emcee hit Start Question, this is what fired:\n\nawait supabase\n  .from(\"game_state\")\n  .update({\n    active_question: question.id,\n    status: \"active\"\n  })\n\nThat update reached every player almost instantly. Answers got saved the same way, independently per player:\n\nawait supabase\n  .from(\"responses\")\n  .insert({\n    participant_id,\n    question_id,\n    answer\n  })\n\nAnd scoring only ran once the admin revealed the correct answer, never before.",
      },
      {
        heading: "Event Outcome",
        body: "This ran live at Marina Mall's IPL screening. Here's roughly how the night went:",
        list: [
          "150+ people stayed connected at the same time",
          "The app held up the whole night, running until around 11 PM",
          "The emcee could watch participant counts and responses live from the dashboard",
          "Leaderboards updated instantly after every question",
          "People stayed engaged between overs instead of just watching the screen",
          "Sponsors got repeated visibility through branded questions and interactions",
        ],
        custom: "chase-event-videos",
      },
      {
        heading: "Business Impact",
        groups: [
          { label: "For Participants", list: ["An interactive match-day experience", "Live competition against other fans", "Instant feedback after every question", "Real-time rankings"] },
          { label: "For Event Hosts", list: ["Simple, easy-to-use admin controls", "Live participation metrics", "Quiz sessions they could reuse", "Better crowd engagement overall"] },
          { label: "For Sponsors", list: ["More brand exposure", "Real audience interaction", "Sponsor-integrated questions and branding opportunities"] },
        ],
      },
      {
        heading: "My Contribution",
        body: "Built the whole MVP myself, start to finish.\n\nI used Claude as a coding assistant to move faster, and it wrote a good chunk of the actual code, but the product thinking, the architecture, the data model, and the realtime sync strategy were all mine to work out.",
      },
      {
        heading: "Reflection",
        body: "What this taught me: good audience engagement isn't really about clever questions, it's about making people feel like they're in it together. Once the gameplay, scoring, and leaderboard were all in sync, the quiz stopped feeling like a side activity and started feeling like part of the match itself. And it's a good reminder that a scrappy MVP, built fast, can still hold up with 150+ people playing live at once.",
      },
    ],
  },
  {
    title: "Notify",
    subtitle: "Notification-driven inventory sync",
    description: "A proof of concept using Android notifications as an integration layer to synchronize booking inventory in real-time.",
    features: ["Android notification listener", "A deterministic booking parser", "Automatic slot blocking via API", "Built in 2 days, with Claude's help"],
    accent: "#3b82f6",
    icon: "◈",
    image: "/gallery/pics/Video_1.mp4",
    span: 1,
    caseStudy: [
      {
        heading: "Overview",
        body: "While working on Kyn, we were exploring ways to solve one of the bigger problems in venue booking — inventory sync.\n\nUnlike airlines or cinemas, sports turfs and activity centers don't share a common inventory protocol. Most venue owners list the same slot across several booking platforms, and none of those platforms expose APIs that would let inventory stay in sync.\n\nThe long-term vision was something like ONDC for slot-based venues — a shared inventory layer any booking platform could plug into. But that needs buy-in from big industry players, which makes it a long game, not something we could ship soon.\n\nAs a short-term experiment, I was asked to look at whether we could automate inventory updates without needing any APIs at all.\n\nIn two days, I had a working proof of concept that used Android notifications as the integration layer instead.\n\nIt was only a demo, but it proved the core idea: notifications could be turned into real-time inventory events.",
        meta: [
          { label: "Role", value: "Product Designer • Solo Builder", icon: "solar:user-id-bold" },
          { label: "Timeline", value: "2 Days", icon: "solar:clock-circle-bold" },
          { label: "Platforms", value: "Android • Admin Web • Claude Code", icon: "solar:devices-bold" },
        ],
      },
      {
        heading: "Background",
        body: "Whenever a booking happens on platforms like TurfTown or District, venue managers get a confirmation notification on their phone right away.\n\nThat got me thinking — if the booking info is already showing up in a notification, do we actually need an API integration at all?\n\nMaybe instead of integrating with the booking platforms directly, we could just integrate with the notifications they were already sending.\n\nThat one idea became the entire MVP.",
        custom: "notify-notifications",
      },
      {
        heading: "Why We Didn't Build APIs",
        body: "The original vision was a lot bigger than this.\n\nWe wanted a unified inventory protocol for slot-based venues, similar to how cinema chains keep seat availability in sync across different ticketing platforms.\n\nBut that only works if multiple big players agree to participate. And since no shared protocol existed, and competitors had zero incentive to open up their APIs, we needed a different way to test the idea.\n\nThis notification-based approach was built to answer one question:\n\nCan we sync inventory automatically without needing any cooperation from other platforms at all?",
      },
      {
        heading: "The Business Problem",
        body: "One of our venue partners, VGP Turf Arena, had their inventory listed across multiple platforms, including TurfTown and District.\n\nSo if someone booked a slot on one platform, staff had to go and manually block that same slot inside Kyn. Miss that step even once, and you've got a double booking.\n\nThe workflow looked something like this:",
        image: {
          src: "/gallery/flow1.png",
          caption: "The manual venue booking process — before automation"
        },
      },
      {
        heading: "My Goal",
        body: "Simple as it was, this whole workflow depended on someone remembering to do every step, every time. So the goal became building a lightweight Android app that could:",
        list: [
          "Read booking notifications as they came in",
          "Make sense of the booking details inside them",
          "Identify the venue, date, and slot",
          "Call the Kyn APIs automatically",
          "Close out inventory without anyone touching it",
        ],
      },
      {
        heading: "The Real Objective",
        body: "The point was never to ship a polished product. It was to find out whether notifications could genuinely work as an integration layer.",
      },
      {
        heading: "Tech Stack",
        body: "Since this was an exploration project, I optimized for speed over polish. The whole thing came together in about two days, using Claude to help prototype the architecture and implementation quickly. Here's the stack:",
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
        heading: "How It Worked",
        body: "Onboarding was kept deliberately simple.\n\nOnce the APK was installed, the venue manager granted Notification Access on Android, then picked which apps should be monitored. For the demo I set it to WhatsApp and Gmail.\n\nI also manually registered the phone number and email address whose notifications should get parsed, so only booking confirmations from trusted sources ever got processed.",
        image: {
          src: "/gallery/kyncaseimg/kyn_onboarding.png",
          caption: "Notification Hub app — requesting notification access permission"
        },
      },
      {
        heading: "The Demo Flow",
        body: "Once setup was done, here's what the flow looked like.\n\nA booking confirmation came in through WhatsApp or Gmail, with details like the venue, date, time, and confirmation status.",
        image: {
          src: "/gallery/flow2.png",
          caption: "Notification caught → parsed → synced to Kyn automatically"
        },
      },
      {
        heading: "Parser logic — notification text to structured payload",
        body: "The core parser converts raw, unstructured notification strings into clean, structured booking payloads. First, it normalizes text by stripping ordinal date suffixes (like '12th' to '12') to ensure matching stability. Next, it uses regex patterns to extract the booking date, time slots, locations, and ticket counts. Finally, it converts the extracted values into a standardized ISO date format and identifies if the booking is confirmed or cancelled.",
        code: `class BookingMessageParser {
    fun parse(message: String): ParsedBooking? {
        val normalised = message.replace(Regex("""(\\d{1,2})(st|nd|rd|th)\\b""", RegexOption.IGNORE_CASE), "$1")

        val status = detectStatus(normalised) ?: return null
        val dateMatch = datePattern.find(normalised) ?: return null
        val date = toIsoDate(dateMatch) ?: return null
        val slot = extractTime(normalised, dateMatch.range.last) ?: return null
        val location = extractLocation(normalised, dateMatch.range.first)
        val ticketCount = extractTicketCount(normalised)
        
        return ParsedBooking(location, date, slot, status, ticketCount)
    }

    private fun detectStatus(message: String): BookingStatus? {
        val lower = message.lowercase()
        return when {
            lower.containsAny("confirmed", "booking confirmed", "sold out", "soldout") -> BookingStatus.CONFIRMED
            lower.containsAny("cancelled", "canceled", "cancellation", "restore") -> BookingStatus.CANCELLED
            else -> null
        }
    }
}`,
      },
      {
        heading: "Challenges",
        body: "Once that data was validated, the parser converted it into a structured API payload.\n\nThe hard part was never really the Kotlin code. It was figuring out how to pull reliable, structured info out of completely unstructured notification text.\n\nEvery platform formats its confirmations differently, so the parser had to stay flexible without becoming unpredictable.\n\nOn top of that, I had to make sure the app only ever touched booking notifications and ignored everything else, which meant app-level filtering plus sender-level validation.",
      },
      {
        heading: "Pitching the Idea",
        body: "Once the prototype was working, we showed it to one of our organizer partners.\n\nGoing in, we figured this could be a ₹500/month add-on feature at best.\n\nThe conversation went somewhere different.\n\nThe organizer explained that whenever double bookings happened, they'd usually deal with it manually — by either:",
        list: ["Offering another slot", "Giving customers a 50% discount", "Refunding part of the booking"],
      },
      {
        heading: "The Pricing Shift",
        body: "Their existing process worked, technically, but it ate up operational time and hurt the customer experience.\n\nThe moment we showed automatic inventory sync, they got it immediately.\n\nWhat surprised us was they said they'd happily pay around ₹5,000 a month for something reliable, because preventing even a handful of double bookings a month would save them way more than that.\n\nThat one conversation completely changed how we thought about pricing this.",
      },
      {
        heading: "Key Learnings",
        body: "This project taught me that validating a business idea doesn't need months of development.\n\nSometimes a small, working prototype is enough to start a real conversation with a customer.\n\nOn the technical side, I learned how far Android's Notification Listener framework can be stretched beyond what it was built for, and how you can get event-driven architecture without any direct platform integration.\n\nBut the bigger product lesson was understanding the difference between solving a technical problem and solving an operational one.\n\nThe organizer wasn't really buying a notification parser.\n\nThey were buying peace of mind.",
      },
      {
        heading: "What's Next?",
        body: "This MVP did what it needed to do, but it was never meant to be the final answer.\n\nThe bigger vision is still the same one — a dedicated inventory layer for slot-based venues that plugs directly into multiple booking platforms, closer to how centralized inventory works in cinema or hospitality.\n\nWhat this prototype actually proved is that the problem was worth solving, and that people were genuinely willing to pay for a better fix.\n\nAnd it did all that in two days — enough to validate both the technical feasibility and the commercial case for notification-driven inventory sync.",
      },
    ],
  },
  {
    title: "Partial Payments",
    subtitle: "Reservation-based ticket payments",
    description: "A payment feature allowing users to reserve premium event tickets with a percentage deposit, reducing checkout drop-offs.",
    features: ["Configurable 25/50/75% payment splits", "A new \"Reservation Confirmed\" booking state", "QR ticket withheld until balance is cleared", "Reminders across push, inbox, and WhatsApp"],
    accent: "#3b82f6",
    icon: "💳",
    image: "/gallery/kyncaseimg/flow19.jpg",
    caseStudy: [
      {
        heading: "Designing Partial Payments for Event Ticketing",
        body: "Cutting payment friction for users while still protecting inventory, through a configurable reservation payment system.",
        meta: [
          { label: "Role", value: "Product Designer (100%) • Product Thinking (50%)", icon: "solar:user-id-bold" },
          { label: "Timeline", value: "4 Weeks", icon: "solar:clock-circle-bold" },
          { label: "Platforms", value: "Android • iOS • Mobile Web • Organizer Portal • Titan CMS", icon: "solar:devices-bold" },
        ],
      },
      {
        heading: "Background",
        body: "As Kyn started hosting bigger ticketed events, we kept seeing users hesitate at the full ticket price, especially for premium events. A lot of them clearly wanted to attend, but that upfront payment was enough of a barrier to stop them from finishing the booking.\n\nFrom the organizer's side, this was real demand going to waste. Without payment, there was no reliable way to hold inventory for these users.\n\nWhich led to a fairly simple question:",
        quote: "Can users reserve their spot by paying only a part of the ticket price today and complete the remaining payment later?",
        image: {
          src: "/gallery/kyncaseimg/flow14.png",
          caption: "Existing booking flow / User journey"
        },
      },
      {
        heading: "The Solution",
        body: "We built a configurable Partial Payment system that let users reserve a ticket by paying just a percentage of the total price.\n\nThe supported splits were:",
        list: ["25% Now • 75% Later", "50% Now • 50% Later", "75% Now • 25% Later"],
      },
      {
        heading: "Designing the Reservation Journey",
        body: "Instead of treating a partially paid booking as fully confirmed, we introduced a new state for it: Reservation Confirmed.",
        image: {
          src: "/gallery/kyncaseimg/flow15.png",
          caption: "Reservation Journey Flow"
        },
      },
      {
        heading: "Designing the Reservation Journey — What Users See",
        body: "As soon as the reservation payment went through, users could see:",
        list: ["Amount paid", "Remaining balance", "Payment deadline", "Forfeit terms", "Booking details", "Complete Payment CTA"],
      },
      {
        heading: "Designing the Reservation Journey — Reachability",
        body: "The Complete Payment CTA was reachable from My Bookings, the Event Detail Page, the Notification Inbox, and the WhatsApp reminders themselves — wherever the user happened to land.\n\nTo prevent misuse, only an invoice was downloadable after the reservation payment. The actual QR ticket only got generated once the remaining balance was paid.",
        image: {
          src: "/gallery/kyncaseimg/flow16.jpg",
          caption: "User flow / Checkout screens / Reservation confirmation"
        },
      },
      {
        heading: "Product Decisions & System Design",
        body: "Partial payments ended up touching the whole booking lifecycle, not just the checkout screen.",
        groups: [
          { label: "New Booking State", list: ["After the initial payment, a booking moved into an In Progress state instead of Confirmed.", "That made it clear to everyone that the ticket was reserved, not yet fully secured."] },
          { label: "QR Generation", list: ["The QR code was held back on purpose, until the remaining balance was cleared.", "That kept users from walking into an event on a reservation alone, while still letting them download an invoice for reference."] },
          { label: "Configurable Deadlines", list: ["Organizers set their own payment cut-off dates for each event, right inside Titan.", "Miss the deadline, and the reservation expired automatically — inventory went back into stock, and refund or forfeiture followed whatever policy the organizer had configured."] },
          { label: "Reminder Strategy", list: ["Reminders went out automatically across push, in-app inbox, and WhatsApp.", "First one landed 24 hours after the reservation payment, then every 24 hours until the deadline, with one final nudge a day before it expired."] },
        ],
      },
      {
        heading: "Organizer Controls",
        body: "The whole thing was built to be fully configurable by organizers, no engineering support needed. They could set:",
        list: ["Partial payment availability", "Supported split percentages", "Eligible ticket types", "Payment deadlines", "Refund or forfeiture rules"],
        image: {
          src: "/gallery/kyncaseimg/flow17.jpg",
          caption: "Titan configuration / Analytics dashboard"
        },
      },
      {
        heading: "Organizer Controls — Visibility",
        body: "The dashboard also showed how many users had opted into partial payments, so organizers could keep an eye on pending revenue and reservation demand.",
      },
      {
        heading: "Edge Cases & Business Rules",
        body: "A handful of business rules kept inventory protected and stopped the system from being gamed.",
        list: [
          "A user could only have one active reservation transaction going at a time.",
          "Cross-booking with reservation tickets wasn't allowed.",
          "You could still buy multiple tickets within a single reservation, though.",
          "Expired reservations released their inventory back into stock automatically.",
          "Reservation tickets played by the same inventory rules as regular ones, including the \"last 10/5 tickets left\" behaviour.",
          "Booking exports carried reservation-specific data too — percentage, amount, platform fee, GST, and status — for operational reporting.",
        ],
        image: {
          src: "/gallery/kyncaseimg/flow18.jpg",
          caption: "Error states"
        },
      },
      {
        heading: "Outcome",
        body: "This landed as a new reservation-based booking model that balanced flexibility for users against inventory protection for organizers.\n\nUsers could lock in a ticket with a smaller upfront payment, and organizers got a configurable system to manage reservation payments, deadlines, inventory, and pending revenue.\n\nIt ended up being more than a checkout redesign — a new booking state, notification flows, inventory rules, payment reminders, and organizer controls, all built to be reusable across premium concerts, workshops, and large ticketed events.",
        journey: [
          { label: "Events Listing" },
          { label: "Event Detail Page", substeps: ["View Event Details", "View Venue", "View Available Dates", "View Time Slots", "Terms & Conditions", "FAQ"] },
          { label: "Select Location" },
          { label: "Select Date" },
          { label: "Select Time Slot" },
          { label: "Select Ticket(s)", substeps: ["Choose Ticket Type", "Adjust Quantity", "View Remaining Availability"] },
          { label: "Price Breakup", substeps: ["Ticket Summary", "Discounts Applied", "Platform Fee & GST", "User Details", "Total Payable"] },
          { label: "Complete Payment" },
          { label: "Booking Processing" },
          { label: "Booking Confirmed", substeps: ["Booking ID", "Event Details", "Ticket Summary", "Download Ticket"] },
          { label: "View QR Ticket" },
          { label: "Show QR at Venue" },
          { label: "QR Validated" },
          { label: "Event Entry" },
        ],
      },
      {
        heading: "Reflection",
        body: "This project taught me that a payment experience is never just the payment screen.\n\nDesigning partial payments meant rethinking booking states, inventory management, reminders, ticket validation, and organizer workflows as one connected system. The real question stopped being \"how do users pay less today\" and became \"how do we give users flexibility without organizers losing confidence in their inventory.\"\n\nThat shift is what turned a simple payment option into a full reservation management system.",
      },
    ],
  },
  {
    title: "QR Validation & Live Attendance",
    subtitle: "Scalable multi-gate QR validation",
    description: "A multi-gate, multi-location QR validation system and operations dashboard with live attendance analytics.",
    features: ["Context-aware validation (date, slot, venue, ticket type)", "Volunteer access with revocable permissions", "Live attendance analytics inside the scanner", "Location, date, and slot filters"],
    accent: "#3b82f6",
    icon: "📷",
    image: "/gallery/kyncaseimg/cover22.jpg",
    caseStudy: [
      {
        heading: "QR Validation & Live Attendance Management",
        body: "Designing a scalable QR validation system for multi-day, multi-location events with real-time attendance insights.",
        meta: [
          { label: "Role", value: "Product Designer (100%) • Product Strategy (50%)", icon: "solar:user-id-bold" },
          { label: "Timeline", value: "6-8 Weeks", icon: "solar:clock-circle-bold" },
          { label: "Platforms", value: "Android • iOS • Mobile Web • Organizer Portal • Titan CMS", icon: "solar:devices-bold" },
        ],
      },
      {
        heading: "Background",
        body: "As Kyn started onboarding larger events, ticket validation at the gate became a real operational gap — there was no QR validation system in place at all yet. Organizers were hosting events spread across multiple locations, multiple dates, and several time slots, with thousands of attendees needing to be checked in quickly at different entry points.\n\nThis wasn't a case of scaling something that already existed. We were starting from a blank slate, building the entire system purely off business requirements gathered directly from organizers who needed a fast, reliable way to validate tickets and track attendance in real time.",
        image: {
          src: "/gallery/flow11.png",
          caption: "Event operations / Organizer requirements / User journey"
        },
      },
      {
        heading: "Understanding the Problem",
        body: "Through discussions with event organizers, we identified four major operational challenges:",
        painPoints: [
          "A single organizer couldn't handle ticket validation at multiple gates.",
          "Volunteers had to share organizer credentials, creating security risks.",
          "There was no live visibility into bookings, attendance, or ticket consumption while the event was running.",
          "QR validation had to consider the correct location, event date, and time slot to prevent invalid check-ins.",
        ],
        quote: "The challenge wasn't just building a QR scanner — it was creating a complete event operations tool, from scratch, based entirely on what organizers actually needed.",
      },
      {
        heading: "Solution",
        body: "We redesigned the QR validation experience into a dedicated Manage Event module inside Titan, Kyn's organizer admin panel.\n\nThe new experience combined:",
        list: ["QR scanning", "Volunteer management", "Live attendance analytics", "Multi-location filtering", "Slot-based validation", "Booking exports"],
      },
      {
        heading: "Key Features & Product Decisions",
        body: "Instead of just \"I built QR validation,\" here's why each feature exists and what business problem it solves.",
      },
      {
        heading: "Manage Event — A Single Operational Dashboard",
        body: "Originally, organizers only had a Booking Details button in Titan that exported attendee information. Once the event started, they had to switch between different screens to monitor attendance, scan QR codes, and check booking counts.\n\nTo simplify operations, I introduced a dedicated Manage Event module within Titan. Instead of acting as another page, it became the operational hub for organizers before and during the event.\n\nIt brought together:",
        list: ["Live attendance statistics", "QR validation", "Booking exports", "Volunteer management", "Ticket analytics"],
        quote: "This reduced navigation during live events, where every second matters.",
        image: {
          src: "/gallery/kyncaseimg/flow5.png",
          caption: "Manage Event Dashboard (Titan)"
        },
      },
      {
        heading: "QR Validation Built Around Event Context",
        body: "Scanning a QR code wasn't enough because a single event could contain multiple venues, dates, and time slots.\n\nThe validator first verifies whether the attendee is arriving at the correct location, event date, time slot, and ticket, before allowing entry.\n\nInstead of displaying a generic \"Invalid QR,\" the scanner explains exactly why validation failed. Examples include:",
        list: ["Wrong venue", "Wrong event date", "Too early for entry", "Ticket already scanned", "Invalid ticket"],
        quote: "This helps volunteers resolve issues immediately without calling organizers.",
        image: {
          src: "/gallery/kyncaseimg/flow6.jpg",
          caption: "QR Scanner / Success & Error States"
        },
      },
      {
        heading: "Why Multiple Tickets Appear After Scanning",
        body: "One attendee can purchase multiple ticket types under a single booking — for example, a booking with 2 Gold tickets, 2 VIP tickets, and 1 parking pass.\n\nAlthough all of them belong to one booking, each ticket represents a different QR validation record. When the QR is scanned, the system first identifies every valid ticket linked to that booking.\n\nIf multiple tickets are available, a bottom sheet appears showing:",
        list: ["Ticket type", "Event date", "Time slot", "Venue"],
        quote: "The organizer or volunteer selects which ticket is entering. If only one ticket exists, the system skips this screen entirely for a faster experience — this prevents accidentally validating the wrong ticket while keeping the scan flow efficient.",
        image: {
          src: "/gallery/kyncaseimg/flow7.jpg",
          caption: "Ticket Selection Bottom Sheet"
        },
      },
      {
        heading: "Volunteer QR Validation",
        body: "Large events often have several entry gates. Relying on one organizer to scan every attendee creates long queues and delays.\n\nInstead of sharing organizer credentials, I designed a volunteer access system. Organizers can:",
        list: ["Enable volunteer scanning.", "Invite volunteers using their mobile number.", "View volunteer history.", "Revoke access at any time."],
        quote: "Volunteers log in using their own accounts and receive access only to the Validate QR feature. This role-based permission keeps administrative controls secure while allowing multiple people to scan simultaneously. Even if access is revoked during scanning, the current validation completes before the volunteer is logged out, preventing attendee disruptions.",
        image: {
          src: "/gallery/kyncaseimg/flow8.jpg",
          caption: "Volunteer Flow"
        },
      },
      {
        heading: "Live Attendance Dashboard",
        body: "Organizers constantly ask questions during an event — how many people have entered, which slot is filling up, how many VIP tickets are still pending.\n\nInstead of forcing them to export spreadsheets, I surfaced live attendance metrics directly inside the validator. The dashboard displays:",
        list: ["Total Bookings", "Total Tickets", "Scanned Count", "Ticket-wise attendance", "Booking Details"],
        quote: "These numbers update based on the selected filters, allowing organizers to monitor the event without leaving the scanning experience.",
        image: {
          src: "/gallery/kyncaseimg/flow9.jpg",
          caption: "Analytics Screen"
        },
      },
      {
        heading: "Booking Date Analytics",
        body: "This view groups bookings by the day they were purchased, so organizers can see how ticket sales progressed over time — for example, 145 bookings on Dec 2, 372 on Dec 3, 218 on Dec 4.\n\nThis helps organizers understand booking trends:",
        list: ["Which marketing campaign generated the most bookings?", "Which day saw the highest demand?", "When did ticket sales slow down?"],
        image: {
          src: "/gallery/kyncaseimg/flow10.jpg",
          caption: "Booking Analytics"
        },
      },
      {
        heading: "Ticket Type Analytics",
        body: "Not every ticket category performs equally. Organizers often create multiple ticket tiers such as VIP, Gold, Silver, Student, and Early Bird.\n\nThe analytics screen breaks attendance down by ticket type. For every category, organizers can view total tickets sold, tickets scanned, and remaining attendees — for example, VIP 85/100 scanned, Gold 240/300, Silver 420/500.",
        quote: "This helps organizers understand which audience segments have already arrived and which are still expected.",
        image: {
          src: "/gallery/kyncaseimg/flow11.jpg",
          caption: "Ticket Breakdown"
        },
      },
      {
        heading: "Location, Date & Time Filters",
        body: "Events are no longer limited to one venue. A single event may have multiple locations, multiple dates, and several sessions each day. Showing only overall statistics makes operational decisions difficult.\n\nI introduced contextual filters that allow organizers to narrow analytics by:",
        list: ["Location", "Event Date", "Time Slot"],
        quote: "An All option always displays aggregate event data, while selected filters instantly update every metric on the page — giving organizers both a high-level overview and detailed operational visibility.",
        image: {
          src: "/gallery/kyncaseimg/Flow12.jpg",
          caption: "Filter Chips"
        },
      },
      {
        heading: "Refresh Without Interrupting Scanning",
        body: "Attendance changes every few seconds as people enter the venue. Organizers needed the latest numbers, but reopening the screen each time would interrupt the scanning process.\n\nA lightweight refresh action reloads all statistics while preserving:",
        list: ["Selected location", "Selected date", "Selected time slot"],
        quote: "Scanning remains uninterrupted, allowing volunteers and organizers to continue validating attendees while monitoring live attendance.",
      },
      {
        heading: "Small Decisions That Improved Operations",
        body: "Some of the most valuable improvements came from solving edge cases observed during testing.",
        list: [
          "Showing N/A instead of 0 before bookings begin to avoid misleading organizers.",
          "Keeping recently selected filters pinned next to the All chip for quicker switching.",
          "Displaying only relevant filter chips to reduce clutter.",
          "Automatically skipping ticket selection when only one ticket is eligible.",
          "Playing different sounds for successful and failed scans so volunteers don't need to look at the screen after every validation.",
          "Temporarily disabling the camera until the validation message disappears, preventing accidental double scans.",
        ],
      },
      {
        heading: "Outcome",
        body: "The QR Validator evolved from a basic scanning screen into a complete event operations tool.\n\nThe solution supported:",
        list: ["Multi-location events", "Multi-day schedules", "Multiple time slots", "Volunteer-based validation", "Real-time attendance monitoring", "Ticket-level analytics", "Booking exports", "Secure role-based access"],
        image: {
          src: "/gallery/kyncaseimg/flow13.jpg",
          caption: "User Flow / Final UI"
        },
      },
      {
        heading: "Reflection",
        body: "Although this project started as a QR scanner enhancement, it evolved into a complete operations product for event organizers. Every feature — from volunteer permissions to ticket-level analytics — was designed around one goal: help organizers manage large events confidently without slowing down entry or losing visibility into what was happening on the ground.",
      },
    ],
  },
  {
    title: "Style Guide > Design System",
    subtitle: "Figma-to-production component pipeline",
    description: "Bridging a Figma style guide to a versioned design system with an automated, tested components-to-code pipeline.",
    features: ["Figma variables exported straight into design tokens", "12 components, each unit-tested and documented", "Chromatic visual regression + accessibility checks on every push", "Published as an installable npm package: kyn-ds"],
    accent: "#3b82f6",
    icon: "🧩",
    image: "/gallery/kyn-ds-docs/images/style_guide_cover.jpg",
    caseStudy: [
      {
        heading: "Style Guide > Design System — Automated Component Pipeline",
        body: "Turning Figma variables into a versioned, tested component library — and the automated pipeline that gets it from Figma to production without slowing engineering down.",
        meta: [
          { label: "Role", value: "Product Designer • Design Systems • Frontend Collaboration • DevOps", icon: "solar:user-id-bold" },
          { label: "Timeline", value: "~2 Months", icon: "solar:clock-circle-bold" },
          { label: "Stack", value: "React 19 • TypeScript • Storybook • Chromatic • npm • Git", icon: "solar:code-bold" },
        ],
      },
      {
        heading: "One Button, Three Versions: The Problem",
        body: "The booking flow, the organizer portal, and internal tools each had their own button, their own modal, their own idea of what \"error\" red should look like. Nothing was wrong exactly — it just wasn't shared, so every new screen re-decided things that should've already been settled.",
        quote: "Could the components live in one place, versioned like any other dependency, instead of being redrawn per screen?",
      },
      {
        heading: "The Instinct, and Why It Was Wrong",
        body: "I wanted to build a comprehensive design system from scratch. However, due to a heavy load of BAU (Business As Usual) tasks and constant feature updates, the developers simply didn't have the bandwidth for a massive migration, and it would take them too much time to adopt it. A complete design system meant hundreds of components, a large migration effort, and ongoing maintenance after that — for a startup shipping weekly, none of that was practical right now.",
        quote: "We had too many BAU tasks and constant feature releases. How do we ship a design system when developers have no time to migrate?",
      },
      {
        heading: "Design System vs. Style Guide: The Strategic Pivot",
        body: "Instead of building the full system immediately, I scoped a lighter Style Guide — not a replacement for a design system forever, but a practical first step engineering could actually adopt.",
        groups: [
          { label: "Design System (the ideal)", list: ["Foundations, tokens, hundreds of components, complex variants, interaction patterns, documentation, governance.", "Built for long-term scale — and for a team with time to migrate."] },
          { label: "Style Guide (what shipped)", list: ["Colors, typography, spacing, layout foundations, and the handful of components used everywhere.", "Consistency without a full product rewrite."] },
        ],
      },
      {
        heading: "Figma to Production: The Pipeline",
        body: "Rather than a Figma file someone occasionally checks, the style guide became part of the actual development workflow. Every update followed the same automated path:",
        flow: ["Design Tokens", "Git Repository", "Chromatic", "Storybook", "npm Package", "Developer Project"],
      },
      {
        heading: "Token-Driven, Not Hardcoded",
        body: "Colors, spacing, and type get exported directly from Figma variables and compiled into CSS custom properties that every component consumes — so a token update in Figma is a token update everywhere, not a design file someone has to manually re-read.",
        groups: [
          { label: "Spacing & Shape", list: ["8px grid, 0–72px. Minimum touch target 44×44 per WCAG.", "Corner radius scales by use — 4px for chips, 8–12px for cards, 16px for buttons and sheets, full-round for FABs."] },
          { label: "Elevation & Icons", list: ["5 shadow levels (1–12px blur) plus a 32%-opacity scrim for focus states.", "Icons baseline at 24px (20×24×36×48 scale), stroke width scaling 1.5→3px with size."] },
        ],
      },
      {
        heading: "Color",
        body: "We designed a comprehensive 10-step color system (shades 50–900) mapped to semantic roles rather than literal values to ensure interface flexibility:",
        list: [
          "Palette Foundations: 9 color families including Brand primary (yellow), 5 Accents (red, orange, green, blue, purple), and 3 Neutral scales.",
          "Semantic Overlays: UI elements bind to functional roles (e.g., Success → green-500, Danger → red-500, Information → blue-500, Discovery → purple-500).",
          "Contrast Guardrails: All swatches are audited against WCAG standards, guaranteeing AA/AAA readability at every scale step."
        ],
        custom: "kyn-ds-colors",
      },
      {
        heading: "Typography",
        body: "We structured typography into 4 key roles — Display, Heading, Label, and Paragraph — generated mathematically on a modular scale to guarantee visual harmony:",
        list: [
          "Modular Scale: Font sizes are calculated by multiplying from a root 4px baseline using a Major Second ratio of 1.125, scaling smoothly from 12px to 64px.",
          "Role Hierarchy: Display (for impact), Heading (for structure), Label (for action targets), and Paragraph (for reading blocks).",
          "Line Height: Headings use tight 1.2× leading, while body paragraphs use 1.5×+ to comply with WCAG's accessibility spacing guidelines."
        ],
        custom: "kyn-ds-typescale",
      },
      {
        heading: "Spacing & Radius",
        body: "16 spacing steps on an 8px grid, and 7 corner-radius steps — the rhythm every component is built on.",
        custom: "kyn-ds-spacing",
      },
      {
        heading: "The Catalog: 12 Components, Actually Tested",
        body: "Avatar, Badge, Button, Checkbox, Chips, RadioButton, InputTextField, Banner, Menu, BottomSheet, Modal, Wizard — each with its own Vitest suite, not just a visual once-over. Button alone covers 3 sizes, 3 themes, 3 variants, and optional icons, tested for every combination.",
      },
      {
        heading: "Catching What Nobody Would Notice: Chromatic",
        body: "Every push runs the same automated gate before anything ships: code lands in Git, Chromatic builds isolated component snapshots on 3 breakpoints (320 / 768 / 1024), visual regression compares against the previous version, an accessibility audit runs automatically, and the team reviews before approving. Only approved builds move further down the pipeline — the changes nobody meant to make are exactly the ones that usually slip through manual review.",
      },
      {
        heading: "Storybook as the Source of Truth",
        body: "After approval, components publish to a hosted Storybook instance — custom-branded, with light/dark backgrounds and accessibility rules enforced through the a11y addon. Every component's doc page opens with \"View in Figma\" and \"View on GitHub\" buttons pointing at that exact component, so nobody has to go hunting for the source of truth. A small demo app with real routing consumes the published package directly, so if a component breaks for a real consumer, it breaks there first — before product does.",
      },
      {
        heading: "Shipping It as Real Software: npm",
        body: "The final step made the style guide installable instead of copy-pasted across repositories. I published it publicly to npm as [kyn-ds](https://www.npmjs.com/package/kyn-ds). It compiles into dual CJS/ESM formats with peer dependencies mapped for React and Feather Icons, guaranteeing a versioned, single source of truth across all product repositories.",
        code: "npm"
      },
      {
        heading: "Try It: Browse Every Component",
        body: "This is the live, published system — not screenshots. Click a component to load its real Storybook doc page, controls and all.",
        custom: "kyn-ds-components",
      },
      {
        heading: "Outcome",
        list: ["12 components, unit-tested and documented, not just styled", "One token pipeline instead of hand-typed values per team", "Automated visual regression and accessibility checks on every change", "A real consuming app validating the package before product does", "The foundations for a full design system, built in the order the team could actually absorb"],
      },
      {
        heading: "Reflection",
        body: "Design systems fail quietly — one team's button drifts a few pixels from another's until nobody trusts the system enough to use it. Success isn't measured by how many components a system has, it's measured by how easily people actually adopt and maintain it.\n\nChasing the ideal solution would've cost the team six months they didn't have. Understanding the real constraint — engineering bandwidth, not design ability — and building for it shipped something people used from week one: tokens instead of memory, tests instead of hope, Chromatic instead of someone noticing too late.",
      },
    ],
  },
  {
    title: "Neighbourhood Design System",
    subtitle: "Figma variables → verified design tokens",
    description: "Extracting and parsing Figma local variables directly into a live, interactive design token specification — colors, type, spacing, and components.",
    features: ["18 base color families + semantic token layers", "Type scale 10–36px across Mobile & Web viewports", "Spacing, radius & icon size tokens from Figma variables", "12 documented components with full prop specs"],
    accent: "#3b82f6",
    icon: "📐",
    image: "/gallery/kyn-ds-docs/images/kyn_ds_cover.jpg",
    caseStudy: [
      {
        heading: "Neighbourhood Design System",
        body: "Turning raw Figma variable exports into a live, interactive token specification — every color, type size, spacing step, and component directly sourced from the Figma variables panel.",
        meta: [
          { label: "Role", value: "Design Systems Engineer", icon: "solar:user-id-bold" },
          { label: "Timeline", value: "1 Week", icon: "solar:clock-circle-bold" },
          { label: "Stack", value: "Figma Variables • Node.js Parser • JSON Tokens • React", icon: "solar:code-bold" },
        ],
      },
      {
        heading: "Figma File source",
        figmaEmbed: "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2FQ4u7LN3W1Drg8gZaUMY5W2%2FNeighbourhood-Design-System%3Fnode-id%3D0-1%26t%3DI61c4z6y8HbgssbY-1"
      },
      {
        heading: "The Story Behind It",
        body: "Figma variables are the single source of truth — but they're raw JSON. By parsing the exported variable collections directly, I extracted 18 base color families, a full semantic token layer (light & dark modes), viewport-specific typography, spacing steps, radii, and icon sizes. This parsed token dictionary becomes the unambiguous contract between design and code.",
      },
      {
        heading: "Base Color Families",
        body: "18 color families parsed from the Figma base-color collection — solid 50–900 scales for Brand, Teal, Sky-blue, Yellow, Red, Green, Blue, and Faded neutrals, plus alpha transparency variants (brand-p, teal-s, red-e…) for overlay and ghost states. Click any swatch to copy its hex.",
        custom: "neighbourhood-colors",
      },
      {
        heading: "Semantic Color Tokens",
        body: "224 semantic tokens organized into 10 groups: Surface, Feedback, Interaction, and Dimmer — each with light and dark mode values. Token names map directly to their intent (surface-background-primary-subtle, feedback-text-error-intense…) so usage is never ambiguous.",
        custom: "neighbourhood-semantic",
      },
      {
        heading: "Typography Scale",
        body: "20 distinct type roles across Mobile and Web viewports — from 10px Paragraph XSmall up to 36px Display XLarge. All sourced from Figma text-token variables. Filter by viewport or weight to preview any combination.",
        custom: "neighbourhood-type-scale",
      },
      {
        heading: "Spacing, Radius & Icon Sizes",
        body: "12 spacing steps (0–48px), 5 border-radius tokens (none → max / pill), and 7 icon size steps (8–32px) — all derived from semantic-size Figma variables, visualized as live bars and shape previews.",
        custom: "neighbourhood-size",
      },
      {
        heading: "Component Catalog",
        body: "12 components across Atoms (Button, Checkbox, RadioButton, Chips, Avatar, Badge), Molecules (InputTextField, Banner, Menu), and Organisms (BottomSheet, Modal, Wizard). Each card expands to show the full prop API and links directly to its Storybook doc page.",
        custom: "neighbourhood-components",
      },
      {
        heading: "Outcome",
        list: ["Zero hardcoded hex values — all colours from token variables", "Light and dark mode fully resolved at the token layer", "Consistent spacing, radius and icon sizes across the system", "12 components with complete prop contracts", "Single Figma export → full token spec update, no manual work"],
      },
    ],
  },
]

function ZoomableImage({ src, alt, onOpen, imgStyle, containerStyle }: {
  src: string
  alt: string
  onOpen: () => void
  imgStyle?: CSSProperties
  containerStyle?: CSSProperties
}) {
  return (
    <div style={{ position: "relative", ...containerStyle }}>
      <img
        src={src}
        alt={alt}
        onClick={onOpen}
        style={{ cursor: "pointer", ...imgStyle }}
      />
      <button
        onClick={onOpen}
        aria-label="Enlarge image"
        style={{
          position: "absolute", top: "10px", right: "10px",
          width: "28px", height: "28px", borderRadius: "50%",
          border: "none", background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}
      >
        <Icon icon="solar:magnifer-zoom-in-bold" width={14} color="#ffffff" />
      </button>
    </div>
  )
}

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
        minWidth: 0,
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
            borderRadius: "var(--radius-2xl)",
            overflow: "hidden",
            background: "#ffffff",
            border: "1px solid var(--color-border)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Cover image */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            {card.image.endsWith(".mp4") || card.image.endsWith(".mov") || card.image.endsWith(".webm") ? (
              <video
                src={card.image}
                autoPlay
                loop
                muted
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "contrast(1.06) saturate(1.1)" }}
              />
            ) : (
              <img
                src={card.image}
                alt={card.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none", userSelect: "none" }}
              />
            )}
          </div>

          {/* Bottom text */}
          <div style={{ padding: "var(--space-5)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", borderTop: "1px solid var(--color-border)" }}>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: "1rem", color: "var(--color-text-primary)", letterSpacing: "-0.02em", lineHeight: 1.3, fontFamily: FONTS.display, transition: "transform 0.4s ease", transform: flipped ? "translateY(-4px)" : "translateY(0)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {card.title}
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: "var(--color-text-muted-light)", lineHeight: 1.4, transition: "transform 0.4s ease 0.05s", transform: flipped ? "translateY(-4px)" : "translateY(0)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
            borderRadius: "var(--radius-2xl)",
            padding: "var(--space-5)",
            background: "#ffffff",
            border: "1px solid var(--color-border)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            <div style={{ marginBottom: "var(--space-3)" }}>
              <h3 style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "0.95rem", color: "var(--color-text-primary)", letterSpacing: "-0.02em", fontFamily: FONTS.display }}>{card.title}</h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.76rem",
                  color: "var(--color-text-muted)",
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
                    gap: "var(--space-2)",
                    fontSize: "0.78rem",
                    color: "var(--color-text-tertiary)",
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
            <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "10px", marginTop: "10px", flexShrink: 0 }}>
              <button
                onClick={(e) => { e.stopPropagation(); onReadMore() }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", border: `1px solid ${card.accent}40`, borderRadius: "var(--radius-lg)", padding: "var(--space-2) var(--space-3)",
                  background: `${card.accent}12`, cursor: "pointer", font: "inherit",
                }}
              >
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-text-primary)" }}>Read full case study</span>
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
  const getStepIcon = (name: string) => {
    switch (name) {
      case "Design Tokens": return "logos:figma"
      case "Git Repository": return "logos:github-icon"
      case "Chromatic": return "logos:chromatic-icon"
      case "Storybook": return "logos:storybook-icon"
      case "npm Package": return "logos:npm-icon"
      case "Developer Project": return "logos:react"
      default: return null
    }
  }

  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-3)",
      alignItems: "center",
      justifyContent: "flex-start",
      marginTop: "var(--space-4)",
      width: "100%"
    }}>
      {steps.map((step, i) => {
        const icon = getStepIcon(step)
        return (
          <div key={step} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
            {/* Square Step Card */}
            <div style={{
              width: "110px",
              height: "110px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-2xl)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              position: "relative",
              padding: "10px",
              boxSizing: "border-box"
            }}>
              {/* Top-Left Step Number */}
              <span style={{
                position: "absolute",
                top: "-6px",
                left: "-6px",
                background: accent,
                color: "#ffffff",
                fontSize: "0.65rem",
                fontWeight: 800,
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #ffffff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}>
                {i + 1}
              </span>
              
              {/* Real Logo Icon */}
              {icon && <Icon icon={icon} width={32} height={32} />}
              
              {/* Step Label */}
              <span style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#475569",
                fontFamily: FONTS.primary,
                marginTop: "var(--space-2)",
                textAlign: "center",
                lineHeight: 1.25
              }}>
                {step}
              </span>
            </div>
            
            {/* Right Arrow (only between cards, hidden on last item) */}
            {i < steps.length - 1 && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon icon="solar:arrow-right-outline" width={18} height={18} color={`${accent}80`} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function JourneyFlow({ steps, accent }: { steps: { label: string; substeps?: string[] }[]; accent: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", marginTop: "var(--space-4)", width: "100%" }}>
      {steps.map((step, i) => (
        <div key={step.label} style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{
              flexShrink: 0, width: "26px", height: "26px", borderRadius: "50%",
              background: accent, color: "#ffffff", fontSize: "0.72rem", fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {i + 1}
            </span>
            <div style={{
              flex: 1, padding: "10px var(--space-4)", borderRadius: "var(--radius-lg)",
              background: "#ffffff", border: "1px solid var(--color-border)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              fontSize: "0.92rem", fontWeight: 700, color: "var(--color-text-primary)", fontFamily: FONTS.primary,
            }}>
              {step.label}
            </div>
          </div>

          {step.substeps && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", margin: "8px 0 8px 13px", paddingLeft: "26px", borderLeft: `2px dashed ${accent}55` }}>
              {step.substeps.map((sub) => (
                <div key={sub} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: `${accent}80`, flexShrink: 0 }} />
                  {sub}
                </div>
              ))}
            </div>
          )}

          {i < steps.length - 1 && !step.substeps && (
            <div style={{ height: "20px", width: "13px", display: "flex", justifyContent: "center" }}>
              <div style={{ width: "2px", height: "100%", background: `${accent}30` }} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function HighlightedCode({ code }: { code: string }) {
  const lines = code.split("\n");
  return (
    <pre style={{ 
      margin: 0, 
      overflowX: "hidden", 
      overflowY: "hidden", 
      whiteSpace: "pre-wrap", 
      wordBreak: "break-word" 
    }}>
      <code style={{ fontFamily: FONTS.mono, fontSize: "0.85rem", lineHeight: 1.6 }}>
        {lines.map((line, idx) => {
          // Highlight comments
          if (line.trim().startsWith("//")) {
            return <div key={idx} style={{ color: "var(--color-text-muted)", fontStyle: "italic" }}>{line}</div>;
          }
          // Split code line into tokens
          const tokens = line.split(/(\s+|\(|\)|\{|\}|\[|\]|;|\.|=|,|`|\$)/);
          return (
            <div key={idx} style={{ minHeight: "1.4em" }}>
              {tokens.map((token, tIdx) => {
                if (/^(async|function|const|let|var|for|of|if|await|return|as|readonly|val|fun|class|private|when|null|import|package|enum)$/.test(token)) {
                  return <span key={tIdx} style={{ color: "#f43f5e", fontWeight: 600 }}>{token}</span>;
                }
                if (/^(populateNodes|findOne|loadFontAsync|createImageAsync|toLowerCase|chars|characters|fills|hash|img|data|node|nodes|titleNode|priceNode|imageNode|parse|detectStatus|toIsoDate|extractTime|extractLocation|extractTicketCount|containsAny|replace)$/.test(token)) {
                  return <span key={tIdx} style={{ color: "#38bdf8" }}>{token}</span>;
                }
                if (/^(SceneNode|TextNode|RectangleNode|FontName|EventData|ParsedBooking|BookingStatus|String|Int|Regex|MatchResult)$/.test(token)) {
                  return <span key={tIdx} style={{ color: "#a855f7", fontWeight: 500 }}>{token}</span>;
                }
                if (/^("title"|"price"|"image"|"TEXT"|"RECTANGLE"|"Free"|"IMAGE"|"FILL"|imageUrl|title|isFree|price|formattedDate)$/.test(token)) {
                  return <span key={tIdx} style={{ color: "#eab308" }}>{token}</span>;
                }
                return <span key={tIdx} style={{ color: "var(--color-border)" }}>{token}</span>;
              })}
            </div>
          );
        })}
      </code>
    </pre>
  );
}

function LockedFigmaEmbed({ src }: { src: string }) {
  const [unlocked, setUnlocked] = useState(false)
  const [code, setCode] = useState("")
  const [shake, setShake] = useState(false)

  const attempt = (value?: string) => {
    if ((value ?? code) === ACCESS_CODE) {
      setUnlocked(true)
    } else {
      setShake(true)
      setCode("")
      setTimeout(() => setShake(false), 500)
    }
  }

  if (unlocked) {
    return (
      <div style={{ borderRadius: "var(--radius-2xl)", overflow: "hidden", border: "1px solid var(--color-border)", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
        <iframe style={{ border: "none", display: "block" }} width="100%" height="600" src={src} allowFullScreen />
      </div>
    )
  }

  return (
    <div style={{ borderRadius: "var(--radius-2xl)", overflow: "hidden", border: "1px solid var(--color-border)", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", background: "var(--color-bg-secondary)", height: "340px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "var(--space-5)" }}>
      <div style={{ width: "52px", height: "52px", borderRadius: "var(--radius-xl)", background: "#fff", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <Icon icon="solar:lock-keyhole-outline" width={26} color="var(--color-text-primary)" />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: "700", fontSize: "1rem", color: "var(--color-text-primary)", marginBottom: "6px" }}>Enter access code to view</div>
        <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted-light)" }}>This Figma file is access-restricted</div>
      </div>
      <div style={{ animation: shake ? "shake 0.4s ease" : "none" }}>
        <OtpInput value={code} onChange={setCode} onComplete={attempt} theme="light" />
      </div>
      <button
        onClick={() => attempt()}
        style={{ padding: "10px var(--space-6)", borderRadius: "var(--radius-md)", background: "var(--color-text-primary)", color: "#fff", fontSize: "0.875rem", fontWeight: "600", border: "none", cursor: "pointer" }}
      >
        Unlock
      </button>
      <a href="mailto:abusyeed10202@gmail.com" style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", textDecoration: "underline" }}>
        Email me, I am happy to walk you through
      </a>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`}</style>
    </div>
  )
}

function CaseStudyPanel({ card, onClose }: { card: CardData; onClose: () => void }) {
  const navigate = useNavigate()
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      if (lightbox) setLightbox(null)
      else onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose, lightbox])

  // The site-wide Lenis instance hijacks wheel events on window, leaving this
  // fixed-position modal's own scrollable body with nothing to scroll — give
  // it its own scoped Lenis instance instead, same fix as CaseStudiesPage.
  const scrollBodyRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = scrollBodyRef.current
    if (!el) return
    const lenis = new Lenis({
      wrapper: el,
      content: el,
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      lerp: 0.15,
    })
    let raf = 0
    function loop(time: number) {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

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
          width: "clamp(320px, 58%, 820px)",
          height: "100vh",
          background: "#ffffff",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.10), 0 20px 50px rgba(0,0,0,0.08)",
          border: "1px solid var(--color-border)",
          borderRight: "none",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "var(--space-5) 28px",
          borderBottom: "1px solid var(--color-border)",
          flexShrink: 0,
        }}>
          <div>
            <span style={{ fontSize: "0.95rem", fontWeight: 700, color: card.accent, letterSpacing: "-0.01em", fontFamily: FONTS.display }}>
              {card.subtitle}
            </span>
            <h2 style={{ margin: "4px 0 0", fontSize: "1.4rem", fontWeight: 800, color: "var(--color-text-primary)", letterSpacing: "-0.02em", fontFamily: FONTS.display }}>
              {card.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              flexShrink: 0, width: "34px", height: "34px", borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)",
              cursor: "pointer", fontSize: "0.95rem", color: "var(--color-text-muted)", lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div ref={scrollBodyRef} style={{ flex: 1, overflowY: "auto", padding: "var(--space-8)" }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: "14px",
              overflow: "hidden",
              marginBottom: "var(--space-8)",
              border: "1px solid var(--color-border)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >
            {card.image.endsWith(".mp4") || card.image.endsWith(".mov") || card.image.endsWith(".webm") ? (
              <video
                src={card.image}
                autoPlay
                loop
                muted
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "contrast(1.06) saturate(1.1)" }}
              />
            ) : (
              <ZoomableImage
                src={card.image}
                alt={card.title}
                onOpen={() => setLightbox({ src: card.image, alt: card.title })}
                containerStyle={{ width: "100%", height: "100%" }}
                imgStyle={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            )}
          </div>
          {card.caseStudy?.map((section) => (
            <div key={section.heading} style={{ marginBottom: "36px" }}>
              <h3 style={{ margin: "0 0 12px", fontSize: "1rem", fontWeight: 700, color: card.accent, letterSpacing: "-0.01em", fontFamily: FONTS.display }}>
                {section.heading}
              </h3>
              {section.meta && (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "18px" }}>
                  {section.meta.map((item) => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "44px", height: "44px", borderRadius: "var(--radius-xl)", flexShrink: 0,
                        background: `${card.accent}14`, display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon icon={item.icon} width={26} height={26} color={card.accent} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-text-muted-light)", letterSpacing: "0em" }}>
                          {item.label}
                        </span>
                        <span style={{ fontSize: "1rem", color: "var(--color-text-primary)", fontWeight: 500 }}>{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {section.body && section.body.split("\n\n").map((p, i) => {
                const isCode = p.includes("{") && (p.includes("interface ") || p.includes("await supabase"))
                if (isCode) {
                  return (
                    <pre
                      key={i}
                      style={{
                        margin: "0 0 8px", padding: "14px var(--space-4)", borderRadius: "var(--radius-lg)",
                        background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)",
                        fontSize: "0.78rem", lineHeight: 1.6, color: "var(--color-text-tertiary)",
                        fontFamily: "'SF Mono', 'Fira Code', monospace",
                        whiteSpace: "pre-wrap", overflowX: "auto",
                      }}
                    >
                      {p}
                    </pre>
                  )
                }
                if (section.heading === "The Catalog: 12 Components, Actually Tested") {
                  return (
                    <div key={i} style={{ margin: "0 0 20px" }}>
                      <p style={{ margin: "0 0 20px", fontSize: "1.05rem", lineHeight: 1.75, color: "var(--color-text-secondary)" }}>
                        Each component in Kyn DS is fully version-controlled, tested, and documented. Button alone covers 3 sizes, 3 themes, 3 variants, and optional icons, thoroughly verified for every combination.
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                        {/* Atoms */}
                        <div style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-4)" }}>
                          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: card.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px", fontFamily: FONTS.primary }}>Atoms (Basic Elements)</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                            {["Avatar", "Badge", "Button", "Checkbox", "Chips", "RadioButton"].map(c => (
                              <span key={c} style={{ padding: "6px var(--space-3)", background: "#ffffff", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text-tertiary)", fontFamily: FONTS.primary }}>{c}</span>
                            ))}
                          </div>
                        </div>
                        {/* Molecules */}
                        <div style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-4)" }}>
                          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: card.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px", fontFamily: FONTS.primary }}>Molecules (Structured Units)</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                            {["InputTextField", "Banner", "Menu"].map(c => (
                              <span key={c} style={{ padding: "6px var(--space-3)", background: "#ffffff", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text-tertiary)", fontFamily: FONTS.primary }}>{c}</span>
                            ))}
                          </div>
                        </div>
                        {/* Organisms */}
                        <div style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-4)" }}>
                          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: card.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px", fontFamily: FONTS.primary }}>Organisms (Complex Interfaces)</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                            {["BottomSheet", "Modal", "Wizard"].map(c => (
                              <span key={c} style={{ padding: "6px var(--space-3)", background: "#ffffff", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text-tertiary)", fontFamily: FONTS.primary }}>{c}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
                return (
                  <p key={i} style={{ margin: "0 0 14px", fontSize: "1.05rem", lineHeight: 1.75, color: "var(--color-text-secondary)" }}>
                    {p}
                  </p>
                )
              })}
              {section.quote && (
                <div
                  style={{
                    position: "relative", margin: "20px 0 8px", padding: "var(--space-5) var(--space-6) var(--space-5) 28px",
                    borderLeft: `3px solid ${card.accent}`, borderRadius: "0 12px 12px 0",
                    background: `linear-gradient(135deg, ${card.accent}0d, ${card.accent}03)`,
                  }}
                >
                  <span
                    style={{
                      position: "absolute", top: "-6px", left: "20px",
                      fontSize: "3rem", fontWeight: 800, color: card.accent, opacity: 0.25,
                      lineHeight: 1, fontFamily: "Georgia, serif", userSelect: "none",
                    }}
                  >
                    "
                  </span>
                  <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, fontStyle: "italic", color: "var(--color-text-primary)", lineHeight: 1.5, letterSpacing: "-0.01em" }}>
                    {section.quote}
                  </p>
                </div>
              )}
              {section.list && (
                <ul style={{ margin: "10px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {section.list.map((item) => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "1rem", color: "var(--color-text-tertiary)", lineHeight: 1.65 }}>
                      <span style={{ flexShrink: 0, marginTop: "5px" }}><ArrowRight color={card.accent} /></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.painPoints && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--color-error)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--space-2)", fontFamily: FONTS.display }}>
                    Pain Points
                  </span>
                  {section.painPoints.map((item) => (
                    <div
                      key={item}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: "var(--space-3)",
                        padding: "14px var(--space-4)", borderRadius: "var(--radius-lg)",
                        background: "#fef2f2", border: "1px solid #fecaca",
                      }}
                    >
                      <span style={{
                        flexShrink: 0, width: "24px", height: "24px", borderRadius: "50%",
                        background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon icon="solar:danger-triangle-bold" width={14} color="var(--color-error)" />
                      </span>
                      <span style={{ fontSize: "0.98rem", color: "#7f1d1d", lineHeight: 1.6, fontWeight: 500 }}>{item}</span>
                    </div>
                  ))}
                </div>
              )}
              {section.code && (
                <div style={{
                  background: "var(--color-text-primary)",
                  color: "var(--color-bg-secondary)",
                  padding: "var(--space-4)",
                  borderRadius: "var(--radius-lg)",
                  fontFamily: FONTS.mono,
                  fontSize: "0.85rem",
                  overflowX: "hidden", // No horizontal scroll on code box
                  overflowY: "hidden", // No vertical scroll on code box
                  marginTop: "var(--space-3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  lineHeight: 1.6
                }}>
                  {section.code === "npm" ? (
                    <>
                      <div style={{ color: "#38bdf8" }}>
                        <span style={{ color: "#f43f5e", marginRight: "var(--space-2)" }}>$</span>
                        npm install kyn-ds
                      </div>
                      <div style={{ height: "8px" }} />
                      <div>
                        <span style={{ color: "#f43f5e" }}>import</span> {'{'} <span style={{ color: "#38bdf8" }}>Button</span> {'}'} <span style={{ color: "#f43f5e" }}>from</span> <span style={{ color: "#10b981" }}>"kyn-ds"</span>
                      </div>
                      <div style={{ height: "8px" }} />
                      <div>
                        &lt;<span style={{ color: "#f43f5e" }}>Button</span> <span style={{ color: "#fb923c" }}>variant</span>=<span style={{ color: "#10b981" }}>"primary"</span>&gt;Book Event&lt;/<span style={{ color: "#f43f5e" }}>Button</span>&gt;
                      </div>
                    </>
                  ) : (
                    <HighlightedCode code={section.code} />
                  )}
                </div>
              )}
              {section.flow && <StepFlow steps={section.flow} accent={card.accent} />}
              {section.journey && <JourneyFlow steps={section.journey} accent={card.accent} />}
              {section.columns && (() => {
                const maxLen = Math.max(...section.columns.map(c => c.flow.length));
                const col0 = section.columns[0];
                const col1 = section.columns[1];
                return (
                  <div style={{ marginTop: "var(--space-4)" }}>
                    {/* Lane labels */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                      {section.columns.map((col) => (
                        <span key={col.label} style={{ fontSize: "0.78rem", fontWeight: 700, color: card.accent, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                          {col.label}
                        </span>
                      ))}
                    </div>
                    {/* Zigzag rows */}
                    {Array.from({ length: maxLen }).map((_, i) => {
                      const topStep = col0?.flow[i];
                      const botStep = col1?.flow[i];
                      const isLast = i === maxLen - 1;
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "stretch", gap: "var(--space-2)", marginBottom: isLast ? 0 : "6px" }}>
                          {/* Top lane step (Player) */}
                          <div style={{ flex: 1 }}>
                            {topStep ? (
                              <div style={{
                                background: "var(--color-bg-secondary)",
                                border: `1.5px solid ${card.accent}33`,
                                borderRadius: "var(--radius-lg)",
                                padding: "var(--space-2) var(--space-3)",
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--space-2)",
                              }}>
                                <span style={{
                                  flexShrink: 0,
                                  width: "20px", height: "20px",
                                  background: card.accent,
                                  color: "#fff",
                                  borderRadius: "50%",
                                  fontSize: "0.65rem",
                                  fontWeight: 800,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                }}>{i + 1}</span>
                                <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--color-text-tertiary)", lineHeight: 1.3 }}>{topStep}</span>
                              </div>
                            ) : <div />}
                          </div>

                          {/* Center spine with arrow */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "28px", flexShrink: 0 }}>
                            {!isLast && (
                              <div style={{ width: "1.5px", flex: 1, background: `${card.accent}25` }} />
                            )}
                          </div>

                          {/* Bottom lane step (Emcee) */}
                          <div style={{ flex: 1 }}>
                            {botStep ? (
                              <div style={{
                                background: `${card.accent}08`,
                                border: `1.5px solid ${card.accent}55`,
                                borderRadius: "var(--radius-lg)",
                                padding: "var(--space-2) var(--space-3)",
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--space-2)",
                              }}>
                                <span style={{
                                  flexShrink: 0,
                                  width: "20px", height: "20px",
                                  background: `${card.accent}cc`,
                                  color: "#fff",
                                  borderRadius: "50%",
                                  fontSize: "0.65rem",
                                  fontWeight: 800,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                }}>{i + 1}</span>
                                <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--color-text-tertiary)", lineHeight: 1.3 }}>{botStep}</span>
                              </div>
                            ) : <div />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
              {section.features && (
                <div style={{ display: "flex", flexDirection: "column", gap: "28px", marginTop: "var(--space-1)" }}>
                  {section.features.map((feature) => (
                    <div key={feature.title}>
                      <h4 style={{ margin: "0 0 8px", fontSize: "1.05rem", fontWeight: 700, color: "var(--color-text-primary)", fontFamily: FONTS.display }}>
                        {feature.title}
                      </h4>
                      {feature.body && (
                        <p style={{ margin: "0 0 10px", fontSize: "1.05rem", lineHeight: 1.75, color: "var(--color-text-secondary)" }}>
                          {feature.body}
                        </p>
                      )}
                      {feature.list && (
                        <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                          {feature.list.map((item) => (
                            <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.98rem", color: "var(--color-text-tertiary)", lineHeight: 1.6 }}>
                              <span style={{ flexShrink: 0, marginTop: "var(--space-1)" }}><ArrowRight color={card.accent} /></span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {feature.media && (
                        <div
                          style={{
                            marginTop: "var(--space-2)", width: "100%", aspectRatio: "16 / 9", borderRadius: "var(--radius-lg)",
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
                          <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.55 }}>{feature.media}</span>
                        </div>
                      )}
                      {feature.image && (
                        <div style={{ marginTop: "var(--space-3)" }}>
                          <ZoomableImage
                            src={feature.image.src}
                            alt={feature.image.caption || feature.title}
                            onOpen={() => setLightbox({ src: feature.image!.src, alt: feature.image!.caption || feature.title })}
                            imgStyle={{ width: "100%", display: "block", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
                          />
                          {feature.image.caption && (
                            <span style={{ display: "block", marginTop: "var(--space-2)", fontSize: "0.8rem", color: "var(--color-text-muted-light)", textAlign: "center" }}>
                              {feature.image.caption}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {section.groups && (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", marginTop: "var(--space-1)" }}>
                  {section.groups.map((group) => (
                    <div key={group.label} style={{ padding: "14px", borderRadius: "var(--radius-xl)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}>
                      <span style={{ fontSize: "1rem", fontWeight: 700, color: card.accent, letterSpacing: "-0.01em", fontFamily: FONTS.display }}>
                        {group.label}
                      </span>
                      <ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                        {group.list.map((item) => (
                          <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-2)", fontSize: "0.92rem", color: "var(--color-text-tertiary)", lineHeight: 1.55 }}>
                            <span style={{ flexShrink: 0, marginTop: "var(--space-1)" }}><ArrowRight color={card.accent} /></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              {section.tech && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "var(--space-1)" }}>
                  {section.tech.flatMap((group) => group.items).map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        padding: "6px 10px", borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)",
                      }}
                    >
                      <Icon icon={item.icon} width={16} height={16} />
                      <span style={{ fontSize: "0.8rem", color: "var(--color-text-tertiary)", fontWeight: 500 }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
              {section.media && (
                <div
                  style={{
                    marginTop: "var(--space-3)",
                    width: "100%",
                    aspectRatio: "16 / 9",
                    borderRadius: "var(--radius-xl)",
                    border: `1px dashed ${card.accent}55`,
                    background: `${card.accent}08`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "var(--space-3)",
                    textAlign: "center",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={card.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity={0.7}>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <circle cx="8.5" cy="10" r="1.5" />
                    <path d="M21 15l-5-5-9 9" />
                  </svg>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.55 }}>{section.media}</span>
                </div>
              )}
              {section.image && (
                <div style={{ marginTop: "var(--space-3)" }}>
                  <ZoomableImage
                    src={section.image.src}
                    alt={section.image.caption || section.heading}
                    onOpen={() => setLightbox({ src: section.image!.src, alt: section.image!.caption || section.heading })}
                    imgStyle={{
                      width: "100%",
                      display: "block",
                      borderRadius: "var(--radius-xl)",
                      border: "1px solid var(--color-border)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                    }}
                  />
                  {section.image.caption && (
                    <span style={{ display: "block", marginTop: "var(--space-2)", fontSize: "0.8rem", color: "var(--color-text-muted-light)", textAlign: "center" }}>
                      {section.image.caption}
                    </span>
                  )}
                </div>
              )}
              {section.images && (
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${section.images.length}, 1fr)`, gap: "var(--space-3)", marginTop: "var(--space-3)" }}>
                  {section.images.map((img, idx) => (
                    <div key={idx}>
                      <ZoomableImage
                        src={img.src}
                        alt={img.caption || section.heading}
                        onOpen={() => setLightbox({ src: img.src, alt: img.caption || section.heading })}
                        imgStyle={{
                          width: "100%",
                          display: "block",
                          borderRadius: "var(--radius-xl)",
                          border: "1px solid var(--color-border)",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                        }}
                      />
                      {img.caption && (
                        <span style={{ display: "block", marginTop: "var(--space-2)", fontSize: "0.8rem", color: "var(--color-text-muted-light)", textAlign: "center" }}>
                          {img.caption}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {section.iframe && (
                <div style={{ marginTop: "var(--space-3)" }}>
                  <div
                    style={{
                      width: "100%",
                      height: `${section.iframe.height ?? 480}px`,
                      borderRadius: "var(--radius-xl)",
                      overflow: "hidden",
                      border: `1px solid ${card.accent}33`,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    }}
                  >
                    <iframe
                      src={section.iframe.src}
                      title={section.heading}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                    />
                  </div>
                  {section.iframe.caption && (
                    <span style={{ display: "block", marginTop: "var(--space-2)", fontSize: "0.8rem", color: "var(--color-text-muted-light)", textAlign: "center" }}>
                      {section.iframe.caption}
                    </span>
                  )}
                </div>
              )}
              {section.figmaEmbed && (
                <div style={{ marginTop: "var(--space-3)" }}>
                  <LockedFigmaEmbed src={section.figmaEmbed} />
                </div>
              )}
              {section.custom === "kyn-ds-explorer" && <KynDsExplorer />}
              {section.custom === "kyn-ds-components" && <KynDsComponentsBrowser />}
              {section.custom === "kyn-ds-colors" && <KynDsColorTokens />}
              {section.custom === "kyn-ds-typescale" && <KynDsTypeScale />}
              {section.custom === "kyn-ds-spacing" && <KynDsSpacingRadius />}
              {section.custom === "neighbourhood-colors" && <NeighbourhoodColorTokens />}
              {section.custom === "neighbourhood-type-scale" && <NeighbourhoodTypeScale />}
              {section.custom === "neighbourhood-semantic" && <NeighbourhoodSemanticTokens />}
              {section.custom === "neighbourhood-size" && <NeighbourhoodSizeTokens />}
              {section.custom === "neighbourhood-components" && <NeighbourhoodComponents />}
              {section.custom === "marina-ipl-photos" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
                  <ZoomableImage
                    src="/gallery/kyncaseimg/marina_mall_ipl.png"
                    alt="Marina Mall IPL crowd"
                    onOpen={() => setLightbox({ src: "/gallery/kyncaseimg/marina_mall_ipl.png", alt: "Marina Mall IPL crowd" })}
                    imgStyle={{ width: "100%", borderRadius: "var(--radius-xl)", objectFit: "cover", aspectRatio: "4/3", border: "1px solid var(--color-border)", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
                  />
                  <ZoomableImage
                    src="/gallery/kyncaseimg/marina_mall_ipl2.jpg"
                    alt="Chase & Cheer event setup at Marina Mall"
                    onOpen={() => setLightbox({ src: "/gallery/kyncaseimg/marina_mall_ipl2.jpg", alt: "Chase & Cheer event setup at Marina Mall" })}
                    imgStyle={{ width: "100%", borderRadius: "var(--radius-xl)", objectFit: "cover", aspectRatio: "4/3", border: "1px solid var(--color-border)", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
                  />
                </div>
              )}
              {section.custom === "chase-event-videos" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
                  <video
                    src="/gallery/kyncaseimg/chase1.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: "100%", borderRadius: "var(--radius-xl)", objectFit: "cover", aspectRatio: "9/16", border: "1px solid var(--color-border)", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", display: "block" }}
                  />
                  <video
                    src="/gallery/kyncaseimg/chase2.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: "100%", borderRadius: "var(--radius-xl)", objectFit: "cover", aspectRatio: "9/16", border: "1px solid var(--color-border)", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", display: "block" }}
                  />
                </div>
              )}
              {section.custom === "notify-notifications" && (
                <div style={{ display: "flex", gap: "var(--space-4)", marginTop: "var(--space-4)", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                    <ZoomableImage
                      src="/gallery/kyncaseimg/11_cropped.png"
                      alt="TurfTown Notification"
                      onOpen={() => setLightbox({ src: "/gallery/kyncaseimg/11_cropped.png", alt: "TurfTown Notification" })}
                      imgStyle={{ width: "100%", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    />
                  </div>
                  <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                    <ZoomableImage
                      src="/gallery/kyncaseimg/22_cropped.png"
                      alt="District Notification"
                      onOpen={() => setLightbox({ src: "/gallery/kyncaseimg/22_cropped.png", alt: "District Notification" })}
                      imgStyle={{ width: "100%", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    />
                  </div>
                </div>
              )}
              {section.cta && (
                <button
                  onClick={() => navigate(section.cta!.href)}
                  style={{
                    display: "flex", alignItems: "center", gap: "var(--space-2)", marginTop: "var(--space-4)",
                    padding: "var(--space-3) var(--space-5)", borderRadius: "var(--radius-lg)", border: "none", cursor: "pointer",
                    background: card.accent, color: "#ffffff",
                    fontSize: "0.9rem", fontWeight: 700,
                  }}
                >
                  {section.cta.label}
                  <ArrowRight color="#ffffff" />
                </button>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </>
  )

  const lightboxOverlay = lightbox && (
    <motion.div
      key="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={() => setLightbox(null)}
      style={{
        position: "fixed", inset: 0, zIndex: 999999,
        background: "rgba(0,0,0,0.88)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "var(--space-10)", cursor: "zoom-out",
      }}
    >
      <button
        onClick={() => setLightbox(null)}
        aria-label="Close image"
        style={{
          position: "absolute", top: "24px", right: "24px",
          width: "40px", height: "40px", borderRadius: "50%",
          border: "none", background: "rgba(255,255,255,0.1)", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}
      >
        <Icon icon="solar:close-circle-bold" width={24} />
      </button>
      <motion.img
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.18 }}
        src={lightbox.src}
        alt={lightbox.alt}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "var(--radius-md)", cursor: "default", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
      />
    </motion.div>
  )

  return createPortal(<AnimatePresence>{panel}{lightboxOverlay}</AnimatePresence>, document.body)
}

const SECONDARY_TITLES = ["Chase & Cheer", "Notify"]
const TERTIARY_TITLES = ["Style Guide > Design System", "Neighbourhood Design System"]

const PRIMARY_CARDS = CARDS.filter((card) => !SECONDARY_TITLES.includes(card.title) && !TERTIARY_TITLES.includes(card.title))
const SECONDARY_CARDS = CARDS.filter((card) => SECONDARY_TITLES.includes(card.title))
const TERTIARY_CARDS = CARDS.filter((card) => TERTIARY_TITLES.includes(card.title))

export default function KynhoodBentoCards() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "var(--space-4)",
          width: "100%",
        }}
      >
        {PRIMARY_CARDS.map((card, i) => (
          <div key={card.title} style={{ flex: "1 1 0%", minWidth: 0 }}>
            <CardFlip card={card} onReadMore={() => setOpenIndex(i)} />
          </div>
        ))}
      </div>
      {openIndex !== null && (
        <CaseStudyPanel card={PRIMARY_CARDS[openIndex]} onClose={() => setOpenIndex(null)} />
      )}
    </>
  )
}

// Separate grid so it can be moved independently in Edit Mode.
export function KynhoodBentoCardsSecondary() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "var(--space-4)",
          width: "100%",
        }}
      >
        {SECONDARY_CARDS.map((card, i) => (
          <div key={card.title} style={{ flex: "1 1 0%", minWidth: 0 }}>
            <CardFlip card={card} onReadMore={() => setOpenIndex(i)} />
          </div>
        ))}
      </div>
      {openIndex !== null && (
        <CaseStudyPanel card={SECONDARY_CARDS[openIndex]} onClose={() => setOpenIndex(null)} />
      )}
    </>
  )
}

// Separate grid so it can be moved independently in Edit Mode.
export function KynhoodBentoCardsTertiary() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "var(--space-4)",
          width: "100%",
        }}
      >
        {TERTIARY_CARDS.map((card, i) => (
          <div key={card.title} style={{ flex: "1 1 0%", minWidth: 0 }}>
            <CardFlip card={card} onReadMore={() => setOpenIndex(i)} />
          </div>
        ))}
      </div>
      {openIndex !== null && (
        <CaseStudyPanel card={TERTIARY_CARDS[openIndex]} onClose={() => setOpenIndex(null)} />
      )}
    </>
  )
}

// Standalone card — not wired into the main Kynhood grids or the page. Drop it in wherever it's needed.
const EVENTS_PLUGIN_CARDS: CardData[] = [
  {
    title: "Events Content Plugin",
    subtitle: "30 minutes of mock-filling, down to 5 seconds",
    description: "While designing the events listing homepage at Kyn, I kept losing 30 minutes per stakeholder review just hand-filling mock cards with fake data. So I built a Figma plugin that does it in 5 seconds using real prod data.",
    features: ["Select a node or a whole screen — it finds every frame by name", "Pulls real prod-shaped event data automatically", "Handles free/paid pricing, dates, truncation, images", "Built during my first real dive into vibe coding"],
    accent: "#3b82f6",
    icon: "🗓️",
    image: "/gallery/kyncaseimg/plugin.jpg",
    span: 1,
    caseStudy: [
      {
        heading: "Events Content Plugin",
        body: "A little Figma plugin I built out of pure frustration while working on the events listing homepage at Kyn — because filling mock cards with fake data by hand, over and over, before every stakeholder review, was eating a chunk of my day.",
        meta: [
          { label: "Role", value: "Product Designer • Solo Builder", icon: "solar:user-id-bold" },
          { label: "Timeline", value: "A weekend, built out of frustration", icon: "solar:clock-circle-bold" },
          { label: "Platforms", value: "Figma Plugin API • TypeScript", icon: "solar:devices-bold" },
        ],
      },
      {
        heading: "The Problem I Kept Running Into",
        body: "I was working on the events listing at Kyn, specifically the homepage, and my job was to explore different layouts for how events could show up there — grids, carousels, featured rails, all sorts of variations.\n\nThe catch was, I couldn't just show stakeholders a layout with \"Event Title Here\" and \"₹XXX\" in every card. They needed to see it with real data — actual event names, actual prices, actual dates — because that's the only way a layout decision actually means anything. A grid that looks clean with placeholder text can fall apart the moment a real event title is 40 characters long.\n\nSo before every single review, I'd sit down and manually copy-paste real event names, prices, dates, and images into each mock card. Every layout variation meant doing this all over again.\n\nIt took me at least 30 minutes, every time.",
        list: [
          "Every new layout exploration meant re-typing real data into every card from scratch",
          "Multiple layout variations for the same review meant multiplying that 30 minutes",
          "Free events and paid events needed different price-chip styling, done by hand each time",
          "Long event titles needed to be checked against the real truncation rules, not guessed",
          "None of this was actual design work — it was just data entry standing between me and the review",
        ],
        image: { src: "/gallery/kyncaseimg/manual_fill.png", caption: "Events homepage layout explorations / Manual mock-filling in Figma" },
      },
      {
        heading: "Where the Idea Came From",
        body: "This was right around when vibe coding was starting to become a real thing — the idea that you could describe what you wanted and actually build small tools for yourself instead of just living with the busywork.\n\nI'd never really built a Figma plugin before, but the problem was so specific and so repetitive that it felt like exactly the kind of thing worth trying to automate:",
        quote: "What if I could just select my whole screen and have it fill itself with real event data automatically?",
      },
      {
        heading: "How It Actually Works",
        body: "I built it around how I already named my layers. Every card template had frames named things like \"title,\" \"price,\" \"date,\" \"area,\" and \"image\" — so instead of forcing myself into some new system, the plugin just reads the node and looks for those names.\n\nSelect a single card, and it fills that one. Select the whole screen — every card, every rail, every section — and it walks the entire tree and fills all of it in one shot. No need to click into each card individually.",
        list: [
          "Reads the frame/node names I was already using in my layouts",
          "Works on a single card or an entire selected screen at once",
          "Fills title, date, price, location, and image from real event data",
          "Applies the right price-chip color depending on free vs. paid",
        ],
        image: { src: "/gallery/kyncaseimg/plugin_ui.png", caption: "Plugin UI — category + event-type controls" },
        code: `// Walk selected nodes to find and fill text/image placeholders
async function populateNodes(nodes: readonly SceneNode[], data: EventData) {
  for (const node of nodes) {
    // Traverse descendants matching target template layer names
    const titleNode = node.findOne(n => n.name.toLowerCase() === "title" && n.type === "TEXT") as TextNode;
    const priceNode = node.findOne(n => n.name.toLowerCase() === "price" && n.type === "TEXT") as TextNode;
    const imageNode = node.findOne(n => n.name.toLowerCase() === "image" && n.type === "RECTANGLE") as RectangleNode;

    // Load fonts asynchronously (Figma API requirement) and overwrite text
    if (titleNode) {
      await figma.loadFontAsync(titleNode.fontName as FontName);
      titleNode.characters = data.title;
    }
    if (priceNode) {
      await figma.loadFontAsync(priceNode.fontName as FontName);
      priceNode.characters = data.isFree ? "Free" : \`₹\${data.price}\`;
    }

    // Load and apply network images as fill paints
    if (imageNode && data.imageUrl) {
      const img = await figma.createImageAsync(data.imageUrl);
      imageNode.fills = [{ type: "IMAGE", imageHash: img.hash, scaleMode: "FILL" }];
    }
  }
}`,
      },
      {
        heading: "Tweaks I Kept Adding",
        body: "Once the core version worked, I kept coming back to it and adding small controls whenever a new review needed something specific:",
        list: [
          "Category filters, so I could build a review deck that's all Sports events, or all Free events, whatever the stakeholder wanted to focus on",
          "A Free / Paid / Random toggle, with a slider to control roughly how much of the mix should be free vs. paid",
          "A separate mode to just drop real event images into plain image rectangles, for banner and hero explorations that didn't use the card template at all",
        ],
        image: { src: "/gallery/kyncaseimg/probability_slider.png", caption: "Free/Paid/Random toggle + probability slider" },
      },
      {
        heading: "What It Actually Saved",
        body: "This is the part that mattered most to me. What used to take 30 minutes of manual copy-pasting before every review became a single selection and one click — about 5 seconds.",
        groups: [
          { label: "Before", list: ["30+ minutes of manual data entry before every stakeholder review", "Every new layout variation meant redoing the fill from scratch", "Free/paid styling and truncation were whatever I remembered to do by hand"] },
          { label: "After", list: ["Select the screen, click once, done in seconds", "I could try five layout variations in the time it used to take to fill one", "Every mock automatically matched real production formatting rules"] },
        ],
      },
      {
        heading: "Reflection",
        body: "This wasn't a big product or anything I set out to build — it came from being annoyed at doing the same 30 minutes of copy-pasting before every single review. But that's honestly where this whole plugin came from: vibe coding was just starting to click for me, and it was the first time I actually built a tool for myself instead of just living with the busywork.\n\nOnce it worked, it changed how I worked. I stopped avoiding extra layout explorations because filling them was annoying, and started just trying more variations, because trying one now cost 5 seconds instead of 30 minutes.",
      },
    ],
  },
]

// Standalone card — not wired into the main Kynhood grids or the page. Drop it in wherever it's needed.
export function KynhoodBentoCardsEventsPlugin() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "var(--space-4)",
          width: "100%",
        }}
      >
        {EVENTS_PLUGIN_CARDS.map((card, i) => (
          <div key={card.title} style={{ flex: "1 1 0%", minWidth: 0 }}>
            <CardFlip card={card} onReadMore={() => setOpenIndex(i)} />
          </div>
        ))}
      </div>
      {openIndex !== null && (
        <CaseStudyPanel card={EVENTS_PLUGIN_CARDS[openIndex]} onClose={() => setOpenIndex(null)} />
      )}
    </>
  )
}
