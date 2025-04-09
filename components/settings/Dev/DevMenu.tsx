import React from "react";
import Flags from "./DevFlags";
import Button from "@/components/forms/Button";
import { persistor, resetStore } from "@/store/store";
import AppError from "@/classes/AppError";
import text from "@/constants/text";
import FieldSet, {
  titleProps as fieldSetTitleProps,
  useLeftAdornmentSize,
} from "@/components/forms/FieldSet";
import { useRouter } from "expo-router";
import { exampleDeckIds } from "@/utils/builtInTemplateIds";
import * as DevClient from "expo-dev-client";
import { useUpdates, reloadAsync } from "expo-updates";
import Collapsible from "@/components/ui/Collapsible";
import ThemedText from "@/components/ui/ThemedText";
import IconSymbol from "@/components/ui/IconSymbol";
import { useSync } from "@/context/Sync";
import { useAuthentication } from "@/context/Authentication";
import Field from "@/components/forms/Field";
import Loader from "@/components/ui/Loader";
import useIncludedData from "@/hooks/useIncludedData";
import { useBuiltInStateSelector } from "@/store/hooks";
import { selectDecksById } from "@/store/selectors/decks";

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

  const decksByDeckId = useBuiltInStateSelector(selectDecksById);

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
  const iconSize = useLeftAdornmentSize({ titleProps });

  const auth = useAuthentication();
  const sync = useSync();
  const includedData = useIncludedData();

  return (
    <FieldSet
      title={text["settings.dev_mode.title"]}
      collapsible
      initialCollapsed
      titleProps={titleProps}
      leftAdornment={<IconSymbol name="bug-report" size={iconSize} />}
    >
      <Button title="Reload App" onPress={reloadAsync} variant="outline" />

      <Field
        subLabel={
          includedData.loading
            ? "Loading..."
            : includedData.error
              ? `Error: ${includedData.error.message}`
              : (includedData.dateFetched ?? "Using build time data")
        }
      >
        <Button
          title="Update Included Data"
          onPress={includedData.update}
          variant="outline"
        />
      </Field>

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
      {auth.isLoggedIn && (
        <FieldSet title="Sync" collapsible initialCollapsed>
          <Field
            subLabel={`Last synced: ${sync.loading ? "Syncing..." : (sync.lastSynced ?? "null")}`}
            errorMessage={
              auth.error ? text["settings.backup_sync.error"] : undefined
            }
          >
            <Button
              title="Sync"
              onPress={() => sync.sync()}
              variant="outline"
            />
          </Field>

          <Field subLabel={`Last pulled: ${sync.lastPulled ?? "null"}`}>
            <Button
              title="Pull"
              onPress={() => sync.pull()}
              variant="outline"
            />
          </Field>

          <Field subLabel={`Last pushed: ${sync.lastPushed ?? "null"}`}>
            <Button
              title="Push"
              onPress={() => sync.push()}
              variant="outline"
            />
          </Field>
        </FieldSet>
      )}

      <FieldSet title="Auth" collapsible initialCollapsed>
        {auth.error && (
          <ThemedText>Auth Error: {auth.error.message}</ThemedText>
        )}

        {auth.loading && <Loader />}

        {!auth.isLoggedIn && (
          <Button
            title="Sign In"
            onPress={() => auth.login()}
            variant="outline"
          />
        )}

        {auth.isLoggedIn && (
          <Button
            title="Refresh Auth Token"
            onPress={() => auth._refreshAuthToken()}
            variant="outline"
          />
        )}

        {auth.isLoggedIn && (
          <Button
            title="Logout"
            onPress={() => auth.logout()}
            variant="outline"
          />
        )}
      </FieldSet>
      <FieldSet title="Example Decks" collapsible initialCollapsed>
        {Object.entries(decksByDeckId).map(([id, deck]) => (
          <Button
            key={id}
            title={`${deck?.name ?? "N/A"} ${deck?.version ? `(${deck.version})` : ""}`}
            variant="outline"
            onPress={() => {
              navigate(`/deck/${id}`);
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
