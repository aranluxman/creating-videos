/**
 * Write out/captions.md: YouTube title + description + tags, and separate
 * Instagram and TikTok captions.
 *
 * Three DIFFERENT texts, never the same string three times, hook front-loaded
 * in all three. No emojis, no hashtags, no em dashes.
 */
import fs from "node:fs";
import { LINES, CLIENT_NAME, TOPIC, YT_TITLE, YT_TAGS, WORD_COUNT } from "../src/script.ts";
import { AUDIO_DURATION } from "../src/captions.ts";

// Line order is fixed by src/script.ts: hook, define, good, cost, brand, cta.
if (LINES.length !== 6) {
  console.error(`captions: expected 6 lines in src/script.ts, found ${LINES.length}`);
  process.exit(1);
}
const [hook, define, good, cost] = LINES;

const CTA_LONG = "Book a free 20 minute Business Automation Review: intelligentautomations.ca";
const HANDLES = "Instagram and TikTok: @intelligentautomation_s";
const TAGLINE = "Smarter Solutions. Better Results.";

const ytTitle = YT_TITLE;

const ytDescription = [
  hook,
  "",
  `This video covers what ${TOPIC} actually is, what a good setup does differently, and what it costs a local business to leave it switched off.`,
  "",
  good,
  "",
  `Intelligent Automations builds AI chatbots, voice AI receptionists, websites and custom business software for local businesses like ${CLIENT_NAME}.`,
  "",
  CTA_LONG,
  HANDLES,
  "",
  TAGLINE,
].join("\n");

const ytTags = YT_TAGS.join(", ");

const instagram = [
  hook,
  "",
  `${define} ${good}`,
  "",
  cost,
  "",
  "Free 20 minute Business Automation Review. Scan the code in the video or tap the link in bio.",
  "",
  TAGLINE,
].join("\n");

const tiktok = [
  hook,
  cost,
  "Free 20 minute review. Link in bio.",
].join("\n");

const md = `# Captions

Topic: ${TOPIC}
Client named: ${CLIENT_NAME}
Script: ${WORD_COUNT} words, ${AUDIO_DURATION.toFixed(2)}s measured audio

Posting is a manual step. Nothing here has been published.

## YouTube title

${ytTitle}

## YouTube description

${ytDescription}

## YouTube tags

${ytTags}

## Instagram caption

${instagram}

## TikTok caption

${tiktok}
`;

fs.mkdirSync("out", { recursive: true });
fs.writeFileSync("out/captions.md", md);
console.log("captions: wrote out/captions.md");
