import React from "react";
import { CardRef } from "@/components/Card";
import { CardSidesRef } from "./CardSides.types";
import { Cards } from "@/store/types";
import useFlag from "@/hooks/useFlag";

export default function useCardSides(
  sideProp: Cards.Side,
  ref: React.Ref<CardSidesRef>,
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

  const faceUpRef = React.useRef<CardRef>(null);
  const faceDownRef = React.useRef<CardRef>(null);

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

  return {
    renderSpacer,
    renderFaceUp,
    renderFaceDown,
    faceUpRef,
    faceDownRef,
    flipState,
  };
}
