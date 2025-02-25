import React from "react";
import CardInstance, { CardInstanceProps } from "@/components/CardInstance";
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

  const cardProps = React.useMemo(
    (): CardInstanceProps["CardProps"] => ({
      ...props.CardProps,
      onAnimationChange: state.setIsAnimating,
      overlay: !state.hideActions && (
        <HoldMenu
          menuItems={state.menuItems}
          handleAction={handleAction}
          renderItem={renderItem}
        />
      ),
    }),
    [
      props.CardProps,
      state.setIsAnimating,
      state.hideActions,
      state.menuItems,
      handleAction,
      renderItem,
    ],
  );

  return (
    <CardInstance
      {...props}
      ref={state.cardInstanceRef}
      CardProps={cardProps}
    />
  );
}
