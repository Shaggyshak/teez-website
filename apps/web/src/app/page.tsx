import Image from "next/image";
import { Nav } from "@/components/nav";
import { WaitlistForm } from "@/components/waitlist-form";

export default function Home() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="min-h-screen flex items-center relative overflow-hidden pt-[120px] pb-20">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] glow" />
        <div className="max-w-[1140px] mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-green-glow text-green border border-green/20">
            AI-Powered CRE Underwriting
          </div>
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.1] mt-6 mb-6 tracking-tight">
            Your Spreadsheet,
            <br />
            <span className="text-green">Supercharged</span>
          </h1>
          <p className="text-[clamp(1rem,2vw,1.25rem)] text-text-dim max-w-[640px] mx-auto mb-10">
            The only AI underwriting that lives inside Excel and Google
            Sheets. Rent roll in, full pro-forma out — without leaving your
            spreadsheet.
          </p>
          <div className="flex justify-center mb-16">
            <WaitlistForm />
          </div>
          <div className="flex items-center justify-center gap-10 flex-wrap">
            <div className="text-center">
              <span className="block text-2xl font-bold text-green">
                Excel-Native
              </span>
              <span className="text-sm text-text-muted">
                Works Where You Work
              </span>
            </div>
            <div className="w-px h-10 bg-border hidden sm:block" />
            <div className="text-center">
              <span className="block text-2xl font-bold text-green">
                Multi-Asset
              </span>
              <span className="text-sm text-text-muted">
                MF, Industrial, Retail, Mixed-Use
              </span>
            </div>
            <div className="w-px h-10 bg-border hidden sm:block" />
            <div className="text-center">
              <span className="block text-2xl font-bold text-green">
                $149/mo
              </span>
              <span className="text-sm text-text-muted">
                Half the Cost of Alternatives
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24" id="problem">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-green-glow text-green border border-green/20">
              The Problem
            </div>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold mt-4 mb-4 tracking-tight">
              The Underwriting Bottleneck
            </h2>
            <p className="text-lg text-text-dim max-w-[640px] mx-auto">
              CRE teams lose deals, waste hours, and risk costly errors — while
              competitors using standalone web apps force you to abandon your
              Excel workflow entirely.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                ),
                title: "Manual Data Entry",
                desc: "Hours spent typing rent rolls and T-12s into spreadsheets. One cell error can cascade through your entire model.",
              },
              {
                icon: (
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                ),
                title: "Costly Mistakes",
                desc: "Formula errors and broken links cause deal delays. Simple mistakes in underwriting models can cost millions.",
              },
              {
                icon: (
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                ),
                title: "Losing Deals",
                desc: "While you're manually building models, faster competitors are already submitting offers. Speed wins in CRE.",
              },
              {
                icon: (
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                ),
                title: "Wrong Tools",
                desc: "Existing AI tools force you into their web app. You lose the flexibility, transparency, and control that Excel provides.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-bg-card border border-border rounded-xl p-8 transition-all hover:bg-bg-card-hover hover:border-green/20 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-[10px] bg-green-glow text-green flex items-center justify-center mb-5">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                <p className="text-sm text-text-dim leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-24 bg-bg-section-alt" id="solution">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-green-glow text-green border border-green/20">
              The Solution
            </div>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold mt-4 mb-4 tracking-tight">
              AI That Lives in Your Spreadsheet
            </h2>
            <p className="text-lg text-text-dim max-w-[640px] mx-auto">
              Not another web app. Teez is an AI agent embedded directly in
              Excel and Google Sheets — automating extraction, analysis, and
              modeling where you already work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                num: "01",
                title: "Drop In Documents",
                desc: "Upload rent rolls, T-12s, and OMs. AI extracts structured data with 98%+ accuracy — multifamily, industrial, retail, or mixed-use.",
              },
              {
                num: "02",
                title: "Instant Pro-Forma",
                desc: "Full DCF, IRR, cash-on-cash projections populated directly in your Excel cells. Risk flags highlight anomalies automatically.",
              },
              {
                num: "03",
                title: "Ask Questions",
                desc: '"What\'s the IRR if vacancy increases 2%?" — conversational sensitivity analysis without leaving your spreadsheet.',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="bg-bg-card border border-border rounded-xl p-10 relative overflow-hidden transition-all hover:border-green/30 hover:-translate-y-1"
              >
                <span className="absolute -top-2.5 right-4 text-7xl font-black text-green/15 leading-none">
                  {step.num}
                </span>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-text-dim leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: "90%", label: "Faster than manual underwriting" },
              { value: "4+", label: "Asset types supported from day one" },
              {
                value: "Your Excel",
                label: "Keep your models, workflow, and control",
              },
            ].map((metric) => (
              <div
                key={metric.value}
                className="text-center p-8 bg-bg-card border border-border rounded-xl"
              >
                <span className="block text-4xl font-extrabold text-green mb-2">
                  {metric.value}
                </span>
                <span className="text-sm text-text-dim">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24" id="pricing">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-green-glow text-green border border-green/20">
              Pricing
            </div>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold mt-4 mb-4 tracking-tight">
              Institutional Intelligence, Accessible Price
            </h2>
            <p className="text-lg text-text-dim max-w-[640px] mx-auto">
              Professional-grade AI underwriting at a fraction of what
              standalone tools charge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[960px] mx-auto">
            {[
              {
                name: "Starter",
                price: "$149",
                period: "/mo",
                target: "Solo investors & small firms",
                features: [
                  "10 deals per month",
                  "1 user seat",
                  "Excel add-in",
                  "MF, industrial, retail, mixed-use templates",
                  "Document parsing (rent rolls, T-12s)",
                  "Pro-forma generation",
                  "Risk flags & audit trail",
                ],
                featured: false,
              },
              {
                name: "Pro",
                price: "$299",
                period: "/mo",
                target: "Boutique teams (2-5 analysts)",
                features: [
                  "Unlimited deals",
                  "5 user seats",
                  "Excel + Google Sheets",
                  "All asset type templates",
                  "Deal pipeline dashboard",
                  "Investment memo export",
                  "Natural language sensitivity analysis",
                  "Priority support",
                ],
                featured: true,
              },
              {
                name: "Team",
                price: "$499",
                period: "/mo",
                target: "Emerging managers",
                features: [
                  "Everything in Pro",
                  "Unlimited users",
                  "API access",
                  "Advanced portfolio analytics",
                  "Custom model templates",
                  "Team collaboration & approvals",
                  "Dedicated account manager",
                ],
                featured: false,
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl p-8 transition-all hover:-translate-y-1 ${
                  tier.featured
                    ? "bg-bg-card border-2 border-green shadow-[0_0_40px_rgba(74,222,128,0.15)] relative"
                    : "bg-bg-card border border-border"
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold bg-green text-bg">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-bold mb-1">{tier.name}</h3>
                <p className="text-sm text-text-muted mb-4">{tier.target}</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-green">
                    {tier.price}
                  </span>
                  <span className="text-text-muted">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-text-dim"
                    >
                      <svg
                        className="w-4 h-4 text-green mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#waitlist"
                  className={`block text-center py-3 rounded-lg font-semibold transition-all ${
                    tier.featured
                      ? "bg-gradient-to-br from-green-dim to-green text-bg hover:shadow-[0_0_30px_rgba(74,222,128,0.15)]"
                      : "border border-border text-text-dim hover:border-green hover:text-green"
                  }`}
                >
                  Join Waitlist
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why We Win */}
      <section className="py-24 bg-bg-section-alt" id="advantage">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-green-glow text-green border border-green/20">
              Competitive Advantage
            </div>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold mt-4 mb-4 tracking-tight">
              Why Teez Wins
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                ),
                title: "Excel-Native — Not Another Web App",
                desc: "Every competitor makes you leave Excel for their platform. Teez is the only AI that lives inside your spreadsheet, preserving the flexibility and transparency that CRE professionals demand.",
              },
              {
                icon: (
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                ),
                title: "Multi-Asset From Day One",
                desc: "Most competitors only support multifamily. Teez ships with templates for MF, industrial, retail, and mixed-use — covering the full CRE spectrum that teams actually work across.",
              },
              {
                icon: (
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                ),
                title: "Same Intelligence, Half the Price",
                desc: "Cactus charges $350/mo for a standalone web app. Teez delivers the same AI extraction and modeling at $149/mo — inside the tool you already know.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-bg-card border border-border rounded-xl p-8 transition-all hover:bg-bg-card-hover hover:border-green/20 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-[10px] bg-green-glow text-green flex items-center justify-center mb-5">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                <p className="text-sm text-text-dim leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section
        className="py-28 relative overflow-hidden bg-gradient-to-b from-bg-section-alt to-bg"
        id="waitlist"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] glow" />
        <div className="max-w-[640px] mx-auto px-6 text-center relative z-10">
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold mb-5">
            Get Early Access
          </h2>
          <p className="text-lg text-text-dim mb-4">
            We&apos;re building the AI underwriting agent that CRE professionals
            actually asked for — one that works inside your spreadsheet, not
            instead of it.
          </p>
          <p className="text-text-primary font-semibold mb-8">
            Join the waitlist and be first to try it.
          </p>
          <div className="flex justify-center">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border">
        <div className="max-w-[1140px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/teez-icon.png"
              alt="Teez"
              width={32}
              height={32}
            />
            <span className="text-xl font-extrabold text-gradient">Teez</span>
            <span className="text-sm text-text-muted">
              AI-Powered CRE Underwriting
            </span>
          </div>
          <span className="text-sm text-text-muted">
            &copy; 2026 Teez. All rights reserved.
          </span>
        </div>
      </footer>
    </>
  );
}
