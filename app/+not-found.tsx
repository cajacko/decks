import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import ThemedText from "@/components/ui/ThemedText";
import ThemedView from "@/components/ui/ThemedView";
import text from "@/constants/text";
import { appHome } from "@/constants/links";
import { Toolbar } from "@/context/Toolbar";
import Link from "@/components/ui/Link";

export default function NotFoundScreen() {
  return (
    <>
      <Toolbar />
      <Stack.Screen options={{ title: text["screen.404.title"] }} />
      <ThemedView style={styles.container}>
        <ThemedText type="h3">{text["404.title"]}</ThemedText>
        <Link href={appHome} style={styles.link}>
          {text["404.link"]}
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
