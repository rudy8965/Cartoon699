import React from "react";
import { Composition } from "remotion";
import { Episode, ShotStill, totalFrames } from "./ep1/Episode";
import { LongEpisode, longFrames } from "./ep1/Long";
import { KelirVideo, KelirShotStill, kelirFrames } from "./kelir/Kelir";
import { EP_LONG, EP_SHORT } from "./kelir/episodes";
import { LANDSCAPE, PORTRAIT } from "./kelir/fmt";

const KelirP: React.FC = () => <KelirVideo ep={EP_SHORT} fmt={PORTRAIT} />;
const KelirLongP: React.FC = () => <KelirVideo ep={EP_LONG} fmt={LANDSCAPE} />;
const KelirShotP: React.FC<{ id: number }> = ({ id }) => <KelirShotStill ep={EP_SHORT} fmt={PORTRAIT} id={id} />;
const KelirLongShotP: React.FC<{ id: number }> = ({ id }) => <KelirShotStill ep={EP_LONG} fmt={LANDSCAPE} id={id} />;

export const Root: React.FC = () => (
  <>
    <Composition id="Short" component={Episode} width={1080} height={1920} fps={30} durationInFrames={totalFrames(30)} defaultProps={{ captions: true, music: true }} />
    <Composition id="Long" component={LongEpisode} width={1920} height={1080} fps={30} durationInFrames={longFrames(30)} />
    <Composition id="Short16x9" component={Episode} width={1920} height={1080} fps={30} durationInFrames={totalFrames(30)} defaultProps={{ captions: false, music: true }} />
    <Composition id="Shot" component={ShotStill} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />
    <Composition id="Kelir" component={KelirP} width={1080} height={1920} fps={30} durationInFrames={kelirFrames(EP_SHORT, 30)} />
    <Composition id="KelirShot" component={KelirShotP} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />
    <Composition id="KelirLong" component={KelirLongP} width={1920} height={1080} fps={30} durationInFrames={kelirFrames(EP_LONG, 30)} />
    <Composition id="KelirLongShot" component={KelirLongShotP} width={1920} height={1080} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />
  </>
);
