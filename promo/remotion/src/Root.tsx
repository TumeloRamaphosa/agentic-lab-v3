import { Composition } from "remotion";
import { Promo } from "./Composition";
import { VaultSphere } from "./scenes/VaultSphere";
import { VaultSphereSBS } from "./scenes/VaultSphereSBS";

const FPS = 30;
const DURATION_SECONDS = 84; // genesis(8)+intro(5)+problem(7)+picture(9)+roles(8)+factory(12)+dashboard(12)+ritual(9)+pricing(7)+cta(7)

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Promo"
        component={Promo}
        durationInFrames={FPS * DURATION_SECONDS}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* Vault knowledge sphere — monoscopic (plays as a floating screen on XREAL) */}
      <Composition
        id="VaultSphere"
        component={VaultSphere}
        durationInFrames={FPS * 20}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* Vault sphere — stereoscopic Side-by-Side for XREAL One Pro 3D mode (3840×1080) */}
      <Composition
        id="VaultSphereSBS"
        component={VaultSphereSBS}
        durationInFrames={FPS * 20}
        fps={FPS}
        width={3840}
        height={1080}
      />
    </>
  );
};
