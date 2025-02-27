import React from "react";
import * as Types from "./EditCard.types";
import { context as Context } from "./useContextSelector";
import { _useTarget } from "./useTarget";
import { _useSide } from "./useEditCardSide";
import useEditCardState from "./useEditCardState";

export default function EditCardProvider({
  onCreateCard = null,
  onChangeSide,
  target: propsTarget,
  children,
  onChangeTarget,
  side: propsSide,
}: Types.EditCardProviderProps) {
  const [target, setTarget] = _useTarget({
    target: propsTarget,
    onChangeTarget,
  });

  const [side, setSide] = _useSide({ side: propsSide, onChangeSide });
  const [state, editState] = useEditCardState(target);

  const value = React.useMemo<Types.EditCardContext>(
    () => ({ state, editState, onCreateCard, setTarget, side, setSide }),
    [state, editState, onCreateCard, setTarget, side, setSide],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
