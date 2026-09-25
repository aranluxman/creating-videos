/**
 * THIS WEEK'S SCRIPT.
 *
 * Editing rules (the weekly routine depends on them):
 *  - Blank lines separate LINES. Each line becomes one scene.
 *  - Structure, in order: concrete two-thing contrast hook (a specific story,
 *    never a statistic), tension in one line, plain definition, what good
 *    looks like, cost of ignoring, brand with client, CTA.
 *  - Target 130 words. No emojis, no hashtags, no em dashes.
 *  - CLIENT_NAME must be one of CLIENTS. Never invent a client, and never
 *    claim anything about them beyond the generic line below.
 */

export const CLIENTS = {
  restaurant: "Tasty Shawarma",
  gym: "Lyfestyle Athletics",
} as const;

/** Restaurant for enquiry, ordering and after-hours topics.
 *  Gym for bookings, retention and follow-up topics.
 *  Alternate week to week. */
export const CLIENT_NAME: string = CLIENTS.gym;

export const TOPIC = "abandoned enquiry follow-up";

/** Used by scripts/captions.mjs for the YouTube title. */
export const TOPIC_TITLE = "Abandoned Enquiry Follow Up";

/** Used by scripts/captions.mjs. Topic-specific so last week's angle and
 *  tags never leak into this week's post. */
export const YT_TITLE = "Abandoned Enquiry Follow Up: Why Local Gyms Lose Members Before Day One";

export const YT_TAGS = [
  "abandoned enquiry follow up", "lead follow up", "small business automation",
  "gym marketing", "fitness business", "local business marketing",
  "ai for small business", "business automation", "intelligent automations",
  "sms automation",
];

export const SCRIPT = `
A gym got two trial enquiries on the same Monday night. One person got a text back that evening and booked a Tuesday class. The other heard nothing and joined a gym down the road.

Same form, same interest. The only difference was who followed up first.

Abandoned enquiry follow up is simple. When someone asks about a trial and goes quiet, they get a friendly message that restarts the conversation. It runs on its own.

Good setups reply within minutes, check in once the next day, and hand warm leads to a real person to book.

Without it, every quiet enquiry is someone who wanted to join and simply joined somewhere else.

Intelligent Automations builds these for local businesses like ${CLIENT_NAME}.

Book a free twenty minute Business Automation Review at intelligentautomations.ca.
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
