import { StyleSheet } from "react-native";
import DecksScreen from "@/components/DecksScreen";
import TextureBackground from "@/components/TextureBackground";

export default function DecksRoute() {
  return (
    <TextureBackground>
      <DecksScreen style={styles.container} />
    </TextureBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
