import React from "react";
import { StyleProp, StyleSheet, ViewStyle, View } from "react-native";
import ThemedText from "@/components/ui/ThemedText";
import ThemedView from "@/components/ui/ThemedView";
import ContentWidth from "@/components/ui/ContentWidth";
import Image from "@/components/ui/Image";
import AppStores from "@/components/ui/AppStores";
import text from "@/constants/text";
import Button from "@/components/forms/Button";
import { useNavigation } from "@/context/Navigation";
import {
  privacyPolicyLink,
  termsLink,
  playfaceWebsite,
  charlieJacksonLink,
} from "@/constants/links";
import Link from "@/components/ui/Link";
import { ScrollView } from "react-native-gesture-handler";
import { TouchableOpacity } from "@/components/ui/Pressables";

export interface MarketingScreenProps {
  style?: StyleProp<ViewStyle>;
}

export default function MarketingScreen({
  style,
}: MarketingScreenProps): React.ReactNode {
  const { navigate } = useNavigation();

  return (
    <ThemedView style={[styles.container, style]}>
      <ScrollView style={styles.scrollView}>
        <ContentWidth padding="standard">
          <TouchableOpacity onPress={() => navigate({ name: "decks" })}>
            <Image
              style={styles.heroImage}
              source={require("../../assets/images/dex-phones-hero.png")}
              contentFit="contain"
            />
          </TouchableOpacity>
          <View style={styles.descriptionContainer}>
            <ThemedText type="h1" style={styles.title}>
              {text["marketing_screen.dex_title"]}
            </ThemedText>

            <ThemedText type="h3" style={styles.description}>
              {text["marketing_screen.dex_description"]}
            </ThemedText>

            <AppStores style={styles.appStores} height={50} />
            <View style={styles.button}>
              <Button
                title={text["marketing_screen.web_button"]}
                variant="outline"
                onPress={() =>
                  navigate({
                    name: "decks",
                  })
                }
              />
            </View>
            <ThemedText style={styles.about}>
              {text["marketing_screen.created.1"]}
              <Link href={playfaceWebsite}>
                {text["marketing_screen.playface"]}
              </Link>
              {text["marketing_screen.created.2"]}
              <Link href={charlieJacksonLink}>
                {text["marketing_screen.charlie_jackson"]}
              </Link>
              {text["marketing_screen.created.3"]}
            </ThemedText>
            <View style={styles.playfaceContainer}>
              <TouchableOpacity href={playfaceWebsite}>
                <Image
                  style={styles.playface}
                  source={require("../../assets/images/playface-circle-logo-text-right.png")}
                  contentFit="contain"
                />
              </TouchableOpacity>
            </View>
            <ThemedText style={styles.footer}>
              <Link href={privacyPolicyLink}>
                {text["marketing_screen.privacy"]}
              </Link>
              {" / "}
              <Link href={termsLink}>{text["marketing_screen.terms"]}</Link>
            </ThemedText>
          </View>
        </ContentWidth>
      </ScrollView>
    </ThemedView>
  );
}

const verticalMargin = 40;

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: verticalMargin,
  },
  heroImage: {
    width: "100%",
    aspectRatio: 1.5,
    marginTop: verticalMargin,
  },
  appStores: {
    width: "100%",
    flex: 1,
  },
  title: {
    display: "none",
  },
  descriptionContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    textAlign: "center",
    maxWidth: 600,
    marginVertical: verticalMargin,
  },
  about: {
    textAlign: "center",
    marginTop: verticalMargin,
    maxWidth: 600,
  },
  playfaceContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  playface: {
    height: 100,
    width: 300,
    marginTop: 10,
    marginBottom: 20,
  },
  footer: {
    textAlign: "center",
    marginVertical: verticalMargin,
  },
});
