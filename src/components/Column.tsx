"use client";

import { useState } from "react";
import type { Column as Col, Member, Task } from "@/lib/types";
import { Icon } from "./Icons";
import { TaskCard } from "./TaskCard";

const TONE: Record<Col["tone"], string> = {
  neutral: "var(--ink-mute)",
  amber: "#b45309",
  emerald: "#166534",
  azure: "#1e3a8a",
  plum: "#6b21a8",
};

type Props = {
  column: Col;
  tasks: Task[];
  members: Member[];
  draggingId: string | null;
  isDropTarget: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: () => void;
  onTaskClick: (id: string) => void;
  onTaskDragStart: (id: string) => void;
  onTaskDragEnd: () => void;
  onAddTask: (title: string) => void;
  onRename: (name: string) => void;
  onDelete: () => void;
  canDelete: boolean;
};

export function ColumnView({
  column,
  tasks,
  members,
  draggingId,
  isDropTarget,
  onDragOver,
  onDragLeave,
  onDrop,
  onTaskClick,
  onTaskDragStart,
  onTaskDragEnd,
  onAddTask,
  onRename,
  onDelete,
  canDelete,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(column.name);

  return (
    <div
      className={`column-bg flex flex-col w-[300px] shrink-0 ${isDropTarget ? "drop-target" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div
        className="flex items-center justify-between px-3 py-2 border-b border-rule"
        style={{ borderColor: "var(--rule)" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: TONE[column.tone] }}
          />
          {editing ? (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => {
                if (name.trim() && name !== column.name) onRename(name.trim());
                else setName(column.name);
                setEditing(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (name.trim() && name !== column.name) onRename(name.trim());
                  setEditing(false);
                }
                if (e.key === "Escape") {
                  setName(column.name);
                  setEditing(false);
                }
              }}
              className="font-display text-[14px] font-semibold bg-transparent outline-none border-b border-ink-soft min-w-0"
            />
          ) : (
            <button
              type="button"
              onDoubleClick={() => setEditing(true)}
              className="font-display text-[14px] font-semibold tracking-tight text-ink truncate"
              title="Double-click to rename"
            >
              {column.name}
            </button>
          )}
          <span className="stamp text-ink-mute" style={{ fontSize: 10 }}>
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-ink-mute hover:text-ink p-1 rounded"
            title="Rename"
            aria-label="Rename column"
          >
            <Icon.Edit width={12} height={12} />
          </button>
          {canDelete && (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Delete "${column.name}"? Tasks move to the first remaining column.`))
                  onDelete();
              }}
              className="text-ink-mute hover:text-accent p-1 rounded"
              title="Delete column"
              aria-label="Delete column"
            >
              <Icon.Trash width={12} height={12} />
            </button>
          )}
        </div>
      </div>

      {column.hint && (
        <div className="px-3 pt-2 stamp text-ink-mute" style={{ fontSize: 10 }}>
          {column.hint}
        </div>
      )}

      <div className="px-2 pt-2 pb-2 flex-1 flex flex-col gap-2 min-h-[80px]">
        {tasks.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            members={members}
            onClick={() => onTaskClick(t.id)}
            onDragStart={() => onTaskDragStart(t.id)}
            onDragEnd={onTaskDragEnd}
            isDragging={draggingId === t.id}
          />
        ))}
        {tasks.length === 0 && !adding && (
          <div className="text-center py-6 text-ink-mute stamp" style={{ fontSize: 10 }}>
            no tasks yet
          </div>
        )}
        {adding ? (
          <div className="paper-card p-2 rounded-md">
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="What needs doing?"
              className="w-full bg-transparent text-[13px] outline-none resize-none"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (draft.trim()) {
                    onAddTask(draft.trim());
                    setDraft("");
                    setAdding(false);
                  }
                }
                if (e.key === "Escape") {
                  setDraft("");
                  setAdding(false);
                }
              }}
            />
            <div className="flex justify-end gap-1 mt-1">
              <button
                type="button"
                className="ghost-btn rounded text-[11px] px-2 py-1"
                onClick={() => {
                  setDraft("");
                  setAdding(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ink-btn rounded text-[11px] px-2 py-1"
                onClick={() => {
                  if (draft.trim()) {
                    onAddTask(draft.trim());
                    setDraft("");
                    setAdding(false);
                  }
                }}
              >
                Add
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="text-ink-mute hover:text-ink hover:bg-paper-2 rounded text-[12px] px-2 py-1.5 flex items-center gap-1.5 transition-colors"
            onClick={() => setAdding(true)}
          >
            <Icon.Plus width={12} height={12} />
            Add task
          </button>
        )}
      </div>
    </div>
  );
}
