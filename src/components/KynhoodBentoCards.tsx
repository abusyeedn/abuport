import { useState, useEffect, type CSSProperties } from "react"
import { createPortal } from "react-dom"

// Keyframe injected once
const KEYFRAME_ID = "kyn-card-flip-keyframes"
function injectKeyframes() {
  if (document.getElementById(KEYFRAME_ID)) return
  const s = document.createElement("style")
  s.id = KEYFRAME_ID
  s.textContent = `
    @keyframes kynPulse {
      0%   { transform: scale(2);              opacity: 0; box-shadow: 0 0 50px rgba(239,68,68,0.5); }
      50%  { transform: translate(0,-5px) scale(1); opacity: 1; box-shadow: 0 8px 20px rgba(239,68,68,0.4); }
      100% { transform: translate(0,5px) scale(0.1); opacity: 0; box-shadow: 0 10px 20px rgba(239,68,68,0); }
    }
    .kyn-pulse-ring { animation: kynPulse 3s linear infinite; opacity: 0; }
    .kyn-card-root:hover .kyn-pulse-ring { animation: kynPulse 2s linear infinite; }
  `
  document.head.appendChild(s)
}

interface CaseStudySection {
  heading: string
  body?: string
  list?: string[]
}

interface CardData {
  title: string
  subtitle: string
  description: string
  features: string[]
  accent: string
  icon: string
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
    title: "Live Cricket Quiz",
    subtitle: "Real-time match moments",
    description: "Fans answer live trivia during matches — timed to key moments, scored on the leaderboard, rewarded with Kyn points.",
    features: ["Real-time questions", "Match-linked moments", "Leaderboard scoring", "Kyn points rewards"],
    accent: "#f97316",
    icon: "🏏",
  },
  {
    title: "Community Events",
    subtitle: "Discover local experiences",
    description: "End-to-end event tooling — discovery feed, host creation flow, RSVP, reminders and post-event engagement.",
    features: ["Event discovery feed", "Host creation tools", "One-tap RSVP", "Post-event recap"],
    accent: "#8b5cf6",
    icon: "◈",
  },
  {
    title: "Tribe Building",
    subtitle: "Find your people",
    description: "Interest-based micro-communities with shared calendars, group chats and member roles that grow organically.",
    features: ["Interest matching", "Group messaging", "Shared calendar", "Member roles"],
    accent: "#0ea5e9",
    icon: "⬡",
  },
  {
    title: "Booking Engine",
    subtitle: "Seamless ticketing",
    description: "In-app payment, QR check-in, instant confirmation and smart cancellation — zero redirects, zero friction.",
    features: ["In-app payment", "QR check-in", "Instant confirmation", "Smart cancellation"],
    accent: "#10b981",
    icon: "◎",
  },
  {
    title: "Discovery Feed",
    subtitle: "Personalised for you",
    description: "Curated feed powered by location, interests and social graph — surfaces events and tribes before users search.",
    features: ["Algorithmic curation", "Near-me filter", "Category browse", "Trending events"],
    accent: "#f59e0b",
    icon: "◉",
  },
  {
    title: "Engagement Score",
    subtitle: "Gamified participation",
    description: "Kyn Points system drives repeat engagement — streaks, badges and a community leaderboard keep users active.",
    features: ["Activity streaks", "Badge system", "Community leaderboard", "Redeemable rewards"],
    accent: "#ec4899",
    icon: "★",
  },
  {
    title: "Design System",
    subtitle: "Brand & components",
    description: "Built a scalable token-based design system in Figma — used across iOS, Android and Web with a single source of truth.",
    features: ["Color & type tokens", "Component library", "iOS + Android", "Figma auto-layout"],
    accent: "#6366f1",
    icon: "▣",
  },
  {
    title: "50K+ Users",
    subtitle: "And growing",
    description: "Shipped 12 major features in 14 months across 3 cities — 4.8★ App Store rating and 200+ events hosted monthly.",
    features: ["50K+ downloads", "200+ monthly events", "15+ cities", "4.8 ★ App Store"],
    accent: "#ef4444",
    icon: "↗",
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
            borderRadius: "20px",
            overflow: "hidden",
            background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Animated pulse rings */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "48px" }}>
            <div style={{ position: "relative", width: "100px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="kyn-pulse-ring"
                  style={{
                    position: "absolute",
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    boxShadow: `0 0 50px ${card.accent}80`,
                    animationDelay: `${i * 0.3}s`,
                    background: `${card.accent}18`,
                  }}
                />
              ))}
              <span style={{ fontSize: "2.2rem", position: "relative", zIndex: 1, userSelect: "none" }}>{card.icon}</span>
            </div>
          </div>

          {/* Bottom text */}
          <div style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <div>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: "1rem", color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.3, transition: "transform 0.4s ease", transform: flipped ? "translateY(-4px)" : "translateY(0)" }}>
                {card.title}
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: "#64748b", lineHeight: 1.4, transition: "transform 0.4s ease 0.05s", transform: flipped ? "translateY(-4px)" : "translateY(0)" }}>
                {card.subtitle}
              </p>
            </div>
            <div style={{ flexShrink: 0, opacity: 0.7 }}>
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
            borderRadius: "20px",
            padding: "24px",
            background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
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
                  lineHeight: 1.45,
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
                    color: "#374151",
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
                  width: "100%", border: "none", borderRadius: "10px", padding: "8px 12px",
                  background: "#f1f5f9", cursor: "pointer", font: "inherit",
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

function CaseStudyModal({ card, onClose }: { card: CardData; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100000,
        background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "32px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#ffffff", borderRadius: "20px", maxWidth: "720px", width: "100%",
          maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ position: "sticky", top: 0, background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "24px 32px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <div>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: card.accent, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {card.subtitle}
            </span>
            <h2 style={{ margin: "4px 0 0", fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
              {card.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ flexShrink: 0, width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "#f1f5f9", cursor: "pointer", fontSize: "1rem", color: "#475569", lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "32px" }}>
          {card.caseStudy?.map((section) => (
            <div key={section.heading} style={{ marginBottom: "28px" }}>
              <h3 style={{ margin: "0 0 10px", fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                {section.heading}
              </h3>
              {section.body && section.body.split("\n\n").map((p, i) => (
                <p key={i} style={{ margin: "0 0 10px", fontSize: "0.9rem", lineHeight: 1.65, color: "#475569" }}>
                  {p}
                </p>
              ))}
              {section.list && (
                <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {section.list.map((item) => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.88rem", color: "#374151", lineHeight: 1.5 }}>
                      <span style={{ flexShrink: 0, marginTop: "6px" }}><ArrowRight color={card.accent} /></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function KynhoodBentoCards() {
  useEffect(() => { injectKeyframes() }, [])
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
        <CaseStudyModal card={CARDS[openIndex]} onClose={() => setOpenIndex(null)} />
      )}
    </>
  )
}
