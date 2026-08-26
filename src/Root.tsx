import React from "react";
import { Composition } from "remotion";
import "@fontsource/archivo-black/400.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import { IAVideo } from "./Video";
import { VIDEO } from "./theme";
import { AUDIO_DURATION } from "./captions";

/** Tail padding so the last caption does not cut on the final syllable. */
const TAIL_SECONDS = 0.6;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="IAVideo"
      component={IAVideo}
      width={VIDEO.width}
      height={VIDEO.height}
      fps={VIDEO.fps}
      durationInFrames={Math.max(
        30,
        Math.round((AUDIO_DURATION + TAIL_SECONDS) * VIDEO.fps)
      )}
    />
  </>
);
