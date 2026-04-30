"use client";

import { useState } from "react";
import type { Member, Task } from "@/lib/types";
import { Avatar } from "./Avatar";
import { Icon } from "./Icons";

type Props = {
  members: Member[];
  tasks: Task[];
  onAdd: (m: Omit<Member, "id">) => void;
  onUpdate: (id: string, patch: Partial<Member>) => void;
  onDelete: (id: string) => void;
};

const ROLES = [
  "Product Lead",
  "Engineering",
  "Backend Engineer",
  "Frontend Engineer",
  "Designer",
  "UX Researcher",
  "Content Lead",
  "DevOps",
  "Data Analyst",
  "Marketing",
];

export function TeamPanel({ members, tasks, onAdd, onUpdate, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState(ROLES[1]);

  const taskCounts = members.reduce<Record<string, number>>((acc, m) => {
    acc[m.id] = tasks.filter((t) => t.assigneeId === m.id).length;
    return acc;
  }, {});

  const addNew = () => {
    if (!name.trim()) return;
    const initials = name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("");
    onAdd({
      name: name.trim(),
      initials: initials || name.trim().slice(0, 2).toUpperCase(),
      role,
      hue: Math.floor(Math.random() * 360),
      capacity: 7,
    });
    setName("");
    setAdding(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ghost-btn rounded-md text-[12.5px] px-3 py-2 inline-flex items-center gap-1.5 font-medium"
      >
        <Icon.Users width={13} height={13} />
        Team
        <span className="stamp text-ink-mute" style={{ fontSize: 10 }}>
          {members.length}
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 bg-ink/30 z-40" onClick={() => setOpen(false)} />
          <aside
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-paper border-l border-rule z-50 overflow-y-auto fade-up"
            style={{ borderColor: "var(--rule)" }}
          >
            <div className="sticky top-0 bg-paper border-b border-rule px-5 py-3 flex items-center justify-between" style={{ borderColor: "var(--rule)" }}>
              <span className="stamp text-ink-mute">Team</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-ink-mute hover:text-ink p-1 rounded"
                aria-label="Close"
              >
                <Icon.X width={16} height={16} />
              </button>
            </div>

            <div className="p-5">
              <h2 className="font-display text-[22px] font-semibold tracking-tight mb-1">
                Who's on this board
              </h2>
              <p className="text-[13px] text-ink-soft mb-5">
                Roles inform AI suggestions. Capacity reflects bandwidth on a 1–10 scale.
              </p>

              <div className="space-y-2">
                {members.map((m) => {
                  const count = taskCounts[m.id] ?? 0;
                  const load = m.capacity > 0 ? Math.min(1, count / m.capacity) : 0;
                  return (
                    <div key={m.id} className="paper-card rounded-md p-3" style={{ borderRadius: 8 }}>
                      <div className="flex items-center gap-3">
                        <Avatar member={m} size={36} />
                        <div className="flex-1 min-w-0">
                          <input
                            value={m.name}
                            onChange={(e) =>
                              onUpdate(m.id, {
                                name: e.target.value,
                                initials: e.target.value
                                  .trim()
                                  .split(/\s+/)
                                  .slice(0, 2)
                                  .map((p) => p[0]?.toUpperCase() ?? "")
                                  .join("") || m.initials,
                              })
                            }
                            className="font-display text-[14px] font-semibold bg-transparent outline-none w-full leading-tight"
                          />
                          <input
                            value={m.role}
                            onChange={(e) => onUpdate(m.id, { role: e.target.value })}
                            className="text-[12px] text-ink-soft bg-transparent outline-none w-full"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove ${m.name} from this board?`)) onDelete(m.id);
                          }}
                          className="text-ink-mute hover:text-accent p-1 rounded"
                          aria-label="Remove member"
                        >
                          <Icon.Trash width={12} height={12} />
                        </button>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-3">
                        <div>
                          <span className="stamp text-ink-mute block mb-0.5">Tasks</span>
                          <span className="font-display text-[16px] font-semibold tabular-nums">
                            {count}
                          </span>
                        </div>
                        <div>
                          <span className="stamp text-ink-mute block mb-0.5">Capacity</span>
                          <input
                            type="range"
                            min={1}
                            max={10}
                            value={m.capacity}
                            onChange={(e) => onUpdate(m.id, { capacity: Number(e.target.value) })}
                            className="w-full accent-[var(--accent)]"
                          />
                          <span className="font-mono-tight text-[10px] text-ink-mute">{m.capacity}/10</span>
                        </div>
                        <div>
                          <span className="stamp text-ink-mute block mb-0.5">Load</span>
                          <div className="h-1.5 rounded-full bg-paper-2 overflow-hidden mt-1.5">
                            <div
                              className="h-full transition-all"
                              style={{
                                width: `${load * 100}%`,
                                background:
                                  load > 0.9
                                    ? "var(--accent)"
                                    : load > 0.6
                                    ? "var(--amber)"
                                    : "var(--emerald)",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {adding ? (
                <div className="paper-card rounded-md p-3 mt-3" style={{ borderRadius: 8 }}>
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full bg-card border border-rule rounded-md p-2 text-[13px] outline-none mb-2"
                    style={{ borderColor: "var(--rule)" }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addNew();
                      if (e.key === "Escape") setAdding(false);
                    }}
                  />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-card border border-rule rounded-md p-2 text-[13px] outline-none mb-2"
                    style={{ borderColor: "var(--rule)" }}
                  >
                    {ROLES.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={addNew}
                      className="ink-btn rounded-md text-[12px] px-3 py-1.5"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdding(false)}
                      className="ghost-btn rounded-md text-[12px] px-3 py-1.5"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAdding(true)}
                  className="ghost-btn rounded-md text-[12.5px] px-3 py-2 mt-3 inline-flex items-center gap-1.5 w-full justify-center"
                >
                  <Icon.Plus width={13} height={13} />
                  Add teammate
                </button>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
}
