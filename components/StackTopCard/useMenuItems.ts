import React from "react";
import { StackTopCardProps } from "./types";
import useDispatchActions from "./useDispatchActions";
import { useTabletopContext } from "../Tabletop/Tabletop.context";
import { selectCanEditCard } from "@/store/combinedSelectors/cards";
import { useAppSelector } from "@/store/hooks";
import { MenuItems, MenuItem } from "../HoldMenu";
import withHoldMenuItem from "./withHoldMenuItem";
import useCopyToEditAlert from "@/hooks/useCopyToEditAlert";

export default function useMenuItems(props: StackTopCardProps) {
  const state = useDispatchActions(props);
  const canEditCard = useAppSelector((_state) =>
    selectCanEditCard(_state, { cardId: state.cardId }),
  );
  const { open: openCopyAlert, component: copyAlert } = useCopyToEditAlert({
    deckId: state.deckId,
  });
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
    if (canEditCard) {
      setShowEditModal(true);
    } else {
      openCopyAlert();
    }
  }, [canEditCard, setShowEditModal, openCopyAlert]);

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
    animatedToBack: state.animatedToBack,
    copyAlert,
  };
}
