import { StyleSheet } from "react-native";
import DecksScreen from "@/components/DecksScreen";
import TextureBackground from "@/components/TextureBackground";
import Screen from "@/components/Screen";

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
