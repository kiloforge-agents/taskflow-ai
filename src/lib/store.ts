"use client";

import { useCallback, useEffect, useState } from "react";
import { TEMPLATES } from "./templates";
import type { Column, Member, Task, Workflow, WorkflowTemplate } from "./types";

const STORAGE_KEY = "taskflowai.state.v1";

type State = {
  workflows: Workflow[];
  activeId: string | null;
};

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-3)}`;
}

function workflowFromTemplate(tpl: WorkflowTemplate, name?: string): Workflow {
  const columns: Column[] = tpl.columns.map((c) => ({ id: uid("c"), ...c }));
  const members: Member[] = (tpl.defaultMembers ?? []).map((m) => ({ id: uid("m"), ...m }));
  const tasks: Task[] = (tpl.starterTasks ?? []).map((s) => ({
    id: uid("t"),
    title: s.title,
    detail: s.detail,
    columnId: columns[s.columnIndex]?.id ?? columns[0].id,
    priority: s.priority,
    tags: s.tags,
    createdAt: Date.now(),
  }));
  return {
    id: uid("w"),
    name: name?.trim() || tpl.name,
    description: tpl.blurb,
    columns,
    members,
    tasks,
    createdAt: Date.now(),
  };
}

function seedDefault(): State {
  const tpl = TEMPLATES.find((t) => t.id === "product-launch")!;
  const wf = workflowFromTemplate(tpl, "Q3 Product Launch");
  // Add a few realistic starter tasks across columns
  const cols = wf.columns;
  const seedTasks: Omit<Task, "id" | "createdAt">[] = [
    { title: "Define launch scope and success metrics", columnId: cols[1].id, priority: "high", tags: ["spec", "kickoff"], assigneeId: wf.members[0]?.id },
    { title: "Spec API contract for activity feed", columnId: cols[2].id, priority: "high", tags: ["backend", "api"], assigneeId: wf.members[1]?.id, estimateHours: 4 },
    { title: "Hi-fi mock for empty state", columnId: cols[2].id, priority: "med", tags: ["design"], assigneeId: wf.members[2]?.id, estimateHours: 6 },
    { title: "Draft launch announcement post", columnId: cols[0].id, priority: "med", tags: ["marketing", "content"] },
    { title: "Final QA pass on onboarding", columnId: cols[3].id, priority: "high", tags: ["qa"] },
    { title: "Migrate v1 settings flow", columnId: cols[4].id, priority: "low", tags: ["frontend"] },
  ];
  wf.tasks = seedTasks.map((t) => ({ ...t, id: uid("t"), createdAt: Date.now() - Math.floor(Math.random() * 1e7) }));
  return { workflows: [wf], activeId: wf.id };
}

function loadState(): State {
  if (typeof window === "undefined") return { workflows: [], activeId: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedDefault();
    const parsed = JSON.parse(raw) as State;
    if (!parsed.workflows || parsed.workflows.length === 0) return seedDefault();
    return parsed;
  } catch {
    return seedDefault();
  }
}

function saveState(state: State) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function useTaskflow() {
  const [state, setState] = useState<State>({ workflows: [], activeId: null });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const active = state.workflows.find((w) => w.id === state.activeId) ?? state.workflows[0];

  const update = useCallback((updater: (s: State) => State) => {
    setState((s) => updater(s));
  }, []);

  const updateActive = useCallback(
    (updater: (w: Workflow) => Workflow) => {
      setState((s) => ({
        ...s,
        workflows: s.workflows.map((w) => (w.id === s.activeId ? updater(w) : w)),
      }));
    },
    [],
  );

  const createWorkflow = useCallback((tpl: WorkflowTemplate, name?: string) => {
    const wf = workflowFromTemplate(tpl, name);
    setState((s) => ({ workflows: [...s.workflows, wf], activeId: wf.id }));
    return wf.id;
  }, []);

  const switchWorkflow = useCallback((id: string) => {
    setState((s) => ({ ...s, activeId: id }));
  }, []);

  const deleteWorkflow = useCallback((id: string) => {
    setState((s) => {
      const remaining = s.workflows.filter((w) => w.id !== id);
      return {
        workflows: remaining.length ? remaining : seedDefault().workflows,
        activeId: remaining[0]?.id ?? seedDefault().activeId,
      };
    });
  }, []);

  // Task ops
  const addTask = useCallback((task: Omit<Task, "id" | "createdAt">) => {
    updateActive((w) => ({
      ...w,
      tasks: [...w.tasks, { ...task, id: uid("t"), createdAt: Date.now() }],
    }));
  }, [updateActive]);

  const addTasksBulk = useCallback((tasks: Task[]) => {
    updateActive((w) => ({ ...w, tasks: [...w.tasks, ...tasks] }));
  }, [updateActive]);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    updateActive((w) => ({
      ...w,
      tasks: w.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }, [updateActive]);

  const deleteTask = useCallback((id: string) => {
    updateActive((w) => ({ ...w, tasks: w.tasks.filter((t) => t.id !== id) }));
  }, [updateActive]);

  const moveTask = useCallback((id: string, columnId: string) => {
    updateActive((w) => ({
      ...w,
      tasks: w.tasks.map((t) => (t.id === id ? { ...t, columnId } : t)),
    }));
  }, [updateActive]);

  // Column ops
  const addColumn = useCallback((name: string) => {
    updateActive((w) => ({
      ...w,
      columns: [...w.columns, { id: uid("c"), name, tone: "neutral" }],
    }));
  }, [updateActive]);

  const renameColumn = useCallback((id: string, name: string) => {
    updateActive((w) => ({
      ...w,
      columns: w.columns.map((c) => (c.id === id ? { ...c, name } : c)),
    }));
  }, [updateActive]);

  const deleteColumn = useCallback((id: string) => {
    updateActive((w) => {
      if (w.columns.length <= 1) return w;
      const fallback = w.columns.find((c) => c.id !== id)!;
      return {
        ...w,
        columns: w.columns.filter((c) => c.id !== id),
        tasks: w.tasks.map((t) => (t.columnId === id ? { ...t, columnId: fallback.id } : t)),
      };
    });
  }, [updateActive]);

  // Member ops
  const addMember = useCallback((m: Omit<Member, "id">) => {
    updateActive((w) => ({ ...w, members: [...w.members, { ...m, id: uid("m") }] }));
  }, [updateActive]);

  const updateMember = useCallback((id: string, patch: Partial<Member>) => {
    updateActive((w) => ({
      ...w,
      members: w.members.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));
  }, [updateActive]);

  const deleteMember = useCallback((id: string) => {
    updateActive((w) => ({
      ...w,
      members: w.members.filter((m) => m.id !== id),
      tasks: w.tasks.map((t) => (t.assigneeId === id ? { ...t, assigneeId: undefined } : t)),
    }));
  }, [updateActive]);

  const reset = useCallback(() => {
    setState(seedDefault());
  }, []);

  return {
    hydrated,
    state,
    active,
    createWorkflow,
    switchWorkflow,
    deleteWorkflow,
    addTask,
    addTasksBulk,
    updateTask,
    deleteTask,
    moveTask,
    addColumn,
    renameColumn,
    deleteColumn,
    addMember,
    updateMember,
    deleteMember,
    reset,
    update,
  };

  };
}
