-- =============================================
-- Phase 4: Seed Workflows + Enable Realtime
-- =============================================

-- Enable Realtime for workflow tables
ALTER PUBLICATION supabase_realtime ADD TABLE workflows;
ALTER PUBLICATION supabase_realtime ADD TABLE workflow_runs;

-- =============================================
-- Workflows with ReactFlow node/edge format
-- =============================================

INSERT INTO workflows (id, name, description, trigger_type, trigger_config, steps, is_active) VALUES
(
  'w4000000-0000-0000-0000-000000000001',
  'Content Pipeline',
  'Vollständige Content-Erstellung: Recherche → Texterstellung → Multi-Format → Veröffentlichung',
  'manual',
  '{}',
  '{
    "nodes": [
      { "id": "trigger-1", "type": "trigger", "position": { "x": 50, "y": 150 }, "data": { "label": "Start", "triggerType": "manual" } },
      { "id": "agent-1", "type": "agent", "position": { "x": 300, "y": 150 }, "data": { "agentName": "Researcher", "label": "Researcher" } },
      { "id": "agent-2", "type": "agent", "position": { "x": 550, "y": 150 }, "data": { "agentName": "Writer", "label": "Writer" } },
      { "id": "agent-3", "type": "agent", "position": { "x": 800, "y": 100 }, "data": { "agentName": "Repurposer", "label": "Repurposer" } },
      { "id": "agent-4", "type": "agent", "position": { "x": 800, "y": 250 }, "data": { "agentName": "Scheduler", "label": "Scheduler" } },
      { "id": "output-1", "type": "output", "position": { "x": 1050, "y": 150 }, "data": { "label": "Fertig" } }
    ],
    "edges": [
      { "id": "e-t-1", "source": "trigger-1", "target": "agent-1", "animated": true },
      { "id": "e-1-2", "source": "agent-1", "target": "agent-2", "animated": true },
      { "id": "e-2-3", "source": "agent-2", "target": "agent-3", "animated": true },
      { "id": "e-2-4", "source": "agent-2", "target": "agent-4", "animated": true },
      { "id": "e-3-o", "source": "agent-3", "target": "output-1", "animated": true },
      { "id": "e-4-o", "source": "agent-4", "target": "output-1", "animated": true }
    ]
  }',
  true
),
(
  'w4000000-0000-0000-0000-000000000002',
  'Lead Qualification',
  'Automatische Lead-Identifikation, Bewertung und personalisierte Ansprache',
  'scheduled',
  '{"schedule": "0 9 * * 1-5"}',
  '{
    "nodes": [
      { "id": "trigger-1", "type": "trigger", "position": { "x": 50, "y": 150 }, "data": { "label": "Start", "triggerType": "scheduled" } },
      { "id": "agent-1", "type": "agent", "position": { "x": 300, "y": 150 }, "data": { "agentName": "Prospector", "label": "Prospector" } },
      { "id": "agent-2", "type": "agent", "position": { "x": 550, "y": 150 }, "data": { "agentName": "Qualifier", "label": "Qualifier" } },
      { "id": "agent-3", "type": "agent", "position": { "x": 800, "y": 150 }, "data": { "agentName": "Outreach-Writer", "label": "Outreach-Writer" } },
      { "id": "output-1", "type": "output", "position": { "x": 1050, "y": 150 }, "data": { "label": "Fertig" } }
    ],
    "edges": [
      { "id": "e-t-1", "source": "trigger-1", "target": "agent-1", "animated": true },
      { "id": "e-1-2", "source": "agent-1", "target": "agent-2", "animated": true },
      { "id": "e-2-3", "source": "agent-2", "target": "agent-3", "animated": true },
      { "id": "e-3-o", "source": "agent-3", "target": "output-1", "animated": true }
    ]
  }',
  true
),
(
  'w4000000-0000-0000-0000-000000000003',
  'Client Onboarding',
  'Automatisierter Onboarding-Prozess für Neukunden',
  'event',
  '{"event": "client.created"}',
  '{
    "nodes": [
      { "id": "trigger-1", "type": "trigger", "position": { "x": 50, "y": 150 }, "data": { "label": "Start", "triggerType": "event" } },
      { "id": "agent-1", "type": "agent", "position": { "x": 300, "y": 150 }, "data": { "agentName": "Project Manager", "label": "Project Manager" } },
      { "id": "agent-2", "type": "agent", "position": { "x": 550, "y": 150 }, "data": { "agentName": "Client Communicator", "label": "Client Communicator" } },
      { "id": "agent-3", "type": "agent", "position": { "x": 800, "y": 150 }, "data": { "agentName": "Finance Agent", "label": "Finance Agent" } },
      { "id": "output-1", "type": "output", "position": { "x": 1050, "y": 150 }, "data": { "label": "Fertig" } }
    ],
    "edges": [
      { "id": "e-t-1", "source": "trigger-1", "target": "agent-1", "animated": true },
      { "id": "e-1-2", "source": "agent-1", "target": "agent-2", "animated": true },
      { "id": "e-2-3", "source": "agent-2", "target": "agent-3", "animated": true },
      { "id": "e-3-o", "source": "agent-3", "target": "output-1", "animated": true }
    ]
  }',
  true
),
(
  'w4000000-0000-0000-0000-000000000004',
  'Code Review Pipeline',
  'Feature-Planung, Implementierung und Code-Review',
  'manual',
  '{}',
  '{
    "nodes": [
      { "id": "trigger-1", "type": "trigger", "position": { "x": 50, "y": 150 }, "data": { "label": "Start", "triggerType": "manual" } },
      { "id": "agent-1", "type": "agent", "position": { "x": 300, "y": 150 }, "data": { "agentName": "Planner", "label": "Planner" } },
      { "id": "agent-2", "type": "agent", "position": { "x": 550, "y": 150 }, "data": { "agentName": "Developer", "label": "Developer" } },
      { "id": "agent-3", "type": "agent", "position": { "x": 800, "y": 150 }, "data": { "agentName": "Reviewer", "label": "Reviewer" } },
      { "id": "output-1", "type": "output", "position": { "x": 1050, "y": 150 }, "data": { "label": "Fertig" } }
    ],
    "edges": [
      { "id": "e-t-1", "source": "trigger-1", "target": "agent-1", "animated": true },
      { "id": "e-1-2", "source": "agent-1", "target": "agent-2", "animated": true },
      { "id": "e-2-3", "source": "agent-2", "target": "agent-3", "animated": true },
      { "id": "e-3-o", "source": "agent-3", "target": "output-1", "animated": true }
    ]
  }',
  false
);

-- Seed some workflow runs
INSERT INTO workflow_runs (workflow_id, status, steps_completed, results, started_at, completed_at) VALUES
  ('w4000000-0000-0000-0000-000000000001', 'completed', 4, '["Recherche abgeschlossen", "Artikel erstellt", "Carousel generiert", "Post geplant"]', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 45 minutes'),
  ('w4000000-0000-0000-0000-000000000001', 'completed', 4, '["Trend-Analyse", "Blog-Post", "Twitter Thread", "Veröffentlicht"]', NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours'),
  ('w4000000-0000-0000-0000-000000000002', 'completed', 3, '["5 Leads identifiziert", "3 qualifiziert", "E-Mails gesendet"]', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '5 hours 30 minutes'),
  ('w4000000-0000-0000-0000-000000000003', 'completed', 3, '["Projekt angelegt", "Welcome-Mail gesendet", "Rechnung erstellt"]', NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours 50 minutes'),
  ('w4000000-0000-0000-0000-000000000004', 'failed', 2, '["Spec erstellt", "Code implementiert"]', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days 23 hours');
