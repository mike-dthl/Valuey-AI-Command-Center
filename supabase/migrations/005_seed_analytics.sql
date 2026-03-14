-- =============================================
-- Phase 5/6: Seed Analytics Data
-- =============================================

-- Usage logs (simulated API usage over last 30 days)
INSERT INTO usage_logs (agent_id, action_type, tokens_input, tokens_output, cost, model, created_at) VALUES
  ((SELECT id FROM agents WHERE name = 'Writer' LIMIT 1), 'chat', 1200, 3500, 0.0567, 'claude-sonnet-4-20250514', NOW() - INTERVAL '1 day'),
  ((SELECT id FROM agents WHERE name = 'Writer' LIMIT 1), 'chat', 800, 2800, 0.0444, 'claude-sonnet-4-20250514', NOW() - INTERVAL '2 days'),
  ((SELECT id FROM agents WHERE name = 'Researcher' LIMIT 1), 'chat', 2000, 1500, 0.0285, 'claude-sonnet-4-20250514', NOW() - INTERVAL '1 day'),
  ((SELECT id FROM agents WHERE name = 'Researcher' LIMIT 1), 'chat', 1800, 2200, 0.0384, 'claude-sonnet-4-20250514', NOW() - INTERVAL '3 days'),
  ((SELECT id FROM agents WHERE name = 'Qualifier' LIMIT 1), 'chat', 600, 1200, 0.0198, 'claude-sonnet-4-20250514', NOW() - INTERVAL '2 days'),
  ((SELECT id FROM agents WHERE name = 'Developer' LIMIT 1), 'chat', 3000, 5000, 0.084, 'claude-sonnet-4-20250514', NOW() - INTERVAL '1 day'),
  ((SELECT id FROM agents WHERE name = 'Developer' LIMIT 1), 'chat', 2500, 4500, 0.075, 'claude-sonnet-4-20250514', NOW() - INTERVAL '4 days'),
  ((SELECT id FROM agents WHERE name = 'Reviewer' LIMIT 1), 'chat', 4000, 2000, 0.042, 'claude-sonnet-4-20250514', NOW() - INTERVAL '3 days'),
  ((SELECT id FROM agents WHERE name = 'Project Manager' LIMIT 1), 'chat', 1000, 2000, 0.033, 'claude-sonnet-4-20250514', NOW() - INTERVAL '5 days'),
  ((SELECT id FROM agents WHERE name = 'Planner' LIMIT 1), 'chat', 1500, 3000, 0.0495, 'claude-sonnet-4-20250514', NOW() - INTERVAL '2 days'),
  ((SELECT id FROM agents WHERE name = 'Outreach-Writer' LIMIT 1), 'chat', 500, 1500, 0.024, 'claude-sonnet-4-20250514', NOW() - INTERVAL '6 days'),
  ((SELECT id FROM agents WHERE name = 'Repurposer' LIMIT 1), 'chat', 900, 2500, 0.0402, 'claude-sonnet-4-20250514', NOW() - INTERVAL '7 days'),
  ((SELECT id FROM agents WHERE name = 'Writer' LIMIT 1), 'chat', 1100, 3200, 0.0513, 'claude-sonnet-4-20250514', NOW() - INTERVAL '8 days'),
  ((SELECT id FROM agents WHERE name = 'Developer' LIMIT 1), 'chat', 2800, 4800, 0.0804, 'claude-sonnet-4-20250514', NOW() - INTERVAL '10 days'),
  ((SELECT id FROM agents WHERE name = 'Finance Agent' LIMIT 1), 'chat', 700, 1800, 0.0291, 'claude-sonnet-4-20250514', NOW() - INTERVAL '12 days');

-- Revenue entries (last 6 months)
INSERT INTO revenue_entries (client_id, project_id, amount, description, date, type) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'p2000000-0000-0000-0000-000000000001', 8500, 'Website Redesign - Milestone 1', '2026-01-15', 'income'),
  ('c1000000-0000-0000-0000-000000000001', 'p2000000-0000-0000-0000-000000000001', 8500, 'Website Redesign - Milestone 2', '2026-02-15', 'income'),
  ('c1000000-0000-0000-0000-000000000001', 'p2000000-0000-0000-0000-000000000002', 4000, 'Content-Strategie Q1', '2026-01-20', 'income'),
  ('c1000000-0000-0000-0000-000000000002', 'p2000000-0000-0000-0000-000000000003', 6000, 'Blog & Social Media - Monat 1', '2026-02-01', 'income'),
  ('c1000000-0000-0000-0000-000000000002', 'p2000000-0000-0000-0000-000000000003', 6000, 'Blog & Social Media - Monat 2', '2026-03-01', 'income'),
  ('c1000000-0000-0000-0000-000000000004', 'p2000000-0000-0000-0000-000000000004', 7500, 'Social Media Kampagne - Setup', '2026-02-10', 'income'),
  ('c1000000-0000-0000-0000-000000000004', 'p2000000-0000-0000-0000-000000000005', 10000, 'AI Automation - Phase 1', '2026-01-25', 'income'),
  ('c1000000-0000-0000-0000-000000000004', 'p2000000-0000-0000-0000-000000000005', 10000, 'AI Automation - Phase 2', '2026-03-10', 'income'),
  ('c1000000-0000-0000-0000-000000000004', 'p2000000-0000-0000-0000-000000000006', 5000, 'Onboarding System', '2026-02-28', 'income'),
  ('c1000000-0000-0000-0000-000000000005', 'p2000000-0000-0000-0000-000000000007', 3000, 'Reporting Q1', '2026-03-15', 'income'),
  (NULL, NULL, 150, 'Claude API Kosten Januar', '2026-01-31', 'expense'),
  (NULL, NULL, 185, 'Claude API Kosten Februar', '2026-02-28', 'expense'),
  (NULL, NULL, 210, 'Claude API Kosten März', '2026-03-14', 'expense');
