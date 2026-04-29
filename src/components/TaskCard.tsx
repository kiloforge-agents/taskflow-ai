"use client";

import type { Member, Task } from "@/lib/types";
import { Avatar } from "./Avatar";
import { Icon } from "./Icons";
import { PriorityDot } from "./PriorityDot";

type Props = {
  task: Task;
  members: Member[];
  onClick: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
};

export function TaskCard({ task, members, onClick, onDragStart, onDragEnd, isDragging }: Props) {
  const assignee = members.find((m) => m.id === task.assigneeId);

  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", task.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={`paper-card w-full text-left p-3 rounded-md cursor-grab active:cursor-grabbing fade-up ${
        isDragging ? "dragging" : ""
      } hover:border-ink-soft transition-colors`}
      style={{ borderRadius: 6 }}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <PriorityDot priority={task.priority} />
        {task.ai && (
          <span className="stamp inline-flex items-center gap-1 text-accent" title="AI-drafted">
            <Icon.Sparkle width={10} height={10} />
            AI
          </span>
        )}
      </div>
      <div className="text-[13.5px] leading-snug text-ink font-medium mb-2">
        {task.title}
      </div>
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.slice(0, 4).map((t) => (
            <span
              key={t}
              className="stamp px-1.5 py-0.5 rounded-sm bg-paper-2 text-ink-soft"
              style={{ fontSize: 9.5 }}
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {assignee ? (
            <Avatar member={assignee} size={20} />
          ) : (
            <span className="stamp text-ink-mute">Unassigned</span>
          )}
          {task.estimateHours != null && (
            <span className="stamp text-ink-mute inline-flex items-center gap-1">
              <Icon.Clock width={10} height={10} />
              {task.estimateHours}h
            </span>
          )}
        </div>
        {task.rationale && (
          <span
            className="stamp text-ink-mute truncate max-w-[55%] text-right"
            title={task.rationale}
            style={{ fontSize: 9.5 }}
          >
            {task.rationale}
          </span>
        )}
      </div>
    </button>
  );
}
