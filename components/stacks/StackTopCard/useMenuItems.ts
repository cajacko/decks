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
      component: withHoldMenuItem("edit"),
      handleAction: () => {
        setShowEditModal(true);
      },
    };

    const top: MenuItem | undefined = {
      height: cardActionSize,
      width: cardActionSize,
      component: withHoldMenuItem("vertical-align-top"),
      handleAction: () => state.handleMoveToBottom("top"),
    };

    const right: MenuItem = {
      height: cardActionSize,
      width: cardActionSize,
      component: withHoldMenuItem("chevron-right"),
      handleAction: () => state.handleMoveToBottom("right"),
    };

    const left: MenuItem = {
      height: cardActionSize,
      width: cardActionSize,
      component: withHoldMenuItem("chevron-left"),
      handleAction: () => state.handleMoveToBottom("left"),
    };

    return {
      bottom,
      top,
      right,
      left,
    };
  }, [state.handleFlipCard, state.handleMoveToBottom]);

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
