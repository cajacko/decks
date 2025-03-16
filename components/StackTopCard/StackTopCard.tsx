import React from "react";
import CardInstance, { CardInstanceProps } from "@/components/CardInstance";
import { StackTopCardProps } from "./types";
import HoldMenu from "../HoldMenu";
import useMenuItems from "./useMenuItems";
import EditCardModal from "../EditCardModal";
import { Target } from "@/utils/cardTarget";
import { StyleProp, ViewStyle } from "react-native";

export * from "./types";

export default function StackTopCard({
  style: styleProp,
  ...props
}: StackTopCardProps): React.ReactNode {
  const state = useMenuItems(props);

  const cardProps = React.useMemo(
    (): CardInstanceProps["CardProps"] => ({
      ...props.CardProps,
      onAnimationChange: state.setIsAnimating,
    }),
    [props.CardProps, state.setIsAnimating],
  );

  const target = React.useMemo(
    (): Target => ({ id: state.cardId, type: "card" }),
    [state.cardId],
  );

  const style = React.useMemo((): StyleProp<ViewStyle> => {
    if (state.animatedToBack) return [styleProp, { zIndex: 0 }];

    return styleProp;
  }, [styleProp, state.animatedToBack]);

  return (
    <>
      <HoldMenu
        menuItems={state.menuItems}
        handlePress={state.handlePress}
        style={style}
        hideActions={state.hideActions}
      >
        <CardInstance
          {...props}
          ref={state.cardInstanceRef}
          CardProps={cardProps}
        />
      </HoldMenu>
      <EditCardModal
        visible={state.showEditModal}
        onRequestClose={state.closeEditModal}
        target={target}
        initialSide={state.side}
        onDelete={state.closeEditModal}
      />
    </>
  );
}
