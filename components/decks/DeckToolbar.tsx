import React from "react";
import { Toolbar, iconSize, styles } from "@/context/Toolbar";
import useDeckName from "@/hooks/useDeckName";
import { appHome } from "@/constants/links";
import { useEditDeckModal } from "../editDeck/EditDeckModal";
import IconButton from "../forms/IconButton";
import Animated from "react-native-reanimated";
import useLayoutAnimations from "@/hooks/useLayoutAnimations";
import { useDeckInfoModal } from "./DeckInfoModal";

interface DeckToolbarProps {
  deckId: string;
  loading: boolean;
}

export default function DeckToolbar(props: DeckToolbarProps): React.ReactNode {
  const title = useDeckName(props.deckId);
  const editModal = useEditDeckModal(props.deckId);
  const { entering, exiting } = useLayoutAnimations();
  const infoModal = useDeckInfoModal(
    props.deckId,
    React.useMemo(() => ({ showTabs: false }), []),
  );

  return (
    <>
      {editModal.component}
      {infoModal.component}
      <Toolbar
        backPath={appHome}
        logoVisible={false}
        title={title}
        loading={props.loading}
        onPressTitle={editModal.open}
      >
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
