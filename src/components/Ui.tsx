import React from "react";
import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { THEME } from "../theme";

/** Fade + rise. Never used on anything that must hold layout width. */
export const Rise: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        ...style,
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px)`,
      }}
    >
      {children}
    </div>
  );
};

/** Section headline. SHORT visual label only. Never the spoken line. */
export const Headline: React.FC<{ text: string; sub?: string }> = ({
  text,
  sub,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    <div
      style={{
        fontFamily: THEME.display,
        fontSize: 96,
        lineHeight: 1.05,
        letterSpacing: -1,
        color: THEME.white,
        textTransform: "uppercase",
        whiteSpace: "pre-line",
      }}
    >
      {text}
    </div>
    {/* Bug: an always-rendered subtitle with empty text still consumed a
        flex row and pushed the block off centre. Render only when present. */}
    {sub ? (
      <div
        style={{
          fontFamily: THEME.body,
          fontWeight: 600,
          fontSize: 42,
          color: THEME.cyan,
          letterSpacing: 1,
        }}
      >
        {sub}
      </div>
    ) : null}
  </div>
);

/** Cards live in a real flex column with a gap. Nothing is absolutely
 *  positioned, which is what caused cards to stack on top of each other. */
export const CardStack: React.FC<{ items: string[]; startDelay?: number }> = ({
  items,
  startDelay = 6,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
    {items.map((label, i) => (
      <Rise key={label} delay={startDelay + i * 7}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            background: THEME.navyCard,
            border: `2px solid rgba(31,182,255,0.28)`,
            borderRadius: 26,
            padding: "30px 36px",
          }}
        >
          <div
            style={{
              flex: "0 0 auto",
              width: 18,
              height: 18,
              borderRadius: 9,
              background: THEME.cyan,
            }}
          />
          <div
            style={{
              fontFamily: THEME.body,
              fontWeight: 700,
              fontSize: 46,
              color: THEME.white,
            }}
          >
            {label}
          </div>
        </div>
      </Rise>
    ))}
  </div>
);

export const Chips: React.FC<{ items: string[] }> = ({ items }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
    {items.map((c, i) => (
      <Rise key={c} delay={6 + i * 5}>
        <div
          style={{
            fontFamily: THEME.body,
            fontWeight: 700,
            fontSize: 40,
            color: THEME.cyan,
            border: `2px solid ${THEME.cyanDim}`,
            borderRadius: 999,
            padding: "14px 30px",
          }}
        >
          {c}
        </div>
      </Rise>
    ))}
  </div>
);

/** Three-step flow, laid out as a row that wraps. */
export const Flow: React.FC<{ steps: string[] }> = ({ steps }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 20,
    }}
  >
    {steps.map((s, i) => (
      <Rise key={s} delay={6 + i * 7}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              flex: "0 0 auto",
              width: 76,
              height: 76,
              borderRadius: 38,
              background: THEME.cyan,
              color: THEME.navyDeep,
              fontFamily: THEME.display,
              fontSize: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {i + 1}
          </div>
          <div
            style={{
              fontFamily: THEME.body,
              fontWeight: 700,
              fontSize: 46,
              color: THEME.white,
            }}
          >
            {s}
          </div>
        </div>
      </Rise>
    ))}
  </div>
);

export const Lockup: React.FC<{ client?: string }> = ({ client }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
    <div
      style={{
        fontFamily: THEME.display,
        fontSize: 84,
        lineHeight: 1.05,
        color: THEME.white,
        textTransform: "uppercase",
      }}
    >
      Intelligent
      <br />
      Automations
    </div>
    <div
      style={{
        width: 160,
        height: 8,
        borderRadius: 4,
        background: THEME.cyan,
      }}
    />
    <div
      style={{
        fontFamily: THEME.body,
        fontWeight: 600,
        fontSize: 38,
        color: THEME.muted,
      }}
    >
      Smarter Solutions. Better Results.
    </div>
    {client ? (
      <div
        style={{
          marginTop: 10,
          fontFamily: THEME.body,
          fontWeight: 700,
          fontSize: 40,
          color: THEME.cyan,
        }}
      >
        Trusted by {client}
      </div>
    ) : null}
  </div>
);
