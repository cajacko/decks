import React from "react";
import { StyleSheet, View } from "react-native";
import Flags from "./DevFlags";
import Button from "@/components/Button";
import { persistor } from "@/store/store";
import AppError from "@/classes/AppError";

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
    <View>
      <Button
        title={`Purge Store${purgeStatus ? ` (${purgeStatus})` : ""}`}
        style={styles.action}
        onPress={purgeStore}
      />
      <Flags />
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    marginBottom: 20,
  },
});
