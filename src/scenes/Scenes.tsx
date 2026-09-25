import React from "react";
import { THEME } from "../theme";
import { CLIENT_NAME } from "../script";
import { CardStack, Chips, Flow, Headline, Lockup, Rise } from "../components/Ui";

/**
 * THIS WEEK'S VISUALS. One entry per line in src/script.ts, same order.
 *
 * HARD RULE: `label` and every card, chip and step is a SHORT VISUAL LABEL.
 * It must never restate the spoken line. The caption already carries the
 * words. When the headline repeats the caption the frame reads as a stutter,
 * and that is the single most common bug in this pipeline.
 *
 * `highlights` are the phrases that get the cyan chip in the caption.
 * Multi-word phrases stay together. Trailing punctuation is handled.
 */

export type Scene = {
  label: string;
  sub?: string;
  highlights: string[];
  visual: React.FC;
};

export const SCENES: Scene[] = [
  {
    label: "Two\nLeads",
    sub: "One gym, one night",
    highlights: ["text back", "down the road"],
    visual: () => <CardStack items={["Lead A: booked", "Lead B: lost"]} />,
  },
  {
    label: "The Gap",
    highlights: ["followed up first"],
    visual: () => <Chips items={["Replied", "Silent"]} />,
  },
  {
    label: "How It Works",
    highlights: ["abandoned enquiry follow up", "friendly message"],
    visual: () => <Flow steps={["Enquiry", "Goes quiet", "Auto nudge"]} />,
  },
  {
    label: "What Good\nLooks Like",
    highlights: ["within minutes", "real person"],
    visual: () => <CardStack items={["Fast reply", "One check in", "Human handoff"]} />,
  },
  {
    label: "The Cost\nOf Silence",
    highlights: ["every quiet enquiry"],
    visual: () => <Chips items={["Lost trial", "Lost member"]} />,
  },
  {
    label: "",
    // The lockup already shows the brand and the client on screen.
    // Highlighting them again in the caption is the duplicate-headline bug.
    highlights: ["local businesses"],
    visual: () => <Lockup client={CLIENT_NAME} />,
  },
  {
    label: "Book Your\nReview",
    sub: "intelligentautomations.ca",
    // The URL is already on screen as the sub. Highlight the offer only.
    highlights: ["free twenty minute"],
    visual: () => (
      <Rise delay={8}>
        <div
          style={{
            fontFamily: THEME.body,
            fontWeight: 700,
            fontSize: 42,
            color: THEME.muted,
          }}
        >
          @intelligentautomation_s
        </div>
      </Rise>
    ),
  },
];

/** Renders label + visual. Nothing here is absolutely positioned, and an
 *  empty label is not rendered at all rather than rendered as a blank box
 *  that eats vertical space and shoves the lockup off centre. */
export const SceneBody: React.FC<{ scene: Scene }> = ({ scene }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 52 }}>
    {scene.label ? (
      <Rise>
        <Headline
          text={scene.label.split("\n").join("\n")}
          sub={scene.sub}
        />
      </Rise>
    ) : null}
    <scene.visual />
  </div>
);
