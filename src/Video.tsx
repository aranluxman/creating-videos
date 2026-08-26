import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { THEME, SAFE, VIDEO } from "./theme";
import { LINES } from "./script";
import { SCENES, SceneBody } from "./scenes/Scenes";
import { Caption } from "./components/Caption";
import { TIMINGS } from "./captions";

const Background: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 80% at 50% 0%, ${THEME.navy} 0%, ${THEME.navyDeep} 70%)`,
    }}
  />
);

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
                minHeight: 340,
                flexShrink: 0,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <Caption line={LINES[i] ?? ""} highlights={scene.highlights} />
            </div>
          </AbsoluteFill>
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
