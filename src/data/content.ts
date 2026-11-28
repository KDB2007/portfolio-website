/**
 * Single source of site content, migrated from Portfolio v3. 
 */
import fairsplitThumb from '@/assets/fairsplit-thumbnail.jpeg'
import looplyThumb from '@/assets/looply-thumbnail.png'
import graphifyGraph from '@/assets/graphify-graph.webp'
import graphifyIcon from '@/assets/graphify-icon.png'
import openbotsIcon from '@/assets/openbots-icon.png'
import agencyAgentsIcon from '@/assets/agency-agents-icon.png'
import pacaIcon from '@/assets/paca-icon.png'
import strixIcon from '@/assets/strix-icon.png'
import omnivoiceIcon from '@/assets/omnivoice-icon.png'
import alibabaPageAgentIcon from '@/assets/alibaba-page-agent-icon.png'
import opencodeIcon from '@/assets/opencode-icon.png'
import pacaDemo from '@/assets/paca-demo-assign-task.mp4'
import agencyAgentsDashboard from '@/assets/agency-agents-dashboard.png'
import strixVulnerability from '@/assets/strix-vulnerability.png'
import strixDashboard from '@/assets/strix-dashboard.png'

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
  /** Optional longer title shown on the review page; the lab list keeps `name`. */
  headline?: string
  glyph: string
  /** Optional logo shown in place of the letter glyph. */
  logo?: string
  category: ExperimentCategory
  summary: string
  status: ExperimentStatus
  rating: number | null // out of 5, null until reviewed
  verdict: string | null
  date: string | null
  href: string
  /** Review page content, shown at #/tested/<slug>. */
  slug: string
  body?: string[]
  /** Structured write-up for longer reviews. `**text**` marks a keyword. */
  sections?: { heading?: string; paragraphs: string[] }[]
  image?: { src: string; alt: string }
  images?: { src: string; alt: string }[]
  video?: { src: string; alt: string }
  checking?: string[]
  note?: string
  tags?: string[]
}

const experimentList: Experiment[] = [
  {
    id: '010',
    name: 'OpenBots',
    glyph: 'O',
    logo: openbotsIcon,
    category: 'agents',
    summary: 'Testing now. Notes will land here as I go.',
    status: 'testing',
    rating: null,
    verdict: null,
    date: null,
    href: '#/tested/openbots',
    slug: 'openbots',
    body: ['Testing now. Notes will land here as I go.'],
    checking: ['Setup time', 'Reliability on real tasks', 'Worth the learning curve?'],
    note: 'Installed and running the first workflow.',
  },
  {
    id: '009',
    name: 'Alibaba Page Agent',
    headline: 'PageAgent: An AI Agent That Can Use Your Web App',
    glyph: 'A',
    logo: alibabaPageAgentIcon,
    category: 'agents',
    summary: 'A script tag that lets an AI agent operate your web app through its DOM.',
    status: 'documented',
    rating: 3,
    verdict: '3/5 — promising idea, but the use cases are still narrow.',
    date: '2026-09-02',
    href: '#/tested/alibaba-page-agent',
    slug: 'alibaba-page-agent',
    sections: [
      {
        paragraphs: [
          'PageAgent is an open-source JavaScript GUI agent from Alibaba, licensed under **MIT**, with roughly **29,800 GitHub stars**. Its main idea is simple: add a script tag to a website and turn it into something an AI agent can interact with.',
          'Unlike traditional browser automation tools, PageAgent runs directly inside the web page. It doesn\'t need a browser extension, Python, a headless browser, or a separate backend. Instead of analysing screenshots, it reads a simplified version of the page\'s **DOM**, identifies interactive elements, and uses them to click buttons, fill forms, select options, and scroll.',
          'It also lets you **bring your own model**, supporting providers like OpenAI, Claude, Gemini, Qwen, DeepSeek, and others, including local models through **Ollama** and **LM Studio**. Its architecture is modular, so you can replace different components depending on your requirements. There\'s also an optional Chrome extension and a beta **MCP server** for more advanced browser interactions.',
        ],
      },
      {
        heading: 'Where does it actually make sense?',
        paragraphs: [
          'I can see PageAgent being useful in a fairly specific scenario: when you\'re building a web application and want to give users an AI assistant that can actually operate the interface for them.',
          'For example, imagine adding an AI copilot to an **ERP**, **CRM**, or admin dashboard. Instead of telling users where to click and which forms to fill out, the agent can perform those actions directly within the application. Since it runs inside the user\'s existing session, there\'s no need to build an entirely separate automation setup.',
          'I also think there\'s potential for **accessibility**. Being able to navigate complicated business applications using natural language instead of manually going through dozens of menus could be genuinely useful.',
        ],
      },
      {
        heading: 'Where it falls short',
        paragraphs: [
          'However, outside these use cases, I\'m not entirely convinced by it yet.',
          'The biggest limitation is that PageAgent is designed to operate **within a web page**, not automate the entire browser or handle complex end-to-end workflows. If you\'re looking for a general-purpose browser automation agent, there are better-suited tools for that.',
          'Its reliance on the DOM is another limitation. It works well when a page has clearly defined interactive elements, but applications that rely heavily on **canvas rendering** or visual interactions can be much harder to handle. You\'ll also need to consider **API key security** when making model calls directly from the browser. The multi-tab extension and MCP integrations are also still developing.',
        ],
      },
      {
        heading: 'My take',
        paragraphs: [
          'I\'d give PageAgent a **3/5**. I think the idea is genuinely promising, even if the current use cases are somewhat limited. Making existing web applications AI-native, without having to rebuild their backend or create a separate automation system, is an interesting direction.',
          'I don\'t see myself using it for general browser automation right now, and I think there are better tools for that. But I can see PageAgent becoming much more useful as its browser integrations improve and more applications start adopting AI-powered interfaces.',
          'It\'s not something I\'d recommend adding to every developer\'s toolkit today, but it\'s definitely a project I\'d keep an eye on. The potential is there; it just needs more time to mature.',
        ],
      },
    ],
  },
  {
    id: '008',
    name: 'Omnivoice',
    headline: 'OmniVoice: Voiceover Without the Language Ceiling',
    glyph: 'O',
    logo: omnivoiceIcon,
    category: 'voice-input',
    summary: 'An open-source TTS model with 600+ languages, voice cloning and fine-grained voice control.',
    status: 'documented',
    rating: 5,
    verdict: '5/5 — voice cloning and control without a paid API.',
    date: '2026-08-20',
    href: '#/tested/omnivoice',
    slug: 'omnivoice',
    sections: [
      {
        paragraphs: [
          'OmniVoice is an open-source, **zero-shot** text-to-speech model licensed under **Apache 2.0**. It supports over **600 languages**, making it one of the most multilingual TTS models available. What makes it particularly interesting is that it can clone a voice using just a short reference audio clip, without needing to train a separate model for that voice.',
          'It uses a **diffusion language model**-style architecture designed to balance audio quality and generation speed, with a reported real-time factor as low as **0.025** (roughly 40 times faster than real-time).',
          'But there\'s more to it than just converting text into speech. You can design voices using attributes like gender, age, pitch, accent, and even whispering. It also supports non-verbal symbols and pronunciation corrections through **pinyin** and **phonemes**, giving you much finer control over the output.',
          'Getting started is fairly straightforward with **pip install omnivoice**. There\'s also a local web UI, a **Hugging Face Space**, and a Colab notebook if you want to experiment without setting everything up yourself.',
        ],
      },
      {
        heading: 'Why I think this is so good',
        paragraphs: [
          'Honestly, this is probably my favourite AI voiceover tool right now.',
          'The voice quality is really good, voice cloning works well, and the multilingual support is easily one of its biggest strengths. Supporting over 600 languages opens up a lot of possibilities, especially if you\'re creating content for audiences that speak different languages.',
          'What I particularly like is the amount of control you get over the generated voice. Most text-to-speech tools give you a few predefined voices and expect you to work around them. OmniVoice lets you specify things like accent, pitch, age, and speaking style. You can even generate whispers or correct the pronunciation of specific words using phonemes or pinyin.',
          'This matters a lot when you\'re creating actual content. A voiceover isn\'t just about reading words correctly; it also needs to sound appropriate for the audience and the context. Having control over pronunciation and voice characteristics makes a noticeable difference.',
          'The **voice cloning** is another big advantage. Being able to use a short audio sample as a reference makes it much easier to maintain a consistent voice across different pieces of content without having to record everything yourself.',
        ],
      },
      {
        heading: 'Things to watch out for',
        paragraphs: [
          'I also really like that it\'s **open-source** and can run locally. You aren\'t tied to a subscription or charged for every minute of generated audio. You do need the right setup, though. **PyTorch**, a GPU or **Apple Silicon** device with MPS support, and the model download make installation heavier than simply using a hosted voiceover service.',
          'One small thing to watch out for is the name. There are other unrelated products using the OmniVoice name, including virtual phone services. The project I\'m referring to here is the **k2-fsa/OmniVoice** repository.',
          'For anyone who wants to try it quickly, I\'d recommend starting with the Hugging Face Space or the local demo UI. It\'s much easier to experiment with different voices and settings before committing to generating an entire voiceover.',
        ],
      },
      {
        heading: 'My take',
        paragraphs: [
          'Easily a **5/5** for me. OmniVoice combines excellent voice cloning, impressive multilingual coverage, and a level of voice customisation that makes it genuinely useful for content creation. I especially like that it gives you local control without locking you into a paid API.',
          'If you\'re working with voiceovers, multilingual content, videos, or any kind of audio production, this is definitely worth trying. The fact that it supports so many languages while still giving you control over how the voice sounds makes it stand out from most text-to-speech tools I\'ve used.',
        ],
      },
    ],
  },
  {
    id: '007',
    name: 'Strix',
    headline: 'Strix: Autonomous Pentesting That Proves the Bug',
    glyph: 'S',
    logo: strixIcon,
    category: 'other',
    summary: 'An AI pentesting agent that exploits vulnerabilities and proves them with working PoCs.',
    status: 'documented',
    rating: 5,
    verdict: '5/5 — proves the bug, not just a warning in a report.',
    date: '2026-08-12',
    href: '#/tested/strix',
    slug: 'strix',
    images: [
      {
        src: strixVulnerability,
        alt: 'Strix terminal output showing a confirmed vulnerability and its proof of concept',
      },
      { src: strixDashboard, alt: 'Strix security dashboard with score, open issues and severity breakdown' },
    ],
    sections: [
      {
        paragraphs: [
          'Strix is an open-source AI penetration testing tool licensed under **Apache 2.0**, with around **78,000 GitHub stars**. What makes it interesting is that its agents don\'t just scan code for suspicious patterns. They actually behave like attackers, running your application, exploring it, attempting to exploit vulnerabilities, and validating their findings with working **proofs of concept**.',
          'It comes with **multi-agent orchestration**, a full penetration testing toolkit, and a CLI that provides remediation suggestions alongside its findings. It can also generate fixes, create compliance-ready reports, and integrate with **GitHub Actions** to catch security issues before they make it into your codebase.',
          'The open-source version runs locally using **Docker** and your own **LLM API key**. There are also Cloud and Enterprise versions with features like hosted scanning, automated PR reviews, SSO, and on-premise deployment.',
        ],
      },
      {
        heading: 'Why I think this is so good',
        paragraphs: [
          'Honestly, this is probably the best tool I\'ve come across so far for testing the security of an application.',
          'The approach is what makes it stand out. Instead of simply looking at your code and telling you that something might be vulnerable, Strix actually tries to exploit the application. It essentially attempts to hack into your application in a controlled testing environment to find vulnerabilities and security issues.',
          'I think the **proof-of-concept** aspect is particularly important. There\'s a big difference between a scanner telling you that a piece of code looks vulnerable and an agent actually demonstrating that the vulnerability can be exploited. The latter gives developers something concrete to investigate and fix, rather than another warning in a report that may or may not matter.',
          'It also makes security testing much more accessible. You don\'t necessarily need to manually perform every step of a penetration test to get meaningful results. Strix can handle reconnaissance, testing, and validation through its agents, and then give you actionable findings.',
          'Another feature I really like is the GitHub Actions integration. Being able to run security tests as part of your development workflow means vulnerabilities can be caught before code gets merged, rather than waiting until just before a release. This is a much better approach to security than treating penetration testing as something you do once in a while.',
        ],
      },
      {
        heading: 'Things to keep in mind',
        paragraphs: [
          'There are a few things to keep in mind, though. You\'ll need Docker running and an LLM API key, so running serious scans isn\'t completely free. Since the agents explore the application autonomously, **token usage** can also add up depending on how much they need to investigate.',
          'You also need to be careful about where you point it. Strix is designed to behave like an attacker, which is exactly what makes it useful, but you should only run it against applications and systems you\'re **authorised** to test. Autonomous testing can also be unpredictable, so a clean scan shouldn\'t be treated as proof that an application has no vulnerabilities.',
        ],
      },
      {
        heading: 'My take',
        paragraphs: [
          'Easily one of my favourite tools in this space so far, and probably a **5/5** for application security testing. What I like most is that it goes beyond identifying suspicious code and actually attempts to demonstrate whether something is exploitable. That makes the findings much more useful to developers.',
          'The ability to automate this through **CI/CD** makes it even better. Instead of treating security as a separate step at the end of development, you can make it part of the regular development cycle.',
          'If you\'re building applications with AI coding agents, I think having something like Strix in your testing workflow is incredibly valuable. Just remember that it complements proper security reviews; it doesn\'t replace them.',
        ],
      },
    ],
  },
  {
    id: '006',
    name: 'GStack',
    headline: 'gstack: A Software Factory for AI Engineers',
    glyph: 'G',
    category: 'coding',
    summary: 'A pipeline of 50 skills that takes AI agents from planning through shipping and canary monitoring.',
    status: 'documented',
    rating: 4,
    verdict: '4/5 — the value is in the pipeline, not any single skill.',
    date: '2026-08-05',
    href: '#/tested/gstack',
    slug: 'gstack',
    sections: [
      {
        paragraphs: [
          'gstack is a collection of **SKILL.md** files that gives AI agents structured roles across pretty much the entire software development lifecycle. It covers everything from planning and design to implementation, testing, releases, and production monitoring. The MIT-licensed repository has around **142,000 GitHub stars** and roughly **50 skills**, including roles like CEO reviewer, designer, engineering manager, release manager, QA lead, and debugger.',
          'What makes it interesting is how these skills are organised. You get commands like **/office-hours**, **/plan-ceo-review**, and **/plan-eng-review** for planning, **/review**, **/investigate**, and **/qa** for implementation and testing, and **/ship**, **/land-and-deploy**, and **/canary** for releases and monitoring. There are also dedicated skills for documentation, operations, and safety.',
        ],
      },
      {
        heading: 'Why I think this approach works',
        paragraphs: [
          'The biggest difference between gstack and something like Agency Agents is how the agents are expected to work.',
          'Agency Agents gives you a roster of specialists that you can activate depending on what you need. gstack takes a different approach. It turns the development process itself into a **structured pipeline**, where each skill handles a particular stage and builds on the work done before it.',
          'For example, you can start with **/office-hours** to explore an idea, use **/plan-ceo-review** and **/plan-eng-review** to challenge the approach, move into implementation, run **/review** to catch potential issues, and use **/qa** to test the actual application in a browser. Once everything looks good, **/ship** helps prepare the PR, while **/canary** can be used to monitor the deployment.',
          'I really like this approach because it addresses one of the biggest problems with AI coding agents: getting them to follow a **consistent engineering process** rather than jumping straight into writing code.',
          'Having an agent investigate before making changes, review its own work, test the application, and follow safety checks makes a lot of sense. The individual skills are useful, but the real value comes from connecting them into one workflow.',
        ],
      },
      {
        heading: 'The trade-offs',
        paragraphs: [
          'The main trade-off is that gstack is quite **opinionated**. It assumes you\'re comfortable with a structured process involving Git, CI, browser testing, and clearly defined stages. If you already have an established engineering workflow, some of these steps might feel unnecessary. There\'s also less flexibility if you prefer to let your agent figure out its own approach.',
          'Another thing to keep in mind is that you get the most out of gstack when you actually follow the pipeline. Running **/qa** without doing a proper review first, or jumping straight to **/ship** without reviewing the plan, defeats much of the purpose. Customising skills also takes a little effort, since they\'re generated from **templates** in the repository and changes need to be made at the template level.',
        ],
      },
      {
        heading: 'My take',
        paragraphs: [
          'gstack is one of the most interesting approaches to AI-assisted software development I\'ve seen. Instead of focusing on making an individual agent smarter, it focuses on making the entire development process more structured and reliable. I particularly like the idea of treating planning, implementation, testing, and deployment as **connected stages** rather than unrelated prompts.',
          'For individual developers and small teams looking to get more disciplined results out of AI coding agents, this is definitely worth exploring. The real strength isn\'t any one skill; it\'s how the entire pipeline fits together.',
        ],
      },
    ],
  },
  {
    id: '005',
    name: 'Agent Reach',
    headline: 'Agent Reach: Giving Your Agent the Whole Internet',
    glyph: 'A',
    category: 'agents',
    summary: 'One CLI and MCP interface for research across 15+ platforms, from GitHub and YouTube to Reddit and X.',
    status: 'documented',
    rating: 5,
    verdict: '5/5 — one interface for every platform my agents need to research.',
    date: '2026-07-21',
    href: '#/tested/agent-reach',
    slug: 'agent-reach',
    sections: [
      {
        paragraphs: [
          'Agent Reach is a tool that gives AI coding agents access to information across different platforms through a single **CLI and MCP interface**. It supports **15+ platforms** and dozens of tools, covering everything from GitHub and YouTube to Reddit, LinkedIn, Bilibili, and X.',
          'It has three categories of integrations: default channels like GitHub, YouTube subtitles, web search, and page reading; optional ones like Reddit, LinkedIn, XiaoHongShu, and podcasts; and experimental ones like X, Facebook, and Instagram.',
          'One feature I particularly like is **agent-reach doctor --json**. It checks which platforms are available and tells you which backend is being used for each one. Login-backed platforms run through a dedicated background browser, and every call returns results in a consistent **JSON** format.',
          'Under the hood, Agent Reach doesn\'t try to build everything from scratch. It connects existing tools like **yt-dlp**, **bili-cli**, **OpenCLI**, **Jina Reader**, and **Exa**, with fallbacks where available.',
        ],
      },
      {
        heading: 'Why I think this is useful',
        paragraphs: [
          'In my experience, this is one of the most useful tools for collecting information from online sources. I think it has a lot of potential for **market research**, **competitor analysis**, and continuously monitoring platforms for new tools, products, or developments.',
          'The main advantage is how much simpler it makes the process. Normally, if you want an AI agent to gather information from different platforms, you end up dealing with multiple CLIs, different authentication methods, and completely different output formats. Agent Reach brings all of that behind one interface.',
          'This makes a big difference when you\'re running the same research tasks repeatedly. You can have an agent check specific platforms, collect the results in JSON, and compare them against previous runs to see what\'s changed. Instead of manually checking multiple websites every day, you can build a fairly simple **monitoring workflow** around it.',
          'I also like that it builds on existing tools rather than reinventing the wheel. This keeps the integration layer relatively straightforward and lets it make use of tools that are already good at handling specific platforms.',
        ],
      },
      {
        heading: 'Things to be careful about',
        paragraphs: [
          'There are a couple of things to be careful about, though. Agent Reach is more of a **router** than a scraper itself, so you\'re still dependent on the underlying tools and platforms. **Login-backed integrations** also come with some risk of account restrictions, so I\'d be careful about which accounts I connect. Experimental integrations can break when platforms change their systems, and free search backends may run into **rate limits** when handling too many requests at once.',
          'For monitoring, I\'d recommend keeping things fairly targeted. Pick a few platforms, define repeatable queries, and save the JSON results so you can compare them over time. Running broad searches occasionally is useful, but consistent, focused checks are what make this tool particularly valuable. It\'s also worth running **agent-reach check-update** regularly to keep the integrations working with the latest changes.',
        ],
      },
      {
        heading: 'My take',
        paragraphs: [
          'Agent Reach is an excellent tool for anyone who wants to give their AI agents access to information beyond their local codebase. I especially like its potential for market research and competitor monitoring. Having one interface for so many platforms makes building automated research workflows much easier.',
          'It\'s not perfect, and platform restrictions and unreliable integrations are always going to be a challenge. But as a **research and monitoring layer** for AI agents, it\'s one of the tools I\'d definitely keep in my setup.',
        ],
      },
    ],
  },
  {
    id: '004',
    name: 'Paca',
    headline: 'Paca: A Scrum Board Where AI Agents Are Teammates',
    glyph: 'P',
    logo: pacaIcon,
    category: 'other',
    summary: 'An open-source Scrum board where AI agents are full team members, not add-ons.',
    status: 'documented',
    rating: 4,
    verdict: 'Excellent for small teams where humans and agents work side by side.',
    date: '2026-07-15',
    href: '#/tested/paca',
    slug: 'paca',
    video: { src: pacaDemo, alt: 'Paca demo: creating a task and assigning it to an AI agent on the sprint board' },
    sections: [
      {
        paragraphs: [
          'Paca is an **open-source**, **self-hosted** project management platform licensed under **Apache 2.0** and built by a non-profit, community-owned project. It\'s **free forever**, with no paid tiers or features locked behind an upgrade.',
          'What makes it interesting is that it\'s not just another Jira alternative with an AI chatbot added to it. **AI agents** are treated as actual members of the Scrum team. They can be assigned to sprints, pick up backlog tasks, update their status, appear on the board alongside human teammates, and collaborate on BDD specs.',
          'Paca also provides an **MCP server** and something called **Paca Skills**, which let agents from tools like **Claude Code**, **Gemini CLI**, and **Cursor** connect to it. The platform is also extensible, with **plugins** that can modify its workflows, data model, and UI.',
        ],
      },
      {
        heading: 'Where does it actually fit?',
        paragraphs: [
          'I think Paca makes a lot of sense for small teams that are intentionally building their workflow around humans and AI agents working together. That\'s exactly what it was designed for, and it shows.',
          'When a small team of developers and agents is working on the same project, having everyone operate through a shared board is genuinely useful. Tasks are assigned clearly, progress is visible, and agents become part of the actual development workflow rather than just another tool running in the background. The board becomes a **shared source of truth** instead of having important updates scattered across chat histories.',
        ],
      },
      {
        heading: 'Not an enterprise replacement',
        paragraphs: [
          'However, I wouldn\'t recommend treating Paca as a replacement for Jira across an entire enterprise. It\'s much better suited to individual projects than organisation-wide project management.',
          'Large organisations have to deal with things like **portfolio reporting**, cross-team dependencies, complex permission systems, compliance requirements, and years of existing workflows. A lightweight, agent-focused Scrum board isn\'t necessarily built to handle all of that. Trying to force it into an enterprise-wide setup could create more problems than it solves.',
        ],
      },
      {
        heading: 'The cost of self-hosting',
        paragraphs: [
          'There\'s also the cost of **self-hosting**. While Paca removes licensing fees, someone still needs to manage the server, handle updates, and maintain any plugins the team relies on. For a small team, that\'s probably manageable. For an organisation that doesn\'t want to deal with infrastructure, the whole free-forever argument becomes a little less convincing.',
        ],
      },
      {
        heading: 'My take',
        paragraphs: [
          'Paca is a genuinely interesting approach to project management, especially as AI agents become a bigger part of development teams. I think it\'s an excellent choice for smaller teams working on focused projects where humans and agents need to collaborate closely.',
          'I\'d keep it at the **project level** rather than trying to replace an organisation\'s existing project management setup. Let Paca handle the human-agent collaboration and let **Jira** handle the enterprise.',
        ],
      },
    ],
  },
  {
    id: '003',
    name: 'Agency Agents',
    headline: 'Agency Agents: A Roster of Specialists in Markdown Files',
    glyph: 'A',
    logo: agencyAgentsIcon,
    category: 'agents',
    summary: 'A roster of Markdown agent personas you can carry across Claude Code, Cursor, Codex and more.',
    status: 'documented',
    rating: 5,
    verdict: '5/5 — saves you from designing every agent from scratch.',
    date: '2026-07-05',
    href: '#/tested/agency-agents',
    slug: 'agency-agents',
    image: {
      src: agencyAgentsDashboard,
      alt: 'Agency Agents dashboard showing installed agents, install health and cross-tool coverage',
    },
    sections: [
      {
        paragraphs: [
          'Agency Agents is an open-source collection of AI agent personas, licensed under **MIT**. It has over 230 Markdown files spread across **18 divisions**, with more than 10,000 lines covering agent identities, workflows, deliverables, and success metrics.',
          'What\'s interesting is that these aren\'t separate tools or complicated pieces of software. Each agent is essentially a well-defined **system prompt** with **YAML frontmatter** describing its role, responsibilities, and expected output. You can activate one simply by prefixing your prompt with "Activate [Agent Name]."',
          'The repository works with a wide range of coding tools, including **Claude Code**, **Cursor**, **Codex**, **Gemini CLI**, and **OpenCode**. There\'s also a desktop app for managing installations and updates. Agents can even pass work between each other using an **MCP memory** integration, although handoffs are manual by default.',
        ],
      },
      {
        heading: 'Why I think this is so useful',
        paragraphs: [
          'Honestly, this is one of the more useful agent repositories I\'ve come across. The biggest advantage is that it saves you from having to design every agent and workflow yourself.',
          'Whether you need a **backend architect**, **frontend developer**, **code reviewer**, **security specialist**, or **technical writer**, there\'s probably already an agent for it. And these aren\'t just basic prompts with a job title attached. The files go into how each agent should approach its work, what it should produce, and how success should be measured.',
          'I think this is especially valuable when you\'re starting a new project or trying to build a proper **AI-assisted development workflow**. Instead of spending hours figuring out how to structure different agents, you get a fairly complete roster that you can start using immediately.',
        ],
      },
      {
        heading: 'Portable by design',
        paragraphs: [
          'Another thing I really like is how portable the whole setup is. Since everything is defined in **Markdown files**, you\'re not locked into one coding agent or platform. You can take the same personas across different tools and experiment with what works best for your workflow.',
          'The fact that the files are also easy to modify is a big plus. You aren\'t forced to use the agents exactly as they\'re written. You can **customise** their instructions, adjust their responsibilities, and build on top of what\'s already there.',
        ],
      },
      {
        heading: 'You don\'t need all 230',
        paragraphs: [
          'Of course, you don\'t need all 230 agents for every project. Some will be more relevant than others, and you\'ll probably end up using a smaller set regularly. But having that many specialised roles available is a strength, not a problem. It gives you plenty of room to experiment and expand your workflow as your project grows.',
        ],
      },
      {
        heading: 'My take',
        paragraphs: [
          'Easily a **5/5** for me. Agency Agents is one of those repositories that makes you realise how much work you can save by not starting from scratch. The sheer variety, level of detail, and compatibility with different coding tools make it incredibly useful. Whether you\'re just getting started with AI agents or already have an established workflow, there\'s something worth taking from this collection.',
          'I\'d highly recommend exploring it, even if you don\'t plan on using every agent. There\'s a lot here that can improve how you structure and think about AI-assisted development.',
        ],
      },
    ],
  },
  {
    id: '002',
    name: 'Graphify',
    headline: 'Graphify: When a Map of Your Codebase Pays for Itself',
    glyph: 'G',
    logo: graphifyIcon,
    category: 'coding',
    summary: 'Turns a whole codebase into a structured graph stored as JSON files, easier for AI to parse and noticeably lighter on tokens than raw source.',
    status: 'documented',
    rating: 4,
    verdict: 'Best for deep work on large codebases — overkill for quick lookups.',
    date: '2026-06-20',
    href: '#/tested/graphify',
    slug: 'graphify',
    sections: [
      {
        paragraphs: [
          'Graphify turns a codebase into a **knowledge graph** that an AI coding agent can navigate instead of repeatedly searching through files.',
          'Its open-source core (Apache 2.0) uses **tree-sitter** to parse code locally. The process is deterministic, doesn\'t rely on LLMs, and keeps your code on your machine. It supports around 40 languages and tags every relationship as either **EXTRACTED** (explicitly found in the source) or **INFERRED** (resolved by the tool). This distinction is useful because you can tell what\'s actually present in the code and what the tool has figured out.',
        ],
      },
      {
        heading: 'Not another vector database',
        paragraphs: [
          'It\'s also worth noting that Graphify isn\'t another vector database or semantic search tool. It builds an actual graph that you can query through an **MCP server**. You can trace connections between symbols, find **god_nodes** (the central hubs that many components depend on), or figure out what might break when you change a particular file. Tools like **query_graph**, **get_node**, **shortest_path**, and **get_pr_impact** give coding agents structured answers without flooding their context with entire files.',
        ],
      },
      {
        heading: 'So, when is it actually useful?',
        paragraphs: [
          'I think Graphify makes the most sense when you\'re working with a **large, unfamiliar codebase** and expect to spend a good amount of time exploring it.',
        ],
      },
      {
        heading: 'The upfront cost',
        paragraphs: [
          'The biggest trade-off is the **upfront cost**. Building the graph takes time and tokens, so if you\'re only asking two or three questions, you\'re probably better off sticking to **grep** and reading the code yourself. But if you\'re going to spend days or weeks understanding a codebase, that initial investment can pay off.',
        ],
      },
      {
        heading: 'Query quality matters',
        paragraphs: [
          'Vague questions can pull in huge parts of the graph, hit token limits, and waste resources. Being specific about the file, symbol, or problem you\'re investigating makes a noticeable difference. One thing I like is that Graphify reports **ambiguity** and **truncated results** instead of presenting incomplete answers as if they\'re definitive. That makes it easier to refine a query rather than blindly trust the output.',
        ],
      },
      {
        heading: 'Keeping the graph fresh',
        paragraphs: [
          'There\'s also the question of **freshness**. The local graph is essentially a snapshot; it doesn\'t automatically update as you edit your code. Graphify offers a **hosted option** that can rebuild the graph whenever you push to your default GitHub branch, but that adds another setup step and potentially more token costs, especially if you\'re rebuilding more often than you\'re querying it.',
        ],
      },
      {
        heading: 'My take',
        paragraphs: [
          'Graphify is a solid tool for understanding large codebases, particularly when you\'re going to be working with them for a while. For smaller projects or occasional lookups, it\'s probably **overkill**. The graph is useful, but building and maintaining it comes at a cost.',
          'Ultimately, it\'s less about whether Graphify is powerful and more about whether your use case justifies the overhead. Use it for **deep codebase exploration**, not for finding a function you could have located with grep.',
        ],
      },
    ],
    image: { src: graphifyGraph, alt: 'A Graphify graph of a codebase, with nodes grouped into coloured clusters' },
    tags: ['codebase', 'ai', 'context', 'graph'],
  },
  {
    id: '001',
    name: 'OpenCode',
    headline: 'OpenCode: The Free Coding Agent That Earns Its Place',
    glyph: 'O',
    logo: opencodeIcon,
    category: 'coding',
    summary: 'An open-source, model-agnostic coding agent that stays out of the way — built for learning and experimentation.',
    status: 'documented',
    rating: 4,
    verdict: 'My daily driver for testing and learning.',
    date: '2026-06-07',
    href: '#/tested/opencode',
    slug: 'opencode',
    sections: [
      {
        paragraphs: [
          'OpenCode is an open-source AI coding agent (**MIT licensed**) with over **229,000 GitHub stars**. It runs locally on your machine, supports **free models** out of the box, and lets you connect to over **200 model providers**.',
          'It comes with a fast terminal interface, a desktop app (currently in beta), and mobile apps that let you monitor sessions and approve actions remotely. It also has two built-in agents: **Build**, which has full access for development work, and **Plan**, which is read-only and meant for exploring and planning changes. You can switch between them with the Tab key. There\'s also a general-purpose **subagent** for handling more complex searches and multistep tasks.',
          'Getting started is pretty straightforward too. You can install it using curl, npm, bun, Homebrew, Arch, Nix, or mise.',
        ],
      },
      {
        heading: 'My experience with it',
        paragraphs: [
          'I\'ve been using OpenCode for pretty much all the testing I\'ve done so far, and I plan to stick with it. It\'s a genuinely good free, open-source coding agent, and one of the main reasons I like it is that it stays out of the way.',
          'The terminal experience is fast, you get to choose your own models, and there\'s practically no barrier to getting started. Whether it\'s experimenting with different models, understanding how coding agents reason and use tools, or just running iterative tests, OpenCode makes the whole process easy. For learning and experimentation, it\'s hard to beat.',
        ],
      },
      {
        heading: 'Where it falls short',
        paragraphs: [
          'That said, I don\'t think it\'s the best fit for large-scale commercial use without some additional work. In my experience, there\'s a bit of extra **token overhead**, and integrating certain tools isn\'t always straightforward. This can mean extra setup time and friction. On an individual level, these issues aren\'t a big deal. But across hundreds of developers and thousands of sessions, even small inefficiencies can add up.',
          'There\'s also the enterprise side of things. Larger organisations often need native **SSO**, **audit trails**, support contracts, and centrally managed integrations. With OpenCode, a lot of that would need to be configured or built around the existing setup. It\'s flexible, but that flexibility also means more responsibility for the organisation using it.',
        ],
      },
      {
        heading: 'Where it shines',
        paragraphs: [
          'Where I think it really shines is learning. It\'s transparent, **model-agnostic**, and easy to experiment with. You can actually see how an AI coding agent works, how it interacts with tools, and how different models behave. That makes it a great environment for anyone trying to understand coding agents beyond just using them.',
        ],
      },
      {
        heading: 'My take',
        paragraphs: [
          'OpenCode is my current **daily driver** for testing and learning, and I can see myself continuing to use it. It\'s fast, flexible, free to get started with, and gives you a lot of control. I\'d be more hesitant to recommend rolling it out across a large commercial team without accounting for the extra integration and management work.',
          'For individual developers and experimentation, though, it\'s hard to complain.',
        ],
      },
    ],
  },
]

// Numbered in the order each tool was tested; the active test sits at the end.
export const experiments = experimentList.sort((a, b) => a.id.localeCompare(b.id))

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
    result: '4th place',
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
