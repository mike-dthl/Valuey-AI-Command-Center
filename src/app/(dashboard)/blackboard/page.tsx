"use client";

import { EventQueue } from "@/components/blackboard/event-queue";
import { CreateEventDialog } from "@/components/blackboard/create-event-dialog";

export default function BlackboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Blackboard</h2>
          <p className="text-sm text-muted-foreground">
            Event Queue — Inter-Team-Kommunikation
          </p>
        </div>
        <CreateEventDialog />
      </div>
      <EventQueue />
    </div>
  );
}
