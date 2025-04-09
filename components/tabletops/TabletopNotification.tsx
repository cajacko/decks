import React from "react";
import { StackListRef } from "../stacks/StackList";
import { UseTabletopHistoryOptions } from "@/hooks/useTabletopHistory";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";
import ThemedText from "@/components/ui/ThemedText";
import useLayoutAnimations from "@/hooks/useLayoutAnimations";
import { useThemeColor } from "@/hooks/useThemeColor";
import text from "@/constants/text";
import { Tabletops, RequiredOperations } from "@/store/types";
import IconSymbol from "../ui/IconSymbol";

export type Notify = (text: string) => void;

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
  clear: () => void;
  extendNotification: () => void;
}

const closeIconSize = 20;

export function useTabletopNotification({
  stackListRef,
}: {
  stackListRef: React.RefObject<StackListRef>;
}) {
  const [notification, setNotification] = React.useState<Notification | null>(
    null,
  );

  const notificationTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const notify = React.useCallback<Notify>((text: string) => {
    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current);
    }

    setNotification({ text });

    notificationTimeout.current = setTimeout(() => {
      setNotification(null);
    }, notificationTimeoutDuration);
  }, []);

  const beforeUndo = React.useCallback<
    NonNullable<UseTabletopHistoryOptions["beforeUndo"]>
  >(
    (state, undoState) => {
      const type = state?.operation?.type;
      const notificationText = type ? textMap[type] : null;

      notify(
        notificationText
          ? `${text["tabletop.undo.with_operation"]} ${notificationText}`
          : text["tabletop.undo.without_operation"],
      );

      const scrollOffset = state?.operation?.payload?.scrollOffset;

      return () => {
        if (typeof scrollOffset === "number") {
          stackListRef.current?.scrollToOffset(scrollOffset, {
            animated: true,
          });
        }
      };
    },
    [stackListRef, notify],
  );

  const beforeRedo = React.useCallback<
    NonNullable<UseTabletopHistoryOptions["beforeRedo"]>
  >(
    (state, redoState) => {
      const type = redoState?.operation?.type;
      const notificationText = type ? textMap[type] : null;

      notify(
        notificationText
          ? `${text["tabletop.redo.with_operation"]} ${notificationText}`
          : text["tabletop.redo.without_operation"],
      );

      const scrollOffset = redoState?.operation?.payload?.scrollOffset;

      return () => {
        if (typeof scrollOffset === "number") {
          stackListRef.current?.scrollToOffset(scrollOffset, {
            animated: true,
          });
        }
      };
    },
    [stackListRef, notify],
  );

  const clear = React.useCallback(() => {
    setNotification(null);

    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current);
    }
  }, []);

  const extendNotification = React.useCallback(() => {
    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current);
    }

    notificationTimeout.current = setTimeout(() => {
      setNotification(null);
    }, notificationTimeoutDuration * 2);
  }, []);

  return {
    beforeRedo,
    beforeUndo,
    notification,
    notify,
    clear,
    extendNotification,
  };
}

export default function TabletopNotification({
  text,
  style,
  clear,
  extendNotification,
}: TabletopNotificationProps): React.ReactNode {
  const { entering, exiting } = useLayoutAnimations();
  const backgroundColor = useThemeColor("background");
  const [canCancel, setCanCancel] = React.useState(false);

  const onPress = React.useCallback(() => {
    if (canCancel) {
      clear();
      setCanCancel(false);
    } else {
      setCanCancel(true);
      extendNotification();
    }
  }, [clear, extendNotification, canCancel]);

  React.useEffect(() => {
    setCanCancel(false);
  }, [text]);

  return (
    <Animated.View
      entering={entering}
      exiting={exiting}
      style={[
        styles.alert,
        { backgroundColor, marginRight: canCancel ? -closeWidth : 0 },
        style,
      ]}
    >
      <TouchableOpacity onPress={onPress} style={styles.content}>
        <ThemedText type="body2">{text}</ThemedText>
        {canCancel && (
          <View style={styles.closeContainer}>
            <IconSymbol name="close" size={closeIconSize} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const borderRadius = 8;
const closeWidth = closeIconSize + 10;

const styles = StyleSheet.create({
  alert: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeContainer: {
    width: closeWidth,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
