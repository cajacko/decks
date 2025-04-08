import React from "react";
import { StackListRef } from "../stacks/StackList";
import { UseTabletopHistoryOptions } from "@/hooks/useTabletopHistory";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import ThemedText from "@/components/ui/ThemedText";
import useLayoutAnimations from "@/hooks/useLayoutAnimations";
import { useThemeColor } from "@/hooks/useThemeColor";
import text from "@/constants/text";
import { Tabletops, RequiredOperations } from "@/store/types";

const notificationTimeoutDuration = 2000;

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

export interface Notification {
  text: string;
}

export interface TabletopNotificationProps extends Notification {
  style?: StyleProp<ViewStyle>;
}

export function useTabletopNotification({
  stackListRef,
}: {
  stackListRef: React.RefObject<StackListRef> | null;
}) {
  const [notification, setNotification] = React.useState<Notification | null>(
    null,
  );

  const notificationTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const beforeUndo = React.useCallback<
    NonNullable<UseTabletopHistoryOptions["beforeUndo"]>
  >(
    (state, undoState) => {
      if (notificationTimeout.current) {
        clearTimeout(notificationTimeout.current);
      }

      const type = state?.operation?.type;
      const notificationText = type ? textMap[type] : null;

      setNotification({
        text: notificationText
          ? `${text["tabletop.undo.with_operation"]} ${notificationText}`
          : text["tabletop.undo.without_operation"],
      });

      const scrollOffset = state?.operation?.payload?.scrollOffset;

      notificationTimeout.current = setTimeout(() => {
        setNotification(null);
      }, notificationTimeoutDuration);

      return () => {
        if (typeof scrollOffset === "number") {
          stackListRef?.current?.scrollToOffset(scrollOffset, {
            animated: true,
          });
        }
      };
    },
    [stackListRef],
  );

  const beforeRedo = React.useCallback<
    NonNullable<UseTabletopHistoryOptions["beforeRedo"]>
  >(
    (state, redoState) => {
      if (notificationTimeout.current) {
        clearTimeout(notificationTimeout.current);
      }

      const type = redoState?.operation?.type;
      const notificationText = type ? textMap[type] : null;

      setNotification({
        text: notificationText
          ? `${text["tabletop.redo.with_operation"]} ${notificationText}`
          : text["tabletop.redo.without_operation"],
      });

      const scrollOffset = redoState?.operation?.payload?.scrollOffset;

      notificationTimeout.current = setTimeout(() => {
        setNotification(null);
      }, notificationTimeoutDuration);

      return () => {
        if (typeof scrollOffset === "number") {
          stackListRef?.current?.scrollToOffset(scrollOffset, {
            animated: true,
          });
        }
      };
    },
    [stackListRef],
  );

  return {
    beforeRedo,
    beforeUndo,
    notification,
  };
}

export default function TabletopNotification({
  text,
  style,
}: TabletopNotificationProps): React.ReactNode {
  const { entering, exiting } = useLayoutAnimations();
  const backgroundColor = useThemeColor("background");

  return (
    <Animated.View
      entering={entering}
      exiting={exiting}
      style={[styles.alert, { backgroundColor }, style]}
    >
      <ThemedText type="body2">{text}</ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  alert: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
