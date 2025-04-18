import React from "react";
import IconButton from "@/components/forms/IconButton";
import useTabletopHistory, {
  UseTabletopHistoryOptions,
} from "@/hooks/useTabletopHistory";
import Animated from "react-native-reanimated";
import useLayoutAnimations from "@/hooks/useLayoutAnimations";
import useFlag from "@/hooks/useFlag";
import { setUserFlag } from "@/store/slices/userSettings";
import { dateToDateString } from "@/utils/dates";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useNotify } from "@/context/Notifications";
import { Platform } from "react-native";
import text from "@/constants/text";
import { selectDeck } from "@/store/selectors/decks";
import { Tabletops, RequiredOperations } from "@/store/types";
import { useGetStackListRef } from "@/context/StackListRefs";
import { styles, iconSize } from "./toolbar.style";

export interface TabletopToolbarProps extends UseTabletopHistoryOptions {
  deckId: string;
}

const textMap: Record<
  (Tabletops.HistoryOperation | RequiredOperations)["type"],
  string | null
> = {
  DELETE_STACK: text["tabletop.undo_redo.delete_stack"],
  FLIP_ALL_FACE_DOWN: text["tabletop.undo_redo.flip_cards"],
  FLIP_ALL_FACE_UP: text["tabletop.undo_redo.flip_cards"],
  FLIP_CARD: text["tabletop.undo_redo.flip_card"],
  FLIP_STACK_FACE_DOWN: text["tabletop.undo_redo.flip_cards"],
  FLIP_STACK_FACE_UP: text["tabletop.undo_redo.flip_cards"],
  INIT: null,
  MOVE_ALL_CARDS_TO_BOTTOM: text["tabletop.undo_redo.move_cards"],
  MOVE_ALL_CARDS_TO_TOP: text["tabletop.undo_redo.move_cards"],
  MOVE_CARD_LEFT_TO_BOTTOM: text["tabletop.undo_redo.move_card"],
  MOVE_CARD_LEFT_TO_TOP: text["tabletop.undo_redo.move_card"],
  MOVE_CARD_RIGHT_TO_BOTTOM: text["tabletop.undo_redo.move_card"],
  MOVE_CARD_RIGHT_TO_TOP: text["tabletop.undo_redo.move_card"],
  MOVE_CARD_TO_BOTTOM: text["tabletop.undo_redo.move_card"],
  MOVE_STACK_CARDS_TO_BOTTOM: text["tabletop.undo_redo.move_cards"],
  MOVE_STACK_CARDS_TO_TOP: text["tabletop.undo_redo.move_cards"],
  RESET: text["tabletop.undo_redo.reset"],
  REVERSE_ALL_CARDS: text["tabletop.undo_redo.flip_cards"],
  REVERSE_STACK: text["tabletop.undo_redo.flip_cards"],
  SHUFFLE: text["tabletop.undo_redo.shuffle"],
};

export default function TabletopToolbar({
  deckId,
}: TabletopToolbarProps): React.ReactNode {
  const notify = useNotify();
  const tabletopId = useAppSelector(
    (state) => selectDeck(state, { deckId })?.defaultTabletopId,
  );
  const getStackListRef = useGetStackListRef(tabletopId ?? null);

  const beforeUndo = React.useCallback<
    NonNullable<UseTabletopHistoryOptions["beforeUndo"]>
  >(
    (state, undoState) => {
      const type = state?.operation?.type;
      const notificationText = type ? textMap[type] : null;

      notify({
        text: notificationText
          ? `${text["tabletop.undo.with_operation"]} ${notificationText}`
          : text["tabletop.undo.without_operation"],
      });

      const scrollOffset = state?.operation?.payload?.scrollOffset;

      return () => {
        if (typeof scrollOffset === "number") {
          getStackListRef()?.current?.scrollToOffset(scrollOffset, {
            animated: true,
          });
        }
      };
    },
    [getStackListRef, notify],
  );

  const beforeRedo = React.useCallback<
    NonNullable<UseTabletopHistoryOptions["beforeRedo"]>
  >(
    (state, redoState) => {
      const type = redoState?.operation?.type;
      const notificationText = type ? textMap[type] : null;

      notify({
        text: notificationText
          ? `${text["tabletop.redo.with_operation"]} ${notificationText}`
          : text["tabletop.redo.without_operation"],
      });

      const scrollOffset = redoState?.operation?.payload?.scrollOffset;

      return () => {
        if (typeof scrollOffset === "number") {
          getStackListRef()?.current?.scrollToOffset(scrollOffset, {
            animated: true,
          });
        }
      };
    },
    [getStackListRef, notify],
  );

  const { undo, redo } = useTabletopHistory(tabletopId ?? null, {
    beforeRedo,
    beforeUndo,
  });
  const { entering, exiting } = useLayoutAnimations();
  const shakeToShuffleOn = useFlag("SHAKE_TO_SHUFFLE") === "enabled";
  const dispatch = useAppDispatch();

  const toggleShakeToShuffle = React.useCallback(() => {
    notify?.({
      text: shakeToShuffleOn
        ? text["tabletop.notification.shuffle_disabled"]
        : text["tabletop.notification.shuffle_enabled"],
    });

    dispatch(
      setUserFlag({
        key: "SHAKE_TO_SHUFFLE",
        value: shakeToShuffleOn ? "disabled" : "enabled",
        date: dateToDateString(new Date()),
      }),
    );
  }, [dispatch, shakeToShuffleOn, notify]);

  return (
    <>
      {Platform.OS !== "web" && (
        <Animated.View entering={entering} exiting={exiting}>
          <IconButton
            icon="vibration"
            size={iconSize}
            variant="transparent"
            style={styles.action}
            vibrate
            onPress={toggleShakeToShuffle}
            disabled={!shakeToShuffleOn}
          />
        </Animated.View>
      )}
      <Animated.View entering={entering} exiting={exiting}>
        <IconButton
          icon="undo"
          size={iconSize}
          variant="transparent"
          style={styles.action}
          vibrate
          onPress={undo}
          disabled={!undo}
        />
      </Animated.View>
      <Animated.View entering={entering} exiting={exiting}>
        <IconButton
          icon="redo"
          size={iconSize}
          variant="transparent"
          style={styles.action}
          vibrate
          onPress={redo}
          disabled={!redo}
        />
      </Animated.View>
    </>
  );
}
