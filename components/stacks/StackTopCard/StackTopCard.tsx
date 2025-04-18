import React from "react";
import CardInstance from "@/components/cards/connected/CardInstance";
import { StackTopCardProps } from "./types";
import HoldMenu from "@/components/ui/HoldMenu";
import useMenuItems from "./useMenuItems";
import EditCardModal from "@/components/editCard/EditCardModal";
import { Target } from "@/utils/cardTarget";
import { StyleProp, ViewStyle } from "react-native";
import { usePerformanceMonitor } from "@/context/PerformanceMonitor";

export * from "./types";

export default function StackTopCard({
  style: styleProp,
  hideActions = false,
  ...props
}: StackTopCardProps): React.ReactNode {
  const state = useMenuItems(props);

  const target = React.useMemo(
    (): Target => ({ id: state.cardId, type: "card" }),
    [state.cardId],
  );

  const style = React.useMemo((): StyleProp<ViewStyle> => {
    if (state.animatedToBack) return [styleProp, { zIndex: 0 }];

    return styleProp;
  }, [styleProp, state.animatedToBack]);

  usePerformanceMonitor({
    Component: StackTopCard.name,
  });

  return (
    <>
      <HoldMenu
        menuItems={state.menuItems}
        handleDoubleTap={state.handleDoubleTap}
        style={style}
        hideActions={hideActions || state.hideMenuItems}
        handleTap={state.handleTap}
      >
        <CardInstance
          {...props}
          ref={state.cardInstanceRef}
          onAnimationChange={state.setIsAnimating}
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
