"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { Icon } from "./Icons";

export function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-rule" style={{ borderColor: "var(--rule)" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-6 stamp text-ink-soft">
            <a href="#how" className="hover:text-ink">How it works</a>
            <a href="#templates" className="hover:text-ink">Templates</a>
            <a href="#pwa" className="hover:text-ink">PWA</a>
          </nav>
          <Link
            href="/board"
            className="ink-btn rounded-md text-[12.5px] px-3 py-2 inline-flex items-center gap-1.5 font-medium"
          >
            Open studio
            <Icon.ArrowRight width={13} height={13} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7 fade-up">
            <div className="stamp text-accent inline-flex items-center gap-1.5 mb-5">
              <Icon.Sparkle width={11} height={11} />
              No-code · AI-augmented · PWA
            </div>
            <h1 className="font-display text-[44px] sm:text-[64px] leading-[0.96] tracking-tight font-semibold">
              Workflows that
              <br />
              <span className="italic text-ink-soft">write themselves.</span>
            </h1>
            <p className="mt-6 text-[16px] text-ink-soft max-w-[52ch] leading-relaxed">
              TaskFlowAI is a customizable workflow studio. Describe a goal — get a structured plan,
              tagged and routed to the right teammate. Drag, edit, ship. No setup, no SaaS bill.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Link
                href="/board"
                className="ink-btn rounded-md text-[14px] px-4 py-2.5 inline-flex items-center gap-2 font-medium"
              >
                Start a board
                <Icon.ArrowRight width={14} height={14} />
              </Link>
              <a
                href="#how"
                className="ghost-btn rounded-md text-[14px] px-4 py-2.5 inline-flex items-center gap-2 font-medium"
              >
                See how it works
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6 stamp text-ink-mute">
              <span className="inline-flex items-center gap-1.5">
                <span className="pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-emerald-700" />
                Local-first storage
              </span>
              <span>·</span>
              <span>Installable PWA</span>
              <span>·</span>
              <span>Zero accounts</span>
            </div>
          </div>

          {/* Hero card preview */}
          <div className="md:col-span-5 fade-up">
            <div
              className="paper-card rounded-lg p-4 relative overflow-hidden"
              style={{ borderRadius: 14 }}
            >
              <div className="absolute -top-12 -right-10 w-44 h-44 rounded-full" style={{ background: "rgba(194,65,12,0.08)" }} />
              <div className="flex items-center justify-between mb-3 relative">
                <span className="stamp text-ink-mute">Building · Q3 launch</span>
                <span className="stamp text-accent inline-flex items-center gap-1">
                  <Icon.Sparkle width={10} height={10} /> AI · drafted 8 tasks
                </span>
              </div>
              <div className="space-y-2 relative">
                {[
                  { t: "Draft API contract & schema migrations", a: "DP", tag: "backend" },
                  { t: "Hi-fi mock for empty state", a: "IV", tag: "design" },
                  { t: "Write integration tests for happy & edge paths", a: "DP", tag: "tests" },
                  { t: "Wire telemetry & error tracking", a: "DP", tag: "observability" },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="paper-card rounded-md p-2.5 flex items-center gap-3"
                    style={{ borderRadius: 6 }}
                  >
                    <span
                      className="inline-block rounded-full"
                      style={{
                        width: 7,
                        height: 7,
                        background: i === 0 ? "#c2410c" : i === 1 ? "#b45309" : "#9aa39a",
                      }}
                    />
                    <span className="text-[13px] flex-1 leading-snug">{row.t}</span>
                    <span className="stamp px-1.5 py-0.5 rounded-sm bg-paper-2 text-ink-soft" style={{ fontSize: 9.5 }}>
                      {row.tag}
                    </span>
                    <span
                      className="font-mono-tight inline-flex items-center justify-center rounded-full"
                      style={{
                        width: 20,
                        height: 20,
                        fontSize: 9,
                        background: `hsl(${i * 50 + 200} 60% 88%)`,
                        color: `hsl(${i * 50 + 200} 70% 22%)`,
                        boxShadow: "inset 0 0 0 1px rgba(26,26,26,0.08)",
                      }}
                    >
                      {row.a}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-rule relative" style={{ borderColor: "var(--rule)" }}>
                <span className="stamp text-ink-mute">8 tasks · 4 columns · 3 teammates</span>
                <span className="stamp text-emerald-700 inline-flex items-center gap-1">
                  <Icon.Check width={11} height={11} />
                  routed
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="border-t border-rule" style={{ borderColor: "var(--rule)" }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-4">
              <span className="stamp text-ink-mute">/01 · Method</span>
              <h2 className="font-display text-[34px] leading-tight tracking-tight font-semibold mt-3">
                Three motions, one workflow.
              </h2>
              <p className="text-[14.5px] text-ink-soft mt-4 leading-relaxed">
                We took the parts of project tools teams actually use and removed the rest.
                Composition, not configuration.
              </p>
            </div>
            <div className="md:col-span-8 grid sm:grid-cols-3 gap-4">
              {[
                {
                  step: "01",
                  title: "Describe the goal",
                  body: "Plain English in. The AI decomposes it into themes — engineering, design, research, ops — and drafts a sequenced plan.",
                  icon: <Icon.Sparkle width={18} height={18} />,
                },
                {
                  step: "02",
                  title: "Route to the team",
                  body: "Roles and capacity inform suggestions. Accept the routing or override with a click; the rationale stays on the card.",
                  icon: <Icon.Users width={18} height={18} />,
                },
                {
                  step: "03",
                  title: "Customize the flow",
                  body: "Add or rename columns, retag tasks, set priorities. Save the board as a template you'll re-use next time.",
                  icon: <Icon.Layers width={18} height={18} />,
                },
              ].map((c) => (
                <div
                  key={c.step}
                  className="paper-card rounded-md p-5 flex flex-col h-full"
                  style={{ borderRadius: 8 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono-tight text-[11px] text-ink-mute">{c.step}</span>
                    <span className="text-accent">{c.icon}</span>
                  </div>
                  <div className="font-display text-[17px] font-semibold mb-2 leading-tight">{c.title}</div>
                  <p className="text-[13px] text-ink-soft leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="border-t border-rule bg-paper-2/40" style={{ borderColor: "var(--rule)" }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <span className="stamp text-ink-mute">/02 · Templates</span>
              <h2 className="font-display text-[34px] leading-tight tracking-tight font-semibold mt-3">
                Start anywhere. Bend it to fit.
              </h2>
            </div>
            <Link
              href="/board"
              className="ghost-btn rounded-md text-[12.5px] px-3 py-2 inline-flex items-center gap-1.5 hidden sm:inline-flex"
            >
              Browse all
              <Icon.ChevronRight width={12} height={12} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { name: "Product Launch", domain: "Product", cols: ["Backlog", "In Spec", "Building", "Review", "Shipped"] },
              { name: "Engineering Sprint", domain: "Engineering", cols: ["Backlog", "In Progress", "Code Review", "Staging", "Deployed"] },
              { name: "Marketing Campaign", domain: "Marketing", cols: ["Ideas", "Drafting", "Edit", "Scheduled", "Live"] },
              { name: "User Research", domain: "Research", cols: ["Recruit", "Interview", "Analyze", "Findings"] },
            ].map((t) => (
              <div key={t.name} className="paper-card rounded-md p-4" style={{ borderRadius: 8 }}>
                <div className="flex items-start justify-between mb-2">
                  <span className="font-display text-[15px] font-semibold leading-tight">{t.name}</span>
                  <span className="stamp text-ink-mute">{t.domain}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {t.cols.map((c) => (
                    <span
                      key={c}
                      className="stamp px-1.5 py-0.5 rounded-sm bg-paper-2 text-ink-soft"
                      style={{ fontSize: 9.5 }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PWA */}
      <section id="pwa" className="border-t border-rule" style={{ borderColor: "var(--rule)" }}>
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <span className="stamp text-ink-mute">/03 · PWA</span>
            <h2 className="font-display text-[34px] leading-tight tracking-tight font-semibold mt-3">
              Built as a Progressive Web App.
            </h2>
            <p className="text-[14.5px] text-ink-soft mt-4 max-w-[58ch] leading-relaxed">
              Install it like a native app on macOS, Windows, iOS, or Android. Your boards live in
              your browser — no servers to provision, no per-seat fees, no vendor lock-in. The
              fastest path from idea to shipped board is a tab you already have open.
            </p>
            <ul className="mt-6 space-y-2 text-[14px] text-ink-soft">
              {[
                "Works offline after first load",
                "Install to dock, taskbar, or home screen",
                "Local persistence — bring-your-own backup",
                "Zero auth ceremony, zero seat counting",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <span
                    className="mt-1.5 inline-block w-1 h-1 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-5">
            <div className="paper-card rounded-lg p-5 font-mono-tight text-[12px] text-ink-soft" style={{ borderRadius: 12 }}>
              <div className="text-ink-mute">// installable</div>
              <pre className="whitespace-pre-wrap leading-relaxed mt-1">{`{
  "name": "TaskFlowAI",
  "short_name": "TaskFlowAI",
  "display": "standalone",
  "theme_color": "#f5f1e8",
  "icons": [...]
}`}</pre>
              <div className="mt-3 stamp text-ink-mute">Cost to deploy: $0</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-rule bg-ink text-paper" style={{ borderColor: "var(--rule)" }}>
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8">
            <h2 className="font-display text-[36px] sm:text-[44px] leading-[1.05] tracking-tight font-semibold">
              Open a board. Talk to it. Ship.
            </h2>
            <p className="text-[14.5px] text-paper/70 mt-4 max-w-[60ch]">
              Five seconds from now, you could be staring at a working sprint plan.
            </p>
          </div>
          <div className="md:col-span-4 flex md:justify-end">
            <Link
              href="/board"
              className="rounded-md text-[14px] px-4 py-3 inline-flex items-center gap-2 font-medium bg-paper text-ink hover:bg-paper-2 transition-colors"
            >
              <Icon.Sparkle width={14} height={14} />
              Open the studio
              <Icon.ArrowRight width={14} height={14} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-rule bg-paper" style={{ borderColor: "var(--rule)" }}>
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-3 stamp text-ink-mute">
          <Logo size={18} />
          <span>© TaskFlowAI · Local-first workflows</span>
          <span>Built with Next.js · Deployed on Vercel</span>
        </div>
      </footer>
    </div>
  );
}
