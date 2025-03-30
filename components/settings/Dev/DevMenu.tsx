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
import useGoogleAuth from "@/api/google/useGoogleAuth";
import { userInfo } from "@/api/google/userinfo";
import { files } from "@/api/google/drive";

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

  const auth = useGoogleAuth();

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
  const [testData, setTestData] = React.useState<any>(null);

  return (
    <FieldSet
      title={text["settings.dev_mode.title"]}
      collapsible
      initialCollapsed
      titleProps={titleProps}
    >
      <Button
        title="Sign in with Google"
        onPress={() => {
          auth.requestAuth();
        }}
        variant="outline"
      />

      <Button
        title={
          auth.tokens ? "Refresh with Google" : "Can not refresh with Google"
        }
        onPress={
          auth.tokens
            ? () => auth.refreshAuth(auth.tokens.refreshToken)
            : undefined
        }
        variant="outline"
      />

      <Button
        title="Test Auth"
        onPress={
          auth.tokens
            ? () => {
                userInfo(auth.tokens)
                  .then((res) => {
                    setTestData(res);
                  })
                  .catch((err) => {
                    setTestData("Error testing auth:" + err);
                  });
              }
            : undefined
        }
        variant="outline"
      />
      <Button
        title="List Drive Files"
        onPress={
          auth.tokens
            ? () => {
                files(auth.tokens)
                  .then((res) => {
                    setTestData(res);
                  })
                  .catch((err) => {
                    setTestData("Error testing auth:" + err);
                  });
              }
            : undefined
        }
        variant="outline"
      />

      <Collapsible
        title="Auth State"
        collapsible
        initialCollapsed
        titleProps={fieldSetTitleProps}
      >
        <ThemedText>
          {JSON.stringify(
            { type: auth.type, tokens: auth.tokens, testData },
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
