import type { Column, Member, Priority, Task } from "./types";

// A deterministic-but-rich generator that imitates an LLM:
// it parses the user's goal into themes, then expands each theme
// into a sequence of dependent tasks with rationale and tags.

type Domain =
  | "engineering"
  | "design"
  | "marketing"
  | "research"
  | "ops"
  | "product"
  | "data"
  | "general";

type Theme = {
  domain: Domain;
  keyword: string;
  signal: number;
};

const DOMAIN_HINTS: Record<Domain, string[]> = {
  engineering: ["api", "deploy", "build", "ship", "code", "backend", "frontend", "service", "feature", "bug", "refactor", "infra", "auth", "database", "schema", "endpoint", "test", "ci", "release"],
  design: ["design", "wireframe", "mock", "ui", "ux", "prototype", "figma", "brand", "visual", "system"],
  marketing: ["launch", "campaign", "blog", "post", "content", "seo", "ad", "email", "newsletter", "social", "audience", "press", "growth"],
  research: ["research", "interview", "survey", "study", "user", "feedback", "discover", "validate", "insight"],
  ops: ["onboard", "hire", "policy", "vendor", "budget", "compliance", "support", "ops", "process"],
  product: ["roadmap", "spec", "prd", "okr", "goal", "kickoff", "milestone", "scope", "metric"],
  data: ["data", "metric", "analytic", "dashboard", "report", "track", "event", "warehouse", "sql"],
  general: [],
};

function detectThemes(input: string): Theme[] {
  const lower = input.toLowerCase();
  const themes: Theme[] = [];
  (Object.keys(DOMAIN_HINTS) as Domain[]).forEach((d) => {
    let signal = 0;
    let keyword = "";
    for (const k of DOMAIN_HINTS[d]) {
      const re = new RegExp(`\\b${k}\\w*`, "g");
      const m = lower.match(re);
      if (m) {
        signal += m.length;
        if (!keyword) keyword = k;
      }
    }
    if (signal > 0) themes.push({ domain: d, keyword, signal });
  });
  if (themes.length === 0) themes.push({ domain: "general", keyword: "initiative", signal: 1 });
  themes.sort((a, b) => b.signal - a.signal);
  return themes;
}

type Recipe = {
  steps: { title: string; tags: string[]; priority: Priority; phase: number; estimate: number }[];
};

const RECIPES: Record<Domain, Recipe> = {
  engineering: {
    steps: [
      { title: "Write a one-pager spec & success criteria", tags: ["spec"], priority: "high", phase: 0, estimate: 3 },
      { title: "Break work into ticketable units", tags: ["planning"], priority: "high", phase: 0, estimate: 2 },
      { title: "Set up feature branch & CI matrix", tags: ["devops", "ci"], priority: "med", phase: 0, estimate: 2 },
      { title: "Draft API contract & schema migrations", tags: ["backend", "api"], priority: "high", phase: 1, estimate: 4 },
      { title: "Implement core service logic", tags: ["backend"], priority: "high", phase: 1, estimate: 8 },
      { title: "Build UI surfaces and empty states", tags: ["frontend"], priority: "high", phase: 1, estimate: 8 },
      { title: "Wire telemetry & error tracking", tags: ["observability"], priority: "med", phase: 2, estimate: 3 },
      { title: "Write integration tests for happy & edge paths", tags: ["tests"], priority: "high", phase: 2, estimate: 4 },
      { title: "Self-review PR & request code review", tags: ["review"], priority: "med", phase: 2, estimate: 1 },
      { title: "Deploy to staging & smoke-test", tags: ["devops"], priority: "high", phase: 3, estimate: 2 },
      { title: "Roll out behind feature flag at 10%", tags: ["release"], priority: "high", phase: 3, estimate: 1 },
      { title: "Monitor metrics and ramp to 100%", tags: ["release", "observability"], priority: "med", phase: 3, estimate: 2 },
    ],
  },
  design: {
    steps: [
      { title: "Audit current flow & note friction points", tags: ["audit"], priority: "high", phase: 0, estimate: 3 },
      { title: "Sketch low-fidelity exploration (3 directions)", tags: ["sketch"], priority: "high", phase: 0, estimate: 4 },
      { title: "Pick a direction with stakeholder review", tags: ["review"], priority: "high", phase: 1, estimate: 2 },
      { title: "Build high-fidelity mock & interactive prototype", tags: ["figma", "prototype"], priority: "high", phase: 1, estimate: 6 },
      { title: "Define states: empty, loading, error, success", tags: ["states"], priority: "med", phase: 1, estimate: 3 },
      { title: "Spec components against design system", tags: ["system"], priority: "med", phase: 2, estimate: 3 },
      { title: "Hand off with redlines & motion notes", tags: ["handoff"], priority: "high", phase: 2, estimate: 2 },
      { title: "Pair with engineering during build", tags: ["pairing"], priority: "med", phase: 3, estimate: 4 },
    ],
  },
  marketing: {
    steps: [
      { title: "Define the audience and one-line value prop", tags: ["positioning"], priority: "high", phase: 0, estimate: 3 },
      { title: "Outline launch narrative & key messages", tags: ["narrative"], priority: "high", phase: 0, estimate: 3 },
      { title: "Draft hero blog post & landing page copy", tags: ["copy"], priority: "high", phase: 1, estimate: 6 },
      { title: "Brief design on hero asset & social cards", tags: ["design", "brief"], priority: "high", phase: 1, estimate: 2 },
      { title: "Plan email cadence (announce, dive-deep, recap)", tags: ["email"], priority: "med", phase: 1, estimate: 3 },
      { title: "Coordinate with PR for embargoed press notes", tags: ["pr"], priority: "med", phase: 2, estimate: 2 },
      { title: "Schedule social posts across launch week", tags: ["social"], priority: "med", phase: 2, estimate: 2 },
      { title: "Set up tracking links & UTM scheme", tags: ["analytics"], priority: "med", phase: 2, estimate: 1 },
      { title: "Launch day standby & response playbook", tags: ["ops"], priority: "high", phase: 3, estimate: 1 },
      { title: "Post-launch retro & metrics review", tags: ["retro"], priority: "med", phase: 3, estimate: 2 },
    ],
  },
  research: {
    steps: [
      { title: "Frame the research question & decisions it informs", tags: ["framing"], priority: "high", phase: 0, estimate: 2 },
      { title: "Define participant criteria & screener", tags: ["recruit"], priority: "high", phase: 0, estimate: 2 },
      { title: "Recruit 6–8 participants from target segment", tags: ["recruit"], priority: "high", phase: 0, estimate: 4 },
      { title: "Write semi-structured interview guide", tags: ["guide"], priority: "med", phase: 1, estimate: 3 },
      { title: "Run sessions (record with consent)", tags: ["interview"], priority: "high", phase: 1, estimate: 8 },
      { title: "Tag transcripts & cluster observations", tags: ["analysis"], priority: "high", phase: 2, estimate: 5 },
      { title: "Draft top-line findings doc with verbatims", tags: ["report"], priority: "high", phase: 2, estimate: 4 },
      { title: "Share readout with product & design", tags: ["share"], priority: "med", phase: 3, estimate: 1 },
    ],
  },
  ops: {
    steps: [
      { title: "Map the current process end-to-end", tags: ["mapping"], priority: "high", phase: 0, estimate: 3 },
      { title: "Identify owner per stage and SLAs", tags: ["ownership"], priority: "high", phase: 0, estimate: 2 },
      { title: "Document standard operating procedure", tags: ["sop"], priority: "med", phase: 1, estimate: 4 },
      { title: "Pilot the process with one team", tags: ["pilot"], priority: "high", phase: 1, estimate: 6 },
      { title: "Collect feedback & iterate", tags: ["feedback"], priority: "med", phase: 2, estimate: 3 },
      { title: "Roll out org-wide with kickoff session", tags: ["rollout"], priority: "med", phase: 3, estimate: 2 },
    ],
  },
  product: {
    steps: [
      { title: "Write a problem statement & metric to move", tags: ["problem"], priority: "high", phase: 0, estimate: 2 },
      { title: "Validate with 5 customer conversations", tags: ["validation"], priority: "high", phase: 0, estimate: 5 },
      { title: "Draft PRD with scope and non-goals", tags: ["prd"], priority: "high", phase: 1, estimate: 4 },
      { title: "Spec the v1 user journey & edge cases", tags: ["spec"], priority: "high", phase: 1, estimate: 4 },
      { title: "Align engineering on scope & estimate", tags: ["alignment"], priority: "med", phase: 2, estimate: 2 },
      { title: "Define rollout plan & success criteria", tags: ["rollout"], priority: "med", phase: 2, estimate: 2 },
    ],
  },
  data: {
    steps: [
      { title: "Define the question & required granularity", tags: ["framing"], priority: "high", phase: 0, estimate: 2 },
      { title: "Inventory existing event coverage", tags: ["audit"], priority: "med", phase: 0, estimate: 2 },
      { title: "Add or update tracking events", tags: ["instrumentation"], priority: "high", phase: 1, estimate: 4 },
      { title: "Build dashboards in BI tool", tags: ["dashboard"], priority: "high", phase: 2, estimate: 5 },
      { title: "QA numbers against source-of-truth", tags: ["qa"], priority: "high", phase: 2, estimate: 3 },
      { title: "Share readout with stakeholders", tags: ["share"], priority: "med", phase: 3, estimate: 1 },
    ],
  },
  general: {
    steps: [
      { title: "Capture goal in one sentence", tags: ["framing"], priority: "high", phase: 0, estimate: 1 },
      { title: "List constraints, deadlines, and dependencies", tags: ["planning"], priority: "high", phase: 0, estimate: 2 },
      { title: "Break the work into 3 milestones", tags: ["milestones"], priority: "high", phase: 0, estimate: 2 },
      { title: "Assign owners for each milestone", tags: ["ownership"], priority: "med", phase: 1, estimate: 1 },
      { title: "Schedule weekly check-in cadence", tags: ["cadence"], priority: "med", phase: 1, estimate: 1 },
      { title: "Define what 'done' looks like & how you'll know", tags: ["criteria"], priority: "high", phase: 2, estimate: 2 },
      { title: "Prepare a kickoff note for the team", tags: ["kickoff"], priority: "med", phase: 2, estimate: 1 },
    ],
  },
};

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-3)}`;
}

function pickColumn(columns: Column[], phase: number): Column {
  // Map phases (0..3) onto the available columns for this workflow.
  // Phase 0 lands in column 0; later phases move forward but never reach the last column.
  const max = Math.max(0, columns.length - 2);
  const idx = Math.min(max, phase);
  return columns[idx] ?? columns[0];
}

function titleize(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function scoreMember(m: Member, tags: string[]): { score: number; reasons: string[] } {
  const text = (m.role + " " + m.name).toLowerCase();
  const reasons: string[] = [];
  let score = 0;

  const roleSignals: Record<string, string[]> = {
    backend: ["backend", "api", "service", "engineer"],
    frontend: ["frontend", "ui", "client", "engineer"],
    design: ["design", "ux", "ui", "brand"],
    research: ["research", "ux"],
    product: ["product", "pm", "lead"],
    marketing: ["marketing", "content", "growth", "writer"],
    data: ["data", "analyt"],
    devops: ["devops", "infra", "platform"],
  };

  for (const tag of tags) {
    const t = tag.toLowerCase();
    for (const [k, signals] of Object.entries(roleSignals)) {
      if (t.includes(k)) {
        for (const s of signals) {
          if (text.includes(s)) {
            score += 2;
            reasons.push(`${m.role} matches "${tag}"`);
          }
        }
      }
    }
  }
  // capacity nudge
  score += m.capacity * 0.1;
  return { score, reasons: Array.from(new Set(reasons)) };
}

export type GenerateInput = {
  goal: string;
  columns: Column[];
  members: Member[];
  existingTaskCount: number;
  maxTasks?: number;
};

export type GeneratedTask = Omit<Task, "id" | "createdAt"> & {
  id: string;
  createdAt: number;
};

export type GenerateResult = {
  tasks: GeneratedTask[];
  themes: { label: string; weight: number }[];
  summary: string;
};

export async function generatePlan({
  goal,
  columns,
  members,
  maxTasks = 8,
}: GenerateInput): Promise<GenerateResult> {
  // Simulate latency for a believable "thinking" affordance.
  await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));

  const trimmed = goal.trim();
  const themes = detectThemes(trimmed);
  // Pull steps from each theme, weighted, then dedupe by title.
  const weights = themes.slice(0, 3).map((t, i) => ({ ...t, take: i === 0 ? 5 : i === 1 ? 3 : 2 }));
  const seen = new Set<string>();
  type Step = Recipe["steps"][number] & { domain: Domain };
  const steps: Step[] = [];
  for (const w of weights) {
    const recipe = RECIPES[w.domain];
    for (const s of recipe.steps) {
      if (steps.filter((x) => x.domain === w.domain).length >= w.take) break;
      const key = s.title.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      steps.push({ ...s, domain: w.domain });
    }
  }
  // Sort by phase (so the earliest phases land in earliest columns).
  steps.sort((a, b) => a.phase - b.phase);
  const limited = steps.slice(0, Math.max(3, maxTasks));

  // Personalize titles by injecting goal context.
  const subject = extractSubject(trimmed);
  const tasks: GeneratedTask[] = limited.map((s) => {
    const column = pickColumn(columns, s.phase);
    const tagged = subject
      ? s.title.replace(/\b(launch|feature|product|initiative|campaign|study|process)\b/i, subject)
      : s.title;
    const title = titleize(tagged);

    let assigneeId: string | undefined;
    let rationale: string | undefined;
    if (members.length > 0) {
      const ranked = members
        .map((m) => ({ m, ...scoreMember(m, s.tags) }))
        .sort((a, b) => b.score - a.score);
      const top = ranked[0];
      if (top.score > 0.5) {
        assigneeId = top.m.id;
        rationale = top.reasons.length
          ? top.reasons.slice(0, 2).join(" · ")
          : `${top.m.role} has bandwidth (capacity ${top.m.capacity}/10)`;
      }
    }

    return {
      id: uid("t"),
      title,
      detail: undefined,
      columnId: column.id,
      priority: s.priority,
      assigneeId,
      estimateHours: s.estimate,
      tags: s.tags,
      ai: true,
      rationale,
      createdAt: Date.now(),
    };
  });

  const summary =
    tasks.length === 0
      ? "I couldn't find enough signal in that goal — try adding a domain or outcome."
      : `Drafted ${tasks.length} tasks across ${themes.slice(0, 3).map((t) => t.domain).join(", ")} themes. Adjust priorities, reassign, or regenerate.`;

  return {
    tasks,
    themes: themes.slice(0, 4).map((t) => ({ label: t.domain, weight: t.signal })),
    summary,
  };
}

function extractSubject(s: string) {
  // Pull the most distinctive noun-ish word from the goal to personalize titles.
  const stop = new Set([
    "the", "a", "an", "to", "for", "of", "and", "with", "that", "this", "we", "our", "i",
    "build", "make", "ship", "launch", "create", "want", "need", "should", "plan", "do",
    "new", "next", "in", "on", "by", "is", "are", "be", "have",
  ]);
  const words = s.toLowerCase().match(/[a-z][a-z0-9-]+/g) ?? [];
  const cand = words.find((w) => !stop.has(w) && w.length > 3);
  return cand ? cand : "";
}

// Suggest a member for a single task — used in the manual reassign UI.
export function suggestAssignment(task: Pick<Task, "tags" | "title">, members: Member[]) {
  const tags = task.tags.length ? task.tags : task.title.toLowerCase().split(" ");
  const ranked = members
    .map((m) => ({ m, ...scoreMember(m, tags) }))
    .sort((a, b) => b.score - a.score);
  return ranked[0];
}
