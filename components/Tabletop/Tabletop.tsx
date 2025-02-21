import React from "react";
import { Dimensions, View, ScrollViewProps } from "react-native";
import TabletopToolbar from "@/components/TabletopToolbar";
import { TabletopProps } from "@/components/Tabletop/Tabletop.types";
import { TabletopProvider } from "./Tabletop.context";
import StackList from "../StackList";

export default function Tabletop({
  tabletopId,
  style,
}: TabletopProps): React.ReactNode {
  const [size, setSize] = React.useState<{ height: number; width: number }>(
    Dimensions.get("screen"),
  );

  const handleLayout = React.useCallback<Required<ScrollViewProps>["onLayout"]>(
    (event) => {
      const { width, height } = event.nativeEvent.layout;

      setSize({ width, height });
    },
    [],
  );

  return (
    <TabletopProvider
      height={size.height}
      width={size.width}
      tabletopId={tabletopId}
    >
      <View style={style}>
        <TabletopToolbar />
        <StackList handleLayout={handleLayout} />
      </View>
    </TabletopProvider>
  );
}
