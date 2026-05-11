import { Composition } from "remotion";
import { Promo } from "./Composition";

const FPS = 30;
const DURATION_SECONDS = 60;

export const Root: React.FC = () => {
  return (
    <Composition
      id="Promo"
      component={Promo}
      durationInFrames={FPS * DURATION_SECONDS}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
