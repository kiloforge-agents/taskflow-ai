import type { Priority } from "@/lib/types";

const map: Record<Priority, { color: string; label: string }> = {
  low: { color: "#9aa39a", label: "Low" },
  med: { color: "#b45309", label: "Med" },
  high: { color: "#c2410c", label: "High" },
  urgent: { color: "#991b1b", label: "Urgent" },
};

export function PriorityDot({ priority, withLabel = false }: { priority: Priority; withLabel?: boolean }) {
  const m = map[priority];
  return (
    <span className="inline-flex items-center gap-1.5 stamp text-ink-mute">
      <span
        className="inline-block rounded-full"
        style={{
          width: 7,
          height: 7,
          background: m.color,
          boxShadow: priority === "urgent" ? `0 0 0 3px ${m.color}22` : undefined,
        }}
      />
      {withLabel && <span style={{ color: m.color }}>{m.label}</span>}
    </span>
  );
}

export function priorityColor(p: Priority) {
  return map[p].color;
}

export function priorityLabel(p: Priority) {
  return map[p].label;
}
