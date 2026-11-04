/**
 * THIS WEEK'S SCRIPT.
 *
 * Editing rules (the weekly routine depends on them):
 *  - Blank lines separate LINES. Each line becomes one scene.
 *  - Exactly 6 lines, in this order:
 *      1. HOOK: a concrete two-thing contrast, a specific story, never a
 *         statistic. 22 words or fewer. It is the first thing people hear.
 *      2. DEFINE: what the service is, in plain words.
 *      3. GOOD: what a good setup does.
 *      4. COST: what it costs to skip it. Start with "Without <the service
 *         name>," never "Without it," because this line is reused alone in
 *         the TikTok caption.
 *      5. BRAND: the client line (see CLIENT_WORK below).
 *      6. CTA: keep CTA_LINE exactly. The QR code is on screen for it.
 *  - 80 to 100 words total (about 35 seconds). No emojis, hashtags, em dashes.
 *  - TOPIC must be one of SERVICES.
 *  - CLIENT_NAME must be one of CLIENTS. Never invent a client.
 */

export const CLIENTS = {
  pronto: "Pronto Automotive",
  lyfestyle: "Lyfestyle Athletics",
  motive: "Motive Care",
} as const;

/** The ONLY specific claims allowed about a client. For any other topic,
 *  the BRAND line must stay generic:
 *  "Intelligent Automations builds AI tools for local businesses like <client>." */
export const CLIENT_WORK: Record<string, string[]> = {
  "Pronto Automotive": ["websites", "custom business software"],
  "Motive Care": ["AI chatbots"],
  "Lyfestyle Athletics": [],
};

/** Everything Intelligent Automations sells. One is picked each week, at
 *  random, from those not used in the last 4 weeks. `visual` names the mock
 *  in src/components/Mocks.tsx built for that service. */
export const SERVICES = [
  { topic: "AI chatbots", visual: "ChatPhone" },
  { topic: "voice AI receptionist", visual: "CallPhone" },
  { topic: "secure member portals", visual: "PortalLogin" },
  { topic: "websites", visual: "BrowserSite + MobileSite" },
  { topic: "custom business software", visual: "Dashboard" },
  { topic: "local SEO", visual: "SearchRank" },
  { topic: "automated quote follow-up", visual: "QuoteTimeline" },
  { topic: "review collection", visual: "ReviewStars" },
  { topic: "missed-call text-back", visual: "ChatPhone with banner" },
  { topic: "abandoned enquiry follow-up", visual: "ChatPhone" },
] as const;

export const CLIENT_NAME: string = CLIENTS.pronto;

export const TOPIC = "websites";

/** Used by scripts/captions.mjs for the YouTube title. */
export const TOPIC_TITLE = "Websites For Local Businesses";

/** Used by scripts/captions.mjs. Topic-specific so last week's angle and
 *  tags never leak into this week's post. */
export const YT_TITLE = "Small Business Website: Why Customers Pick The Shop With The Better Site";

export const YT_TAGS = [
  "small business website", "auto shop website", "website design",
  "local business marketing", "mobile friendly website", "web design markham",
  "ai for small business", "business automation", "intelligent automations",
  "pronto automotive",
];

export const CTA_LINE =
  "Scan the code or visit intelligentautomations.ca to book your free twenty minute review.";

export const SCRIPT = `
Two auto shops, same street. One has a fast, modern website and gets the booking. The other looks closed.

A real website shows your services, prices and reviews, and lets people book in two taps, right from their phone.

Good sites load fast, look great on mobile, and turn visitors into calls and bookings.

Without a real website, customers judge you before they ever call, and quietly pick someone else.

Intelligent Automations built the new website for ${CLIENT_NAME}.

${CTA_LINE}
`.trim();

/** One entry per spoken line, in order. Blank-line separated above. */
export const LINES: string[] = SCRIPT.split(/\n\s*\n/).map((l) =>
  l.replace(/\s+/g, " ").trim()
);

export const WORD_COUNT = SCRIPT.split(/\s+/).filter(Boolean).length;

/** ElevenLabs Matilda, locked. */
export const VOICE = {
  voice_id: "XrExE9yKIg1WjnnlVkGX",
  model_id: "eleven_multilingual_v2",
  output_format: "mp3_44100_128",
} as const;
