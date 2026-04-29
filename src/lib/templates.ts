import type { WorkflowTemplate } from "./types";

export const TEMPLATES: WorkflowTemplate[] = [
  {
    id: "product-launch",
    name: "Product Launch",
    blurb: "Ship a feature from kickoff to release with embedded review gates.",
    domain: "Product",
    columns: [
      { name: "Backlog", hint: "Triaged, not started", tone: "neutral" },
      { name: "In Spec", hint: "Designs & docs", tone: "amber" },
      { name: "Building", hint: "In active dev", tone: "azure" },
      { name: "Review", hint: "Awaiting QA", tone: "plum" },
      { name: "Shipped", hint: "Live", tone: "emerald" },
    ],
    starterTasks: [
      { title: "Define launch scope and success metrics", columnIndex: 1, priority: "high", tags: ["spec", "kickoff"] },
      { title: "Draft go-to-market brief", columnIndex: 0, priority: "med", tags: ["marketing"] },
    ],
    defaultMembers: [
      { name: "Maya Chen", initials: "MC", role: "Product Lead", hue: 24, capacity: 7 },
      { name: "Devon Park", initials: "DP", role: "Engineering", hue: 200, capacity: 8 },
      { name: "Iris Vega", initials: "IV", role: "Design", hue: 320, capacity: 6 },
    ],
  },
  {
    id: "engineering-sprint",
    name: "Engineering Sprint",
    blurb: "Two-week iteration with explicit code-review and deploy stages.",
    domain: "Engineering",
    columns: [
      { name: "Sprint Backlog", hint: "Ready to start", tone: "neutral" },
      { name: "In Progress", hint: "Active work", tone: "azure" },
      { name: "Code Review", hint: "PR open", tone: "amber" },
      { name: "Staging", hint: "Awaiting verify", tone: "plum" },
      { name: "Deployed", hint: "In production", tone: "emerald" },
    ],
    starterTasks: [
      { title: "Refactor authentication middleware", columnIndex: 0, priority: "high", tags: ["backend", "auth"] },
      { title: "Investigate flaky integration test #214", columnIndex: 0, priority: "med", tags: ["bug", "tests"] },
    ],
    defaultMembers: [
      { name: "Ravi Shah", initials: "RS", role: "Backend Engineer", hue: 200, capacity: 8 },
      { name: "Jules Okafor", initials: "JO", role: "Frontend Engineer", hue: 280, capacity: 7 },
      { name: "Sasha Lin", initials: "SL", role: "DevOps", hue: 140, capacity: 6 },
    ],
  },
  {
    id: "marketing-campaign",
    name: "Marketing Campaign",
    blurb: "From insight to publish — content pipeline with copy review.",
    domain: "Marketing",
    columns: [
      { name: "Ideas", hint: "Captured", tone: "neutral" },
      { name: "Drafting", hint: "In writing", tone: "amber" },
      { name: "Edit", hint: "Internal review", tone: "plum" },
      { name: "Scheduled", hint: "Queued for publish", tone: "azure" },
      { name: "Live", hint: "Published", tone: "emerald" },
    ],
    starterTasks: [
      { title: "Audience research: persona deep-dive", columnIndex: 0, priority: "med", tags: ["research"] },
      { title: "Hero blog post outline", columnIndex: 1, priority: "high", tags: ["content", "blog"] },
    ],
    defaultMembers: [
      { name: "Noor Hassan", initials: "NH", role: "Content Lead", hue: 24, capacity: 7 },
      { name: "Tomás Reyes", initials: "TR", role: "Designer", hue: 320, capacity: 6 },
    ],
  },
  {
    id: "research-study",
    name: "User Research",
    blurb: "Recruit, interview, synthesize, and share findings.",
    domain: "Research",
    columns: [
      { name: "Recruit", hint: "Outreach", tone: "neutral" },
      { name: "Interview", hint: "Sessions running", tone: "amber" },
      { name: "Analyze", hint: "Synthesizing", tone: "azure" },
      { name: "Findings", hint: "Reports ready", tone: "emerald" },
    ],
    defaultMembers: [
      { name: "Amelia Brooks", initials: "AB", role: "UX Researcher", hue: 320, capacity: 7 },
      { name: "Kai Mendez", initials: "KM", role: "Product Designer", hue: 24, capacity: 6 },
    ],
  },
  {
    id: "blank",
    name: "Blank Board",
    blurb: "Start from a clean Kanban — three columns, no assumptions.",
    domain: "Custom",
    columns: [
      { name: "To do", tone: "neutral" },
      { name: "Doing", tone: "azure" },
      { name: "Done", tone: "emerald" },
    ],
  },
];
