import { StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Animated from "react-native-reanimated";
import React from "react";
import BottonDrawer, {
  BottomDrawerWrapper,
  BottomDrawerRef,
  useHeight,
  useMaxHeight,
} from "@/components/BottomDrawer";
import EditCardForm from "@/components/EditCardForm";
import EditCard from "@/components/EditCard";
import { EditCardProvider } from "@/context/EditCard";

export default function Modal() {
  const { cardId } = useLocalSearchParams();

  if (typeof cardId !== "string") {
    throw new Error("cardId must be a string");
  }

  const height = useHeight();
  const { maxHeight, onContainerLayout } = useMaxHeight();

  const bottomDrawer = React.useRef<BottomDrawerRef>(null);

  const onPress = React.useCallback(() => {
    bottomDrawer.current?.open();
  }, []);

  return (
    <EditCardProvider cardId={cardId}>
      <BottomDrawerWrapper
        onLayout={onContainerLayout}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          scrollEnabled
          horizontal={false}
        >
          <EditCard cardId={cardId} onPress={onPress} />
          <Animated.View style={[styles.drawerBuffer, height.heightStyle]} />
        </ScrollView>
        <BottonDrawer
          height={height.sharedValue}
          maxHeight={maxHeight}
          ref={bottomDrawer}
        >
          <EditCardForm cardId={cardId} />
        </BottonDrawer>
      </BottomDrawerWrapper>
    </EditCardProvider>
  );
}

const borderRadius = 20;
const dragOverlap = 20;
const dragBuffer = 10;
const dragHeaderHeight = Math.max(30, borderRadius);
const dragHeight = dragHeaderHeight + dragOverlap + dragBuffer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  contentContainer: {
    paddingVertical: 40,
    paddingHorizontal: 10,
    minHeight: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  drawerBuffer: {
    opacity: 0,
    width: "100%",
  },
  content: {
    backgroundColor: "white",
    flex: 1,
    marginTop: dragHeight - dragOverlap - dragBuffer,
  },
});
