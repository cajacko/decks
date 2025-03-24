import React from "react";
import { StackTopCardProps } from "./types";
import useDispatchActions from "./useDispatchActions";
import { useTabletopContext } from "@/components/Tabletop/Tabletop.context";
import { MenuItems, MenuItem } from "@/components/HoldMenu";
import withHoldMenuItem from "./withHoldMenuItem";

export default function useMenuItems(props: StackTopCardProps) {
  const state = useDispatchActions(props);
  const { buttonSize } = useTabletopContext();
  const [showEditModal, setShowEditModal] = React.useState(false);

  const closeEditModal = React.useCallback(() => {
    setShowEditModal(false);
  }, []);

  const menuItems = React.useMemo((): MenuItems => {
    const bottom: MenuItem = {
      height: buttonSize,
      width: buttonSize,
      component: withHoldMenuItem("flip", state.handleFlipCard),
      handleAction: state.handleFlipCard,
    };

    const top: MenuItem | undefined = state.handleMoveToBottom && {
      height: buttonSize,
      width: buttonSize,
      component: withHoldMenuItem(
        "vertical-align-top",
        state.handleMoveToBottom,
      ),
      handleAction: state.handleMoveToBottom,
    };

    const right: MenuItem | undefined = state.moveRight && {
      height: buttonSize,
      width: buttonSize,
      component: withHoldMenuItem("chevron-right", state.moveRight.top),
      handleAction: state.moveRight.top,
    };

    const left: MenuItem | undefined = state.moveLeft && {
      height: buttonSize,
      width: buttonSize,
      component: withHoldMenuItem("chevron-left", state.moveLeft.top),
      handleAction: state.moveLeft.top,
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

  const handlePress = React.useCallback(() => {
    setShowEditModal(true);
  }, [setShowEditModal]);

  return {
    cardId: state.cardId,
    menuItems: state.isAnimating ? null : menuItems,
    cardInstanceRef: state.cardInstanceRef,
    setIsAnimating: state.setIsAnimating,
    showEditModal,
    closeEditModal,
    side: state.side,
    handlePress: state.isAnimating ? undefined : handlePress,
    animatedToBack: state.animatedToBack,
  };
}
