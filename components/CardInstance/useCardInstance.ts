import React from "react";
import { CardInstanceState, selectCardInstance } from "@/store/slices/tabletop";
import { useRequiredAppSelector } from "@/store/hooks";
import { CardRef } from "@/components/Card";
import { useTabletopContext } from "@/components/Tabletop/Tabletop.context";
import { CardInstanceProps, CardInstanceRef } from "./CardInstance.types";

export default function useCardInstance(
  props: Pick<CardInstanceProps, "cardInstanceId">,
  ref: React.Ref<CardInstanceRef>,
) {
  const { tabletopId } = useTabletopContext();

  const cardInstance = useRequiredAppSelector((state) =>
    selectCardInstance(state, {
      cardInstanceId: props.cardInstanceId,
      tabletopId,
    }),
  );

  const [flipState, setFlipState] = React.useState<
    | null
    | "flipping-to-back"
    | "flipping-to-front"
    | "flipped-to-front"
    | "flipped-to-back"
  >();

  const state = React.useRef(cardInstance.state);
  state.current = cardInstance.state;

  const faceUpRef = React.useRef<CardRef>(null);
  const faceDownRef = React.useRef<CardRef>(null);

  // We can set flip state to null after we've flipped and the card instance prop has been set to
  // the correct size. If we don't update the component prop then we may get into a bit of a funky
  // state
  React.useEffect(() => {
    setFlipState((prevState) => {
      if (
        prevState === "flipped-to-front" &&
        cardInstance.state === CardInstanceState.faceUp
      ) {
        return null;
      }

      if (
        prevState === "flipped-to-back" &&
        cardInstance.state === CardInstanceState.faceDown
      ) {
        return null;
      }

      return prevState;
    });
  }, [cardInstance.state]);

  React.useImperativeHandle(ref, () => ({
    animateFlip: async () => {
      if (state.current === CardInstanceState.faceUp) {
        setFlipState("flipping-to-back");

        await faceUpRef.current?.animateFlipOut();
        await faceDownRef.current?.animateFlipIn();

        setFlipState("flipped-to-back");
      } else {
        setFlipState("flipping-to-front");

        await faceDownRef.current?.animateFlipOut();
        await faceUpRef.current?.animateFlipIn();

        setFlipState("flipped-to-front");
      }
    },
    animateOut: async (props) => {
      if (state.current === CardInstanceState.faceUp) {
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
    cardInstance.state === CardInstanceState.faceUp ||
    flipping ||
    flipState === "flipped-to-front";

  const renderFaceDown =
    cardInstance.state === CardInstanceState.faceDown ||
    flipping ||
    flipState === "flipped-to-back";

  return {
    renderFaceUp,
    renderFaceDown,
    faceUpRef,
    faceDownRef,
    cardInstance,
    flipState,
  };
}
