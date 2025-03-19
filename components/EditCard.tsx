import {
  StyleSheet,
  ScrollView,
  ViewStyle,
  View,
  Pressable,
  Dimensions,
} from "react-native";
import Animated from "react-native-reanimated";
import React from "react";
import BottonDrawer, {
  BottomDrawerWrapper,
  BottomDrawerRef,
  useHeight,
  useMaxHeight,
} from "@/components/BottomDrawer";
import EditCardForm from "@/components/EditCardForm";
import AnimatedCardSides, {
  AnimatedCardSidesRef,
} from "@/components/cards/connected/AnimatedCardSides";
import { EditCardProvider, EditCardProviderProps } from "@/context/EditCard";
import { Target } from "@/utils/cardTarget";
import { Cards } from "@/store/types";
import { TabletopCardSizeProvider } from "@/components/Tabletop/Tabletop.context";

export type EditCardProps = Pick<
  EditCardProviderProps,
  "onCreateCard" | "onChangeTarget"
> & {
  target: Target;
  initialSide?: Cards.Side | null;
  onDelete?: () => void;
  onPressBackground?: () => void;
  backgroundStyle?: ViewStyle;
};

export default function EditCard({
  initialSide,
  onPressBackground,
  backgroundStyle: backgroundStyleProp,
  ...props
}: EditCardProps) {
  const height = useHeight();
  const { maxHeight, onContainerLayout } = useMaxHeight();

  const bottomDrawer = React.useRef<BottomDrawerRef>(null);

  const onPress = React.useCallback(() => {
    bottomDrawer.current?.open();
  }, []);

  const [side, setSide] = React.useState<Cards.Side>(initialSide ?? "front");
  const cardSidesRef = React.useRef<AnimatedCardSidesRef>(null);

  const flipSide = React.useCallback(async () => {
    await cardSidesRef.current?.animateFlip();

    setSide((side) => (side === "front" ? "back" : "front"));
  }, []);

  const bufferStyle = React.useMemo(
    () => [styles.drawerBuffer, height.heightStyle],
    [height.heightStyle],
  );

  const backgroundStyle = React.useMemo(
    () => [styles.scrollBackground, backgroundStyleProp],
    [backgroundStyleProp],
  );

  return (
    <TabletopCardSizeProvider
      availableHeight={Dimensions.get("window").height}
      availableWidth={Dimensions.get("window").width}
      target={props.target}
    >
      <EditCardProvider onChangeSide={setSide} side={side} {...props}>
        <BottomDrawerWrapper
          onLayout={onContainerLayout}
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={styles.contentContainer}
            scrollEnabled
            horizontal={false}
          >
            <View style={styles.scrollContent}>
              <Pressable onPress={onPress}>
                <AnimatedCardSides
                  ref={cardSidesRef}
                  target={props.target}
                  side={side}
                />
              </Pressable>
            </View>
            <Animated.View style={bufferStyle} />
            <Pressable onPress={onPressBackground} style={backgroundStyle} />
          </ScrollView>
          <BottonDrawer
            height={height.sharedValue}
            maxHeight={maxHeight}
            ref={bottomDrawer}
            initHeight={height.initHeight}
            animateIn
            openOnMount
          >
            <EditCardForm
              flipSide={flipSide}
              onDelete={props.onDelete}
              handleClose={onPressBackground}
              activeSide={side}
              {...props.target}
            />
          </BottonDrawer>
        </BottomDrawerWrapper>
      </EditCardProvider>
    </TabletopCardSizeProvider>
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
    zIndex: 1,
    position: "relative",
  },
  content: {
    backgroundColor: "white",
    flex: 1,
    marginTop: dragHeight - dragOverlap - dragBuffer,
  },
  scrollContent: {
    zIndex: 3,
    position: "relative",
  },
  scrollBackground: {
    zIndex: 2,
    position: "absolute",
  },
});
