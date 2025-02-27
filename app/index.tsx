import { StyleSheet } from "react-native";
import DecksScene from "@/components/DecksScene";

export default function HomeScreen() {
  return <DecksScene style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
