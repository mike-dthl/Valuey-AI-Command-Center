-- =============================================
-- Phase 8: Performance Indexes
-- =============================================
-- Add indexes on foreign key columns and frequently filtered columns

-- Agents
CREATE INDEX IF NOT EXISTS idx_agents_team_id ON agents(team_id);

-- Tasks
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_agent_id ON tasks(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Conversations
CREATE INDEX IF NOT EXISTS idx_conversations_agent_id ON conversations(agent_id);

-- Messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);

-- Usage Logs
CREATE INDEX IF NOT EXISTS idx_usage_logs_agent_id ON usage_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at);

-- Notifications (composite for unread queries)
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);

-- Workflow Runs
CREATE INDEX IF NOT EXISTS idx_workflow_runs_workflow_id ON workflow_runs(workflow_id);

-- Blackboard Events
CREATE INDEX IF NOT EXISTS idx_blackboard_events_source_team ON blackboard_events(source_team_id);
CREATE INDEX IF NOT EXISTS idx_blackboard_events_status ON blackboard_events(status);

-- Revenue Entries
CREATE INDEX IF NOT EXISTS idx_revenue_entries_date ON revenue_entries(date);

-- Agent Tasks
CREATE INDEX IF NOT EXISTS idx_agent_tasks_agent_id ON agent_tasks(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_project_id ON agent_tasks(project_id);

-- Projects
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
