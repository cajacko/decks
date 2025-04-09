import React from "react";
import IconButton from "@/components/forms/IconButton";
import { Toolbar, iconSize, styles } from "@/context/Toolbar";
import useTabletopHistory, {
  UseTabletopHistoryOptions,
} from "@/hooks/useTabletopHistory";
import useDeckName from "@/hooks/useDeckName";
import { appHome } from "@/constants/links";
import Animated from "react-native-reanimated";
import useLayoutAnimations from "@/hooks/useLayoutAnimations";
import useFlag from "@/hooks/useFlag";
import { setUserFlag } from "@/store/slices/userSettings";
import { dateToDateString } from "@/utils/dates";
import { useAppDispatch } from "@/store/hooks";
import { Notify } from "./TabletopNotification";
import { Platform } from "react-native";
import text from "@/constants/text";

export interface TabletopToolbarProps extends UseTabletopHistoryOptions {
  deckId: string;
  tabletopId: string;
  loading: boolean;
  notify?: Notify;
}

export default function TabletopToolbar(
  props: TabletopToolbarProps,
): React.ReactNode {
  const { notify } = props;
  const { undo, redo } = useTabletopHistory(props.tabletopId, props);
  const title = useDeckName(props.deckId);
  const { entering, exiting } = useLayoutAnimations();
  const shakeToShuffleOn = useFlag("SHAKE_TO_SHUFFLE") === "enabled";
  const dispatch = useAppDispatch();

  const toggleShakeToShuffle = React.useCallback(() => {
    notify?.(
      shakeToShuffleOn
        ? text["tabletop.notification.shuffle_disabled"]
        : text["tabletop.notification.shuffle_enabled"],
    );

    dispatch(
      setUserFlag({
        key: "SHAKE_TO_SHUFFLE",
        value: shakeToShuffleOn ? "disabled" : "enabled",
        date: dateToDateString(new Date()),
      }),
    );
  }, [dispatch, shakeToShuffleOn, notify]);

  return (
    <Toolbar
      backPath={appHome}
      logoVisible={false}
      title={title}
      loading={props.loading}
    >
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
    </Toolbar>
  );
}
