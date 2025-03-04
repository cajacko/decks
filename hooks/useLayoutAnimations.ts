import useFlag from "./useFlag";
import { FadeIn } from "react-native-reanimated";

export const enteringDuration = 300;

const entering = FadeIn.duration(enteringDuration);
// We prefer quick exit but subtle entrance, can make things feel smoother and then doesn't have
// overlapping animations
const exiting = undefined;

export default function useLayoutAnimations() {
  const useLayoutAnimations = useFlag("GENERAL_LAYOUT_ANIMATIONS");

  if (!useLayoutAnimations) return {};

  return {
    entering,
    exiting,
  };
}
