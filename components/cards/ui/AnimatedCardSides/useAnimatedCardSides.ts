import React from "react";
import { AnimatedCardRef } from "@/components/cards/connected/AnimatedCard";
import { AnimatedCardSidesRef } from "./AnimatedCardSides.types";
import { Cards } from "@/store/types";
import useFlag from "@/hooks/useFlag";
import uuid from "@/utils/uuid";
import { Platform } from "react-native";

export default function useAnimatedAnimatedSides(
  sideProp: Cards.Side,
  ref: React.Ref<AnimatedCardSidesRef>,
) {
  const animateCards = useFlag("CARD_ANIMATIONS") === "enabled";

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
    setFlipState((prevState) => {
      if (prevState === "flipped-to-front" && side.current === "front") {
        return null;
      }

      if (prevState === "flipped-to-back" && side.current === "back") {
        return null;
      }

      return prevState;
    });
  }, [side]);

  React.useImperativeHandle(ref, () => ({
    animateFlip: async () => {
      if (side.current === "front") {
        if (animateCards) {
          setFlipState("flipping-to-back");

          await faceUpRef.current?.animateFlipOut();
          await faceDownRef.current?.animateFlipIn();
        }

        setFlipState("flipped-to-back");

        return "back";
      }

      if (animateCards) {
        setFlipState("flipping-to-front");

        await faceDownRef.current?.animateFlipOut();
        await faceUpRef.current?.animateFlipIn();
      }

      setFlipState("flipped-to-front");

      return "front";
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

  const flipping =
    flipState === "flipping-to-back" || flipState === "flipping-to-front";

  const renderFaceUp =
    side.current === "front" || flipping || flipState === "flipped-to-front";

  const renderFaceDown =
    side.current === "back" || flipping || flipState === "flipped-to-back";

  // We need to absolutely position the components when they are both being rendered, otherwise
  // they jank around
  const renderSpacer = !!renderFaceUp && !!renderFaceDown;

  const [_templateKey, setTemplateKey] = React.useState(uuid);

  // NOTE: This is a specific android fix which will cause a re-mount of the card template after a
  // flip to either side. This is due to a bug where large emojis are blurring out after the flip
  // animation. Remounting the component after fixes this
  React.useEffect(() => {
    if (Platform.OS !== "android") return;
    if (flipState !== "flipped-to-back" && flipState !== "flipped-to-front") {
      return;
    }

    setTemplateKey(uuid());
  }, [flipState]);

  return {
    renderSpacer,
    renderFaceUp,
    renderFaceDown,
    faceUpRef,
    faceDownRef,
    flipState,
    _templateKey,
  };
}
