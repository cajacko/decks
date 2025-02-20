import React from "react";
import CardInstance from "@/components/CardInstance";
import CardAction from "@/components/CardAction";
import { StackTopCardProps } from "./types";
import useDispatchActions from "./useDispatchActions";
import HoldMenu, { MenuItem } from "../HoldMenu";
import { useTabletopContext } from "../Tabletop/Tabletop.context";

export * from "./types";

export default function StackTopCard(
  props: StackTopCardProps
): React.ReactNode {
  const state = useDispatchActions(props);
  const { buttonSize, cardWidth, cardHeight } = useTabletopContext();

  const menuItems = React.useMemo(() => {
    const centerLeft = cardWidth / 2 - buttonSize / 2;
    const top = -buttonSize / 2;
    const bottom = cardHeight - buttonSize / 2;
    const left = -buttonSize / 2;
    const right = cardWidth - buttonSize / 2;
    const sideTop = cardHeight / 2 - buttonSize * 1.25;
    const sideBottom = sideTop + buttonSize * 1.5;

    const items: MenuItem<{ icon: string; onPress: () => unknown }>[] = [
      {
        key: "flip",
        top: bottom,
        left: centerLeft,
        height: buttonSize,
        width: buttonSize,
        icon: "Fl",
        onPress: state.handleFlipCard,
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
      items.push(
        {
          key: "Rt",
          top: sideTop,
          left: right,
          height: buttonSize,
          width: buttonSize,
          icon: "Rt",
          onPress: state.moveRight.top,
        },
        {
          key: "Rb",
          top: sideBottom,
          left: right,
          height: buttonSize,
          width: buttonSize,
          icon: "Rb",
          onPress: state.moveRight.bottom,
        }
      );
    }

    if (state.moveLeft) {
      items.push(
        {
          key: "Lt",
          top: sideTop,
          left: left,
          height: buttonSize,
          width: buttonSize,
          icon: "Lt",
          onPress: state.moveLeft.top,
        },
        {
          key: "Lb",
          top: sideBottom,
          left: left,
          height: buttonSize,
          width: buttonSize,
          icon: "Lb",
          onPress: state.moveLeft.bottom,
        }
      );
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
  ]);

  return (
    <CardInstance
      {...props}
      ref={state.cardRef}
      onAnimationChange={state.setIsAnimating}
    >
      <HoldMenu
        menuItems={menuItems}
        handleAction={({ onPress }) => onPress()}
        renderItem={(menuItem) => (
          <CardAction
            icon={menuItem.icon}
            active={menuItem.highlight}
            onPress={menuItem.onPress}
            style={{
              height: menuItem.height,
              width: menuItem.width,
            }}
          />
        )}
      />
    </CardInstance>
  );
}
