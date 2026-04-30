"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useTaskflow } from "@/lib/store";
import type { Priority, Task } from "@/lib/types";
import { AIPlanner } from "./AIPlanner";
import { AvatarStack } from "./Avatar";
import { ColumnView } from "./Column";
import { Icon } from "./Icons";
import { Logo } from "./Logo";
import { TaskDrawer } from "./TaskDrawer";
import { TeamPanel } from "./TeamPanel";
import { WorkflowPicker } from "./WorkflowPicker";

const PRIORITY_OPTIONS: { value: Priority | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "med", label: "Med" },
  { value: "low", label: "Low" },
];

export function BoardView() {
  const tf = useTaskflow();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [filterAI, setFilterAI] = useState<"all" | "ai" | "human">("all");
  const [search, setSearch] = useState("");
  const [addColumnDraft, setAddColumnDraft] = useState("");
  const [addColumnOpen, setAddColumnOpen] = useState(false);

  const active = tf.active;

  const filteredTasks = useMemo(() => {
    if (!active) return [];
    return active.tasks.filter((t) => {
      if (filterAssignee !== "all") {
        if (filterAssignee === "_unassigned") {
          if (t.assigneeId) return false;
        } else if (t.assigneeId !== filterAssignee) return false;
      }
      if (filterPriority !== "all" && t.priority !== filterPriority) return false;
      if (filterAI === "ai" && !t.ai) return false;
      if (filterAI === "human" && t.ai) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = (t.title + " " + (t.detail ?? "") + " " + t.tags.join(" ")).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [active, filterAssignee, filterPriority, filterAI, search]);

  if (!tf.hydrated) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="stamp text-ink-mute">Loading…</div>
      </div>
    );
  }

  if (!active) {
    return null;
  }

  const completedColumn = active.columns[active.columns.length - 1];
  const completedCount = active.tasks.filter((t) => t.columnId === completedColumn?.id).length;
  const progressPct = active.tasks.length === 0 ? 0 : Math.round((completedCount / active.tasks.length) * 100);

  const handleDrop = (columnId: string) => {
    if (draggingId) {
      tf.moveTask(draggingId, columnId);
    }
    setDraggingId(null);
    setDropTarget(null);
  };

  const selected = active.tasks.find((t) => t.id === selectedTask) ?? null;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Top bar */}
      <header
        className="border-b border-rule bg-paper sticky top-0 z-30"
        style={{ borderColor: "var(--rule)" }}
      >
        <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="shrink-0">
              <Logo />
            </Link>
            <span className="text-rule mx-1">·</span>
            <div className="relative">
              <WorkflowPicker
                workflows={tf.state.workflows}
                activeId={tf.state.activeId}
                onSwitch={tf.switchWorkflow}
                onCreate={tf.createWorkflow}
                onDelete={tf.deleteWorkflow}
              />
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-[400px] mx-4">
            <div className="relative flex-1">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks, tags, notes…"
                className="w-full bg-card border border-rule rounded-md pl-8 pr-3 py-1.5 text-[13px] outline-none focus:border-ink-soft transition-colors"
                style={{ borderColor: "var(--rule)" }}
              />
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-mute"
                width={13}
                height={13}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3-3" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <TeamPanel
              members={active.members}
              tasks={active.tasks}
              onAdd={tf.addMember}
              onUpdate={tf.updateMember}
              onDelete={tf.deleteMember}
            />
            <AIPlanner
              columns={active.columns}
              members={active.members}
              existingTaskCount={active.tasks.length}
              onApply={(tasks) => tf.addTasksBulk(tasks)}
            />
          </div>
        </div>

        {/* Sub-bar: title + filters */}
        <div className="px-4 sm:px-6 py-3 border-t border-rule" style={{ borderColor: "var(--rule)" }}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 min-w-0">
              <input
                value={active.name}
                onChange={(e) => tf.update((s) => ({
                  ...s,
                  workflows: s.workflows.map((w) =>
                    w.id === active.id ? { ...w, name: e.target.value } : w,
                  ),
                }))}
                className="font-display text-[22px] font-semibold tracking-tight bg-transparent outline-none min-w-0"
              />
              <div className="hidden md:flex items-center gap-2">
                <AvatarStack members={active.members} max={4} size={22} />
                <span className="stamp text-ink-mute">
                  {active.tasks.length} tasks · {progressPct}% done
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                className="bg-card border border-rule rounded-md px-2 py-1.5 text-[12px] outline-none"
                style={{ borderColor: "var(--rule)" }}
              >
                <option value="all">Everyone</option>
                <option value="_unassigned">Unassigned</option>
                {active.members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as Priority | "all")}
                className="bg-card border border-rule rounded-md px-2 py-1.5 text-[12px] outline-none"
                style={{ borderColor: "var(--rule)" }}
              >
                {PRIORITY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label} priority
                  </option>
                ))}
              </select>
              <div className="bg-card border border-rule rounded-md p-0.5 flex" style={{ borderColor: "var(--rule)" }}>
                {(["all", "ai", "human"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setFilterAI(v)}
                    className={`px-2 py-1 rounded text-[11px] stamp transition-colors ${
                      filterAI === v ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {v === "all" ? "All" : v === "ai" ? "AI" : "Manual"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Board */}
      <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden no-scrollbar">
        <div className="flex gap-3 p-4 sm:p-6 h-full items-stretch">
          {active.columns.map((c) => {
            const tasks = filteredTasks.filter((t) => t.columnId === c.id);
            return (
              <ColumnView
                key={c.id}
                column={c}
                tasks={tasks}
                members={active.members}
                draggingId={draggingId}
                isDropTarget={dropTarget === c.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (dropTarget !== c.id) setDropTarget(c.id);
                }}
                onDragLeave={() => {
                  if (dropTarget === c.id) setDropTarget(null);
                }}
                onDrop={() => handleDrop(c.id)}
                onTaskClick={(id) => setSelectedTask(id)}
                onTaskDragStart={(id) => setDraggingId(id)}
                onTaskDragEnd={() => {
                  setDraggingId(null);
                  setDropTarget(null);
                }}
                onAddTask={(title) =>
                  tf.addTask({
                    title,
                    columnId: c.id,
                    priority: "med",
                    tags: [],
                  })
                }
                onRename={(name) => tf.renameColumn(c.id, name)}
                onDelete={() => tf.deleteColumn(c.id)}
                canDelete={active.columns.length > 1}
              />
            );
          })}

          <div className="w-[260px] shrink-0">
            {addColumnOpen ? (
              <div className="paper-card rounded-md p-3" style={{ borderRadius: 6 }}>
                <input
                  autoFocus
                  value={addColumnDraft}
                  onChange={(e) => setAddColumnDraft(e.target.value)}
                  placeholder="Column name"
                  className="w-full bg-transparent text-[13px] outline-none mb-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && addColumnDraft.trim()) {
                      tf.addColumn(addColumnDraft.trim());
                      setAddColumnDraft("");
                      setAddColumnOpen(false);
                    }
                    if (e.key === "Escape") {
                      setAddColumnDraft("");
                      setAddColumnOpen(false);
                    }
                  }}
                />
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (addColumnDraft.trim()) {
                        tf.addColumn(addColumnDraft.trim());
                        setAddColumnDraft("");
                        setAddColumnOpen(false);
                      }
                    }}
                    className="ink-btn rounded text-[11px] px-2 py-1"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddColumnDraft("");
                      setAddColumnOpen(false);
                    }}
                    className="ghost-btn rounded text-[11px] px-2 py-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAddColumnOpen(true)}
                className="w-full h-12 rounded-md border border-dashed border-rule flex items-center justify-center gap-1.5 stamp text-ink-mute hover:text-ink hover:border-ink-soft transition-colors"
                style={{ borderColor: "var(--rule)" }}
              >
                <Icon.Plus width={12} height={12} />
                Add column
              </button>
            )}
          </div>
        </div>
      </div>

      <TaskDrawer
        task={selected}
        columns={active.columns}
        members={active.members}
        onClose={() => setSelectedTask(null)}
        onUpdate={tf.updateTask}
        onDelete={tf.deleteTask}
      />
    </div>
  );
}
