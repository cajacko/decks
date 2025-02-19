import React from "react";
import { View } from "react-native";
import Stack from "./Stack";
import { useAppSelector } from "@/store/hooks";
import { selectStackIds } from "@/store/slices/tabletop";

export interface TabletopProps {
  tabletopId: string;
}

export default function Tabletop({
  tabletopId,
}: TabletopProps): React.ReactNode {
  const stackIds = useAppSelector((state) =>
    selectStackIds(state, { tabletopId })
  );

  if (!stackIds) {
    throw new Error(`Tabletop with id ${tabletopId} not found`);
  }

  return (
    <View>
      {stackIds.map((stackId) => (
        <Stack key={stackId} stackId={stackId} />
      ))}
    </View>
  );
}
