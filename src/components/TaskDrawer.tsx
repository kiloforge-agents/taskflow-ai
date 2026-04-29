"use client";

import { useEffect, useState } from "react";
import { suggestAssignment } from "@/lib/ai";
import type { Column, Member, Priority, Task } from "@/lib/types";
import { Avatar } from "./Avatar";
import { Icon } from "./Icons";
import { PriorityDot, priorityLabel } from "./PriorityDot";

const PRIORITIES: Priority[] = ["low", "med", "high", "urgent"];

type Props = {
  task: Task | null;
  columns: Column[];
  members: Member[];
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onDelete: (id: string) => void;
};

export function TaskDrawer({ task, columns, members, onClose, onUpdate, onDelete }: Props) {
  const [tagDraft, setTagDraft] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);

  useEffect(() => {
    if (!task) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [task, onClose]);

  if (!task) return null;
  const assignee = members.find((m) => m.id === task.assigneeId);
  const suggestion = members.length > 0 ? suggestAssignment(task, members) : null;

  return (
    <>
      <div className="fixed inset-0 bg-ink/30 z-40" onClick={onClose} />
      <aside
        className="fixed top-0 right-0 h-full w-full sm:w-[460px] bg-paper border-l border-rule z-50 overflow-y-auto fade-up"
        style={{ borderColor: "var(--rule)" }}
      >
        <div className="sticky top-0 bg-paper border-b border-rule px-5 py-3 flex items-center justify-between" style={{ borderColor: "var(--rule)" }}>
          <span className="stamp text-ink-mute">
            Task · {priorityLabel(task.priority)}
            {task.ai && (
              <span className="ml-2 inline-flex items-center gap-1 text-accent">
                <Icon.Sparkle width={10} height={10} />
                AI-drafted
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-mute hover:text-ink p-1 rounded"
            aria-label="Close"
          >
            <Icon.X width={16} height={16} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <textarea
            value={task.title}
            onChange={(e) => onUpdate(task.id, { title: e.target.value })}
            className="w-full bg-transparent font-display text-[22px] leading-tight font-semibold outline-none resize-none"
            rows={2}
          />

          <div>
            <label className="stamp text-ink-mute block mb-1.5">Notes</label>
            <textarea
              value={task.detail ?? ""}
              onChange={(e) => onUpdate(task.id, { detail: e.target.value })}
              placeholder="Add context, links, acceptance criteria…"
              rows={4}
              className="w-full bg-card border border-rule rounded-md p-3 text-[13.5px] outline-none focus:border-ink-soft transition-colors"
              style={{ borderColor: "var(--rule)" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="stamp text-ink-mute block mb-1.5">Column</label>
              <select
                value={task.columnId}
                onChange={(e) => onUpdate(task.id, { columnId: e.target.value })}
                className="w-full bg-card border border-rule rounded-md p-2 text-[13px] outline-none"
                style={{ borderColor: "var(--rule)" }}
              >
                {columns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="stamp text-ink-mute block mb-1.5">Priority</label>
              <div className="flex gap-1">
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onUpdate(task.id, { priority: p })}
                    className={`flex-1 rounded border px-2 py-1.5 text-[12px] transition-colors ${
                      task.priority === p
                        ? "bg-ink text-paper border-ink"
                        : "bg-card border-rule text-ink-soft hover:border-ink-soft"
                    }`}
                    style={{ borderColor: task.priority === p ? "var(--ink)" : "var(--rule)" }}
                  >
                    <PriorityDot priority={p} />
                    <span className="ml-1">{priorityLabel(p)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="stamp text-ink-mute block mb-1.5">Estimate (hours)</label>
              <input
                type="number"
                min={0}
                step={0.5}
                value={task.estimateHours ?? ""}
                onChange={(e) =>
                  onUpdate(task.id, {
                    estimateHours: e.target.value === "" ? undefined : Number(e.target.value),
                  })
                }
                className="w-full bg-card border border-rule rounded-md p-2 text-[13px] outline-none"
                style={{ borderColor: "var(--rule)" }}
              />
            </div>
            <div>
              <label className="stamp text-ink-mute block mb-1.5">Assignee</label>
              <div className="flex items-center gap-2">
                <select
                  value={task.assigneeId ?? ""}
                  onChange={(e) =>
                    onUpdate(task.id, { assigneeId: e.target.value || undefined, rationale: undefined })
                  }
                  className="flex-1 bg-card border border-rule rounded-md p-2 text-[13px] outline-none"
                  style={{ borderColor: "var(--rule)" }}
                >
                  <option value="">Unassigned</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} · {m.role}
                    </option>
                  ))}
                </select>
              </div>
              {assignee && (
                <div className="mt-2 flex items-center gap-2">
                  <Avatar member={assignee} size={24} />
                  <span className="text-[12px] text-ink-soft">{assignee.role}</span>
                </div>
              )}
            </div>
          </div>

          {suggestion && suggestion.score > 0.5 && (!task.assigneeId || task.assigneeId !== suggestion.m.id) && (
            <div className="paper-card rounded-md p-3" style={{ borderRadius: 8 }}>
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: "rgba(194, 65, 12, 0.10)", color: "var(--accent)" }}
                >
                  <Icon.Sparkle width={14} height={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="stamp text-accent mb-1">Team suggestion</div>
                  <div className="text-[13px] text-ink-soft">
                    Try <span className="font-medium text-ink">{suggestion.m.name}</span> ({suggestion.m.role})
                    {suggestion.reasons.length > 0 && (
                      <span className="text-ink-mute"> · {suggestion.reasons.slice(0, 2).join(", ")}</span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => onUpdate(task.id, { assigneeId: suggestion.m.id, rationale: suggestion.reasons[0] })}
                      className="ink-btn rounded-md text-[12px] px-2.5 py-1"
                    >
                      Assign {suggestion.m.initials}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSuggest(false)}
                      className="ghost-btn rounded-md text-[12px] px-2.5 py-1"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="stamp text-ink-mute block mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {task.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 stamp px-1.5 py-0.5 rounded-sm bg-paper-2 text-ink-soft"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => onUpdate(task.id, { tags: task.tags.filter((x) => x !== t) })}
                    className="text-ink-mute hover:text-accent"
                    aria-label={`Remove tag ${t}`}
                  >
                    <Icon.X width={10} height={10} />
                  </button>
                </span>
              ))}
              {task.tags.length === 0 && (
                <span className="stamp text-ink-mute">none</span>
              )}
            </div>
            <input
              value={tagDraft}
              onChange={(e) => setTagDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && tagDraft.trim()) {
                  e.preventDefault();
                  const t = tagDraft.trim().toLowerCase();
                  if (!task.tags.includes(t)) {
                    onUpdate(task.id, { tags: [...task.tags, t] });
                  }
                  setTagDraft("");
                }
              }}
              placeholder="Add a tag and press Enter…"
              className="w-full bg-card border border-rule rounded-md p-2 text-[12px] outline-none"
              style={{ borderColor: "var(--rule)" }}
            />
          </div>

          <div className="pt-3 border-t border-rule flex items-center justify-between" style={{ borderColor: "var(--rule)" }}>
            <span className="stamp text-ink-mute">
              Created {new Date(task.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </span>
            <button
              type="button"
              onClick={() => {
                if (confirm("Delete this task? This cannot be undone.")) {
                  onDelete(task.id);
                  onClose();
                }
              }}
              className="ghost-btn rounded-md text-[12px] px-2.5 py-1.5 inline-flex items-center gap-1.5 text-accent hover:border-accent"
            >
              <Icon.Trash width={12} height={12} />
              Delete task
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
