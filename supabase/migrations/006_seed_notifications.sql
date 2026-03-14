-- =============================================
-- Phase 7: Seed Notifications + Realtime
-- =============================================

-- Enable Realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Seed notifications (recent activity)
INSERT INTO notifications (user_id, title, message, type, source_type, source_id, read, created_at) VALUES
  ((SELECT id FROM profiles LIMIT 1), 'Agent "Writer" hat Task abgeschlossen', 'Blog Draft: AI Trends 2026 ist fertig', 'success', 'agent_task', NULL, false, NOW() - INTERVAL '5 minutes'),
  ((SELECT id FROM profiles LIMIT 1), 'Neues Blackboard Event', 'deal_closed: Acme Corp — Website Redesign', 'urgent', 'blackboard', NULL, false, NOW() - INTERVAL '12 minutes'),
  ((SELECT id FROM profiles LIMIT 1), 'Workflow "Content Pipeline" abgeschlossen', '4/4 Steps erfolgreich', 'info', 'workflow', NULL, false, NOW() - INTERVAL '1 hour'),
  ((SELECT id FROM profiles LIMIT 1), 'Neuer Client registriert', 'TechStart GmbH wurde als Lead hinzugefügt', 'info', 'client', NULL, true, NOW() - INTERVAL '3 hours'),
  ((SELECT id FROM profiles LIMIT 1), 'Agent "Developer" meldet Fehler', 'API Rate Limit erreicht — Retry in 60s', 'warning', 'agent', NULL, false, NOW() - INTERVAL '30 minutes'),
  ((SELECT id FROM profiles LIMIT 1), 'Projekt-Milestone erreicht', 'Website Redesign: Phase 1 abgeschlossen', 'success', 'project', NULL, true, NOW() - INTERVAL '1 day'),
  ((SELECT id FROM profiles LIMIT 1), 'Monatlicher Report bereit', 'Februar 2026 Analytics Report verfügbar', 'info', 'analytics', NULL, true, NOW() - INTERVAL '2 days'),
  ((SELECT id FROM profiles LIMIT 1), 'Agent "Qualifier" hat Lead qualifiziert', 'DataFlow AG — Score: 85/100, Budget: €50k+', 'success', 'agent_task', NULL, false, NOW() - INTERVAL '45 minutes');
