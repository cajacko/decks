import React from "react";
import { ScrollViewProps, Dimensions } from "react-native";
import { useAppSelector } from "@/store/hooks";
import { selectStackIds } from "@/store/slices/tabletop";
import { TabletopProps } from "@/components/Tabletop/Tabletop.types";

export default function useTabletop({ tabletopId }: TabletopProps) {
  const stackIds = useAppSelector((state) =>
    selectStackIds(state, { tabletopId })
  );

  const [size, setSize] = React.useState<{ height: number; width: number }>(
    Dimensions.get("screen")
  );

  const handleLayout = React.useCallback<Required<ScrollViewProps>["onLayout"]>(
    (event) => {
      const { width, height } = event.nativeEvent.layout;

      setSize({ width, height });
    },
    []
  );

  if (!stackIds) {
    throw new Error(`Tabletop with id ${tabletopId} not found`);
  }

  return {
    stackIds,
    size,
    handleLayout,
  };
}
