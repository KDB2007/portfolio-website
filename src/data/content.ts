/**
 * Single source of site content, migrated from Portfolio v3. 
 */
import fairsplitThumb from '@/assets/fairsplit-thumbnail.jpeg'
import looplyThumb from '@/assets/looply-thumbnail.png'
import graphifyGraph from '@/assets/graphify-graph.webp'

export const site = {
  name: 'Kishan D Belavadi',
  mark: 'KDB',
  email: 'kishan.belavadi@gmail.com',
  pitch: "I test AI tools so you don't waste time on them, then build with the ones that work.",
  location: 'Bengaluru, India',
  availability: 'Open to internships',
  socials: [
    { id: 'github', label: 'GitHub', href: 'https://github.com/KDB2007', handle: 'KDB2007' },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/kishan-d-belavadi-93b404438/',
      handle: 'Kishan D Belavadi',
    },
    { id: 'x', label: 'X', href: 'https://x.com/kishan_belavadi', handle: '@kishan_belavadi' },
    { id: 'email', label: 'Email', href: 'mailto:kishan.belavadi@gmail.com', handle: 'kishan.belavadi@gmail.com' },
  ] as { id: SocialId; label: string; href: string; handle: string }[],
}

export type SocialId = 'github' | 'linkedin' | 'x' | 'email'

export const nav = [
  { id: 'experiments', label: 'Experiments' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const

export type ExperimentCategory = 'coding' | 'voice-input' | 'agents' | 'design' | 'productivity' | 'other'

export const experimentFilters: { id: 'all' | ExperimentCategory; label: string }[] = [
  { id: 'all', label: 'All experiments' },
  { id: 'coding', label: 'Coding' },
  { id: 'agents', label: 'Agents' },
  { id: 'voice-input', label: 'Voice input' },
  { id: 'design', label: 'Design' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'other', label: 'Other' },
]

export const categoryLabel: Record<ExperimentCategory, string> = {
  coding: 'Coding',
  'voice-input': 'Voice input',
  agents: 'Agents',
  design: 'Design',
  productivity: 'Productivity',
  other: 'Other',
}

export type ExperimentStatus = 'testing' | 'queued' | 'documented'

export type Experiment = {
  id: string
  name: string
  glyph: string
  category: ExperimentCategory
  summary: string
  status: ExperimentStatus
  rating: number | null // out of 5, null until reviewed
  verdict: string | null
  date: string | null
  href: string
  /** Review page content, shown at #/tested/<slug>. */
  slug: string
  body: string[]
  image?: { src: string; alt: string }
  checking?: string[]
  note?: string
  tags?: string[]
}

export const experiments: Experiment[] = [
  {
    id: '001',
    name: 'OpenBots',
    glyph: 'O',
    category: 'agents',
    summary: 'Testing now. Notes will land here as I go.',
    status: 'testing',
    rating: null,
    verdict: null,
    date: '2026-11-25',
    href: '#/tested/openbots',
    slug: 'openbots',
    body: ['Testing now. Notes will land here as I go.'],
    checking: ['Setup time', 'Reliability on real tasks', 'Worth the learning curve?'],
    note: 'Installed and running the first workflow.',
  },
  {
    id: '002',
    name: 'Graphify',
    glyph: 'G',
    category: 'coding',
    summary: 'Turns a whole codebase into a structured graph stored as JSON files, easier for AI to parse and noticeably lighter on tokens than raw source.',
    status: 'documented',
    rating: null,
    verdict: 'Verdict soon',
    date: '2026-11-24',
    href: '#/tested/graphify',
    slug: 'graphify',
    body: [
      'Graphify maps an entire project codebase into a structured graph of JSON files. Instead of handing an AI a raw source tree, you give it a graph it can parse directly: easier to navigate, and far fewer tokens when working with large projects.',
      'The verdict is still pending while I put it through larger real projects.',
    ],
    image: { src: graphifyGraph, alt: 'A Graphify graph of a codebase, with nodes grouped into coloured clusters' },
    tags: ['codebase', 'ai', 'context', 'graph'],
  },
  {
    id: '003',
    name: 'GStack',
    glyph: 'G',
    category: 'coding',
    summary: 'Tested. Full write-up coming soon.',
    status: 'documented',
    rating: null,
    verdict: 'Verdict soon',
    date: '2026-11-24',
    href: '#/tested/gstack',
    slug: 'gstack',
    body: ['Tested on 24 Nov 2026. The full write-up and verdict are still being written.'],
  },
  {
    id: '004',
    name: 'Agency Agents',
    glyph: 'A',
    category: 'agents',
    summary: 'Tested. Full write-up coming soon.',
    status: 'documented',
    rating: null,
    verdict: 'Verdict soon',
    date: '2026-11-24',
    href: '#/tested/agency-agents',
    slug: 'agency-agents',
    body: ['Tested on 24 Nov 2026. The full write-up and verdict are still being written.'],
  },
  {
    id: '005',
    name: 'Agent Reach',
    glyph: 'A',
    category: 'agents',
    summary: 'Tested. Full write-up coming soon.',
    status: 'documented',
    rating: null,
    verdict: 'Verdict soon',
    date: '2026-11-24',
    href: '#/tested/agent-reach',
    slug: 'agent-reach',
    body: ['Tested on 24 Nov 2026. The full write-up and verdict are still being written.'],
  },
  {
    id: '006',
    name: 'Omnivoice',
    glyph: 'O',
    category: 'voice-input',
    summary: 'Tested. Full write-up coming soon.',
    status: 'documented',
    rating: null,
    verdict: 'Verdict soon',
    date: '2026-11-24',
    href: '#/tested/omnivoice',
    slug: 'omnivoice',
    body: ['Tested on 24 Nov 2026. The full write-up and verdict are still being written.'],
  },
  {
    id: '007',
    name: 'Paca',
    glyph: 'P',
    category: 'other',
    summary: 'Tested. Full write-up coming soon.',
    status: 'documented',
    rating: null,
    verdict: 'Verdict soon',
    date: '2026-11-24',
    href: '#/tested/paca',
    slug: 'paca',
    body: ['Tested on 24 Nov 2026. The full write-up and verdict are still being written.'],
  },
  {
    id: '008',
    name: 'Strix',
    glyph: 'S',
    category: 'other',
    summary: 'Tested. Full write-up coming soon.',
    status: 'documented',
    rating: null,
    verdict: 'Verdict soon',
    date: '2026-11-24',
    href: '#/tested/strix',
    slug: 'strix',
    body: ['Tested on 24 Nov 2026. The full write-up and verdict are still being written.'],
  },
]

export type CaseStudy = {
  problem: string
  solution: { intro: string; points: { title: string; text: string }[]; outro?: string }
  contribution: string[]
  outcome: string
}

export type Project = {
  no: string
  title: string
  kind: string
  summary: string
  stack: string[]
  image: string
  imageAlt: string
  github: string | null
  demo: string | null
  /** Set when the build came out of an event — links to the event log instead of repeating it. */
  event: { name: string; date: string } | null
  /** 'contain' shows the whole image (logos); default crops to fill the frame. */
  fit?: 'cover' | 'contain'
  /** Frame colour behind a contained image. */
  imageBg?: string
  role: string
  study: CaseStudy
}

export const projects: Project[] = [
  {
    no: '01',
    title: 'FairSplit',
    kind: 'Hackathon build',
    summary:
      'Explainable team payouts: AI proposes a split with a reason and evidence for every percentage, a human approves or overrides it, then PayPal sandbox pays it out.',
    stack: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Recharts', 'OpenAI', 'PayPal'],
    image: fairsplitThumb,
    imageAlt: 'FairSplit: explainable team payouts',
    github: 'https://github.com/KDB2007/FairSplit-Paypal-Hackathon',
    demo: 'https://youtu.be/DqwqzeYyMyQ',
    event: { name: 'PayPal Hackathon', date: 'Nov 2026' },
    role: 'Solo build for the PayPal hackathon: designed and shipped the full flow, from contribution sync to sandbox payouts.',
    study: {
      problem:
        'Splitting a team payout fairly is usually a mix of spreadsheet guesswork and an awkward conversation. Visible work (merged PRs, shipped cards) is easy to count, but the quiet work (reviews, client calls, coordination) disappears. And even a reasonable split is hard to trust when nobody can see how the percentages were reached.',
      solution: {
        intro: 'FairSplit turns real contribution data into an explainable payout proposal, then keeps a human in charge of the final number:',
        points: [
          { title: 'Charter', text: 'Set the team, fees taken off the top (for example a finder fee and a lead fee), and the work pool. Editing the charter creates a new version; everyone must confirm again before scoring unlocks.' },
          { title: 'Contributions', text: 'Sync GitHub (merged PRs, the commits that shipped them, and reviews on other people\'s PRs as quiet work) and Trello Done cards, plus log manual work like a client call.' },
          { title: 'Score with AI', text: 'Split the work pool into shares, each with a plain-language reason, impact / complexity / effort bars, and evidence chips.' },
          { title: 'Review', text: 'Edit any share: it gets pinned and the rest rescale proportionally so the pool always totals exactly 100%. A waterfall shows fees plus the work pool adding up to the project total, to the cent.' },
          { title: 'Payout', text: 'One click sends a PayPal sandbox batch, returning a batch ID, per-person transaction IDs, and a printable receipt.' },
          { title: 'Dashboard', text: 'Pie chart, payout history, and a live equal / merit / hours what-if toggle.' },
        ],
        outro: 'Money is integer cents end to end and percentages are normalised server-side, so the arithmetic never drifts.',
      },
      contribution: [
        'Built it solo as a hackathon entry on Next.js 16 (App Router), TypeScript, Tailwind v4 and Recharts, integrating the OpenAI and PayPal APIs. I designed the charter, sync, score, review and payout flow and the deterministic, demo-safe scoring engine, plus the in-memory model that seeds a three-minute demo.',
        'Every external integration is optional: with no API keys, canned scoring, mock syncs and simulated payouts keep the demo working, and a failed PayPal call falls back to a clearly marked simulated receipt rather than breaking the flow.',
      ],
      outcome:
        'Shipped as a working hackathon demo with a recorded walkthrough. It validated the core idea: an AI-proposed split is much easier to accept when every number carries a reason and evidence, and when a person can still override it. Natural next steps are persistent storage and auth, richer dispute handling beyond withholding the contested slice, and real payment credentials.',
    },
  },
  {
    no: '02',
    title: 'Looply',
    kind: 'Hackathon build',
    summary:
      'A multi-agent marketing app that turns a plain-language promotion into a localized, fact-checked campaign, and publishes it only after the owner approves.',
    stack: ['Python', 'FastAPI', 'LangGraph', 'React', 'Vite', 'Tailwind CSS'],
    image: looplyThumb,
    fit: 'contain',
    imageBg: '#faf6ed',
    imageAlt: 'Looply: multi-agent marketing campaigns',
    github: null,
    demo: 'https://looplyy.vercel.app/',
    event: { name: 'Agnes AI India Hackathon', date: 'Oct 2026' },
    role: 'Team CodebaLe: early documentation, frontend design and speech-to-text integration.',
    study: {
      problem:
        'Small businesses know what they want to say but don\'t have a marketing team, designer, copywriter, strategist or translator, or the time to run several platforms. A generic AI caption drops the offer facts, the local context and the owner\'s control.',
      solution: {
        intro:
          'Built for the Agnes AI India Hackathon (HR26-AI-02, Agentic AI track). Describe a promotion by text or voice and choose your languages.',
        points: [
          { title: 'Context agents', text: 'A Campaign Manager extracts locked offer facts while Business, Locality and Audience agents build context.' },
          { title: 'Platform-native content', text: 'Strategy and Content Director agents produce variants for Instagram, Facebook, WhatsApp, LinkedIn, YouTube and X, with back-translated localization and A/B/C options.' },
          { title: 'Truth Engine', text: 'A deterministic check of discounts, prices, dates, claims and format limits against the locked facts. It blocks approval until selected assets verify, and regenerates failures up to three times.' },
          { title: 'Approval and versioning', text: 'Performance prediction, poster/video generation and owner approval follow. Changing a fact creates a new campaign version and regenerates only the affected assets.' },
        ],
        outro: 'Nothing publishes until the owner approves, and progress streams live over SSE.',
      },
      contribution: [
        'One of four contributors on Team CodebaLe. I wrote the project\'s early documentation, designed the owner-facing React + Vite + Tailwind frontend, and integrated speech-to-text so a business owner can dictate a promotion instead of typing it.',
        'The frontend work covered making the screens readable with plain next steps for first-run and campaign review, giving each shop its own home page for the next action while keeping the full campaign list separate, surfacing the latest campaign as a graphic on home, and grouping work by what the owner still has to do. I also added system-following dark mode and fixed contrast, focus and empty/failed loads.',
      ],
      outcome:
        'Shipped as a working hackathon build with an end-to-end Bengaluru café test (Kannada + English, Instagram + WhatsApp, a 20% to 25% discount change, approval gating, simulated publishing and analytics), plus tests for the Graph API publishing shapes and prompt snapshots.',
    },
  },
]

export type EventEntry = {
  name: string
  kind: 'Hackathon' | 'Competition' | 'Collaboration'
  date: string
  location: string
  team: string
  result: string | null
  learning: string
  /** Project number in `projects` — the build is shown there, not repeated here. */
  project: string | null
}

export const events: EventEntry[] = [
  {
    name: 'PayPal Hackathon',
    kind: 'Hackathon',
    date: 'Nov 2026',
    location: 'Online',
    team: 'Solo',
    result: null,
    learning:
      'An AI-proposed split is much easier to accept when every number carries a reason and evidence, and a person can still override it.',
    project: '01',
  },
  {
    name: 'Agnes AI India Hackathon',
    kind: 'Hackathon',
    date: 'Oct 2026',
    location: 'India',
    team: 'Team CodebaLe (4 contributors)',
    result: null,
    learning:
      'Early documentation, the owner-facing frontend and speech-to-text, so a business owner can dictate a promotion instead of typing it.',
    project: '02',
  },
]

export const workbench = [
  { key: 'Building', state: 'idle', text: 'Between projects. Next one coming soon.' },
  { key: 'Testing', state: 'live', text: 'OpenBots: installed, running the first workflow.' },
  { key: 'Learning', state: 'idle', text: 'First-year engineering, Bengaluru.' },
  { key: 'Exploring', state: 'live', text: 'AI agents and tools worth keeping.' },
] as const
