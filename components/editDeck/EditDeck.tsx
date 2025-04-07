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

  return (
    <BottomDrawerWrapper onLayout={onContainerLayout} style={styles.container}>
      <View style={styles.content}>
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
  },
  drawer: {
    zIndex: 3,
    position: "relative",
    flex: 0,
  },
});
