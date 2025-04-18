import { StyleSheet, ViewStyle, View, Dimensions } from "react-native";
import Animated from "react-native-reanimated";
import React from "react";
import BottonDrawer, {
  BottomDrawerWrapper,
  BottomDrawerRef,
  useHeight,
  useMaxHeight,
} from "@/components/ui/BottomDrawer";
import EditCardForm from "@/components/editCard/EditCardForm";
import EditingAnimatedCardSides, {
  AnimatedCardSidesRef,
} from "@/components/cards/connected/EditingAnimatedCardSides";
import { EditCardProvider, EditCardProviderProps } from "@/context/EditCard";
import { Target } from "@/utils/cardTarget";
import { Cards } from "@/store/types";
import { StackProvider } from "@/components/stacks/Stack/Stack.context";
import { selectCanEdit } from "@/store/combinedSelectors/cards";
import { useAppSelector, useRequiredAppSelector } from "@/store/hooks";
import ThemedText from "@/components/ui/ThemedText";
import Button from "@/components/forms/Button";
import text from "@/constants/text";
import useCopyToEditAlert from "@/hooks/useCopyToEditAlert";
import { selectDeckId } from "@/store/combinedSelectors/decks";
import { ScrollView } from "react-native-gesture-handler";
import { Pressable } from "@/components/ui/Pressables";

export type EditCardProps = Pick<
  EditCardProviderProps,
  "onCreateCard" | "onChangeTarget"
> & {
  target: Target;
  initialSide?: Cards.Side | null;
  onDelete?: () => void;
  onPressBackground?: () => void;
  backgroundStyle?: ViewStyle;
  onRequestClose: () => void;
};

export default function EditCard({
  initialSide,
  onPressBackground,
  backgroundStyle: backgroundStyleProp,
  ...props
}: EditCardProps) {
  const deckId = useRequiredAppSelector(
    (state) => selectDeckId(state, props.target),
    selectDeckId.name,
  );
  const { copyDeck: _copyDeck } = useCopyToEditAlert({ deckId });

  const canEdit = useAppSelector((state) => selectCanEdit(state, props.target));
  const height = useHeight();
  const { maxHeight, onContainerLayout, containerHeight, containerWidth } =
    useMaxHeight();

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

  const copyDeck = React.useCallback(() => {
    onPressBackground?.();
    _copyDeck();
  }, [_copyDeck, onPressBackground]);

  return (
    <StackProvider
      availableHeight={containerHeight ?? Dimensions.get("window").height}
      availableWidth={containerWidth ?? Dimensions.get("window").width}
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
                <EditingAnimatedCardSides
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
            onRequestClose={props.onRequestClose}
          >
            {canEdit ? (
              <EditCardForm
                flipSide={flipSide}
                onDelete={props.onDelete}
                handleClose={onPressBackground}
                activeSide={side}
                {...props.target}
              />
            ) : (
              <View style={styles.copyContainer}>
                <ThemedText style={styles.copyText}>
                  {text["deck.copy_alert.message"]}
                </ThemedText>
                <Button
                  title={text["deck.copy_alert.button"]}
                  variant="outline"
                  onPress={copyDeck}
                />
              </View>
            )}
          </BottonDrawer>
        </BottomDrawerWrapper>
      </EditCardProvider>
    </StackProvider>
  );
}

const borderRadius = 20;
const dragOverlap = 20;
const dragBuffer = 10;
const dragHeaderHeight = Math.max(30, borderRadius);
const dragHeight = dragHeaderHeight + dragOverlap + dragBuffer;

const styles = StyleSheet.create({
  copyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  copyText: {
    marginBottom: 20,
    textAlign: "center",
  },
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
