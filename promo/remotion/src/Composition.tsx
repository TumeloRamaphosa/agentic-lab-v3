import { AbsoluteFill, Sequence } from "remotion";
import { theme, SCENES, sceneStart } from "./theme";
import { Intro } from "./scenes/Intro";
import { Problem } from "./scenes/Problem";
import { Picture } from "./scenes/Picture";
import { Roles } from "./scenes/Roles";
import { Ritual } from "./scenes/Ritual";
import { Pricing } from "./scenes/Pricing";
import { CTA } from "./scenes/CTA";

const scenes: Record<string, React.FC> = {
  intro: Intro,
  problem: Problem,
  picture: Picture,
  roles: Roles,
  ritual: Ritual,
  pricing: Pricing,
  cta: CTA,
};

export const Promo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, fontFamily: theme.font }}>
      {SCENES.map((s) => {
        const Component = scenes[s.id];
        return (
          <Sequence
            key={s.id}
            from={sceneStart(s.id)}
            durationInFrames={s.durationFrames}
          >
            <Component />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
