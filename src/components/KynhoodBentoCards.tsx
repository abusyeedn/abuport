import { useState, useEffect, useRef, type CSSProperties } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Icon } from "@iconify/react"
import { useNavigate } from "react-router-dom"
import Lenis from "lenis"
import { FONTS, MOTION } from "../theme"
import { useZoomScale } from "./ViewportScaler"
import { useBreakpoint } from "../hooks/useBreakpoint"
import BackButton from "./BackButton"
import BackToTopButton from "./BackToTopButton"
import OtpInput from "./OtpInput"

const ACCESS_CODE = "786920"

function slugifyCardTitle(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}
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
  /** Heading shown above the flow's step chips - defaults to "User journey"
      since that's what `flow` almost always represents. Override for flows
      that aren't a user-facing journey at all, e.g. an internal dev/CI
      pipeline like Design Tokens -> Git -> Chromatic -> Storybook -> npm. */
  flowLabel?: string
  journey?: { label: string; substeps?: string[] }[]
  columns?: FlowColumn[]
  features?: FeatureItem[]
  groups?: ListGroup[]
  /** Same shape as `groups`, but laid out side by side as plain text - no
      card background/border. Use when two things just need to sit next to
      each other for comparison, not be visually boxed off. */
  plainGroups?: ListGroup[]
  /** Same items as `list`, but inside a tinted callout box (same accent
      treatment as `quote`) instead of a plain bullet list - for a set of
      points worth calling out rather than just enumerating. */
  highlightList?: string[]
  meta?: MetaItem[]
  quote?: string
  image?: { src: string; caption?: string }
  images?: { src: string; caption?: string }[]
  imagesLayout?: "row" | "column"
  /** True edge-to-edge, horizontally scrollable image - breaks out of the
      panel's max-width entirely (unlike `image`, which just bleeds a fixed
      amount). Used for wide multi-screen flow strips too tall/wide to fit
      the normal reading column. */
  scrollImage?: { src: string; caption?: string }
  iframe?: { src: string; height?: number; caption?: string }
  figmaEmbed?: string
  custom?: "kyn-ds-explorer" | "kyn-ds-components" | "kyn-ds-colors" | "kyn-ds-typescale" | "kyn-ds-spacing" | "neighbourhood-colors" | "neighbourhood-type-scale" | "neighbourhood-semantic" | "neighbourhood-size" | "neighbourhood-components" | "notify-notifications" | "marina-ipl-photos" | "chase-event-videos"
  cta?: { label: string; href: string }
  code?: string
}

export interface CardData {
  title: string
  subtitle: string
  /** Homepage-grid-only blurb with a concrete impact number - falls back to
      `subtitle` when absent. Kept separate from `subtitle` because that field
      also renders in the CaseStudyPanel detail-page hero, and this text
      shouldn't leak there. */
  homeBlurb?: string
  description: string
  features: string[]
  accent: string
  icon: string
  image: string
  /** Default 'cover' - set 'contain' when the cover source is a wide
      composite screenshot that shouldn't be cropped to fill the tile. */
  imageFit?: "cover" | "contain"
  caseStudy?: CaseStudySection[]
  span?: number
  /** Project facts (Role/Timeline/Platforms etc.) shown in the intro table -
      lives at the card level since it used to be duplicated as each case
      study's first "Overview" section, which was removed as redundant. */
  meta?: { label: string; value: string; icon: string }[]
}

const CARDS: CardData[] = [
  {
    title: "Helping organizers list their six-month scheduled complex events easily in six steps",
    subtitle: "Helping organizers list events that run for 6 months to a year without taking so much time",
    homeBlurb: "Convinced and onboarded 2 organizers in 6 weeks",
    description: "I designed a portal-level flow for organizers to configure events that repeat weekly, with dates, times, and ticket prices set independently per recurring slot, modeled on Outlook's recurring meeting option.",
    features: ["Repeating a time slot every week, until an end date", "\"This is a recurring slot\" checkbox under every time slot", "Different ticket pricing on different weekdays and weekends", "Interlocked flow: venue, then time, then ticket"],
    accent: "#b91c1c",
    icon: "🔁",
    image: "/gallery/kynhood/Frame 36.png",
    imageFit: "contain",
    meta: [
      { label: "Role", value: "1 PM • 1 Product Designer (me)", icon: "solar:user-id-bold" },
      { label: "Timeline", value: "6 Weeks", icon: "solar:clock-circle-bold" },
      { label: "Platforms", value: "Organizer Portal", icon: "solar:devices-bold" },
    ],
    caseStudy: [
      {
        heading: "Prologue",
        body: "So Kyn's portal is a platform for organizers to list their events.\n\nTo list an event, you might need a title, a description, a venue (or it is subject to the organizer, as they can actually list an online event as well), ticket price, time slot, and a date. All these things were already in place. For scaling purposes, we have made something new and very easy for organizers, who can now actually list the event for a week or even for a month.\n\nFor someone who has events for a week, or for one to three days, or maybe a month, it's actually easy to list an event compared to BookMyShow or District. With them, they get a call from their agent, ask for their details, and then it goes through manually, whereas this platform is actually self-serving.",
      },
      {
        heading: "Problem",
        body: "The issue came with scaling, where we didn't actually work to create easy workflows for organizers whose events run for around six months to one year. These organizers can actually list now as well, but it will definitely take three to four days just to list all the slots from month 1 to month 6, or for 12 months down the line. It's a tedious process.\n\nSo, we are solving for organizers to make the platform easy to use and help them list their daily running events or business which runs for 6 months to 1 year without taking so much time.",
      },
      {
        heading: "Initial Thoughts",
        body: "This problem was told by the business folks, and we had to solve it. So, we quickly asked for a dirty solution to run the show.\n\nProduct team thought the ops team could actually take on and list all this scheduling work in the platform for one to four vendors because there are very few, so we asked them to actually list that. But unfortunately, they also have a lot of other work to do, like closing tickets, refunds, and other tasks, and we had different features in the roadmap for that month back then.",
      },
      {
        heading: "Solutioning",
        body: "I was actually working on this feature completely, so obviously I have to take this and work on the design. The persona was very clear, we are actually solving a problem for an organizer whose events are very large in scale. Those events can actually bring business for us daily.\n\nI opened Mobbin and saw flows of other event listing platforms and benchmarked a few flows. Then I quickly built a simple prototype, where as soon as they enter their time and date, we can give them a calendar UI to mark dates they want. We'll also have quick filters like \"select weekends\" or \"select weekdays\" so they can filter based on that. With that they can select the dates they want to offer tickets.\n\nThis actually didn't work because after selecting all the dates, there were a lot of chips indicating which ones were selected and which ones were not. It was overloaded with too many clicks, and we didn't want to move forward with that. So, we stalled the solution right there.",
      },
      {
        heading: "Real Solution",
        body: "After discussing with my PM, then we had a very simple and interesting idea. There is Outlook, they already have a recurring meeting option (discovered from sprint meetings, retrospect meetings).\n\nI quickly went there and saw their recurring mechanism. They had a lot of customization where you can actually re-occur the meeting every week, every month, every year, or maybe bi-weekly. I actually took only one part, where we had to recur events based on weeks, I did a small wireframe out of that, and I picked the repeating slot every week. I focused on that particular mode alone.",
        list: ["Repeating for ___ days - until end date/occurrences", "Repeating for ___ weeks - until end date/occurrences (Approved by PM with only end date)", "Repeating for ___ months - until end date/occurrences", "Repeating for ___ yearly - until end date/occurrences"],
      },
      {
        heading: "",
        body: "Because it is the closest fit to the problem we have, we want to run events for months and years, and weeks can be something that covers both. While scaling, we target events for six months to one year, but there might be events which can run for two or three months also. Probably weeks can be the better fit for our targeted organizers. So we took the week.\n\nAlso, we didn't go for occurrences because the platform we already had was actually very favorable to start date and end date. So, we actually selected repeating for weeks until a particular end date.",
        image: {
          src: "/gallery/kyncaseimg/flow1.png",
          caption: "Venue and ticket selection process, recurring branch highlighted"
        },
      },
      {
        heading: "Flows & UI",
        body: "If you see in this image, you can see a small checkbox where it has written \"This is a recurring slot.\"\n\nHere is how this works:",
        list: ["Select your venue, then date and time.", "After creating the time slot, organizer will click \"This is a recurring slot.\" I have clearly marked out a tooltip so that it explains to them", "Once you click there, you will be able to see a modal that says \"Repeat this slot every week\" (the week and how many days is subject to the organizer to correct)."],
        images: [
          { src: "/gallery/kynhood/Frame 37.png", caption: "Multiple time slots under one location, each recurring independently" },
        ],
      },
      {
        heading: "",
        body: "I have placed \"repeat this slot\" under each time slot because, to make it scalable, you have to actually have this checkbox in every time slot if the organizer wants it for all time slots.\n\nI have added tooltips in a few places to help the organizers. With these tooltips, we actually have our internal folks who can guide the organizers while listing if they get stuck somewhere. Training will also always go on for new organizers as well. Regardless of that, we also have tutorial videos to help them. Because this is a specifically complex flow for them to list, we had to have all these things to support them.",
        image: {
          src: "/gallery/kynhood/Frame 38.png",
          caption: "Recurring Slot, set from an existing time slot"
        },
      },
      {
        heading: "",
        body: "As I was explaining before, the flow actually goes in sequence and it is interlocked. You have to select the venue, select the time, and connect the ticket. We made a flow like this to increase scalability and include major organizers.",
      },
      {
        heading: "Solving the Next Problem",
        body: "We solved a problem for the organizers where they wanted to have different pricing on different weekdays and weekends. For example, Saturday and Sunday expect the biggest crowds, so a business might choose to price that particular ticket at **₹1,000**. On the other hand, Wednesday and Thursday are the driest days for the business, so they want to offer a lower price to draw people in and fill the venue.",
        image: {
          src: "/gallery/kynhood/Frame 42.png",
          caption: "Stag and Couple tickets under the same time slot, scoped to Wednesday and Thursday"
        },
      },
      {
        heading: "",
        body: "As you can see in the image, we have different types of tickets called \"Stag\" and \"Couple.\" The Stag ticket is highlighted on Wednesday, and the Couple ticket is highlighted on Thursday.\n\nBasically, on Wednesday, the Stag ticket will be available for the audience to book. On Thursday, the Couple ticket will be shown to the audience. These will display based on the weeks selected by the organizers. That is how the tickets are listed as per the recurring slots. We solved this problem using the same approach. Since we have a continuation process covering venue, date, and time, the ticket price now also falls under the recurring block.\n\nSo, as per the time slot, if there are 3 months selected, for example, January 1 to March 30, which is actually around three months, the recurring mechanism works as: if the organizer selects \"every week\" until March 30, the tickets will repeat every week. If they select \"every two weeks,\" then one week will run the show, the next week will be skipped, and it will start again on the third week.\n\nThat is how it works, similar to the Outlook recurring mechanism.",
        scrollImage: {
          src: "/gallery/kynhood/Frame 39.png",
          caption: "Date step → recurring slot setup → per-day ticket pricing, in sequence"
        },
      },
      {
        heading: "Enhancement & Impact",
        body: "I would say the copy I have written, where it says \"occurs every one week until 13 December 2024\", needs to be changed because it is not very clear. It should be something like \"occurs every week,\" or if they have selected two, then the copy could say \"occurs every fortnightly\" or something similar. This will help them understand exactly what they have selected. That is one enhancement I can see.\n\nI would say the impact of this feature was that it convinced and onboarded **two organizers** in about six weeks. Later, the business team pitched to a few organizers, and they were showing interest in getting onboarded into this platform as soon as it is live. So, that is what led to this feature.",
      },
    ],
  },
  {
    title: "Helping users on the platform handle high-volume transaction booking spikes on the launch day of big concerts",
    subtitle: "Launch-day traffic booking funnel",
    homeBlurb: "Rebuilt after a 12K-buyer launch-day crash, ~20% of organizers signed on after",
    description: "I have redesigned the event booking flow to handle high transaction volumes and booking spikes by implementing a pre-booking system.",
    features: ["Free & paid registration options", "Token fee redeemed against a discounted ticket price, forfeited if unclaimed", "Phase windows organizers set through the portal", "Automatic phase switching + edge-case handling"],
    accent: "#077a4b",
    icon: "📋",
    image: "/gallery/aa1.jpg",
    meta: [
      { label: "Role", value: "1 PM • 1 Product Designer (me)", icon: "solar:user-id-bold" },
      { label: "Timeline", value: "3 Weeks (design + product 1 week)", icon: "solar:clock-circle-bold" },
      { label: "Platforms", value: "Android • iOS • Web • Organizer Portal • Titan CMS", icon: "solar:devices-bold" },
    ],
    caseStudy: [
      {
        heading: "What Happened",
        body: "Kyn is an events platform, and we'd secured exclusive rights to list a concert for the singer Yuvan Shankar Raja. Around 6:30 PM, **12,000 people** hit the app at the same moment, and it crashed under them. Only about **4,000 people** made it through to a ticket. We lost a critical buying window to that experience, and it wasn't a small dent, it was the moment that mattered most for this launch.\n\nThe core issue was that we hadn't scaled the infrastructure in time. The payment aggregator crashed outright, and the sheer transaction volume hitting the bank caused failures on its own, on top of everything else.\n\nEarly bird pricing added to it. Tickets were priced low at first, say **₹5,000**, then bumped up to **₹7,000** after a few days. Marketing always promotes early bird tickets heavily, they're selling out fast, so grab yours now, and that pushed even more people to rush in the moment sales opened, adding to the exact crash we were already dealing with.",
        image: {
          src: "/gallery/kyncaseimg/flow21.png",
          caption: "Traffic spike on the Yuvan Shankar Raja launch"
        },
      },
      {
        heading: "Solutioning",
        body: "We initially had a very rough idea of what we were doing and wanted to move quickly. We had only one thing in mind, to set up pre-booking and booking. We confirmed with the leadership team in our office and decided to go ahead with pre-booking.\n\nSo we moved to pre-booking through paid registration instead, spreading that same rush out over a window instead of one moment. We're not claiming we invented anything new here, plenty of other apps already run early bird offers and pre-booking in some form, we just coined our own term for how we built it.",
      },
      {
        heading: "How the Token Fee Works",
        body: "Users pay a small token amount upfront, which secures their spot and is later redeemed against the actual ticket price once booking opens. If someone doesn't come back to complete that final purchase, the platform keeps the token fee, it isn't refunded. Pre-booking also carries a discounted ticket price compared to general booking, and that discount is the main reason buyers register early in the first place.",
        flow: ["Register and pay the token fee", "Wait for the pre-booking window to open", "Pay the remaining discounted amount to confirm the ticket"],
        image: {
          src: "/gallery/kynhood/Frame 31.png",
          caption: "Paid registration, token fee redeemed against the discounted ticket"
        },
      },
      {
        heading: "",
        images: [
          { src: "/gallery/kynhood/Frame 33.png", caption: "Pre-booking window" },
          { src: "/gallery/kynhood/Frame 34.png", caption: "Pre-booking, booking in progress" },
        ],
        imagesLayout: "column",
      },
      {
        heading: "One More Requirement, Free Registration",
        body: "Beyond large concerts, Kyn also supports smaller events and invite-only communities, an organizer hosting at their own home, a small workshop, a closed community meetup. That introduced a second requirement, free registration.\n\nFor these events, organizers need to handpick who attends. Users submit a questionnaire first, and once the organizer approves them, they can go ahead and book. We needed both flows, free and paid, to run through the same system without either one feeling bolted on.\n\nThe flow itself is simple, you register, fill out the questionnaire, wait for the organizer to approve you, and once approved, you book your tickets.",
        flow: ["Register", "Fill questionnaire", "Await organizer approval", "Approved", "Book tickets"],
        image: {
          src: "/gallery/kynhood/Frame 32.png",
          caption: "Free registration, organizer questionnaire"
        },
      },
      {
        heading: "Listing an Event on the Portal",
        body: "Organizers only get the standard stuff on the portal, listing an event and picking how people get in, direct booking, paid pre-booking, or questionnaire-based free registration. No engineering support needed on their side.",
        list: ["Free or paid registration", "Registration fee amount"],
        image: {
          src: "/gallery/kynhood/Frame 35.png",
          caption: "The organizer portal, listing an event with Registration First"
        },
      },
      {
        heading: "Controlling Events on Titan",
        body: "Everything past the standard stuff is monitored through Titan (internal CMS platform), the portal just runs with Titan behind it. A user can only register once, duplicate attempts are blocked outright, registration count can never exceed available inventory, and events move between phases on their own, on the dates the organizer set, so nobody has to flip a switch manually mid-launch.",
        list: ["Registration open/close window", "Custom questionnaires", "Approval workflow", "Registration capacity limits", "Automatic transition into booking"],
      },
      {
        heading: "",
        images: [
          { src: "/gallery/kyncaseimg/flow20.png", caption: "Registration flow" },
          { src: "/gallery/kyncaseimg/flow22.png", caption: "Booking flow" },
        ],
      },
      {
        heading: "Impact",
        body: "This system is live, and it delivered immediate operational improvements. We acquired **20% more organizers** after this feature was pitched to them, and peak traffic spikes now smooth out into predictable, manageable intervals instead of one crash moment. It also cut the need for excessive infrastructure spend, since we're managing demand efficiently now instead of just absorbing it.\n\nPost that, the discussion moved to how we could push this further, adding early bird tags and the UI to show them, and working out how to encourage more people to actually buy into pre-booking, discounts and similar nudges included.",
      },
    ],
  },
  {
    title: "A real-time multiplayer cricket quiz app with live emcee control and a leaderboard",
    subtitle: "Live multiplayer cricket quiz",
    homeBlurb: "Live multiplayer quiz, 150+ concurrent players at Marina Mall's IPL screening",
    description: "I designed a real-time multiplayer cricket quiz app with live emcee control, concurrent phone gameplay, and a real-time leaderboard.",
    features: ["One shared game state for everyone", "Admin dashboard the emcee fully controlled", "Live leaderboard + Rethink Mode", "150+ people playing at once"],
    accent: "#077a4b",
    icon: "🏏",
    image: "/gallery/kyncaseimg/chase_and_cheer_cover.png",
    meta: [
      { label: "Role", value: "Product Designer • Solo Builder", icon: "solar:user-id-bold" },
      { label: "Timeline", value: "3 Days", icon: "solar:clock-circle-bold" },
      { label: "Platforms", value: "Mobile Web • Web (Lovable)", icon: "solar:devices-bold" },
    ],
    span: 1,
    caseStudy: [
      {
        heading: "A New Format for the Next Screening",
        body: "Kyn partners with brands, malls, pubs, and event organizers to build interactive experiences around live events.\n\nWe'd already run one of these, Chase & Cheer, with partners like Jyke & Hydell and a few other venues. It worked, turns out a live game genuinely pulls people into a cricket screening instead of letting them zone out in the background.\n\nWhen Marina Mall signed on for their IPL screening, the business wanted something new this time, not a repeat of Chase & Cheer but a fresh format entirely.\n\nI got pulled in to build it, same spirit, same idea behind it, just a different experience for people at the screening.\n\nWhat I ended up shipping, as a side project, was a real-time multiplayer cricket quiz. An emcee ran the whole thing while hundreds of people played along from their phones, competing live on a shared leaderboard.\n\nOn the night it held up past **150 people playing at once**, and kept the crowd engaged right to the end of the screening.",
        custom: "marina-ipl-photos",
      },
      {
        heading: "Business Requirement",
        body: "The goal was never to replace Chase & Cheer, that had already proven itself at multiple venues.\n\nWhat the business actually needed was another format to pull out for future partnerships and big screenings. The brief was pretty open, but a few things weren't negotiable. Whatever I built had to.",
        image: {
          src: "/gallery/flow3.png",
          caption: "Chase & Cheer, non-negotiable requirements"
        },
      },
      {
        heading: "My Approach",
        body: "I didn't want players clicking through their own private quiz, that felt more like a form than a live event. So the whole platform was built around one shared game state instead.\n\nEvery participant sees the exact same screen at the exact same moment. The second the emcee starts a question.",
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
        body: "Nothing exotic here, a pretty standard modern real-time web stack, chosen for how fast I could build with it, not for novelty.",
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
            body: "No app to install, players just jumped in from their phones. Once the emcee hit start, everyone was in it together, live.",
            image: {
              src: "/gallery/kyncaseimg/chase_cheer_gameplay.png",
              caption: "Live gameplay, player answering questions on mobile"
            },
          },
          {
            title: "Admin Dashboard",
            body: "This is where the emcee actually ran the show.",
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
              caption: "Live leaderboard, All-Time rankings updating in real-time"
            },
          },
          {
            title: "Rethink Mode",
            body: "Some questions got flagged as Rethink Questions, players got a second shot at them later on, with points scaled to how many attempts they got right. Honestly ended up being one of the more fun mechanics in the whole thing.",
          },
          {
            title: "Quiz Sessions",
            body: "Organizers could save a full quiz and reload it for the next event instead of rebuilding it from scratch, that's what makes the whole thing reusable.",
          },
        ],
      },
      {
        heading: "Real-Time Synchronization",
        body: "Keeping everyone in sync was honestly the hardest part of building this.\n\nEvery time the admin changed something, a new question, the timer, a reveal, it had to hit every connected phone at basically the same instant, no refresh required. All of that ran through Supabase Realtime subscriptions.\n\nInstead of juggling local state per device, I kept one shared piece of state that everyone read from.\n\ninterface GameState {\n  activeQuestion: string | null\n  status: \"waiting\" | \"active\" | \"ended\"\n  isLocked: boolean\n  correctAnswerRevealed: boolean\n}\n\nWhen the emcee hit Start Question, this is what fired.\n\nawait supabase\n  .from(\"game_state\")\n  .update({\n    active_question: question.id,\n    status: \"active\"\n  })\n\nThat update reached every player almost instantly. Answers got saved the same way, independently per player.\n\nawait supabase\n  .from(\"responses\")\n  .insert({\n    participant_id,\n    question_id,\n    answer\n  })\n\nAnd scoring only ran once the admin revealed the correct answer, never before.",
      },
      {
        heading: "Event Outcome",
        body: "This ran live at Marina Mall's IPL screening. Here's roughly how the night went.",
        highlightList: [
          "**150+ people** stayed connected at the same time",
          "The app held up the whole night, running until around **11 PM**",
          "The emcee could watch participant counts and responses live from the dashboard",
          "Leaderboards updated instantly after every question",
          "People stayed engaged between overs instead of just watching the screen",
          "Sponsors got repeated visibility through branded questions and interactions",
        ],
        custom: "chase-event-videos",
      },
      {
        heading: "Business Impact",
        body: "What this taught me is that good audience engagement isn't really about clever questions, it's about making people feel like they're in it together. Once the gameplay, scoring, and leaderboard were all in sync, the quiz stopped feeling like a side activity and started feeling like part of the match itself. And it's a good reminder that a scrappy MVP, built fast, can still hold up with **150+ people playing live at once**.",
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
    ],
  },
  {
    title: "A PoC using Android notifications to sync booking inventory in real time",
    subtitle: "Notification-driven inventory sync",
    homeBlurb: "2-day MVP an organizer offered ₹5,000/month for, unprompted",
    description: "I built a PoC using Android notifications as an integration layer to synchronize booking inventory in real-time.",
    features: ["Android notification listener", "A deterministic booking parser", "Automatic slot blocking via API", "Built in 2 days, with Claude's help"],
    accent: "#077a4b",
    icon: "◈",
    image: "/gallery/pics/Video_1.mp4",
    meta: [
      { label: "Role", value: "Product Designer • Solo Builder", icon: "solar:user-id-bold" },
      { label: "Timeline", value: "2 Days", icon: "solar:clock-circle-bold" },
      { label: "Platforms", value: "Android • Admin Web • Claude Code", icon: "solar:devices-bold" },
    ],
    span: 1,
    caseStudy: [
      {
        heading: "An Inventory Problem With No Clean Fix",
        body: "While working on Kyn, I was exploring ways to solve one of the bigger problems in venue booking, **inventory sync**.\n\nUnlike airlines or cinemas, sports turfs and activity centers don't share a common inventory protocol. Most venue owners list the same slot across several booking platforms, and none of those platforms expose APIs that would let inventory stay in sync.\n\nThe long-term vision was something like ONDC for slot-based venues, a shared inventory layer any booking platform could plug into. But that needs buy-in from big industry players, which makes it a long game, not something I could ship soon.\n\nAs a short-term experiment, I was asked to look at whether I could automate inventory updates without needing any APIs at all.\n\nIn **two days**, I had a working PoC that used Android notifications as the integration layer instead.\n\nIt was only a demo, but it proved the core idea, that notifications could be turned into real-time inventory events.",
      },
      {
        heading: "Where the Idea Started",
        body: "Whenever a booking happens on platforms like TurfTown or District, venue managers get a confirmation notification on their phone right away.\n\nThat got me thinking, if the booking info is already showing up in a notification, do I actually need an API integration at all?\n\nMaybe instead of integrating with the booking platforms directly, I could just integrate with the notifications they were already sending.\n\nThat one idea became the entire MVP.",
        custom: "notify-notifications",
      },
      {
        heading: "Why I Didn't Build APIs",
        body: "The original vision was a lot bigger than this.\n\nWe wanted a unified inventory protocol for slot-based venues, similar to how cinema chains keep seat availability in sync across different ticketing platforms.\n\nBut that only works if multiple big players agree to participate. And since no shared protocol existed, and competitors had zero incentive to open up their APIs, I needed a different way to test the idea.\n\nThis notification-based approach was built to answer one question.\n\nCan I sync inventory automatically without needing any cooperation from other platforms at all?",
      },
      {
        heading: "The Business Problem",
        body: "One of our venue partners, VGP Turf Arena, had their inventory listed across multiple platforms, including TurfTown and District.\n\nSo if someone booked a slot on one platform, staff had to go and manually block that same slot inside Kyn. Miss that step even once, and you've got a double booking.\n\nThe workflow looked something like this.",
        image: {
          src: "/gallery/flow1.png",
          caption: "The manual venue booking process, before automation"
        },
      },
      {
        heading: "My Goal",
        body: "Simple as it was, this whole workflow depended on someone remembering to do every step, every time. So the goal became building a lightweight Android app that could.",
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
        body: "Since this was an exploration project, I optimized for speed over polish. The whole thing came together in about two days, using Claude to help prototype the architecture and implementation quickly. Here's the stack.",
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
          caption: "Notification Hub app, requesting notification access permission"
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
        heading: "Parser logic, notification text to structured payload",
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
        body: "Once the prototype was working, I showed it to one of our organizer partners.\n\nGoing in, I figured this could be a ₹500/month add-on feature at best.\n\nThe conversation went somewhere different.\n\nThe organizer explained that whenever double bookings happened, they'd usually deal with it manually, by either.",
        list: ["Offering another slot", "Giving customers a **50% discount**", "Refunding part of the booking"],
      },
      {
        heading: "The Pricing Shift",
        body: "Their existing process worked, technically, but it ate up operational time and hurt the customer experience.\n\nThe moment I showed automatic inventory sync, they got it immediately.\n\nWhat surprised me was they said they'd happily pay around **₹5,000 a month** for something reliable, because preventing even a handful of double bookings a month would save them way more than that.\n\nThat one conversation completely changed how I thought about pricing this.",
      },
      {
        heading: "Key Learnings",
        body: "This project taught me that validating a business idea doesn't need months of development.\n\nSometimes a small, working prototype is enough to start a real conversation with a customer.\n\nOn the technical side, I learned how far Android's Notification Listener framework can be stretched beyond what it was built for, and how you can get event-driven architecture without any direct platform integration.\n\nBut the bigger product lesson was understanding the difference between solving a technical problem and solving an operational one.\n\nThe organizer wasn't really buying a notification parser.\n\nThey were buying peace of mind.",
      },
      {
        heading: "What's Next?",
        body: "This MVP did what it needed to do, but it was never meant to be the final answer.\n\nThe bigger vision is still the same one, a dedicated inventory layer for slot-based venues that plugs directly into multiple booking platforms, closer to how centralized inventory works in cinema or hospitality.\n\nWhat this prototype actually proved is that the problem was worth solving, and that people were genuinely willing to pay for a better fix.\n\nAnd it did all that in two days, enough to validate both the technical feasibility and the commercial case for notification-driven inventory sync.",
      },
    ],
  },
  {
    title: "Helping Gen Z pay for high-priced tickets by splitting the money",
    subtitle: "Reservation-based ticket payments",
    homeBlurb: "Split payments that turned stranger group trips into real, completed bookings",
    description: "I designed a payment feature that lets users reserve premium event tickets with a percentage deposit, reducing checkout drop-offs.",
    features: ["Configurable 25/50/75% payment splits", "A new \"Reservation Confirmed\" booking state", "QR ticket withheld until balance is cleared", "Reminders across push, inbox, and WhatsApp"],
    accent: "#077a4b",
    icon: "💳",
    image: "/gallery/aa3.jpg",
    meta: [
      { label: "Role", value: "1 PM • 1 Product Designer (me)", icon: "solar:user-id-bold" },
      { label: "Timeline", value: "8 Weeks", icon: "solar:clock-circle-bold" },
      { label: "Platforms", value: "Android • iOS • Mobile Web • Organizer Portal • Titan CMS", icon: "solar:devices-bold" },
    ],
    caseStudy: [
      {
        heading: "Why Tickets Cost More",
        body: "We had about 20 to 30 organizers listing micro events on Kyn at this point, and that side of the business was break-even at best. We were putting in **₹5,000 to ₹10,000** of our own money just to market some of these listings, so the volume was real but it wasn't turning into revenue.\n\nThe only way to make real money was a big concert, listed exclusively on Kyn. Getting that exclusivity meant offering the organizer a minimum guarantee, a fixed payout regardless of how many tickets sold. As a rough example, a concert costing around **₹6 crore** to put on could mean a guarantee close to **₹2 crore**. As a startup paying that, we had to recover it, and ticket sales were the only lever we had, so concert tickets on Kyn were priced a notch above market rate, sometimes ₹500 to ₹1,000 higher than the same seat elsewhere. It was a deliberate management call, not an accident.\n\nThat premium is also why the audience mattered. Kyn leaned into new-age, Gen Z, rap, and pop artists, alongside some retro legends like Ilaiyaraaja and Deva, and the people buying those tickets were mostly early-career earners on **₹30,000 to ₹40,000 a month**. A ₹10,000 ticket at a premium was a genuine ask for that audience, which is exactly why they needed a way to split it.",
      },
      {
        heading: "Prices Outpacing Users",
        body: "Ticket prices on Kyn were climbing fast as Kyn onboarded bigger concerts, from an average of **₹4,000 to ₹10,000**. Our core audience skewed Gen Z and early-career earners, and for a lot of them, **₹10,000 upfront** just wasn't a number they could commit to in one shot. They wanted to go. They just needed to **split the payment**.",
        image: {
          src: "/gallery/kyncaseimg/flow14.png",
          caption: "Existing booking flow"
        },
      },
      {
        heading: "BNPL first, then a rethink",
        body: "Our first instinct was Buy Now Pay Later. We already had BNPL surfaced through our payment gateway, JustPay, so I added a label at checkout so people could see it was available. It barely moved the needle. The extra step into a separate BNPL flow, on a platform people didn't fully trust yet, killed adoption, we ended up with two or three users on it total, mostly through Ola Money, likely for GST or corporate-expense reasons rather than wanting a split payment.\n\nThe next question was whether we build our own payment infrastructure, something closer to what JustPay itself runs as a gateway. Realistically, that's not something you build casually at any team size, even a few thousand engineers would barely pull it off, and we had 20. It was never a real option for us.\n\nSo we looked at what everyone else was doing instead. District already had a plain 50% now, 50% later split live, and several smaller ticketing sites were running Slice's split-pay product directly. We were already late to this, and there's nothing wrong with taking inspiration from a competitor who had more money and more people to spend on it, it was just my PM and me figuring this out with no one else to call on. Getting to parity fast mattered more than being precious about originality, so seeing it working elsewhere settled the direction, build a lightweight, configurable split we controlled end to end, rather than wait on a full BNPL integration.",
        quote: "Can someone lock in a seat with part of the price today, without the organizer losing control of their own inventory?",
      },
      {
        heading: "How it actually works",
        body: "Every ticket aggregator soft-books a seat the moment you start checkout, usually a 10-15 minute hold before it's released back into inventory. Partial Payments is that same mechanism, stretched.\n\nInstead of a 10-15 minute hold, the organizer sets a real deadline for the event, a few days, a few weeks, sometimes longer. Pay the first split, and the seat is held for you until that date. Miss it, and the hold expires like any other soft-booked seat, back into stock.",
      },
      {
        heading: "The split",
        body: "At checkout, a user chooses to pay in full or reserve the seat with a split payment. Me and my PM went back and forth on whether the split should be fixed or user-chosen, and landed on organizer-configured presets instead of a free-for-all, it kept the system predictable on both ends. This got us parity with what District already had, and the presets being organizer-configurable, instead of one fixed 50/50, was where we actually differentiated. We settled on 25/75, 50/50, and 75/25 as the standard presets, with a custom amount, something like ₹2,000 now and the rest later, available on request through Titan (internal CMS platform).",
        list: ["25% Now • 75% Later", "50% Now • 50% Later", "75% Now • 25% Later"],
      },
      {
        heading: "The Flow I Had in Mind",
        body: "The flow I designed was simple, open the event, go to the tickets page, decide right after that whether to pay in full or split, then land on a payment summary. Decide first, see the summary second. It's close to how most competitors run this flow too, and it's the one I took into engineering.",
        list: ["Event detail page", "Ticket selection", "Split or full payment decision", "Payment summary"],
        image: {
          src: "/gallery/kyncaseimg/flow15.png",
          caption: "Reservation Journey Flow"
        },
      },
      {
        heading: "Reserved isn't confirmed",
        body: "A partial payment doesn't create a normal booking, it creates a new state, Reservation Confirmed, sitting between browsing and fully booked. The QR ticket stays locked until the balance clears, only an invoice is available until then, so no one can walk into an event on a reservation alone.\n\nFinishing the payment is reachable from wherever the user actually is, My Bookings, the event page, the notification inbox, or a WhatsApp reminder.",
        image: {
          src: "/gallery/ui-playground/Frame 13.png",
          caption: "Checkout / Reservation confirmation"
        },
      },
      {
        heading: "Where the split had to show up",
        body: "The split couldn't just be explained once at checkout, it needed to be visible at the two moments that actually mattered. Which tiers even got this option was also a deliberate call, not every tier needed it. Bronze and silver, the cheaper tiers, were already selling out on their own, so we left them alone, and VIP, the priciest tier, moved on its own too. **The data showed close to half of inventory going unsold on a given event, and it was concentrated in Gold and Diamond, priced high enough to stall at checkout but not exclusive enough to sell regardless.** Partial payments went on exactly those tiers.",
        list: [
          "Ticket selection: only the tiers an organizer enabled for partial payment carry a \"Pay only 50% to reserve now\" badge, so a user knows whether splitting is even on the table before they tap a ticket, not after.",
          "Ticket Summary: a banner states the exact math in plain language, pay ₹X now and the rest by a specific date, with \"To Pay Now\" and \"To pay by [date]\" broken out as two separate totals instead of one blended number the user has to work out themselves.",
        ],
        image: {
          src: "/gallery/kynhood/Frame 41.png",
          caption: "Partial-payment badge on eligible tickets, and the split breakdown at checkout"
        },
      },
      {
        heading: "What organizers control",
        body: "This lives entirely inside Titan (internal CMS platform), not a self-serve organizer dashboard. Organizers don't flip these settings themselves, they call us, and someone on our side makes the change in Titan. Every one of these stayed a business call we made per event, not something handed off.",
        list: ["Partial payment availability", "Supported split percentages", "Eligible ticket types", "Payment deadlines", "Refund or forfeiture rules"],
        image: {
          src: "/gallery/kyncaseimg/flow17.jpg",
          caption: "Titan configuration / Analytics dashboard"
        },
      },
      {
        heading: "Keeping it fair",
        body: "A longer hold on less money is easy to abuse if you don't close the obvious gaps.",
        list: [
          "One active reservation per user at a time, no stacking holds.",
          "Expired reservations release inventory back into stock automatically.",
          "Reservation tickets carry the same scarcity signals as regular ones, including \"last tickets left.\"",
          "Booking exports include reservation-specific data, split percentage, amount paid, and status, for reporting.",
        ],
        image: {
          src: "/gallery/kyncaseimg/flow18.jpg",
          caption: "Error states"
        },
      },
      {
        heading: "Proof in a Real Booking",
        body: "There wasn't a concert lined up to test this on right after launch, so the first real use was on curated group trips, **stranger meetups** an organizer ran for people who wanted to travel together, priced around **₹10,000 to ₹12,000** and listed a month or two ahead of the trip. Exactly the kind of ticket that stalls at checkout, a stranger, a few thousand rupees, no urgency to pay it all today. Even on a run that small, just **10 tickets** on offer, people used the split, which was the first real signal that the feature held up outside a spreadsheet.",
      },
      {
        heading: "Engineering vs. Design",
        body: "This surfaced first on those **stranger group trips**, where the organizer told us people were hesitating and dropping off right at the summary-page decision step, the exact friction I'd flagged going in. My original flow put the split-or-full decision **right after the tickets page**, before the summary, because on every other event without partial payments a user goes from tickets straight to summary straight to checkout, never expecting anything to split. If splitting only showed up on that same summary page, it read as bolted on, not offered upfront, tickets-page-first was the only place a user would register that splitting was even possible before they'd already mentally committed to paying in full.\n\nEngineering's side was simple. Our pricing was already built so that the ticket price, **GST**, **registration fee**, and any discount get added up into one final amount only on the payment summary page. So the flow ran tickets page into summary, and summary into checkout, and the final number existed only at the summary. Asking \"pay full or split?\" before that meant changing how the pricing itself was built, while asking it after the summary was easy, because the amount was already final by then. We had planned **one month** for this and it had already stretched to **two**, with competitors already live, so my PM and I chose to ship engineering's version as it was and fix the flow later. A middle path was to show an **indicative split** right after ticket selection with a \"confirmed at summary\" note, but we couldn't build it in time. We never tested how much drop-off this caused, we only have the organizer's word, and the fix is still waiting behind other work on a small team.",
      },
      {
        heading: "Impact",
        body: "I don't have full numbers beyond what I tracked directly. The stranger group trip only had **10 tickets** on offer, at **₹12,000 each**, and people still used partial payments on a run that small. Across that trip and the other small, niche experience events we onboarded with partial payments, adoption sat around **3 to 4%**. That's still slow, and I'd expect it to climb once there's a longer run of events to build the habit on, not just one or two. It's since gone live on **KYN Live 2.0, The Crossover**, a fusion concert with Shruti Haasan and Benny Dayal, but I'd already moved on from the company by then, so I don't have real adoption numbers for how it's held up there.",
      },
    ],
  },
  {
    title: "Helping 40,000 users and organizers with an inbuilt QR validation system to make operations easy",
    subtitle: "Scalable multi-gate QR validation",
    homeBlurb: "35,000+ gate scans, zero downtime, even at full DB load",
    description: "I built a multi-gate, multi-location QR validation system and operations dashboard with live attendance analytics.",
    features: ["Context-aware validation (date, slot, venue, ticket type)", "Volunteer access with revocable permissions", "Live attendance analytics inside the scanner", "Location, date, and slot filters"],
    accent: "#077a4b",
    icon: "📷",
    image: "/gallery/aa2.jpg",
    meta: [
      { label: "Role", value: "1 PM • 1 Product Designer (me)", icon: "solar:user-id-bold" },
      { label: "Timeline", value: "6-8 Weeks", icon: "solar:clock-circle-bold" },
      { label: "Platforms", value: "Android • iOS • Mobile Web • Organizer Portal • Titan CMS", icon: "solar:devices-bold" },
    ],
    caseStudy: [
      {
        heading: "Starting With One Gate",
        body: "At the time, Kyn was listing around **30-40 events a month**, mostly from small organizers running their own gigs, meetups, and local shows. Gate validation, some way to check a ticket at the door instead of eyeballing a screenshot, was a recurring ask from that group. Competitors like District and BookMyShow already had QR validation live; we had nothing, so this wasn't a nice-to-have, it was table stakes we were starting from zero on.\n\nBecause the early demand was coming from small organizers, that's who I designed the first version for: one gate, one device, a straightforward scan-and-confirm. I wasn't building for a multi-gate, multi-thousand-attendee event yet, because at that point, we didn't have one on the platform.",
        image: {
          src: "/gallery/flow11.png",
          caption: "Event operations / Organizer requirements / User journey"
        },
      },
      {
        heading: "Then a Concert Rewrote the Scale",
        body: "That assumption held until Kyn onboarded a concert with singer Yuvan Shankar Raja, the same launch that forced the rework of Registration elsewhere on this page. It was the first event on the platform with **multiple gates**, multiple time slots, and **thousands of attendees** hitting the scanner within the same few hours, and the single-gate version built for a 30-40-event catalog wasn't built for that.\n\nThe scanner had to become multi-location and multi-slot aware, fast, in parallel with the rest of the feature work already in flight, which is the real reason this took **6-8 weeks** instead of the couple of weeks a single-gate scanner would have.",
      },
      {
        heading: "Understanding the Problem",
        body: "Through discussions with event organizers, I identified four major operational challenges.",
        quote: "The challenge wasn't just building a QR scanner, it was creating a complete event operations tool, from scratch, based entirely on what organizers actually needed.",
      },
      {
        heading: "Pain Points",
        painPoints: [
          "A single organizer couldn't handle ticket validation at **multiple gates**.",
          "Volunteers had to share organizer credentials, creating **security risks**.",
          "There was **no live visibility** into bookings, attendance, or ticket consumption while the event was running.",
          "QR validation had to consider the correct **location, event date, and time slot** to prevent invalid check-ins.",
        ],
      },
      {
        heading: "Solution",
        body: "I redesigned the QR validation experience into a dedicated Manage Event module inside Titan (internal CMS platform), Kyn's organizer admin panel.\n\nThe new experience combined.",
        highlightList: ["QR scanning", "Volunteer management", "Live attendance analytics", "Multi-location filtering", "Slot-based validation", "Booking exports"],
      },
      {
        heading: "Key Features & Product Decisions",
        body: "Instead of just \"I built QR validation,\" here's why each feature exists and what business problem it solves.",
      },
      {
        heading: "Manage Event, A Single Operational Dashboard",
        body: "Originally, organizers only had a Booking Details button in Titan (internal CMS platform) that exported attendee information. Once the event started, they had to switch between different screens to monitor attendance, scan QR codes, and check booking counts.\n\nTo simplify operations, I introduced a dedicated Manage Event module within Titan. Instead of acting as another page, it became the operational hub for organizers before and during the event.\n\nIt brought together.",
        list: ["Live attendance statistics", "QR validation", "Booking exports", "Volunteer management", "Ticket analytics"],
        quote: "This reduced navigation during live events, where every second matters.",
        image: {
          src: "/gallery/kyncaseimg/flow5.png",
          caption: "Manage Event Dashboard (Titan)"
        },
      },
      {
        heading: "QR Validation Built Around Event Context",
        body: "Scanning a QR code wasn't enough because a single event could contain multiple venues, dates, and time slots.\n\nThe validator first verifies whether the attendee is arriving at the correct location, event date, time slot, and ticket, before allowing entry.\n\nInstead of displaying a generic \"Invalid QR,\" the scanner explains exactly why validation failed. Examples include.",
        list: ["Wrong venue", "Wrong event date", "Too early for entry", "Ticket already scanned", "Invalid ticket"],
        quote: "This helps volunteers resolve issues immediately without calling organizers.",
        image: {
          src: "/gallery/kyncaseimg/flow6.jpg",
          caption: "QR Scanner / Success & Error States"
        },
      },
      {
        heading: "Why Multiple Tickets Appear After Scanning",
        body: "One attendee can purchase multiple ticket types under a single booking, for example, a booking with 2 Gold tickets, 2 VIP tickets, and 1 parking pass.\n\nAlthough all of them belong to one booking, each ticket represents a different QR validation record. When the QR is scanned, the system first identifies every valid ticket linked to that booking.\n\nIf multiple tickets are available, a bottom sheet appears showing.",
        list: ["Ticket type", "Event date", "Time slot", "Venue"],
        quote: "The organizer or volunteer selects which ticket is entering. If only one ticket exists, the system skips this screen entirely for a faster experience, this prevents accidentally validating the wrong ticket while keeping the scan flow efficient.",
        image: {
          src: "/gallery/kyncaseimg/flow7.jpg",
          caption: "Ticket Selection Bottom Sheet"
        },
      },
      {
        heading: "Volunteer QR Validation",
        body: "Large events often have several entry gates. Relying on one organizer to scan every attendee creates long queues and delays.\n\nInstead of sharing organizer credentials, I designed a volunteer access system. Organizers can.",
        list: ["Enable volunteer scanning.", "Invite volunteers using their mobile number.", "View volunteer history.", "Revoke access at any time."],
        quote: "Volunteers log in using their own accounts and receive access only to the Validate QR feature. This role-based permission keeps administrative controls secure while allowing multiple people to scan simultaneously. Even if access is revoked during scanning, the current validation completes before the volunteer is logged out, preventing attendee disruptions.",
        image: {
          src: "/gallery/kyncaseimg/flow8.jpg",
          caption: "Volunteer Flow"
        },
      },
      {
        heading: "Why the Scanner Stays Deliberately Minimal",
        body: "The obvious move here would've been a richer, more visual scanning screen, bigger cards, live thumbnails, color-coded status everywhere. I went the other way on purpose.\n\nVolunteers scan for four to five hours straight, often outdoors, in direct sunlight, on their own phone's battery. A heavier screen means worse glare legibility and a phone that dies mid-shift. So the scanner stays close to black-and-white, with big single-purpose states and almost no decorative animation, nothing competing with the one thing that actually matters in that moment: did this ticket just pass or fail.",
        quote: "The plainness isn't a shortcut, it's designed for a five-hour outdoor shift on someone else's phone battery, not a demo screenshot.",
      },
      {
        heading: "Live Attendance Dashboard",
        body: "Organizers constantly ask questions during an event, how many people have entered, which slot is filling up, how many VIP tickets are still pending.\n\nInstead of forcing them to export spreadsheets, I surfaced live attendance metrics directly inside the validator. The dashboard displays.",
        list: ["Total Bookings", "Total Tickets", "Scanned Count", "Ticket-wise attendance", "Booking Details"],
        quote: "These numbers update based on the selected filters, allowing organizers to monitor the event without leaving the scanning experience.",
        image: {
          src: "/gallery/kyncaseimg/flow9.jpg",
          caption: "Analytics Screen"
        },
      },
      {
        heading: "Booking Date Analytics",
        body: "This view groups bookings by the day they were purchased, so organizers can see how ticket sales progressed over time, for example, **145 bookings** on Dec 2, **372** on Dec 3, **218** on Dec 4.\n\nThis helps organizers understand booking trends.",
        list: ["Which marketing campaign generated the most bookings?", "Which day saw the highest demand?", "When did ticket sales slow down?"],
        image: {
          src: "/gallery/kyncaseimg/flow10.jpg",
          caption: "Booking Analytics"
        },
      },
      {
        heading: "Ticket Type Analytics",
        body: "Not every ticket category performs equally. Organizers often create multiple ticket tiers such as VIP, Gold, Silver, Student, and Early Bird.\n\nThe analytics screen breaks attendance down by ticket type. For every category, organizers can view total tickets sold, tickets scanned, and remaining attendees, for example, **VIP 85/100** scanned, **Gold 240/300**, **Silver 420/500**.",
        quote: "This helps organizers understand which audience segments have already arrived and which are still expected.",
        image: {
          src: "/gallery/kyncaseimg/flow11.jpg",
          caption: "Ticket Breakdown"
        },
      },
      {
        heading: "Location, Date & Time Filters",
        body: "Events are no longer limited to one venue. A single event may have multiple locations, multiple dates, and several sessions each day. Showing only overall statistics makes operational decisions difficult.\n\nI introduced contextual filters that allow organizers to narrow analytics by.",
        list: ["Location", "Event Date", "Time Slot"],
        quote: "An All option always displays aggregate event data, while selected filters instantly update every metric on the page, giving organizers both a high-level overview and detailed operational visibility.",
        image: {
          src: "/gallery/kyncaseimg/Flow12.jpg",
          caption: "Filter Chips"
        },
      },
      {
        heading: "",
        body: "Attendance changes every few seconds as people enter the venue, and organizers needed the latest numbers without reopening the screen and interrupting the scanning process. A lightweight refresh action reloads all statistics while preserving whichever location, date, and time slot filters were already selected, so scanning stays uninterrupted and volunteers and organizers can keep validating attendees while keeping an eye on live attendance.",
      },
      {
        heading: "Small UX Decisions That Improved Operations",
        body: "Some of the most valuable improvements came from solving edge cases observed during testing.",
        highlightList: [
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
        body: "The QR Validator evolved from a basic scanning screen into a complete event operations tool.\n\nThe solution supported.",
        highlightList: ["Multi-location events", "Multi-day schedules", "Multiple time slots", "Volunteer-based validation", "Real-time attendance monitoring", "Ticket-level analytics", "Booking exports", "Secure role-based access"],
        image: {
          src: "/gallery/kyncaseimg/flow13.jpg",
          caption: "Volunteer scanning screens"
        },
      },
      {
        heading: "The Numbers",
        body: "Since launch, the validator has processed **35,000+ scans** across events without downtime, even on nights where the database load spiked to **full capacity** two or three times during a single concert. Event volume on the platform moved from roughly **30-40 listings a month** before QR validation existed to **60-70 a month** within about two months of it shipping, alongside everything else we launched in that window, so it's one input among several, not the sole cause. But it was the feature organizers most consistently pointed to as the reason they were comfortable listing bigger events.",
      },
      {
        heading: "",
        body: "Although this project started as a QR scanner enhancement, it evolved into a complete operations product for event organizers. Every feature, from volunteer permissions to ticket-level analytics, was designed around one goal, helping organizers manage large events confidently without slowing down entry or losing visibility into what was happening on the ground.",
      },
    ],
  },
  {
    title: "Style Guide > Design System",
    subtitle: "Figma-to-production component pipeline",
    homeBlurb: "12 tested components shipped without a full engineering migration",
    description: "I bridged a Figma style guide to a versioned design system with an automated, tested components-to-code pipeline.",
    features: ["Figma variables exported straight into design tokens", "12 components, each unit-tested and documented", "Chromatic visual regression + accessibility checks on every push", "Published as an installable npm package called kyn-ds"],
    accent: "#077a4b",
    icon: "🧩",
    image: "/gallery/kyn-ds-docs/images/style_guide_cover.png",
    meta: [
      { label: "Role", value: "Product Designer • Design Systems • Frontend Collaboration • DevOps", icon: "solar:user-id-bold" },
      { label: "Timeline", value: "~2 Months", icon: "solar:clock-circle-bold" },
      { label: "Stack", value: "React 19 • TypeScript • Storybook • Chromatic • npm • Git", icon: "solar:code-bold" },
    ],
    caseStudy: [
      {
        heading: "Style Guide > Design System, Automated Component Pipeline",
        body: "Turning Figma variables into a versioned, tested component library, and the automated pipeline that gets it from Figma to production without slowing engineering down.",
      },
      {
        heading: "The Problem with One Button, Three Versions",
        body: "There was **no consistency across screens**, and that was becoming the real blocker to scaling. The booking flow, the organizer portal, and internal tools each had their own button, their own modal, their own idea of what \"error\" red should look like. Nothing was wrong exactly, it just **wasn't shared**, so every new screen re-decided things that should've already been settled, and every new team we onboarded inherited that same drift instead of a system to build on.",
        quote: "Could the components live in one place, versioned like any other dependency, instead of being redrawn per screen?",
      },
      {
        heading: "The Instinct, and Why It Was Wrong",
        body: "I wanted to build a comprehensive design system from scratch. However, due to a heavy load of BAU (Business As Usual) tasks and constant feature updates, the developers simply didn't have the bandwidth for a massive migration, and it would take them too much time to adopt it. A complete design system meant **hundreds of components**, a large migration effort, and ongoing maintenance after that, for a startup shipping weekly, none of that was practical right now.",
        quote: "I had too many BAU tasks and constant feature releases. How do I ship a design system when developers have no time to migrate?",
      },
      {
        heading: "The Strategic Pivot from Design System to Style Guide",
        body: "Instead of building the full system immediately, I scoped a lighter Style Guide, not a replacement for a design system forever, but a practical first step engineering could actually adopt.",
        groups: [
          { label: "Design System (the ideal)", list: ["Foundations, tokens, hundreds of components, complex variants, interaction patterns, documentation, governance.", "Built for long-term scale, and for a team with time to migrate."] },
          { label: "Style Guide (what shipped)", list: ["Colors, typography, spacing, layout foundations, and the handful of components used everywhere.", "Consistency without a full product rewrite."] },
        ],
      },
      {
        heading: "The Pipeline from Figma to Production",
        body: "Rather than a Figma file someone occasionally checks, the style guide became part of the actual development workflow. Every update followed the same automated path.",
        flow: ["Design Tokens", "Git Repository", "Chromatic", "Storybook", "npm Package", "Developer Project"],
        flowLabel: "Workflow",
      },
      {
        heading: "Token-Driven, Not Hardcoded",
        body: "Colors, spacing, and type get exported directly from Figma variables and compiled into CSS custom properties that every component consumes, so a token update in Figma is a token update everywhere, not a design file someone has to manually re-read.",
        groups: [
          { label: "Spacing & Shape", list: ["8px grid, 0–72px. Minimum touch target 44×44 per WCAG.", "Corner radius scales by use, 4px for chips, 8–12px for cards, 16px for buttons and sheets, full-round for FABs."] },
          { label: "Elevation & Icons", list: ["5 shadow levels (1–12px blur) plus a 32%-opacity scrim for focus states.", "Icons baseline at 24px (20×24×36×48 scale), stroke width scaling 1.5→3px with size."] },
        ],
      },
      {
        heading: "Color",
        body: "I designed a comprehensive 10-step color system (shades 50–900) mapped to semantic roles rather than literal values to ensure interface flexibility.",
        list: [
          "Palette Foundations, 9 color families including Brand primary (yellow), 5 Accents (red, orange, green, blue, purple), and 3 Neutral scales.",
          "Semantic Overlays, UI elements bind to functional roles (e.g., Success → green-500, Danger → red-500, Information → blue-500, Discovery → purple-500).",
          "Contrast Guardrails, all swatches are audited against WCAG standards, guaranteeing AA/AAA readability at every scale step."
        ],
        custom: "kyn-ds-colors",
      },
      {
        heading: "Typography",
        body: "I structured typography into 4 key roles, Display, Heading, Label, and Paragraph, generated mathematically on a modular scale to guarantee visual harmony.",
        list: [
          "Modular Scale, font sizes are calculated by multiplying from a root 4px baseline using a Major Second ratio of 1.125, scaling smoothly from 12px to 64px.",
          "Role Hierarchy, Display (for impact), Heading (for structure), Label (for action targets), and Paragraph (for reading blocks).",
          "Line Height, headings use tight 1.2× leading, while body paragraphs use 1.5×+ to comply with WCAG's accessibility spacing guidelines."
        ],
        custom: "kyn-ds-typescale",
      },
      {
        heading: "Spacing & Radius",
        body: "16 spacing steps on an 8px grid, and 7 corner-radius steps, the rhythm every component is built on.",
        custom: "kyn-ds-spacing",
      },
      {
        heading: "The Catalog, 12 Components, Actually Tested",
        body: "Avatar, Badge, Button, Checkbox, Chips, RadioButton, InputTextField, Banner, Menu, BottomSheet, Modal, Wizard, each with its own Vitest suite, not just a visual once-over. Button alone covers **3 sizes, 3 themes, 3 variants**, and optional icons, tested for every combination.",
      },
      {
        heading: "Catching What Nobody Would Notice with Chromatic",
        body: "Every push runs the same automated gate before anything ships. Code lands in Git, Chromatic builds isolated component snapshots on **3 breakpoints (320 / 768 / 1024)**, visual regression compares against the previous version, an accessibility audit runs automatically, and the team reviews before approving. Only approved builds move further down the pipeline, the changes nobody meant to make are exactly the ones that usually slip through manual review.",
      },
      {
        heading: "Storybook as the Source of Truth",
        body: "After approval, components publish to a hosted Storybook instance, custom-branded, with light/dark backgrounds and accessibility rules enforced through the a11y addon. Every component's doc page opens with \"View in Figma\" and \"View on GitHub\" buttons pointing at that exact component, so nobody has to go hunting for the source of truth. A small demo app with real routing consumes the published package directly, so if a component breaks for a real consumer, it breaks there first, before product does.",
      },
      {
        heading: "Shipping It as Real Software via npm",
        body: "The final step made the style guide installable instead of copy-pasted across repositories. I published it publicly to npm as [kyn-ds](https://www.npmjs.com/package/kyn-ds). It compiles into dual CJS/ESM formats with peer dependencies mapped for React and Feather Icons, guaranteeing a versioned, single source of truth across all product repositories.",
        code: "npm"
      },
      {
        heading: "Try It, Browse Every Component",
        body: "This is the live, published system, not screenshots. Click a component to load its real Storybook doc page, controls and all.",
        custom: "kyn-ds-components",
      },
      {
        heading: "Outcome",
        highlightList: ["12 components, unit-tested and documented, not just styled", "One token pipeline instead of hand-typed values per team", "Automated visual regression and accessibility checks on every change", "A real consuming app validating the package before product does", "The foundations for a full design system, built in the order the team could actually absorb"],
      },
      {
        heading: "",
        body: "Design systems fail quietly, one team's button drifts a few pixels from another's until nobody trusts the system enough to use it. Success isn't measured by how many components a system has, it's measured by how easily people actually adopt and maintain it.\n\nChasing the ideal solution would've cost the team **six months** they didn't have. Understanding the real constraint, **engineering bandwidth**, not design ability, and building for it shipped something people used from week one, tokens instead of memory, tests instead of hope, Chromatic instead of someone noticing too late.",
      },
    ],
  },
  {
    title: "Neighbourhood Design System",
    subtitle: "Figma variables → verified design tokens",
    homeBlurb: "224 color tokens, 12 components, zero hardcoded hex values",
    description: "Built with my senior to give the team one source of truth, colors, type, spacing, and components, instead of every IC reinventing values screen by screen.",
    features: ["3 base color families - Brand, Teal, Yellow", "Type scale 10–36px across Mobile & Web viewports", "Spacing, radius & icon size tokens from Figma variables", "12 components across Atoms, Molecules & Organisms"],
    accent: "#077a4b",
    icon: "📐",
    image: "/gallery/kyn-ds-docs/images/kyn_ds_cover.jpg",
    meta: [
      { label: "Role", value: "Product Design Intern → Junior Product Designer", icon: "solar:user-id-bold" },
      { label: "Timeline", value: "Weekends, alongside full-time work", icon: "solar:clock-circle-bold" },
      { label: "Stack", value: "Figma Variables • Node.js Parser • JSON Tokens • React", icon: "solar:code-bold" },
    ],
    caseStudy: [
      {
        heading: "The Problem",
        body: "Every IC was shipping features on their own track, colours, spacing, and type all picked ad hoc per screen. We were shipping weekly at startup speed, and dark mode was coming next. I pitched this to my senior: one source of truth instead of everyone reinventing values screen by screen.",
      },
      {
        heading: "Base Color Families",
        body: "**Brand**, **Teal**, and **Yellow** - 10-shade scales (50-900), parsed straight from Figma variables.",
        custom: "neighbourhood-colors",
      },
      {
        heading: "Color Tokens",
        body: "**224 tokens** across **10 groups** - Surface, Feedback, Interaction, Dimmer among them - each resolved for light and dark mode.",
        custom: "neighbourhood-semantic",
      },
      {
        heading: "Typography Scale",
        body: "**20 type roles** across Mobile and Web, **10px** to **36px**, sourced straight from Figma text variables.",
        custom: "neighbourhood-type-scale",
      },
      {
        heading: "Spacing, Radius & Icon Sizes",
        body: "**12 spacing steps** (0-48px), **5 radius tokens**, and **7 icon sizes**, all derived from Figma's semantic-size variables.",
        custom: "neighbourhood-size",
      },
      {
        heading: "Component Catalog",
        body: "**12 components** designed across Atoms, Molecules, and Organisms - full specs live in the Figma file below.",
        custom: "neighbourhood-components",
      },
      {
        heading: "Figma File",
        figmaEmbed: "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2FQ4u7LN3W1Drg8gZaUMY5W2%2FNeighbourhood-Design-System%3Fnode-id%3D0-1%26t%3DI61c4z6y8HbgssbY-1"
      },
      {
        heading: "Outcome",
        body: "I built the full token spec from scratch, colours, type, spacing, radius, icons, and 12 components, entirely on weekends, since I was an intern and then a junior product designer with no allocated hours for this. It was never fully implemented, engineers were stretched thin on feature work and couldn't pick it up. The Style Guide, a separate, scoped-down case study, is the version of this that actually shipped. I couldn't measure adoption since it was never implemented, but building a full design system from scratch, alone, was the real experience gained.",
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
        <Icon icon="solar:magnifer-zoom-in-outline" width={14} color="#ffffff" />
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

// Case-study body copy marks its own impact numbers / core-problem words with
// **double asterisks** right in the source string (not a full markdown
// pipeline, just this one lightweight convention) - this turns those into
// <strong> so the key words stand out mid-paragraph without a separate tag
// row or rewriting the copy into new sentences.
export function renderBoldedText(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ fontWeight: 700, color: "var(--color-text-primary)" }}>{part.slice(2, -2)}</strong>
    }
    return part
  })
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
          <div style={{ flex: 1, position: "relative", overflow: "hidden", background: card.imageFit === "contain" ? "#e9e9ea" : undefined }}>
            {card.image.endsWith(".mp4") || card.image.endsWith(".mov") || card.image.endsWith(".webm") ? (
              <video
                src={card.image}
                autoPlay
                loop
                muted
                playsInline
                style={{ width: "100%", height: "100%", objectFit: card.imageFit ?? "cover", display: "block", filter: "contrast(1.06) saturate(1.1)" }}
              />
            ) : (
              <img
                src={card.image}
                alt={card.title}
                style={{ width: "100%", height: "100%", objectFit: card.imageFit ?? "cover", display: "block", pointerEvents: "none", userSelect: "none" }}
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
          <div key={step} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
            {/* Boxy step chip - compact, sized to its content instead of a
                fixed 110x110 square */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "#ffffff",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
              position: "relative",
              padding: "8px 14px 8px 18px",
              boxSizing: "border-box"
            }}>
              {/* Top-Left Step Number */}
              <span style={{
                position: "absolute",
                top: "-6px",
                left: "-6px",
                background: accent,
                color: "#ffffff",
                fontSize: "0.6rem",
                fontWeight: 800,
                width: "16px",
                height: "16px",
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
              {icon && <Icon icon={icon} width={18} height={18} />}

              {/* Step Label */}
              <span style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#475569",
                fontFamily: FONTS.primary,
                textAlign: "center",
                lineHeight: 1.25,
                whiteSpace: "nowrap"
              }}>
                {step}
              </span>
            </div>

            {/* Right Arrow (only between cards, hidden on last item) */}
            {i < steps.length - 1 && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon icon="solar:arrow-right-outline" width={16} height={16} color={`${accent}80`} />
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
  // ─── ACCESS CODE GATE - TEMPORARILY DISABLED ───────────────────────────────
  // Starts unlocked so the Figma embed shows straight away. To re-enable the
  // gate, change this back to `useState(false)` - the code-entry UI below is
  // untouched and starts working again as soon as it can render.
  // const [unlocked, setUnlocked] = useState(false)
  const [unlocked, setUnlocked] = useState(true)
  // ───────────────────────────────────────────────────────────────────────────
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

/** Max width of the reading column - long-form body text past ~860px gets hard to track. */
const READING_WIDTH = 900
// Images used to bleed wider than the text/Overview card via negative
// margins on top of the column's own padding - two different effective
// widths meant nothing lined up on the same edge. The column's own
// horizontal padding is now set to match that former bleed amount, so
// text, the Overview card, and images all share one width with no
// per-element math needed.
const READING_PAD_X = "1rem"

export function CaseStudyPanel({ card, onClose }: { card: CardData; onClose: () => void }) {
  const navigate = useNavigate()
  const zoomScale = useZoomScale()
  const { isMobile, isTablet } = useBreakpoint()
  // This opens as a full-screen page, so it has to cover the true viewport.
  // ViewportScaler zooms the <html> root, which shrinks fixed-position elements
  // along with everything else - the old sidebar was already rendering 720px
  // tall for a declared 100vh, leaving a 180px gap. Cancel it out, same as
  // CaseStudiesPage's panel does.
  const counterZoom = zoomScale > 0 ? 1 / zoomScale : 1
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)
  // Same click-cycle (normal -> 200% -> back to normal -> close) and
  // drag-to-pan behaviour as VisualUiPage/PhotographyPage's lightboxes, so
  // images inside case studies zoom the same way as everywhere else.
  const [imgZoomed, setImgZoomed] = useState(false)
  const [imgZoomedOnce, setImgZoomedOnce] = useState(false)
  const wasDragging = useRef(false)

  function openLightbox(next: { src: string; alt: string }) {
    setLightbox(next)
    setImgZoomed(false)
    setImgZoomedOnce(false)
  }

  function handleLightboxImageClick(e: { stopPropagation: () => void }) {
    e.stopPropagation()
    if (wasDragging.current) return
    if (imgZoomed) {
      setImgZoomed(false)
      setImgZoomedOnce(true)
    } else if (imgZoomedOnce) {
      setLightbox(null)
    } else {
      setImgZoomed(true)
    }
  }

  // Back lives in the Dock now rather than in this page's own header, so the
  // panel sits just below the Dock's z-index (see below) to keep it clickable.
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
  // fixed-position modal's own scrollable body with nothing to scroll - give
  // it its own scoped Lenis instance instead, same fix as CaseStudiesPage.
  const scrollBodyRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = scrollBodyRef.current
    if (!el) return
    const lenis = new Lenis({
      wrapper: el,
      content: el,
      duration: 1.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      lerp: 0.09,
    })
    let raf = 0
    function loop(time: number) {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // Lenis caches its scroll limit and only recomputes it when the element it
    // was given as `content` changes size. `wrapper` and `content` are the same
    // `flex: 1` box here, whose own height never changes - only its scrollHeight
    // does, as this card's images finish decoding. Without re-measuring, the
    // limit stays frozen at whatever the height was when the modal opened, so
    // the wheel dead-stops partway down while the native scrollbar still
    // reaches the bottom. Same fix as CaseStudiesPage.
    const remeasure = () => lenis.resize()
    const ro = new ResizeObserver(remeasure)
    ro.observe(el)
    Array.from(el.children).forEach(child => ro.observe(child))
    // Images nested deeper can finish loading without changing any observed
    // child's box, so catch their load events directly too.
    el.addEventListener('load', remeasure, true)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      el.removeEventListener('load', remeasure, true)
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
          position: "fixed", inset: 0, zIndex: 99990,
          background: "rgba(15,23,42,0.25)", backdropFilter: "blur(2px)",
        }}
      />

      {/* Full-screen reading page */}
      <motion.div
        key="panel"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } }}
        exit={{ opacity: 0, y: 16, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
        style={{
          // Sits just under the Dock's z-index (99999) so the Dock stays
          // visible and clickable over this page - it's the way back now.
          position: "fixed", top: 0, left: 0, zIndex: 99991,
          width: "100vw",
          height: "100vh",
          background: "#ffffff",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          zoom: counterZoom,
        } as CSSProperties}
      >
        {/* Scrollable body */}
        <div ref={scrollBodyRef} style={{ flex: 1, overflowY: "auto", position: "relative", zIndex: 1 }}>
          {/* Full-bleed gradient hero - same top-fold pattern as the main
              Kynhood page (CaseStudyHero), so every Kynhood case study opens
              on a consistent hero instead of a plain white header. */}
          <div style={{ width: "100%", background: `linear-gradient(160deg, #043d33 0%, #077a4b 45%, ${card.accent} 130%)`, padding: isMobile ? "2.5rem 1.25rem 3rem" : "3rem 2.5rem 4rem" }}>
            <div style={{ maxWidth: READING_WIDTH, margin: "0 auto" }}>
              <span style={{ fontFamily: FONTS.body, fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)" }}>
                Kynhood {card.meta?.[0] ? `· ${card.meta[0].value}` : ""}
              </span>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: MOTION.easeArray, delay: 0.1 }}
                style={{
                  margin: "0.75rem 0 0",
                  fontSize: isMobile ? "1.4rem" : "clamp(1.75rem, 3vw, 2.5rem)",
                  fontWeight: 700, lineHeight: isMobile ? 1.5 : 1.45,
                  color: "#ffffff", letterSpacing: "-0.01em", fontFamily: FONTS.display,
                }}
              >
                {card.title}
              </motion.h1>
              <p style={{ marginTop: "1.25rem", fontFamily: FONTS.body, fontSize: isMobile ? "0.9375rem" : "1.05rem", lineHeight: 1.5, color: "rgba(255,255,255,0.8)", maxWidth: 600 }}>
                {card.subtitle}
              </p>
            </div>
          </div>

          <div style={{ maxWidth: READING_WIDTH, margin: "0 auto", padding: isMobile ? `2rem ${READING_PAD_X} 3rem` : `var(--space-16) ${READING_PAD_X} var(--space-24)` }}>

          {/* Intro block - Overview and every project fact laid out side by
              side in one flowing grid, so short fields (Industry, Role)
              don't leave dead vertical space next to a taller neighbour. */}
          <div style={{ background: "#111412", borderRadius: "20px", padding: isMobile ? "2rem 1.5rem" : "3rem", marginBottom: isMobile ? "2.5rem" : "var(--space-20)", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))", gap: isMobile ? "1.75rem" : "2.25rem 2.5rem" }}>
            {[
              { label: "Overview", values: [card.description], wide: true, prose: true },
              ...(card.meta ?? []).filter((m) => m.label !== "Role").map((m) => ({ label: m.label, values: m.value.split(" • "), wide: false, prose: false })),
              { label: "Focus", values: card.features, wide: true },
            ].map((row, ri) => (
              <div key={row.label} style={{ gridColumn: row.wide && !isMobile ? "span 2" : "auto", paddingTop: ri > 0 ? "1.5rem" : 0 }}>
                <span style={{ fontFamily: FONTS.display, fontStyle: "italic", fontSize: "1rem", fontWeight: 700, letterSpacing: "0em", color: "#ffffff" }}>
                  {row.label}
                </span>
                <div style={{ marginTop: "0.6rem", display: row.wide && !row.prose && !isMobile ? "grid" : "flex", gridTemplateColumns: row.wide && !row.prose && !isMobile ? "repeat(2, 1fr)" : undefined, flexDirection: "column", columnGap: "2rem", rowGap: "4px" }}>
                  {row.values.map((v) => (
                    row.prose ? (
                      <span key={v} style={{ fontFamily: FONTS.body, fontSize: "1rem", lineHeight: 1.7, color: "rgba(255,255,255,0.6)", fontWeight: 400 }}>{v}</span>
                    ) : (
                      <div key={v} style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                        <Icon icon="solar:alt-arrow-right-outline" width={14} style={{ marginTop: "3px", flexShrink: 0, color: card.accent }} />
                        <span style={{ fontFamily: FONTS.body, fontSize: isMobile ? "0.875rem" : "0.9rem", lineHeight: 1.4, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>{v}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>

          {card.caseStudy?.map((section, si) => (
            <div
              key={`${section.heading}-${si}`}
              style={{
                marginBottom: isMobile ? "2.5rem" : "var(--space-20)",
                // A section with no heading is a continuation of the one
                // before it (e.g. picking up right after an inline image),
                // not a new titled block - so it skips the usual top gap.
                paddingTop: si > 0 && section.heading ? (isMobile ? "2rem" : "var(--space-16)") : 0,
              }}
            >
              {section.heading && (
                <h3 style={{ margin: "0 0 var(--space-4)", fontSize: isMobile ? "1.25rem" : "1.7rem", fontWeight: 700, lineHeight: 1.45, color: "var(--color-text-primary)", letterSpacing: "0em", textTransform: "none", fontStyle: "italic", fontFamily: FONTS.display }}>
                  {section.heading}
                </h3>
              )}
              {section.meta && (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
                  {section.meta.map((item) => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                      <div style={{
                        width: "44px", height: "44px", borderRadius: "var(--radius-xl)", flexShrink: 0,
                        background: `${card.accent}14`, display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon icon={item.icon} width={26} height={26} color={card.accent} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: isMobile ? "0.875rem" : "0.95rem", fontWeight: 700, color: "var(--color-text-muted-light)", letterSpacing: "0em" }}>
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
                        margin: "0 0 var(--space-2)", padding: "var(--space-4)", borderRadius: "var(--radius-lg)",
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
                if (section.heading === "The Catalog, 12 Components, Actually Tested") {
                  return (
                    <div key={i} style={{ margin: "0 0 var(--space-5)" }}>
                      <p style={{ margin: "0 0 var(--space-5)", fontSize: isMobile ? "0.9375rem" : "1.05rem", lineHeight: 1.75, color: "var(--color-text-secondary)" }}>
                        Each component in Kyn DS is fully version-controlled, tested, and documented. Button alone covers 3 sizes, 3 themes, 3 variants, and optional icons, thoroughly verified for every combination.
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                        {/* Atoms */}
                        <div style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-4)" }}>
                          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: card.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--space-3)", fontFamily: FONTS.primary }}>Atoms (Basic Elements)</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                            {["Avatar", "Badge", "Button", "Checkbox", "Chips", "RadioButton"].map(c => (
                              <span key={c} style={{ padding: "6px var(--space-3)", background: "#ffffff", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: isMobile ? "0.8125rem" : "0.85rem", fontWeight: 600, color: "var(--color-text-tertiary)", fontFamily: FONTS.primary }}>{c}</span>
                            ))}
                          </div>
                        </div>
                        {/* Molecules */}
                        <div style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-4)" }}>
                          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: card.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--space-3)", fontFamily: FONTS.primary }}>Molecules (Structured Units)</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                            {["InputTextField", "Banner", "Menu"].map(c => (
                              <span key={c} style={{ padding: "6px var(--space-3)", background: "#ffffff", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: isMobile ? "0.8125rem" : "0.85rem", fontWeight: 600, color: "var(--color-text-tertiary)", fontFamily: FONTS.primary }}>{c}</span>
                            ))}
                          </div>
                        </div>
                        {/* Organisms */}
                        <div style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-4)" }}>
                          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: card.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--space-3)", fontFamily: FONTS.primary }}>Organisms (Complex Interfaces)</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                            {["BottomSheet", "Modal", "Wizard"].map(c => (
                              <span key={c} style={{ padding: "6px var(--space-3)", background: "#ffffff", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: isMobile ? "0.8125rem" : "0.85rem", fontWeight: 600, color: "var(--color-text-tertiary)", fontFamily: FONTS.primary }}>{c}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
                return (
                  <p key={i} style={{ margin: "0 0 var(--space-5)", fontSize: isMobile ? "0.9375rem" : "1.05rem", lineHeight: 1.75, color: "var(--color-text-secondary)" }}>
                    {renderBoldedText(p)}
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
                    {renderBoldedText(section.quote)}
                  </p>
                </div>
              )}
              {section.list && (
                <ul style={{ margin: "var(--space-3) 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  {section.list.map((item) => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3)", fontSize: "1rem", color: "var(--color-text-tertiary)", lineHeight: 1.65 }}>
                      <span style={{ flexShrink: 0, marginTop: "var(--space-1)" }}><ArrowRight color={card.accent} /></span>
                      <span>{renderBoldedText(item)}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.highlightList && (
                <div
                  style={{
                    marginTop: "var(--space-4)", padding: "var(--space-5) var(--space-6)",
                    border: `1px solid var(--color-border)`, borderRadius: "var(--radius-2xl)",
                    background: "var(--color-bg-secondary)",
                  }}
                >
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                    {section.highlightList.map((item) => (
                      <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3)", fontSize: "1rem", color: "var(--color-text-tertiary)", lineHeight: 1.65 }}>
                        <span style={{ flexShrink: 0, marginTop: "var(--space-1)" }}><ArrowRight color={card.accent} /></span>
                        <span>{renderBoldedText(item)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {section.painPoints && (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  {section.painPoints.map((item) => (
                    <div
                      key={item}
                      style={{
                        padding: "var(--space-4)", borderRadius: "var(--radius-lg)",
                        background: "#dc26260a", border: "1px solid #dc262626",
                      }}
                    >
                      <span style={{ fontSize: "0.98rem", color: "var(--color-text-tertiary)", lineHeight: 1.6, fontWeight: 500 }}>{renderBoldedText(item)}</span>
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
                  fontSize: isMobile ? "0.8125rem" : "0.85rem",
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
              {section.flow && (
                <>
                  <span style={{ display: "block", marginTop: "56px", marginBottom: "var(--space-6)", fontSize: "1.1rem", fontWeight: 700, fontStyle: "italic", textTransform: "none", color: "var(--color-text-primary)", fontFamily: FONTS.display }}>
                    {section.flowLabel || "User journey"}
                  </span>
                  <StepFlow steps={section.flow} accent={card.accent} />
                </>
              )}
              {section.image && (
                <div style={{ marginTop: isMobile ? "1.75rem" : "3.5rem", marginBottom: "1rem" }}>
                  <ZoomableImage
                    src={section.image.src}
                    alt={section.image.caption || section.heading}
                    onOpen={() => openLightbox({ src: section.image!.src, alt: section.image!.caption || section.heading })}
                    imgStyle={{
                      width: "100%",
                      display: "block",
                      borderRadius: "var(--radius-xl)",
                      border: "1px solid var(--color-border)",
                      boxShadow: "0 8px 28px rgba(0,0,0,0.1)",
                    }}
                  />
                  {section.image.caption && (
                    <span style={{ display: "block", marginTop: "var(--space-3)", fontSize: "0.8rem", color: "var(--color-text-muted-light)", textAlign: "center" }}>
                      {section.image.caption}
                    </span>
                  )}
                </div>
              )}
              {section.images && (
                <div style={{ display: "grid", gridTemplateColumns: (isMobile || section.imagesLayout === "column") ? "1fr" : `repeat(${section.images.length}, 1fr)`, gap: "var(--space-4)", marginTop: isMobile ? "1.75rem" : "3.5rem", marginBottom: "1rem" }}>
                  {section.images.map((img, idx) => (
                    <div key={idx}>
                      <ZoomableImage
                        src={img.src}
                        alt={img.caption || section.heading}
                        onOpen={() => openLightbox({ src: img.src, alt: img.caption || section.heading })}
                        imgStyle={{
                          width: "100%",
                          display: "block",
                          borderRadius: "var(--radius-xl)",
                          border: "1px solid var(--color-border)",
                          boxShadow: "0 8px 28px rgba(0,0,0,0.1)",
                        }}
                      />
                      {img.caption && (
                        <span style={{ display: "block", marginTop: "var(--space-3)", fontSize: "0.8rem", color: "var(--color-text-muted-light)", textAlign: "center" }}>
                          {img.caption}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {section.scrollImage && (
                <div style={{ marginTop: isMobile ? "1.75rem" : "3.5rem", marginBottom: "1rem" }}>
                  {/* overflowX lives on this inner box only, scoped to its own
                      width - unlike a 100vw full-bleed trick, this can never
                      push the page (or the panel's own scroll container) into
                      horizontal overflow. */}
                  <div style={{
                    height: isMobile ? "260px" : "480px",
                    overflowX: "auto", overflowY: "hidden", WebkitOverflowScrolling: "touch",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {/* The source image has a lot of dead grey canvas above/below
                        the actual screens - scaling it up beyond the container's
                        height and clipping via overflow crops that padding out,
                        so the real content fills edge to edge instead of floating
                        in a grey letterbox. Width still overflows the viewport,
                        so the horizontal scroll (the whole point of this block)
                        stays intact. */}
                    <ZoomableImage
                      src={section.scrollImage.src}
                      alt={section.scrollImage.caption || section.heading}
                      onOpen={() => openLightbox({ src: section.scrollImage!.src, alt: section.scrollImage!.caption || section.heading })}
                      imgStyle={{
                        height: isMobile ? "460px" : "820px",
                        width: "auto",
                        maxWidth: "none",
                        display: "block",
                        flexShrink: 0,
                      }}
                    />
                  </div>
                  {section.scrollImage.caption && (
                    <span style={{ display: "block", marginTop: "var(--space-3)", padding: "0 var(--space-6)", fontSize: "0.8rem", color: "var(--color-text-muted-light)", textAlign: "center" }}>
                      {section.scrollImage.caption}
                    </span>
                  )}
                </div>
              )}
              {section.journey && <JourneyFlow steps={section.journey} accent={card.accent} />}
              {section.columns && (() => {
                const maxLen = Math.max(...section.columns.map(c => c.flow.length));
                const col0 = section.columns[0];
                const col1 = section.columns[1];
                return (
                  <div style={{ marginTop: "var(--space-4)" }}>
                    {/* Lane labels */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
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
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", marginTop: "var(--space-1)" }}>
                  {section.features.map((feature) => (
                    <div key={feature.title}>
                      <h4 style={{ margin: "0 0 var(--space-2)", fontSize: isMobile ? "0.9375rem" : "1.05rem", fontWeight: 700, color: "var(--color-text-primary)", fontFamily: FONTS.display }}>
                        {feature.title}
                      </h4>
                      {feature.body && (
                        <p style={{ margin: "0 0 var(--space-3)", fontSize: isMobile ? "0.9375rem" : "1.05rem", lineHeight: 1.75, color: "var(--color-text-secondary)" }}>
                          {renderBoldedText(feature.body)}
                        </p>
                      )}
                      {feature.list && (
                        <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                          {feature.list.map((item) => (
                            <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3)", fontSize: "0.98rem", color: "var(--color-text-tertiary)", lineHeight: 1.6 }}>
                              <span style={{ flexShrink: 0, marginTop: "var(--space-1)" }}><ArrowRight color={card.accent} /></span>
                              <span>{renderBoldedText(item)}</span>
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
                            gap: "var(--space-2)", padding: "10px", textAlign: "center",
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={card.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity={0.7}>
                            <rect x="3" y="5" width="18" height="14" rx="2" />
                            <circle cx="8.5" cy="10" r="1.5" />
                            <path d="M21 15l-5-5-9 9" />
                          </svg>
                          <span style={{ fontSize: isMobile ? "0.8125rem" : "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.55 }}>{feature.media}</span>
                        </div>
                      )}
                      {feature.image && (
                        <div style={{ marginTop: "var(--space-3)" }}>
                          <ZoomableImage
                            src={feature.image.src}
                            alt={feature.image.caption || feature.title}
                            onOpen={() => openLightbox({ src: feature.image!.src, alt: feature.image!.caption || feature.title })}
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
                      <ul style={{ margin: "var(--space-3) 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                        {group.list.map((item) => (
                          <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-2)", fontSize: "0.92rem", color: "var(--color-text-tertiary)", lineHeight: 1.55 }}>
                            <span style={{ flexShrink: 0, marginTop: "var(--space-1)" }}><ArrowRight color={card.accent} /></span>
                            <span>{renderBoldedText(item)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              {section.plainGroups && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : `repeat(${section.plainGroups.length}, 1fr)`,
                  gap: "var(--space-6)",
                  marginTop: "40px",
                }}>
                  {section.plainGroups.map((group) => (
                    <div key={group.label}>
                      <span style={{ display: "block", fontSize: "1rem", fontWeight: 700, color: card.accent, letterSpacing: "-0.01em", fontFamily: FONTS.display, marginBottom: "var(--space-3)" }}>
                        {group.label}
                      </span>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                        {group.list.map((item) => (
                          <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-2)", fontSize: "0.92rem", color: "var(--color-text-tertiary)", lineHeight: 1.55 }}>
                            <span style={{ flexShrink: 0, marginTop: "var(--space-1)" }}><ArrowRight color={card.accent} /></span>
                            <span>{renderBoldedText(item)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              {section.tech && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginTop: "var(--space-1)" }}>
                  {section.tech.flatMap((group) => group.items).map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex", alignItems: "center", gap: "var(--space-2)",
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
                    gap: "var(--space-2)",
                    padding: "var(--space-3)",
                    textAlign: "center",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={card.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity={0.7}>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <circle cx="8.5" cy="10" r="1.5" />
                    <path d="M21 15l-5-5-9 9" />
                  </svg>
                  <span style={{ fontSize: isMobile ? "0.8125rem" : "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.55 }}>{section.media}</span>
                </div>
              )}
              {section.iframe && (
                <div style={{ marginTop: "var(--space-8)" }}>
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
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
                  <ZoomableImage
                    src="/gallery/kyncaseimg/marina_mall_ipl.png"
                    alt="Marina Mall IPL crowd"
                    onOpen={() => openLightbox({ src: "/gallery/kyncaseimg/marina_mall_ipl.png", alt: "Marina Mall IPL crowd" })}
                    imgStyle={{ width: "100%", borderRadius: "var(--radius-xl)", objectFit: "cover", aspectRatio: "4/3", border: "1px solid var(--color-border)", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
                  />
                  <ZoomableImage
                    src="/gallery/kyncaseimg/marina_mall_ipl2.jpg"
                    alt="Chase & Cheer event setup at Marina Mall"
                    onOpen={() => openLightbox({ src: "/gallery/kyncaseimg/marina_mall_ipl2.jpg", alt: "Chase & Cheer event setup at Marina Mall" })}
                    imgStyle={{ width: "100%", borderRadius: "var(--radius-xl)", objectFit: "cover", aspectRatio: "4/3", border: "1px solid var(--color-border)", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
                  />
                </div>
              )}
              {section.custom === "chase-event-videos" && (
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
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
                      onOpen={() => openLightbox({ src: "/gallery/kyncaseimg/11_cropped.png", alt: "TurfTown Notification" })}
                      imgStyle={{ width: "100%", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    />
                  </div>
                  <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                    <ZoomableImage
                      src="/gallery/kyncaseimg/22_cropped.png"
                      alt="District Notification"
                      onOpen={() => openLightbox({ src: "/gallery/kyncaseimg/22_cropped.png", alt: "District Notification" })}
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
                    fontSize: isMobile ? "0.875rem" : "0.9rem", fontWeight: 700,
                  }}
                >
                  {section.cta.label}
                  <ArrowRight color="#ffffff" />
                </button>
              )}
            </div>
          ))}

          {/* More work - other Kynhood case studies, same "More Work" closer
              pattern as the reference site's project pages. */}
          <div style={{ marginTop: isMobile ? "2.5rem" : "var(--space-20)", paddingTop: isMobile ? "2rem" : "var(--space-16)", borderTop: "1px solid var(--color-border)" }}>
            <h3 style={{ margin: "0 0 var(--space-6)", fontFamily: FONTS.display, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text-primary)" }}>
              See more works
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              {KYNHOOD_CASE_STUDY_CARDS.filter((c) => c.title !== card.title).slice(0, 2).map((c) => (
                <motion.button
                  key={c.title}
                  onClick={() => navigate(`/kynhood2/case/${slugifyCardTitle(c.title)}`)}
                  whileHover="hover"
                  style={{
                    textAlign: "left", background: "none", border: "none", padding: 0, cursor: "pointer",
                    display: "flex", flexDirection: "column", gap: "20px",
                  }}
                >
                  <div style={{ position: "relative", width: "100%", aspectRatio: "16/8", borderRadius: "12px", overflow: "hidden", background: "var(--color-bg-secondary)" }}>
                    {c.image.endsWith(".mp4") || c.image.endsWith(".mov") || c.image.endsWith(".webm") ? (
                      <motion.video
                        src={c.image} muted playsInline
                        variants={{ hover: { filter: "blur(3px) brightness(0.7)" } }}
                        initial={{ filter: "blur(0px) brightness(1)" }}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    ) : (
                      <motion.img
                        src={c.image} alt={c.title}
                        variants={{ hover: { scale: 1.04, filter: "blur(3px) brightness(0.7)" } }}
                        initial={{ filter: "blur(0px) brightness(1)" }}
                        transition={{ duration: 0.4 }}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    )}
                    <motion.div
                      variants={{ hover: { opacity: 1, y: 0 } }}
                      initial={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.3 }}
                      style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "var(--radius-cta)", background: "rgba(255,255,255,0.95)", color: "#0f172a", fontFamily: FONTS.body, fontSize: "0.8rem", fontWeight: 400, letterSpacing: "0.02em" }}>
                        View case study <Icon icon="solar:arrow-right-up-outline" width={14} />
                      </span>
                    </motion.div>
                  </div>
                  <span style={{ fontFamily: FONTS.display, fontSize: "1.1rem", fontWeight: 700, color: "var(--color-text-primary)", lineHeight: 1.45 }}>{c.title}</span>
                  <span style={{ fontFamily: FONTS.body, fontSize: isMobile ? "0.8125rem" : "0.85rem", color: "var(--color-text-muted)" }}>{c.subtitle}</span>
                </motion.button>
              ))}
            </div>
          </div>
          </div>
        </div>

        {/* Back closes the case study - when opened as its own route
            (/kynhood2/case/:slug) `onClose` navigates away instead. */}
        <BackButton onClick={onClose} />
        <BackToTopButton scrollContainerRef={scrollBodyRef} />
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
        <Icon icon="solar:close-circle-outline" width={24} />
      </button>
      <motion.img
        key={imgZoomed ? "zoomed" : "normal"}
        initial={{ scale: imgZoomed ? 1 : 0.95 }}
        animate={{ scale: imgZoomed ? 2 : 1 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.22 }}
        src={lightbox.src}
        alt={lightbox.alt}
        onClick={handleLightboxImageClick}
        drag={imgZoomed}
        dragMomentum={false}
        dragElastic={0.15}
        onDragStart={() => { wasDragging.current = true }}
        onDragEnd={() => { requestAnimationFrame(() => { wasDragging.current = false }) }}
        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "var(--radius-md)", cursor: imgZoomed ? "grab" : "zoom-in", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
      />
    </motion.div>
  )

  return createPortal(<AnimatePresence>{panel}{lightboxOverlay}</AnimatePresence>, document.body)
}

const SECONDARY_TITLES = [
  "A real-time multiplayer cricket quiz app with live emcee control and a leaderboard",
  "A PoC using Android notifications to sync booking inventory in real time",
]
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

// Every Kynhood sub-project's real card data in one flat list, for consumers
// (e.g. the home page's Selected-Work-style grid) that want to render their
// own card UI but still open the real CaseStudyPanel on click.
export const ALL_KYNHOOD_CARDS: CardData[] = [...PRIMARY_CARDS, ...SECONDARY_CARDS, ...TERTIARY_CARDS]

// Real Kynhood case studies only - excludes the two design-system entries
// (they aren't case studies, they're reference systems - see
// KYNHOOD_DESIGN_SYSTEM_CARDS) and the two vibe-coded products (Chase &
// Cheer, Notify - see KYNHOOD_VIBE_CODED_CARDS), which get their own home
// page section instead of sitting in this grid.
const UNORDERED_KYNHOOD_CASE_STUDY_CARDS: CardData[] = PRIMARY_CARDS

// The home page renders this list two cards per row. Registration and
// Recurring Events are the two case studies worth the most visibility, so
// they lead the grid together in row one; QR Validation and Partial
// Payments follow in row two. Everything after that keeps its natural order.
const HOMEPAGE_ROW_PAIRING = [
  "Helping users on the platform handle high-volume transaction booking spikes on the launch day of big concerts",
  "Helping organizers list their six-month scheduled complex events easily in six steps",
  "Helping 40,000 users and organizers with an inbuilt QR validation system to make operations easy",
  "Helping Gen Z pay for high-priced tickets by splitting the money",
]
export const KYNHOOD_CASE_STUDY_CARDS: CardData[] = (() => {
  const pinned = HOMEPAGE_ROW_PAIRING
    .map((title) => UNORDERED_KYNHOOD_CASE_STUDY_CARDS.find((c) => c.title === title))
    .filter((c): c is CardData => Boolean(c))
  if (pinned.length !== HOMEPAGE_ROW_PAIRING.length) return UNORDERED_KYNHOOD_CASE_STUDY_CARDS
  const rest = UNORDERED_KYNHOOD_CASE_STUDY_CARDS.filter((c) => !HOMEPAGE_ROW_PAIRING.includes(c.title))
  return [...pinned, ...rest]
})()

// The two Kynhood design-system entries, surfaced separately (their own home
// page section) instead of inside the case-study grids.
export const KYNHOOD_DESIGN_SYSTEM_CARDS: CardData[] = TERTIARY_CARDS

// Chase & Cheer and Notify - both vibe-coded products, not "real" Kynhood
// case studies - get their own home page section (Vibe-Coded Products)
// between "My works at KYN" and "Design Systems I built" instead of sitting
// inside the main case-study grid.
export const KYNHOOD_VIBE_CODED_CARDS: CardData[] = SECONDARY_CARDS
