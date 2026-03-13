import type { BlackboardEvent, Team, Agent } from "./database";

export type BlackboardEventWithRelations = BlackboardEvent & {
  source_team: Team | null;
  target_team: Team | null;
  source_agent: Agent | null;
};

export type EventFilterState = {
  priority: string | null;
  status: string | null;
  team: string | null;
};
