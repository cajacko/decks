import React from "react";
import {
  useNotification,
  useClearNotification,
  useExtendNotification,
} from "@/context/Notifications";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import ThemedText from "@/components/ui/ThemedText";
import useLayoutAnimations from "@/hooks/useLayoutAnimations";
import { useThemeColor } from "@/hooks/useThemeColor";
import IconSymbol from "../ui/IconSymbol";
import { TouchableOpacity } from "@/components/ui/Pressables";

export interface NotificationsProps {
  children?: React.ReactNode;
}

const closeIconSize = 20;
const borderRadius = 8;
const closeWidth = closeIconSize + 10;

export default function Notifications(
  props: NotificationsProps,
): React.ReactNode {
  const notification = useNotification();
  const clear = useClearNotification();
  const extend = useExtendNotification();

  const { entering, exiting } = useLayoutAnimations();
  const backgroundColor = useThemeColor("background");
  const [canCancel, setCanCancel] = React.useState(false);

  const onPress = React.useCallback(() => {
    if (canCancel) {
      clear();
      setCanCancel(false);
    } else {
      setCanCancel(true);
      extend();
    }
  }, [clear, extend, canCancel]);

  React.useEffect(() => {
    setCanCancel(false);
  }, [notification]);

  return (
    <View style={styles.container}>
      {notification && (
        <View style={styles.alertContainer}>
          <Animated.View
            entering={entering}
            exiting={exiting}
            style={[
              styles.alert,
              { backgroundColor, marginRight: canCancel ? -closeWidth : 0 },
            ]}
          >
            <TouchableOpacity
              onPress={onPress}
              contentContainerStyle={styles.notificationContent}
            >
              <ThemedText type="body2">{notification.text}</ThemedText>
              {canCancel && (
                <View style={styles.closeContainer}>
                  <IconSymbol name="close" size={closeIconSize} />
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
      <View style={styles.content}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    zIndex: 2,
  },
  content: {
    flex: 1,
    position: "relative",
    zIndex: 1,
  },
  alertContainer: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 4,
  },
  alert: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius,
  },
  notificationContent: {
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
