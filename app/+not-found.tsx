import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import text from "@/constants/text";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: text["screen.404.title"] }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">{text["404.title"]}</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">{text["404.link"]}</ThemedText>
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
