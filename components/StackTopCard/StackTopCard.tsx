import React from "react";
import CardInstance from "@/components/CardInstance";
import CardAction from "@/components/CardAction";
import {
  StackTopCardProps,
  StackTopCardMenuItem,
  StackTopCardRenderItem,
} from "./types";
import HoldMenu from "../HoldMenu";
import useMenuItems from "./useMenuItems";

export * from "./types";

export default function StackTopCard(
  props: StackTopCardProps,
): React.ReactNode {
  const state = useMenuItems(props);

  const renderItem = React.useCallback(
    (menuItem: StackTopCardRenderItem) => (
      <CardAction
        icon={menuItem.icon}
        active={menuItem.highlight}
        onPress={menuItem.onPress}
        style={{
          height: menuItem.height,
          width: menuItem.width,
        }}
      />
    ),
    [],
  );

  const handleAction = React.useCallback(
    ({ onPress }: StackTopCardMenuItem) => onPress(),
    [],
  );

  return (
    <CardInstance
      {...props}
      ref={state.cardRef}
      onAnimationChange={state.setIsAnimating}
    >
      <HoldMenu
        menuItems={state.menuItems}
        handleAction={handleAction}
        renderItem={renderItem}
      />
    </CardInstance>
  );
}
