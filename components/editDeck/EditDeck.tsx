import {
  StyleSheet,
  View,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import React from "react";
import BottonDrawer, {
  BottomDrawerWrapper,
  BottomDrawerRef,
  useHeight,
  useMaxHeight,
} from "@/components/ui/BottomDrawer";
import { Target } from "@/utils/cardTarget";
import { selectCanEdit } from "@/store/combinedSelectors/cards";
import { useAppSelector } from "@/store/hooks";
import ThemedText from "@/components/ui/ThemedText";
import Button from "@/components/forms/Button";
import text from "@/constants/text";
import useCopyToEditAlert from "@/hooks/useCopyToEditAlert";
import EditDeckDetails from "./EditDeckDetails";
import DeckInfo, {
  styles as deckInfoStyles,
} from "@/components/decks/DeckInfo";
import Animated from "react-native-reanimated";
import { styles as modalStyles } from "@/components/overlays/Modal";
import { ModalSurfaceScreen } from "../overlays/ModalSurface";

export type EditDeckProps = {
  deckId: string;
  onPressBackground?: () => void;
  backgroundStyle?: StyleProp<ViewStyle>;
};

export default function EditDeck({
  deckId,
  onPressBackground,
  backgroundStyle,
}: EditDeckProps) {
  const target = React.useMemo(
    (): Target => ({ id: deckId, type: "deck-defaults" }),
    [deckId],
  );

  const { copyDeck: _copyDeck } = useCopyToEditAlert({ deckId });

  const canEdit = useAppSelector((state) => selectCanEdit(state, target));
  const height = useHeight();
  const { maxHeight, onContainerLayout } = useMaxHeight();

  const bottomDrawer = React.useRef<BottomDrawerRef>(null);

  const copyDeck = React.useCallback(() => {
    onPressBackground?.();
    _copyDeck();
  }, [_copyDeck, onPressBackground]);

  const bufferStyle = React.useMemo(
    () => [styles.drawerBuffer, height.heightStyle],
    [height.heightStyle],
  );

  return (
    <BottomDrawerWrapper onLayout={onContainerLayout} style={styles.container}>
      <View style={[styles.content, deckInfoStyles.modalContainer]}>
        <ModalSurfaceScreen
          handleClose={onPressBackground}
          style={[modalStyles.content, deckInfoStyles.modalContent]}
        >
          <DeckInfo deckId={deckId} showTabs={false} />
        </ModalSurfaceScreen>
        <Animated.View style={bufferStyle} />
        <Pressable onPress={onPressBackground} style={backgroundStyle} />
      </View>

      <BottonDrawer
        height={height.sharedValue}
        maxHeight={maxHeight}
        ref={bottomDrawer}
        initHeight={height.initHeight}
        animateIn
        openOnMount
        style={styles.drawer}
      >
        {canEdit ? (
          <EditDeckDetails onDelete={onPressBackground} deckId={deckId} />
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
  );
}

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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  drawer: {
    zIndex: 3,
    position: "relative",
    flex: 0,
  },
  drawerBuffer: {
    opacity: 0,
    width: "100%",
    zIndex: 1,
    position: "relative",
  },
});
