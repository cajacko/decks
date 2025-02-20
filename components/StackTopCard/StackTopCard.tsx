import React from "react";
import CardInstance from "@/components/CardInstance";
import CardAction, { size } from "@/components/CardAction";
import { StackTopCardProps } from "./types";
import useDispatchActions from "./useDispatchActions";
import HoldMenu, { MenuItem } from "../HoldMenu";

export * from "./types";

export default function StackTopCard(
  props: StackTopCardProps
): React.ReactNode {
  const state = useDispatchActions(props);

  const menuItems = React.useMemo(() => {
    const centerLeft = props.width / 2 - size / 2;
    const top = -size / 2;
    const bottom = props.height - size / 2;
    const left = -size / 2;
    const right = props.width - size / 2;
    const sideTop = props.height / 2 - size * 1.25;
    const sideBottom = sideTop + size * 1.5;

    const items: MenuItem<{ icon: string; onPress: () => unknown }>[] = [
      {
        key: "flip",
        top: bottom,
        left: centerLeft,
        height: size,
        width: size,
        icon: "Fl",
        onPress: state.handleFlipCard,
      },
    ];

    if (state.handleMoveToBottom) {
      items.push({
        key: "bottom",
        top: top,
        left: centerLeft,
        height: size,
        width: size,
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
          height: size,
          width: size,
          icon: "Rt",
          onPress: state.moveRight.top,
        },
        {
          key: "Rb",
          top: sideBottom,
          left: right,
          height: size,
          width: size,
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
          height: size,
          width: size,
          icon: "Lt",
          onPress: state.moveLeft.top,
        },
        {
          key: "Lb",
          top: sideBottom,
          left: left,
          height: size,
          width: size,
          icon: "Lb",
          onPress: state.moveLeft.bottom,
        }
      );
    }

    return items;
  }, [
    props.height,
    props.width,
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
