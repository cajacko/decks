import React from "react";
import { ScrollView, StyleSheet } from "react-native";
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
    <ScrollView style={styles.container} horizontal>
      {stackIds.map((stackId) => (
        <Stack
          key={stackId}
          stackId={stackId}
          style={styles.stack}
          cardWidth={300}
          leftStackId={stackIds[stackIds.indexOf(stackId) - 1]}
          rightStackId={stackIds[stackIds.indexOf(stackId) + 1]}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  stack: {
    marginHorizontal: 20,
  },
});
