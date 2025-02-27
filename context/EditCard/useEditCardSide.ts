import React from "react";
import { Target } from "@/utils/cardTarget";
import { useContextSelector } from "./useContextSelector";
import useIsContextTarget from "./useIsContextTarget";
import { Cards } from "@/store/types";
import { SetSide, EditCardProviderProps } from "./EditCard.types";

/**
 * Internal hook for EditCardProvider
 */
export function _useSide({
  onChangeSide,
  side: _sideProp = "front",
}: Pick<EditCardProviderProps, "side" | "onChangeSide">) {
  const sideProp = _sideProp;
  const [side, _setSide] = React.useState<Cards.Side>(sideProp);

  const setSide = React.useCallback<SetSide>(
    (_newSide) => {
      _setSide((prevSide) => {
        let newSide: Cards.Side;

        if (typeof _newSide === "function") {
          newSide = _newSide(prevSide);
        } else {
          newSide = _newSide;
        }

        onChangeSide?.(newSide);

        return newSide;
      });
    },
    [onChangeSide],
  );

  React.useEffect(() => {
    setSide(sideProp);
  }, [sideProp, setSide]);

  return [side, setSide] as const;
}

export function useEditCardSide(
  target?: Target,
): Cards.Side | null | undefined {
  const isContextTarget = useIsContextTarget(target);
  const side = useContextSelector((context) => context?.side);

  if (!isContextTarget) return null;

  return side;
}

export function useSetEditCardSide(props?: {
  target?: Target;
  side?: Cards.Side;
}): SetSide | null | undefined {
  const isContextTarget = useIsContextTarget(props?.target);
  const setSide = useContextSelector((context) => context?.setSide);

  React.useEffect(() => {
    if (!isContextTarget) return;
    if (!props?.side) return;

    setSide?.(props?.side);
  }, [props?.side, isContextTarget, setSide]);

  if (!isContextTarget) return null;

  return setSide;
}
