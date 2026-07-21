import type { Priority, Task } from '../types';
import { codiux } from './codiuxClient';

export function taskToRow(task: Partial<Task> & { title: string }, userId?: string) {
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? '',
    status_id: task.statusId ?? 'todo',
    tag_ids: task.tagIds ?? [],
    priority: task.priority ?? 'medium',
    due_date: task.dueDate ?? null,
    task_order: task.order ?? 0,
    archived: task.archived ?? false,
    payload: {
      checklist: (task as Task).checklist ?? [],
      attachments: (task as Task).attachments ?? [],
      comments: (task as Task).comments ?? [],
    },
    user_id: userId ?? null,
    updated_at: new Date().toISOString(),
  };
}

export function rowToTask(row: Record<string, unknown>): Task {
  const payload = (row.payload ?? {}) as Record<string, unknown>;
  return {
    id: String(row.id),
    title: String(row.title ?? ''),
    description: String(row.description ?? ''),
    statusId: String(row.status_id ?? 'todo'),
    tagIds: Array.isArray(row.tag_ids) ? (row.tag_ids as string[]) : [],
    priority: (String(row.priority ?? 'medium') as Priority),
    dueDate: row.due_date ? String(row.due_date) : null,
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
    order: Number(row.task_order ?? 0),
    archived: Boolean(row.archived),
    checklist: (payload.checklist as Task['checklist']) ?? [],
    attachments: (payload.attachments as Task['attachments']) ?? [],
    comments: (payload.comments as Task['comments']) ?? [],
  };
}

export async function fetchTasks(): Promise<Task[]> {
  const { data } = await codiux.db.from('tm_tasks').select('*');
  return data.map(rowToTask).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function insertTask(task: Task, userId?: string): Promise<Task> {
  const result = await codiux.db.from('tm_tasks').insert(taskToRow(task, userId));
  return rowToTask((result as { row?: Record<string, unknown> }).row ?? taskToRow(task, userId));
}

export async function updateTaskRow(task: Task, userId?: string): Promise<Task> {
  await codiux.db.from('tm_tasks').update(taskToRow(task, userId), { id: task.id });
  return task;
}

export async function deleteTaskRow(id: string): Promise<void> {
  await codiux.db.from('tm_tasks').delete({ id });
}

export async function uploadTaskAttachment(taskId: string, file: File) {
  const path = `tasks/${taskId}/${file.name}`;
  return codiux.storage.upload(path, file, { bucket: 'uploads' });
}
