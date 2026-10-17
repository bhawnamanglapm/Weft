import { describe, expect, it } from "vitest";
import { applyReview } from "./review";
import { merge } from "../reconstruct/merge";
import { segment } from "../reconstruct/segment";
import { classify } from "../reconstruct/classify";
import type { CapturedEvent, Session } from "../types";

let n = 0;
function event(label: string, overrides: Partial<CapturedEvent> = {}): CapturedEvent {
  n += 1;
  return {
    id: `e${n}`,
    ts: n * 1_000,
    type: "click",
    domain: "crm.internal",
    urlPath: "/customers",
    element: { role: "link", label, tag: "a" },
    ...overrides,
  };
}

// One step on /customers whose clicks carry two customer names, then a
// separate step on /orders.
function recordedSession(): Session {
  const session: Session = {
    id: "s1",
    workflowId: "w1",
    startedAt: 0,
    endedAt: 10_000,
    events: [event("Asha Verma"), event("Rahul Sharma"), event("Open order", { urlPath: "/orders" })],
  };
  session.steps = classify(segment(session));
  return session;
}

const allText = (session: Session) => JSON.stringify(session);

describe("applyReview", () => {
  it("removes a label the user redacted from the stored raw events, not just the step", () => {
    const session = recordedSession();
    const nameStep = session.steps![0];
    expect(nameStep.label).toBe("Rahul Sharma");

    const reviewed = applyReview(session, { [nameStep.id]: "[redacted]" });

    expect(reviewed.steps![0].label).toBe("[redacted]");
    expect(allText(reviewed)).not.toContain("Rahul Sharma");
  });

  it("drops event text the preview never showed (only the step's one label is shown)", () => {
    const reviewed = applyReview(recordedSession(), {});
    // "Asha Verma" was a click inside the first step; the preview showed only "Rahul Sharma".
    expect(allText(reviewed)).not.toContain("Asha Verma");
    expect(reviewed.steps![0].label).toBe("Rahul Sharma");
  });

  it("keeps the merged map consistent with what the user confirmed", () => {
    const session = recordedSession();
    const reviewed = applyReview(session, { [session.steps![0].id]: "Open customer" });

    const labels = merge([reviewed]).nodes.map((node) => node.label);
    expect(labels).toContain("Open customer");
    expect(labels).not.toContain("Rahul Sharma");
  });

  it("does not change how the session splits into steps or how steps are classified", () => {
    const session = recordedSession();
    const reviewed = applyReview(session, {});
    const again = classify(segment(reviewed));

    expect(again.map((s) => [s.id, s.label, s.signature, s.events.length])).toEqual(
      session.steps!.map((s) => [s.id, s.label, s.signature, s.events.length])
    );
    expect(reviewed.events).toHaveLength(session.events.length);
  });

  it("marks the session reviewed and leaves a session without steps unlabelled", () => {
    const session: Session = { id: "s2", workflowId: "w1", startedAt: 0, events: [event("Asha Verma")] };
    const reviewed = applyReview(session, {});
    expect(reviewed.reviewed).toBe(true);
    expect(allText(reviewed)).not.toContain("Asha Verma");
  });
});
