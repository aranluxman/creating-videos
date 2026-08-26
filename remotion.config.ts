import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// 2-core cloud container. Higher concurrency causes OOM kills mid-render.
Config.setConcurrency(1);
Config.setChromiumOpenGlRenderer("swangle");
