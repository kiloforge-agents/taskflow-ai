"use client";

import { useState } from "react";
import { TEMPLATES } from "@/lib/templates";
import type { Workflow, WorkflowTemplate } from "@/lib/types";
import { Icon } from "./Icons";

type Props = {
  workflows: Workflow[];
  activeId: string | null;
  onSwitch: (id: string) => void;
  onCreate: (tpl: WorkflowTemplate, name?: string) => void;
  onDelete: (id: string) => void;
};

export function WorkflowPicker({ workflows, activeId, onSwitch, onCreate, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [picked, setPicked] = useState<WorkflowTemplate>(TEMPLATES[0]);
  const [name, setName] = useState("");

  const active = workflows.find((w) => w.id === activeId);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="ghost-btn rounded-md text-[12.5px] px-3 py-2 inline-flex items-center gap-2 font-medium max-w-[220px]"
      >
        <Icon.Layers width={13} height={13} />
        <span className="truncate">{active?.name ?? "Workflow"}</span>
        <Icon.Chevron width={12} height={12} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div
            className="absolute top-full left-0 mt-1 w-[280px] paper-card rounded-md p-1.5 z-40 fade-up"
            style={{ borderRadius: 8 }}
          >
            <div className="px-2 py-1 stamp text-ink-mute">Boards</div>
            <div className="space-y-0.5 max-h-[280px] overflow-y-auto">
              {workflows.map((w) => (
                <div
                  key={w.id}
                  className={`group flex items-center gap-2 px-2 py-1.5 rounded text-[13px] cursor-pointer ${
                    w.id === activeId ? "bg-paper-2" : "hover:bg-paper-2/60"
                  }`}
                  onClick={() => {
                    onSwitch(w.id);
                    setOpen(false);
                  }}
                >
                  <span className="flex-1 truncate font-medium">{w.name}</span>
                  <span className="stamp text-ink-mute">{w.tasks.length}</span>
                  {workflows.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete board "${w.name}"?`)) onDelete(w.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-ink-mute hover:text-accent transition-opacity"
                      aria-label="Delete board"
                    >
                      <Icon.Trash width={12} height={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-rule mt-1.5 pt-1.5" style={{ borderColor: "var(--rule)" }}>
              <button
                type="button"
                onClick={() => {
                  setCreateOpen(true);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[13px] hover:bg-paper-2/60"
              >
                <Icon.Plus width={13} height={13} />
                New board from template
              </button>
            </div>
          </div>
        </>
      )}

      {createOpen && (
        <>
          <div className="fixed inset-0 bg-ink/40 z-40" onClick={() => setCreateOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="paper-card rounded-lg w-full max-w-3xl pointer-events-auto fade-up overflow-hidden" style={{ borderRadius: 12 }}>
              <div className="px-5 py-4 border-b border-rule flex items-center justify-between" style={{ borderColor: "var(--rule)" }}>
                <div>
                  <div className="font-display text-[18px] font-semibold leading-none">New board</div>
                  <div className="stamp text-ink-mute mt-1.5">Pick a template — every column and rule is editable</div>
                </div>
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="text-ink-mute hover:text-ink p-1 rounded"
                  aria-label="Close"
                >
                  <Icon.X width={16} height={16} />
                </button>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setPicked(t)}
                    className={`text-left paper-card rounded-md p-4 transition-all ${
                      picked.id === t.id ? "border-ink-soft shadow-md" : "hover:border-ink-soft"
                    }`}
                    style={{
                      borderRadius: 8,
                      borderColor: picked.id === t.id ? "var(--ink-soft)" : undefined,
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-display text-[15px] font-semibold">{t.name}</div>
                      <span className="stamp text-ink-mute">{t.domain}</span>
                    </div>
                    <p className="text-[12.5px] text-ink-soft leading-snug mb-3">{t.blurb}</p>
                    <div className="flex gap-1 flex-wrap">
                      {t.columns.map((c, i) => (
                        <span
                          key={i}
                          className="stamp px-1.5 py-0.5 rounded-sm bg-paper-2 text-ink-soft"
                          style={{ fontSize: 9.5 }}
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-rule flex items-center gap-3 bg-paper-2/50" style={{ borderColor: "var(--rule)" }}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={`Board name (defaults to "${picked.name}")`}
                  className="flex-1 bg-card border border-rule rounded-md p-2 text-[13px] outline-none"
                  style={{ borderColor: "var(--rule)" }}
                />
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="ghost-btn rounded-md text-[12.5px] px-3 py-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onCreate(picked, name);
                    setName("");
                    setCreateOpen(false);
                  }}
                  className="ink-btn rounded-md text-[12.5px] px-3 py-2 inline-flex items-center gap-1.5"
                >
                  Create board
                  <Icon.ArrowRight width={13} height={13} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
