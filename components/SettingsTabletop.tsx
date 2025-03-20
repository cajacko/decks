import React from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import FieldSet, { FieldSetProps } from "./FieldSet";
import text from "@/constants/text";
import Button from "@/components/Button";
import useDeleteWarning from "@/hooks/useDeleteWarning";
import { selectCanEditDeck, selectDeck } from "@/store/slices/decks";
import deckNameWithFallback from "@/utils/deckNameWithFallback";
import {
  resetTabletopHelper,
  addMissingTabletopCardsHelper,
} from "@/store/actionHelpers/tabletop";
import SwitchField from "./SwitchField";
import StackActions from "./StackActions";
import useTabletopHistory from "@/hooks/useTabletopHistory";
import { setTabletopSetting } from "@/store/slices/tabletop";
import { selectTabletopSettings } from "@/store/combinedSelectors/tabletops";

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
  const canEdit = useAppSelector((state) =>
    selectCanEditDeck(state, { deckId }),
  );
  const { undo, redo } = useTabletopHistory(tabletopId);
  const deckName = deckNameWithFallback(
    useAppSelector((state) => selectDeck(state, { deckId })?.name),
  );
  const settings =
    useAppSelector((state) => selectTabletopSettings(state, { tabletopId })) ??
    {};

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

  const onChangeDefaultFaceUp = React.useCallback(
    (value: boolean) => {
      dispatch(
        setTabletopSetting({
          tabletopId,
          key: "defaultCardSide",
          value: value ? "front" : "back",
        }),
      );
    },
    [dispatch, tabletopId],
  );

  const onChangeNewCardsOnTop = React.useCallback(
    (value: boolean) => {
      dispatch(
        setTabletopSetting({
          tabletopId,
          key: "newCardsGoToTopOfStack",
          value: value,
        }),
      );
    },
    [dispatch, tabletopId],
  );

  const onChangeDoNotAddNewCardsAutomatically = React.useCallback(
    (value: boolean) => {
      dispatch(
        setTabletopSetting({
          tabletopId,
          key: "doNotAddNewCardsAutomatically",
          value: value,
        }),
      );

      // We're indicating that we want to auto add new cards, so do a check now
      if (value === false) {
        dispatch(addMissingTabletopCardsHelper({ tabletopId }));
      }
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
            vibrate
          />
          <Button
            title={text["general.redo"]}
            onPress={redo}
            variant="outline"
            style={{ opacity: redo ? 1 : 0.5 }}
            vibrate
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
          {/* Some settings don't make sense if it's a prebuilt deck, specifically things that 
          affect how the tabletop resets */}
          {canEdit && (
            <>
              <SwitchField
                label={text["settings.default_face_up_cards"]}
                value={settings.defaultCardSide !== "back"}
                onValueChange={onChangeDefaultFaceUp}
                FieldProps={{
                  subLabel: text["settings.default_face_up_cards.helper"],
                }}
              />
              <SwitchField
                label={text["settings.new_cards_join_top"]}
                value={settings.newCardsGoToTopOfStack === true}
                onValueChange={onChangeNewCardsOnTop}
                FieldProps={{
                  subLabel: text["settings.new_cards_join_top.helper"],
                }}
              />
            </>
          )}
          <SwitchField
            label={text["settings.do_not_add_new_cards"]}
            value={!!settings.doNotAddNewCardsAutomatically}
            onValueChange={onChangeDoNotAddNewCardsAutomatically}
            FieldProps={{
              subLabel: text["settings.do_not_add_new_cards.helper"],
            }}
          />
        </FieldSet>
      </FieldSet>
    </>
  );
}
