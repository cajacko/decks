import { StyleSheet } from "react-native";
import Tabletop from "@/components/Tabletop/Tabletop";

export default function TabTwoScreen() {
  return <Tabletop tabletopId="tabletop1" style={styles.tabletop} />;
}

const styles = StyleSheet.create({
  tabletop: {
    flex: 1,
  },
});
