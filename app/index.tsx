import { StyleSheet } from "react-native";
import DecksScreen from "@/components/DecksScreen";

export default function DecksRoute() {
  return <DecksScreen style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
