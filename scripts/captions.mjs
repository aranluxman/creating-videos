/**
 * Write out/captions.md: YouTube title + description + tags, and separate
 * Instagram and TikTok captions.
 *
 * Three DIFFERENT texts, never the same string three times, hook front-loaded
 * in all three. No emojis, no hashtags, no em dashes.
 */
import fs from "node:fs";
import { LINES, CLIENT_NAME, TOPIC, TOPIC_TITLE, WORD_COUNT } from "../src/script.ts";
import { AUDIO_DURATION } from "../src/captions.ts";

const hook = LINES[0];
const tension = LINES[1];
const define = LINES[2];
const good = LINES[3];
const cost = LINES[4];

const CTA_LONG = "Book a free 20 minute Business Automation Review: intelligentautomations.ca";
const HANDLES = "Instagram and TikTok: @intelligentautomation_s";
const TAGLINE = "Smarter Solutions. Better Results.";

const ytTitle = `${TOPIC_TITLE}: Why Local Businesses Lose Orders After Hours`;

const ytDescription = [
  hook,
  "",
  `This video covers what ${TOPIC} actually is, what a good setup does differently, and what it costs a local business to leave it switched off.`,
  "",
  good,
  "",
  `Intelligent Automations builds AI chatbots, voice agents and automated follow-up for local businesses like ${CLIENT_NAME}.`,
  "",
  CTA_LONG,
  HANDLES,
  "",
  TAGLINE,
].join("\n");

const ytTags = [
  "missed call text back", "small business automation", "local business marketing",
  "ai for small business", "customer follow up", "restaurant marketing",
  "business automation", "intelligent automations", "lead follow up", "sms automation",
].join(", ");

const instagram = [
  hook,
  "",
  tension,
  "",
  `${define} ${good}`,
  "",
  cost,
  "",
  "Free 20 minute Business Automation Review. Link in bio.",
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
