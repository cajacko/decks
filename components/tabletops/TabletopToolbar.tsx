import React from "react";
import { StyleSheet } from "react-native";
import IconButton from "@/components/forms/IconButton";
import { Toolbar, iconSize, styles } from "@/context/Toolbar";
import useTabletopHistory, {
  UseTabletopHistoryOptions,
} from "@/hooks/useTabletopHistory";
import useDeckName from "@/hooks/useDeckName";
import { appHome } from "@/constants/links";
import Animated from "react-native-reanimated";
import useLayoutAnimations from "@/hooks/useLayoutAnimations";
import { useEditDeckModal } from "../editDeck/EditDeckModal";
import { useDeckInfoModal } from "../decks/DeckInfoModal";

export interface TabletopToolbarProps extends UseTabletopHistoryOptions {
  deckId: string;
  tabletopId: string;
  loading: boolean;
}

export default function TabletopToolbar(
  props: TabletopToolbarProps,
): React.ReactNode {
  const { undo, redo } = useTabletopHistory(props.tabletopId, props);
  const title = useDeckName(props.deckId);
  const { entering, exiting } = useLayoutAnimations();
  const editDeckModal = useEditDeckModal(props.deckId);
  const infoModal = useDeckInfoModal(props.deckId);

  return (
    <>
      {editDeckModal.component}
      {infoModal.component}

      <Toolbar
        backPath={appHome}
        logoVisible={false}
        title={title}
        loading={props.loading}
        onPressTitle={editDeckModal.open}
      >
        <Animated.View entering={entering} exiting={exiting}>
          <IconButton
            icon="undo"
            size={iconSize}
            variant="transparent"
            style={StyleSheet.flatten([
              styles.action,
              { opacity: undo ? 1 : 0.5 },
            ])}
            vibrate
            onPress={undo}
          />
        </Animated.View>
        <Animated.View entering={entering} exiting={exiting}>
          <IconButton
            icon="redo"
            size={iconSize}
            variant="transparent"
            style={StyleSheet.flatten([
              styles.action,
              { opacity: redo ? 1 : 0.5 },
            ])}
            vibrate
            onPress={redo}
          />
        </Animated.View>
        <Animated.View entering={entering} exiting={exiting}>
          <IconButton
            icon="info-outline"
            variant="transparent"
            size={iconSize}
            style={styles.action}
            vibrate
            onPress={infoModal.open}
          />
        </Animated.View>
      </Toolbar>
    </>
  );
}
