import { Composition } from "remotion";
import { Promo } from "./Composition";

const FPS = 30;
const DURATION_SECONDS = 84; // genesis(8)+intro(5)+problem(7)+picture(9)+roles(8)+factory(12)+dashboard(12)+ritual(9)+pricing(7)+cta(7)

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
