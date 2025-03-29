import React from "react";
import Flags from "./DevFlags";
import Button from "@/components/forms/Button";
import { persistor, resetStore } from "@/store/store";
import AppError from "@/classes/AppError";
import text from "@/constants/text";
import FieldSet, {
  titleProps as fieldSetTitleProps,
} from "@/components/forms/FieldSet";
import { useRouter } from "expo-router";
import exampleDecks from "@/constants/exampleDecks";
import { exampleDeckIds } from "@/utils/builtInTemplateIds";
import * as DevClient from "expo-dev-client";
import { useUpdates, reloadAsync } from "expo-updates";
import Collapsible from "@/components/ui/Collapsible";
import ThemedText from "@/components/ui/ThemedText";
import { useGoogleAuth } from "@/utils/auth/google";

const titleProps = { type: "h2" } as const;

export default function DevMenu({
  closeDrawer,
}: {
  closeDrawer: () => void;
}): React.ReactNode {
  const [purgeStatus, setPurgeStatus] = React.useState<string | null>(null);
  const { navigate } = useRouter();
  const {
    currentlyRunning,
    isChecking,
    isDownloading,
    isUpdateAvailable,
    isUpdatePending,
    availableUpdate,
    checkError,
    downloadError,
    downloadedUpdate,
    initializationError,
    lastCheckForUpdateTimeSinceRestart,
  } = useUpdates();

  const auth2 = useGoogleAuth();

  const auth1 = useGoogleAuth({
    redirectUri: "https://auth.expo.io/@charliejackson/decks",
  });

  const purgeStore = React.useCallback(() => {
    setPurgeStatus("Purging...");

    persistor
      .purge()
      .then(() => {
        setPurgeStatus("Purged");
        resetStore();
      })
      .catch((unknownError) => {
        AppError.getError(unknownError, "Error purging store").log("debug");

        setPurgeStatus("Error purging");
      })
      .finally(() => {
        setTimeout(() => {
          setPurgeStatus(null);
        }, 1000);
      });
  }, []);

  const isDevClient = DevClient.isDevelopmentBuild();

  return (
    <FieldSet
      title={text["settings.dev_mode.title"]}
      collapsible
      initialCollapsed
      titleProps={titleProps}
    >
      <Button
        title="Sign in with Google (1)"
        onPress={() => {
          auth1.promptAsync({});
        }}
        variant="outline"
      />

      <Button
        title="Sign in with Google (2)"
        onPress={() => {
          auth2.promptAsync({});
        }}
        variant="outline"
      />

      <Collapsible
        title="Sign In Info"
        collapsible
        initialCollapsed
        titleProps={fieldSetTitleProps}
      >
        <ThemedText>
          {JSON.stringify(
            {
              auth1: auth1.response,
              auth2: auth2.response,
            },
            null,
            2,
          )}
        </ThemedText>
      </Collapsible>

      <Button title="Reload App" onPress={reloadAsync} variant="outline" />

      {isDevClient && (
        <Button
          title="Open Dev Client Menu"
          onPress={DevClient.openMenu}
          variant="outline"
        />
      )}

      <Button
        title={`Purge Store${purgeStatus ? ` (${purgeStatus})` : ""}`}
        onPress={purgeStore}
        variant="outline"
      />
      <FieldSet title="Example Deck Links" collapsible initialCollapsed>
        {Object.entries(exampleDecks).map(([id, { name }]) => (
          <Button
            key={id}
            title={name}
            variant="outline"
            onPress={() => {
              navigate(`/deck/${exampleDeckIds(id).deckId}`);
              closeDrawer?.();
            }}
            style={{ marginTop: 10 }}
          />
        ))}
      </FieldSet>
      <Flags />
      <Collapsible
        title="Updates Info"
        collapsible
        initialCollapsed
        titleProps={fieldSetTitleProps}
      >
        <ThemedText>
          {JSON.stringify(
            {
              currentlyRunning: currentlyRunning.updateId,
              isChecking,
              isDownloading,
              isUpdateAvailable,
              isUpdatePending,
              availableUpdate: availableUpdate?.updateId ?? "N/A",
              checkError: checkError ?? "N/A",
              downloadError: downloadError ?? "N/A",
              downloadedUpdate: downloadedUpdate?.updateId ?? "N/A",
              initializationError: initializationError ?? "N/A",
              lastCheckForUpdateTimeSinceRestart:
                lastCheckForUpdateTimeSinceRestart ?? "N/A",
            },
            null,
            2,
          )}
        </ThemedText>
      </Collapsible>
    </FieldSet>
  );
}
