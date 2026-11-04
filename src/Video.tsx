import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { THEME, SAFE, VIDEO } from "./theme";
import { LINES } from "./script";
import { SCENES, SceneBody } from "./scenes/Scenes";
import { Caption } from "./components/Caption";
import { TIMINGS } from "./captions";

/** Moving background: two slow glows and a faint dot grid, so no frame is
 *  ever a flat colour. Purely decorative, never carries content. */
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const a = frame / 90;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 80% at 50% 0%, ${THEME.navy} 0%, ${THEME.navyDeep} 70%)`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: 450,
          left: 300 + Math.sin(a) * 220,
          top: 200 + Math.cos(a * 0.8) * 160,
          background: "radial-gradient(circle, rgba(31,182,255,0.20) 0%, rgba(31,182,255,0) 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: 400,
          left: -200 + Math.cos(a * 0.7) * 200,
          top: 1100 + Math.sin(a * 0.9) * 180,
          background: "radial-gradient(circle, rgba(31,182,255,0.12) 0%, rgba(31,182,255,0) 65%)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 2px, transparent 2px)",
          backgroundSize: "54px 54px",
          backgroundPosition: `0px ${(frame * 0.6) % 54}px`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Quick punch-in at the start of every scene. Scene 1 is fully visible on
 *  frame 0 (no fade from black) so the first frame works as a thumbnail. */
const Enter: React.FC<{ first: boolean; children: React.ReactNode }> = ({ first, children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill
      style={{
        opacity: first ? 1 : t,
        transform: `scale(${interpolate(t, [0, 1], [first ? 1.03 : 1.06, 1])})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const IAVideo: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Audio src={staticFile("voiceover.mp3")} />
    {SCENES.map((scene, i) => {
      const t = TIMINGS[i];
      if (!t) return null;
      const from = Math.round(t.start * VIDEO.fps);
      const durationInFrames = Math.max(
        1,
        Math.round((t.end - t.start) * VIDEO.fps)
      );
      return (
        <Sequence key={i} from={from} durationInFrames={durationInFrames}>
          <Enter first={i === 0}>
            <AbsoluteFill
              style={{
                paddingTop: SAFE.top,
                paddingBottom: SAFE.bottom,
                paddingLeft: SAFE.side,
                paddingRight: SAFE.side,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Visual area takes the free space and centres itself. */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  minHeight: 0,
                }}
              >
                <SceneBody scene={scene} />
              </div>
              {/* minHeight, not height. A fixed height meant a caption taller
                  than the band overflowed UPWARD and printed on top of the
                  cards. flexShrink 0 stops the band being compressed instead. */}
              <div
                style={{
                  minHeight: 250,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  paddingTop: 30,
                }}
              >
                <Caption line={LINES[i] ?? ""} highlights={scene.highlights} />
              </div>
            </AbsoluteFill>
          </Enter>
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
