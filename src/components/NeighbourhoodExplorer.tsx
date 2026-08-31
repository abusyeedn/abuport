import { useState, useRef, useEffect } from "react"
import { Icon } from "@iconify/react"

// ─── Design Tokens (sourced from figma_variables.json) ───────────────────────
const T = {
  // Base colors
  brand:   { 50:"#fde9ea",100:"#f9bbbe",200:"#f69b9e",300:"#f26d72",400:"#ef5157",500:"#eb252d",600:"#d62229",700:"#a71a20",800:"#811419",900:"#631013" },
  teal:    { 50:"#e6f6f2",100:"#b0e2d8",200:"#8ad3c5",300:"#54bfab",400:"#33b39a",500:"#00a081",600:"#009275",700:"#00725c",800:"#005847",900:"#004336" },
  yellow:  { 50:"#fcf5ea",100:"#f5dfbd",200:"#f0d09d",300:"#eabb70",400:"#e5ad54",500:"#df9929",600:"#cb8b25",700:"#9e6d1d",800:"#7b5417",900:"#5e4011" },
  red:     { 50:"#feecec",100:"#fbc4c4",200:"#f9a8a8",300:"#f68080",400:"#f56767",500:"#f24141",600:"#dc3b3b",700:"#ac2e2e",800:"#852424",900:"#661b1b" },
  green:   { 50:"#eef9e9",100:"#caebbb",200:"#b0e29a",300:"#8cd46c",400:"#76cc4f",500:"#54bf23",600:"#4cae20",700:"#3c8819",800:"#2e6913",900:"#23500f" },
  blue:    { 50:"#e6f1f8",100:"#b0d3ea",200:"#8abee0",300:"#54a0d2",400:"#338dc9",500:"#0071bc",600:"#0067ab",700:"#005085",800:"#003e67",900:"#002f4f" },
  faded:   { "00":"#fcfcfc",50:"#f1f1f1",100:"#d2d2d2",200:"#bcbcbc",300:"#9e9e9e",400:"#8b8b8b",500:"#6d6d6d",600:"#646464",700:"#4e4e4e",800:"#3d3d3d",900:"#2e2e2e" },
  // Semantic surface tokens (light mode)
  surface: {
    bgGreySubtle: "#d2d2d2", bgGreyModerate: "#f1f1f1", bgGreyIntense: "#fcfcfc",
    bgPrimarySubtle: "#eb252d19", bgPrimaryModerate: "#f26d72", bgPrimaryIntense: "#eb252d",
    borderGreyDefault: "#3d3d3d", borderGreySubtle: "#d2d2d2", borderGreyDisabled: "#f1f1f1",
    borderPrimaryDefault: "#eb252d", borderPrimaryDisabled: "#eb252d33",
    textGreyDefault: "#3d3d3d", textGreySubtle: "#8b8b8b", textGreyDisabled: "#6e6e6e66",
    textPrimary: "#eb252d", textWhite: "#ffffff", textBlack: "#000000",
    iconGreyDefault: "#2e2e2e", iconGreySubtle: "#9e9e9e",
  },
  feedback: {
    bgSuccessSubtle: "#54bf2319", bgSuccessIntense: "#4cae20",
    bgErrorSubtle: "#f2414119",   bgErrorIntense: "#dc3b3b",
    bgWarningSubtle: "#df992919", bgWarningIntense: "#cb8b25",
    bgInfoSubtle: "#0071bc19",    bgInfoIntense: "#0071bc",
    bgGreySubtle: "#6e6e6e19",    bgGreyIntense: "#2e2e2e",
    textSuccessIntense: "#3c8819", textErrorIntense: "#dc3b3b",
    textWarningIntense: "#9e6d1d", textInfoIntense: "#0067ab",
    borderSuccessSubtle: "#54bf2333", borderErrorSubtle: "#f2414133",
    borderWarningSubtle: "#df992933",
  },
  interaction: {
    bgPrimaryDefault: "#eb252d", bgPrimaryHighlighted: "#d62229", bgPrimaryDisabled: "#eb252d19",
    bgGreyDefault: "#f1f1f1",   bgGreyHighlighted: "#f1f1f1",    bgGreyDisabled: "#6e6e6e19",
    bgSuccessDefault: "#54bf23", bgErrorDefault: "#f24141", bgWarningDefault: "#df9929",
    bgBlackDefault: "#000000", bgWhiteDefault: "#ffffff",
    borderGreyDefault: "#bcbcbc", borderPrimaryDefault: "#eb252d",
    textPrimaryDefault: "#eb252d", textPrimaryHighlighted: "#d62229",
    textGreyIntense: "#3d3d3d", textGreySubtle: "#4e4e4e", textOnPrimary: "#ffffff",
    iconGreyDefault: "#3d3d3d", iconPrimaryDefault: "#eb252d", iconOnPrimary: "#ffffff",
  },
  // Spacing (from semantic-size)
  spacing: { 0:0, 2:2, 4:4, 8:8, 12:12, 14:14, 16:16, 20:20, 24:24, 32:32, 40:40, 48:48 },
  // Radius (from semantic-size)
  radius: { none:0, xsmall:4, small:8, large:16, max:1000 },
  // Icon sizes
  iconSize: { none:0, xsmall:8, small:12, large:16, xlarge:20, "2xlarge":24, max:32 },
  font: { family: "'Manrope', system-ui, sans-serif", mono: "'Roboto Mono', monospace" },
}

// ─── Color Families Data ──────────────────────────────────────────────────────
interface ColorShade { name: string; value: string }
interface ColorFamily { label: string; shades: ColorShade[] }

const BASE_COLOR_FAMILIES: ColorFamily[] = [
  { label: "Brand", shades: [50,100,200,300,400,500,600,700,800,900].map(s=>({name:`brand-${s}`,value:(T.brand as Record<number,string>)[s]})) },
  { label: "Teal", shades: [50,100,200,300,400,500,600,700,800,900].map(s=>({name:`teal-${s}`,value:(T.teal as Record<number,string>)[s]})) },
  { label: "Yellow", shades: [50,100,200,300,400,500,600,700,800,900].map(s=>({name:`yellow-${s}`,value:(T.yellow as Record<number,string>)[s]})) },
  { label: "Red", shades: [50,100,200,300,400,500,600,700,800,900].map(s=>({name:`red-${s}`,value:(T.red as Record<number,string>)[s]})) },
  { label: "Green", shades: [50,100,200,300,400,500,600,700,800,900].map(s=>({name:`green-${s}`,value:(T.green as Record<number,string>)[s]})) },
  { label: "Blue", shades: [50,100,200,300,400,500,600,700,800,900].map(s=>({name:`blue-${s}`,value:(T.blue as Record<number,string>)[s]})) },
  { label: "Sky Blue", shades: [
    {name:"sky-blue-50",value:"#fefeff"},{name:"sky-blue-100",value:"#fcfdff"},{name:"sky-blue-200",value:"#fafcff"},
    {name:"sky-blue-300",value:"#f8fbff"},{name:"sky-blue-400",value:"#f7faff"},{name:"sky-blue-500",value:"#f5f9ff"},
    {name:"sky-blue-600",value:"#dfe3e8"},{name:"sky-blue-700",value:"#aeb1b5"},{name:"sky-blue-800",value:"#87898c"},{name:"sky-blue-900",value:"#67696b"},
  ]},
  { label: "Faded (Neutral)", shades: [
    {name:"faded-00",value:"#fcfcfc"},{name:"faded-50",value:"#f1f1f1"},{name:"faded-100",value:"#d2d2d2"},
    {name:"faded-200",value:"#bcbcbc"},{name:"faded-300",value:"#9e9e9e"},{name:"faded-400",value:"#8b8b8b"},
    {name:"faded-500",value:"#6d6d6d"},{name:"faded-600",value:"#646464"},{name:"faded-700",value:"#4e4e4e"},
    {name:"faded-800",value:"#3d3d3d"},{name:"faded-900",value:"#2e2e2e"},
  ]},
  { label: "Bright (White α)", shades: [
    {name:"bright-00",value:"#ffffff00"},{name:"bright-50",value:"#ffffff19"},{name:"bright-100",value:"#ffffff33"},
    {name:"bright-200",value:"#ffffff4c"},{name:"bright-300",value:"#ffffff66"},{name:"bright-400",value:"#ffffff7f"},
    {name:"bright-500",value:"#ffffff99"},{name:"bright-600",value:"#ffffffb2"},{name:"bright-700",value:"#ffffffcc"},
    {name:"bright-800",value:"#ffffffe5"},{name:"bright-900",value:"#ffffff"},
  ]},
  { label: "Dark (Black α)", shades: [
    {name:"dark-00",value:"#00000000"},{name:"dark-50",value:"#00000019"},{name:"dark-100",value:"#00000033"},
    {name:"dark-200",value:"#0000004c"},{name:"dark-300",value:"#00000066"},{name:"dark-400",value:"#0000007f"},
    {name:"dark-500",value:"#00000099"},{name:"dark-600",value:"#000000b2"},{name:"dark-700",value:"#000000cc"},
    {name:"dark-800",value:"#000000e5"},{name:"dark-900",value:"#000000"},
  ]},
  { label: "Brand-P α", shades: [{name:"brand-p-50",value:"#eb252d19"},{name:"brand-p-100",value:"#eb252d33"},{name:"brand-p-150",value:"#eb252d4c"},{name:"brand-p-200",value:"#eb252d66"}] },
  { label: "Teal-S α",  shades: [{name:"teal-s-50",value:"#00a08119"},{name:"teal-s-100",value:"#00a08133"},{name:"teal-s-150",value:"#00a0814c"},{name:"teal-s-200",value:"#00a08166"}] },
  { label: "Red-E α",   shades: [{name:"red-e-50",value:"#f2414119"},{name:"red-e-100",value:"#f2414133"},{name:"red-e-150",value:"#f241414c"},{name:"red-e-200",value:"#f2414166"}] },
  { label: "Green-S α", shades: [{name:"green-s-50",value:"#54bf2319"},{name:"green-s-100",value:"#54bf2333"},{name:"green-s-150",value:"#54bf234c"},{name:"green-s-200",value:"#54bf2366"}] },
  { label: "Faded-G α", shades: [{name:"faded-g-50",value:"#6e6e6e19"},{name:"faded-g-100",value:"#6e6e6e33"},{name:"faded-g-150",value:"#6e6e6e4c"},{name:"faded-g-200",value:"#6e6e6e66"}] },
  { label: "Blue-I α",  shades: [{name:"blue-i-50",value:"#0071bc19"},{name:"blue-i-100",value:"#0071bc33"},{name:"blue-i-150",value:"#0071bc4c"},{name:"blue-i-200",value:"#0071bc66"}] },
  { label: "Yellow-W α",shades: [{name:"yellow-w-50",value:"#df992919"},{name:"yellow-w-100",value:"#df992933"},{name:"yellow-w-150",value:"#df99294c"},{name:"yellow-w-200",value:"#df992966"}] },
  { label: "Sky-T α",   shades: [{name:"sky-blue-t-50",value:"#f5f9ff19"},{name:"sky-blue-t-100",value:"#f5f9ff33"},{name:"sky-blue-t-150",value:"#f5f9ff4c"},{name:"sky-blue-t-200",value:"#f5f9ff66"}] },
]

// ─── Semantic token groups ────────────────────────────────────────────────────
interface SemanticToken { name: string; light: string; dark: string }
interface TokenGroup { group: string; tokens: SemanticToken[] }

const SEMANTIC_TOKEN_GROUPS: TokenGroup[] = [
  { group: "Surface · Background", tokens: [
    {name:"surface-background-grey-subtle",light:"#d2d2d2",dark:"#646464"},
    {name:"surface-background-grey-moderate",light:"#f1f1f1",dark:"#4e4e4e"},
    {name:"surface-background-grey-intense",light:"#fcfcfc",dark:"#2e2e2e"},
    {name:"surface-background-primary-subtle",light:"#eb252d19",dark:"#eb252d19"},
    {name:"surface-background-primary-moderate",light:"#f26d72",dark:"#f69b9e"},
    {name:"surface-background-primary-intense",light:"#eb252d",dark:"#eb252d"},
    {name:"surface-background-secondary-subtle",light:"#00a08119",dark:"#00a08119"},
    {name:"surface-background-secondary-intense",light:"#00a081",dark:"#00a081"},
    {name:"surface-background-warning-subtle",light:"#df992919",dark:"#df992919"},
    {name:"surface-background-success-subtle",light:"#54bf2319",dark:"#54bf2319"},
    {name:"surface-background-error-subtle",light:"#f2414119",dark:"#f2414119"},
    {name:"surface-background-info-subtle",light:"#0071bc19",dark:"#0071bc19"},
  ]},
  { group: "Surface · Border", tokens: [
    {name:"surface-border-grey-default",light:"#3d3d3d",dark:"#d2d2d2"},
    {name:"surface-border-grey-subtle",light:"#d2d2d2",dark:"#646464"},
    {name:"surface-border-grey-disabled",light:"#f1f1f1",dark:"#8b8b8b"},
    {name:"surface-border-primary-default",light:"#eb252d",dark:"#eb252d"},
    {name:"surface-border-primary-disabled",light:"#eb252d33",dark:"#eb252d66"},
    {name:"surface-border-secondary-default",light:"#00a081",dark:"#00a081"},
  ]},
  { group: "Surface · Text", tokens: [
    {name:"surface-text-grey-default",light:"#3d3d3d",dark:"#f1f1f1"},
    {name:"surface-text-grey-subtle",light:"#8b8b8b",dark:"#bcbcbc"},
    {name:"surface-text-grey-disabled",light:"#6e6e6e66",dark:"#6e6e6e66"},
    {name:"surface-text-primary-default",light:"#eb252d",dark:"#eb252d"},
    {name:"surface-text-white-default",light:"#ffffff",dark:"#ffffff"},
    {name:"surface-text-black-default",light:"#000000",dark:"#000000"},
  ]},
  { group: "Surface · Icon", tokens: [
    {name:"surface-icon-grey-default",light:"#2e2e2e",dark:"#f1f1f1"},
    {name:"surface-icon-grey-subtle",light:"#9e9e9e",dark:"#9e9e9e"},
    {name:"surface-icon-grey-disabled",light:"#6e6e6e66",dark:"#6e6e6e66"},
    {name:"surface-icon-primary-default",light:"#eb252d",dark:"#eb252d"},
    {name:"surface-icon-white-default",light:"#ffffff",dark:"#ffffff"},
    {name:"surface-icon-black-default",light:"#000000",dark:"#000000"},
  ]},
  { group: "Feedback · Background", tokens: [
    {name:"feedback-background-grey-subtle",light:"#6e6e6e19",dark:"#6e6e6e19"},
    {name:"feedback-background-grey-intense",light:"#2e2e2e",dark:"#3d3d3d"},
    {name:"feedback-background-success-subtle",light:"#54bf2319",dark:"#54bf2319"},
    {name:"feedback-background-success-intense",light:"#4cae20",dark:"#3c8819"},
    {name:"feedback-background-error-subtle",light:"#f2414119",dark:"#f2414119"},
    {name:"feedback-background-error-intense",light:"#dc3b3b",dark:"#ac2e2e"},
    {name:"feedback-background-warning-subtle",light:"#df992919",dark:"#df992919"},
    {name:"feedback-background-warning-intense",light:"#cb8b25",dark:"#9e6d1d"},
  ]},
  { group: "Feedback · Text + Icon", tokens: [
    {name:"feedback-text-success-intense",light:"#3c8819",dark:"#76cc4f"},
    {name:"feedback-text-error-intense",light:"#dc3b3b",dark:"#f56767"},
    {name:"feedback-text-warning-intense",light:"#9e6d1d",dark:"#e5ad54"},
    {name:"feedback-border-success-subtle",light:"#54bf2333",dark:"#54bf2366"},
    {name:"feedback-border-error-subtle",light:"#f2414133",dark:"#f2414166"},
    {name:"feedback-border-warning-subtle",light:"#df992933",dark:"#df992966"},
  ]},
  { group: "Interaction · Background", tokens: [
    {name:"interaction-background-primary-default",light:"#eb252d",dark:"#eb252d"},
    {name:"interaction-background-primary-highlighted",light:"#d62229",dark:"#d62229"},
    {name:"interaction-background-primary-disabled",light:"#eb252d19",dark:"#eb252d19"},
    {name:"interaction-background-grey-default",light:"#f1f1f1",dark:"#3d3d3d"},
    {name:"interaction-background-grey-disabled",light:"#6e6e6e19",dark:"#6e6e6e66"},
    {name:"interaction-background-success-default",light:"#54bf23",dark:"#54bf23"},
    {name:"interaction-background-error-default",light:"#f24141",dark:"#f24141"},
    {name:"interaction-background-warning-default",light:"#df9929",dark:"#df9929"},
    {name:"interaction-background-black-default",light:"#000000",dark:"#000000"},
    {name:"interaction-background-white-default",light:"#ffffff",dark:"#ffffff"},
  ]},
  { group: "Interaction · Text + Icon", tokens: [
    {name:"interaction-text-grey-intense",light:"#3d3d3d",dark:"#f1f1f1"},
    {name:"interaction-text-grey-subtle",light:"#4e4e4e",dark:"#d2d2d2"},
    {name:"interaction-text-primary-default",light:"#eb252d",dark:"#eb252d"},
    {name:"interaction-text-on-primary-default",light:"#ffffff",dark:"#ffffff"},
    {name:"interaction-text-success-default",light:"#54bf23",dark:"#8cd46c"},
    {name:"interaction-text-error-default",light:"#f24141",dark:"#f68080"},
    {name:"interaction-text-warning-default",light:"#df9929",dark:"#e5ad54"},
    {name:"interaction-border-grey-default",light:"#bcbcbc",dark:"#bcbcbc"},
    {name:"interaction-border-primary-default",light:"#eb252d",dark:"#eb252d"},
  ]},
  { group: "Dimmer + Elevation", tokens: [
    {name:"dimmer-background-grey-subtle",light:"#00000033",dark:"#00000033"},
    {name:"dimmer-background-grey-intense",light:"#00000099",dark:"#00000099"},
    {name:"elevation-background-grey-default",light:"#6e6e6e33",dark:"#3d3d3d"},
  ]},
]

// ─── Type Scale ───────────────────────────────────────────────────────────────
const TYPE_SCALE = [
  {name:"web-display-xlarge",  fontSize:36, lineHeight:46, viewport:"Web",    role:"Display XLarge"},
  {name:"web-display-large",   fontSize:32, lineHeight:42, viewport:"Web",    role:"Display Large"},
  {name:"web-display-small",   fontSize:28, lineHeight:40, viewport:"Web",    role:"Display Small"},
  {name:"web-heading-xlarge",  fontSize:24, lineHeight:26, viewport:"Web",    role:"Heading XLarge"},
  {name:"web-heading-large",   fontSize:20, lineHeight:24, viewport:"Web",    role:"Heading Large"},
  {name:"web-heading-small",   fontSize:18, lineHeight:22, viewport:"Web",    role:"Heading Small"},
  {name:"web-label-large",     fontSize:16, lineHeight:20, viewport:"Web",    role:"Label Large"},
  {name:"web-label-small",     fontSize:14, lineHeight:16, viewport:"Web",    role:"Label Small"},
  {name:"web-paragraph-large", fontSize:14, lineHeight:18, viewport:"Web",    role:"Paragraph Large"},
  {name:"web-paragraph-small", fontSize:12, lineHeight:20, viewport:"Web",    role:"Paragraph Small"},
  {name:"web-paragraph-xsmall",fontSize:10, lineHeight:18, viewport:"Web",    role:"Paragraph XSmall"},
  {name:"mobile-heading-xlarge",fontSize:28,lineHeight:46, viewport:"Mobile", role:"Heading XLarge"},
  {name:"mobile-heading-large", fontSize:24,lineHeight:40, viewport:"Mobile", role:"Heading Large"},
  {name:"mobile-heading-small", fontSize:22,lineHeight:36, viewport:"Mobile", role:"Heading Small"},
  {name:"mobile-heading-xsmall",fontSize:20,lineHeight:24, viewport:"Mobile", role:"Heading XSmall"},
  {name:"mobile-label-large",   fontSize:18,lineHeight:24, viewport:"Mobile", role:"Label Large"},
  {name:"mobile-label-small",   fontSize:16,lineHeight:24, viewport:"Mobile", role:"Label Small"},
  {name:"mobile-paragraph-large",fontSize:14,lineHeight:22,viewport:"Mobile", role:"Paragraph Large"},
  {name:"mobile-paragraph-small",fontSize:12,lineHeight:20,viewport:"Mobile", role:"Paragraph Small"},
  {name:"mobile-paragraph-xsmall",fontSize:10,lineHeight:18,viewport:"Mobile",role:"Paragraph XSmall"},
]

const WEIGHTS = [{label:"Regular",value:400},{label:"Medium",value:500},{label:"SemiBold",value:600},{label:"Bold",value:700}]

// ─── Sizing Tokens ────────────────────────────────────────────────────────────
const SPACING_TOKENS  = [{name:"spacing-0",value:0},{name:"spacing-2",value:2},{name:"spacing-4",value:4},{name:"spacing-8",value:8},{name:"spacing-12",value:12},{name:"spacing-14",value:14},{name:"spacing-16",value:16},{name:"spacing-20",value:20},{name:"spacing-24",value:24},{name:"spacing-32",value:32},{name:"spacing-40",value:40},{name:"spacing-48",value:48}]
const RADIUS_TOKENS   = [{name:"border-radius-none",label:"none",value:0},{name:"border-radius-xsmall",label:"xsmall",value:4},{name:"border-radius-small",label:"small",value:8},{name:"border-radius-large",label:"large",value:16},{name:"border-radius-max",label:"max / pill",value:1000}]
const ICON_SIZE_TOKENS = [{name:"icon-size-none",value:0},{name:"icon-size-xsmall",value:8},{name:"icon-size-small",value:12},{name:"icon-size-large",value:16},{name:"icon-size-xlarge",value:20},{name:"icon-size-2xlarge",value:24},{name:"icon-size-max",value:32}]

// ─── Shared UI Helpers ────────────────────────────────────────────────────────
const ff = T.font.family

function WhyNote({ children }: { children: string }) {
  return (
    <div style={{ background: "var(--color-bg-secondary)", borderLeft: `3px solid ${T.brand[200]}`, borderRadius: "0 8px 8px 0", padding: '10px 14px', marginBottom: 'var(--space-4)' }}>
      <span style={{ fontSize: "0.7rem", color: T.faded[600], fontFamily: ff, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: T.brand[500], marginRight: "6px" }}>Why this approach:</span>
        {children}
      </span>
    </div>
  )
}

function PropToggle<T extends string>({ label, options, value, onChange }: { label: string; options: T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 'var(--space-1)' }}>
      <span style={{ fontSize: "0.6rem", fontWeight: 700, color: T.faded[500], textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: ff }}>{label}</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 'var(--space-1)' }}>
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt)} style={{
            padding: '3px 10px', borderRadius: T.radius.xsmall, border: "1px solid",
            fontSize: "0.65rem", fontFamily: ff, cursor: "pointer", fontWeight: value === opt ? 700 : 400,
            background: value === opt ? T.brand[500] : T.faded[50],
            color: value === opt ? "#fff" : T.faded[700],
            borderColor: value === opt ? T.brand[500] : T.faded[100],
            transition: "all 0.12s",
          }}>{opt}</button>
        ))}
      </div>
    </div>
  )
}

function PropBool({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 'var(--space-2)' }}>
      <span style={{ fontSize: "0.6rem", fontWeight: 700, color: T.faded[500], textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: ff }}>{label}</span>
      <button onClick={() => onChange(!value)} style={{
        width: "32px", height: "18px", borderRadius: "9px", border: "none", cursor: "pointer", position: "relative",
        background: value ? T.brand[500] : T.faded[200], transition: "background 0.15s",
      }}>
        <span style={{ position: "absolute", top: "2px", width: "14px", height: "14px", borderRadius: "50%", background: "#fff", left: value ? "16px" : "2px", transition: "left 0.15s" }} />
      </button>
    </div>
  )
}

function Playground({ label, controls, children }: { label: string; controls: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ border: `1px solid ${T.faded[100]}`, borderRadius: T.radius.large, overflow: "hidden", marginBottom: 'var(--space-3)' }}>
      <div style={{ padding: 'var(--space-2) 14px', background: T.faded[50], borderBottom: `1px solid ${T.faded[100]}` }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: T.faded[700], fontFamily: ff }}>{label}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", minHeight: "80px" }}>
        {/* Preview area */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 'var(--space-6) var(--space-4)', background: "#fff", gap: 'var(--space-5)', flexWrap: "wrap", minHeight: "80px" }}>
          {children}
        </div>
        {/* Props panel */}
        <div style={{ background: "var(--color-bg-secondary)", borderLeft: `1px solid ${T.faded[100]}`, padding: 'var(--space-3)', display: "flex", flexDirection: "column", gap: "10px", minWidth: "160px", maxWidth: "200px" }}>
          {controls}
        </div>
      </div>
    </div>
  )
}

// ─── Live Components (using tokens) ──────────────────────────────────────────

// Button
type BtnVariant = "primary" | "secondary" | "ghost" | "danger"
type BtnSize = "small" | "medium" | "large"

function NButton({ variant="primary", size="medium", disabled=false, loading=false, label="Button", onClick }: {
  variant?: BtnVariant; size?: BtnSize; disabled?: boolean; loading?: boolean; label?: string; onClick?: () => void
}) {
  const heights: Record<BtnSize, number> = { small: 32, medium: 40, large: 48 }
  const paddings: Record<BtnSize, string> = { small: "0 12px", medium: "0 16px", large: "0 20px" }
  const fontSizes: Record<BtnSize, number> = { small: 13, medium: 14, large: 15 }
  const radii: Record<BtnSize, number> = { small: T.radius.xsmall, medium: T.radius.small, large: T.radius.small }

  const styles: Record<BtnVariant, { bg: string; color: string; border: string }> = {
    primary:   { bg: disabled ? T.interaction.bgPrimaryDisabled : T.interaction.bgPrimaryDefault, color: disabled ? "rgba(255,255,255,0.5)" : T.interaction.textOnPrimary, border: "transparent" },
    secondary: { bg: "transparent", color: disabled ? T.faded[300] : T.interaction.textPrimaryDefault, border: disabled ? T.faded[200] : T.interaction.borderPrimaryDefault },
    ghost:     { bg: disabled ? T.interaction.bgGreyDisabled : T.interaction.bgGreyDefault, color: disabled ? T.faded[300] : T.interaction.textGreyIntense, border: T.interaction.borderGreyDefault },
    danger:    { bg: disabled ? T.feedback.bgErrorSubtle : T.feedback.bgErrorIntense, color: disabled ? T.red[300] : "#fff", border: "transparent" },
  }
  const s = styles[variant]

  return (
    <button disabled={disabled} onClick={onClick} style={{
      height: heights[size], padding: paddings[size], borderRadius: radii[size], border: `1px solid ${s.border}`,
      background: s.bg, color: s.color, fontSize: fontSizes[size], fontWeight: 600, fontFamily: ff,
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.7 : 1, whiteSpace: "nowrap",
      transition: "all 0.12s", display: "inline-flex", alignItems: "center", gap: "6px",
    }}>
      {loading && <span style={{ width: "12px", height: "12px", border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />}
      {loading ? "Loading…" : label}
    </button>
  )
}

// Checkbox
function NCheckbox({ checked, indeterminate=false, disabled=false, label="Agree to terms" }: { checked: boolean; indeterminate?: boolean; disabled?: boolean; label?: string }) {
  const borderColor = disabled ? T.faded[200] : checked || indeterminate ? T.brand[500] : T.interaction.borderGreyDefault
  const bg = disabled ? T.faded[50] : (checked || indeterminate) ? T.brand[500] : "#fff"
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 'var(--space-2)', cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1 }}>
      <div style={{ width: 20, height: 20, borderRadius: T.radius.xsmall, border: `2px solid ${borderColor}`, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {(checked || indeterminate) && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            {indeterminate
              ? <line x1="2" y1="6" x2="10" y2="6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
              : <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>}
          </svg>
        )}
      </div>
      <span style={{ fontSize: 14, fontFamily: ff, color: disabled ? T.faded[400] : T.surface.textGreyDefault }}>{label}</span>
    </label>
  )
}

// RadioButton
function NRadio({ selected, disabled=false, label="Option", size="medium" }: { selected: boolean; disabled?: boolean; label?: string; size?: "small"|"medium" }) {
  const dim = size === "small" ? 18 : 22
  const innerDim = size === "small" ? 8 : 10
  const borderColor = disabled ? T.faded[200] : selected ? T.brand[500] : T.interaction.borderGreyDefault
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 'var(--space-2)', cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1 }}>
      <div style={{ width: dim, height: dim, borderRadius: "50%", border: `2px solid ${borderColor}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {selected && <div style={{ width: innerDim, height: innerDim, borderRadius: "50%", background: disabled ? T.faded[300] : T.brand[500] }} />}
      </div>
      <span style={{ fontSize: size === "small" ? 13 : 14, fontFamily: ff, color: disabled ? T.faded[400] : T.surface.textGreyDefault }}>{label}</span>
    </label>
  )
}

// Chips
function NChip({ label="Design", removable=true, selected=false, disabled=false, icon=false }: { label?: string; removable?: boolean; selected?: boolean; disabled?: boolean; icon?: boolean }) {
  const [removed, setRemoved] = useState(false)
  if (removed) return null
  const bg = disabled ? T.faded[50] : selected ? T.brand[50] : "#fff"
  const border = disabled ? T.faded[100] : selected ? T.brand[200] : T.faded[100]
  const color = disabled ? T.faded[400] : selected ? T.brand[600] : T.faded[700]
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 'var(--space-1)', padding: 'var(--space-1) 10px', borderRadius: T.radius.max, border: `1px solid ${border}`, background: bg, opacity: disabled ? 0.6 : 1 }}>
      {icon && <span style={{ fontSize: "10px" }}>🏷️</span>}
      <span style={{ fontSize: 13, fontFamily: ff, color, fontWeight: selected ? 600 : 400 }}>{label}</span>
      {removable && !disabled && (
        <button onClick={() => setRemoved(true)} style={{ border: "none", background: "none", padding: 0, cursor: "pointer", color, lineHeight: 1, fontSize: "11px", marginLeft: "2px" }}>✕</button>
      )}
    </div>
  )
}

// Avatar
type AvatarSize = "xsmall"|"small"|"medium"|"large"
function NAvatar({ initials="AB", size="medium", variant="initials", showBadge=false }: { initials?: string; size?: AvatarSize; variant?: "initials"|"icon"; showBadge?: boolean }) {
  const dims: Record<AvatarSize, number> = { xsmall: 24, small: 32, medium: 40, large: 48 }
  const fonts: Record<AvatarSize, number> = { xsmall: 9, small: 12, medium: 14, large: 17 }
  const d = dims[size]
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div style={{ width: d, height: d, borderRadius: "50%", background: T.brand[100], display: "flex", alignItems: "center", justifyContent: "center" }}>
        {variant === "icon"
          ? <svg width={d*0.5} height={d*0.5} viewBox="0 0 24 24" fill={T.brand[500]}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          : <span style={{ fontSize: fonts[size], fontWeight: 700, color: T.brand[700], fontFamily: ff }}>{initials.slice(0,2).toUpperCase()}</span>
        }
      </div>
      {showBadge && <div style={{ position: "absolute", bottom: 0, right: 0, width: d*0.28, height: d*0.28, borderRadius: "50%", background: T.green[500], border: "2px solid #fff" }} />}
    </div>
  )
}

// Badge
type BadgeVariant = "success"|"warning"|"error"|"info"|"neutral"
function NBadge({ variant="success", count=3, showDot=false }: { variant?: BadgeVariant; count?: number; showDot?: boolean }) {
  const colors: Record<BadgeVariant,{bg:string;text:string}> = {
    success: { bg: T.feedback.bgSuccessIntense, text: "#fff" },
    warning: { bg: T.feedback.bgWarningIntense, text: "#fff" },
    error:   { bg: T.feedback.bgErrorIntense, text: "#fff" },
    info:    { bg: T.feedback.bgInfoIntense, text: "#fff" },
    neutral: { bg: T.faded[600], text: "#fff" },
  }
  const c = colors[variant]
  return showDot
    ? <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.bg, border: "2px solid #fff" }} />
    : <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 20, height: 20, borderRadius: T.radius.max, background: c.bg, padding: "0 6px" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: c.text, fontFamily: ff }}>{count > 99 ? "99+" : count}</span>
      </div>
}

// InputTextField
type InputState = "default"|"focused"|"error"|"success"|"disabled"
function NInput({ label="Email", state="default", placeholder="you@example.com", helperText="", leadingIcon=false, trailingIcon=false }: {
  label?: string; state?: InputState; placeholder?: string; helperText?: string; leadingIcon?: boolean; trailingIcon?: boolean
}) {
  const stateColors: Record<InputState,{border:string;helper:string}> = {
    default:  { border: T.interaction.borderGreyDefault, helper: T.faded[400] },
    focused:  { border: T.brand[500], helper: T.faded[400] },
    error:    { border: T.red[500], helper: T.red[500] },
    success:  { border: T.green[500], helper: T.green[600] },
    disabled: { border: T.faded[100], helper: T.faded[300] },
  }
  const stateHelpers: Record<InputState,string> = {
    default: helperText || "Enter your email address",
    focused: helperText || "We'll never share your email",
    error: helperText || "Invalid email format",
    success: helperText || "Email looks good!",
    disabled: helperText || "Field is disabled",
  }
  const s = stateColors[state]
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 'var(--space-1)', width: "200px" }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: state === "disabled" ? T.faded[300] : T.surface.textGreyDefault, fontFamily: ff }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 'var(--space-2)', height: 44, border: `1.5px solid ${s.border}`, borderRadius: T.radius.small, padding: "0 12px", background: state === "disabled" ? T.faded[50] : "#fff", opacity: state === "disabled" ? 0.7 : 1 }}>
        {leadingIcon && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.faded[500]} strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg>}
        <input disabled={state === "disabled"} placeholder={placeholder} style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: ff, background: "transparent", color: T.surface.textGreyDefault }} />
        {trailingIcon && (state === "success" ? <span style={{ color: T.green[500], fontSize: "14px" }}>✓</span> : state === "error" ? <span style={{ color: T.red[500], fontSize: "14px" }}>✕</span> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.faded[400]} strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>)}
      </div>
      <span style={{ fontSize: 11, color: s.helper, fontFamily: ff }}>{stateHelpers[state]}</span>
    </div>
  )
}

// Banner
type BannerVariant = "success"|"error"|"warning"|"info"|"neutral"
function NBanner({ variant="success", title="", body="", dismissible=true }: { variant?: BannerVariant; title?: string; body?: string; dismissible?: boolean }) {
  const [hidden, setHidden] = useState(false)
  if (hidden) return <span style={{ fontSize: 12, color: T.faded[400], fontFamily: ff }}>Banner dismissed</span>
  const cfg: Record<BannerVariant,{bg:string;border:string;icon:string;color:string}> = {
    success: { bg: T.feedback.bgSuccessSubtle, border: T.feedback.borderSuccessSubtle, icon: "✓", color: T.feedback.textSuccessIntense },
    error:   { bg: T.feedback.bgErrorSubtle,   border: T.feedback.borderErrorSubtle,   icon: "✕", color: T.feedback.textErrorIntense },
    warning: { bg: T.feedback.bgWarningSubtle, border: T.feedback.borderWarningSubtle, icon: "⚠", color: T.feedback.textWarningIntense },
    info:    { bg: T.feedback.bgInfoSubtle,    border: "#0071bc33",                    icon: "ℹ", color: T.feedback.bgInfoIntense },
    neutral: { bg: T.feedback.bgGreySubtle,    border: T.faded[100],                  icon: "·", color: T.faded[600] },
  }
  const c = cfg[variant]
  const defaultTitles: Record<BannerVariant, string> = { success: "Changes saved", error: "Something went wrong", warning: "Please review", info: "New update available", neutral: "Note" }
  const defaultBodies: Record<BannerVariant, string> = { success: "Your profile has been updated successfully.", error: "Please try again or contact support.", warning: "Some fields require your attention.", info: "Version 2.4 is ready to install.", neutral: "This action cannot be undone." }
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: 'var(--space-3) 14px', borderRadius: T.radius.small, border: `1px solid ${c.border}`, background: c.bg, width: "220px" }}>
      <span style={{ fontWeight: 700, color: c.color, fontSize: "16px", flexShrink: 0, lineHeight: 1.3 }}>{c.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: c.color, fontFamily: ff, marginBottom: "2px" }}>{title || defaultTitles[variant]}</div>
        <div style={{ fontSize: 12, color: T.surface.textGreyDefault, fontFamily: ff, lineHeight: 1.5 }}>{body || defaultBodies[variant]}</div>
      </div>
      {dismissible && <button onClick={() => setHidden(true)} style={{ border: "none", background: "none", cursor: "pointer", color: T.faded[400], fontSize: "12px", padding: 0, flexShrink: 0 }}>✕</button>}
    </div>
  )
}

// Menu
function NMenu({ trigger="Open Menu" }: { trigger?: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])
  const items = [
    { label: "Edit profile", icon: "✏️" },
    { label: "Settings", icon: "⚙️" },
    { label: "Notifications", icon: "🔔" },
    { divider: true },
    { label: "Sign out", icon: "🚪", danger: true },
  ]
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <NButton variant="secondary" label={trigger} onClick={() => setOpen(o => !o)} />
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, background: "#fff", border: `1px solid ${T.faded[100]}`, borderRadius: T.radius.small, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", minWidth: "160px", zIndex: 100, overflow: "hidden" }}>
          {items.map((item, i) =>
            "divider" in item
              ? <div key={i} style={{ height: 1, background: T.faded[100], margin: "4px 0" }} />
              : <button key={i} onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: 'var(--space-2)', width: "100%", padding: '10px 14px', border: "none", background: "none", cursor: "pointer", fontSize: 13, fontFamily: ff, color: item.danger ? T.red[600] : T.surface.textGreyDefault, textAlign: "left" }}>
                  <span>{item.icon}</span> {item.label}
                </button>
          )}
        </div>
      )}
    </div>
  )
}

// Wizard
function NWizard({ steps=3, currentStep=1 }: { steps?: number; currentStep?: number }) {
  const labels = ["Details", "Review", "Confirm", "Done"]
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, width: "260px" }}>
      {Array.from({length: steps}).map((_, i) => (
        <>
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 'var(--space-1)' }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: i+1 < currentStep ? T.brand[500] : i+1 === currentStep ? T.brand[500] : T.faded[100], border: i+1 === currentStep ? `2px solid ${T.brand[500]}` : "none" }}>
              {i+1 < currentStep
                ? <span style={{ color: "#fff", fontSize: "12px" }}>✓</span>
                : <span style={{ color: i+1 === currentStep ? "#fff" : T.faded[400], fontSize: "11px", fontWeight: 700, fontFamily: ff }}>{i+1}</span>
              }
            </div>
            <span style={{ fontSize: "10px", fontFamily: ff, color: i+1 === currentStep ? T.brand[600] : T.faded[400], fontWeight: i+1 === currentStep ? 700 : 400, whiteSpace: "nowrap" }}>{labels[i]}</span>
          </div>
          {i < steps - 1 && <div style={{ flex: 1, height: 2, background: i+1 < currentStep ? T.brand[500] : T.faded[100], marginBottom: "14px" }} />}
        </>
      ))}
    </div>
  )
}

// Modal (inline, not real portal)
function NModal({ show=true, size="medium" }: { show?: boolean; size?: "small"|"medium"|"large" }) {
  const widths = { small: "240px", medium: "300px", large: "360px" }
  if (!show) return <span style={{ fontSize: 12, color: T.faded[400], fontFamily: ff }}>Modal hidden</span>
  return (
    <div style={{ width: widths[size], border: `1px solid ${T.faded[100]}`, borderRadius: T.radius.large, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
      <div style={{ padding: '14px var(--space-4)', borderBottom: `1px solid ${T.faded[100]}` }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.surface.textGreyDefault, fontFamily: ff }}>Confirm action</div>
        <div style={{ fontSize: 12, color: T.surface.textGreySubtle, fontFamily: ff, marginTop: 'var(--space-1)' }}>This cannot be undone.</div>
      </div>
      <div style={{ padding: '14px var(--space-4)' }}>
        <p style={{ fontSize: 13, color: T.surface.textGreyDefault, fontFamily: ff, lineHeight: 1.6, margin: 0 }}>Are you sure you want to delete this event? All attendee data will be permanently removed.</p>
      </div>
      <div style={{ padding: 'var(--space-3) var(--space-4)', borderTop: `1px solid ${T.faded[100]}`, display: "flex", gap: 'var(--space-2)', justifyContent: "flex-end" }}>
        <NButton variant="ghost" size="small" label="Cancel" />
        <NButton variant="danger" size="small" label="Delete" />
      </div>
    </div>
  )
}

// BottomSheet (compact inline)
function NBottomSheet({ show=true }: { show?: boolean }) {
  if (!show) return <span style={{ fontSize: 12, color: T.faded[400], fontFamily: ff }}>Sheet hidden</span>
  const opts = [{ label: "Share link", icon: "🔗" }, { label: "Download PDF", icon: "📄" }, { label: "Print", icon: "🖨️" }]
  return (
    <div style={{ width: "260px", border: `1px solid ${T.faded[100]}`, borderRadius: `${T.radius.large}px ${T.radius.large}px 0 0`, overflow: "hidden", background: "#fff", boxShadow: "0 -4px 24px rgba(0,0,0,0.08)" }}>
      <div style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
        <div style={{ width: "36px", height: "4px", borderRadius: T.radius.max, background: T.faded[200] }} />
      </div>
      <div style={{ padding: 'var(--space-2) var(--space-4) var(--space-4)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.surface.textGreyDefault, fontFamily: ff, marginBottom: 'var(--space-3)' }}>Export event</div>
        {opts.map(o => (
          <div key={o.label} style={{ display: "flex", alignItems: "center", gap: 'var(--space-3)', padding: "12px 0", borderBottom: `1px solid ${T.faded[50]}` }}>
            <span>{o.icon}</span>
            <span style={{ fontSize: 14, fontFamily: ff, color: T.surface.textGreyDefault }}>{o.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// NButton onClick prop (extend to support plain clicks)
declare module "react" {
  interface ButtonHTMLAttributes<T> { onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void }
}

// ─── Interactive Component Playgrounds ───────────────────────────────────────

function ButtonPlayground() {
  const [variant, setVariant] = useState<BtnVariant>("primary")
  const [size, setSize] = useState<BtnSize>("medium")
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  return (
    <Playground label="Button"
      controls={<>
        <PropToggle label="Variant" options={["primary","secondary","ghost","danger"] as BtnVariant[]} value={variant} onChange={setVariant} />
        <PropToggle label="Size" options={["small","medium","large"] as BtnSize[]} value={size} onChange={setSize} />
        <PropBool label="Disabled" value={disabled} onChange={setDisabled} />
        <PropBool label="Loading" value={loading} onChange={setLoading} />
      </>}
    >
      <NButton variant={variant} size={size} disabled={disabled} loading={loading} label="Book Ticket" />
      <NButton variant={variant} size={size} disabled={disabled} loading={loading} label="Register" />
    </Playground>
  )
}

function CheckboxPlayground() {
  const [checked, setChecked] = useState(true)
  const [indeterminate, setIndeterminate] = useState(false)
  const [disabled, setDisabled] = useState(false)
  return (
    <Playground label="Checkbox"
      controls={<>
        <PropBool label="Checked" value={checked} onChange={setChecked} />
        <PropBool label="Indeterminate" value={indeterminate} onChange={setIndeterminate} />
        <PropBool label="Disabled" value={disabled} onChange={setDisabled} />
      </>}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <NCheckbox checked={checked} indeterminate={indeterminate} disabled={disabled} label="Accept terms & conditions" />
        <NCheckbox checked={false} disabled={disabled} label="Subscribe to updates" />
        <NCheckbox checked={true} disabled={disabled} label="Receive SMS alerts" />
      </div>
    </Playground>
  )
}

function RadioPlayground() {
  const [selected, setSelected] = useState("free")
  const [size, setSize] = useState<"small"|"medium">("medium")
  const [disabled, setDisabled] = useState(false)
  const opts = [{ value: "free", label: "Free registration" }, { value: "paid", label: "Paid (₹200 commitment)" }, { value: "invite", label: "Invite only" }]
  return (
    <Playground label="RadioButton"
      controls={<>
        <PropToggle label="Size" options={["small","medium"]} value={size} onChange={setSize} />
        <PropBool label="Disabled" value={disabled} onChange={setDisabled} />
      </>}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {opts.map(o => (
          <NRadioWithClick key={o.value} selected={selected===o.value} label={o.label} size={size} disabled={disabled}
            onClick={() => { if (!disabled) setSelected(o.value) }} />
        ))}
      </div>
    </Playground>
  )
}

function NRadioWithClick({ selected, onClick, disabled, label, size }: { selected: boolean; onClick: () => void; disabled?: boolean; label?: string; size?: "small"|"medium" }) {
  return (
    <div onClick={onClick} style={{ cursor: disabled ? "not-allowed" : "pointer" }}>
      <NRadio selected={selected} disabled={disabled} label={label} size={size} />
    </div>
  )
}

function ChipsPlayground() {
  const [removable, setRemovable] = useState(true)
  const [icon, setIcon] = useState(false)
  const [selected, setSelected] = useState(false)
  return (
    <Playground label="Chips"
      controls={<>
        <PropBool label="Removable" value={removable} onChange={setRemovable} />
        <PropBool label="Icon" value={icon} onChange={setIcon} />
        <PropBool label="Selected" value={selected} onChange={setSelected} />
      </>}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {["Design System","Tokens","React","Figma","Components"].map(l => (
          <NChip key={l} label={l} removable={removable} selected={selected} icon={icon} />
        ))}
      </div>
    </Playground>
  )
}

function AvatarPlayground() {
  const [size, setSize] = useState<AvatarSize>("medium")
  const [variant, setVariant] = useState<"initials"|"icon">("initials")
  const [badge, setBadge] = useState(false)
  return (
    <Playground label="Avatar"
      controls={<>
        <PropToggle label="Size" options={["xsmall","small","medium","large"] as AvatarSize[]} value={size} onChange={setSize} />
        <PropToggle label="Variant" options={["initials","icon"]} value={variant} onChange={setVariant} />
        <PropBool label="Online Badge" value={badge} onChange={setBadge} />
      </>}
    >
      {["AB","KS","MR","JD"].map(i => <NAvatar key={i} initials={i} size={size} variant={variant} showBadge={badge} />)}
    </Playground>
  )
}

function BadgePlayground() {
  const [variant, setVariant] = useState<BadgeVariant>("success")
  const [showDot, setShowDot] = useState(false)
  const [count, setCount] = useState(3)
  return (
    <Playground label="Badge"
      controls={<>
        <PropToggle label="Variant" options={["success","error","warning","info","neutral"] as BadgeVariant[]} value={variant} onChange={setVariant} />
        <PropBool label="Dot mode" value={showDot} onChange={setShowDot} />
        <div>
          <span style={{ fontSize: "0.6rem", fontWeight: 700, color: T.faded[500], textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: ff, display: "block", marginBottom: 'var(--space-1)' }}>Count</span>
          <input type="range" min={0} max={120} value={count} onChange={e => setCount(+e.target.value)} style={{ width: "100%" }} />
          <span style={{ fontSize: "0.6rem", color: T.faded[400], fontFamily: ff }}>{count}</span>
        </div>
      </>}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 'var(--space-3)', alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 'var(--space-2)' }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: T.faded[100], display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.faded[500]} strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <div style={{ position: "absolute", top: "-4px", right: "-4px" }}><NBadge variant={variant} count={count} showDot={showDot} /></div>
          </div>
          <span style={{ fontSize: 13, fontFamily: ff, color: T.faded[600] }}>Notifications</span>
        </div>
        <NBadge variant={variant} count={count} showDot={showDot} />
      </div>
    </Playground>
  )
}

function InputPlayground() {
  const [state, setState] = useState<InputState>("default")
  const [leading, setLeading] = useState(false)
  const [trailing, setTrailing] = useState(true)
  return (
    <Playground label="InputTextField"
      controls={<>
        <PropToggle label="State" options={["default","focused","error","success","disabled"] as InputState[]} value={state} onChange={setState} />
        <PropBool label="Leading Icon" value={leading} onChange={setLeading} />
        <PropBool label="Trailing Icon" value={trailing} onChange={setTrailing} />
      </>}
    >
      <NInput label="Email address" state={state} placeholder="you@example.com" leadingIcon={leading} trailingIcon={trailing} />
    </Playground>
  )
}

function BannerPlayground() {
  const [variant, setVariant] = useState<BannerVariant>("success")
  const [dismissible, setDismissible] = useState(true)
  const [key, setKey] = useState(0)
  return (
    <Playground label="Banner"
      controls={<>
        <PropToggle label="Variant" options={["success","error","warning","info","neutral"] as BannerVariant[]} value={variant} onChange={v => { setVariant(v); setKey(k => k+1) }} />
        <PropBool label="Dismissible" value={dismissible} onChange={setDismissible} />
        <button onClick={() => setKey(k => k+1)} style={{ padding: 'var(--space-1) 10px', borderRadius: T.radius.xsmall, border: `1px solid ${T.brand[200]}`, background: T.brand[50], color: T.brand[700], fontSize: "0.65rem", fontFamily: ff, cursor: "pointer" }}>↺ Reset</button>
      </>}
    >
      <NBanner key={key} variant={variant} dismissible={dismissible} />
    </Playground>
  )
}

function MenuPlayground() {
  return (
    <Playground label="Menu"
      controls={<div style={{ fontSize: "0.65rem", color: T.faded[500], fontFamily: ff, lineHeight: 1.6 }}>Click the button to open the dropdown. Supports icons, dividers, and danger variants.</div>}
    >
      <NMenu trigger="Account options" />
    </Playground>
  )
}

function WizardPlayground() {
  const [step, setStep] = useState(2)
  const [steps, setSteps] = useState(3)
  return (
    <Playground label="Wizard"
      controls={<>
        <PropToggle label="Steps" options={["3","4"]} value={String(steps)} onChange={v => { setSteps(+v); setStep(1) }} />
        <div>
          <span style={{ fontSize: "0.6rem", fontWeight: 700, color: T.faded[500], textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: ff, display: "block", marginBottom: 'var(--space-1)' }}>Current step</span>
          <input type="range" min={1} max={steps} value={step} onChange={e => setStep(+e.target.value)} style={{ width: "100%" }} />
          <span style={{ fontSize: "0.6rem", color: T.faded[400], fontFamily: ff }}>Step {step} of {steps}</span>
        </div>
      </>}
    >
      <NWizard steps={steps} currentStep={step} />
    </Playground>
  )
}

function ModalPlayground() {
  const [show, setShow] = useState(true)
  const [size, setSize] = useState<"small"|"medium"|"large">("medium")
  return (
    <Playground label="Modal"
      controls={<>
        <PropToggle label="Size" options={["small","medium","large"]} value={size} onChange={v => { setSize(v); setShow(true) }} />
        <PropBool label="Visible" value={show} onChange={setShow} />
      </>}
    >
      <NModal show={show} size={size} />
    </Playground>
  )
}

function BottomSheetPlayground() {
  const [show, setShow] = useState(true)
  return (
    <Playground label="BottomSheet"
      controls={<PropBool label="Visible" value={show} onChange={setShow} />}
    >
      <NBottomSheet show={show} />
    </Playground>
  )
}

// ─── Color swatch (click to copy) ────────────────────────────────────────────
function ColorSwatch({ shade }: { shade: ColorShade }) {
  const [copied, setCopied] = useState(false)
  const shadeNum = shade.name.split("-").slice(-1)[0]
  const isAlpha = shade.value.length > 7
  return (
    <div title={`${shade.name} - ${shade.value}`} onClick={() => { navigator.clipboard.writeText(shade.value).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false), 1200) }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 'var(--space-1)', width: "48px", cursor: "pointer" }}>
      <div style={{ width: 48, height: 32, borderRadius: T.radius.xsmall, border: "1px solid rgba(0,0,0,0.06)", position: "relative", overflow: "hidden", backgroundImage: isAlpha ? "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 8px 8px" : "none" }}>
        <div style={{ position: "absolute", inset: 0, background: shade.value, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {copied && <span style={{ fontSize: "0.5rem", background: "rgba(0,0,0,0.7)", color: "#fff", padding: '1px var(--space-1)', borderRadius: "3px" }}>✓</span>}
        </div>
      </div>
      <span style={{ fontSize: "0.52rem", color: T.faded[500], fontFamily: T.font.mono }}>{shadeNum}</span>
    </div>
  )
}

// ─── Semantic Token Row ───────────────────────────────────────────────────────
function TokenRow({ token, showDark }: { token: SemanticToken; showDark: boolean }) {
  const val = showDark ? token.dark : token.light
  const [copied, setCopied] = useState(false)
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: '7px 14px', borderBottom: `1px solid ${T.faded[50]}` }}>
      <div onClick={() => { navigator.clipboard.writeText(val).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),1200) }}
        title="Click to copy" style={{ width: 24, height: 24, borderRadius: T.radius.xsmall, flexShrink: 0, cursor: "pointer", position: "relative", overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)", backgroundImage: "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 8px 8px" }}>
        <div style={{ position: "absolute", inset: 0, background: val, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {copied && <span style={{ fontSize: "0.4rem", background: "rgba(0,0,0,0.7)", color: "#fff", padding: '1px 3px', borderRadius: "var(--radius-xs)" }}>✓</span>}
        </div>
      </div>
      <span style={{ flex: 1, fontSize: "0.68rem", fontFamily: T.font.mono, color: T.faded[700], overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{token.name}</span>
      <span style={{ fontSize: "0.62rem", fontFamily: T.font.mono, color: T.faded[400], flexShrink: 0 }}>{val}</span>
    </div>
  )
}

// ─── Public Exports ──────────────────────────────────────────────────────────

export function NeighbourhoodColorTokens() {
  return (
    <div style={{ marginTop: 'var(--space-2)' }}>
      <WhyNote>Raw hex values hardcoded in components create unmaintainable sprawl. A named color palette lets every token reference a single source - change brand-500 once, every consuming token updates. The alpha variants (brand-p, teal-s…) solve overlay states without inventing one-off rgba values.</WhyNote>
      {BASE_COLOR_FAMILIES.map((fam) => (
        <div key={fam.label} style={{ marginBottom: "18px" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: T.faded[500], textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px", fontFamily: ff }}>
            {fam.label} <span style={{ fontWeight: 400, opacity: 0.6 }}>({fam.shades.length})</span>
          </div>
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            {fam.shades.map(s => <ColorSwatch key={s.name} shade={s} />)}
          </div>
        </div>
      ))}
    </div>
  )
}

export function NeighbourhoodSemanticTokens() {
  const [showDark, setShowDark] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(SEMANTIC_TOKEN_GROUPS[0].group)
  return (
    <div style={{ marginTop: 'var(--space-2)' }}>
      <WhyNote>Semantic tokens break the two-step reference chain: instead of using brand-500 directly in a button, you reference interaction-background-primary-default. When the brand shifts from red to teal, only the token mapping changes - every component inherits the update without touching code. The light/dark split here is baked into the token layer, not scattered across media queries.</WhyNote>
      <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
        {[{l:"☀️ Light",v:false},{l:"🌙 Dark",v:true}].map(opt => (
          <button key={String(opt.v)} onClick={() => setShowDark(opt.v)} style={{ padding: '5px 14px', borderRadius: T.radius.small, border: "1px solid", fontSize: "0.78rem", fontFamily: ff, cursor: "pointer", fontWeight: showDark===opt.v ? 700 : 400, background: showDark===opt.v ? "var(--color-text-primary)" : T.faded[50], color: showDark===opt.v ? "#fff" : T.faded[600], borderColor: showDark===opt.v ? "var(--color-text-primary)" : T.faded[100] }}>{opt.l}</button>
        ))}
      </div>
      {SEMANTIC_TOKEN_GROUPS.map(group => (
        <div key={group.group} style={{ marginBottom: "6px", border: `1px solid ${T.faded[100]}`, borderRadius: T.radius.small, overflow: "hidden" }}>
          <button onClick={() => setOpenGroup(openGroup===group.group ? null : group.group)} style={{ width: "100%", padding: '10px 14px', display: "flex", justifyContent: "space-between", alignItems: "center", background: T.faded[50], border: "none", cursor: "pointer" }}>
            <span style={{ fontSize: "0.76rem", fontWeight: 700, color: T.surface.textGreyDefault, fontFamily: ff }}>{group.group}</span>
            <span style={{ fontSize: "0.65rem", color: T.faded[400], fontFamily: T.font.mono }}>{group.tokens.length} {openGroup===group.group?"▲":"▼"}</span>
          </button>
          {openGroup===group.group && group.tokens.map(tok => <TokenRow key={tok.name} token={tok} showDark={showDark} />)}
        </div>
      ))}
    </div>
  )
}

export function NeighbourhoodTypeScale() {
  const [viewport, setViewport] = useState<"Mobile"|"Web"|"All">("All")
  const [weight, setWeight] = useState(400)
  const filtered = TYPE_SCALE.filter(t => viewport==="All" || t.viewport===viewport)
  return (
    <div style={{ marginTop: 'var(--space-2)' }}>
      <WhyNote>Named type roles (web-label-small, mobile-heading-large) encode intent, not just size. When a developer reaches for "the small button label", they pick the role - not a magic number. Separating viewport contexts in the token name means mobile and web can resolve the same role to different sizes without component-level conditionals.</WhyNote>
      <div style={{ display: "flex", gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {(["All", "Mobile", "Web"] as const).map(vp => (
            <button
              key={vp}
              onClick={() => setViewport(vp)}
              style={{
                padding: '6px 14px',
                borderRadius: "var(--radius-md)",
                border: "1px solid",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: ff,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
                background: viewport === vp ? "#3b82f6" : "var(--color-bg-secondary)",
                color: viewport === vp ? "#ffffff" : "#475569",
                borderColor: viewport === vp ? "#3b82f6" : "var(--color-border)",
                boxShadow: viewport === vp ? "0 2px 8px rgba(59, 130, 246, 0.25)" : "none",
              }}
            >
              {vp === "All" && <Icon icon="solar:globus-outline" width={14} />}
              {vp === "Mobile" && <Icon icon="solar:smartphone-outline" width={14} />}
              {vp === "Web" && <Icon icon="solar:monitor-outline" width={14} />}
              {vp}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {WEIGHTS.map(w => (
            <button
              key={w.value}
              onClick={() => setWeight(w.value)}
              style={{
                padding: '6px var(--space-3)',
                borderRadius: "var(--radius-md)",
                border: "1px solid",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: ff,
                transition: "all 0.15s ease",
                background: weight === w.value ? "#3b82f6" : "var(--color-bg-secondary)",
                color: weight === w.value ? "#ffffff" : "#475569",
                borderColor: weight === w.value ? "#3b82f6" : "var(--color-border)",
                boxShadow: weight === w.value ? "0 2px 8px rgba(59, 130, 246, 0.25)" : "none",
              }}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ border: `1px solid ${T.faded[100]}`, borderRadius: T.radius.small, overflow: "hidden", background: "#fff" }}>
        {filtered.map((t, i) => (
          <div key={t.name} style={{ display: "grid", gridTemplateColumns: "100px 1fr 60px", alignItems: "center", gap: "10px", padding: '10px 14px', borderBottom: i===filtered.length-1?"none":`1px solid ${T.faded[50]}` }}>
            <div>
              <div style={{ fontSize: "0.55rem", fontFamily: T.font.mono, color: T.faded[400], lineHeight: 1.4 }}>
                <span style={{ display: "block", color: T.brand[400], fontWeight: 700 }}>{t.viewport}</span>
                {t.fontSize}px · lh {t.lineHeight}
              </div>
            </div>
            <div style={{ fontSize: Math.min(t.fontSize, 28), fontWeight: weight, lineHeight: `${Math.min(t.lineHeight, 36)}px`, color: T.surface.textGreyDefault, fontFamily: ff, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.role}</div>
            <div style={{ fontSize: "0.58rem", fontFamily: T.font.mono, color: T.faded[300], textAlign: "right" }}>w{weight}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function NeighbourhoodSizeTokens() {
  return (
    <div style={{ marginTop: 'var(--space-2)' }}>
      <WhyNote>Shared spacing vocabulary eliminates the most common design-to-dev drift: a designer uses "16px" and a developer uses "15px" because both worked from memory. Named steps (spacing-16) mean both sides reference the same token - and when the base unit changes, all derived values stay consistent.</WhyNote>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 'var(--space-3)' }}>
        <div style={{ border: `1px solid ${T.faded[100]}`, borderRadius: T.radius.small, overflow: "hidden" }}>
          <div style={{ padding: '10px 14px', background: T.faded[50], borderBottom: `1px solid ${T.faded[100]}` }}>
            <span style={{ fontSize: "0.76rem", fontWeight: 700, color: T.surface.textGreyDefault, fontFamily: ff }}>Spacing</span>
          </div>
          {SPACING_TOKENS.map((t, i) => (
            <div key={t.name} style={{ display: "flex", alignItems: "center", gap: "10px", padding: '7px 14px', borderBottom: i===SPACING_TOKENS.length-1?"none":`1px solid ${T.faded[50]}` }}>
              <div style={{ width: Math.min(t.value, 48)||2, height: 12, background: T.brand[400], borderRadius: "var(--radius-xs)", flexShrink: 0 }} />
              <span style={{ fontSize: "0.68rem", fontFamily: T.font.mono, color: T.faded[600], flex: 1 }}>{t.name}</span>
              <span style={{ fontSize: "0.65rem", fontFamily: T.font.mono, color: T.faded[400] }}>{t.value}px</span>
            </div>
          ))}
        </div>
        <div style={{ border: `1px solid ${T.faded[100]}`, borderRadius: T.radius.small, overflow: "hidden" }}>
          <div style={{ padding: '10px 14px', background: T.faded[50], borderBottom: `1px solid ${T.faded[100]}` }}>
            <span style={{ fontSize: "0.76rem", fontWeight: 700, color: T.surface.textGreyDefault, fontFamily: ff }}>Border Radius</span>
          </div>
          {RADIUS_TOKENS.map((t, i) => (
            <div key={t.name} style={{ display: "flex", alignItems: "center", gap: "10px", padding: '9px 14px', borderBottom: i===RADIUS_TOKENS.length-1?"none":`1px solid ${T.faded[50]}` }}>
              <div style={{ width: 36, height: 36, border: `2px solid ${T.brand[400]}`, borderRadius: Math.min(t.value,18), flexShrink: 0, background: T.brand[50] }} />
              <span style={{ fontSize: "0.68rem", fontFamily: T.font.mono, color: T.faded[600], flex: 1 }}>{t.label}</span>
              <span style={{ fontSize: "0.65rem", fontFamily: T.font.mono, color: T.faded[400] }}>{t.value===1000?"∞":t.value+"px"}</span>
            </div>
          ))}
        </div>
        <div style={{ border: `1px solid ${T.faded[100]}`, borderRadius: T.radius.small, overflow: "hidden" }}>
          <div style={{ padding: '10px 14px', background: T.faded[50], borderBottom: `1px solid ${T.faded[100]}` }}>
            <span style={{ fontSize: "0.76rem", fontWeight: 700, color: T.surface.textGreyDefault, fontFamily: ff }}>Icon Sizes</span>
          </div>
          {ICON_SIZE_TOKENS.map((t, i) => (
            <div key={t.name} style={{ display: "flex", alignItems: "center", gap: "10px", padding: '7px 14px', borderBottom: i===ICON_SIZE_TOKENS.length-1?"none":`1px solid ${T.faded[50]}` }}>
              {t.value > 0 ? <svg width={t.value} height={t.value} viewBox="0 0 24 24" fill={T.brand[400]} style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/></svg> : <div style={{ width: 2, height: 2, borderRadius: "50%", background: T.brand[400], flexShrink: 0 }} />}
              <span style={{ fontSize: "0.68rem", fontFamily: T.font.mono, color: T.faded[600], flex: 1 }}>{t.name}</span>
              <span style={{ fontSize: "0.65rem", fontFamily: T.font.mono, color: T.faded[400] }}>{t.value}px</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function NeighbourhoodComponents() {
  return (
    <div style={{ marginTop: 'var(--space-2)' }}>
      <WhyNote>Every component below is built using only the tokens defined in this system - no hardcoded hex, no magic numbers. Toggle props to see how state changes resolve through the token layer: a disabled button doesn't get its own color logic, it just references interaction-background-primary-disabled, which the token already defined.</WhyNote>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ marginBottom: 'var(--space-2)', fontSize: "0.68rem", fontWeight: 700, color: T.faded[500], textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: ff }}>Atoms</div>
      <ButtonPlayground />
      <CheckboxPlayground />
      <RadioPlayground />
      <ChipsPlayground />
      <AvatarPlayground />
      <BadgePlayground />
      <div style={{ marginBottom: 'var(--space-2)', marginTop: 'var(--space-3)', fontSize: "0.68rem", fontWeight: 700, color: T.faded[500], textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: ff }}>Molecules</div>
      <InputPlayground />
      <BannerPlayground />
      <MenuPlayground />
      <div style={{ marginBottom: 'var(--space-2)', marginTop: 'var(--space-3)', fontSize: "0.68rem", fontWeight: 700, color: T.faded[500], textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: ff }}>Organisms</div>
      <WizardPlayground />
      <ModalPlayground />
      <BottomSheetPlayground />
    </div>
  )
}

// ─── RadioButton fix: NRadioWithClick referenced without declaration error ────
const _RadioClickFix = NRadioWithClick
void _RadioClickFix
