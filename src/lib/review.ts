import type { Session } from "../types";
import { applyLabelEdits } from "./privacy-preview";

// Confirms a session the user has reviewed in the privacy preview, so that
// what is stored is exactly what they were shown.
//
// The preview shows one label per step. Editing only `session.steps` is not
// enough: the raw events keep every click's original text, and merge.ts
// rebuilds steps from those raw events, so a label the user redacted would
// reappear on the workflow map. Here every event takes its step's final
// label — the one the user saw or wrote — and any event outside a step keeps
// no label. Segmentation never looks at labels, so the session splits into
// the same steps as before, and segment.ts picks that same label back up.
export function applyReview(session: Session, labelEdits: Record<string, string>): Session {
  const steps = session.steps ? applyLabelEdits(session.steps, labelEdits) : undefined;

  const labelByEventId = new Map<string, string>();
  for (const step of steps ?? []) {
    for (const event of step.events) labelByEventId.set(event.id, step.label);
  }

  const withReviewedLabel = <E extends Session["events"][number]>(event: E): E => ({
    ...event,
    element: { ...event.element, label: labelByEventId.get(event.id) ?? "" },
  });

  return {
    ...session,
    events: session.events.map(withReviewedLabel),
    steps: steps?.map((step) => ({ ...step, events: step.events.map(withReviewedLabel) })),
    reviewed: true,
  };
}
