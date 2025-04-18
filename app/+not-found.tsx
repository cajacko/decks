import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import ThemedText from "@/components/ui/ThemedText";
import ThemedView from "@/components/ui/ThemedView";
import text from "@/constants/text";
import { useNavigation } from "@/context/Navigation";
import Button from "@/components/forms/Button";

export default function NotFoundScreen() {
  const { navigate } = useNavigation();
  return (
    <>
      <Stack.Screen options={{ title: text["screen.404.title"] }} />
      <ThemedView style={styles.container}>
        <ThemedText type="h3">{text["404.title"]}</ThemedText>
        <Button
          onPress={() => navigate({ name: "decks" })}
          style={styles.link}
          title={text["404.link"]}
        />
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
