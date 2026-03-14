-- =============================================
-- Phase 3: Seed Clients, Projects & Tasks
-- =============================================

-- Enable Realtime for Phase 3 tables
ALTER PUBLICATION supabase_realtime ADD TABLE clients;
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;

-- =============================================
-- Clients
-- =============================================

INSERT INTO clients (id, name, email, company, phone, notes, status) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Acme Corp', 'john@acme.com', 'Acme Corp', '+49 30 12345678', 'Langjähriger Kunde, seit 2023. Hauptfokus auf AI-Integration und digitale Transformation.', 'active'),
  ('c1000000-0000-0000-0000-000000000002', 'Startup XYZ', 'maria@xyz.de', 'XYZ GmbH', '+49 89 98765432', 'Junges AI-Startup aus München. Interessiert an Content-Marketing und Lead-Generierung.', 'active'),
  ('c1000000-0000-0000-0000-000000000003', 'Tech Solutions', 'info@techsol.de', 'TechSol AG', '+49 40 55566677', 'Eingehender Lead über LinkedIn. Erstgespräch geplant.', 'lead'),
  ('c1000000-0000-0000-0000-000000000004', 'Digital Agency', 'hello@digiag.com', 'DigiAg', '+49 69 11122233', 'Partneragentur. Gemeinsame Projekte im Bereich AI-Automation.', 'active'),
  ('c1000000-0000-0000-0000-000000000005', 'E-Commerce Plus', 'ceo@ecp.io', 'ECP Ltd', '+49 711 44455566', 'Projekt Q1 abgeschlossen. Derzeit keine aktiven Projekte.', 'inactive');

-- =============================================
-- Projects
-- =============================================

INSERT INTO projects (id, client_id, name, description, status, budget, deadline) VALUES
  ('p2000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Website Redesign', 'Komplettes Redesign der Firmenwebsite mit AI-Integration und neuem Branding.', 'active', 25000, '2026-06-30'),
  ('p2000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Content-Strategie Q2', 'Quartalsplanung für Content-Marketing: Blog, LinkedIn, Newsletter.', 'planning', 8000, '2026-04-15'),
  ('p2000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000002', 'Blog & Social Media', 'Aufbau eines Content-Funnels über Blog-Artikel und Social Media Kampagnen.', 'active', 12000, '2026-05-31'),
  ('p2000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004', 'Social Media Kampagne', 'Multi-Channel Kampagne: LinkedIn, Instagram, Twitter/X für Q2 Launch.', 'active', 15000, '2026-05-15'),
  ('p2000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000004', 'AI Automation Pipeline', 'Automatisierung interner Prozesse mit AI-Agenten und Workflow-System.', 'active', 30000, '2026-08-31'),
  ('p2000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000004', 'Onboarding System', 'Onboarding-Dokumente und Prozess-Automatisierung für Neukunden.', 'completed', 5000, '2026-02-28'),
  ('p2000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000005', 'Rechnung & Reporting Q1', 'Quartalsabrechnung und Performance-Reporting.', 'completed', 3000, '2026-03-31');

-- =============================================
-- Tasks (Kanban)
-- =============================================

INSERT INTO tasks (id, project_id, assigned_agent_id, title, description, status, priority, position, due_date) VALUES
  -- Planning column
  ('t3000000-0000-0000-0000-000000000001', 'p2000000-0000-0000-0000-000000000002',
    (SELECT id FROM agents WHERE name = 'Planner' LIMIT 1),
    'Content-Strategie Q2', 'Themen-Recherche und Quartalsplanung für alle Content-Kanäle.', 'todo', 'high', 0, '2026-04-01'),

  ('t3000000-0000-0000-0000-000000000002', 'p2000000-0000-0000-0000-000000000005',
    (SELECT id FROM agents WHERE name = 'Planner' LIMIT 1),
    'Workflow-Architektur', 'Technische Spezifikation für die AI Automation Pipeline.', 'todo', 'medium', 1, '2026-04-15'),

  -- In Progress column
  ('t3000000-0000-0000-0000-000000000003', 'p2000000-0000-0000-0000-000000000001',
    (SELECT id FROM agents WHERE name = 'Developer' LIMIT 1),
    'Website Redesign', 'Frontend-Entwicklung: neue Landing Page mit AI-Features.', 'in_progress', 'high', 0, '2026-05-01'),

  ('t3000000-0000-0000-0000-000000000004', 'p2000000-0000-0000-0000-000000000003',
    (SELECT id FROM agents WHERE name = 'Writer' LIMIT 1),
    'Blog Artikel Serie', '3 Blog-Artikel über AI-Trends im B2B-Marketing.', 'in_progress', 'medium', 1, '2026-04-10'),

  ('t3000000-0000-0000-0000-000000000005', 'p2000000-0000-0000-0000-000000000003',
    (SELECT id FROM agents WHERE name = 'Qualifier' LIMIT 1),
    'Lead-Analyse Startup XYZ', 'Detaillierte Lead-Bewertung und Upselling-Potenzial.', 'in_progress', 'medium', 2, '2026-04-05'),

  -- Review column
  ('t3000000-0000-0000-0000-000000000006', 'p2000000-0000-0000-0000-000000000004',
    (SELECT id FROM agents WHERE name = 'Reviewer' LIMIT 1),
    'Social Media Kampagne', 'Review der Kampagnen-Assets und Copy für LinkedIn/Instagram.', 'review', 'low', 0, '2026-04-08'),

  ('t3000000-0000-0000-0000-000000000007', 'p2000000-0000-0000-0000-000000000005',
    (SELECT id FROM agents WHERE name = 'Reviewer' LIMIT 1),
    'API Integration Review', 'Code-Review der Webhook-Integration und Error-Handling.', 'review', 'high', 1, '2026-04-12'),

  -- Done column
  ('t3000000-0000-0000-0000-000000000008', 'p2000000-0000-0000-0000-000000000006',
    (SELECT id FROM agents WHERE name = 'Client Communicator' LIMIT 1),
    'Onboarding Dokumente', 'Erstellung der Onboarding-Dokumentation für Neukunden.', 'done', 'medium', 0, '2026-02-15'),

  ('t3000000-0000-0000-0000-000000000009', 'p2000000-0000-0000-0000-000000000007',
    (SELECT id FROM agents WHERE name = 'Finance Agent' LIMIT 1),
    'Rechnung Q1', 'Quartalsabrechnung erstellen und an Kunden versenden.', 'done', 'low', 1, '2026-03-15'),

  ('t3000000-0000-0000-0000-000000000010', 'p2000000-0000-0000-0000-000000000001',
    (SELECT id FROM agents WHERE name = 'Researcher' LIMIT 1),
    'Wettbewerbsanalyse', 'Analyse der Top-5 Wettbewerber im AI-Agency Bereich.', 'done', 'medium', 2, '2026-03-01');
