import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { THEME } from "../theme";
import { QR_ROWS, QR_URL } from "../qr";

/**
 * ANIMATED VISUAL KIT. Real-looking product moments instead of text cards:
 * phones, calls, browsers, reviews, search results, dashboards and a QR end
 * card. Every animation is driven by the frame, so stills and renders match.
 *
 * Timing rule: the main action of every mock completes by about frame 75
 * (2.5 s), because the contact-sheet still for a short scene is taken near
 * its midpoint. Anything later is a bonus beat, never the point.
 *
 * Content rule: mocks show GENERIC names and numbers ("Your Shop",
 * "(905) 555 0142"). Never put a real client's name or a real statistic
 * inside a mock. Clients are only named in the Lockup scene.
 */

// ---------------------------------------------------------------- helpers

const CORAL = "#FF6B6B";
const CARD = THEME.navyCard;
const LINE = "rgba(31,182,255,0.28)";

const useSpringAt = (delay: number, stiff = false) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: stiff
      ? { damping: 200 }
      : { damping: 14, stiffness: 170, mass: 0.6 },
  });
};

const progress = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

const Pop: React.FC<{
  delay: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  from?: "up" | "left" | "right" | "scale";
}> = ({ delay, children, style, from = "up" }) => {
  const s = useSpringAt(delay);
  const o = Math.min(1, Math.max(0, s));
  const t =
    from === "left"
      ? `translateX(${interpolate(s, [0, 1], [-60, 0])}px)`
      : from === "right"
        ? `translateX(${interpolate(s, [0, 1], [60, 0])}px)`
        : from === "scale"
          ? `scale(${interpolate(s, [0, 1], [0.6, 1])})`
          : `translateY(${interpolate(s, [0, 1], [40, 0])}px)`;
  return <div style={{ ...style, opacity: o, transform: t }}>{children}</div>;
};

const Text: React.FC<{
  size?: number;
  weight?: number;
  color?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ size = 34, weight = 700, color = THEME.white, children, style }) => (
  <div
    style={{
      fontFamily: THEME.body,
      fontWeight: weight,
      fontSize: size,
      color,
      lineHeight: 1.25,
      ...style,
    }}
  >
    {children}
  </div>
);

// ------------------------------------------------------------------ icons

type IconProps = { size?: number; color?: string };

export const CheckIcon: React.FC<IconProps> = ({ size = 40, color = THEME.navyDeep }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 12.5l4.5 4.5L19 7.5" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CrossIcon: React.FC<IconProps> = ({ size = 40, color = THEME.white }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke={color} strokeWidth={3.2} strokeLinecap="round" />
  </svg>
);

export const PhoneIcon: React.FC<IconProps> = ({ size = 40, color = THEME.white }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1z" />
  </svg>
);

export const StarIcon: React.FC<IconProps & { fill?: number }> = ({
  size = 40,
  color = "#FFC93C",
  fill = 1,
}) => {
  const id = React.useId();
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor={color} />
          <stop offset={`${fill * 100}%`} stopColor="rgba(255,255,255,0.16)" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"
        fill={`url(#${id})`}
      />
    </svg>
  );
};

const LockIcon: React.FC<IconProps> = ({ size = 40, color = THEME.cyan }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" fill={color} />
    <path d="M8 10.5V8a4 4 0 018 0v2.5" stroke={color} strokeWidth={2.4} />
  </svg>
);

const PinIcon: React.FC<IconProps> = ({ size = 40, color = CORAL }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
  </svg>
);

const SearchIcon: React.FC<IconProps> = ({ size = 40, color = THEME.muted }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="10.5" cy="10.5" r="6.5" stroke={color} strokeWidth={2.6} />
    <path d="M15.5 15.5L21 21" stroke={color} strokeWidth={2.6} strokeLinecap="round" />
  </svg>
);

const Circle: React.FC<{ size: number; bg: string; children: React.ReactNode }> = ({
  size,
  bg,
  children,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "0 0 auto",
    }}
  >
    {children}
  </div>
);

// --------------------------------------------------------------- frames

/** A phone body. Children fill the screen. */
export const Phone: React.FC<{
  children: React.ReactNode;
  width?: number;
  height?: number;
}> = ({ children, width = 600, height = 870 }) => (
  <div
    style={{
      width,
      height,
      alignSelf: "center",
      borderRadius: 70,
      padding: 16,
      background: "linear-gradient(160deg, #26384F 0%, #111D2E 100%)",
      boxShadow: "0 40px 90px rgba(0,0,0,0.55), 0 0 0 2px rgba(255,255,255,0.06)",
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 56,
        overflow: "hidden",
        background: "#0B1626",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: 150,
          height: 34,
          borderRadius: 17,
          background: "#000",
          alignSelf: "center",
          marginTop: 16,
          flex: "0 0 auto",
        }}
      />
      {children}
    </div>
  </div>
);

/** A desktop browser window. */
export const Browser: React.FC<{
  url: string;
  children: React.ReactNode;
  height?: number;
}> = ({ url, children, height = 640 }) => {
  const frame = useCurrentFrame();
  const typed = Math.round(progress(frame, 0, 22) * url.length);
  return (
    <div
      style={{
        width: "100%",
        height,
        borderRadius: 30,
        overflow: "hidden",
        background: "#F4F7FB",
        boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 76,
          background: "#DDE4EE",
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 26px",
          flex: "0 0 auto",
        }}
      >
        {["#FF6159", "#FFBD2E", "#28C941"].map((c) => (
          <div key={c} style={{ width: 20, height: 20, borderRadius: 10, background: c }} />
        ))}
        <div
          style={{
            marginLeft: 16,
            flex: 1,
            height: 44,
            borderRadius: 22,
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 20px",
          }}
        >
          <LockIcon size={22} color="#5B6B80" />
          <Text size={26} weight={600} color="#2A3A50">
            {url.slice(0, typed)}
          </Text>
        </div>
      </div>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>{children}</div>
    </div>
  );
};

// ------------------------------------------------------------------ hook

type Side = { title: string; sub: string; win: boolean };

/** The hook. Two businesses side by side, one wins, one loses. Starts
 *  already visible on frame 0 so the first frame is never empty. */
export const Versus: React.FC<{ left: Side; right: Side }> = ({ left, right }) => {
  const frame = useCurrentFrame();
  // Starts mid-animation on frame 0 so the very first frame already shows
  // the winner and loser icons (that frame is the thumbnail and the hook).
  const verdict = progress(frame, -8, 12);
  const card = (s: Side, i: number) => (
    <Pop key={s.title} delay={-8 + i * 5} from={i === 0 ? "left" : "right"} style={{ flex: 1 }}>
      <div
        style={{
          height: 560,
          borderRadius: 34,
          background: CARD,
          border: `3px solid ${s.win ? THEME.cyan : "rgba(255,107,107,0.55)"}`,
          boxShadow: s.win ? `0 0 ${60 * verdict}px rgba(31,182,255,0.45)` : "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
          padding: 30,
          opacity: s.win ? 1 : interpolate(verdict, [0, 1], [1, 0.62]),
        }}
      >
        <Text size={44} style={{ fontFamily: THEME.display, textTransform: "uppercase" }}>
          {s.title}
        </Text>
        <div style={{ transform: `scale(${interpolate(verdict, [0, 1], [0.3, 1])})`, opacity: verdict }}>
          <Circle size={170} bg={s.win ? THEME.cyan : CORAL}>
            {s.win ? <CheckIcon size={110} /> : <CrossIcon size={100} />}
          </Circle>
        </div>
        <Text size={36} weight={600} color={THEME.muted} style={{ textAlign: "center" }}>
          {s.sub}
        </Text>
      </div>
    </Pop>
  );
  return <div style={{ display: "flex", gap: 30 }}>{[left, right].map(card)}</div>;
};

// --------------------------------------------------------------- chatbot

export type Msg = { from: "bot" | "user"; text: string };

const TypingDots: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 10, padding: "22px 28px", background: CARD, borderRadius: 30, alignSelf: "flex-start" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            background: THEME.muted,
            opacity: 0.4 + 0.6 * Math.abs(Math.sin((frame + i * 5) / 5)),
          }}
        />
      ))}
    </div>
  );
};

const Bubble: React.FC<{ m: Msg }> = ({ m }) => (
  <div
    style={{
      alignSelf: m.from === "user" ? "flex-end" : "flex-start",
      maxWidth: "82%",
      padding: "20px 26px",
      borderRadius: 30,
      borderBottomRightRadius: m.from === "user" ? 8 : 30,
      borderBottomLeftRadius: m.from === "bot" ? 8 : 30,
      background: m.from === "user" ? THEME.cyan : CARD,
      color: m.from === "user" ? THEME.navyDeep : THEME.white,
      fontFamily: THEME.body,
      fontWeight: 600,
      fontSize: 31,
      lineHeight: 1.3,
    }}
  >
    {m.text}
  </div>
);

/** A chat conversation on a phone. Bot messages are preceded by typing dots.
 *  Keep it to 3 or 4 short messages. `banner` adds a system row on top,
 *  used for missed-call text-back. */
export const ChatPhone: React.FC<{
  title: string;
  status?: string;
  messages: Msg[];
  banner?: string;
}> = ({ title, status = "Replies instantly", messages, banner }) => {
  const frame = useCurrentFrame();
  const STEP = 20;
  const start = banner ? 16 : 4;
  return (
    <Phone>
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "22px 30px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Circle size={70} bg={THEME.cyan}>
          <Text size={28} color={THEME.navyDeep} style={{ fontFamily: THEME.display }}>AI</Text>
        </Circle>
        <div>
          <Text size={32}>{title}</Text>
          <Text size={24} weight={600} color={THEME.cyan}>{status}</Text>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18, padding: 28 }}>
        {banner ? (
          <Pop delay={0} from="scale" style={{ alignSelf: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 24px", borderRadius: 999, background: "rgba(255,107,107,0.16)", border: `2px solid ${CORAL}` }}>
              <PhoneIcon size={28} color={CORAL} />
              <Text size={26} color={CORAL}>{banner}</Text>
            </div>
          </Pop>
        ) : null}
        {messages.map((m, i) => {
          const at = start + i * STEP;
          const showDots = m.from === "bot" && frame >= at - 10 && frame < at;
          if (showDots) return <TypingDots key={i} />;
          if (frame < at) return null;
          return (
            <Pop key={i} delay={at} from={m.from === "user" ? "right" : "left"} style={{ display: "flex", flexDirection: "column" }}>
              <Bubble m={m} />
            </Pop>
          );
        })}
      </div>
    </Phone>
  );
};

// ------------------------------------------------------------ voice AI

/** Incoming call, answered by the AI receptionist, ends with a booked card. */
export const CallPhone: React.FC<{
  caller: string;
  transcript: string[];
  result: string;
}> = ({ caller, transcript, result }) => {
  const frame = useCurrentFrame();
  const answered = progress(frame, 22, 32);
  const ring = (frame % 24) / 24;
  const secs = Math.max(0, Math.floor((frame - 30) / 30));
  return (
    <Phone>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 30px 34px", gap: 22 }}>
        <Text size={26} weight={600} color={THEME.muted}>
          {answered < 0.5 ? "Incoming call" : `AI Receptionist  0:${String(secs).padStart(2, "0")}`}
        </Text>
        <Text size={42} style={{ textAlign: "center" }}>{caller}</Text>
        <div style={{ position: "relative", width: 190, height: 190, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {answered < 1
            ? [0, 1].map((k) => {
                const r = (ring + k * 0.5) % 1;
                return (
                  <div
                    key={k}
                    style={{
                      position: "absolute",
                      width: 120 + r * 70,
                      height: 120 + r * 70,
                      borderRadius: 999,
                      border: `3px solid ${THEME.cyan}`,
                      opacity: (1 - r) * (1 - answered),
                    }}
                  />
                );
              })
            : null}
          <Circle size={130} bg={answered > 0.5 ? THEME.cyan : "#28C941"}>
            <PhoneIcon size={66} color={answered > 0.5 ? THEME.navyDeep : THEME.white} />
          </Circle>
        </div>
        {/* waveform */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, height: 70, opacity: answered }}>
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 10,
                borderRadius: 5,
                background: THEME.cyan,
                height: 12 + 50 * Math.abs(Math.sin(frame / 4 + i * 0.9)) * Math.abs(Math.sin(i * 1.7)),
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
          {transcript.map((t, i) => (
            <Pop key={i} delay={34 + i * 16}>
              <div style={{ background: CARD, borderRadius: 22, padding: "16px 22px" }}>
                <Text size={27} weight={600}>{t}</Text>
              </div>
            </Pop>
          ))}
        </div>
        <Pop delay={34 + transcript.length * 16 + 4} from="scale" style={{ width: "100%", marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, background: THEME.cyan, borderRadius: 26, padding: "20px 24px" }}>
            <Circle size={56} bg={THEME.navyDeep}>
              <CheckIcon size={34} color={THEME.cyan} />
            </Circle>
            <Text size={32} color={THEME.navyDeep}>{result}</Text>
          </div>
        </Pop>
      </div>
    </Phone>
  );
};

// -------------------------------------------------------------- website

/** A desktop site building itself, a cursor clicks the main button. */
export const BrowserSite: React.FC<{
  url: string;
  brand: string;
  headline: string;
  button: string;
}> = ({ url, brand, headline, button }) => {
  const frame = useCurrentFrame();
  const cx = interpolate(frame, [46, 66], [760, 250], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cy = interpolate(frame, [46, 66], [520, 412], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const click = progress(frame, 68, 84);
  return (
    <Browser url={url}>
      <Pop delay={10} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 40px" }}>
        <Text size={34} color="#0A1628" style={{ fontFamily: THEME.display }}>{brand}</Text>
        <div style={{ display: "flex", gap: 18 }}>
          {[80, 100, 70].map((w, i) => (
            <div key={i} style={{ width: w, height: 16, borderRadius: 8, background: "#C5D0DE" }} />
          ))}
        </div>
      </Pop>
      <div style={{ display: "flex", gap: 30, padding: "20px 40px" }}>
        <div style={{ flex: 1.1, display: "flex", flexDirection: "column", gap: 22 }}>
          <Pop delay={18}>
            <Text size={50} color="#0A1628" style={{ fontFamily: THEME.display, lineHeight: 1.08 }}>{headline}</Text>
          </Pop>
          <Pop delay={24}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[100, 85, 60].map((w) => (
                <div key={w} style={{ width: `${w}%`, height: 14, borderRadius: 7, background: "#C5D0DE" }} />
              ))}
            </div>
          </Pop>
          <Pop delay={30} from="scale" style={{ alignSelf: "flex-start" }}>
            <div
              style={{
                background: THEME.cyan,
                borderRadius: 999,
                padding: "20px 38px",
                transform: `scale(${1 - 0.08 * Math.sin(click * Math.PI)})`,
                boxShadow: `0 0 0 ${click * 26}px rgba(31,182,255,${0.35 * (1 - click)})`,
              }}
            >
              <Text size={32} color={THEME.navyDeep}>{button}</Text>
            </div>
          </Pop>
        </div>
        <Pop delay={22} from="right" style={{ flex: 0.9 }}>
          <div
            style={{
              height: 360,
              borderRadius: 24,
              background: "linear-gradient(140deg, #1FB6FF 0%, #0A1628 100%)",
              display: "flex",
              alignItems: "flex-end",
              padding: 24,
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <StarIcon key={i} size={36} />
              ))}
            </div>
          </div>
        </Pop>
      </div>
      {/* cursor */}
      <svg
        width={54}
        height={54}
        viewBox="0 0 24 24"
        style={{ position: "absolute", left: cx, top: cy, opacity: progress(frame, 40, 46) }}
      >
        <path d="M4 2l15 9.5-6.8 1.4L9 20z" fill="#0A1628" stroke="#FFFFFF" strokeWidth={1.4} />
      </svg>
    </Browser>
  );
};

/** A mobile site with sticky Call and Book buttons; Book is tapped and a
 *  confirmation slides up. */
export const MobileSite: React.FC<{ brand: string; headline: string; confirm: string }> = ({
  brand,
  headline,
  confirm,
}) => {
  const frame = useCurrentFrame();
  const tap = progress(frame, 40, 52);
  return (
    <Phone>
      <div style={{ flex: 1, background: "#F4F7FB", marginTop: 14, display: "flex", flexDirection: "column", position: "relative" }}>
        <Pop delay={4} style={{ padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Text size={30} color="#0A1628" style={{ fontFamily: THEME.display }}>{brand}</Text>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 36, height: 5, borderRadius: 3, background: "#0A1628" }} />
            ))}
          </div>
        </Pop>
        <Pop delay={10} style={{ margin: "0 22px", height: 250, borderRadius: 24, background: "linear-gradient(140deg, #1FB6FF 0%, #0A1628 100%)", padding: 26, display: "flex", alignItems: "flex-end" }}>
          <Text size={40} style={{ fontFamily: THEME.display, lineHeight: 1.08 }}>{headline}</Text>
        </Pop>
        <Pop delay={16} style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 12 }}>
          {[100, 80, 90, 55].map((w, i) => (
            <div key={i} style={{ width: `${w}%`, height: 13, borderRadius: 7, background: "#C5D0DE" }} />
          ))}
        </Pop>
        <Pop delay={22} style={{ marginTop: "auto", padding: 22, display: "flex", gap: 16 }}>
          <div style={{ flex: 1, borderRadius: 999, border: "3px solid #0A1628", padding: "18px 0", display: "flex", justifyContent: "center", gap: 10, alignItems: "center" }}>
            <PhoneIcon size={30} color="#0A1628" />
            <Text size={30} color="#0A1628">Call</Text>
          </div>
          <div
            style={{
              flex: 1,
              borderRadius: 999,
              background: THEME.cyan,
              padding: "18px 0",
              display: "flex",
              justifyContent: "center",
              transform: `scale(${1 - 0.08 * Math.sin(tap * Math.PI)})`,
              boxShadow: `0 0 0 ${tap * 22}px rgba(31,182,255,${0.35 * (1 - tap)})`,
            }}
          >
            <Text size={30} color={THEME.navyDeep}>Book</Text>
          </div>
        </Pop>
        <Pop delay={54} style={{ position: "absolute", left: 22, right: 22, bottom: 140 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#0A1628", borderRadius: 24, padding: "22px 24px", boxShadow: "0 20px 50px rgba(0,0,0,0.35)" }}>
            <Circle size={56} bg={THEME.cyan}>
              <CheckIcon size={34} />
            </Circle>
            <Text size={30}>{confirm}</Text>
          </div>
        </Pop>
      </div>
    </Phone>
  );
};

// -------------------------------------------------------------- reviews

/** Review request notification, five stars fill, review count climbs. */
export const ReviewStars: React.FC<{
  business: string;
  ask: string;
  from: number;
  to: number;
  rating?: string;
}> = ({ business, ask, from, to, rating = "4.9" }) => {
  const frame = useCurrentFrame();
  const count = Math.round(interpolate(progress(frame, 42, 80), [0, 1], [from, to]));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
      <Pop delay={-4} from="scale">
        <div style={{ display: "flex", gap: 22, alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: 34, padding: "26px 30px", border: "1px solid rgba(255,255,255,0.12)" }}>
          <Circle size={76} bg={THEME.cyan}>
            <Text size={30} color={THEME.navyDeep} style={{ fontFamily: THEME.display }}>AI</Text>
          </Circle>
          <div style={{ flex: 1 }}>
            <Text size={28} weight={600} color={THEME.muted}>{business} · now</Text>
            <Text size={34}>{ask}</Text>
          </div>
        </div>
      </Pop>
      <div style={{ display: "flex", justifyContent: "center", gap: 18 }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const f = progress(frame, 14 + i * 5, 20 + i * 5);
          return (
            <div key={i} style={{ transform: `scale(${0.8 + 0.35 * Math.sin(f * Math.PI) + 0.2 * f})` }}>
              <StarIcon size={130} fill={f} />
            </div>
          );
        })}
      </div>
      <Pop delay={40}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 26, background: CARD, borderRadius: 30, padding: "28px 34px", border: `2px solid ${LINE}` }}>
          <Text size={92} style={{ fontFamily: THEME.display }}>{rating}</Text>
          <div>
            <div style={{ display: "flex", gap: 4 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <StarIcon key={i} size={38} />
              ))}
            </div>
            <Text size={36} color={THEME.cyan}>{count} reviews</Text>
          </div>
        </div>
      </Pop>
    </div>
  );
};

// ------------------------------------------------------------ local SEO

/** Search results; the highlighted business climbs from #3 to #1. */
export const SearchRank: React.FC<{
  query: string;
  results: string[];
  winner: string;
}> = ({ query, results, winner }) => {
  const frame = useCurrentFrame();
  const typed = Math.round(progress(frame, 0, 18) * query.length);
  const climb = progress(frame, 40, 66);
  const ROW = 150;
  const all = [...results.slice(0, 2), winner];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: "#FFFFFF", borderRadius: 999, padding: "24px 34px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
        <SearchIcon size={40} color="#5B6B80" />
        <Text size={36} weight={600} color="#0A1628">
          {query.slice(0, typed)}
          <span style={{ opacity: frame % 20 < 10 && typed < query.length ? 1 : 0 }}>|</span>
        </Text>
      </div>
      <div style={{ position: "relative", height: ROW * 3 + 20 }}>
        {all.map((name, i) => {
          const isWinner = i === 2;
          const pos = isWinner ? interpolate(climb, [0, 1], [2, 0]) : i + climb;
          return (
            <Pop key={name} delay={18 + i * 5} style={{ position: "absolute", left: 0, right: 0, top: pos * (ROW + 10) }}>
              <div
                style={{
                  height: ROW,
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  padding: "0 30px",
                  borderRadius: 28,
                  background: isWinner ? THEME.cyan : CARD,
                  border: isWinner ? "none" : `2px solid ${LINE}`,
                  boxShadow: isWinner ? `0 0 ${50 * climb}px rgba(31,182,255,0.5)` : "none",
                }}
              >
                <PinIcon size={56} color={isWinner ? THEME.navyDeep : CORAL} />
                <div style={{ flex: 1 }}>
                  <Text size={36} color={isWinner ? THEME.navyDeep : THEME.white}>{name}</Text>
                  <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
                    {[0, 1, 2, 3, 4].map((s) => (
                      <StarIcon key={s} size={28} color={isWinner ? THEME.navyDeep : "#FFC93C"} fill={isWinner || s < 4 ? 1 : 0.3} />
                    ))}
                  </div>
                </div>
                {isWinner ? (
                  <Text size={48} color={THEME.navyDeep} style={{ fontFamily: THEME.display, opacity: climb }}>#1</Text>
                ) : null}
              </div>
            </Pop>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------- quote follow-up

/** A follow-up timeline drawing itself, ending in an accepted quote. */
export const QuoteTimeline: React.FC<{
  steps: { when: string; text: string }[];
  result: string;
}> = ({ steps, result }) => {
  const frame = useCurrentFrame();
  const STEP = 14;
  const draw = progress(frame, 4, 8 + steps.length * STEP);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative", paddingLeft: 10 }}>
      <div style={{ position: "absolute", left: 43, top: 40, width: 6, borderRadius: 3, height: `${draw * (steps.length * 150)}px`, background: THEME.cyan }} />
      {steps.map((s, i) => (
        <Pop key={i} delay={6 + i * STEP} from="left" style={{ display: "flex", alignItems: "center", gap: 28, height: 150 }}>
          <Circle size={72} bg={THEME.cyan}>
            <CheckIcon size={42} />
          </Circle>
          <div style={{ flex: 1, background: CARD, borderRadius: 26, padding: "22px 28px", border: `2px solid ${LINE}` }}>
            <Text size={26} weight={600} color={THEME.cyan}>{s.when}</Text>
            <Text size={34}>{s.text}</Text>
          </div>
        </Pop>
      ))}
      <Pop delay={10 + steps.length * STEP} from="scale" style={{ marginTop: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, background: THEME.cyan, borderRadius: 30, padding: "30px 34px", boxShadow: "0 0 60px rgba(31,182,255,0.45)" }}>
          <Circle size={80} bg={THEME.navyDeep}>
            <CheckIcon size={48} color={THEME.cyan} />
          </Circle>
          <Text size={44} color={THEME.navyDeep} style={{ fontFamily: THEME.display, textTransform: "uppercase" }}>{result}</Text>
        </div>
      </Pop>
    </div>
  );
};

// --------------------------------------------------------------- portal

/** Login card types and signs in, then swaps to a member dashboard. */
export const PortalLogin: React.FC<{
  brand: string;
  email: string;
  tiles: { label: string; value: string }[];
}> = ({ brand, email, tiles }) => {
  const frame = useCurrentFrame();
  const typed = Math.round(progress(frame, 4, 22) * email.length);
  const dots = Math.round(progress(frame, 22, 34) * 8);
  const press = progress(frame, 36, 44);
  const swap = progress(frame, 46, 56);
  return (
    <div style={{ position: "relative", height: 760 }}>
      {/* login */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - swap, transform: `scale(${1 - 0.06 * swap})`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Pop delay={-6} from="scale">
          <div style={{ background: CARD, borderRadius: 40, padding: 50, border: `2px solid ${LINE}`, display: "flex", flexDirection: "column", gap: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <LockIcon size={60} />
              <Text size={44} style={{ fontFamily: THEME.display, textTransform: "uppercase" }}>{brand}</Text>
            </div>
            {[email.slice(0, typed), "•".repeat(dots)].map((v, i) => (
              <div key={i} style={{ height: 96, borderRadius: 22, background: "#0B1626", border: "2px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", padding: "0 28px" }}>
                <Text size={34} weight={600} color={v ? THEME.white : THEME.muted}>{v || (i === 0 ? "Email" : "Password")}</Text>
              </div>
            ))}
            <div style={{ height: 96, borderRadius: 22, background: THEME.cyan, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.06 * Math.sin(press * Math.PI)})` }}>
              <Text size={36} color={THEME.navyDeep}>Sign in</Text>
            </div>
          </div>
        </Pop>
      </div>
      {/* dashboard */}
      <div style={{ position: "absolute", inset: 0, opacity: swap, display: "flex", flexDirection: "column", justifyContent: "center", gap: 26 }}>
        <Text size={56} style={{ fontFamily: THEME.display, textTransform: "uppercase" }}>Welcome back</Text>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
          {tiles.map((t, i) => (
            <Pop key={t.label} delay={52 + i * 5} from="scale">
              <div style={{ background: i === 0 ? THEME.cyan : CARD, borderRadius: 30, padding: "34px 30px", border: i === 0 ? "none" : `2px solid ${LINE}`, height: 200, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Text size={30} weight={600} color={i === 0 ? THEME.navyDeep : THEME.muted}>{t.label}</Text>
                <Text size={60} color={i === 0 ? THEME.navyDeep : THEME.white} style={{ fontFamily: THEME.display }}>{t.value}</Text>
              </div>
            </Pop>
          ))}
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------ business software

/** App window with counting stats, a growing bar chart and job rows. */
export const Dashboard: React.FC<{
  title: string;
  stats: { label: string; value: number; prefix?: string }[];
  rows: { name: string; status: string }[];
}> = ({ title, stats, rows }) => {
  const frame = useCurrentFrame();
  const grow = progress(frame, 10, 50);
  const bars = [0.45, 0.6, 0.5, 0.75, 0.68, 0.9, 1];
  return (
    <Pop delay={-6} from="scale">
      <div style={{ background: "#0B1626", borderRadius: 36, border: `2px solid ${LINE}`, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,0.55)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 34px", background: CARD }}>
          <Text size={36} style={{ fontFamily: THEME.display, textTransform: "uppercase" }}>{title}</Text>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: "#28C941" }} />
        </div>
        <div style={{ padding: 30, display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", gap: 18 }}>
            {stats.map((s) => (
              <div key={s.label} style={{ flex: 1, background: CARD, borderRadius: 24, padding: "22px 22px" }}>
                <Text size={24} weight={600} color={THEME.muted}>{s.label}</Text>
                <Text size={48} style={{ fontFamily: THEME.display }}>
                  {s.prefix ?? ""}
                  {Math.round(s.value * grow).toLocaleString("en-US")}
                </Text>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 18, height: 200, padding: "0 6px" }}>
            {bars.map((b, i) => (
              <div key={i} style={{ flex: 1, height: `${b * 100 * progress(frame, 12 + i * 3, 40 + i * 3)}%`, borderRadius: 12, background: i === bars.length - 1 ? THEME.cyan : THEME.cyanDim }} />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {rows.map((r, i) => (
              <Pop key={r.name} delay={30 + i * 8} from="left">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: CARD, borderRadius: 20, padding: "18px 24px" }}>
                  <Text size={30}>{r.name}</Text>
                  <div style={{ borderRadius: 999, padding: "8px 20px", background: i === 0 ? THEME.cyan : "rgba(31,182,255,0.16)" }}>
                    <Text size={24} color={i === 0 ? THEME.navyDeep : THEME.cyan}>{r.status}</Text>
                  </div>
                </div>
              </Pop>
            ))}
          </div>
        </div>
      </div>
    </Pop>
  );
};

// ------------------------------------------------------------ cost scene

/** What it costs: items appear, then get struck out in coral. */
export const LossList: React.FC<{ items: string[]; total?: string }> = ({ items, total }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {items.map((it, i) => {
        const strike = progress(frame, 20 + i * 10, 30 + i * 10);
        return (
          <Pop key={it} delay={-4 + i * 7} from="left">
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 26, background: CARD, borderRadius: 28, padding: "30px 34px", border: `2px solid ${strike > 0.5 ? "rgba(255,107,107,0.6)" : LINE}`, opacity: 1 - 0.35 * strike }}>
              <Circle size={70} bg={strike > 0.5 ? CORAL : THEME.cyanDim}>
                <CrossIcon size={40} />
              </Circle>
              <Text size={44}>{it}</Text>
              <div style={{ position: "absolute", left: 130, right: 34, top: "50%", height: 6, borderRadius: 3, background: CORAL, transformOrigin: "left", transform: `scaleX(${strike})` }} />
            </div>
          </Pop>
        );
      })}
      {total ? (
        <Pop delay={20 + items.length * 10} from="scale" style={{ alignSelf: "center", marginTop: 10 }}>
          <Text size={64} color={CORAL} style={{ fontFamily: THEME.display, textTransform: "uppercase" }}>{total}</Text>
        </Pop>
      ) : null}
    </div>
  );
};

// ---------------------------------------------------------------- QR end

/** Scannable QR for the website. White card with a real quiet zone, scan
 *  line sweeping, corner brackets. The QR itself is never animated or
 *  scaled mid-frame, so any still of this scene scans. */
export const QrCode: React.FC<{ size?: number }> = ({ size = 440 }) => {
  const n = QR_ROWS.length;
  const quiet = 4;
  const total = n + quiet * 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${total} ${total}`} shapeRendering="crispEdges" style={{ display: "block" }}>
      <rect width={total} height={total} fill="#FFFFFF" />
      {QR_ROWS.map((row, y) =>
        row.split("").map((c, x) =>
          c === "1" ? <rect key={`${x}-${y}`} x={x + quiet} y={y + quiet} width={1} height={1} fill="#060F1C" /> : null
        )
      )}
    </svg>
  );
};

export const QrEnd: React.FC<{ handle?: string }> = ({ handle = "@intelligentautomation_s" }) => {
  const frame = useCurrentFrame();
  const scan = (frame % 60) / 60;
  const SIZE = 460;
  const pad = 30;
  const corner = (rot: number, pos: React.CSSProperties) => (
    <div style={{ position: "absolute", width: 70, height: 70, borderTop: `9px solid ${THEME.cyan}`, borderLeft: `9px solid ${THEME.cyan}`, borderTopLeftRadius: 20, transform: `rotate(${rot}deg)`, ...pos }} />
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
      <Pop delay={-6} from="scale">
        <div style={{ position: "relative", padding: pad + 18 }}>
          {corner(0, { left: 0, top: 0 })}
          {corner(90, { right: 0, top: 0 })}
          {corner(180, { right: 0, bottom: 0 })}
          {corner(270, { left: 0, bottom: 0 })}
          <div style={{ position: "relative", borderRadius: 28, overflow: "hidden", boxShadow: "0 0 70px rgba(31,182,255,0.35)" }}>
            <QrCode size={SIZE} />
            <div style={{ position: "absolute", left: 0, right: 0, top: scan * SIZE, height: 4, background: THEME.cyan, opacity: 0.45, boxShadow: `0 0 24px ${THEME.cyan}` }} />
          </div>
        </div>
      </Pop>
      <Pop delay={6}>
        <Text size={42} color={THEME.cyan} style={{ textAlign: "center" }}>
          {QR_URL.replace("https://", "")}
        </Text>
      </Pop>
      <Pop delay={10}>
        <Text size={34} weight={600} color={THEME.muted} style={{ textAlign: "center" }}>{handle}</Text>
      </Pop>
    </div>
  );
};
