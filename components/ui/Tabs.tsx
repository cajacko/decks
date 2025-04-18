import React from "react";
import { StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import IconSymbol, { IconSymbolName } from "./IconSymbol";
import ThemedText from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ContentWidth from "./ContentWidth";
import { iconSize, _contentHeight } from "@/components/toolbars/toolbar.style";
import { TouchableOpacity } from "./Pressables";
import { useNavigation } from "@/context/Navigation";
import { useAppSelector } from "@/store/hooks";
import { selectCanEditDeck } from "@/store/selectors/decks";
import text from "@/constants/text";

export interface TabsProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export interface TabProps {
  icon: IconSymbolName;
  title: string;
  isActive?: boolean;
  onPress: () => void;
}

export function Tab(props: TabProps): React.ReactNode {
  const { onPress } = props;
  const colors = useThemeColor("primary");
  const { bottom } = useSafeAreaInsets();

  return (
    <TouchableOpacity
      style={styles.tab}
      onPress={onPress}
      vibrate
      contentContainerStyle={StyleSheet.flatten([
        styles.pressableContentContainer,
        { paddingBottom: bottom },
      ])}
    >
      <View style={styles.tabContent}>
        <IconSymbol
          name={props.icon}
          color={props.isActive ? colors : undefined}
          size={iconSize}
        />
        <ThemedText style={styles.tabText}>{props.title}</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

export default function Tabs(props: TabsProps): React.ReactNode {
  const backgroundColor = useThemeColor("background");
  const colors = useThemeColor("inputOutline");
  const { bottom } = useSafeAreaInsets();
  const height = _contentHeight + bottom;

  const { navigate, screen } = useNavigation();
  const deckId = screen.deckId;
  const canEditDeck = useAppSelector((state) =>
    deckId ? selectCanEditDeck(state, { deckId }) : false,
  );
  const isPlay = useNavigation().screen.name === "play";

  const onPressDeck = React.useCallback(() => {
    if (!deckId) return;

    navigate({
      name: "deck",
      deckId,
    });
  }, [deckId, navigate]);

  const onPressPlay = React.useCallback(() => {
    if (!deckId) return;

    navigate({
      name: "play",
      deckId,
    });
  }, [deckId, navigate]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>{props.children}</View>
      <ContentWidth
        style={[
          styles.tabs,
          {
            backgroundColor,
            borderTopColor: colors,
            height,
            maxHeight: height,
          },
          props.style,
        ]}
        contentContainerStyle={styles.tabsContent}
      >
        <Tab
          onPress={onPressDeck}
          icon={canEditDeck ? "edit-document" : "remove-red-eye"}
          title={
            canEditDeck
              ? text["screen.deck.index.title"]
              : text["screen.deck.view.title"]
          }
          isActive={!isPlay}
        />
        <Tab
          onPress={onPressPlay}
          icon="play-arrow"
          title={text["screen.deck.play.title"]}
          isActive={isPlay}
        />
      </ContentWidth>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  content: {
    flex: 1,
    position: "relative",
    zIndex: 1,
  },
  tabs: {
    width: "100%",
    borderTopWidth: 1,
    flex: 1,
    position: "relative",
    zIndex: 2,
  },
  tab: {
    flex: 1,
  },
  tabsContent: {
    flexDirection: "row",
    flex: 1,
  },
  pressableContentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabText: {
    marginLeft: 10,
  },
});
