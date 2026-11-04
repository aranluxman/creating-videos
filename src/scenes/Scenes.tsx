import React from "react";
import { CLIENT_NAME } from "../script";
import { Headline, Lockup, Rise } from "../components/Ui";
import {
  BrowserSite,
  LossList,
  MobileSite,
  QrEnd,
  Versus,
} from "../components/Mocks";

/**
 * THIS WEEK'S VISUALS. One entry per line in src/script.ts, same order (6).
 *
 * Every scene shows a REAL-LOOKING MOMENT from src/components/Mocks.tsx,
 * not a text card:
 *   Versus        hook, two businesses, one wins (always scene 1)
 *   ChatPhone     AI chatbots, abandoned enquiry follow-up,
 *                 missed-call text-back (use the `banner` prop)
 *   CallPhone     voice AI receptionist
 *   PortalLogin   secure member portals
 *   BrowserSite   websites (desktop)      MobileSite  websites (phone)
 *   Dashboard     custom business software
 *   SearchRank    local SEO
 *   QuoteTimeline automated quote follow-up
 *   ReviewStars   review collection
 *   LossList      the COST scene, any topic
 *   Lockup        the BRAND scene (only place a client is named)
 *   QrEnd         the CTA scene, always last, never changed
 * Scenes 2 and 3 use the topic's mock(s). Use two different mocks or two
 * different moments so scenes 2 and 3 never look the same.
 *
 * HARD RULE: `label` is a SHORT visual label (1 to 3 words) or empty. It
 * must never restate the spoken line. Mocks use generic names like
 * "Your Shop", never a client name or a real statistic.
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
    label: "Same Street",
    highlights: ["gets the booking"],
    visual: () => (
      <Versus
        left={{ title: "Shop A", sub: "Modern site", win: true }}
        right={{ title: "Shop B", sub: "Looks closed", win: false }}
      />
    ),
  },
  {
    label: "",
    highlights: ["two taps"],
    visual: () => (
      <BrowserSite
        url="yourshop.ca"
        brand="YOUR SHOP"
        headline="Fast, honest auto repair"
        button="Book a service"
      />
    ),
  },
  {
    label: "",
    highlights: ["calls and bookings"],
    visual: () => (
      <MobileSite brand="YOUR SHOP" headline="Book in two taps" confirm="Booked: Tue 9:30 AM" />
    ),
  },
  {
    label: "The Cost",
    highlights: ["pick someone else"],
    visual: () => <LossList items={["Visitor left", "No call", "No booking"]} />,
  },
  {
    label: "",
    // The lockup already shows the brand and the client on screen.
    // Highlighting them again in the caption is the duplicate-headline bug.
    highlights: ["new website"],
    visual: () => <Lockup client={CLIENT_NAME} />,
  },
  {
    label: "",
    // The URL is on screen under the QR. Highlight the offer only.
    highlights: ["free twenty minute review"],
    visual: () => <QrEnd />,
  },
];

/** Renders label + visual. Nothing here is absolutely positioned, and an
 *  empty label is not rendered at all rather than rendered as a blank box
 *  that eats vertical space and shoves the visual off centre. */
export const SceneBody: React.FC<{ scene: Scene }> = ({ scene }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
    {scene.label ? (
      // Negative delay: the headline is already on screen on the scene's
      // first frame. An empty first frame loses viewers on the hook.
      <Rise delay={-8}>
        <Headline text={scene.label} sub={scene.sub} />
      </Rise>
    ) : null}
    <scene.visual />
  </div>
);
