import React from "react";
import { StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import IconSymbol, { IconSymbolName } from "./IconSymbol";
import ThemedText from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinkProps } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ContentWidth from "./ContentWidth";
import { iconSize, _contentHeight } from "@/context/Toolbar";
import Link from "@/components/ui/Link";

export interface TabsProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface TabProps {
  icon: IconSymbolName;
  title: string;
  isActive: boolean;
  href: LinkProps["href"];
}

export function Tab(props: TabProps): React.ReactNode {
  const colors = useThemeColor("primary");
  const { bottom } = useSafeAreaInsets();

  return (
    <Link
      style={styles.tab}
      href={props.href}
      vibrate
      TouchableProps={{
        style: StyleSheet.flatten([
          styles.pressable,
          { paddingBottom: bottom },
        ]),
      }}
    >
      <View style={styles.tabContent}>
        <IconSymbol
          name={props.icon}
          color={props.isActive ? colors : undefined}
          size={iconSize}
        />
        <ThemedText style={styles.tabText}>{props.title}</ThemedText>
      </View>
    </Link>
  );
}

export default function Tabs(props: TabsProps): React.ReactNode {
  const backgroundColor = useThemeColor("background");
  const colors = useThemeColor("inputOutline");
  const { bottom } = useSafeAreaInsets();
  const height = _contentHeight + bottom;

  return (
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
      contentContainerStyle={styles.content}
    >
      {props.children}
    </ContentWidth>
  );
}

const styles = StyleSheet.create({
  tabs: {
    width: "100%",
    borderTopWidth: 1,
    flex: 1,
    position: "relative",
  },
  tab: {
    flex: 1,
  },
  pressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    flex: 1,
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabText: {
    marginLeft: 10,
  },
});
