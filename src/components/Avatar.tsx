import type { Member } from "@/lib/types";

export function Avatar({ member, size = 28 }: { member: Member; size?: number }) {
  const bg = `hsl(${member.hue} 60% 88%)`;
  const fg = `hsl(${member.hue} 70% 22%)`;
  return (
    <div
      className="font-mono-tight inline-flex items-center justify-center rounded-full select-none"
      style={{
        width: size,
        height: size,
        background: bg,
        color: fg,
        fontSize: Math.max(9, size * 0.42),
        letterSpacing: "0.04em",
        boxShadow: "inset 0 0 0 1px rgba(26,26,26,0.08)",
      }}
      title={`${member.name} · ${member.role}`}
    >
      {member.initials}
    </div>
  );
}

export function AvatarStack({ members, max = 3, size = 24 }: { members: Member[]; max?: number; size?: number }) {
  const visible = members.slice(0, max);
  const rest = members.length - visible.length;
  return (
    <div className="flex items-center">
      {visible.map((m, i) => (
        <div key={m.id} style={{ marginLeft: i === 0 ? 0 : -8 }}>
          <Avatar member={m} size={size} />
        </div>
      ))}
      {rest > 0 && (
        <div
          className="font-mono-tight inline-flex items-center justify-center rounded-full bg-paper-2 text-ink-soft"
          style={{
            width: size,
            height: size,
            fontSize: Math.max(9, size * 0.4),
            marginLeft: -8,
            boxShadow: "inset 0 0 0 1px rgba(26,26,26,0.10)",
          }}
        >
          +{rest}
        </div>
      )}
    </div>
  );
}
