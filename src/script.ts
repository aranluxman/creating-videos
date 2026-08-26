export const CLIENTS = {
  restaurant: "Tasty Shawarma",
  gym: "Lyfestyle Athletics",
} as const;

export const CLIENT_NAME: string = CLIENTS.restaurant;
export const TOPIC = "missed-call text-back";
export const TOPIC_TITLE = "Missed Call Text Back";

export const SCRIPT = `
A shawarma shop missed two calls during the Friday dinner rush. One caller ordered from the place across the street. The other never called back at all.

Both of those orders were already paid for in rent, in staff, and in advertising.

Missed call text back is simple. The phone rings out, and the caller gets a text within seconds asking what they need. It runs on its own, day and night.

Good setups reply within five seconds, ask one clear question, and hand the conversation to a real person during open hours.

Without it, every missed call is a customer who found someone else before the dinner shift had even ended.

Intelligent Automations builds these for local businesses like ${CLIENT_NAME}.

Book a free twenty minute Business Automation Review at intelligentautomations.ca.
`.trim();

export const LINES: string[] = SCRIPT.split(/\n\s*\n/).map((l) =>
  l.replace(/\s+/g, " ").trim()
);

export const WORD_COUNT = SCRIPT.split(/\s+/).filter(Boolean).length;

export const VOICE = {
  voice_id: "XrExE9yKIg1WjnnlVkGX",
  model_id: "eleven_multilingual_v2",
  output_format: "mp3_44100_128",
} as const;
