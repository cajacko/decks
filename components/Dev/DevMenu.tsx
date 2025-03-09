import React from "react";
import Flags from "./DevFlags";
import Button from "@/components/Button";
import { persistor } from "@/store/store";
import AppError from "@/classes/AppError";
import text from "@/constants/text";
import FieldSet, { FieldSetProps } from "@/components/FieldSet";

export type DevMenuProps = FieldSetProps;

const titleProps = { type: "h2" } as const;

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
      titleProps={titleProps}
      {...props}
    >
      <Button
        title={`Purge Store${purgeStatus ? ` (${purgeStatus})` : ""}`}
        onPress={purgeStore}
        variant="outline"
      />
      <Flags />
    </FieldSet>
  );
}
