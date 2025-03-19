import React from "react";
import ThemedView from "./ThemedView";
import {
  StyleSheet,
  View,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import IconSymbol, { IconSymbolName } from "./IconSymbol";
import ThemedText from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Link, LinkProps } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
    <Link href={props.href} asChild>
      <Pressable style={styles.tab}>
        <View style={[styles.tabContent, { marginBottom: bottom }]}>
          <IconSymbol
            name={props.icon}
            color={props.isActive ? colors : undefined}
          />
          <ThemedText style={styles.tabText}>{props.title}</ThemedText>
        </View>
      </Pressable>
    </Link>
  );
}

export default function Tabs(props: TabsProps): React.ReactNode {
  const colors = useThemeColor("inputOutline");
  const { bottom } = useSafeAreaInsets();

  return (
    <ThemedView
      style={[
        styles.tabs,
        { borderTopColor: colors, height: 60 + bottom, maxHeight: 60 + bottom },
        props.style,
      ]}
    >
      {props.children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  tabs: {
    width: "100%",
    flexDirection: "row",
    borderTopWidth: 1,
    flex: 1,
    position: "relative",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
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
