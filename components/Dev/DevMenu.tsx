import React from "react";
import { StyleSheet } from "react-native";
import Flags from "./DevFlags";
import Button from "@/components/Button";
import { persistor } from "@/store/store";
import AppError from "@/classes/AppError";
import text from "@/constants/text";
import FieldSet from "@/components/FieldSet";

export interface DevMenuProps {
  children?: React.ReactNode;
}

export default function DevMenu(props: DevMenuProps): React.ReactNode {
  const [purgeStatus, setPurgeStatus] = React.useState<string | null>(null);

  const purgeStore = React.useCallback(() => {
    setPurgeStatus("Purging...");

    persistor
      .purge()
      .then(() => {
        setPurgeStatus("Purged");
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

  return (
    <FieldSet
      title={text["settings.dev_mode.title"]}
      collapsible
      initialCollapsed
      titleProps={{ type: "h2" }}
    >
      <Button
        title={`Purge Store${purgeStatus ? ` (${purgeStatus})` : ""}`}
        style={styles.margin}
        onPress={purgeStore}
        variant="outline"
      />
      <Flags />
    </FieldSet>
  );
}

const styles = StyleSheet.create({
  margin: {
    marginBottom: 20,
  },
});
