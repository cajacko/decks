import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import ThemedView from "./ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "@/store/hooks";
import { selectFlag } from "@/store/combinedSelectors/flags";
import DevMenu from "./Dev/DevMenu";
import Version from "./Version";
import SettingsApp from "./SettingsApp";
import SettingsDeck from "./SettingsDeck";
import FieldSet from "./FieldSet";
import SettingsTabletop from "./SettingsTabletop";

export interface DrawerProps {
  deckId?: string | null;
  tabletopId?: string | null;
  isOpen?: boolean;
  closeDrawer: () => void;
  // stackId?: string | null;
  // cardId?: string | null;
  // cardInstanceId?: string | null;
}

type Collapsed = {
  deck?: boolean;
  tabletop?: boolean;
  app?: boolean;
  dev?: boolean;
};

export default function Drawer(props: DrawerProps): React.ReactNode {
  const devMode =
    useAppSelector((state) => selectFlag(state, { key: "DEV_MODE" })) === true;

  const initialCollapsed = React.useMemo(
    (): Collapsed => ({
      tabletop: false,
      deck: !!props.tabletopId,
      app: !!props.deckId || !!props.tabletopId,
      dev: true,
    }),
    [props.deckId, props.tabletopId],
  );

  const [collapsed, setCollapsed] = React.useState<Collapsed>(initialCollapsed);
  const isOpenRef = React.useRef(props.isOpen);
  isOpenRef.current = props.isOpen;

  React.useEffect(() => {
    // Don't reset when we're open, it feels janky, but we also don't want to reset when isOpen
    // changes, as it animates and we'd see it
    if (isOpenRef.current) return;

    setCollapsed(initialCollapsed);
  }, [initialCollapsed]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.contentContainer}
    >
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.settings}>
              <FieldSet itemSpacing={30}>
                {props.tabletopId && props.deckId && (
                  <SettingsTabletop
                    tabletopId={props.tabletopId}
                    deckId={props.deckId}
                    collapsed={collapsed.tabletop !== false}
                    collapsible
                    closeDrawer={props.closeDrawer}
                    onCollapse={(collapsed) =>
                      setCollapsed((prev) => ({ ...prev, tabletop: collapsed }))
                    }
                  />
                )}
                {props.deckId && (
                  <SettingsDeck
                    deckId={props.deckId}
                    collapsible
                    collapsed={collapsed.deck !== false}
                    closeDrawer={props.closeDrawer}
                    onCollapse={(collapsed) =>
                      setCollapsed((prev) => ({ ...prev, deck: collapsed }))
                    }
                  />
                )}
                <SettingsApp
                  collapsible
                  collapsed={collapsed.app !== false}
                  closeDrawer={props.closeDrawer}
                  onCollapse={(collapsed) =>
                    setCollapsed((prev) => ({ ...prev, app: collapsed }))
                  }
                />
                {devMode && (
                  <DevMenu
                    collapsed={collapsed.dev !== false}
                    closeDrawer={props.closeDrawer}
                    onCollapse={(collapsed) =>
                      setCollapsed((prev) => ({ ...prev, dev: collapsed }))
                    }
                  />
                )}
              </FieldSet>
            </View>
            <Version />
          </View>
        </SafeAreaView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    minHeight: "100%",
  },
  settings: {
    flex: 1,
  },
});
