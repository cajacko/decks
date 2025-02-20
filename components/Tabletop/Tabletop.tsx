import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Stack from "@/components/Stack";
import TabletopToolbar from "@/components/TabletopToolbar";
import { TabletopProps } from "@/components/Tabletop/Tabletop.types";
import useTabletop from "./useTabletop";
import { TabletopProvider, TabletopContextProps } from "./Tabletop.context";

export default function Tabletop({
  tabletopId,
  style,
}: TabletopProps): React.ReactNode {
  const state = useTabletop({ tabletopId });

  return (
    <TabletopProvider
      height={state.size.height}
      width={state.size.width}
      tabletopId={tabletopId}
    >
      {React.useCallback(
        ({ stackWidth, spaceBetweenStacks }: TabletopContextProps) => (
          <View style={style}>
            <TabletopToolbar tabletopId={tabletopId} />
            <ScrollView
              onLayout={state.handleLayout}
              style={StyleSheet.flatten([styles.scrollView])}
              contentContainerStyle={styles.contentContainer}
              horizontal
              snapToAlignment="center"
              // FIXME: Shouldn't need to add this buffer the calcs should work
              snapToInterval={stackWidth + 10}
              decelerationRate="fast"
            >
              {state.stackIds.map((stackId) => (
                <Stack
                  key={stackId}
                  stackId={stackId}
                  style={{ paddingHorizontal: spaceBetweenStacks / 2 }}
                  leftStackId={
                    state.stackIds[state.stackIds.indexOf(stackId) - 1]
                  }
                  rightStackId={
                    state.stackIds[state.stackIds.indexOf(stackId) + 1]
                  }
                  availableHeight={state.size.height}
                  availableWidth={state.size.width}
                />
              ))}
            </ScrollView>
          </View>
        ),
        []
      )}
    </TabletopProvider>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: "row",
  },
  contentContainer: {
    alignItems: "center",
  },
});
