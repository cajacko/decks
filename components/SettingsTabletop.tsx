import React from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import FieldSet, { FieldSetProps } from "./FieldSet";
import text from "@/constants/text";
import Button from "@/components/Button";
import useDeleteWarning from "@/hooks/useDeleteWarning";
import { selectDeck } from "@/store/slices/decks";
import deckNameWithFallback from "@/utils/deckNameWithFallback";
import { resetTabletopHelper } from "@/store/actionHelpers/tabletop";
import { setUserFlag } from "@/store/slices/userSettings";
import SwitchField from "./SwitchField";
import useFlag from "@/hooks/useFlag";

const titleProps = { type: "h2" } as const;

export interface SettingsTabletopProps extends FieldSetProps {
  deckId: string;
  tabletopId: string;
  closeDrawer: () => void;
}

export default function SettingsTabletop({
  deckId,
  tabletopId,
  ...props
}: SettingsTabletopProps): React.ReactNode {
  const dispatch = useAppDispatch();
  const deckName = deckNameWithFallback(
    useAppSelector((state) => selectDeck(state, { deckId })?.name),
  );
  const isNeatStack = useFlag("STACK_OFFSET_BEHAVIOUR") === "neat";

  const resetTabletop = React.useCallback(() => {
    dispatch(resetTabletopHelper({ tabletopId }));
  }, [tabletopId, dispatch]);

  const resetTabletopModal = useDeleteWarning({
    handleDelete: resetTabletop,
    title: text["tabletop.reset.title"],
    message: text["tabletop.reset.message"],
    deleteButtonText: text["tabletop.reset.button"],
  });

  const onChangeIsNeat = React.useCallback(
    (value: boolean) => {
      dispatch(
        setUserFlag({
          key: "STACK_OFFSET_BEHAVIOUR",
          value: value ? "neat" : "messy",
        }),
      );
    },
    [dispatch],
  );

  return (
    <>
      {resetTabletopModal.component}
      <FieldSet
        title={text["settings.tabletop.title"]}
        titleProps={titleProps}
        subTitle={`(${deckName})`}
        {...props}
      >
        <Button
          title={text["tabletop.reset.title"]}
          onPress={resetTabletopModal.open}
          variant="outline"
        />
        <SwitchField
          label={text["settings.neat_stack"]}
          value={isNeatStack}
          onValueChange={onChangeIsNeat}
          FieldProps={{
            subLabel: text["settings.neat_stack.helper"],
          }}
        />
      </FieldSet>
    </>
  );
}
