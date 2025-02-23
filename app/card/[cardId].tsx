import { StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import React from "react";
import BottonDrawer, {
  BottomDrawerWrapper,
  BottomDrawerRef,
} from "@/components/BottomDrawer";
import EditCardForm from "@/components/EditCardForm";
import EditCard from "@/components/EditCard";

export default function Modal() {
  const { cardId } = useLocalSearchParams();

  const height = useSharedValue(100);
  const minHeight = useSharedValue(100);
  const maxHeight = useSharedValue(500);

  const bufferStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  const bottomDrawer = React.useRef<BottomDrawerRef>(null);

  return (
    <BottomDrawerWrapper style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        scrollEnabled
        horizontal={false}
      >
        {typeof cardId === "string" && <EditCard cardId={cardId} />}
        <Animated.View style={[styles.drawerBuffer, bufferStyle]} />
      </ScrollView>
      <BottonDrawer
        height={height}
        minHeight={minHeight}
        maxHeight={maxHeight}
        ref={bottomDrawer}
      >
        {typeof cardId === "string" && <EditCardForm cardId={cardId} />}
      </BottonDrawer>
    </BottomDrawerWrapper>
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
  scrollContainer: {},
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
