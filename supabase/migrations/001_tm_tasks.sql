-- Task Manager: persisted tasks on Codiux BaaS tenant Postgres
CREATE TABLE IF NOT EXISTS tm_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL,
  user_id UUID,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status_id TEXT NOT NULL DEFAULT 'todo',
  tag_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  priority TEXT NOT NULL DEFAULT 'medium',
  due_date TIMESTAMPTZ,
  task_order INT NOT NULL DEFAULT 0,
  archived BOOLEAN NOT NULL DEFAULT false,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tm_tasks_project ON tm_tasks (project_id);
CREATE INDEX IF NOT EXISTS idx_tm_tasks_user ON tm_tasks (user_id);
