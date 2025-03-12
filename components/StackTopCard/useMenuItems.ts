import React from "react";
import { StackTopCardProps, StackTopCardMenuItem } from "./types";
import useDispatchActions from "./useDispatchActions";
import { useTabletopContext } from "../Tabletop/Tabletop.context";
import { selectCanEditCard } from "@/store/combinedSelectors/cards";
import { useAppSelector } from "@/store/hooks";
import { MenuItems } from "../HoldMenu";

export default function useMenuItems(props: StackTopCardProps) {
  const state = useDispatchActions(props);
  const canEditCard = useAppSelector((_state) =>
    selectCanEditCard(_state, { cardId: state.cardId }),
  );
  const { buttonSize } = useTabletopContext();
  const [showEditModal, setShowEditModal] = React.useState(false);

  const closeEditModal = React.useCallback(() => {
    setShowEditModal(false);
  }, []);

  const menuItems = React.useMemo((): MenuItems<StackTopCardMenuItem> => {
    const bottom: StackTopCardMenuItem = {
      key: "flip",
      height: buttonSize,
      width: buttonSize,
      icon: "flip",
      onPress: state.handleFlipCard,
    };

    const top: StackTopCardMenuItem | undefined = state.handleMoveToBottom && {
      key: "bottom",
      height: buttonSize,
      width: buttonSize,
      icon: "vertical-align-top",
      onPress: state.handleMoveToBottom,
    };

    const right: StackTopCardMenuItem | undefined = state.moveRight && {
      key: "Rt",
      height: buttonSize,
      width: buttonSize,
      icon: "chevron-right",
      onPress: state.moveRight.top,
    };

    const left: StackTopCardMenuItem | undefined = state.moveLeft && {
      key: "Lt",
      height: buttonSize,
      width: buttonSize,
      icon: "chevron-left",
      onPress: state.moveLeft.top,
    };

    return {
      bottom,
      top,
      right,
      left,
    };
  }, [
    buttonSize,
    state.handleFlipCard,
    state.handleMoveToBottom,
    state.moveRight,
    state.moveLeft,
  ]);

  const handlePress = React.useMemo(() => {
    if (!canEditCard) return undefined;

    return () => {
      setShowEditModal(true);
    };
  }, [canEditCard, setShowEditModal]);

  return {
    cardId: state.cardId,
    menuItems,
    cardInstanceRef: state.cardInstanceRef,
    setIsAnimating: state.setIsAnimating,
    hideActions: state.hideActions,
    showEditModal,
    closeEditModal,
    side: state.side,
    handlePress,
  };
}
