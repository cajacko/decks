import { StyleSheet, ScrollView } from "react-native";
import Animated from "react-native-reanimated";
import React from "react";
import BottonDrawer, {
  BottomDrawerWrapper,
  BottomDrawerRef,
  useHeight,
  useMaxHeight,
} from "@/components/BottomDrawer";
import EditCardForm from "@/components/EditCardForm";
import CardSides, { CardSidesRef } from "@/components/CardSides";
import { EditCardProvider, EditCardProviderProps } from "@/context/EditCard";
import { Pressable } from "react-native";
import { Target } from "@/utils/cardTarget";
import { Cards } from "@/store/types";

export type EditCardProps = Pick<
  EditCardProviderProps,
  "onCreateCard" | "onChangeTarget"
> & { target: Target };

export default function EditCard(props: EditCardProps) {
  const height = useHeight();
  const { maxHeight, onContainerLayout } = useMaxHeight();

  const bottomDrawer = React.useRef<BottomDrawerRef>(null);

  const onPress = React.useCallback(() => {
    bottomDrawer.current?.open();
  }, []);

  const [side, setSide] = React.useState<Cards.Side>("front");
  const cardSidesRef = React.useRef<CardSidesRef>(null);

  const flipSide = React.useCallback(async () => {
    await cardSidesRef.current?.animateFlip();

    setSide((side) => (side === "front" ? "back" : "front"));
  }, []);

  return (
    <EditCardProvider onChangeSide={setSide} {...props}>
      <BottomDrawerWrapper
        onLayout={onContainerLayout}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          scrollEnabled
          horizontal={false}
        >
          <Pressable onPress={onPress}>
            <CardSides ref={cardSidesRef} {...props.target} side={side} />
          </Pressable>
          <Animated.View style={[styles.drawerBuffer, height.heightStyle]} />
        </ScrollView>
        <BottonDrawer
          height={height.sharedValue}
          maxHeight={maxHeight}
          ref={bottomDrawer}
          openOnMount
        >
          <EditCardForm flipSide={flipSide} {...props.target} />
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
