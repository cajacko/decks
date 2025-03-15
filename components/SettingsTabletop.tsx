import React from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import FieldSet, { FieldSetProps } from "./FieldSet";
import text from "@/constants/text";
import Button from "@/components/Button";
import useDeleteWarning from "@/hooks/useDeleteWarning";
import { selectDeck } from "@/store/slices/decks";
import deckNameWithFallback from "@/utils/deckNameWithFallback";
import { resetTabletopHelper } from "@/store/actionHelpers/tabletop";
import SwitchField from "./SwitchField";
import StackActions from "./StackActions";
import useTabletopHistory from "@/hooks/useTabletopHistory";
import {
  selectTabletopSettings,
  setTabletopSetting,
} from "@/store/slices/tabletop";

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
  const { undo, redo } = useTabletopHistory(tabletopId);
  const deckName = deckNameWithFallback(
    useAppSelector((state) => selectDeck(state, { deckId })?.name),
  );
  const settings = useAppSelector(
    (state) => selectTabletopSettings(state, { tabletopId }) ?? {},
  );

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
        setTabletopSetting({
          tabletopId,
          key: "preferNeatStacks",
          value: value,
        }),
      );
    },
    [dispatch, tabletopId],
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
        <StackActions tabletopId={tabletopId} collapsible initialCollapsed />
        <FieldSet
          title={text["settings.tabletop.all_title"]}
          collapsible
          initialCollapsed
        >
          <Button
            title={text["general.undo"]}
            onPress={undo}
            variant="outline"
            style={{ opacity: undo ? 1 : 0.5 }}
          />
          <Button
            title={text["general.redo"]}
            onPress={redo}
            variant="outline"
            style={{ opacity: redo ? 1 : 0.5 }}
          />
          <Button
            title={text["tabletop.reset.title"]}
            onPress={resetTabletopModal.open}
            variant="outline"
          />
          <SwitchField
            label={text["settings.neat_stack"]}
            value={!!settings.preferNeatStacks}
            onValueChange={onChangeIsNeat}
            FieldProps={{
              subLabel: text["settings.neat_stack.helper"],
            }}
          />
        </FieldSet>
      </FieldSet>
    </>
  );
}
