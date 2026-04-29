"use client";

import { useState } from "react";
import { generatePlan, type GenerateResult } from "@/lib/ai";
import type { Column, Member, Task } from "@/lib/types";
import { Icon } from "./Icons";

type Props = {
  columns: Column[];
  members: Member[];
  existingTaskCount: number;
  onApply: (tasks: Task[]) => void;
};

const SAMPLES = [
  "Launch a referral program for our SaaS product",
  "Build a customer health dashboard with churn alerts",
  "Run a discovery study on small-business onboarding",
  "Migrate authentication to OAuth 2.0 with rollback plan",
  "Plan a Q4 brand campaign across social and email",
];

export function AIPlanner({ columns, members, existingTaskCount, onApply }: Props) {
  const [open, setOpen] = useState(false);
  const [goal, setGoal] = useState("");
  const [count, setCount] = useState(8);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [keep, setKeep] = useState<Set<string>>(new Set());

  const run = async () => {
    setBusy(true);
    try {
      const res = await generatePlan({
        goal: goal.trim(),
        columns,
        members,
        existingTaskCount,
        maxTasks: count,
      });
      setResult(res);
      setKeep(new Set(res.tasks.map((t) => t.id)));
    } finally {
      setBusy(false);
    }
  };

  const apply = () => {
    if (!result) return;
    const selected = result.tasks.filter((t) => keep.has(t.id));
    onApply(selected as unknown as Task[]);
    setOpen(false);
    setResult(null);
    setGoal("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ink-btn rounded-md text-[12.5px] px-3 py-2 inline-flex items-center gap-1.5 font-medium"
      >
        <Icon.Sparkle width={13} height={13} />
        Generate with AI
      </button>

      {open && (
        <>
          <div className="fixed inset-0 bg-ink/40 z-40" onClick={() => setOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="paper-card rounded-lg w-full max-w-2xl pointer-events-auto fade-up overflow-hidden" style={{ borderRadius: 12 }}>
              <div className="px-5 py-4 border-b border-rule flex items-center justify-between" style={{ borderColor: "var(--rule)" }}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center"
                    style={{ background: "rgba(194, 65, 12, 0.10)", color: "var(--accent)" }}
                  >
                    <Icon.Sparkle width={14} height={14} />
                  </div>
                  <div>
                    <div className="font-display text-[16px] font-semibold leading-none">AI Task Studio</div>
                    <div className="stamp text-ink-mute mt-1">Describe a goal — get a tagged plan</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-ink-mute hover:text-ink p-1 rounded"
                  aria-label="Close"
                >
                  <Icon.X width={16} height={16} />
                </button>
              </div>

              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="stamp text-ink-mute block mb-1.5">What are you trying to do?</label>
                  <textarea
                    autoFocus
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g., Launch a referral program for our SaaS product targeting solo founders"
                    rows={3}
                    className="w-full bg-card border border-rule rounded-md p-3 text-[14px] outline-none focus:border-ink-soft transition-colors"
                    style={{ borderColor: "var(--rule)" }}
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {SAMPLES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setGoal(s)}
                        className="ghost-btn rounded-full text-[11.5px] px-2.5 py-1 text-ink-soft hover:text-ink"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <label className="stamp text-ink-mute">Tasks to draft</label>
                    <input
                      type="number"
                      min={3}
                      max={12}
                      value={count}
                      onChange={(e) => setCount(Math.max(3, Math.min(12, Number(e.target.value) || 8)))}
                      className="w-16 bg-card border border-rule rounded-md p-1.5 text-[13px] outline-none text-center"
                      style={{ borderColor: "var(--rule)" }}
                    />
                  </div>
                  <button
                    type="button"
                    disabled={!goal.trim() || busy}
                    onClick={run}
                    className="ink-btn rounded-md text-[12.5px] px-3 py-2 inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {busy ? (
                      <>
                        <span className="pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-paper" />
                        Drafting…
                      </>
                    ) : result ? (
                      <>
                        <Icon.Refresh width={13} height={13} />
                        Regenerate
                      </>
                    ) : (
                      <>
                        <Icon.Sparkle width={13} height={13} />
                        Draft tasks
                      </>
                    )}
                  </button>
                </div>

                {busy && !result && (
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="paper-card rounded-md p-3">
                        <div className="shimmer h-3 w-2/3 rounded mb-2" />
                        <div className="shimmer h-2 w-1/3 rounded" />
                      </div>
                    ))}
                  </div>
                )}

                {result && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] text-ink-soft">
                        {result.summary}
                      </div>
                      <div className="flex gap-1">
                        {result.themes.map((t) => (
                          <span key={t.label} className="stamp px-1.5 py-0.5 rounded-sm bg-paper-2 text-ink-soft">
                            {t.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {result.tasks.map((t) => {
                        const col = columns.find((c) => c.id === t.columnId);
                        const member = members.find((m) => m.id === t.assigneeId);
                        const isKept = keep.has(t.id);
                        return (
                          <label
                            key={t.id}
                            className={`block paper-card rounded-md p-3 cursor-pointer transition-colors ${
                              isKept ? "" : "opacity-50"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={isKept}
                                onChange={(e) => {
                                  setKeep((prev) => {
                                    const next = new Set(prev);
                                    if (e.target.checked) next.add(t.id);
                                    else next.delete(t.id);
                                    return next;
                                  });
                                }}
                                className="mt-1 accent-[var(--accent)]"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="text-[13.5px] font-medium text-ink leading-snug">
                                    {t.title}
                                  </div>
                                  <span className="stamp text-ink-mute shrink-0" style={{ fontSize: 10 }}>
                                    → {col?.name}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {t.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="stamp px-1.5 py-0.5 rounded-sm bg-paper-2 text-ink-soft"
                                      style={{ fontSize: 9.5 }}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                  {t.estimateHours != null && (
                                    <span className="stamp text-ink-mute" style={{ fontSize: 9.5 }}>
                                      ~{t.estimateHours}h
                                    </span>
                                  )}
                                </div>
                                {member && (
                                  <div className="stamp text-ink-mute mt-1" style={{ fontSize: 10 }}>
                                    suggested → {member.name}
                                    {t.rationale && <span> · {t.rationale}</span>}
                                  </div>
                                )}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-5 py-3 border-t border-rule flex items-center justify-between bg-paper-2/50" style={{ borderColor: "var(--rule)" }}>
                <span className="stamp text-ink-mute">
                  {result ? `${keep.size} of ${result.tasks.length} selected` : "Local · no data leaves your browser"}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="ghost-btn rounded-md text-[12.5px] px-3 py-1.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!result || keep.size === 0}
                    onClick={apply}
                    className="ink-btn rounded-md text-[12.5px] px-3 py-1.5 inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Add to board
                    <Icon.ArrowRight width={13} height={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
