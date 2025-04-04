import { StyleSheet, Platform } from "react-native";
import DecksScreen from "@/components/decks/DecksScreen";
import TextureBackground from "@/components/ui/TextureBackground";
import Screen from "@/components/ui/Screen";
import MarketingScreen from "@/components/marketing/MarketingScreen";

export default function IndexRoute() {
  return Platform.OS === "web" ? (
    <MarketingScreen style={styles.container} />
  ) : (
    <Screen background={<TextureBackground />}>
      <DecksScreen style={styles.container} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
