-- Phase A: Agent Memory + Knowledge Base
-- Phase B: Conversation Ratings + Output Signals

-- A.1: Agent Memories — distilled knowledge per agent
CREATE TABLE agent_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN (
    'client_preference',
    'task_learning',
    'domain_knowledge',
    'workflow_insight',
    'error_pattern'
  )),
  content TEXT NOT NULL,
  source_conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  relevance_score FLOAT DEFAULT 1.0,
  access_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agent_memories_agent ON agent_memories(agent_id);
CREATE INDEX idx_agent_memories_category ON agent_memories(agent_id, category);
CREATE INDEX idx_agent_memories_relevance ON agent_memories(agent_id, relevance_score DESC);

-- A.2: Knowledge Base — team/system-wide knowledge
CREATE TABLE knowledge_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN (
    'client_profile',
    'project_context',
    'industry_knowledge',
    'best_practice',
    'sop'
  )),
  tags TEXT[] DEFAULT '{}',
  source_type TEXT,
  source_id UUID,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_knowledge_tags ON knowledge_entries USING GIN(tags);
CREATE INDEX idx_knowledge_type ON knowledge_entries(entry_type);

-- B.1: Conversation Ratings — explicit feedback
CREATE TABLE conversation_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  feedback_type TEXT CHECK (feedback_type IN (
    'quality', 'accuracy', 'relevance', 'tone', 'completeness'
  )),
  comment TEXT,
  rated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ratings_conversation ON conversation_ratings(conversation_id);
CREATE INDEX idx_ratings_message ON conversation_ratings(message_id);

-- B.1: Output Signals — implicit feedback
CREATE TABLE output_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  signal_type TEXT NOT NULL CHECK (signal_type IN (
    'copied',
    'regenerated',
    'edited',
    'used_in_task',
    'conversation_continued',
    'conversation_ended'
  )),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_signals_message ON output_signals(message_id);

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE agent_memories;
ALTER PUBLICATION supabase_realtime ADD TABLE knowledge_entries;
