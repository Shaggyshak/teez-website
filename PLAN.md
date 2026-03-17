# Teez — Product & Technical Plan

*Last updated: 2026-03-15*

---

## 1. What Is Teez

Teez is an **AI-powered commercial real estate (CRE) underwriting agent** that lives inside Excel and Google Sheets. It extracts data from rent rolls, T-12s, and offering memorandums, then populates full pro-forma projections directly in the user's spreadsheet — no new software to learn.

**One-liner:** *The only AI underwriting that lives inside your spreadsheet, not instead of it.*

---

## 2. Competitive Landscape

### Full Competitive Analysis

| Competitor | Price | What They Do | Target Customer | Underwriting Depth | Gap / Weakness |
|---|---|---|---|---|---|
| **Cactus** | $350/mo | Full DCF/IRR/waterfall generation from uploaded documents | CRE investors | Deep — full model generation from docs | No investor management, **not Excel-native** (standalone web app), forces users out of their existing workflow |
| **Archer** | — | Multifamily parsing, underwriting, comps | MF investors & brokers | Deep — but MF only | **Multifamily only** — zero support for industrial, retail, mixed-use, or office. No other asset types |
| **Clik.ai** | $165/mo | Document extraction & financial spreading | Lenders & servicers | Extraction only — maps to existing models | **Doesn't generate analysis** — just extracts and maps data. User still builds their own model. Lender-focused, not equity-side |
| **CashFlow Portal** | $99/mo | Syndication & investor management (LP portal, distributions, K-1s) | GP syndicators | Shallow — underwriting is a new, bolted-on add-on | **Investor management is the core product**, underwriting is an afterthought with limited depth |
| **Blooma** | — | CRE lending automation (loan origination, portfolio monitoring) | Banks & credit unions | Deep — but lender-side only | **Debt side only** — serves lenders, not equity investors. No buy-side underwriting or deal analysis |
| **LightBox** | — | CRE data & intelligence platform (property records, environmental, tax) | Lenders & appraisers | Data layer only — no modeling capability | **No modeling, no underwriting** — purely a data/research platform. Users need separate tools to actually analyze deals |
| **Dealpath** | — | Deal pipeline management (tracking, comparison, IC workflow) | Institutional investors ($10B+ AUM) | Workflow & deal comparison — not an underwriting engine | **Pipeline tool, not underwriting**. Designed for institutional teams managing 100s of deals. Massive overkill for boutique firms. Enterprise pricing |
| **RedIQ** | — | MF rent roll extraction + Excel model population | Institutional MF teams | Deep — MF-specific, has Excel integration (QuickSync) | **Multifamily only**. Acquired by Radix — product direction uncertain. Excel add-in is a simple data push, not an intelligent agent |
| **HelloData** | — | Market data, rent comps, submarket benchmarks | MF investors | Comps & benchmarks only — no modeling | **Data layer, not a modeling tool**. Useful input for underwriting but doesn't do the underwriting itself |
| **Vesta** | — | Mortgage loan origination system (LOS) | Residential mortgage lenders | N/A for CRE | **Residential mortgage — zero CRE overlap**. Sometimes confused in market searches but completely different vertical |
| **Titleman.ai** | — | AI-powered valuation research & chat interface | Developers, banks | Broad but shallow coverage | **Vague positioning** — tries to cover everything but produces no structured underwriting output. Chat-based, not spreadsheet-based |

### Competitor Deep Dives

#### Cactus — The Primary Threat
- **Most direct competitor** to what Teez is building
- 1,500+ users, $350/mo price point, growing fast
- Takes documents in (rent rolls, T-12s, OMs) and generates full DCF/IRR/waterfall models
- **Critical weakness:** It's a standalone web app. Users upload docs to Cactus, get results in Cactus. Their Excel models sit unused. CRE professionals fundamentally work in Excel — Cactus asks them to abandon that
- **Teez positioning vs. Cactus:** "Same intelligence, inside Excel, half the price"

#### Archer — The MF Specialist
- Strong in multifamily parsing and underwriting
- Good comps database for MF properties
- **Critical weakness:** Zero support for industrial, retail, mixed-use, or office. Teams that work across asset types need multiple tools
- **Teez advantage:** Multi-asset from day 1

#### The Lender-Side Players (Blooma, Clik.ai, LightBox)
- These three serve the **debt side** — banks, credit unions, servicers
- Blooma automates loan origination. Clik.ai extracts data for loan underwriting. LightBox provides research data
- **Not competitive with Teez** because they target a fundamentally different buyer (lenders vs. equity investors)
- Teez stays firmly on the **equity/investor side**

#### The Investor Management Gap (CashFlow Portal vs. Cactus)
- CashFlow Portal ($99/mo) has strong investor management — LP portals, distributions, K-1 tracking
- But its underwriting is shallow — a recent add-on with limited depth
- Cactus/Archer have strong underwriting but **zero investor management**
- **This is Teez's Phase 3 whitespace** — the only tool that combines deep underwriting with investor management

### Market Segmentation Map

```
                        UNDERWRITING DEPTH
                    Shallow ──────────── Deep
                    │                      │
    Equity /    ──  │  CashFlow Portal     │  Cactus
    Investor        │                      │  Archer (MF only)
    Side            │                      │  ★ TEEZ (Excel-native)
                    │                      │
    ───────────     │──────────────────────│
                    │                      │
    Lender /    ──  │  LightBox            │  Blooma
    Debt            │  HelloData           │  Clik.ai
    Side            │                      │
                    │                      │
```

### Strategic Insights

1. **Cactus is the most direct competitor** — documents in, DCF/waterfall out, at $350/mo with 1,500+ users. Teez must differentiate, not clone.
2. **Excel-native is a real moat** — **no competitor lives inside Excel/Sheets.** They all force you into a standalone web app. RedIQ has an Excel add-in (QuickSync) but it's a simple data push, not an intelligent agent. CRE professionals live in Excel — meeting them there is a genuine moat.
3. **The market splits lender-side vs. investor-side** — Blooma, Clik.ai, LightBox serve lenders. Cactus, Archer, Dealpath serve investors. Teez stays firmly on the equity/investor side.
4. **Almost everyone is multifamily-only** — Archer, RedIQ, HelloData, Enodo — all MF. Cactus covers multiple asset types but is newer. Multi-asset coverage from day 1 is a real differentiator.
5. **Nobody combines underwriting + investor management** — CashFlow Portal has investor mgmt but weak underwriting. Cactus/Archer have strong underwriting but no investor mgmt. This is the whitespace Teez can own in Phase 3.

### What Changed Because of This Analysis

| Area | Original Plan (Pre-Analysis) | Revised (Post-Analysis) |
|---|---|---|
| **Core differentiator** | "AI underwriting in Excel" (vague) | **Excel-native agent** — the only AI underwriting that lives inside your spreadsheet, not a separate app |
| **Asset types** | Implied multifamily | **Multi-asset from day 1** (MF, industrial, retail, mixed-use) — most competitors are MF-only |
| **Competitive positioning** | Unaware of Cactus, Archer, Clik | Position against Cactus: "Same intelligence, inside Excel, half the price" |
| **Phase 2 focus** | Backend & billing | **Google Sheets + deal pipeline** — large underserved market, high code reuse |
| **Data strategy** | "Data moat" in Phase 4 | **Free/public data first** (Census, BLS, public records) — add paid sources once revenue supports it |
| **Pricing** | $99–$399/mo (generic range) | **$149/mo starter, $299/mo pro** — undercut Cactus ($350), above Clik ($165) |
| **Google Sheets** | Phase 3 | **Pushed to Phase 2** — Google Sheets users are a large underserved segment that every competitor ignores |

---

## 3. Target Customers

### Primary (Phase 1–2)
- **Boutique CRE investment teams** (2–10 people) — syndicators, family offices, independent sponsors
- **Solo investors / small firms** analyzing 5–20+ deals per month
- **Buy-side analysts** at firms with $10M–$500M AUM

### Secondary (Phase 3+)
- GP syndicators needing LP/investor management
- Emerging managers scaling from 1–5 deals to portfolio-level operations

### Why They Buy
- They already use Excel for everything — Teez doesn't ask them to change
- Manual rent roll entry takes hours — Teez does it in seconds
- They lose deals to faster competitors — Teez gives them speed parity with institutional tools

---

## 4. Business Model & Pricing

| Tier | Price | Target | Includes |
|---|---|---|---|
| **Starter** | $149/mo | Solo investors, small firms | 10 deals/mo, 1 user, Excel add-in, all asset type templates, document parsing, pro-forma generation, risk flags |
| **Pro** | $299/mo | Boutique teams (2–5 analysts) | Unlimited deals, 5 users, Excel + Google Sheets, deal pipeline dashboard, investment memo export, natural language sensitivity analysis, priority support |
| **Team** | $499/mo | Emerging managers | Everything in Pro + unlimited users, API access, advanced portfolio analytics, custom model templates, team collaboration & approvals, dedicated account manager |
| **Enterprise** | Custom | Institutional | SSO, custom models, premium data integrations, dedicated support |

### Pricing Rationale
- **Starter undercuts Cactus** ($149 vs. $350) while delivering comparable extraction + modeling
- **Pro** adds Google Sheets + deal pipeline — neither of which Cactus offers
- **Team** captures the gap between CashFlow Portal ($99, weak underwriting) and Dealpath (institutional, $$$)

### Revenue Targets
- Phase 1 goal: 50 paying Starter users = ~$7,500 MRR
- Phase 2 goal: 100 Starter + 30 Pro = ~$24,000 MRR
- Break-even estimate: ~$20K MRR (covers infra, API costs, one FTE)

---

## 5. Product Roadmap

### Phase 0 — Foundation (Week 1–2) ✅ COMPLETE

| Task | Status |
|---|---|
| Monorepo (Turborepo + pnpm) | ✅ |
| Next.js 15 web app (`apps/web`) | ✅ |
| Tailwind CSS 4 styling | ✅ |
| Landing page migrated with updated positioning | ✅ |
| Waitlist API (Resend + Supabase schema) | ✅ |
| Clerk auth (dashboard routes) | ✅ |
| Drizzle ORM + Supabase Postgres schema | ✅ |
| Excel add-in scaffold (Office JS + React + Vite) | ✅ |
| Shared packages (`@teez/shared`, `@teez/ai-engine`) | ✅ |
| Pro-forma engine with IRR/DCF/sensitivity analysis | ✅ |
| GitHub Actions CI pipeline | ✅ |
| Vercel deployment config | ✅ |

### Phase 1 — Excel Add-in MVP (Week 3–8)

**Goal:** The "wow moment" — rent roll PDF in, full underwriting model populated in your existing Excel sheet.

| Task | Details |
|---|---|
| **Document parser** | Claude API extracts structured data from rent rolls, T-12s, OMs (PDF/CSV/scanned). Target: 98%+ accuracy |
| **Multi-asset templates** | Pre-built models for multifamily, industrial, retail, mixed-use |
| **Market data integration** | Free/public sources first: Census, BLS, county assessor records, FRED |
| **Pro-forma generation** | AI populates DCF, IRR, cash-on-cash directly in Excel cells |
| **Risk flags + audits** | Highlight anomalies: below-market rents, high vacancy, cap rate compression, expense outliers |
| **Natural language commands** | "What's the IRR if vacancy increases 2%?" — conversational sensitivity analysis inside Excel |

**Key differentiator vs. Cactus:** User keeps their own Excel model and workflow. Teez augments it rather than replacing it.

### Phase 2 — Google Sheets + Deal Pipeline (Week 9–14)

| Task | Details |
|---|---|
| **Google Sheets add-on** | Port Excel add-in logic — large underserved market segment |
| **Deal pipeline dashboard** | Web dashboard: track deals, compare side-by-side, team collaboration |
| **Investment memo export** | One-click PDF memo generation from sheet data |
| **Stripe billing** | Implement tiered pricing |
| **API layer** | FastAPI service for AI processing + document queue |

**Why Google Sheets moved up:** (a) large market, (b) competitors ignore it, (c) 80% code reuse from Excel add-in.

### Phase 3 — TBD Based on Customer Feedback (Week 15–20)

**Decision deferred until post-MVP.**

**Option A — Investor Management Bridge** (if syndicators pull):
- LP portal (deal summaries, distributions, K-1s)
- Capital raise tracking (commitments, soft circles, close timelines)
- Waterfall modeling (preferred return, promote splits, catch-up)
- Team collaboration (comments, approvals, IC workflow)

**Option B — Deeper Underwriting** (if buy-side analysts pull):
- Monte Carlo simulations, scenario modeling
- Paid data integrations (HelloData, CoStar, MSCI/RCA)
- Portfolio analytics (cross-deal performance, concentration risk)
- Custom model builder (user-defined templates with AI assistance)

### Phase 4 — Data Moat + Scale (Month 6+)

| Task | Details |
|---|---|
| **Proprietary comp engine** | Every deal analyzed feeds anonymized benchmarks |
| **Deal scoring** | AI grades deals A–F based on historical patterns + market data |
| **Premium data connectors** | CoStar, MSCI/RCA, Yardi integration |
| **Enterprise tier** | Custom models, SSO, dedicated support, API access |
| **Mobile companion** | Quick deal screening on the go |

---

## 6. Technical Architecture

### Monorepo Structure

```
teez-website/
├── apps/
│   ├── web/                    # Next.js 15 — marketing site + dashboard
│   │   ├── src/app/            # App router pages
│   │   │   ├── page.tsx        # Landing page (static)
│   │   │   ├── (dashboard)/    # Clerk-protected routes (dynamic)
│   │   │   └── api/waitlist/   # Waitlist signup endpoint
│   │   ├── src/components/     # React components (Nav, WaitlistForm)
│   │   ├── src/lib/db/         # Drizzle ORM schema + connection
│   │   └── src/lib/email.ts    # Resend email service
│   │
│   └── excel-addin/            # Office JS + React + Vite
│       ├── manifest.xml        # Office Add-in manifest
│       ├── src/components/     # TaskPane UI (upload, analyze, results, chat)
│       └── taskpane.html       # Office JS entry point
│
├── packages/
│   ├── shared/                 # Types, Zod schemas, constants
│   │   └── src/
│   │       ├── types.ts        # Deal, RentRollUnit, T12Data, ProForma, RiskFlag
│   │       └── schemas.ts      # Zod validation (waitlist, asset types)
│   │
│   └── ai-engine/              # Document parsing + pro-forma generation
│       └── src/
│           ├── parser.ts       # Claude-based document extraction
│           ├── proforma.ts     # DCF/IRR/cash-on-cash engine + sensitivity analysis
│           └── types.ts        # AI request/response types
│
├── turbo.json                  # Turborepo task config
├── pnpm-workspace.yaml         # Workspace definition
└── .github/workflows/ci.yml    # CI pipeline
```

### Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| **Web** | Next.js 15 + Tailwind CSS 4 | SSR marketing + app routes for dashboard |
| **Excel Add-in** | Office JS + React + Vite | Task pane embedded in Excel |
| **Sheets Add-on** | Google Apps Script + Sheets API | Phase 2 |
| **AI Engine** | Claude API (`@anthropic-ai/sdk`) | Best at structured extraction from messy documents |
| **Document Processing** | `@teez/ai-engine` shared package | Reusable across Excel, Sheets, and web API |
| **Auth** | Clerk | Team management built-in, dark theme, SSO-ready |
| **Database** | Supabase Postgres + Drizzle ORM | Managed Postgres, type-safe queries |
| **File Storage** | Supabase Storage | PDF/CSV uploads |
| **Market Data** | Census, BLS, FRED, county assessor APIs | Free/public first — paid sources when revenue justifies |
| **Payments** | Stripe | Tiered billing, usage tracking |
| **Email** | Resend | Waitlist confirmations, transactional emails |
| **Deploy** | Vercel + GitHub Actions | Automatic preview deploys, CI type-checking |
| **Monitoring** | Sentry | Error tracking (Phase 1) |
| **Monorepo** | Turborepo + pnpm | Fast builds, workspace dependency management |

### Database Schema

```
waitlist        — email, name, company, role, created_at
deals           — user_id, name, asset_type, address, status, purchase_price, underwriting_data
documents       — deal_id, user_id, file_name, file_type, storage_path, document_type, parsed_data, status
```

### Key Technical Decisions

1. **Lazy service initialization** — DB and Resend connections are created on first use, not at module load time. This allows Next.js static generation of the landing page without requiring env vars at build time.
2. **Route groups for auth** — Clerk wraps only `(dashboard)` routes with `force-dynamic`, keeping the landing page statically generated for performance.
3. **Shared pro-forma engine** — The `@teez/ai-engine` package contains the full DCF/IRR calculation engine with Newton-Raphson IRR solver, loan amortization, and risk flag generation. This runs identically in the Excel add-in, Sheets add-on, and web API.
4. **Multi-asset from day 1** — Type system enforces asset type (`multifamily | industrial | retail | mixed-use | office`) across all components.

---

## 7. Data Strategy

### Phase 1: Free/Public Data
- **Census Bureau** — demographics, population growth, income levels
- **BLS** — employment data, wage trends by metro
- **FRED** — interest rates, CPI, economic indicators
- **County assessor records** — tax assessments, property details, ownership history

### Phase 2+: Paid Data (revenue-gated)
- **HelloData** — real-time rent comps, market benchmarks
- **CoStar** — comprehensive CRE data (comps, vacancy, absorption)
- **MSCI/RCA** — transaction data, cap rate trends
- **Yardi** — property management data integration

### Phase 4: Proprietary Data Moat
- Every deal analyzed feeds anonymized benchmarks
- AI deal scoring (A–F) based on historical patterns
- Comp engine improves with scale — more users = better data = stronger moat

---

## 8. Go-to-Market

### Launch Strategy
1. **Waitlist** (now) — capture emails with positioning: "AI underwriting inside your spreadsheet"
2. **Beta** (Phase 1 complete) — invite 20–50 waitlist users for free Excel add-in beta
3. **Paid launch** (Phase 2) — Stripe billing, public launch with Starter + Pro tiers
4. **Content marketing** — YouTube demos, CRE podcast appearances, LinkedIn thought leadership
5. **Community** — Discord/Slack for beta users, feature requests, deal analysis tips

### Positioning vs. Competitors
- **vs. Cactus:** "Same intelligence, inside Excel, half the price"
- **vs. Archer/RedIQ:** "Not just multifamily — industrial, retail, and mixed-use from day 1"
- **vs. Clik.ai:** "We don't just extract data — we generate the full pro-forma"
- **vs. CashFlow Portal:** "Real underwriting, not a bolted-on afterthought"
- **vs. Dealpath:** "Built for boutique teams, not billion-dollar institutions"

### Key Messaging
- "Your spreadsheet, supercharged"
- "Rent roll in, full pro-forma out — without leaving Excel"
- "The only AI underwriting that lives inside your spreadsheet"

---

## 9. Immediate Next Steps

1. ~~Migrate landing page to Next.js~~ ✅
2. ~~Wire up waitlist with Resend~~ ✅
3. **Deploy to Vercel** — connect GitHub repo, set env vars (Clerk, Supabase, Resend)
4. **Set up Supabase project** — create Postgres instance, run Drizzle migrations
5. **Set up Clerk project** — configure auth, get publishable + secret keys
6. **Set up Resend** — verify domain (teez.live), get API key
7. **Build document parser** — Claude API integration for rent roll/T-12 extraction
8. **Build Excel add-in** — connect TaskPane to ai-engine, Office JS cell population
9. **Beta test** — invite 20 waitlist users, iterate on accuracy and UX

---

## 10. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Cactus adds Excel integration | Medium | High | Move fast — first-mover advantage in Excel-native. Build switching costs via templates + workflow integration |
| Document parsing accuracy < 95% | Medium | High | Invest heavily in prompt engineering, add human-in-the-loop review for low-confidence extractions |
| Office Add-in distribution friction | High | Medium | Prioritize sideloading docs, pursue AppSource listing, consider web-based Excel Online path |
| Supabase scaling issues | Low | Medium | Standard Postgres — can migrate to any managed Postgres if needed |
| Claude API cost per deal too high | Medium | Medium | Cache common document patterns, batch processing, explore fine-tuned smaller models for extraction |
| Low waitlist conversion to paid | Medium | High | Free tier or extended trial, strong onboarding flow, demo videos |
