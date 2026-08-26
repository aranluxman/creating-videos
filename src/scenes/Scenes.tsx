import React from "react";
import { THEME } from "../theme";
import { CLIENT_NAME } from "../script";
import { CardStack, Chips, Flow, Headline, Lockup, Rise } from "../components/Ui";

export type Scene = {
  label: string;
  sub?: string;
  highlights: string[];
  visual: React.FC;
};

export const SCENES: Scene[] = [
  {
    label: "Friday\nDinner Rush",
    sub: "7:12 PM",
    highlights: ["two calls", "across the street"],
    visual: () => <CardStack items={["Call one", "Call two"]} />,
  },
  {
    label: "Fixed Costs",
    highlights: ["rent", "staff", "advertising"],
    visual: () => <Chips items={["Rent", "Staff", "Ads"]} />,
  },
  {
    label: "How It Works",
    highlights: ["missed call text back", "within seconds"],
    visual: () => <Flow steps={["Missed call", "Auto text", "Live reply"]} />,
  },
  {
    label: "What Good\nLooks Like",
    highlights: ["five seconds", "real person"],
    visual: () => <CardStack items={["Speed", "Clarity", "Handoff"]} />,
  },
  {
    label: "The Cost\nOf Waiting",
    highlights: ["every missed call"],
    visual: () => <CardStack items={["They call the next shop"]} />,
  },
  {
    label: "",
    highlights: ["local businesses"],
    visual: () => <Lockup client={CLIENT_NAME} />,
  },
  {
    label: "Book Your\nReview",
    sub: "intelligentautomations.ca",
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
