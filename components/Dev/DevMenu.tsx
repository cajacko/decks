import React from "react";
import Flags from "./DevFlags";
import Button from "@/components/Button";
import { persistor, resetStore } from "@/store/store";
import AppError from "@/classes/AppError";
import text from "@/constants/text";
import FieldSet, { FieldSetProps } from "@/components/FieldSet";
import { useRouter } from "expo-router";
import exampleDecks from "@/constants/exampleDecks";
import { exampleDeckIds } from "@/utils/builtInTemplateIds";
import * as DevClient from "expo-dev-client";
import * as Haptics from "expo-haptics";

export interface DevMenuProps extends FieldSetProps {
  closeDrawer: () => void;
}

const titleProps = { type: "h2" } as const;

export default function DevMenu(props: DevMenuProps): React.ReactNode {
  const [purgeStatus, setPurgeStatus] = React.useState<string | null>(null);
  const { navigate } = useRouter();

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
      {...props}
    >
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
      <FieldSet title="Haptics" collapsible initialCollapsed>
        <Button
          title="Selection"
          onPress={() => {
            Haptics.selectionAsync();
          }}
          variant="outline"
        />
        <Button
          title="Success"
          onPress={() =>
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          }
        />
        <Button
          title="Error"
          onPress={() =>
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
          }
        />
        <Button
          title="Warning"
          onPress={() =>
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
          }
        />
        <Button
          title="Light"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
        <Button
          title="Medium"
          onPress={() =>
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          }
        />
        <Button
          title="Heavy"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
        />
        <Button
          title="Rigid"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)}
        />
        <Button
          title="Soft"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)}
        />
      </FieldSet>
      <FieldSet title="Example Deck Links" collapsible initialCollapsed>
        {Object.entries(exampleDecks).map(([id, { name }]) => (
          <Button
            key={id}
            title={name}
            variant="outline"
            onPress={() => {
              navigate(`/deck/${exampleDeckIds(id).deckId}`);
              props.closeDrawer();
            }}
            style={{ marginTop: 10 }}
          />
        ))}
      </FieldSet>
      <Flags />
    </FieldSet>
  );
}
