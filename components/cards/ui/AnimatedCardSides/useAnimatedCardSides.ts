import React from "react";
import { AnimatedCardRef } from "@/components/cards/connected/AnimatedCard";
import { AnimatedCardSidesRef } from "./AnimatedCardSides.types";
import { Cards } from "@/store/types";
import useFlag from "@/hooks/useFlag";
import {
  useDerivedValue,
  useSharedValue,
  interpolate,
  withTiming,
  Extrapolation,
  runOnJS,
} from "react-native-reanimated";

export default function useAnimatedAnimatedSides(
  sideProp: Cards.Side,
  ref: React.Ref<AnimatedCardSidesRef>,
) {
  const animateCards = useFlag("CARD_ANIMATIONS") === "enabled";
  /**
   * 0 = frontScaleX: 1, backScaleX: 0
   * 0.25 = frontScaleX: 0.5, backScaleX: 0
   * 0.5 = frontScaleX: 0, backScaleX: 0
   * 0.75 = frontScaleX: 0, backScaleX: 0.5
   * 1 = frontScaleX: 0, backScaleX: 1
   */
  const flipProgress = useSharedValue(sideProp === "front" ? 0 : 1);

  const frontScaleX = useDerivedValue(() => {
    return interpolate(
      flipProgress.value,
      [0, 0.5],
      [1, 0],
      Extrapolation.CLAMP,
    );
  });

  const backScaleX = useDerivedValue(() => {
    return interpolate(
      flipProgress.value,
      [0.5, 1],
      [0, 1],
      Extrapolation.CLAMP,
    );
  });

  const [flipState, setFlipState] = React.useState<
    | null
    | "flipping-to-back"
    | "flipping-to-front"
    | "flipped-to-front"
    | "flipped-to-back"
  >();

  // useImperativeHandle doesn't use the latest prop so we need to use a ref to store the latest
  // value
  const side = React.useRef(sideProp);
  side.current = sideProp;

  const faceUpRef = React.useRef<AnimatedCardRef>(null);
  const faceDownRef = React.useRef<AnimatedCardRef>(null);

  // We can set flip state to null after we've flipped and the card instance prop has been set to
  // the correct size. If we don't update the component prop then we may get into a bit of a funky
  // state
  React.useEffect(() => {
    flipProgress.value = sideProp === "front" ? 0 : 1;

    setFlipState((prevState) => {
      if (prevState === "flipped-to-front" && side.current === "front") {
        return null;
      }

      if (prevState === "flipped-to-back" && side.current === "back") {
        return null;
      }

      return prevState;
    });
  }, [sideProp, flipProgress]);

  React.useImperativeHandle(ref, () => ({
    animateFlip: async () => {
      if (animateCards) {
        await new Promise<void>((resolve) => {
          flipProgress.value = withTiming(
            flipProgress.value > 0.5 ? 0 : 1,
            {
              duration: 500,
            },
            () => {
              runOnJS(resolve)();
            },
          );
        });
      }

      return side.current === "front" ? "back" : "front";
    },
    animateOut: async (props) => {
      if (!animateCards) return;

      if (side.current === "front") {
        return faceUpRef.current?.animateOut(props);
      } else {
        return faceDownRef.current?.animateOut(props);
      }
    },
    getIsAnimating: () => {
      return (
        faceDownRef.current?.getIsAnimating() ??
        faceUpRef.current?.getIsAnimating() ??
        false
      );
    },
  }));

  // const flipping =
  //   flipState === "flipping-to-back" || flipState === "flipping-to-front";

  // const renderFaceUp =
  //   side.current === "front" || flipping || flipState === "flipped-to-front";

  // const renderFaceDown =
  //   side.current === "back" || flipping || flipState === "flipped-to-back";

  const renderFaceUp = true;
  const renderFaceDown = true;

  // We need to absolutely position the components when they are both being rendered, otherwise
  // they jank around
  const renderSpacer = !!renderFaceUp && !!renderFaceDown;

  return {
    renderSpacer,
    renderFaceUp,
    renderFaceDown,
    faceUpRef,
    faceDownRef,
    flipState,
    frontScaleX,
    backScaleX,
  };
}
