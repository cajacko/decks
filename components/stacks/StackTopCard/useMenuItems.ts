import React from "react";
import { StackTopCardProps } from "./types";
import useDispatchActions from "./useDispatchActions";
import { MenuItems, MenuItem } from "@/components/ui/HoldMenu";
import withHoldMenuItem from "./withHoldMenuItem";
import { cardActionSize } from "@/components/forms/CardAction";

export default function useMenuItems(props: StackTopCardProps) {
  const state = useDispatchActions(props);
  const [showEditModal, setShowEditModal] = React.useState(false);

  const closeEditModal = React.useCallback(() => {
    setShowEditModal(false);
  }, []);

  const menuItems = React.useMemo((): MenuItems => {
    const bottom: MenuItem = {
      height: cardActionSize,
      width: cardActionSize,
      component: withHoldMenuItem("edit", state.handleFlipCard),
      handleAction: () => {
        setShowEditModal(true);
      },
    };

    const top: MenuItem | undefined = state.handleMoveToBottom && {
      height: cardActionSize,
      width: cardActionSize,
      component: withHoldMenuItem(
        "vertical-align-top",
        state.handleMoveToBottom,
      ),
      handleAction: state.handleMoveToBottom,
    };

    const right: MenuItem = {
      height: cardActionSize,
      width: cardActionSize,
      component: withHoldMenuItem("chevron-right", state.moveRight.top),
      handleAction: state.moveRight.top,
    };

    const left: MenuItem = {
      height: cardActionSize,
      width: cardActionSize,
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
    state.handleFlipCard,
    state.handleMoveToBottom,
    state.moveRight,
    state.moveLeft,
  ]);

  const handleDoubleTap = React.useCallback(() => {
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
    handleDoubleTap: state.isAnimating ? undefined : handleDoubleTap,
    handleTap: state.isAnimating ? undefined : state.handleFlipCard,
    animatedToBack: state.animatedToBack,
    hideMenuItems: state.isAnimating,
  };
}
