export type Priority = "low" | "med" | "high" | "urgent";

export type Member = {
  id: string;
  name: string;
  initials: string;
  role: string;
  hue: number; // 0-360 for avatar tint
  capacity: number; // 1-10
};

export type Task = {
  id: string;
  title: string;
  detail?: string;
  columnId: string;
  priority: Priority;
  assigneeId?: string;
  estimateHours?: number;
  tags: string[];
  ai?: boolean; // marker for AI-generated
  rationale?: string; // AI rationale for assignment
  createdAt: number;
};

export type Column = {
  id: string;
  name: string;
  hint?: string;
  tone: "neutral" | "amber" | "emerald" | "azure" | "plum";
};

export type Workflow = {
  id: string;
  name: string;
  description: string;
  columns: Column[];
  tasks: Task[];
  members: Member[];
  createdAt: number;
};

export type WorkflowTemplate = {
  id: string;
  name: string;
  blurb: string;
  domain: string;
  columns: Omit<Column, "id">[];
  starterTasks?: { title: string; detail?: string; columnIndex: number; priority: Priority; tags: string[] }[];
  defaultMembers?: Omit<Member, "id">[];
};
