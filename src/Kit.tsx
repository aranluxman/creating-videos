import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SAFE, THEME } from "./theme";
import { Lockup } from "./components/Ui";
import {
  BrowserSite,
  CallPhone,
  ChatPhone,
  Dashboard,
  LossList,
  MobileSite,
  PortalLogin,
  QrEnd,
  QuoteTimeline,
  ReviewStars,
  SearchRank,
  Versus,
} from "./components/Mocks";

/**
 * KIT PREVIEW. Every mock in the visual kit, one after another, 90 frames
 * each. Not part of the weekly video. Render stills of it with
 * `node scripts/kit.mjs` to check the kit after any change to Mocks.tsx.
 */
export const KIT_SECONDS = 3;

export const KIT: { name: string; el: React.ReactNode }[] = [
  { name: "Versus", el: <Versus left={{ title: "Shop A", sub: "Replied", win: true }} right={{ title: "Shop B", sub: "Silent", win: false }} /> },
  { name: "ChatPhone", el: <ChatPhone title="Your Clinic" messages={[{ from: "user", text: "Do you take new clients?" }, { from: "bot", text: "Yes! Want to book a free consult?" }, { from: "user", text: "Thursday works" }, { from: "bot", text: "Booked: Thu 2:00 PM" }]} /> },
  { name: "MissedCall", el: <ChatPhone title="Your Shop" banner="Missed call" messages={[{ from: "bot", text: "Sorry we missed you! How can we help?" }, { from: "user", text: "Need a quote for brakes" }, { from: "bot", text: "Sure. Can you come in Tuesday?" }]} /> },
  { name: "CallPhone", el: <CallPhone caller="(905) 555 0142" transcript={["Hi, can I book an oil change?", "Sure. Tuesday at 10 works?"]} result="Booked: Tue 10:00 AM" /> },
  { name: "BrowserSite", el: <BrowserSite url="yourshop.ca" brand="YOUR SHOP" headline="Fast, honest auto repair" button="Book a service" /> },
  { name: "MobileSite", el: <MobileSite brand="YOUR SHOP" headline="Book in two taps" confirm="Booked: Tue 9:30 AM" /> },
  { name: "ReviewStars", el: <ReviewStars business="Your Gym" ask="How was class today? Tap to leave a review" from={38} to={127} /> },
  { name: "SearchRank", el: <SearchRank query="mechanic near me" results={["Main St Auto", "Quick Lube"]} winner="Your Shop" /> },
  { name: "QuoteTimeline", el: <QuoteTimeline steps={[{ when: "Day 0", text: "Quote sent" }, { when: "Day 2", text: "Friendly check in" }, { when: "Day 5", text: "Last reminder" }]} result="Quote accepted" /> },
  { name: "PortalLogin", el: <PortalLogin brand="Member Portal" email="alex@email.com" tiles={[{ label: "Classes", value: "3" }, { label: "Invoices", value: "0" }, { label: "Plan", value: "Gold" }, { label: "Visits", value: "24" }]} /> },
  { name: "Dashboard", el: <Dashboard title="Shop Manager" stats={[{ label: "Today", value: 4280, prefix: "$" }, { label: "Jobs", value: 12 }, { label: "Ready", value: 5 }]} rows={[{ name: "2019 Civic, brakes", status: "Ready" }, { name: "F-150, oil change", status: "In bay" }]} /> },
  { name: "LossList", el: <LossList items={["Missed call", "No reply", "Lost job"]} /> },
  { name: "Lockup", el: <Lockup client="Pronto Automotive" /> },
  { name: "QrEnd", el: <QrEnd /> },
];

export const KitPreview: React.FC = () => (
  <AbsoluteFill style={{ background: THEME.navyDeep }}>
    {KIT.map((k, i) => (
      <Sequence key={k.name} from={i * KIT_SECONDS * 30} durationInFrames={KIT_SECONDS * 30}>
        <AbsoluteFill
          style={{
            padding: `${SAFE.top}px ${SAFE.side}px ${SAFE.bottom + 250}px`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {k.el}
        </AbsoluteFill>
      </Sequence>
    ))}
  </AbsoluteFill>
);
