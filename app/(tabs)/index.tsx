import { StyleSheet } from "react-native";
import Tabletop from "@/components/Tabletop";
import useDeviceSize from "@/hooks/useDeviceSize";

export default function TabTwoScreen() {
  return <Tabletop tabletopId="tabletop1" style={styles.tabletop} />;
}

const styles = StyleSheet.create({
  tabletop: {
    height: "100%",
  },
});
