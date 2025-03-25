import { StyleSheet } from "react-native";
import DecksScreen from "@/components/decks/DecksScreen";
import TextureBackground from "@/components/ui/TextureBackground";
import Screen from "@/components/ui/Screen";

export default function DecksRoute() {
  return (
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
