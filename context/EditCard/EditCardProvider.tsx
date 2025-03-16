import React from "react";
import * as Types from "./EditCard.types";
import { context as Context } from "./useContextSelector";
import { _useTarget } from "./useTarget";
import { _useSide } from "./useEditCardSide";
import useEditCardState from "./useEditCardState";
import debugLog from "./debugLog";

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
  const { state, updateEditingDataItem } = useEditCardState(target);

  const value = React.useMemo<Types.EditCardContext>(() => {
    debugLog(`${EditCardProvider.name} - context change`, state);

    return {
      state,
      onCreateCard,
      setTarget,
      side,
      setSide,
      updateEditingDataItem,
    };
  }, [state, onCreateCard, setTarget, side, setSide, updateEditingDataItem]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
