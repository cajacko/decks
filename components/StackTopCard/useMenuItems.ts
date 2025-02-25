import React from "react";
import { useRouter } from "expo-router";
import { StackTopCardProps, StackTopCardMenuItem } from "./types";
import useDispatchActions from "./useDispatchActions";
import { useTabletopContext } from "../Tabletop/Tabletop.context";

export default function useMenuItems(props: StackTopCardProps) {
  const state = useDispatchActions(props);
  const { buttonSize, cardWidth, cardHeight } = useTabletopContext();
  const router = useRouter();

  const menuItems = React.useMemo(() => {
    const centerLeft = cardWidth / 2 - buttonSize / 2;
    const top = -buttonSize / 2;
    const bottom = cardHeight - buttonSize / 2;
    const left = -buttonSize / 2;
    const right = cardWidth - buttonSize / 2;
    // const sideTop = cardHeight / 2 - buttonSize * 1.25;
    // const sideBottom = sideTop + buttonSize * 1.5;
    const sideMiddle = cardHeight / 2 - buttonSize / 2;
    const verticalLeft = cardWidth / 2 - buttonSize * 1.5;
    const verticalRight = cardWidth / 2 + buttonSize * 0.5;

    const items: StackTopCardMenuItem[] = [
      {
        key: "flip",
        top: bottom,
        left: verticalLeft,
        height: buttonSize,
        width: buttonSize,
        icon: "Fl",
        onPress: state.handleFlipCard,
      },
      {
        key: "edit",
        top: bottom,
        left: verticalRight,
        height: buttonSize,
        width: buttonSize,
        icon: "Ed",
        onPress: () => router.push(`/card/${state.cardId}`),
      },
    ];

    if (state.handleMoveToBottom) {
      items.push({
        key: "bottom",
        top: top,
        left: centerLeft,
        height: buttonSize,
        width: buttonSize,
        icon: "B",
        onPress: state.handleMoveToBottom,
      });
    }

    if (state.moveRight) {
      items.push({
        key: "Rt",
        top: sideMiddle,
        left: right,
        height: buttonSize,
        width: buttonSize,
        icon: "Rt",
        onPress: state.moveRight.top,
      });
    }

    if (state.moveLeft) {
      items.push({
        key: "Lt",
        top: sideMiddle,
        left: left,
        height: buttonSize,
        width: buttonSize,
        icon: "Lt",
        onPress: state.moveLeft.top,
      });
    }

    return items;
  }, [
    buttonSize,
    cardHeight,
    cardWidth,
    state.handleFlipCard,
    state.handleMoveToBottom,
    state.moveRight,
    state.moveLeft,
    router,
    state.cardId,
  ]);

  return {
    menuItems,
    cardInstanceRef: state.cardInstanceRef,
    setIsAnimating: state.setIsAnimating,
    hideActions: state.hideActions,
  };
}
